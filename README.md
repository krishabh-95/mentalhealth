# mentalhealth

Expo Go is a great way to implement cross platform apps. However, when you need native features some code changes are required.

Add to this that Apple Health is only available for iOS. So the code to obtain information from Apple Health will only work on iOS.

As the app had been compiled to support native features some extra code was needed for notifications to work as well.

# Custom Info.plist

To support features in the native app it was necessary to add this code to ios/heartrateapp/Info.plist

    <key>NSHealthShareUsageDescription</key>
    <string>Allow $(PRODUCT_NAME) to check health info</string>
    <key>NSHealthUpdateUsageDescription</key>
    <string>Allow $(PRODUCT_NAME) to update health info</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Photo Library Access Warning</string>
    <key>UIBackgroundModes</key>
    <array>
      <string>remote-notification</string>
    </array>
    
# Changes to js files

A file registerForPushNotification.js was added to request approval for Notifications.

To request approval for obtaining the HeartRate this code was added to HomePage.js

const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_ACTIVITY_WRITE,
      Scopes.FITNESS_HEART_RATE_READ,
      Scopes.FITNESS_HEART_RATE_WRITE,
      Scopes.FITNESS_BODY_READ,
      Scopes.FITNESS_BODY_WRITE,
      Scopes.FITNESS_BLOOD_PRESSURE_READ,
      Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
      Scopes.FITNESS_BLOOD_GLUCOSE_READ,
      Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
      Scopes.FITNESS_NUTRITION_WRITE,
      Scopes.FITNESS_SLEEP_READ,
    ],
    permissions : {
      read:
      [
        AppleHealthKit.Constants.Permissions.HeartRate,
      ],
      write:
      [
        AppleHealthKit.Constants.Permissions.HeartRate,
      ],
    },
  };

  AppleHealthKit.initHealthKit(options, (err) => {
    if(err){
      console.error('Error initializing Apple HealthKit: ',err)
    }
    // We can now access data from Apple Health with the permissions
  })

# Testing the native app

Matthew purchased a paid Apple Developer Account.

This enabled him to compile the native app to run on iPhones for testing.

Devices running iOS 16 need to be connected to a Mac running XCode and placed into Developer Mode (see https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device)

There are two versions of the app, one is a preview build that functions similarly to a production app except only for up to 100 devices registered on a provisioning profile prior to it being built. The other is a custom Expo Go app useful for debugging issues during development with code changes on the fly. The custom Expo Go app has to be recompiled every time there are changes to the native code.

The development and preview builds are also available for the iOS Simulator that runs on Macs. However push notifications don't work in the simulator so that feature needs to be tested on real devices.

# CLI tools

The eas-cli is used to compile the app, but before doing that it's advisable to check that needed packages are installed

expo update
expo doctor --fix-dependencies

Various profiles are specified in the eas.json file

eas device:create

will reveal a URL that can be opened on iOS devices. These devices can then install a profile which uploads there UDID and then automatically removes itself. This UDID can then be used in future builds to authorise the device to be one of the 100 testers for native development and preview builds.

eas build --profile development --platform ios --local 

Will locally build a development app (.ipa) for the iphone using my expo account and expo login credentials

eas build --profile preview --platform ios --local 

Will locally build a development app (.ipa) for the iphone using my expo account and expo login credentials

eas build --profile preview-simulator --platform ios --local 

Will locally build a preview app for the iOS simulator

# Further changes

An app icon has been added to the native app within XCode to make a small change to improve the GUI.
