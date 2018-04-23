#! /usr/bin/bash

if [$1 == '']
  then
    echo "Must include an output name for the apk"
    exit
else
  apkname=$1
fi

javawinpath=$(cygpath --unix $JAVA_HOME)
androidwinpath=$(cygpath --unix $ANDROID_HOME)

javapath=$(sed ':a;N;$!ba;s/\n/ /g' <<< $javawinpath)
androidpath=$(sed ':a;N;$!ba;s/\n/ /g' <<< $androidwinpath)

cd "$javapath/bin"
pwd

./jarsigner.exe -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /d/Documents/Git/my-release-key.jks /d/Documents/Git/app-release-unsigned.apk my-alias

cd "$androidpath/build-tools/27.0.3"

./zipalign.exe -v 4 /d/Documents/Git/app-release-unsigned.apk /d/Documents/Git/$apkname
