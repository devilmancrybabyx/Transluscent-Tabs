<div align="center">

# ✨ TranslucentTabs Studio

**The Modern Windows Explorer Blur, Acrylic & Mica Studio**

[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%20Windows%2011-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/devilmancrybabyx/Transluscent-Tabs)
[![Release](https://img.shields.io/badge/Release-v1.0.0%20Standalone%20EXE-6366F1?style=for-the-badge&logo=github&logoColor=white)](https://github.com/devilmancrybabyx/Transluscent-Tabs/releases/tag/v1.0.0)
[![License](https://img.shields.io/badge/License-LGPL--3.0-10B981?style=for-the-badge)](https://github.com/Maplespe/ExplorerBlurMica)
[![UI/UX](https://img.shields.io/badge/Design-Fluent%20Glassmorphism-8B5CF6?style=for-the-badge)](https://github.com/devilmancrybabyx/Transluscent-Tabs)

<p align="center">
  A sleek, modern Fluent UI controller designed to inject hardware-accelerated <b>Blur</b>, <b>Acrylic</b>, and <b>Mica</b> transparency into Windows File Explorer tabs, window surfaces, and toolbars — with instantaneous <b>Do (Apply)</b> and <b>Undo (Revert)</b> actions.
</p>

[**Download Release (.exe)**](https://github.com/devilmancrybabyx/Transluscent-Tabs/releases/tag/v1.0.0) • [**Quick Start**](#-quick-start) • [**Effect Styles**](#-supported-effects) • [**Customization**](#-fine-tuning--rgba-studio) • [**Author Links**](#-connect--author)

---

</div>

## 📸 Interface Preview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  ✨ TranslucentTabs Studio                 [● Active & Blurring]  [🛡️ Admin]  [🌙/☀️] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ⚡ FILE EXPLORER TRANSPARENCY CONTROL                                                  │
│  Inject hardware-accelerated Acrylic blur, Mica, or clear glass transparency.          │
│                                                                                        │
│  [ ✨ Apply Blur Effect ]       [ ↺ Undo / Remove Effect ]       [ ⟳ Restart Explorer ] │
│  (Register & Restart)           (Restore Default Stock Look)                           │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│  🎨 BACKDROP EFFECT STYLE                 │  🎛️ RGBA COLOR BLEND & OPACITY             │
│  ○ Blur          (Classic Gaussian)       │  [ Dark Mode ]  [ Light Mode ]             │
│  ○ Acrylic       (Frosted Fluent Texture) │  ┌──────────────────────────────────────┐  │
│  ● Mica          (Win 11 Signature Tint)  │  │ [●●●] Explorer (Dark Mode)           │  │
│  ○ Blur (Clear)  (Crystal Glass)          │  │ █ Sidebar  |  ██████ File Preview   │  │
│  ○ MicaAlt       (Deep Contrast Accent)   │  └──────────────────────────────────────┘  │
│                                           │  Red (R)   : [───●──────────] 0            │
│  ⚙️ INTERFACE TWEAKS                      │  Green (G) : [───●──────────] 0            │
│  [✓] Transparent Address Bar              │  Blue (B)  : [───●──────────] 0            │
│  [✓] Transparent Navigation & Scrollbars  │  Alpha (A) : [────────●─────] 120 (47%)    │
│  [✓] Clean WinUI / XAML Toolbar (Win 11)  │                                            │
│  [✓] Hide TreeView Splitter Line          │                                            │
├───────────────────────────────────────────┴────────────────────────────────────────────┤
│  🔗 Connect & Developer Links:        [ GitHub ]           [ Website ]                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

* **Instant "Do" (Apply Blur Effect)**:
  Applies the configured effect, registers the x64 COM Shell Extension DLL (`ExplorerBlurMica.dll`), and restarts File Explorer automatically.
* **Instant "Undo" (Revert to Stock Look)**:
  Cleanly unregisters the DLL from Windows COM registry and restarts File Explorer back to stock Microsoft Windows defaults with zero leftover hooks.
* **Curated Effect Types**:
  Switch on-the-fly between classic **Blur**, Fluent **Acrylic**, Windows 11 **Mica**, high-transparency **Blur Clear**, and **MicaAlt**.
* **Real-Time RGBA & Opacity Studio**:
  Independent color tint and alpha transparency channels for both **Dark Mode** and **Light Mode**, paired with an interactive simulated File Explorer window preview.
* **Windows 11 Modern WinUI 3 Support**:
  Includes dedicated toggles to strip solid backgrounds from the modern 23H2 / 24H2 WinUI / XAML toolbars (`clearWinUIBg`), address bar (`clearAddress`), and scrollbars (`clearBarBg`).
* **Standalone Executable & Portable**:
  No Python installation needed when using the packaged `TranslucentTabs.exe`!
* **Quick Access Links**:
  Integrated buttons directly link to the developer's **GitHub Profile** and personal **Website** ([AZOUZ ZOHIR](https://zohir-azouz.vercel.app/)).

---

## 📥 Downloads & Installation

### Option 1: Standalone Executable (Recommended)

1. Head over to the [**Official GitHub Releases (v1.0.0)**](https://github.com/devilmancrybabyx/Transluscent-Tabs/releases/tag/v1.0.0) page.
2. Download **`TranslucentTabs.exe`** (or download the full portable zip archive `TranslucentTabs-v1.0.0-Windows-x64.zip`).
3. Run `TranslucentTabs.exe`. When prompted by Windows UAC for applying or undoing effects, approve administrator rights to register/unregister the COM DLL.

### Option 2: Run from Source

**Prerequisites:** Python 3.10+ on Windows 10 or 11.

```powershell
# 1. Clone the repository
git clone https://github.com/devilmancrybabyx/Transluscent-Tabs.git
cd Transluscent-Tabs

# 2. Run the launcher
.\run.bat

# Or run with administrator privileges directly:
.\run_admin.bat
```

---

## 🎨 Supported Effects

| Effect ID | Effect Name | Description | Best Suited For |
|:---:|:---|:---|:---|
| `0` | **Blur** | Classic Gaussian background blur | Windows 10 & Windows 11 (up to 22H2) |
| `1` | **Acrylic** | Fluent frosted translucent glass with subtle grain texture | Windows 10 & Windows 11 |
| `2` | **Mica** | Windows 11 signature backdrop that samples your desktop wallpaper | Windows 11 (22H2, 23H2, 24H2) |
| `3` | **Blur (Clear)** | High-clarity, crystalline transparent glass | Minimalist setups on Win 10 & 11 |
| `4` | **MicaAlt** | Deeper, higher-contrast variant of the Mica effect | Windows 11 Tabbed Explorer |

---

## 🎛️ Fine-Tuning & RGBA Studio

### Configuration Parameters (`bin/config.ini`)

All adjustments made in the UI are automatically synced to `bin/config.ini`:

```ini
[config]
effect=2
clearAddress=true
clearBarBg=true
clearWinUIBg=true
showLine=true

[light]
r=255
g=255
b=255
a=200

[dark]
r=0
g=0
b=0
a=120
```

### Explanations:
* **`clearAddress=true`**: Eliminates solid backgrounds behind the breadcrumb address and search bar.
* **`clearBarBg=true`**: Transparent background for navigation bars and custom-rendered scrollbars.
* **`clearWinUIBg=true`**: Removes the white or dark solid strip in Windows 11 WinUI toolbars.
* **`showLine=true`**: Hides the dividing line between the folder tree and file list view.
* **`[light]` / `[dark]`**: Custom RGBA tint color values (`r`, `g`, `b`, `a` range from `0` to `255`).

---

## 📁 Repository Structure

```
Transluscent-Tabs/
├── release/                     # Packaged ready-to-run releases
│   ├── TranslucentTabs.exe      # Self-contained standalone executable
│   └── TranslucentTabs-v1.0.0-Windows-x64.zip
├── bin/                         # ExplorerBlurMica x64 core engine
│   ├── ExplorerBlurMica.dll     # COM Shell Extension DLL
│   ├── config.ini               # Engine configuration file
│   ├── register.cmd             # Native registration script
│   └── uninstall.cmd            # Native unregistration script
├── static/                      # Modern Fluent UI
│   ├── index.html               # Semantic glassmorphic layout
│   ├── style.css                # Fluent design tokens & animations
│   └── app.js                   # State manager & slider calculations
├── app.py                       # Python backend server & system controller
├── user_links.json              # Custom GitHub & website profile links
├── run.bat                      # Standard launcher
├── run_admin.bat                # Administrator launcher
└── README.md                    # Project documentation
```

---

## 🧩 Compatibility

* **Windows 11**: 21H2, 22H2, 23H2, 24H2 (including Insider Canary/Dev builds).
* **Windows 10**: 1809, 1903, 1909, 2004, 20H2, 21H1, 21H2, 22H2.
* **Shell Modifiers**: 100% compatible with [StartAllBack](https://www.startallback.com/), OldNewExplorer, and third-party visual themes.

---

## 👤 Connect & Author

* **Personal Website**: [AZOUZ ZOHIR — Systems Architect & Creative Technologist](https://zohir-azouz.vercel.app/)
* **Author GitHub**: [@devilmancrybabyx](https://github.com/devilmancrybabyx)
* **Project Repository**: [Transluscent-Tabs](https://github.com/devilmancrybabyx/Transluscent-Tabs)

---

## 📜 Credits & License

* Transparency Core: [Maplespe/ExplorerBlurMica](https://github.com/Maplespe/ExplorerBlurMica) licensed under **LGPL-3.0**.
* Application UI & Architecture: Designed by **devilmancrybabyx** following modern Fluent Glassmorphism guidelines.
