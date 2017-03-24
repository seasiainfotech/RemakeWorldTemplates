#RemakeWorld Augmented Reality For App

### For Dev

**Install**

* npm install -g ionic

* npm install -g cordova 

* ionic start RemakeWorldARApp --v2 

* delete folders and files from local that are in git

* git init

* git remote add origin <url>

* git pull origin master

* npm install

* install android sdk, adb

* (Android Packages Extra = Android Support Repository, Google Play Services, Google Repository)

* ionic platform add android

* ionic plugin add https://github.com/Wikitude/wikitude-cordova-plugin.git
 
* ionic plugin add cordova-plugin-geolocation

* ionic plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="<KEY>"

* ionic build android

* adb install -r platforms/android/build/outputs/apk/android-debug.apk

### For Test

* path APK = platforms/android/build/outputs/apk please install its to your android

### Run Karma (for unit test)

* npm test