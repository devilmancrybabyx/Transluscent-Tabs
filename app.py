"""
TranslucentTabs Studio - Explorer Blur & Mica Manager
Backend API Server & Desktop Controller
"""

import os
import sys
import json
import time
import ctypes
import shutil
import platform
import subprocess
import webbrowser
import configparser
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
import winreg

if getattr(sys, 'frozen', False):
    EXE_DIR = Path(sys.executable).resolve().parent
    BUNDLE_DIR = Path(getattr(sys, '_MEIPASS', EXE_DIR))
else:
    EXE_DIR = Path(__file__).resolve().parent
    BUNDLE_DIR = EXE_DIR

BASE_DIR = EXE_DIR
BIN_DIR = BASE_DIR / "bin"
CONFIG_FILE = BIN_DIR / "config.ini"
DLL_FILE = BIN_DIR / "ExplorerBlurMica.dll"
LINKS_FILE = BASE_DIR / "user_links.json"

# Safe stdout/stderr for GUI/noconsole mode and ensure UTF-8 encoding
if sys.stdout is None:
    sys.stdout = open(os.devnull, "w")
elif hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

if sys.stderr is None:
    sys.stderr = open(os.devnull, "w")
elif hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Resolve static directory
if (BUNDLE_DIR / "static").exists():
    STATIC_DIR = BUNDLE_DIR / "static"
else:
    STATIC_DIR = BASE_DIR / "static"

# If bin folder does not exist beside exe, unpack from bundle
if not DLL_FILE.exists() and (BUNDLE_DIR / "bin" / "ExplorerBlurMica.dll").exists():
    try:
        BIN_DIR.mkdir(parents=True, exist_ok=True)
        for item in (BUNDLE_DIR / "bin").iterdir():
            target = BIN_DIR / item.name
            if not target.exists():
                if item.is_file():
                    shutil.copy2(item, target)
                elif item.is_dir():
                    shutil.copytree(item, target)
    except Exception as e:
        print(f"Error extracting bundled bin: {e}")

CLSID_KEY = r"CLSID\{887D3A6A-502E-4AF5-9CE6-D515E12AFE89}"
FOLDER_EXT_KEY = r"SOFTWARE\Classes\Drive\shellex\FolderExtensions\{887D3A6A-502E-4AF5-9CE6-D515E12AFE89}"

def is_admin():
    """Check if current process has Windows Administrator privileges."""
    try:
        return ctypes.windll.shell32.IsUserAnAdmin() != 0
    except Exception:
        return False

def get_registered_dll_path():
    """Retrieve the registered DLL path from Windows Registry if active."""
    # Check HKCR
    try:
        with winreg.OpenKey(winreg.HKEY_CLASSES_ROOT, rf"{CLSID_KEY}\InprocServer32") as key:
            val, _ = winreg.QueryValueEx(key, "")
            return val
    except OSError:
        pass

    # Check HKLM
    try:
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, rf"SOFTWARE\Classes\{CLSID_KEY}\InprocServer32") as key:
            val, _ = winreg.QueryValueEx(key, "")
            return val
    except OSError:
        pass

    return None

def is_blur_registered():
    """Check if ExplorerBlurMica is registered in COM."""
    path = get_registered_dll_path()
    if path:
        return True

    # Also check Drive FolderExtensions
    try:
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, FOLDER_EXT_KEY):
            return True
    except OSError:
        pass

    try:
        with winreg.OpenKey(winreg.HKEY_CLASSES_ROOT, rf"Drive\shellex\FolderExtensions\{{887D3A6A-502E-4AF5-9CE6-D515E12AFE89}}"):
            return True
    except OSError:
        pass

    return False

def is_explorer_running():
    """Check if explorer.exe process is currently running."""
    try:
        output = subprocess.check_output(
            ["tasklist", "/FI", "IMAGENAME eq explorer.exe", "/NH"],
            text=True,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
        )
        return "explorer.exe" in output.lower()
    except Exception:
        return False

def restart_explorer():
    """Terminate and restart Windows Explorer."""
    try:
        subprocess.run(
            ["taskkill", "/F", "/IM", "explorer.exe"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
        )
    except Exception:
        pass

    time.sleep(0.8)

    try:
        # Start explorer as normal user shell
        subprocess.Popen(
            ["explorer.exe"],
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
        )
        return True
    except Exception as e:
        print(f"Error starting explorer.exe: {e}")
        return False

def run_elevated_command(command, args):
    """Run an executable with UAC elevation using ShellExecuteW."""
    try:
        # 0 = SW_HIDE, 1 = SW_SHOWNORMAL
        ret = ctypes.windll.shell32.ShellExecuteW(
            None,
            "runas",
            command,
            args,
            str(BIN_DIR),
            1
        )
        # ShellExecute returns > 32 on success
        return ret > 32
    except Exception as e:
        print(f"ShellExecute elevation failed: {e}")
        return False

def register_dll(dll_path=None):
    """Register the ExplorerBlurMica DLL using regsvr32."""
    target_dll = dll_path or str(DLL_FILE)
    if not os.path.exists(target_dll):
        return False, f"DLL not found at: {target_dll}"

    if is_admin():
        try:
            res = subprocess.run(
                ["regsvr32.exe", "/s", target_dll],
                capture_output=True,
                text=True,
                creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
            )
            return (res.returncode == 0), "Registered successfully"
        except Exception as e:
            return False, str(e)
    else:
        # Elevate via PowerShell to wait for completion
        ps_cmd = f'Start-Process regsvr32.exe -ArgumentList \'/s "{target_dll}"\' -Verb RunAs -Wait'
        try:
            res = subprocess.run(
                ["powershell", "-NoProfile", "-Command", ps_cmd],
                capture_output=True,
                creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
            )
            return (res.returncode == 0), "UAC Registration requested"
        except Exception as e:
            return False, str(e)

def unregister_dll(dll_path=None):
    """Unregister the ExplorerBlurMica DLL using regsvr32 /u."""
    target_dll = dll_path or str(DLL_FILE)
    if not os.path.exists(target_dll):
        registered = get_registered_dll_path()
        if registered and os.path.exists(registered):
            target_dll = registered
        else:
            return False, "Target DLL for unregistration could not be found"

    if is_admin():
        try:
            res = subprocess.run(
                ["regsvr32.exe", "/u", "/s", target_dll],
                capture_output=True,
                text=True,
                creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
            )
            return (res.returncode == 0), "Unregistered successfully"
        except Exception as e:
            return False, str(e)
    else:
        ps_cmd = f'Start-Process regsvr32.exe -ArgumentList \'/u /s "{target_dll}"\' -Verb RunAs -Wait'
        try:
            res = subprocess.run(
                ["powershell", "-NoProfile", "-Command", ps_cmd],
                capture_output=True,
                creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
            )
            return (res.returncode == 0), "UAC Unregistration requested"
        except Exception as e:
            return False, str(e)

def read_config():
    """Read and parse bin/config.ini into structured dict."""
    config = configparser.RawConfigParser()
    config.optionxform = str  # Preserve case: clearAddress, etc.
    
    defaults = {
        "config": {
            "effect": "2",
            "clearAddress": "true",
            "clearBarBg": "true",
            "clearWinUIBg": "true",
            "showLine": "true"
        },
        "light": {
            "r": "255",
            "g": "255",
            "b": "255",
            "a": "200"
        },
        "dark": {
            "r": "0",
            "g": "0",
            "b": "0",
            "a": "120"
        }
    }

    if CONFIG_FILE.exists():
        try:
            config.read(str(CONFIG_FILE), encoding="utf-8")
        except Exception:
            try:
                config.read(str(CONFIG_FILE), encoding="latin-1")
            except Exception:
                pass

    result = {}
    for section, sec_data in defaults.items():
        result[section] = {}
        for k, v in sec_data.items():
            if config.has_section(section) and config.has_option(section, k):
                result[section][k] = config.get(section, k)
            else:
                result[section][k] = v

    return result

def save_config(data):
    """Write structured dict into bin/config.ini."""
    config = configparser.RawConfigParser()
    config.optionxform = str

    for section, values in data.items():
        config.add_section(section)
        for k, v in values.items():
            config.set(section, k, str(v))

    BIN_DIR.mkdir(parents=True, exist_ok=True)
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        config.write(f)
    return True

def get_user_links():
    """Read user GitHub and Website configuration."""
    defaults = {
        "github_url": "https://github.com",
        "github_label": "GitHub Profile",
        "website_url": "https://mywebsite.com",
        "website_label": "My Website",
        "repo_url": "https://github.com/Maplespe/ExplorerBlurMica"
    }
    if LINKS_FILE.exists():
        try:
            with open(LINKS_FILE, "r", encoding="utf-8") as f:
                user_data = json.load(f)
                defaults.update(user_data)
        except Exception:
            pass
    return defaults

def save_user_links(data):
    """Save user custom links."""
    current = get_user_links()
    current.update(data)
    with open(LINKS_FILE, "w", encoding="utf-8") as f:
        json.dump(current, f, indent=2)
    return current


class AppRequestHandler(SimpleHTTPRequestHandler):
    """Custom HTTP handler serving static UI and JSON APIs."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def end_headers(self):
        # Prevent caching for live responsive API and asset debugging
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        url = self.path.split("?")[0]

        if url == "/api/status":
            reg_path = get_registered_dll_path()
            status = {
                "is_registered": is_blur_registered(),
                "registered_path": reg_path,
                "is_admin": is_admin(),
                "bin_dll_exists": DLL_FILE.exists(),
                "bin_dll_path": str(DLL_FILE),
                "is_this_bin_active": (
                    reg_path and os.path.normcase(os.path.realpath(reg_path)) == os.path.normcase(os.path.realpath(str(DLL_FILE)))
                ),
                "os_platform": platform.platform(),
                "os_release": platform.release(),
                "os_version": platform.version(),
                "explorer_running": is_explorer_running()
            }
            self.send_json(200, status)
            return

        elif url == "/api/config":
            cfg = read_config()
            self.send_json(200, cfg)
            return

        elif url == "/api/links":
            links = get_user_links()
            self.send_json(200, links)
            return

        # Serve static files
        if url == "/" or url == "":
            self.path = "/index.html"

        super().do_GET()

    def do_POST(self):
        url = self.path.split("?")[0]
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = {}
        if content_length > 0:
            try:
                body_bytes = self.rfile.read(content_length)
                post_data = json.loads(body_bytes.decode("utf-8"))
            except Exception:
                pass

        if url == "/api/config":
            save_config(post_data)
            self.send_json(200, {"success": True, "config": read_config()})
            return

        elif url == "/api/links":
            updated = save_user_links(post_data)
            self.send_json(200, {"success": True, "links": updated})
            return

        elif url == "/api/apply":
            # If config is sent along with apply, save it first
            if "config" in post_data:
                save_config(post_data["config"])

            success, msg = register_dll()
            if success:
                restart_explorer()
                time.sleep(1.2)

            self.send_json(200, {
                "success": success,
                "message": msg,
                "is_registered": is_blur_registered(),
                "registered_path": get_registered_dll_path()
            })
            return

        elif url == "/api/undo":
            success, msg = unregister_dll()
            if success:
                restart_explorer()
                time.sleep(1.2)

            self.send_json(200, {
                "success": success,
                "message": msg,
                "is_registered": is_blur_registered(),
                "registered_path": get_registered_dll_path()
            })
            return

        elif url == "/api/restart-explorer":
            res = restart_explorer()
            self.send_json(200, {"success": res})
            return

        elif url == "/api/open-url":
            target_url = post_data.get("url", "")
            if target_url.startswith(("http://", "https://")):
                webbrowser.open(target_url)
                self.send_json(200, {"success": True})
            else:
                self.send_json(400, {"success": False, "error": "Invalid URL"})
            return

        self.send_json(404, {"error": "Not Found"})


def launch_edge_app_mode(url, width=1040, height=780):
    """Try to open the UI in Microsoft Edge App Mode for a clean native desktop window."""
    edge_candidates = [
        Path(os.environ.get("PROGRAMFILES(X86)", r"C:\Program Files (x86)")) / r"Microsoft\Edge\Application\msedge.exe",
        Path(os.environ.get("PROGRAMFILES", r"C:\Program Files")) / r"Microsoft\Edge\Application\msedge.exe",
        Path(os.environ.get("LOCALAPPDATA", "")) / r"Microsoft\Edge\Application\msedge.exe"
    ]

    edge_exe = None
    for p in edge_candidates:
        if p.exists():
            edge_exe = str(p)
            break

    if edge_exe:
        app_arg = f"--app={url}"
        size_arg = f"--window-size={width},{height}"
        try:
            subprocess.Popen([edge_exe, app_arg, size_arg])
            return True
        except Exception as e:
            print(f"Edge App Mode launch failed: {e}")

    # Fallback to default browser
    webbrowser.open(url)
    return False


def main():
    import argparse
    parser = argparse.ArgumentParser(description="TranslucentTabs Studio Controller")
    parser.add_argument("--port", type=int, default=52418, help="Server port (default: 52418)")
    parser.add_argument("--no-browser", action="store_true", help="Don't automatically open UI in browser")
    parser.add_argument("--apply", action="store_true", help="CLI: Apply blur effect immediately")
    parser.add_argument("--undo", action="store_true", help="CLI: Undo/remove blur effect immediately")
    parser.add_argument("--status", action="store_true", help="CLI: Print current registration status")
    args = parser.parse_args()

    if args.status:
        reg = is_blur_registered()
        path = get_registered_dll_path()
        admin = is_admin()
        print(f"Registered: {reg}")
        print(f"DLL Path: {path}")
        print(f"Admin: {admin}")
        return

    if args.apply:
        print("Applying ExplorerBlurMica effect...")
        ok, msg = register_dll()
        print(f"Result: {ok} ({msg})")
        if ok:
            print("Restarting Explorer...")
            restart_explorer()
        return

    if args.undo:
        print("Undoing/Removing ExplorerBlurMica effect...")
        ok, msg = unregister_dll()
        print(f"Result: {ok} ({msg})")
        if ok:
            print("Restarting Explorer...")
            restart_explorer()
        return

    # Check that static folder exists
    STATIC_DIR.mkdir(parents=True, exist_ok=True)

    # Start HTTP Server
    port = args.port
    server = None
    for trial_port in range(port, port + 10):
        try:
            server = HTTPServer(("127.0.0.1", trial_port), AppRequestHandler)
            port = trial_port
            break
        except OSError:
            continue

    if not server:
        print(f"Error: Could not bind to any port in range {port}-{port+10}")
        sys.exit(1)

    url = f"http://127.0.0.1:{port}"
    try:
        print("=" * 65)
        print("  [*] TranslucentTabs Studio - Explorer Blur & Mica Manager")
        print(f"  App running at: {url}")
        print(f"  Admin Mode: {'Yes (Full privileges)' if is_admin() else 'No (Will prompt UAC when applying)'}")
        print("=" * 65)
    except Exception:
        pass

    if not args.no_browser:
        launch_edge_app_mode(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down TranslucentTabs Studio.")
        server.server_close()


if __name__ == "__main__":
    main()
