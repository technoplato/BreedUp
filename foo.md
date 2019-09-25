I felt like documenting the process of upgrading React Native so that others could potentially find fixes to issues they run into, or perhaps learn a couple of neat resources.

Below is the video with timestamps and errors that occurred during the process. You can click on an image and it will take you to the time in the video where that error occurred so you can watch me fix the error in real time.

Let me know if anyone runs into any different issues and we can help each debug them!

[YouTube](https://www.youtube.com/c/michaellustig?sub_confirmation=1 )   |   [dev.to](https://dev.to/technoplato)   |   [Twitter](https://twitter.com/technoplato/)   |   [Github](https://github.com/technoplato)   |    [Medium](https://medium.com/@michaellustig)   |   [Reddit](https://www.reddit.com/user/halfjew22)

## Video

[![Upgrading React Native 60.5 --> 61.1](http://img.youtube.com/vi/ggOFxI9fFeY/0.jpg)](https://www.youtube.com/watch?v=ggOFxI9fFeY "Upgrading React Native 60.5 --> 61.1")

### 📋 👓 react-native upgrade results @ [8:56](https://youtu.be/ggOFxI9fFeY?t=536)
[![📋 👓 react-native upgrade results](https://i.imgur.com/ruNeRXP.png
)](https://youtu.be/ggOFxI9fFeY?t=536 "react-native upgrade results")

## Errors During Upgrade (Click to see fix) 

### Fixing Podfile @ [13:34](https://youtu.be/ggOFxI9fFeY?t=814)
[![🔢  ❌  Fixing Podfile](https://i.imgur.com/NQlUgqA.png)](https://youtu.be/ggOFxI9fFeY?t=814
 "Fixing Podfile")

### 🔢  ❌  React Native Version Mismatch @ [26:22](https://youtu.be/ggOFxI9fFeY?t=1582)
[![🔢  ❌  React Native Version Mismatch](https://i.imgur.com/apmpa4g.png)](https://youtu.be/ggOFxI9fFeY?t=1582 "React Native Version Mismatch")

### 👨‍💻 😦 xcodebuild failed @ [30:17](https://youtu.be/ggOFxI9fFeY?t=1817)
[![👨‍💻 😦 xcodebuild failed](https://i.imgur.com/RY4fBBS.png)](https://youtu.be/ggOFxI9fFeY?t=1817 "👨‍💻 😦 xcodebuild failed")

### 📁 ❗ Unable to open file Yoga @ [31:57](https://youtu.be/ggOFxI9fFeY?t=1917)
[![📁 ❗ Unable to open file Yoga](https://i.imgur.com/PuiHtya.png)](https://youtu.be/ggOFxI9fFeY?t=1917 "📁 ❗ Unable to open file Yoga")


---

[React Native Docs on Upgrading](https://facebook.github.io/react-native/docs/upgrading) 

[React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/?from=0.60.5&to=0.61.0)

[React Native 61 Blog Post](https://facebook.github.io/react-native/blog/2019/09/18/version-0.61)

[React Native 61.1 Podfile](https://raw.githubusercontent.com/react-native-community/rn-diff-purge/release/0.61.1/RnDiffApp/ios/Podfile)


---

I’m going to start a series of videos where I try to do things live in code to show all the errors and the thought process that goes into debugging those errors. I will try and be as thorough as possible in explaining why I believe shit has hit the fan. I will leave no stone unturned in getting things to work. 
