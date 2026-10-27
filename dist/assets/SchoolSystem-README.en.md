# Installation guide — GOEGSA School Management System

### Before you begin

- Use a Windows 10 or 11 computer as the school server. Keep it running during school hours, preferably connected to power and the school network.
- The installation itself does not require an administrator account. The optional firewall and sleep settings request administrator approval once.
- Keep a copy of the installer and download it only through the official link on this website.

### 1) Download

Download SchoolSystemSetup.exe using the download button. To check that it matches the published file, compare its SHA-256 hash with the hash in the Download verification section for the same release. Open PowerShell and run:


```
(Get-FileHash "$env:USERPROFILE\Downloads\SchoolSystemSetup.exe" -Algorithm SHA256).Hash
```

### 2) Windows launch notice

Windows may display a notice because the current installer is not signed with an Authenticode certificate. Check the download source, release version and published SHA-256 hash before deciding to run it. A matching hash confirms file consistency; it does not replace a security scan or your school's security policies. Contact support before continuing if you are unsure.

### 3) Installation options

After selecting the installer language, you will see additional tasks. On the server computer that other devices will connect to, select:

- A desktop shortcut, if wanted.
- Start the program automatically when signing in to Windows: recommended for the server.
- Allow the program through Windows Firewall on private networks only: requires administrator approval. Other computers and phones cannot connect without the required firewall access.
- Prevent sleep while connected to power: unchecked by default and recommended for the server; requires administrator approval. Uninstalling restores the original power plan.
These server options are not needed for an individual trial on one computer.

### 4) First launch

- Read the software agreement through the terms link, select the acceptance checkbox and continue.
- On the first-run setup page, create the system administrator account and choose a strong password. Store it securely; it cannot be recovered through this website.
- The program includes a 14-day trial with all features. After purchase, enter the license key on the Licensing page.

### 5) Connect from a phone or another computer

- Connect the device to the same school network, by Wi-Fi or cable.
- At startup, the program displays the server address in the form http://server-address:5000. Open that address in the other device's browser.
- On iPhone, open the parent portal in Safari, then choose Share and Add to Home Screen. On Android, use the portal directly in the browser.
- Mobile notifications require a secure HTTPS address configured by the school; they are not available over the ordinary local HTTP address. On iPhone and iPad, Web Push requires iOS or iPadOS 16.4 or later and a web app added to the Home Screen.

### 6) Backups

- After important work, open Settings, then Backup. Create and download a backup, and keep it on an external drive or USB drive.
- Backups are not encrypted. Store them securely and do not send them through untrusted channels.
- Installation-specific encryption keys are deliberately excluded from backups. When restoring on a new computer, you may need to re-enter some external service keys, such as WhatsApp or payment service keys.

### 7) Updates

Open Check for updates in the dashboard. If a newer version is available, the program downloads it after your approval and checks the update signature and hash before installation. Create a backup before every update.

### 8) Uninstall

Use Windows Settings, then Apps. Create a backup first, because uninstalling may remove the program's local data.

### 9) Help

Use the support channels listed on this website. Include the program version from About and a description of the issue. Do not send passwords or real student data.
