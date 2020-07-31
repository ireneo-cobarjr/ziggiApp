# Ziggi Mobile (ziggi)

Ziggi Mobile App

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
npm run dev
```

### Lint the files
```bash
npm run lint -- --fix
```

### Build the app (Android)
```bash
npm run build
```
### Convenience scripts
The files __create-key__ and __sign-android__ are created for convenience on building android apps. If you want to use them, nake sure they are executale. 
```bash
chmod +x create-key sign-android
```
This are bash scripts. If your on Windows, you need to install git-bash or [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

#### create-key
Use this script to create a signing-key. It will detect if a signing-key had already been made previously. The signing-key is in the signing-key folder. To use this, just run:
```bash
./create-key
```
#### sign-android
Use this script to sign the unsigned built android app. This will also zip-align the app. Just run:
```bash
./sign-android
```
This will create a signed android app. By default the name of the app will be ziggiapp.apk but if you need to make it into a different name, jusr run:
```bash
./sign-android app_name
```
Where `app_name` could be any valid name of the apk file.

#### Complete build for android using convenience scripts
A `build-complete` script is defined on package.json. This script uses the convenience scripts mentioned.
To use this, just run:
```bash
npm run build-complete
```
If you want the app be built on a different name, run:
```bash
NAME=APPNAME npm run build-complete
```
Where `APPNAME` is any valid name for the apk file.


### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
