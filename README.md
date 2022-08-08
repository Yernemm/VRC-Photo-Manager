# VRC Photo Manager
 
A program which will embed world metadata into your vrchat photos and let you edit them and upload to Discord.

Still a work-in-progress project. Many core features are not ready yet.

------

### Instructions:

- [Download the latest release here](https://github.com/Yernemm/VRC-Photo-Manager/releases)
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

### To-do:
- Embed world info into photo meta-data
- Photo browser
- Uploader for older photos
- Multiple webhook support
- Rotate photos
- More secure login storage (tokens?)
