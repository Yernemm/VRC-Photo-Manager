# VRC Photo Manager
 
A program which will embed world metadata into your vrchat photos and let you edit them and upload to Discord.

Still a work-in-progress project. Many core features are not ready yet.

------

### Installing:

#### Windows

- [Download the setup exe from the latest release here](https://github.com/Yernemm/VRC-Photo-Manager/releases)
- Run the installer.

#### Linux

- [Download the `.AppImage` from the latest release here](https://github.com/Yernemm/VRC-Photo-Manager/releases)
- Make it executable and run it:

  ```sh
  chmod +x VRChat-Photo-Manager-*-x64.AppImage
  ./VRChat-Photo-Manager-*-x64.AppImage
  ```
- Alternatively, install it with an AppImage manager, like Shelly.

### Updating:

Both the Windows and Linux versions have an auto-updater which runs on startup and runs the new version after a restart.

The Windows version reinstalls the new version, the Linux updater replaces the AppImage.


------

### Usage Instructions:

- Open the program
- Enter your VRChat username and password, and a webhook link to a Discord channel
- Click the login button
- Look for any errors. If there are errors, restart and try again with correct information.
- Optionally, click "Save Details", this will save the data to a config file and load it every time the program starts.
- If you saved incorrect details, click "Open Config Folder" and delete the config file.

------

### Currently working features:
- Detects new photos
- Automatically uploads them to Discord via webhooks
- Discord upload contains world information and time taken
- Uses VRCX photo metadata if present

### To-do:
- ~~Embed world info into photo meta-data~~
- Photo browser
- Uploader for older photos
- Multiple webhook support
- Rotate photos
- More secure login storage (tokens?)

------

### Building:

The program is made with [Electron Forge](https://www.electronforge.io/).

#### Prerequisites

- [Node.js](https://nodejs.org/) and npm. 

#### Setup

Install dependencies:

   ```sh
   npm install
   ```

#### Run in development

```sh
npm start
```

This launches the Electron app directly from source, without packaging it.

#### Build distributables

```sh
npm run package   # unpacked app in out/
npm run make      # installers (Squirrel on Windows, AppImage/.deb/.rpm on Linux, .zip on macOS) in out/make/
```

Building the Linux AppImage needs `mksquashfs` (the `squashfs-tools` package) installed. To build only that target:

```sh
npx electron-forge make --targets @reforged/maker-appimage
```
