# Exact Android Wrapper Source Bundle

This file is a generated exact source bundle. Create each target path and copy the corresponding fenced block verbatim. Do not redesign or paraphrase these files during exact replication.

Generated from the current project on 2026-09-30T22:23:55.583Z.

## File: android/.gradle/8.9/dependencies-accessors/gc.properties

````

````

## File: android/.gradle/8.9/gc.properties

````

````

## File: android/.gradle/buildOutputCleanup/cache.properties

````
#Tue Sep 29 12:22:36 CDT 2026
gradle.version=8.9
````

## File: android/.gradle/vcs-1/gc.properties

````

````

## File: android/README.md

````md
# Study Library Android Wrapper

This is the Android WebView shell for the deployed Study Library web app. The web app remains the product surface; this module owns Android navigation, cookies, downloads, external links, and Play Store packaging.

## Configure the web app URL

The release build defaults to a placeholder HTTPS URL. Pass the deployed URL at build time:

```bash
./gradlew :app:assembleDebug -PLIBRARY_URL=https://your-study-library.example.com
./gradlew :app:bundleRelease -PLIBRARY_URL=https://your-study-library.example.com
```

For an Android emulator pointed at a local server, use the host gateway and explicitly allow cleartext traffic only for a debug build:

```bash
./gradlew :app:assembleDebug -PLIBRARY_URL=http://10.0.2.2:4444 -PALLOW_CLEARTEXT=true
```

Do not put Supabase keys, AI keys, shared passwords, or session secrets in this project.

## Build requirements

- Android Studio with SDK 35 installed.
- JDK 17.
- Gradle 8.9 through the included wrapper.

The app preserves the web session cookie, keeps same-origin navigation inside the WebView, sends external links to the system browser, forwards downloads to Android Download Manager, and handles back navigation inside the reading history.

Before Play Store submission, configure a real release signing key in a private CI or Android Studio signing configuration. Do not commit keystores or passwords.
````

## File: android/app/build.gradle.kts

````kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val configuredLibraryUrl = providers.gradleProperty("LIBRARY_URL").orElse("https://study-library.example.com").get()
val allowCleartext = providers.gradleProperty("ALLOW_CLEARTEXT").orElse("false").get().toBoolean()
val escapedLibraryUrl = configuredLibraryUrl.replace("\\", "\\\\").replace("\"", "\\\"")

android {
    namespace = "com.secondbrain.studylibrary"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.secondbrain.studylibrary"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        manifestPlaceholders["allowCleartext"] = false
        buildConfigField("String", "LIBRARY_URL", "\"$escapedLibraryUrl\"")
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
            manifestPlaceholders["allowCleartext"] = allowCleartext
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
            manifestPlaceholders["allowCleartext"] = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        buildConfig = true
    }
}

dependencies {
    implementation("androidx.activity:activity-ktx:1.10.1")
    implementation("androidx.core:core-ktx:1.15.0")
}
````

## File: android/app/build/generated/source/buildConfig/debug/com/secondbrain/studylibrary/BuildConfig.java

````
/**
 * Automatically generated file. DO NOT MODIFY
 */
package com.secondbrain.studylibrary;

public final class BuildConfig {
  public static final boolean DEBUG = Boolean.parseBoolean("true");
  public static final String APPLICATION_ID = "com.secondbrain.studylibrary.debug";
  public static final String BUILD_TYPE = "debug";
  public static final int VERSION_CODE = 1;
  public static final String VERSION_NAME = "1.0.0-debug";
  // Field from default config.
  public static final String LIBRARY_URL = "https://study-library.example.com";
}
````

## File: android/app/build/intermediates/annotation_processor_list/debug/javaPreCompileDebug/annotationProcessors.json

````json
{}
````

## File: android/app/build/intermediates/app_metadata/debug/writeDebugAppMetadata/app-metadata.properties

````
appMetadataVersion=1.1
androidGradlePluginVersion=8.7.3
````

## File: android/app/build/intermediates/compatible_screen_manifest/debug/createDebugCompatibleScreenManifests/output-metadata.json

````json
{
  "version": 3,
  "artifactType": {
    "type": "COMPATIBLE_SCREEN_MANIFEST",
    "kind": "Directory"
  },
  "applicationId": "com.secondbrain.studylibrary.debug",
  "variantName": "debug",
  "elements": []
}
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/compile-file-map.properties

````
#Tue Sep 29 12:23:39 CDT 2026
com.secondbrain.studylibrary.app-main-24\:/layout/activity_main.xml=/Users/gchikoti/Music/study-library/android/app/build/intermediates/merged_res/debug/mergeDebugResources/layout_activity_main.xml.flat
com.secondbrain.studylibrary.app-main-24\:/drawable/ic_library.xml=/Users/gchikoti/Music/study-library/android/app/build/intermediates/merged_res/debug/mergeDebugResources/drawable_ic_library.xml.flat
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-af/values-af.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Antwoord"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Wys af"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Lui af"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Inkomende oproep"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Oproep aan die gang"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Keur tans \'n inkomende oproep"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-am/values-am.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"መልስ"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ቪዲዮ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"አትቀበል"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"ስልኩን ዝጋ"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"ገቢ ጥሪ"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"እየተካሄደ ያለ ጥሪ"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"ገቢ ጥሪ ማጣራት"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ar/values-ar.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"ردّ"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"فيديو"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"رفض"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"قطع الاتصال"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"مكالمة واردة"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"مكالمة جارية"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"يتم فحص المكالمة الواردة"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-as/values-as.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"উত্তৰ দিয়ক"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ভিডিঅ’"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"প্ৰত্যাখ্যান কৰক"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"কল কাটি দিয়ক"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"অন্তৰ্গামী কল"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"চলি থকা কল"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"এটা অন্তৰ্গামী কলৰ পৰীক্ষা কৰি থকা হৈছে"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"৯৯৯+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-az/values-az.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Cavab verin"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"İmtina edin"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Dəstəyi asın"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Gələn zəng"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Davam edən zəng"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Gələn zəng göstərilir"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-b+sr+Latn/values-b+sr+Latn.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Odgovori"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Odbij"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Prekini vezu"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Dolazni poziv"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Poziv je u toku"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Proverava se dolazni poziv"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-be/values-be.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Адказаць"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Відэа"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Адхіліць"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Завяршыць"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Уваходны выклік"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Бягучы выклік"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Фільтраванне ўваходнага выкліку"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-bg/values-bg.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Отговор"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видеообаждане"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Отхвърляне"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Затваряне"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Входящо обаждане"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Текущо обаждане"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Преглежда се входящо обаждане"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-bn/values-bn.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"উত্তর দিন"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ভিডিও"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"বাতিল করুন"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"কল কেটে দিন"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"ইনকামিং কল"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"চালু থাকা কল"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"ইনকামিং কল স্ক্রিনিং করা হচ্ছে"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"৯৯৯+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-bs/values-bs.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Odgovori"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Odbaci"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Prekini vezu"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Dolazni poziv"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Poziv u toku"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filtriranje dolaznog poziva"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ca/values-ca.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Respon"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Rebutja"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Penja"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Trucada entrant"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Trucada en curs"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"S\'està filtrant una trucada entrant"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-cs/values-cs.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Přijmout"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Odmítnout"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Zavěsit"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Příchozí hovor"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Probíhající hovor"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Prověřování příchozího hovoru"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-da/values-da.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Besvar"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Afvis"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Læg på"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Indgående opkald"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Igangværende opkald"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Et indgående opkald screenes"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-de/values-de.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Annehmen"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Ablehnen"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Auflegen"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Eingehender Anruf"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Aktueller Anruf"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filter für eingehenden Anruf"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-el/values-el.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Απάντηση"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Βίντεο"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Απόρριψη"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Τερματισμός"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Εισερχόμενη κλήση"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Κλήση σε εξέλιξη"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Διαλογή εισερχόμενης κλήσης"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-en-rAU/values-en-rAU.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Answer"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Decline"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Hang up"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Incoming call"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"On-going call"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Screening an incoming call"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-en-rCA/values-en-rCA.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Answer"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Decline"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Hang Up"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Incoming call"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Ongoing call"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Screening an incoming call"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-en-rGB/values-en-rGB.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Answer"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Decline"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Hang up"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Incoming call"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"On-going call"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Screening an incoming call"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-en-rIN/values-en-rIN.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Answer"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Decline"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Hang up"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Incoming call"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"On-going call"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Screening an incoming call"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-en-rXC/values-en-rXC.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‎‎‏‏‎‎‎‎‏‏‏‎‏‏‎‏‏‎‎‏‎‏‏‎‎‎‎‎‏‎‏‎‏‎‏‏‎‎‏‎‎‏‏‏‏‎‎‏‎‏‎‏‎‎‎‎‎‏‎‏‎‎‎Answer‎‏‎‎‏‎"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‏‏‏‏‏‎‏‎‎‎‎‎‏‎‎‏‏‏‎‎‎‏‎‎‎‏‎‏‎‏‎‎‏‏‎‎‏‏‎‎‏‎‎‎‎‏‎‏‎‏‎‎‏‏‎‏‎‎‏‎‎‎‎‎‎Video‎‏‎‎‏‎"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‎‏‎‏‏‎‎‏‏‎‏‎‎‎‏‏‎‎‎‎‏‎‎‏‏‏‎‏‎‎‏‏‎‎‎‎‏‎‎‏‏‎‎‏‏‏‏‏‎‎‏‎‎‏‎‎‎‎‏‎‎‏‎‎Decline‎‏‎‎‏‎"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‎‏‎‎‏‎‎‏‏‏‎‏‎‎‎‎‏‎‎‏‎‏‎‏‏‏‎‏‎‎‏‏‎‎‎‎‎‎‏‏‎‏‏‎‎‏‏‏‏‎‎‎‎‎‎‎‎‎‏‎‏‏‏‎Hang Up‎‏‎‎‏‎"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‏‏‎‏‎‏‎‎‏‏‎‎‎‎‏‎‎‏‎‏‎‎‎‎‏‎‎‎‎‏‎‏‏‎‎‎‏‏‏‎‏‏‎‎‎‏‎‎‎‏‏‎‏‎‎‎‏‎‏‏‎‏‏‏‎Incoming call‎‏‎‎‏‎"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‏‏‏‏‎‏‏‏‏‎‏‎‏‏‎‏‏‏‏‏‏‏‎‏‎‎‎‏‎‏‏‎‎‏‏‏‏‏‎‎‎‎‎‏‎‏‏‏‎‎‎‏‎‏‎‎‏‎‏‏‏‏‏‎‎Ongoing call‎‏‎‎‏‎"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‎‎‎‏‏‎‏‎‎‎‏‏‏‎‎‏‎‎‏‎‏‎‎‎‏‏‎‎‏‎‎‎‏‏‏‎‎‏‎‏‎‏‏‏‏‏‎‏‏‏‏‎‏‎‏‏‏‎‎‎Screening an incoming call‎‏‎‎‏‎"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‏‏‎‏‎‏‏‏‎‎‎‏‏‏‏‎‎‏‎‎‏‏‎‏‎‏‏‎‎‏‎‏‏‎‎‎‏‎‎‎‎‎‎‎‏‎‎‎‎‏‎‏‎‏‎‎‎‎‏‎‎‎‎‎‎999+‎‏‎‎‏‎"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-es-rUS/values-es-rUS.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Responder"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Rechazar"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Colgar"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Llamada entrante"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Llamada en curso"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filtrando una llamada entrante"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-es/values-es.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Responder"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Rechazar"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Colgar"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Llamada entrante"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Llamada en curso"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filtrando una llamada entrante"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-et/values-et.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Vasta"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Keeldu"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Lõpeta kõne"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Sissetulev kõne"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Käimasolev kõne"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Sissetuleva kõne filtreerimine"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-eu/values-eu.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Erantzun"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Bideoa"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Baztertu"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Amaitu deia"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Sarrerako deia"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Deia abian da"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Sarrerako dei bat bistaratzen"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-fa/values-fa.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"پاسخ دادن"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ویدیو"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"رد کردن"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"قطع تماس"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"تماس ورودی"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"تماس درحال انجام"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"درحال غربال کردن تماس ورودی"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-fi/values-fi.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Vastaa"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Hylkää"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Lopeta puhelu"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Saapuva puhelu"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Käynnissä oleva puhelu"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Seulotaan saapuvaa puhelua"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-fr-rCA/values-fr-rCA.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Répondre"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vidéo"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Refuser"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Raccrocher"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Appel entrant"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Appel en cours"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filtrer un appel entrant"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-fr/values-fr.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Répondre"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vidéo"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Refuser"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Raccrocher"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Appel entrant"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Appel en cours"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filtrage d\'un appel entrant"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-gl/values-gl.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Contestar"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Rexeitar"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Colgar"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Chamada entrante"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Chamada en curso"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filtrando chamada entrante"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">">999"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-gu/values-gu.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"જવાબ"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"વીડિયો"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"નકારો"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"સમાપ્ત કરો"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"ઇનકમિંગ કૉલ"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"ચાલુ કૉલ"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"ઇનકમિંગ કૉલનું સ્ક્રીનિંગ થાય છે"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-hi/values-hi.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"जवाब दें"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"वीडियो"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"अस्वीकार करें"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"कॉल काटें"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"आने वाला (इनकमिंग) कॉल"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"पहले से जारी कॉल"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"इनकमिंग कॉल को स्क्रीन किया जा रहा है"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-hr/values-hr.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Odgovori"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Videozapis"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Odbij"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Prekini"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Dolazni poziv"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Poziv u tijeku"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filtriranje dolaznog poziva"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-hu/values-hu.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Fogadás"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Videó"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Elutasítás"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Befejezés"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Bejövő hívás"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Hívás folyamatban"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Bejövő hívás szűrése"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-hy/values-hy.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Պատասխանել"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Տեսազանգ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Մերժել"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Ավարտել"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Մուտքային զանգ"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Ընթացիկ զանգ"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Մուտքային զանգի զտում"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-in/values-in.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Jawab"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Tolak"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Tutup"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Panggilan masuk"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Panggilan sedang berlangsung"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Menyaring panggilan masuk"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-is/values-is.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Svara"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Myndsímtal"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Hafna"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Leggja á"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Símtal berst"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Símtal í gangi"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Síar símtal sem berst"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-it/values-it.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Rispondi"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Rifiuta"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Riaggancia"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Chiamata in arrivo"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Chiamata in corso"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Applicazione filtro a chiamata in arrivo"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-iw/values-iw.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"מענה"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"וידאו"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"דחייה"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"ניתוק"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"שיחה נכנסת"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"שיחה פעילה"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"סינון שיחה נכנסת"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ja/values-ja.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"応答"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ビデオ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"拒否"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"通話終了"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"着信"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"通話中"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"着信をスクリーニング中"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ka/values-ka.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"პასუხი"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ვიდეო"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"უარყოფა"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"გათიშვა"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"შემომავალი ზარი"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"მიმდინარე ზარი"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"შემომავალი ზარების გაცხრილვა"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-kk/values-kk.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Жауап беру"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Бейне"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Қабылдамау"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Тұтқаны қою"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Кіріс қоңырау"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Қоңырау"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Келген қоңырауды сүзу"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-km/values-km.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"ឆ្លើយ"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"វីដេអូ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"បដិសេធ"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"ដាក់​ចុះ"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"ការ​ហៅ​ចូល"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"ការ​ហៅដែលកំពុងដំណើរការ"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"កំពុងពិនិត្យការ​ហៅ​ចូល"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-kn/values-kn.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"ಉತ್ತರಿಸಿ"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ವೀಡಿಯೊ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"ನಿರಾಕರಿಸಿ"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"ಕರೆ ಕೊನೆಗೊಳಿಸಿ"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"ಒಳಬರುವ ಕರೆ"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಕರೆ"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"ಒಳಬರುವ ಕರೆಯನ್ನು ಸ್ಕ್ರೀನ್ ಮಾಡಲಾಗುತ್ತಿದೆ"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ko/values-ko.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"통화"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"동영상"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"거절"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"전화 끊기"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"수신 전화"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"진행 중인 통화"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"수신 전화 검사 중"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ky/values-ky.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Жооп берүү"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видео"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Четке кагуу"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Чалууну бүтүрүү"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Чалып жатат"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Учурдагы чалуу"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Кирүүчү чалууну иргөө"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-lo/values-lo.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"ຮັບສາຍ"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ວິດີໂອ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"ປະຕິເສດ"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"ວາງສາຍ"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"ສາຍໂທເຂົ້າ"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"ສາຍໂທອອກ"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"ກຳລັງກວດສອບສາຍໂທເຂົ້າ"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-lt/values-lt.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Atsakyti"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vaizdo įrašas"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Atmesti"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Baigti pok."</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Gaunamasis skambutis"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Vykstantis skambutis"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Gaunamojo skambučio tikrinimas"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-lv/values-lv.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Atbildēt"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Noraidīt"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Pārtraukt"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Ienākošais zvans"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Pašreizējais zvans"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Ienākošā zvana filtrēšana"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-mk/values-mk.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Одговори"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видео"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Одбиј"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Спушти"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Дојдовен повик"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Тековен повик"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Проверка на дојдовен повик"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ml/values-ml.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"മറുപടി നൽകുക"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"വീഡിയോ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"നിരസിക്കുക"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"കോൾ നിർത്തുക"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"ഇൻകമിംഗ് കോൾ"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"സജീവമായ കോൾ"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"ഇൻകമിംഗ് കോൾ സ്‌ക്രീൻ ചെയ്യുന്നു"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-mn/values-mn.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Хариулах"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видео"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Татгалзах"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Таслах"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Ирсэн дуудлага"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Дуудлага хийгдэж байна"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Ирсэн дуудлагыг харуулж байна"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-mr/values-mr.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"उत्तर द्या"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"व्हिडिओ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"नकार द्या"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"कॉल बंद करा"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"इनकमिंग कॉल"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"सुरू असलेला कॉल"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"इनकमिंग कॉल स्क्रीन करत आहे"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"९९९+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ms/values-ms.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Jawab"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Tolak"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Tamatkan Panggilan"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Panggilan masuk"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Panggilan sedang berlangsung"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Menyaring panggilan masuk"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-my/values-my.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"ဖုန်းကိုင်ရန်"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ဗီဒီယို"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"ငြင်းပယ်ရန်"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"ဖုန်းချရန်"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"အဝင်ခေါ်ဆိုမှု"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"လက်ရှိခေါ်ဆိုမှု"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"အဝင်ခေါ်ဆိုမှုကို စစ်ဆေးနေသည်"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"၉၉၉+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-nb/values-nb.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Svar"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Avvis"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Legg på"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Innkommende anrop"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Pågående samtale"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filtrerer et innkommende anrop"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ne/values-ne.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"जवाफ दिनुहोस्"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"भिडियो"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"काट्नुहोस्"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"फोन राख्नुहोस्"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"आगमन कल"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"भइरहेको कल"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"आगमन कल जाँचिँदै छ"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"९९९+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-nl/values-nl.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Beantwoorden"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Weigeren"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Ophangen"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Inkomend gesprek"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Actief gesprek"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Een inkomend gesprek screenen"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-or/values-or.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"ଉତ୍ତର ଦିଅନ୍ତୁ"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ଭିଡିଓ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"ଅଗ୍ରାହ୍ୟ କର"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"ସମାପ୍ତ କରନ୍ତୁ"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"ଇନକମିଂ କଲ୍"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"ଚାଲିଥିବା କଲ୍"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"ଏକ ଇନକମିଂ କଲକୁ ସ୍କ୍ରିନ୍ କରୁଛି"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-pa/values-pa.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"ਜਵਾਬ ਦਿਓ"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ਵੀਡੀਓ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"ਕਾਲ ਕੱਟੋ"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"ਸਮਾਪਤ ਕਰੋ"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"ਇਨਕਮਿੰਗ ਕਾਲ"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"ਜਾਰੀ ਕਾਲ"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"ਇਨਕਮਿੰਗ ਕਾਲ ਦੀ ਸਕ੍ਰੀਨਿੰਗ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-pl/values-pl.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Odbierz"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Wideo"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Odrzuć"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Rozłącz"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Połączenie przychodzące"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Trwa połączenie"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filtruję połączenie przychodzące"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-pt-rBR/values-pt-rBR.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Atender"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Recusar"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Desligar"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Alguém está ligando"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Chamada em andamento"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filtrando uma ligação recebida"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-pt-rPT/values-pt-rPT.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Atender"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Recusar"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Desligar"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Chamada recebida"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Chamada em curso"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"A filtrar uma chamada recebida…"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-pt/values-pt.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Atender"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Recusar"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Desligar"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Alguém está ligando"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Chamada em andamento"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Filtrando uma ligação recebida"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ro/values-ro.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Răspunde"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Respinge"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Închide"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Apel primit"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Apel în desfășurare"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Se filtrează un apel primit"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ru/values-ru.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Ответить"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видео"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Отклонить"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Завершить"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Входящий вызов"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Текущий вызов"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Фильтрация входящего вызова"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">">999"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-si/values-si.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"පිළිතුරු දෙ."</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"වීඩියෝ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"ප්‍රතික්ෂේප ක"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"විසන්ධි කරන්න"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"එන ඇමතුම"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"කරගෙන යන ඇමතුම"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"එන ඇමතුමක් පරීක්ෂා කරන්න"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-sk/values-sk.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Prijať"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Odmietnuť"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Zložiť"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Prichádzajúci hovor"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Prebiehajúci hovor"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Preveruje sa prichádzajúci hovor"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-sl/values-sl.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Sprejmi"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Zavrni"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Prekini klic"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Dohodni klic"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Aktivni klic"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Preverjanje dohodnega klica"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-sq/values-sq.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Përgjigju"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Refuzo"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Mbyll"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Telefonatë hyrëse"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Telefonatë në vazhdim"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Po filtron një telefonatë hyrëse"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-sr/values-sr.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Одговори"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видео"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Одбиј"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Прекини везу"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Долазни позив"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Позив је у току"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Проверава се долазни позив"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-sv/values-sv.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Svara"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Avvisa"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Lägg på"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Inkommande samtal"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Pågående samtal"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Ett inkommande samtal filtreras"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-sw/values-sw.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Jibu"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Kataa"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Kata simu"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Simu uliyopigiwa"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Simu inayoendelea"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Inachuja simu unayopigiwa"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ta/values-ta.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"பதிலளி"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"வீடியோ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"நிராகரி"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"துண்டி"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"உள்வரும் அழைப்பு"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"செயலில் இருக்கும் அழைப்பு"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"உள்வரும் அழைப்பை மதிப்பாய்வு செய்கிறது"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-te/values-te.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"పికప్ చేయండి"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"వీడియో కాల్"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"కట్ చేయండి"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"ముగించండి"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"ఇన్‌కమింగ్ కాల్"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"కాల్ కొనసాగుతోంది"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"ఇన్‌కమింగ్ కాల్‌ను స్క్రీన్ చేయండి"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-th/values-th.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"รับสาย"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"วิดีโอ"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"ปฏิเสธ"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"วางสาย"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"สายเรียกเข้า"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"สายที่สนทนาอยู่"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"กำลังสกรีนสายเรียกเข้า"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-tl/values-tl.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Sagutin"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Tanggihan"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Ibaba"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Papasok na tawag"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Kasalukuyang tawag"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Nagsi-screen ng papasok na tawag"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-tr/values-tr.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Yanıtla"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Reddet"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Kapat"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Gelen arama"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Devam eden arama"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Gelen arama süzülüyor"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-uk/values-uk.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Відповісти"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Відео"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Відхилити"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Завершити"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Вхідний виклик"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Активний виклик"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Вхідний виклик (Фільтр)"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-ur/values-ur.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"جواب دیں"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"ویڈیو"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"مسترد کریں"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"منقطع کر دیں"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"اِن کمنگ کال"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"جاری کال"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"اِن کمنگ کال کی اسکریننگ"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"+999"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-uz/values-uz.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Javob berish"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Rad etish"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Tugatish"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Kiruvchi chaqiruv"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Joriy chaqiruv"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Kiruvchi chaqiruvni filtrlash"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-v21/values-v21.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="notification_action_color_filter">@color/androidx_core_secondary_text_default_material_light</color>
    <dimen name="notification_content_margin_start">0dp</dimen>
    <dimen name="notification_main_column_padding_top">0dp</dimen>
    <dimen name="notification_media_narrow_margin">12dp</dimen>
    <style name="TextAppearance.Compat.Notification" parent="@android:style/TextAppearance.Material.Notification"/>
    <style name="TextAppearance.Compat.Notification.Info" parent="@android:style/TextAppearance.Material.Notification.Info"/>
    <style name="TextAppearance.Compat.Notification.Time" parent="@android:style/TextAppearance.Material.Notification.Time"/>
    <style name="TextAppearance.Compat.Notification.Title" parent="@android:style/TextAppearance.Material.Notification.Title"/>
    <style name="Widget.Compat.NotificationActionContainer" parent="">
        <item name="android:background">@drawable/notification_action_background</item>
    </style>
    <style name="Widget.Compat.NotificationActionText" parent="">
        <item name="android:textAppearance">?android:attr/textAppearanceButton</item>
        <item name="android:textColor">@color/androidx_core_secondary_text_default_material_light</item>
        <item name="android:textSize">@dimen/notification_action_text_size</item>
    </style>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-vi/values-vi.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Trả lời"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Từ chối"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Kết thúc"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Cuộc gọi đến"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Cuộc gọi đang thực hiện"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Đang sàng lọc cuộc gọi đến"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-zh-rCN/values-zh-rCN.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"接听"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"视频通话"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"拒接"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"挂断"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"来电"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"正在通话"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"正在过滤来电"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-zh-rHK/values-zh-rHK.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"接聽"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"視像"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"拒接"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"掛斷"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"來電"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"通話中"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"正在過濾來電"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-zh-rTW/values-zh-rTW.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"接聽"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"視訊"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"拒接"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"掛斷"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"來電"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"通話中"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"正在過濾來電"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values-zu/values-zu.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string msgid="881409763997275156" name="call_notification_answer_action">"Phendula"</string>
    <string msgid="8793775615905189152" name="call_notification_answer_video_action">"Ividiyo"</string>
    <string msgid="3229508546291798546" name="call_notification_decline_action">"Yenqaba"</string>
    <string msgid="2659457946726154263" name="call_notification_hang_up_action">"Vala Ucingo"</string>
    <string msgid="6107532579223922871" name="call_notification_incoming_text">"Ikholi engenayo"</string>
    <string msgid="8623827134497363134" name="call_notification_ongoing_text">"Ikholi eqhubekayo"</string>
    <string msgid="59049573811482460" name="call_notification_screening_text">"Ukuveza ikholi engenayo"</string>
    <string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merged.dir/values/values.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <attr format="reference" name="nestedScrollViewStyle"/>
    <color name="androidx_core_ripple_material_light">#1f000000</color>
    <color name="androidx_core_secondary_text_default_material_light">#8a000000</color>
    <color name="call_notification_answer_color">#1d873b</color>
    <color name="call_notification_decline_color">#d93025</color>
    <color name="notification_action_color_filter">#ffffffff</color>
    <color name="notification_icon_bg_color">#ff9e9e9e</color>
    <dimen name="compat_button_inset_horizontal_material">4dp</dimen>
    <dimen name="compat_button_inset_vertical_material">6dp</dimen>
    <dimen name="compat_button_padding_horizontal_material">8dp</dimen>
    <dimen name="compat_button_padding_vertical_material">4dp</dimen>
    <dimen name="compat_control_corner_material">2dp</dimen>
    <dimen name="compat_notification_large_icon_max_height">320dp</dimen>
    <dimen name="compat_notification_large_icon_max_width">320dp</dimen>
    <dimen name="notification_action_icon_size">32dp</dimen>
    <dimen name="notification_action_text_size">13sp</dimen>
    <dimen name="notification_big_circle_margin">12dp</dimen>
    <dimen name="notification_content_margin_start">8dp</dimen>
    <dimen name="notification_large_icon_height">64dp</dimen>
    <dimen name="notification_large_icon_width">64dp</dimen>
    <dimen name="notification_main_column_padding_top">10dp</dimen>
    <dimen name="notification_media_narrow_margin">@dimen/notification_content_margin_start</dimen>
    <dimen name="notification_right_icon_size">16dp</dimen>
    <dimen name="notification_right_side_padding_top">4dp</dimen>
    <dimen name="notification_small_icon_background_padding">3dp</dimen>
    <dimen name="notification_small_icon_size_as_large">24dp</dimen>
    <dimen name="notification_subtext_size">13sp</dimen>
    <dimen name="notification_top_pad">10dp</dimen>
    <dimen name="notification_top_pad_large_text">5dp</dimen>
    <drawable name="notification_template_icon_bg">#3333B5E5</drawable>
    <drawable name="notification_template_icon_low_bg">#0cffffff</drawable>
    <item name="accessibility_action_clickable_span" type="id"/>
    <item name="accessibility_custom_action_0" type="id"/>
    <item name="accessibility_custom_action_1" type="id"/>
    <item name="accessibility_custom_action_10" type="id"/>
    <item name="accessibility_custom_action_11" type="id"/>
    <item name="accessibility_custom_action_12" type="id"/>
    <item name="accessibility_custom_action_13" type="id"/>
    <item name="accessibility_custom_action_14" type="id"/>
    <item name="accessibility_custom_action_15" type="id"/>
    <item name="accessibility_custom_action_16" type="id"/>
    <item name="accessibility_custom_action_17" type="id"/>
    <item name="accessibility_custom_action_18" type="id"/>
    <item name="accessibility_custom_action_19" type="id"/>
    <item name="accessibility_custom_action_2" type="id"/>
    <item name="accessibility_custom_action_20" type="id"/>
    <item name="accessibility_custom_action_21" type="id"/>
    <item name="accessibility_custom_action_22" type="id"/>
    <item name="accessibility_custom_action_23" type="id"/>
    <item name="accessibility_custom_action_24" type="id"/>
    <item name="accessibility_custom_action_25" type="id"/>
    <item name="accessibility_custom_action_26" type="id"/>
    <item name="accessibility_custom_action_27" type="id"/>
    <item name="accessibility_custom_action_28" type="id"/>
    <item name="accessibility_custom_action_29" type="id"/>
    <item name="accessibility_custom_action_3" type="id"/>
    <item name="accessibility_custom_action_30" type="id"/>
    <item name="accessibility_custom_action_31" type="id"/>
    <item name="accessibility_custom_action_4" type="id"/>
    <item name="accessibility_custom_action_5" type="id"/>
    <item name="accessibility_custom_action_6" type="id"/>
    <item name="accessibility_custom_action_7" type="id"/>
    <item name="accessibility_custom_action_8" type="id"/>
    <item name="accessibility_custom_action_9" type="id"/>
    <item name="line1" type="id"/>
    <item name="line3" type="id"/>
    <item name="report_drawn" type="id"/>
    <item name="tag_accessibility_actions" type="id"/>
    <item name="tag_accessibility_clickable_spans" type="id"/>
    <item name="tag_accessibility_heading" type="id"/>
    <item name="tag_accessibility_pane_title" type="id"/>
    <item name="tag_on_apply_window_listener" type="id"/>
    <item name="tag_on_receive_content_listener" type="id"/>
    <item name="tag_on_receive_content_mime_types" type="id"/>
    <item name="tag_screen_reader_focusable" type="id"/>
    <item name="tag_state_description" type="id"/>
    <item name="tag_transition_group" type="id"/>
    <item name="tag_unhandled_key_event_manager" type="id"/>
    <item name="tag_unhandled_key_listeners" type="id"/>
    <item name="tag_window_insets_animation_callback" type="id"/>
    <item name="text" type="id"/>
    <item name="text2" type="id"/>
    <item name="title" type="id"/>
    <id name="view_tree_disjoint_parent"/>
    <id name="view_tree_lifecycle_owner"/>
    <id name="view_tree_on_back_pressed_dispatcher_owner"/>
    <id name="view_tree_saved_state_registry_owner"/>
    <id name="view_tree_view_model_store_owner"/>
    <integer name="status_bar_notification_info_maxnum">999</integer>
    <string name="androidx_startup" translatable="false">androidx.startup</string>
    <string name="app_name">Second Brain Study Library</string>
    <string name="call_notification_answer_action">Answer</string>
    <string name="call_notification_answer_video_action">Video</string>
    <string name="call_notification_decline_action">Decline</string>
    <string name="call_notification_hang_up_action">Hang Up</string>
    <string name="call_notification_incoming_text">Incoming call</string>
    <string name="call_notification_ongoing_text">Ongoing call</string>
    <string name="call_notification_screening_text">Screening an incoming call</string>
    <string name="download_description">Study Library download</string>
    <string name="external_link_error">This external link could not be opened.</string>
    <string name="https_required">Release builds require an HTTPS library URL.</string>
    <string name="network_error">The study library could not be reached. Check your connection and try again.</string>
    <string name="reader_restarted">The reader restarted unexpectedly. Try loading the library again.</string>
    <string name="status_bar_notification_info_overflow">999+</string>
    <style name="TextAppearance.Compat.Notification" parent="@android:style/TextAppearance.StatusBar.EventContent"/>
    <style name="TextAppearance.Compat.Notification.Info">
        <item name="android:textSize">12sp</item>
        <item name="android:textColor">?android:attr/textColorSecondary</item>
    </style>
    <style name="TextAppearance.Compat.Notification.Line2" parent="TextAppearance.Compat.Notification.Info"/>
    <style name="TextAppearance.Compat.Notification.Time">
        <item name="android:textSize">12sp</item>
        <item name="android:textColor">?android:attr/textColorSecondary</item>
    </style>
    <style name="TextAppearance.Compat.Notification.Title" parent="@android:style/TextAppearance.StatusBar.EventContent.Title"/>
    <style name="Theme.StudyLibrary" parent="android:style/Theme.Material.Light.NoActionBar">
        <item name="android:fontFamily">sans</item>
        <item name="android:windowActionModeOverlay">true</item>
        <item name="android:colorAccent">#1E6B68</item>
        <item name="android:statusBarColor">#F4F0E7</item>
        <item name="android:navigationBarColor">#F4F0E7</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
    </style>
    <style name="Widget.Compat.NotificationActionContainer" parent=""/>
    <style name="Widget.Compat.NotificationActionText" parent=""/>
    <declare-styleable name="Capability">
        
        <attr format="reference" name="queryPatterns"/>
        
        <attr format="boolean" name="shortcutMatchRequired"/>
    </declare-styleable>
    <declare-styleable name="ColorStateListItem">
        
        <attr name="android:color"/>
        
        <attr format="float" name="alpha"/>
        <attr name="android:alpha"/>
        
        <attr format="float" name="lStar"/>
        <attr name="android:lStar"/>
    </declare-styleable>
    <declare-styleable name="FontFamily">
        
        <attr format="string" name="fontProviderAuthority"/>
        
        <attr format="string" name="fontProviderPackage"/>
        
        <attr format="string" name="fontProviderQuery"/>
        
        <attr format="string" name="fontProviderFallbackQuery"/>
        
        <attr format="reference" name="fontProviderCerts"/>
        
        <attr name="fontProviderFetchStrategy">
            <!-- The blocking font fetch works as follows.
              First, check the local cache, then if the requested font is not cached, request the
              font from the provider and wait until it is finished.  You can change the length of
              the timeout by modifying fontProviderFetchTimeout.  If the timeout happens, the
              default typeface will be used instead. -->
            <enum name="blocking" value="0"/>
            <!-- The async font fetch works as follows.
              First, check the local cache, then if the requested font is not cached, trigger a
              request the font and continue with layout inflation. Once the font fetch succeeds, the
              target text view will be refreshed with the downloaded font data. The
              fontProviderFetchTimeout will be ignored if async loading is specified. -->
            <enum name="async" value="1"/>
        </attr>
        
        <attr format="integer" name="fontProviderFetchTimeout">
            <!-- A special value for the timeout. In this case, the blocking font fetching will not
              timeout and wait until a reply is received from the font provider. -->
            <enum name="forever" value="-1"/>
        </attr>
        
        <attr format="string" name="fontProviderSystemFontFamily"/>
    </declare-styleable>
    <declare-styleable name="FontFamilyFont">
        
        <attr name="fontStyle">
            <enum name="normal" value="0"/>
            <enum name="italic" value="1"/>
        </attr>
        
        <attr format="reference" name="font"/>
        
        <attr format="integer" name="fontWeight"/>
        
        <attr format="string" name="fontVariationSettings"/>
        
        <attr format="integer" name="ttcIndex"/>
        
        <attr name="android:fontStyle"/>
        <attr name="android:font"/>
        <attr name="android:fontWeight"/>
        <attr name="android:fontVariationSettings"/>
        <attr name="android:ttcIndex"/>
    </declare-styleable>
    <declare-styleable name="GradientColor">
        
        <attr name="android:startColor"/>
        
        <attr name="android:centerColor"/>
        
        <attr name="android:endColor"/>
        
        <attr name="android:type"/>

        
        
        <attr name="android:gradientRadius"/>

        
        
        <attr name="android:centerX"/>
        
        <attr name="android:centerY"/>

        
        
        <attr name="android:startX"/>
        
        <attr name="android:startY"/>
        
        <attr name="android:endX"/>
        
        <attr name="android:endY"/>

        
        <attr name="android:tileMode"/>
    </declare-styleable>
    <declare-styleable name="GradientColorItem">
        
        <attr name="android:offset"/>
        
        <attr name="android:color"/>
    </declare-styleable>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/mergeDebugResources/merger.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<merger version="3"><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.annotation:annotation-experimental:1.4.1$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/7ad2e1228cf93c43be30a655159cf03e/transformed/annotation-experimental-1.4.1/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.annotation:annotation-experimental:1.4.1" from-dependency="true" generated-set="androidx.annotation:annotation-experimental:1.4.1$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/7ad2e1228cf93c43be30a655159cf03e/transformed/annotation-experimental-1.4.1/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/7ad2e1228cf93c43be30a655159cf03e/transformed/annotation-experimental-1.4.1/res/values/values.xml" qualifiers=""/></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.arch.core:core-runtime:2.2.0$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/7de4202b32b7b584b96361a782a8aa12/transformed/core-runtime-2.2.0/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.arch.core:core-runtime:2.2.0" from-dependency="true" generated-set="androidx.arch.core:core-runtime:2.2.0$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/7de4202b32b7b584b96361a782a8aa12/transformed/core-runtime-2.2.0/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/7de4202b32b7b584b96361a782a8aa12/transformed/core-runtime-2.2.0/res/values/values.xml" qualifiers=""/></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.tracing:tracing:1.2.0$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/91fe2a2a3554b68c83261e567d1a5015/transformed/tracing-1.2.0/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.tracing:tracing:1.2.0" from-dependency="true" generated-set="androidx.tracing:tracing:1.2.0$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/91fe2a2a3554b68c83261e567d1a5015/transformed/tracing-1.2.0/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/91fe2a2a3554b68c83261e567d1a5015/transformed/tracing-1.2.0/res/values/values.xml" qualifiers=""/></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.startup:startup-runtime:1.1.1$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/310728483b1ffcc4b83ed17145c8c204/transformed/startup-runtime-1.1.1/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.startup:startup-runtime:1.1.1" from-dependency="true" generated-set="androidx.startup:startup-runtime:1.1.1$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/310728483b1ffcc4b83ed17145c8c204/transformed/startup-runtime-1.1.1/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/310728483b1ffcc4b83ed17145c8c204/transformed/startup-runtime-1.1.1/res/values/values.xml" qualifiers=""><string name="androidx_startup" translatable="false">androidx.startup</string></file></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.profileinstaller:profileinstaller:1.4.0$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/19a04c9820552e8deab86a79cc2427e8/transformed/profileinstaller-1.4.0/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.profileinstaller:profileinstaller:1.4.0" from-dependency="true" generated-set="androidx.profileinstaller:profileinstaller:1.4.0$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/19a04c9820552e8deab86a79cc2427e8/transformed/profileinstaller-1.4.0/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/19a04c9820552e8deab86a79cc2427e8/transformed/profileinstaller-1.4.0/res/values/values.xml" qualifiers=""/></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.core:core-viewtree:1.0.0$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/a48e7e82dca0cf42a42eeecf8a2a0e74/transformed/core-viewtree-1.0.0/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.core:core-viewtree:1.0.0" from-dependency="true" generated-set="androidx.core:core-viewtree:1.0.0$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/a48e7e82dca0cf42a42eeecf8a2a0e74/transformed/core-viewtree-1.0.0/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/a48e7e82dca0cf42a42eeecf8a2a0e74/transformed/core-viewtree-1.0.0/res/values/values.xml" qualifiers=""><id name="view_tree_disjoint_parent"/></file></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.core:core-ktx:1.15.0$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/3f37bae318e5fc6846a9ad9da520587e/transformed/core-ktx-1.15.0/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.core:core-ktx:1.15.0" from-dependency="true" generated-set="androidx.core:core-ktx:1.15.0$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/3f37bae318e5fc6846a9ad9da520587e/transformed/core-ktx-1.15.0/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3f37bae318e5fc6846a9ad9da520587e/transformed/core-ktx-1.15.0/res/values/values.xml" qualifiers=""/></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-viewmodel-savedstate:2.6.2$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/04a56cae3c2b4c7f49e206227c7675c6/transformed/lifecycle-viewmodel-savedstate-2.6.2/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-viewmodel-savedstate:2.6.2" from-dependency="true" generated-set="androidx.lifecycle:lifecycle-viewmodel-savedstate:2.6.2$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/04a56cae3c2b4c7f49e206227c7675c6/transformed/lifecycle-viewmodel-savedstate-2.6.2/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/04a56cae3c2b4c7f49e206227c7675c6/transformed/lifecycle-viewmodel-savedstate-2.6.2/res/values/values.xml" qualifiers=""/></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-runtime:2.6.2$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/2b6cda71f2c63e15028aecb216a7e1e3/transformed/lifecycle-runtime-2.6.2/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-runtime:2.6.2" from-dependency="true" generated-set="androidx.lifecycle:lifecycle-runtime:2.6.2$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/2b6cda71f2c63e15028aecb216a7e1e3/transformed/lifecycle-runtime-2.6.2/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/2b6cda71f2c63e15028aecb216a7e1e3/transformed/lifecycle-runtime-2.6.2/res/values/values.xml" qualifiers=""><id name="view_tree_lifecycle_owner"/></file></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-runtime-ktx:2.6.2$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/7db9a3292de151eb7c9d24ab69760d44/transformed/lifecycle-runtime-ktx-2.6.2/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-runtime-ktx:2.6.2" from-dependency="true" generated-set="androidx.lifecycle:lifecycle-runtime-ktx:2.6.2$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/7db9a3292de151eb7c9d24ab69760d44/transformed/lifecycle-runtime-ktx-2.6.2/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/7db9a3292de151eb7c9d24ab69760d44/transformed/lifecycle-runtime-ktx-2.6.2/res/values/values.xml" qualifiers=""/></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-viewmodel:2.6.2$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/1ccb3f3e0d6c941de3653f71b709c6a9/transformed/lifecycle-viewmodel-2.6.2/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-viewmodel:2.6.2" from-dependency="true" generated-set="androidx.lifecycle:lifecycle-viewmodel:2.6.2$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/1ccb3f3e0d6c941de3653f71b709c6a9/transformed/lifecycle-viewmodel-2.6.2/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/1ccb3f3e0d6c941de3653f71b709c6a9/transformed/lifecycle-viewmodel-2.6.2/res/values/values.xml" qualifiers=""><id name="view_tree_view_model_store_owner"/></file></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/c6c97bee31d234e00a41dbd9fe022319/transformed/lifecycle-viewmodel-ktx-2.6.2/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2" from-dependency="true" generated-set="androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/c6c97bee31d234e00a41dbd9fe022319/transformed/lifecycle-viewmodel-ktx-2.6.2/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/c6c97bee31d234e00a41dbd9fe022319/transformed/lifecycle-viewmodel-ktx-2.6.2/res/values/values.xml" qualifiers=""/></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-livedata-core:2.6.2$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/a8be2a2dcf51c51e5d0f4b3603eab6d1/transformed/lifecycle-livedata-core-2.6.2/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.lifecycle:lifecycle-livedata-core:2.6.2" from-dependency="true" generated-set="androidx.lifecycle:lifecycle-livedata-core:2.6.2$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/a8be2a2dcf51c51e5d0f4b3603eab6d1/transformed/lifecycle-livedata-core-2.6.2/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/a8be2a2dcf51c51e5d0f4b3603eab6d1/transformed/lifecycle-livedata-core-2.6.2/res/values/values.xml" qualifiers=""/></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.savedstate:savedstate:1.2.1$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/6f57d445dc2b7b17599cecc7d5b53684/transformed/savedstate-1.2.1/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.savedstate:savedstate:1.2.1" from-dependency="true" generated-set="androidx.savedstate:savedstate:1.2.1$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/6f57d445dc2b7b17599cecc7d5b53684/transformed/savedstate-1.2.1/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/6f57d445dc2b7b17599cecc7d5b53684/transformed/savedstate-1.2.1/res/values/values.xml" qualifiers=""><id name="view_tree_saved_state_registry_owner"/></file></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.savedstate:savedstate-ktx:1.2.1$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/0f567c00e87c6397f4b16ead8f418e39/transformed/savedstate-ktx-1.2.1/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.savedstate:savedstate-ktx:1.2.1" from-dependency="true" generated-set="androidx.savedstate:savedstate-ktx:1.2.1$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/0f567c00e87c6397f4b16ead8f418e39/transformed/savedstate-ktx-1.2.1/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/0f567c00e87c6397f4b16ead8f418e39/transformed/savedstate-ktx-1.2.1/res/values/values.xml" qualifiers=""/></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.core:core:1.15.0$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.core:core:1.15.0" from-dependency="true" generated-set="androidx.core:core:1.15.0$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-v21/values-v21.xml" qualifiers="v21"><color name="notification_action_color_filter">@color/androidx_core_secondary_text_default_material_light</color><dimen name="notification_content_margin_start">0dp</dimen><dimen name="notification_main_column_padding_top">0dp</dimen><dimen name="notification_media_narrow_margin">12dp</dimen><style name="TextAppearance.Compat.Notification" parent="@android:style/TextAppearance.Material.Notification"/><style name="TextAppearance.Compat.Notification.Info" parent="@android:style/TextAppearance.Material.Notification.Info"/><style name="TextAppearance.Compat.Notification.Time" parent="@android:style/TextAppearance.Material.Notification.Time"/><style name="TextAppearance.Compat.Notification.Title" parent="@android:style/TextAppearance.Material.Notification.Title"/><style name="Widget.Compat.NotificationActionContainer" parent="">
        <item name="android:background">@drawable/notification_action_background</item>
    </style><style name="Widget.Compat.NotificationActionText" parent="">
        <item name="android:textAppearance">?android:attr/textAppearanceButton</item>
        <item name="android:textColor">@color/androidx_core_secondary_text_default_material_light</item>
        <item name="android:textSize">@dimen/notification_action_text_size</item>
    </style></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ro/values-ro.xml" qualifiers="ro"><string msgid="881409763997275156" name="call_notification_answer_action">"Răspunde"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Respinge"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Închide"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Apel primit"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Apel în desfășurare"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Se filtrează un apel primit"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-te/values-te.xml" qualifiers="te"><string msgid="881409763997275156" name="call_notification_answer_action">"పికప్ చేయండి"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"వీడియో కాల్"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"కట్ చేయండి"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"ముగించండి"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"ఇన్‌కమింగ్ కాల్"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"కాల్ కొనసాగుతోంది"</string><string msgid="59049573811482460" name="call_notification_screening_text">"ఇన్‌కమింగ్ కాల్‌ను స్క్రీన్ చేయండి"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ru/values-ru.xml" qualifiers="ru"><string msgid="881409763997275156" name="call_notification_answer_action">"Ответить"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видео"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Отклонить"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Завершить"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Входящий вызов"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Текущий вызов"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Фильтрация входящего вызова"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">">999"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-tl/values-tl.xml" qualifiers="tl"><string msgid="881409763997275156" name="call_notification_answer_action">"Sagutin"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Tanggihan"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Ibaba"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Papasok na tawag"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Kasalukuyang tawag"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Nagsi-screen ng papasok na tawag"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zh-rTW/values-zh-rTW.xml" qualifiers="zh-rTW"><string msgid="881409763997275156" name="call_notification_answer_action">"接聽"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"視訊"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"拒接"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"掛斷"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"來電"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"通話中"</string><string msgid="59049573811482460" name="call_notification_screening_text">"正在過濾來電"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-it/values-it.xml" qualifiers="it"><string msgid="881409763997275156" name="call_notification_answer_action">"Rispondi"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Rifiuta"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Riaggancia"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Chiamata in arrivo"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Chiamata in corso"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Applicazione filtro a chiamata in arrivo"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ca/values-ca.xml" qualifiers="ca"><string msgid="881409763997275156" name="call_notification_answer_action">"Respon"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Rebutja"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Penja"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Trucada entrant"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Trucada en curs"</string><string msgid="59049573811482460" name="call_notification_screening_text">"S\'està filtrant una trucada entrant"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-is/values-is.xml" qualifiers="is"><string msgid="881409763997275156" name="call_notification_answer_action">"Svara"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Myndsímtal"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Hafna"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Leggja á"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Símtal berst"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Símtal í gangi"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Síar símtal sem berst"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-cs/values-cs.xml" qualifiers="cs"><string msgid="881409763997275156" name="call_notification_answer_action">"Přijmout"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Odmítnout"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Zavěsit"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Příchozí hovor"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Probíhající hovor"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Prověřování příchozího hovoru"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zh-rCN/values-zh-rCN.xml" qualifiers="zh-rCN"><string msgid="881409763997275156" name="call_notification_answer_action">"接听"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"视频通话"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"拒接"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"挂断"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"来电"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"正在通话"</string><string msgid="59049573811482460" name="call_notification_screening_text">"正在过滤来电"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-in/values-in.xml" qualifiers="in"><string msgid="881409763997275156" name="call_notification_answer_action">"Jawab"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Tolak"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Tutup"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Panggilan masuk"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Panggilan sedang berlangsung"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Menyaring panggilan masuk"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ja/values-ja.xml" qualifiers="ja"><string msgid="881409763997275156" name="call_notification_answer_action">"応答"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ビデオ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"拒否"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"通話終了"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"着信"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"通話中"</string><string msgid="59049573811482460" name="call_notification_screening_text">"着信をスクリーニング中"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-el/values-el.xml" qualifiers="el"><string msgid="881409763997275156" name="call_notification_answer_action">"Απάντηση"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Βίντεο"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Απόρριψη"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Τερματισμός"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Εισερχόμενη κλήση"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Κλήση σε εξέλιξη"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Διαλογή εισερχόμενης κλήσης"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-lv/values-lv.xml" qualifiers="lv"><string msgid="881409763997275156" name="call_notification_answer_action">"Atbildēt"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Noraidīt"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Pārtraukt"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Ienākošais zvans"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Pašreizējais zvans"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Ienākošā zvana filtrēšana"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-da/values-da.xml" qualifiers="da"><string msgid="881409763997275156" name="call_notification_answer_action">"Besvar"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Afvis"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Læg på"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Indgående opkald"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Igangværende opkald"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Et indgående opkald screenes"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-mr/values-mr.xml" qualifiers="mr"><string msgid="881409763997275156" name="call_notification_answer_action">"उत्तर द्या"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"व्हिडिओ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"नकार द्या"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"कॉल बंद करा"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"इनकमिंग कॉल"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"सुरू असलेला कॉल"</string><string msgid="59049573811482460" name="call_notification_screening_text">"इनकमिंग कॉल स्क्रीन करत आहे"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"९९९+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-kk/values-kk.xml" qualifiers="kk"><string msgid="881409763997275156" name="call_notification_answer_action">"Жауап беру"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Бейне"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Қабылдамау"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Тұтқаны қою"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Кіріс қоңырау"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Қоңырау"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Келген қоңырауды сүзу"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ky/values-ky.xml" qualifiers="ky"><string msgid="881409763997275156" name="call_notification_answer_action">"Жооп берүү"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видео"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Четке кагуу"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Чалууну бүтүрүү"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Чалып жатат"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Учурдагы чалуу"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Кирүүчү чалууну иргөө"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-gu/values-gu.xml" qualifiers="gu"><string msgid="881409763997275156" name="call_notification_answer_action">"જવાબ"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"વીડિયો"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"નકારો"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"સમાપ્ત કરો"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"ઇનકમિંગ કૉલ"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"ચાલુ કૉલ"</string><string msgid="59049573811482460" name="call_notification_screening_text">"ઇનકમિંગ કૉલનું સ્ક્રીનિંગ થાય છે"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rCA/values-en-rCA.xml" qualifiers="en-rCA"><string msgid="881409763997275156" name="call_notification_answer_action">"Answer"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Decline"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Hang Up"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Incoming call"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Ongoing call"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Screening an incoming call"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-mn/values-mn.xml" qualifiers="mn"><string msgid="881409763997275156" name="call_notification_answer_action">"Хариулах"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видео"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Татгалзах"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Таслах"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Ирсэн дуудлага"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Дуудлага хийгдэж байна"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Ирсэн дуудлагыг харуулж байна"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rIN/values-en-rIN.xml" qualifiers="en-rIN"><string msgid="881409763997275156" name="call_notification_answer_action">"Answer"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Decline"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Hang up"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Incoming call"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"On-going call"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Screening an incoming call"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ms/values-ms.xml" qualifiers="ms"><string msgid="881409763997275156" name="call_notification_answer_action">"Jawab"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Tolak"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Tamatkan Panggilan"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Panggilan masuk"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Panggilan sedang berlangsung"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Menyaring panggilan masuk"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zh-rHK/values-zh-rHK.xml" qualifiers="zh-rHK"><string msgid="881409763997275156" name="call_notification_answer_action">"接聽"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"視像"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"拒接"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"掛斷"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"來電"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"通話中"</string><string msgid="59049573811482460" name="call_notification_screening_text">"正在過濾來電"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-km/values-km.xml" qualifiers="km"><string msgid="881409763997275156" name="call_notification_answer_action">"ឆ្លើយ"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"វីដេអូ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"បដិសេធ"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"ដាក់​ចុះ"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"ការ​ហៅ​ចូល"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"ការ​ហៅដែលកំពុងដំណើរការ"</string><string msgid="59049573811482460" name="call_notification_screening_text">"កំពុងពិនិត្យការ​ហៅ​ចូល"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pt-rBR/values-pt-rBR.xml" qualifiers="pt-rBR"><string msgid="881409763997275156" name="call_notification_answer_action">"Atender"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Recusar"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Desligar"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Alguém está ligando"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Chamada em andamento"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filtrando uma ligação recebida"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hy/values-hy.xml" qualifiers="hy"><string msgid="881409763997275156" name="call_notification_answer_action">"Պատասխանել"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Տեսազանգ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Մերժել"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Ավարտել"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Մուտքային զանգ"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Ընթացիկ զանգ"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Մուտքային զանգի զտում"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-am/values-am.xml" qualifiers="am"><string msgid="881409763997275156" name="call_notification_answer_action">"መልስ"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ቪዲዮ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"አትቀበል"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"ስልኩን ዝጋ"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"ገቢ ጥሪ"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"እየተካሄደ ያለ ጥሪ"</string><string msgid="59049573811482460" name="call_notification_screening_text">"ገቢ ጥሪ ማጣራት"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-be/values-be.xml" qualifiers="be"><string msgid="881409763997275156" name="call_notification_answer_action">"Адказаць"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Відэа"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Адхіліць"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Завяршыць"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Уваходны выклік"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Бягучы выклік"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Фільтраванне ўваходнага выкліку"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values/values.xml" qualifiers=""><attr format="reference" name="nestedScrollViewStyle"/><color name="androidx_core_ripple_material_light">#1f000000</color><color name="androidx_core_secondary_text_default_material_light">#8a000000</color><color name="call_notification_answer_color">#1d873b</color><color name="call_notification_decline_color">#d93025</color><color name="notification_action_color_filter">#ffffffff</color><color name="notification_icon_bg_color">#ff9e9e9e</color><dimen name="compat_button_inset_horizontal_material">4dp</dimen><dimen name="compat_button_inset_vertical_material">6dp</dimen><dimen name="compat_button_padding_horizontal_material">8dp</dimen><dimen name="compat_button_padding_vertical_material">4dp</dimen><dimen name="compat_control_corner_material">2dp</dimen><dimen name="compat_notification_large_icon_max_height">320dp</dimen><dimen name="compat_notification_large_icon_max_width">320dp</dimen><dimen name="notification_action_icon_size">32dp</dimen><dimen name="notification_action_text_size">13sp</dimen><dimen name="notification_big_circle_margin">12dp</dimen><dimen name="notification_content_margin_start">8dp</dimen><dimen name="notification_large_icon_height">64dp</dimen><dimen name="notification_large_icon_width">64dp</dimen><dimen name="notification_main_column_padding_top">10dp</dimen><dimen name="notification_media_narrow_margin">@dimen/notification_content_margin_start</dimen><dimen name="notification_right_icon_size">16dp</dimen><dimen name="notification_right_side_padding_top">4dp</dimen><dimen name="notification_small_icon_background_padding">3dp</dimen><dimen name="notification_small_icon_size_as_large">24dp</dimen><dimen name="notification_subtext_size">13sp</dimen><dimen name="notification_top_pad">10dp</dimen><dimen name="notification_top_pad_large_text">5dp</dimen><drawable name="notification_template_icon_bg">#3333B5E5</drawable><drawable name="notification_template_icon_low_bg">#0cffffff</drawable><item name="accessibility_action_clickable_span" type="id"/><item name="accessibility_custom_action_0" type="id"/><item name="accessibility_custom_action_1" type="id"/><item name="accessibility_custom_action_10" type="id"/><item name="accessibility_custom_action_11" type="id"/><item name="accessibility_custom_action_12" type="id"/><item name="accessibility_custom_action_13" type="id"/><item name="accessibility_custom_action_14" type="id"/><item name="accessibility_custom_action_15" type="id"/><item name="accessibility_custom_action_16" type="id"/><item name="accessibility_custom_action_17" type="id"/><item name="accessibility_custom_action_18" type="id"/><item name="accessibility_custom_action_19" type="id"/><item name="accessibility_custom_action_2" type="id"/><item name="accessibility_custom_action_20" type="id"/><item name="accessibility_custom_action_21" type="id"/><item name="accessibility_custom_action_22" type="id"/><item name="accessibility_custom_action_23" type="id"/><item name="accessibility_custom_action_24" type="id"/><item name="accessibility_custom_action_25" type="id"/><item name="accessibility_custom_action_26" type="id"/><item name="accessibility_custom_action_27" type="id"/><item name="accessibility_custom_action_28" type="id"/><item name="accessibility_custom_action_29" type="id"/><item name="accessibility_custom_action_3" type="id"/><item name="accessibility_custom_action_30" type="id"/><item name="accessibility_custom_action_31" type="id"/><item name="accessibility_custom_action_4" type="id"/><item name="accessibility_custom_action_5" type="id"/><item name="accessibility_custom_action_6" type="id"/><item name="accessibility_custom_action_7" type="id"/><item name="accessibility_custom_action_8" type="id"/><item name="accessibility_custom_action_9" type="id"/><item name="line1" type="id"/><item name="line3" type="id"/><item name="tag_accessibility_actions" type="id"/><item name="tag_accessibility_clickable_spans" type="id"/><item name="tag_accessibility_heading" type="id"/><item name="tag_accessibility_pane_title" type="id"/><item name="tag_on_apply_window_listener" type="id"/><item name="tag_on_receive_content_listener" type="id"/><item name="tag_on_receive_content_mime_types" type="id"/><item name="tag_screen_reader_focusable" type="id"/><item name="tag_state_description" type="id"/><item name="tag_transition_group" type="id"/><item name="tag_unhandled_key_event_manager" type="id"/><item name="tag_unhandled_key_listeners" type="id"/><item name="tag_window_insets_animation_callback" type="id"/><item name="text" type="id"/><item name="text2" type="id"/><item name="title" type="id"/><integer name="status_bar_notification_info_maxnum">999</integer><string name="call_notification_answer_action">Answer</string><string name="call_notification_answer_video_action">Video</string><string name="call_notification_decline_action">Decline</string><string name="call_notification_hang_up_action">Hang Up</string><string name="call_notification_incoming_text">Incoming call</string><string name="call_notification_ongoing_text">Ongoing call</string><string name="call_notification_screening_text">Screening an incoming call</string><string name="status_bar_notification_info_overflow">999+</string><style name="TextAppearance.Compat.Notification" parent="@android:style/TextAppearance.StatusBar.EventContent"/><style name="TextAppearance.Compat.Notification.Info">
        <item name="android:textSize">12sp</item>
        <item name="android:textColor">?android:attr/textColorSecondary</item>
    </style><style name="TextAppearance.Compat.Notification.Line2" parent="TextAppearance.Compat.Notification.Info"/><style name="TextAppearance.Compat.Notification.Time">
        <item name="android:textSize">12sp</item>
        <item name="android:textColor">?android:attr/textColorSecondary</item>
    </style><style name="TextAppearance.Compat.Notification.Title" parent="@android:style/TextAppearance.StatusBar.EventContent.Title"/><style name="Widget.Compat.NotificationActionContainer" parent=""/><style name="Widget.Compat.NotificationActionText" parent=""/><declare-styleable name="Capability">
        
        <attr format="reference" name="queryPatterns"/>
        
        <attr format="boolean" name="shortcutMatchRequired"/>
    </declare-styleable><declare-styleable name="ColorStateListItem">
        
        <attr name="android:color"/>
        
        <attr format="float" name="alpha"/>
        <attr name="android:alpha"/>
        
        <attr format="float" name="lStar"/>
        <attr name="android:lStar"/>
    </declare-styleable><declare-styleable name="FontFamily">
        
        <attr format="string" name="fontProviderAuthority"/>
        
        <attr format="string" name="fontProviderPackage"/>
        
        <attr format="string" name="fontProviderQuery"/>
        
        <attr format="string" name="fontProviderFallbackQuery"/>
        
        <attr format="reference" name="fontProviderCerts"/>
        
        <attr name="fontProviderFetchStrategy">
            
            <enum name="blocking" value="0"/>
            
            <enum name="async" value="1"/>
        </attr>
        
        <attr format="integer" name="fontProviderFetchTimeout">
            
            <enum name="forever" value="-1"/>
        </attr>
        
        <attr format="string" name="fontProviderSystemFontFamily"/>
    </declare-styleable><declare-styleable name="FontFamilyFont">
        
        <attr name="fontStyle">
            <enum name="normal" value="0"/>
            <enum name="italic" value="1"/>
        </attr>
        
        <attr format="reference" name="font"/>
        
        <attr format="integer" name="fontWeight"/>
        
        <attr format="string" name="fontVariationSettings"/>
        
        <attr format="integer" name="ttcIndex"/>
        
        <attr name="android:fontStyle"/>
        <attr name="android:font"/>
        <attr name="android:fontWeight"/>
        <attr name="android:fontVariationSettings"/>
        <attr name="android:ttcIndex"/>
    </declare-styleable><declare-styleable name="GradientColor">
        
        <attr name="android:startColor"/>
        
        <attr name="android:centerColor"/>
        
        <attr name="android:endColor"/>
        
        <attr name="android:type"/>

        
        
        <attr name="android:gradientRadius"/>

        
        
        <attr name="android:centerX"/>
        
        <attr name="android:centerY"/>

        
        
        <attr name="android:startX"/>
        
        <attr name="android:startY"/>
        
        <attr name="android:endX"/>
        
        <attr name="android:endY"/>

        
        <attr name="android:tileMode"/>
    </declare-styleable><declare-styleable name="GradientColorItem">
        
        <attr name="android:offset"/>
        
        <attr name="android:color"/>
    </declare-styleable></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-uz/values-uz.xml" qualifiers="uz"><string msgid="881409763997275156" name="call_notification_answer_action">"Javob berish"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Rad etish"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Tugatish"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Kiruvchi chaqiruv"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Joriy chaqiruv"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Kiruvchi chaqiruvni filtrlash"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fr-rCA/values-fr-rCA.xml" qualifiers="fr-rCA"><string msgid="881409763997275156" name="call_notification_answer_action">"Répondre"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vidéo"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Refuser"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Raccrocher"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Appel entrant"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Appel en cours"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filtrer un appel entrant"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pl/values-pl.xml" qualifiers="pl"><string msgid="881409763997275156" name="call_notification_answer_action">"Odbierz"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Wideo"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Odrzuć"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Rozłącz"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Połączenie przychodzące"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Trwa połączenie"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filtruję połączenie przychodzące"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-vi/values-vi.xml" qualifiers="vi"><string msgid="881409763997275156" name="call_notification_answer_action">"Trả lời"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Từ chối"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Kết thúc"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Cuộc gọi đến"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Cuộc gọi đang thực hiện"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Đang sàng lọc cuộc gọi đến"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sq/values-sq.xml" qualifiers="sq"><string msgid="881409763997275156" name="call_notification_answer_action">"Përgjigju"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Refuzo"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Mbyll"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Telefonatë hyrëse"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Telefonatë në vazhdim"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Po filtron një telefonatë hyrëse"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sv/values-sv.xml" qualifiers="sv"><string msgid="881409763997275156" name="call_notification_answer_action">"Svara"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Avvisa"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Lägg på"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Inkommande samtal"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Pågående samtal"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Ett inkommande samtal filtreras"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sl/values-sl.xml" qualifiers="sl"><string msgid="881409763997275156" name="call_notification_answer_action">"Sprejmi"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Zavrni"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Prekini klic"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Dohodni klic"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Aktivni klic"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Preverjanje dohodnega klica"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sk/values-sk.xml" qualifiers="sk"><string msgid="881409763997275156" name="call_notification_answer_action">"Prijať"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Odmietnuť"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Zložiť"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Prichádzajúci hovor"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Prebiehajúci hovor"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Preveruje sa prichádzajúci hovor"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ur/values-ur.xml" qualifiers="ur"><string msgid="881409763997275156" name="call_notification_answer_action">"جواب دیں"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ویڈیو"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"مسترد کریں"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"منقطع کر دیں"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"اِن کمنگ کال"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"جاری کال"</string><string msgid="59049573811482460" name="call_notification_screening_text">"اِن کمنگ کال کی اسکریننگ"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"+999"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sw/values-sw.xml" qualifiers="sw"><string msgid="881409763997275156" name="call_notification_answer_action">"Jibu"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Kataa"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Kata simu"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Simu uliyopigiwa"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Simu inayoendelea"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Inachuja simu unayopigiwa"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pt-rPT/values-pt-rPT.xml" qualifiers="pt-rPT"><string msgid="881409763997275156" name="call_notification_answer_action">"Atender"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Recusar"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Desligar"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Chamada recebida"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Chamada em curso"</string><string msgid="59049573811482460" name="call_notification_screening_text">"A filtrar uma chamada recebida…"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-tr/values-tr.xml" qualifiers="tr"><string msgid="881409763997275156" name="call_notification_answer_action">"Yanıtla"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Reddet"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Kapat"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Gelen arama"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Devam eden arama"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Gelen arama süzülüyor"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ta/values-ta.xml" qualifiers="ta"><string msgid="881409763997275156" name="call_notification_answer_action">"பதிலளி"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"வீடியோ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"நிராகரி"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"துண்டி"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"உள்வரும் அழைப்பு"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"செயலில் இருக்கும் அழைப்பு"</string><string msgid="59049573811482460" name="call_notification_screening_text">"உள்வரும் அழைப்பை மதிப்பாய்வு செய்கிறது"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-th/values-th.xml" qualifiers="th"><string msgid="881409763997275156" name="call_notification_answer_action">"รับสาย"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"วิดีโอ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"ปฏิเสธ"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"วางสาย"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"สายเรียกเข้า"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"สายที่สนทนาอยู่"</string><string msgid="59049573811482460" name="call_notification_screening_text">"กำลังสกรีนสายเรียกเข้า"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fa/values-fa.xml" qualifiers="fa"><string msgid="881409763997275156" name="call_notification_answer_action">"پاسخ دادن"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ویدیو"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"رد کردن"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"قطع تماس"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"تماس ورودی"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"تماس درحال انجام"</string><string msgid="59049573811482460" name="call_notification_screening_text">"درحال غربال کردن تماس ورودی"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-lt/values-lt.xml" qualifiers="lt"><string msgid="881409763997275156" name="call_notification_answer_action">"Atsakyti"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vaizdo įrašas"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Atmesti"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Baigti pok."</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Gaunamasis skambutis"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Vykstantis skambutis"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Gaunamojo skambučio tikrinimas"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-or/values-or.xml" qualifiers="or"><string msgid="881409763997275156" name="call_notification_answer_action">"ଉତ୍ତର ଦିଅନ୍ତୁ"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ଭିଡିଓ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"ଅଗ୍ରାହ୍ୟ କର"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"ସମାପ୍ତ କରନ୍ତୁ"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"ଇନକମିଂ କଲ୍"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"ଚାଲିଥିବା କଲ୍"</string><string msgid="59049573811482460" name="call_notification_screening_text">"ଏକ ଇନକମିଂ କଲକୁ ସ୍କ୍ରିନ୍ କରୁଛି"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-eu/values-eu.xml" qualifiers="eu"><string msgid="881409763997275156" name="call_notification_answer_action">"Erantzun"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Bideoa"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Baztertu"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Amaitu deia"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Sarrerako deia"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Deia abian da"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Sarrerako dei bat bistaratzen"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-lo/values-lo.xml" qualifiers="lo"><string msgid="881409763997275156" name="call_notification_answer_action">"ຮັບສາຍ"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ວິດີໂອ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"ປະຕິເສດ"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"ວາງສາຍ"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"ສາຍໂທເຂົ້າ"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"ສາຍໂທອອກ"</string><string msgid="59049573811482460" name="call_notification_screening_text">"ກຳລັງກວດສອບສາຍໂທເຂົ້າ"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-iw/values-iw.xml" qualifiers="iw"><string msgid="881409763997275156" name="call_notification_answer_action">"מענה"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"וידאו"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"דחייה"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"ניתוק"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"שיחה נכנסת"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"שיחה פעילה"</string><string msgid="59049573811482460" name="call_notification_screening_text">"סינון שיחה נכנסת"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rGB/values-en-rGB.xml" qualifiers="en-rGB"><string msgid="881409763997275156" name="call_notification_answer_action">"Answer"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Decline"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Hang up"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Incoming call"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"On-going call"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Screening an incoming call"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fi/values-fi.xml" qualifiers="fi"><string msgid="881409763997275156" name="call_notification_answer_action">"Vastaa"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Hylkää"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Lopeta puhelu"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Saapuva puhelu"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Käynnissä oleva puhelu"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Seulotaan saapuvaa puhelua"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rAU/values-en-rAU.xml" qualifiers="en-rAU"><string msgid="881409763997275156" name="call_notification_answer_action">"Answer"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Decline"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Hang up"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Incoming call"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"On-going call"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Screening an incoming call"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fr/values-fr.xml" qualifiers="fr"><string msgid="881409763997275156" name="call_notification_answer_action">"Répondre"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vidéo"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Refuser"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Raccrocher"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Appel entrant"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Appel en cours"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filtrage d\'un appel entrant"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-es/values-es.xml" qualifiers="es"><string msgid="881409763997275156" name="call_notification_answer_action">"Responder"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Rechazar"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Colgar"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Llamada entrante"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Llamada en curso"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filtrando una llamada entrante"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-et/values-et.xml" qualifiers="et"><string msgid="881409763997275156" name="call_notification_answer_action">"Vasta"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Keeldu"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Lõpeta kõne"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Sissetulev kõne"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Käimasolev kõne"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Sissetuleva kõne filtreerimine"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hr/values-hr.xml" qualifiers="hr"><string msgid="881409763997275156" name="call_notification_answer_action">"Odgovori"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Videozapis"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Odbij"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Prekini"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Dolazni poziv"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Poziv u tijeku"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filtriranje dolaznog poziva"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hu/values-hu.xml" qualifiers="hu"><string msgid="881409763997275156" name="call_notification_answer_action">"Fogadás"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Videó"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Elutasítás"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Befejezés"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Bejövő hívás"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Hívás folyamatban"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Bejövő hívás szűrése"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-nl/values-nl.xml" qualifiers="nl"><string msgid="881409763997275156" name="call_notification_answer_action">"Beantwoorden"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Weigeren"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Ophangen"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Inkomend gesprek"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Actief gesprek"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Een inkomend gesprek screenen"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-bg/values-bg.xml" qualifiers="bg"><string msgid="881409763997275156" name="call_notification_answer_action">"Отговор"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видеообаждане"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Отхвърляне"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Затваряне"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Входящо обаждане"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Текущо обаждане"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Преглежда се входящо обаждане"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-bn/values-bn.xml" qualifiers="bn"><string msgid="881409763997275156" name="call_notification_answer_action">"উত্তর দিন"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ভিডিও"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"বাতিল করুন"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"কল কেটে দিন"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"ইনকামিং কল"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"চালু থাকা কল"</string><string msgid="59049573811482460" name="call_notification_screening_text">"ইনকামিং কল স্ক্রিনিং করা হচ্ছে"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"৯৯৯+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ne/values-ne.xml" qualifiers="ne"><string msgid="881409763997275156" name="call_notification_answer_action">"जवाफ दिनुहोस्"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"भिडियो"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"काट्नुहोस्"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"फोन राख्नुहोस्"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"आगमन कल"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"भइरहेको कल"</string><string msgid="59049573811482460" name="call_notification_screening_text">"आगमन कल जाँचिँदै छ"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"९९९+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-af/values-af.xml" qualifiers="af"><string msgid="881409763997275156" name="call_notification_answer_action">"Antwoord"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Wys af"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Lui af"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Inkomende oproep"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Oproep aan die gang"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Keur tans \'n inkomende oproep"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-nb/values-nb.xml" qualifiers="nb"><string msgid="881409763997275156" name="call_notification_answer_action">"Svar"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Avvis"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Legg på"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Innkommende anrop"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Pågående samtale"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filtrerer et innkommende anrop"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hi/values-hi.xml" qualifiers="hi"><string msgid="881409763997275156" name="call_notification_answer_action">"जवाब दें"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"वीडियो"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"अस्वीकार करें"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"कॉल काटें"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"आने वाला (इनकमिंग) कॉल"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"पहले से जारी कॉल"</string><string msgid="59049573811482460" name="call_notification_screening_text">"इनकमिंग कॉल को स्क्रीन किया जा रहा है"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ka/values-ka.xml" qualifiers="ka"><string msgid="881409763997275156" name="call_notification_answer_action">"პასუხი"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ვიდეო"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"უარყოფა"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"გათიშვა"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"შემომავალი ზარი"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"მიმდინარე ზარი"</string><string msgid="59049573811482460" name="call_notification_screening_text">"შემომავალი ზარების გაცხრილვა"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-de/values-de.xml" qualifiers="de"><string msgid="881409763997275156" name="call_notification_answer_action">"Annehmen"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Ablehnen"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Auflegen"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Eingehender Anruf"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Aktueller Anruf"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filter für eingehenden Anruf"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-as/values-as.xml" qualifiers="as"><string msgid="881409763997275156" name="call_notification_answer_action">"উত্তৰ দিয়ক"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ভিডিঅ’"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"প্ৰত্যাখ্যান কৰক"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"কল কাটি দিয়ক"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"অন্তৰ্গামী কল"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"চলি থকা কল"</string><string msgid="59049573811482460" name="call_notification_screening_text">"এটা অন্তৰ্গামী কলৰ পৰীক্ষা কৰি থকা হৈছে"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"৯৯৯+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-az/values-az.xml" qualifiers="az"><string msgid="881409763997275156" name="call_notification_answer_action">"Cavab verin"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"İmtina edin"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Dəstəyi asın"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Gələn zəng"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Davam edən zəng"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Gələn zəng göstərilir"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ko/values-ko.xml" qualifiers="ko"><string msgid="881409763997275156" name="call_notification_answer_action">"통화"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"동영상"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"거절"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"전화 끊기"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"수신 전화"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"진행 중인 통화"</string><string msgid="59049573811482460" name="call_notification_screening_text">"수신 전화 검사 중"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ml/values-ml.xml" qualifiers="ml"><string msgid="881409763997275156" name="call_notification_answer_action">"മറുപടി നൽകുക"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"വീഡിയോ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"നിരസിക്കുക"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"കോൾ നിർത്തുക"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"ഇൻകമിംഗ് കോൾ"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"സജീവമായ കോൾ"</string><string msgid="59049573811482460" name="call_notification_screening_text">"ഇൻകമിംഗ് കോൾ സ്‌ക്രീൻ ചെയ്യുന്നു"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-mk/values-mk.xml" qualifiers="mk"><string msgid="881409763997275156" name="call_notification_answer_action">"Одговори"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видео"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Одбиј"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Спушти"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Дојдовен повик"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Тековен повик"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Проверка на дојдовен повик"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-kn/values-kn.xml" qualifiers="kn"><string msgid="881409763997275156" name="call_notification_answer_action">"ಉತ್ತರಿಸಿ"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ವೀಡಿಯೊ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"ನಿರಾಕರಿಸಿ"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"ಕರೆ ಕೊನೆಗೊಳಿಸಿ"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"ಒಳಬರುವ ಕರೆ"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಕರೆ"</string><string msgid="59049573811482460" name="call_notification_screening_text">"ಒಳಬರುವ ಕರೆಯನ್ನು ಸ್ಕ್ರೀನ್ ಮಾಡಲಾಗುತ್ತಿದೆ"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-bs/values-bs.xml" qualifiers="bs"><string msgid="881409763997275156" name="call_notification_answer_action">"Odgovori"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Odbaci"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Prekini vezu"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Dolazni poziv"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Poziv u toku"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filtriranje dolaznog poziva"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-my/values-my.xml" qualifiers="my"><string msgid="881409763997275156" name="call_notification_answer_action">"ဖုန်းကိုင်ရန်"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ဗီဒီယို"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"ငြင်းပယ်ရန်"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"ဖုန်းချရန်"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"အဝင်ခေါ်ဆိုမှု"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"လက်ရှိခေါ်ဆိုမှု"</string><string msgid="59049573811482460" name="call_notification_screening_text">"အဝင်ခေါ်ဆိုမှုကို စစ်ဆေးနေသည်"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"၉၉၉+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ar/values-ar.xml" qualifiers="ar"><string msgid="881409763997275156" name="call_notification_answer_action">"ردّ"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"فيديو"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"رفض"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"قطع الاتصال"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"مكالمة واردة"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"مكالمة جارية"</string><string msgid="59049573811482460" name="call_notification_screening_text">"يتم فحص المكالمة الواردة"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-es-rUS/values-es-rUS.xml" qualifiers="es-rUS"><string msgid="881409763997275156" name="call_notification_answer_action">"Responder"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Rechazar"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Colgar"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Llamada entrante"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Llamada en curso"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filtrando una llamada entrante"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-gl/values-gl.xml" qualifiers="gl"><string msgid="881409763997275156" name="call_notification_answer_action">"Contestar"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Rexeitar"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Colgar"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Chamada entrante"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Chamada en curso"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filtrando chamada entrante"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">">999"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pt/values-pt.xml" qualifiers="pt"><string msgid="881409763997275156" name="call_notification_answer_action">"Atender"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Vídeo"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Recusar"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Desligar"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Alguém está ligando"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Chamada em andamento"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Filtrando uma ligação recebida"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-uk/values-uk.xml" qualifiers="uk"><string msgid="881409763997275156" name="call_notification_answer_action">"Відповісти"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Відео"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Відхилити"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Завершити"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Вхідний виклик"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Активний виклик"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Вхідний виклик (Фільтр)"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sr/values-sr.xml" qualifiers="sr"><string msgid="881409763997275156" name="call_notification_answer_action">"Одговори"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Видео"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Одбиј"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Прекини везу"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Долазни позив"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Позив је у току"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Проверава се долазни позив"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pa/values-pa.xml" qualifiers="pa"><string msgid="881409763997275156" name="call_notification_answer_action">"ਜਵਾਬ ਦਿਓ"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"ਵੀਡੀਓ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"ਕਾਲ ਕੱਟੋ"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"ਸਮਾਪਤ ਕਰੋ"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"ਇਨਕਮਿੰਗ ਕਾਲ"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"ਜਾਰੀ ਕਾਲ"</string><string msgid="59049573811482460" name="call_notification_screening_text">"ਇਨਕਮਿੰਗ ਕਾਲ ਦੀ ਸਕ੍ਰੀਨਿੰਗ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-si/values-si.xml" qualifiers="si"><string msgid="881409763997275156" name="call_notification_answer_action">"පිළිතුරු දෙ."</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"වීඩියෝ"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"ප්‍රතික්ෂේප ක"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"විසන්ධි කරන්න"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"එන ඇමතුම"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"කරගෙන යන ඇමතුම"</string><string msgid="59049573811482460" name="call_notification_screening_text">"එන ඇමතුමක් පරීක්ෂා කරන්න"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-b+sr+Latn/values-b+sr+Latn.xml" qualifiers="b+sr+Latn"><string msgid="881409763997275156" name="call_notification_answer_action">"Odgovori"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Video"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Odbij"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Prekini vezu"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Dolazni poziv"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Poziv je u toku"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Proverava se dolazni poziv"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rXC/values-en-rXC.xml" qualifiers="en-rXC"><string msgid="881409763997275156" name="call_notification_answer_action">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‎‎‏‏‎‎‎‎‏‏‏‎‏‏‎‏‏‎‎‏‎‏‏‎‎‎‎‎‏‎‏‎‏‎‏‏‎‎‏‎‎‏‏‏‏‎‎‏‎‏‎‏‎‎‎‎‎‏‎‏‎‎‎Answer‎‏‎‎‏‎"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‏‏‏‏‏‎‏‎‎‎‎‎‏‎‎‏‏‏‎‎‎‏‎‎‎‏‎‏‎‏‎‎‏‏‎‎‏‏‎‎‏‎‎‎‎‏‎‏‎‏‎‎‏‏‎‏‎‎‏‎‎‎‎‎‎Video‎‏‎‎‏‎"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‎‏‎‏‏‎‎‏‏‎‏‎‎‎‏‏‎‎‎‎‏‎‎‏‏‏‎‏‎‎‏‏‎‎‎‎‏‎‎‏‏‎‎‏‏‏‏‏‎‎‏‎‎‏‎‎‎‎‏‎‎‏‎‎Decline‎‏‎‎‏‎"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‎‏‎‎‏‎‎‏‏‏‎‏‎‎‎‎‏‎‎‏‎‏‎‏‏‏‎‏‎‎‏‏‎‎‎‎‎‎‏‏‎‏‏‎‎‏‏‏‏‎‎‎‎‎‎‎‎‎‏‎‏‏‏‎Hang Up‎‏‎‎‏‎"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‏‏‎‏‎‏‎‎‏‏‎‎‎‎‏‎‎‏‎‏‎‎‎‎‏‎‎‎‎‏‎‏‏‎‎‎‏‏‏‎‏‏‎‎‎‏‎‎‎‏‏‎‏‎‎‎‏‎‏‏‎‏‏‏‎Incoming call‎‏‎‎‏‎"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‏‏‏‏‎‏‏‏‏‎‏‎‏‏‎‏‏‏‏‏‏‏‎‏‎‎‎‏‎‏‏‎‎‏‏‏‏‏‎‎‎‎‎‏‎‏‏‏‎‎‎‏‎‏‎‎‏‎‏‏‏‏‏‎‎Ongoing call‎‏‎‎‏‎"</string><string msgid="59049573811482460" name="call_notification_screening_text">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‎‎‎‏‏‎‏‎‎‎‏‏‏‎‎‏‎‎‏‎‏‎‎‎‏‏‎‎‏‎‎‎‏‏‏‎‎‏‎‏‎‏‏‏‏‏‎‏‏‏‏‎‏‎‏‏‏‎‎‎Screening an incoming call‎‏‎‎‏‎"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"‎‏‎‎‎‎‎‏‎‏‏‏‎‎‎‎‎‎‏‎‎‏‎‎‎‎‏‏‏‏‏‏‏‏‎‏‎‏‏‏‎‎‎‏‏‏‏‎‎‏‎‎‏‏‎‏‎‏‏‎‎‏‎‏‏‎‎‎‏‎‎‎‎‎‎‎‏‎‎‎‎‏‎‏‎‏‎‎‎‎‏‎‎‎‎‎‎999+‎‏‎‎‏‎"</string></file><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zu/values-zu.xml" qualifiers="zu"><string msgid="881409763997275156" name="call_notification_answer_action">"Phendula"</string><string msgid="8793775615905189152" name="call_notification_answer_video_action">"Ividiyo"</string><string msgid="3229508546291798546" name="call_notification_decline_action">"Yenqaba"</string><string msgid="2659457946726154263" name="call_notification_hang_up_action">"Vala Ucingo"</string><string msgid="6107532579223922871" name="call_notification_incoming_text">"Ikholi engenayo"</string><string msgid="8623827134497363134" name="call_notification_ongoing_text">"Ikholi eqhubekayo"</string><string msgid="59049573811482460" name="call_notification_screening_text">"Ukuveza ikholi engenayo"</string><string msgid="6277540029070332960" name="status_bar_notification_info_overflow">"999+"</string></file></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.activity:activity:1.10.1$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/0ce746c579773c78d982a1aca321ba9d/transformed/activity-1.10.1/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.activity:activity:1.10.1" from-dependency="true" generated-set="androidx.activity:activity:1.10.1$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/0ce746c579773c78d982a1aca321ba9d/transformed/activity-1.10.1/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/0ce746c579773c78d982a1aca321ba9d/transformed/activity-1.10.1/res/values/values.xml" qualifiers=""><item name="report_drawn" type="id"/><id name="view_tree_on_back_pressed_dispatcher_owner"/></file></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.activity:activity-ktx:1.10.1$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/fa87b9ad69df6a4ca5f98e3b2d60d805/transformed/activity-ktx-1.10.1/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="androidx.activity:activity-ktx:1.10.1" from-dependency="true" generated-set="androidx.activity:activity-ktx:1.10.1$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/.gradle/caches/8.9/transforms/fa87b9ad69df6a4ca5f98e3b2d60d805/transformed/activity-ktx-1.10.1/res"><file path="/Users/gchikoti/.gradle/caches/8.9/transforms/fa87b9ad69df6a4ca5f98e3b2d60d805/transformed/activity-ktx-1.10.1/res/values/values.xml" qualifiers=""/></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="main$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/main/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="main" generated-set="main$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/main/res"><file name="ic_library" path="/Users/gchikoti/Music/study-library/android/app/src/main/res/drawable/ic_library.xml" qualifiers="" type="drawable"/><file name="activity_main" path="/Users/gchikoti/Music/study-library/android/app/src/main/res/layout/activity_main.xml" qualifiers="" type="layout"/><file path="/Users/gchikoti/Music/study-library/android/app/src/main/res/values/themes.xml" qualifiers=""><style name="Theme.StudyLibrary" parent="android:style/Theme.Material.Light.NoActionBar">
        <item name="android:fontFamily">sans</item>
        <item name="android:windowActionModeOverlay">true</item>
        <item name="android:colorAccent">#1E6B68</item>
        <item name="android:statusBarColor">#F4F0E7</item>
        <item name="android:navigationBarColor">#F4F0E7</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
    </style></file><file path="/Users/gchikoti/Music/study-library/android/app/src/main/res/values/strings.xml" qualifiers=""><string name="app_name">Second Brain Study Library</string><string name="network_error">The study library could not be reached. Check your connection and try again.</string><string name="reader_restarted">The reader restarted unexpectedly. Try loading the library again.</string><string name="https_required">Release builds require an HTTPS library URL.</string><string name="external_link_error">This external link could not be opened.</string><string name="download_description">Study Library download</string></file></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="debug$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/debug/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="debug" generated-set="debug$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/debug/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="generated$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/build/generated/res/resValues/debug"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="generated" generated-set="generated$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/build/generated/res/resValues/debug"/></dataSet><mergedItems><configuration qualifiers=""><declare-styleable name="FontFamilyFont">
        
        <attr name="fontStyle">
            <enum name="normal" value="0"/>
            <enum name="italic" value="1"/>
        </attr>
        
        <attr format="reference" name="font"/>
        
        <attr format="integer" name="fontWeight"/>
        
        <attr format="string" name="fontVariationSettings"/>
        
        <attr format="integer" name="ttcIndex"/>
        
        <attr name="android:fontStyle"/>
        <attr name="android:font"/>
        <attr name="android:fontWeight"/>
        <attr name="android:fontVariationSettings"/>
        <attr name="android:ttcIndex"/>
    </declare-styleable><declare-styleable name="GradientColorItem">
        
        <attr name="android:offset"/>
        
        <attr name="android:color"/>
    </declare-styleable><declare-styleable name="FontFamily">
        
        <attr format="string" name="fontProviderAuthority"/>
        
        <attr format="string" name="fontProviderPackage"/>
        
        <attr format="string" name="fontProviderQuery"/>
        
        <attr format="string" name="fontProviderFallbackQuery"/>
        
        <attr format="reference" name="fontProviderCerts"/>
        
        <attr name="fontProviderFetchStrategy">
            
            <enum name="blocking" value="0"/>
            
            <enum name="async" value="1"/>
        </attr>
        
        <attr format="integer" name="fontProviderFetchTimeout">
            
            <enum name="forever" value="-1"/>
        </attr>
        
        <attr format="string" name="fontProviderSystemFontFamily"/>
    </declare-styleable><declare-styleable name="Capability">
        
        <attr format="reference" name="queryPatterns"/>
        
        <attr format="boolean" name="shortcutMatchRequired"/>
    </declare-styleable><declare-styleable name="GradientColor">
        
        <attr name="android:startColor"/>
        
        <attr name="android:centerColor"/>
        
        <attr name="android:endColor"/>
        
        <attr name="android:type"/>

        
        
        <attr name="android:gradientRadius"/>

        
        
        <attr name="android:centerX"/>
        
        <attr name="android:centerY"/>

        
        
        <attr name="android:startX"/>
        
        <attr name="android:startY"/>
        
        <attr name="android:endX"/>
        
        <attr name="android:endY"/>

        
        <attr name="android:tileMode"/>
    </declare-styleable><declare-styleable name="ColorStateListItem">
        
        <attr name="android:color"/>
        
        <attr format="float" name="alpha"/>
        <attr name="android:alpha"/>
        
        <attr format="float" name="lStar"/>
        <attr name="android:lStar"/>
    </declare-styleable></configuration></mergedItems></merger>
````

## File: android/app/build/intermediates/incremental/debug/packageDebugResources/compile-file-map.properties

````
#Tue Sep 29 12:23:39 CDT 2026
com.secondbrain.studylibrary.app-main-5\:/drawable/ic_library.xml=/Users/gchikoti/Music/study-library/android/app/build/intermediates/packaged_res/debug/packageDebugResources/drawable/ic_library.xml
com.secondbrain.studylibrary.app-main-5\:/layout/activity_main.xml=/Users/gchikoti/Music/study-library/android/app/build/intermediates/packaged_res/debug/packageDebugResources/layout/activity_main.xml
````

## File: android/app/build/intermediates/incremental/debug/packageDebugResources/merged.dir/values/values.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Second Brain Study Library</string>
    <string name="download_description">Study Library download</string>
    <string name="external_link_error">This external link could not be opened.</string>
    <string name="https_required">Release builds require an HTTPS library URL.</string>
    <string name="network_error">The study library could not be reached. Check your connection and try again.</string>
    <string name="reader_restarted">The reader restarted unexpectedly. Try loading the library again.</string>
    <style name="Theme.StudyLibrary" parent="android:style/Theme.Material.Light.NoActionBar">
        <item name="android:fontFamily">sans</item>
        <item name="android:windowActionModeOverlay">true</item>
        <item name="android:colorAccent">#1E6B68</item>
        <item name="android:statusBarColor">#F4F0E7</item>
        <item name="android:navigationBarColor">#F4F0E7</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
    </style>
</resources>
````

## File: android/app/build/intermediates/incremental/debug/packageDebugResources/merger.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<merger version="3"><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="main$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/main/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="main" generated-set="main$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/main/res"><file name="ic_library" path="/Users/gchikoti/Music/study-library/android/app/src/main/res/drawable/ic_library.xml" qualifiers="" type="drawable"/><file name="activity_main" path="/Users/gchikoti/Music/study-library/android/app/src/main/res/layout/activity_main.xml" qualifiers="" type="layout"/><file path="/Users/gchikoti/Music/study-library/android/app/src/main/res/values/themes.xml" qualifiers=""><style name="Theme.StudyLibrary" parent="android:style/Theme.Material.Light.NoActionBar">
        <item name="android:fontFamily">sans</item>
        <item name="android:windowActionModeOverlay">true</item>
        <item name="android:colorAccent">#1E6B68</item>
        <item name="android:statusBarColor">#F4F0E7</item>
        <item name="android:navigationBarColor">#F4F0E7</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
    </style></file><file path="/Users/gchikoti/Music/study-library/android/app/src/main/res/values/strings.xml" qualifiers=""><string name="app_name">Second Brain Study Library</string><string name="network_error">The study library could not be reached. Check your connection and try again.</string><string name="reader_restarted">The reader restarted unexpectedly. Try loading the library again.</string><string name="https_required">Release builds require an HTTPS library URL.</string><string name="external_link_error">This external link could not be opened.</string><string name="download_description">Study Library download</string></file></source></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="debug$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/debug/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="debug" generated-set="debug$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/debug/res"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="generated$Generated" generated="true" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/build/generated/res/resValues/debug"/></dataSet><dataSet aapt-namespace="http://schemas.android.com/apk/res-auto" config="generated" generated-set="generated$Generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/build/generated/res/resValues/debug"/></dataSet><mergedItems/></merger>
````

## File: android/app/build/intermediates/incremental/mergeDebugAssets/merger.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<merger version="3"><dataSet config="main" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/main/assets"/></dataSet><dataSet config="debug" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/debug/assets"/></dataSet><dataSet config="generated" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/build/intermediates/shader_assets/debug/compileDebugShaders/out"/></dataSet></merger>
````

## File: android/app/build/intermediates/incremental/mergeDebugJniLibFolders/merger.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<merger version="3"><dataSet config="main" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/main/jniLibs"/></dataSet><dataSet config="debug" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/debug/jniLibs"/></dataSet></merger>
````

## File: android/app/build/intermediates/incremental/mergeDebugShaders/merger.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<merger version="3"><dataSet config="main" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/main/shaders"/></dataSet><dataSet config="debug" ignore_pattern="!.svn:!.git:!.ds_store:!*.scc:.*:&lt;dir>_*:!CVS:!thumbs.db:!picasa.ini:!*~"><source path="/Users/gchikoti/Music/study-library/android/app/src/debug/shaders"/></dataSet></merger>
````

## File: android/app/build/intermediates/linked_resources_binary_format/debug/processDebugResources/output-metadata.json

````json
{
  "version": 3,
  "artifactType": {
    "type": "LINKED_RESOURCES_BINARY_FORMAT",
    "kind": "Directory"
  },
  "applicationId": "com.secondbrain.studylibrary.debug",
  "variantName": "debug",
  "elements": [
    {
      "type": "SINGLE",
      "filters": [],
      "attributes": [],
      "versionCode": 1,
      "versionName": "1.0.0-debug",
      "outputFile": "linked-resources-binary-format-debug.ap_"
    }
  ],
  "elementType": "File"
}
````

## File: android/app/build/intermediates/merged_manifest/debug/processDebugMainManifest/AndroidManifest.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.secondbrain.studylibrary.debug"
    android:versionCode="1"
    android:versionName="1.0.0-debug" >

    <uses-sdk
        android:minSdkVersion="26"
        android:targetSdkVersion="35" />

    <uses-permission android:name="android.permission.INTERNET" />

    <permission
        android:name="com.secondbrain.studylibrary.debug.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"
        android:protectionLevel="signature" />

    <uses-permission android:name="com.secondbrain.studylibrary.debug.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION" />

    <application
        android:allowBackup="true"
        android:appComponentFactory="androidx.core.app.CoreComponentFactory"
        android:debuggable="true"
        android:extractNativeLibs="false"
        android:icon="@drawable/ic_library"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_library"
        android:supportsRtl="true"
        android:theme="@style/Theme.StudyLibrary"
        android:usesCleartextTraffic="false" >
        <activity
            android:name="com.secondbrain.studylibrary.MainActivity"
            android:exported="true"
            android:screenOrientation="unspecified" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.startup.InitializationProvider"
            android:authorities="com.secondbrain.studylibrary.debug.androidx-startup"
            android:exported="false" >
            <meta-data
                android:name="androidx.profileinstaller.ProfileInstallerInitializer"
                android:value="androidx.startup" />
        </provider>

        <receiver
            android:name="androidx.profileinstaller.ProfileInstallReceiver"
            android:directBootAware="false"
            android:enabled="true"
            android:exported="true"
            android:permission="android.permission.DUMP" >
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.INSTALL_PROFILE" />
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.SKIP_FILE" />
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.SAVE_PROFILE" />
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.BENCHMARK_OPERATION" />
            </intent-filter>
        </receiver>
    </application>

</manifest>
````

## File: android/app/build/intermediates/merged_manifests/debug/processDebugManifest/AndroidManifest.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.secondbrain.studylibrary.debug"
    android:versionCode="1"
    android:versionName="1.0.0-debug" >

    <uses-sdk
        android:minSdkVersion="26"
        android:targetSdkVersion="35" />

    <uses-permission android:name="android.permission.INTERNET" />

    <permission
        android:name="com.secondbrain.studylibrary.debug.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"
        android:protectionLevel="signature" />

    <uses-permission android:name="com.secondbrain.studylibrary.debug.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION" />

    <application
        android:allowBackup="true"
        android:appComponentFactory="androidx.core.app.CoreComponentFactory"
        android:debuggable="true"
        android:extractNativeLibs="false"
        android:icon="@drawable/ic_library"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_library"
        android:supportsRtl="true"
        android:theme="@style/Theme.StudyLibrary"
        android:usesCleartextTraffic="false" >
        <activity
            android:name="com.secondbrain.studylibrary.MainActivity"
            android:exported="true"
            android:screenOrientation="unspecified" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.startup.InitializationProvider"
            android:authorities="com.secondbrain.studylibrary.debug.androidx-startup"
            android:exported="false" >
            <meta-data
                android:name="androidx.profileinstaller.ProfileInstallerInitializer"
                android:value="androidx.startup" />
        </provider>

        <receiver
            android:name="androidx.profileinstaller.ProfileInstallReceiver"
            android:directBootAware="false"
            android:enabled="true"
            android:exported="true"
            android:permission="android.permission.DUMP" >
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.INSTALL_PROFILE" />
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.SKIP_FILE" />
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.SAVE_PROFILE" />
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.BENCHMARK_OPERATION" />
            </intent-filter>
        </receiver>
    </application>

</manifest>
````

## File: android/app/build/intermediates/merged_manifests/debug/processDebugManifest/output-metadata.json

````json
{
  "version": 3,
  "artifactType": {
    "type": "MERGED_MANIFESTS",
    "kind": "Directory"
  },
  "applicationId": "com.secondbrain.studylibrary.debug",
  "variantName": "debug",
  "elements": [
    {
      "type": "SINGLE",
      "filters": [],
      "attributes": [],
      "versionCode": 1,
      "versionName": "1.0.0-debug",
      "outputFile": "AndroidManifest.xml"
    }
  ],
  "elementType": "File"
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/mergeDebugResources.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-te_values-te.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-te/values-te.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,157,265,367,468,574,681,805",
                        "endColumns": "101,107,101,100,105,106,123,100",
                        "endOffsets": "152,260,362,463,569,676,800,901"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ms_values-ms.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ms/values-ms.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,252,349,459,565,683,798",
                        "endColumns": "94,101,96,109,105,117,114,100",
                        "endOffsets": "145,247,344,454,560,678,793,894"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ca_values-ca.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ca/values-ca.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,449,555,660,786",
                        "endColumns": "95,101,98,96,105,104,125,100",
                        "endOffsets": "146,248,347,444,550,655,781,882"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-en-rXC_values-en-rXC.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rXC/values-en-rXC.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,251,456,657,858,1065,1270,1482",
                        "endColumns": "195,204,200,200,206,204,211,203",
                        "endOffsets": "246,451,652,853,1060,1265,1477,1681"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-cs_values-cs.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-cs/values-cs.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,356,455,560,667,786",
                        "endColumns": "97,101,100,98,104,106,118,100",
                        "endOffsets": "148,250,351,450,555,662,781,882"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-kn_values-kn.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-kn/values-kn.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,256,357,463,564,672,800",
                        "endColumns": "97,102,100,105,100,107,127,100",
                        "endOffsets": "148,251,352,458,559,667,795,896"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-en-rIN_values-en-rIN.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rIN/values-en-rIN.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,451,555,658,774",
                        "endColumns": "95,101,98,98,103,102,115,100",
                        "endOffsets": "146,248,347,446,550,653,769,870"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ml_values-ml.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ml/values-ml.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,157,260,362,466,569,670,792",
                        "endColumns": "101,102,101,103,102,100,121,100",
                        "endOffsets": "152,255,357,461,564,665,787,888"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-it_values-it.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-it/values-it.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,354,456,565,672,802",
                        "endColumns": "97,101,98,101,108,106,129,100",
                        "endOffsets": "148,250,349,451,560,667,797,898"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-da_values-da.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-da/values-da.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,350,448,555,664,782",
                        "endColumns": "95,101,96,97,106,108,117,100",
                        "endOffsets": "146,248,345,443,550,659,777,878"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-tl_values-tl.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-tl/values-tl.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,355,452,559,667,789",
                        "endColumns": "96,101,100,96,106,107,121,100",
                        "endOffsets": "147,249,350,447,554,662,784,885"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-pt_values-pt.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pt/values-pt.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,353,453,563,673,793",
                        "endColumns": "96,101,98,99,109,109,119,100",
                        "endOffsets": "147,249,348,448,558,668,788,889"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ka_values-ka.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ka/values-ka.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,451,557,661,779",
                        "endColumns": "95,101,98,98,105,103,117,100",
                        "endOffsets": "146,248,347,446,552,656,774,875"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-es_values-es.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-es/values-es.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,356,454,561,667,787",
                        "endColumns": "98,101,99,97,106,105,119,100",
                        "endOffsets": "149,251,351,449,556,662,782,883"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-bn_values-bn.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-bn/values-bn.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,358,461,562,664,784",
                        "endColumns": "98,101,101,102,100,101,119,100",
                        "endOffsets": "149,251,353,456,557,659,779,880"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-sw_values-sw.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sw/values-sw.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,149,251,348,449,556,663,778",
                        "endColumns": "93,101,96,100,106,106,114,100",
                        "endOffsets": "144,246,343,444,551,658,773,874"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-in_values-in.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-in/values-in.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,252,349,446,552,670,785",
                        "endColumns": "94,101,96,96,105,117,114,100",
                        "endOffsets": "145,247,344,441,547,665,780,881"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-sr_values-sr.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sr/values-sr.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,352,456,560,665,781",
                        "endColumns": "97,101,96,103,103,104,115,100",
                        "endOffsets": "148,250,347,451,555,660,776,877"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-hi_values-hi.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hi/values-hi.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,256,361,462,575,681,808",
                        "endColumns": "97,102,104,100,112,105,126,100",
                        "endOffsets": "148,251,356,457,570,676,803,904"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ky_values-ky.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ky/values-ky.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,155,257,360,467,569,673,784",
                        "endColumns": "99,101,102,106,101,103,110,100",
                        "endOffsets": "150,252,355,462,564,668,779,880"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-fi_values-fi.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fi/values-fi.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,351,456,561,673,789",
                        "endColumns": "95,101,97,104,104,111,115,100",
                        "endOffsets": "146,248,346,451,556,668,784,885"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-sl_values-sl.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sl/values-sl.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,352,456,559,661,778",
                        "endColumns": "96,101,97,103,102,101,116,100",
                        "endOffsets": "147,249,347,451,554,656,773,874"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-zh-rHK_values-zh-rHK.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zh-rHK/values-zh-rHK.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,147,246,340,434,527,620,716",
                        "endColumns": "91,98,93,93,92,92,95,100",
                        "endOffsets": "142,241,335,429,522,615,711,812"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-en-rCA_values-en-rCA.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rCA/values-en-rCA.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,451,555,657,773",
                        "endColumns": "95,101,98,98,103,101,115,100",
                        "endOffsets": "146,248,347,446,550,652,768,869"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-sk_values-sk.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sk/values-sk.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,354,452,562,670,792",
                        "endColumns": "95,101,100,97,109,107,121,100",
                        "endOffsets": "146,248,349,447,557,665,787,888"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-uz_values-uz.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-uz/values-uz.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,157,259,360,460,568,672,791",
                        "endColumns": "101,101,100,99,107,103,118,100",
                        "endOffsets": "152,254,355,455,563,667,786,887"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-zh-rCN_values-zh-rCN.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zh-rCN/values-zh-rCN.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,147,248,342,436,529,623,719",
                        "endColumns": "91,100,93,93,92,93,95,100",
                        "endOffsets": "142,243,337,431,524,618,714,815"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-my_values-my.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-my/values-my.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,158,262,365,467,572,678,797",
                        "endColumns": "102,103,102,101,104,105,118,100",
                        "endOffsets": "153,257,360,462,567,673,792,893"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values_values.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/0ce746c579773c78d982a1aca321ba9d/transformed/activity-1.10.1/res/values/values.xml",
                    "from": {
                        "startLines": "2,3",
                        "startColumns": "4,4",
                        "startOffsets": "55,97",
                        "endColumns": "41,59",
                        "endOffsets": "92,152"
                    },
                    "to": {
                        "startLines": "68,87",
                        "startColumns": "4,4",
                        "startOffsets": "4197,5184",
                        "endColumns": "41,59",
                        "endOffsets": "4234,5239"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values/values.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,98,99,103,104,105,106,112,122,157,178,211",
                        "startColumns": "4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4",
                        "startOffsets": "55,115,187,275,340,406,475,538,608,676,748,818,879,953,1026,1087,1148,1210,1274,1336,1397,1465,1565,1625,1691,1764,1833,1890,1942,2004,2076,2152,2217,2276,2335,2395,2455,2515,2575,2635,2695,2755,2815,2875,2935,2994,3054,3114,3174,3234,3294,3354,3414,3474,3534,3594,3653,3713,3773,3832,3891,3950,4009,4068,4127,4162,4197,4252,4315,4370,4428,4486,4547,4610,4667,4718,4768,4829,4886,4952,4986,5021,5056,5126,5193,5265,5334,5403,5477,5549,5637,5708,5825,6026,6136,6337,6466,6538,6605,6808,7109,8915,9596,10278",
                        "endLines": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,97,98,102,103,104,105,111,121,156,177,210,216",
                        "endColumns": "59,71,87,64,65,68,62,69,67,71,69,60,73,72,60,60,61,63,61,60,67,99,59,65,72,68,56,51,61,71,75,64,58,58,59,59,59,59,59,59,59,59,59,59,58,59,59,59,59,59,59,59,59,59,59,58,59,59,58,58,58,58,58,58,34,34,54,62,54,57,57,60,62,56,50,49,60,56,65,33,34,34,69,66,71,68,68,73,71,87,70,116,12,109,12,128,71,66,24,24,24,24,24,24",
                        "endOffsets": "110,182,270,335,401,470,533,603,671,743,813,874,948,1021,1082,1143,1205,1269,1331,1392,1460,1560,1620,1686,1759,1828,1885,1937,1999,2071,2147,2212,2271,2330,2390,2450,2510,2570,2630,2690,2750,2810,2870,2930,2989,3049,3109,3169,3229,3289,3349,3409,3469,3529,3589,3648,3708,3768,3827,3886,3945,4004,4063,4122,4157,4192,4247,4310,4365,4423,4481,4542,4605,4662,4713,4763,4824,4881,4947,4981,5016,5051,5121,5188,5260,5329,5398,5472,5544,5632,5703,5820,6021,6131,6332,6461,6533,6600,6803,7104,8910,9591,10273,10440"
                    },
                    "to": {
                        "startLines": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,90,93,94,95,96,97,98,99,105,106,107,111,112,116,126,127,128,134,144,179,200,233",
                        "startColumns": "4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4",
                        "startOffsets": "55,115,187,275,340,406,475,538,608,676,748,818,879,953,1026,1087,1148,1210,1274,1336,1397,1465,1565,1625,1691,1764,1833,1890,1942,2004,2076,2152,2217,2276,2335,2395,2455,2515,2575,2635,2695,2755,2815,2875,2935,2994,3054,3114,3174,3234,3294,3354,3414,3474,3534,3594,3653,3713,3773,3832,3891,3950,4009,4068,4127,4162,4239,4294,4357,4412,4470,4528,4589,4652,4709,4760,4810,4871,4928,4994,5028,5063,5348,5565,5632,5704,5773,5842,5916,5988,6554,6625,6742,6943,7053,7254,7913,7985,8052,8255,8556,10362,11043,11725",
                        "endLines": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,90,93,94,95,96,97,98,99,105,106,110,111,115,116,126,127,133,143,178,199,232,238",
                        "endColumns": "59,71,87,64,65,68,62,69,67,71,69,60,73,72,60,60,61,63,61,60,67,99,59,65,72,68,56,51,61,71,75,64,58,58,59,59,59,59,59,59,59,59,59,59,58,59,59,59,59,59,59,59,59,59,59,58,59,59,58,58,58,58,58,58,34,34,54,62,54,57,57,60,62,56,50,49,60,56,65,33,34,34,69,66,71,68,68,73,71,87,70,116,12,109,12,128,71,66,24,24,24,24,24,24",
                        "endOffsets": "110,182,270,335,401,470,533,603,671,743,813,874,948,1021,1082,1143,1205,1269,1331,1392,1460,1560,1620,1686,1759,1828,1885,1937,1999,2071,2147,2212,2271,2330,2390,2450,2510,2570,2630,2690,2750,2810,2870,2930,2989,3049,3109,3169,3229,3289,3349,3409,3469,3529,3589,3648,3708,3768,3827,3886,3945,4004,4063,4122,4157,4192,4289,4352,4407,4465,4523,4584,4647,4704,4755,4805,4866,4923,4989,5023,5058,5093,5413,5627,5699,5768,5837,5911,5983,6071,6620,6737,6938,7048,7249,7378,7980,8047,8250,8551,10357,11038,11720,11887"
                    }
                },
                {
                    "source": "/Users/gchikoti/Music/study-library/android/app/src/main/res/values/themes.xml",
                    "from": {
                        "startLines": "1",
                        "startColumns": "4",
                        "startOffsets": "16",
                        "endLines": "9",
                        "endColumns": "12",
                        "endOffsets": "541"
                    },
                    "to": {
                        "startLines": "117",
                        "startColumns": "4",
                        "startOffsets": "7383",
                        "endLines": "125",
                        "endColumns": "12",
                        "endOffsets": "7908"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/1ccb3f3e0d6c941de3653f71b709c6a9/transformed/lifecycle-viewmodel-2.6.2/res/values/values.xml",
                    "from": {
                        "startLines": "2",
                        "startColumns": "4",
                        "startOffsets": "55",
                        "endColumns": "49",
                        "endOffsets": "100"
                    },
                    "to": {
                        "startLines": "89",
                        "startColumns": "4",
                        "startOffsets": "5298",
                        "endColumns": "49",
                        "endOffsets": "5343"
                    }
                },
                {
                    "source": "/Users/gchikoti/Music/study-library/android/app/src/main/res/values/strings.xml",
                    "from": {
                        "startLines": "1,6,5,4,2,3",
                        "startColumns": "4,4,4,4,4,4",
                        "startOffsets": "16,486,398,310,80,199",
                        "endColumns": "63,71,87,87,118,110",
                        "endOffsets": "75,553,481,393,194,305"
                    },
                    "to": {
                        "startLines": "92,100,101,102,103,104",
                        "startColumns": "4,4,4,4,4,4",
                        "startOffsets": "5501,6076,6148,6236,6324,6443",
                        "endColumns": "63,71,87,87,118,110",
                        "endOffsets": "5560,6143,6231,6319,6438,6549"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/6f57d445dc2b7b17599cecc7d5b53684/transformed/savedstate-1.2.1/res/values/values.xml",
                    "from": {
                        "startLines": "2",
                        "startColumns": "4",
                        "startOffsets": "55",
                        "endColumns": "53",
                        "endOffsets": "104"
                    },
                    "to": {
                        "startLines": "88",
                        "startColumns": "4",
                        "startOffsets": "5244",
                        "endColumns": "53",
                        "endOffsets": "5293"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/2b6cda71f2c63e15028aecb216a7e1e3/transformed/lifecycle-runtime-2.6.2/res/values/values.xml",
                    "from": {
                        "startLines": "2",
                        "startColumns": "4",
                        "startOffsets": "55",
                        "endColumns": "42",
                        "endOffsets": "93"
                    },
                    "to": {
                        "startLines": "86",
                        "startColumns": "4",
                        "startOffsets": "5141",
                        "endColumns": "42",
                        "endOffsets": "5179"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/310728483b1ffcc4b83ed17145c8c204/transformed/startup-runtime-1.1.1/res/values/values.xml",
                    "from": {
                        "startLines": "2",
                        "startColumns": "4",
                        "startOffsets": "55",
                        "endColumns": "82",
                        "endOffsets": "133"
                    },
                    "to": {
                        "startLines": "91",
                        "startColumns": "4",
                        "startOffsets": "5418",
                        "endColumns": "82",
                        "endOffsets": "5496"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/a48e7e82dca0cf42a42eeecf8a2a0e74/transformed/core-viewtree-1.0.0/res/values/values.xml",
                    "from": {
                        "startLines": "2",
                        "startColumns": "4",
                        "startOffsets": "55",
                        "endColumns": "42",
                        "endOffsets": "93"
                    },
                    "to": {
                        "startLines": "85",
                        "startColumns": "4",
                        "startOffsets": "5098",
                        "endColumns": "42",
                        "endOffsets": "5136"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-es-rUS_values-es-rUS.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-es-rUS/values-es-rUS.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,356,454,561,667,787",
                        "endColumns": "98,101,99,97,106,105,119,100",
                        "endOffsets": "149,251,351,449,556,662,782,883"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ru_values-ru.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ru/values-ru.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,356,457,562,665,782",
                        "endColumns": "97,101,100,100,104,102,116,100",
                        "endOffsets": "148,250,351,452,557,660,777,878"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-si_values-si.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-si/values-si.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,157,260,365,470,569,673,787",
                        "endColumns": "101,102,104,104,98,103,113,100",
                        "endOffsets": "152,255,360,465,564,668,782,883"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ko_values-ko.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ko/values-ko.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,147,247,341,438,534,632,732",
                        "endColumns": "91,99,93,96,95,97,99,100",
                        "endOffsets": "142,242,336,433,529,627,727,828"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-af_values-af.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-af/values-af.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,353,451,558,667,787",
                        "endColumns": "97,101,97,97,106,108,119,100",
                        "endOffsets": "148,250,348,446,553,662,782,883"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ar_values-ar.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ar/values-ar.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,148,250,345,448,551,653,767",
                        "endColumns": "92,101,94,102,102,101,113,100",
                        "endOffsets": "143,245,340,443,546,648,762,863"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-lo_values-lo.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-lo/values-lo.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,254,353,451,552,650,761",
                        "endColumns": "95,102,98,97,100,97,110,100",
                        "endOffsets": "146,249,348,446,547,645,756,857"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-am_values-am.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-am/values-am.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,148,248,345,444,540,642,742",
                        "endColumns": "92,99,96,98,95,101,99,100",
                        "endOffsets": "143,243,340,439,535,637,737,838"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-or_values-or.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-or/values-or.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,158,260,363,468,569,671,790",
                        "endColumns": "102,101,102,104,100,101,118,100",
                        "endOffsets": "153,255,358,463,564,666,785,886"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-eu_values-eu.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-eu/values-eu.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,256,356,459,564,667,786",
                        "endColumns": "97,102,99,102,104,102,118,100",
                        "endOffsets": "148,251,351,454,559,662,781,882"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-gl_values-gl.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-gl/values-gl.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,356,454,561,667,783",
                        "endColumns": "98,101,99,97,106,105,115,100",
                        "endOffsets": "149,251,351,449,556,662,778,879"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-pt-rPT_values-pt-rPT.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pt-rPT/values-pt-rPT.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,353,453,560,666,787",
                        "endColumns": "96,101,98,99,106,105,120,100",
                        "endOffsets": "147,249,348,448,555,661,782,883"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-sq_values-sq.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sq/values-sq.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,354,451,559,670,792",
                        "endColumns": "98,101,97,96,107,110,121,100",
                        "endOffsets": "149,251,349,446,554,665,787,888"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-en-rGB_values-en-rGB.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rGB/values-en-rGB.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,451,555,658,774",
                        "endColumns": "95,101,98,98,103,102,115,100",
                        "endOffsets": "146,248,347,446,550,653,769,870"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-lt_values-lt.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-lt/values-lt.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,263,362,465,576,686,806",
                        "endColumns": "97,109,98,102,110,109,119,100",
                        "endOffsets": "148,258,357,460,571,681,801,902"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-mr_values-mr.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-mr/values-mr.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,155,259,360,463,565,670,787",
                        "endColumns": "99,103,100,102,101,104,116,100",
                        "endOffsets": "150,254,355,458,560,665,782,883"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-lv_values-lv.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-lv/values-lv.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,355,456,563,671,786",
                        "endColumns": "97,101,99,100,106,107,114,100",
                        "endOffsets": "148,250,350,451,558,666,781,882"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-uk_values-uk.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-uk/values-uk.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,155,257,358,459,564,669,782",
                        "endColumns": "99,101,100,100,104,104,112,100",
                        "endOffsets": "150,252,353,454,559,664,777,878"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-az_values-az.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-az/values-az.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,156,258,361,465,566,671,782",
                        "endColumns": "100,101,102,103,100,104,110,100",
                        "endOffsets": "151,253,356,460,561,666,777,878"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-gu_values-gu.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-gu/values-gu.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,149,252,349,451,553,651,773",
                        "endColumns": "93,102,96,101,101,97,121,100",
                        "endOffsets": "144,247,344,446,548,646,768,869"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-is_values-is.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-is/values-is.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,257,354,454,557,661,772",
                        "endColumns": "94,106,96,99,102,103,110,100",
                        "endOffsets": "145,252,349,449,552,656,767,868"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-pa_values-pa.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pa/values-pa.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,355,456,558,656,785",
                        "endColumns": "97,101,99,100,101,97,128,100",
                        "endOffsets": "148,250,350,451,553,651,780,881"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-zh-rTW_values-zh-rTW.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zh-rTW/values-zh-rTW.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,147,246,340,434,527,620,716",
                        "endColumns": "91,98,93,93,92,92,95,100",
                        "endOffsets": "142,241,335,429,522,615,711,812"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ne_values-ne.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ne/values-ne.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,158,261,363,469,567,667,775",
                        "endColumns": "102,102,101,105,97,99,107,100",
                        "endOffsets": "153,256,358,464,562,662,770,871"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-pt-rBR_values-pt-rBR.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pt-rBR/values-pt-rBR.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,353,453,563,673,793",
                        "endColumns": "96,101,98,99,109,109,119,100",
                        "endOffsets": "147,249,348,448,558,668,788,889"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-fr-rCA_values-fr-rCA.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fr-rCA/values-fr-rCA.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,354,456,560,664,778",
                        "endColumns": "97,101,98,101,103,103,113,100",
                        "endOffsets": "148,250,349,451,555,659,773,874"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-hu_values-hu.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hu/values-hu.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,356,457,560,667,777",
                        "endColumns": "96,101,101,100,102,106,109,100",
                        "endOffsets": "147,249,351,452,555,662,772,873"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-km_values-km.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-km/values-km.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,253,351,451,552,664,776",
                        "endColumns": "94,102,97,99,100,111,111,100",
                        "endOffsets": "145,248,346,446,547,659,771,872"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-en-rAU_values-en-rAU.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rAU/values-en-rAU.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,451,555,658,774",
                        "endColumns": "95,101,98,98,103,102,115,100",
                        "endOffsets": "146,248,347,446,550,653,769,870"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-mk_values-mk.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-mk/values-mk.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,352,450,555,658,774",
                        "endColumns": "97,101,96,97,104,102,115,100",
                        "endOffsets": "148,250,347,445,550,653,769,870"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-el_values-el.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-el/values-el.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,256,356,459,567,673,790",
                        "endColumns": "97,102,99,102,107,105,116,100",
                        "endOffsets": "148,251,351,454,562,668,785,886"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-vi_values-vi.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-vi/values-vi.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,353,453,556,669,785",
                        "endColumns": "96,101,98,99,102,112,115,100",
                        "endOffsets": "147,249,348,448,551,664,780,881"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ja_values-ja.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ja/values-ja.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,147,247,341,437,530,623,724",
                        "endColumns": "91,99,93,95,92,92,100,100",
                        "endOffsets": "142,242,336,432,525,618,719,820"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-as_values-as.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-as/values-as.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,156,259,367,472,576,676,805",
                        "endColumns": "100,102,107,104,103,99,128,100",
                        "endOffsets": "151,254,362,467,571,671,800,901"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-nl_values-nl.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-nl/values-nl.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,157,259,359,459,566,670,789",
                        "endColumns": "101,101,99,99,106,103,118,100",
                        "endOffsets": "152,254,354,454,561,665,784,885"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-iw_values-iw.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-iw/values-iw.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,149,251,348,445,546,646,752",
                        "endColumns": "93,101,96,96,100,99,105,100",
                        "endOffsets": "144,246,343,440,541,641,747,848"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-hy_values-hy.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hy/values-hy.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,155,260,358,457,562,664,775",
                        "endColumns": "99,104,97,98,104,101,110,100",
                        "endOffsets": "150,255,353,452,557,659,770,871"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ur_values-ur.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ur/values-ur.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,357,461,564,662,776",
                        "endColumns": "97,101,101,103,102,97,113,100",
                        "endOffsets": "148,250,352,456,559,657,771,872"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-nb_values-nb.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-nb/values-nb.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,149,251,348,447,555,661,781",
                        "endColumns": "93,101,96,98,107,105,119,100",
                        "endOffsets": "144,246,343,442,550,656,776,877"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-fr_values-fr.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fr/values-fr.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,354,456,560,664,782",
                        "endColumns": "97,101,98,101,103,103,117,100",
                        "endOffsets": "148,250,349,451,555,659,777,878"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ta_values-ta.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ta/values-ta.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,254,353,451,558,673,801",
                        "endColumns": "95,102,98,97,106,114,127,100",
                        "endOffsets": "146,249,348,446,553,668,796,897"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-et_values-et.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-et/values-et.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,252,350,453,559,664,784",
                        "endColumns": "94,101,97,102,105,104,119,100",
                        "endOffsets": "145,247,345,448,554,659,779,880"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-fa_values-fa.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fa/values-fa.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,355,455,556,662,779",
                        "endColumns": "98,101,98,99,100,105,116,100",
                        "endOffsets": "149,251,350,450,551,657,774,875"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-tr_values-tr.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-tr/values-tr.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,352,449,551,657,768",
                        "endColumns": "96,101,97,96,101,105,110,100",
                        "endOffsets": "147,249,347,444,546,652,763,864"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-de_values-de.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-de/values-de.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,355,455,563,668,786",
                        "endColumns": "97,101,99,99,107,104,117,100",
                        "endOffsets": "148,250,350,450,558,663,781,882"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-bg_values-bg.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-bg/values-bg.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,262,364,465,572,677,796",
                        "endColumns": "96,109,101,100,106,104,118,100",
                        "endOffsets": "147,257,359,460,567,672,791,892"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-bs_values-bs.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-bs/values-bs.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,353,457,561,663,780",
                        "endColumns": "97,101,97,103,103,101,116,100",
                        "endOffsets": "148,250,348,452,556,658,775,876"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-sv_values-sv.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sv/values-sv.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,252,350,449,557,662,783",
                        "endColumns": "94,101,97,98,107,104,120,100",
                        "endOffsets": "145,247,345,444,552,657,778,879"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-be_values-be.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-be/values-be.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,355,456,562,665,786",
                        "endColumns": "97,101,99,100,105,102,120,100",
                        "endOffsets": "148,250,350,451,557,660,781,882"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-kk_values-kk.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-kk/values-kk.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,155,257,359,462,566,663,774",
                        "endColumns": "99,101,101,102,103,96,110,100",
                        "endOffsets": "150,252,354,457,561,658,769,870"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-v21_values-v21.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-v21/values-v21.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9,10,13",
                        "startColumns": "4,4,4,4,4,4,4,4,4,4",
                        "startOffsets": "55,173,237,304,368,484,610,736,864,1036",
                        "endLines": "2,3,4,5,6,7,8,9,12,17",
                        "endColumns": "117,63,66,63,115,125,125,127,12,12",
                        "endOffsets": "168,232,299,363,479,605,731,859,1031,1383"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-b+sr+Latn_values-b+sr+Latn.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-b+sr+Latn/values-b+sr+Latn.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,352,456,560,665,781",
                        "endColumns": "97,101,96,103,103,104,115,100",
                        "endOffsets": "148,250,347,451,555,660,776,877"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-pl_values-pl.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pl/values-pl.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,352,451,565,670,792",
                        "endColumns": "96,101,97,98,113,104,121,100",
                        "endOffsets": "147,249,347,446,560,665,787,888"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-ro_values-ro.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ro/values-ro.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,355,454,556,665,782",
                        "endColumns": "97,101,99,98,101,108,116,100",
                        "endOffsets": "148,250,350,449,551,660,777,878"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-zu_values-zu.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zu/values-zu.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,257,356,459,565,672,785",
                        "endColumns": "97,103,98,102,105,106,112,100",
                        "endOffsets": "148,252,351,454,560,667,780,881"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-hr_values-hr.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hr/values-hr.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,260,357,456,560,664,781",
                        "endColumns": "97,106,96,98,103,103,116,100",
                        "endOffsets": "148,255,352,451,555,659,776,877"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-th_values-th.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-th/values-th.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,254,352,450,553,658,770",
                        "endColumns": "95,102,97,97,102,104,111,100",
                        "endOffsets": "146,249,347,445,548,653,765,866"
                    }
                }
            ]
        },
        {
            "outputFile": "com.secondbrain.studylibrary.app-debug-22:/values-mn_values-mn.arsc.flat",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-mn/values-mn.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,356,454,559,671,790",
                        "endColumns": "97,101,100,97,104,111,118,100",
                        "endOffsets": "148,250,351,449,554,666,785,886"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-af.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-af/values-af.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-af/values-af.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,353,451,558,667,787",
                        "endColumns": "97,101,97,97,106,108,119,100",
                        "endOffsets": "148,250,348,446,553,662,782,883"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-am.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-am/values-am.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-am/values-am.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,148,248,345,444,540,642,742",
                        "endColumns": "92,99,96,98,95,101,99,100",
                        "endOffsets": "143,243,340,439,535,637,737,838"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ar.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ar/values-ar.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ar/values-ar.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,148,250,345,448,551,653,767",
                        "endColumns": "92,101,94,102,102,101,113,100",
                        "endOffsets": "143,245,340,443,546,648,762,863"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-as.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-as/values-as.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-as/values-as.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,156,259,367,472,576,676,805",
                        "endColumns": "100,102,107,104,103,99,128,100",
                        "endOffsets": "151,254,362,467,571,671,800,901"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-az.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-az/values-az.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-az/values-az.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,156,258,361,465,566,671,782",
                        "endColumns": "100,101,102,103,100,104,110,100",
                        "endOffsets": "151,253,356,460,561,666,777,878"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-b+sr+Latn.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-b+sr+Latn/values-b+sr+Latn.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-b+sr+Latn/values-b+sr+Latn.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,352,456,560,665,781",
                        "endColumns": "97,101,96,103,103,104,115,100",
                        "endOffsets": "148,250,347,451,555,660,776,877"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-be.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-be/values-be.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-be/values-be.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,355,456,562,665,786",
                        "endColumns": "97,101,99,100,105,102,120,100",
                        "endOffsets": "148,250,350,451,557,660,781,882"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-bg.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-bg/values-bg.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-bg/values-bg.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,262,364,465,572,677,796",
                        "endColumns": "96,109,101,100,106,104,118,100",
                        "endOffsets": "147,257,359,460,567,672,791,892"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-bn.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-bn/values-bn.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-bn/values-bn.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,358,461,562,664,784",
                        "endColumns": "98,101,101,102,100,101,119,100",
                        "endOffsets": "149,251,353,456,557,659,779,880"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-bs.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-bs/values-bs.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-bs/values-bs.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,353,457,561,663,780",
                        "endColumns": "97,101,97,103,103,101,116,100",
                        "endOffsets": "148,250,348,452,556,658,775,876"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ca.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ca/values-ca.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ca/values-ca.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,449,555,660,786",
                        "endColumns": "95,101,98,96,105,104,125,100",
                        "endOffsets": "146,248,347,444,550,655,781,882"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-cs.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-cs/values-cs.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-cs/values-cs.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,356,455,560,667,786",
                        "endColumns": "97,101,100,98,104,106,118,100",
                        "endOffsets": "148,250,351,450,555,662,781,882"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-da.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-da/values-da.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-da/values-da.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,350,448,555,664,782",
                        "endColumns": "95,101,96,97,106,108,117,100",
                        "endOffsets": "146,248,345,443,550,659,777,878"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-de.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-de/values-de.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-de/values-de.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,355,455,563,668,786",
                        "endColumns": "97,101,99,99,107,104,117,100",
                        "endOffsets": "148,250,350,450,558,663,781,882"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-el.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-el/values-el.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-el/values-el.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,256,356,459,567,673,790",
                        "endColumns": "97,102,99,102,107,105,116,100",
                        "endOffsets": "148,251,351,454,562,668,785,886"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-en-rAU.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-en-rAU/values-en-rAU.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rAU/values-en-rAU.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,451,555,658,774",
                        "endColumns": "95,101,98,98,103,102,115,100",
                        "endOffsets": "146,248,347,446,550,653,769,870"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-en-rCA.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-en-rCA/values-en-rCA.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rCA/values-en-rCA.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,451,555,657,773",
                        "endColumns": "95,101,98,98,103,101,115,100",
                        "endOffsets": "146,248,347,446,550,652,768,869"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-en-rGB.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-en-rGB/values-en-rGB.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rGB/values-en-rGB.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,451,555,658,774",
                        "endColumns": "95,101,98,98,103,102,115,100",
                        "endOffsets": "146,248,347,446,550,653,769,870"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-en-rIN.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-en-rIN/values-en-rIN.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rIN/values-en-rIN.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,451,555,658,774",
                        "endColumns": "95,101,98,98,103,102,115,100",
                        "endOffsets": "146,248,347,446,550,653,769,870"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-en-rXC.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-en-rXC/values-en-rXC.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-en-rXC/values-en-rXC.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,251,456,657,858,1065,1270,1482",
                        "endColumns": "195,204,200,200,206,204,211,203",
                        "endOffsets": "246,451,652,853,1060,1265,1477,1681"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-es-rUS.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-es-rUS/values-es-rUS.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-es-rUS/values-es-rUS.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,356,454,561,667,787",
                        "endColumns": "98,101,99,97,106,105,119,100",
                        "endOffsets": "149,251,351,449,556,662,782,883"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-es.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-es/values-es.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-es/values-es.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,356,454,561,667,787",
                        "endColumns": "98,101,99,97,106,105,119,100",
                        "endOffsets": "149,251,351,449,556,662,782,883"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-et.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-et/values-et.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-et/values-et.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,252,350,453,559,664,784",
                        "endColumns": "94,101,97,102,105,104,119,100",
                        "endOffsets": "145,247,345,448,554,659,779,880"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-eu.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-eu/values-eu.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-eu/values-eu.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,256,356,459,564,667,786",
                        "endColumns": "97,102,99,102,104,102,118,100",
                        "endOffsets": "148,251,351,454,559,662,781,882"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-fa.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-fa/values-fa.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fa/values-fa.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,355,455,556,662,779",
                        "endColumns": "98,101,98,99,100,105,116,100",
                        "endOffsets": "149,251,350,450,551,657,774,875"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-fi.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-fi/values-fi.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fi/values-fi.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,351,456,561,673,789",
                        "endColumns": "95,101,97,104,104,111,115,100",
                        "endOffsets": "146,248,346,451,556,668,784,885"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-fr-rCA.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-fr-rCA/values-fr-rCA.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fr-rCA/values-fr-rCA.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,354,456,560,664,778",
                        "endColumns": "97,101,98,101,103,103,113,100",
                        "endOffsets": "148,250,349,451,555,659,773,874"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-fr.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-fr/values-fr.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-fr/values-fr.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,354,456,560,664,782",
                        "endColumns": "97,101,98,101,103,103,117,100",
                        "endOffsets": "148,250,349,451,555,659,777,878"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-gl.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-gl/values-gl.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-gl/values-gl.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,356,454,561,667,783",
                        "endColumns": "98,101,99,97,106,105,115,100",
                        "endOffsets": "149,251,351,449,556,662,778,879"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-gu.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-gu/values-gu.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-gu/values-gu.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,149,252,349,451,553,651,773",
                        "endColumns": "93,102,96,101,101,97,121,100",
                        "endOffsets": "144,247,344,446,548,646,768,869"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-hi.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-hi/values-hi.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hi/values-hi.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,256,361,462,575,681,808",
                        "endColumns": "97,102,104,100,112,105,126,100",
                        "endOffsets": "148,251,356,457,570,676,803,904"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-hr.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-hr/values-hr.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hr/values-hr.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,260,357,456,560,664,781",
                        "endColumns": "97,106,96,98,103,103,116,100",
                        "endOffsets": "148,255,352,451,555,659,776,877"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-hu.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-hu/values-hu.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hu/values-hu.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,356,457,560,667,777",
                        "endColumns": "96,101,101,100,102,106,109,100",
                        "endOffsets": "147,249,351,452,555,662,772,873"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-hy.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-hy/values-hy.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-hy/values-hy.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,155,260,358,457,562,664,775",
                        "endColumns": "99,104,97,98,104,101,110,100",
                        "endOffsets": "150,255,353,452,557,659,770,871"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-in.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-in/values-in.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-in/values-in.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,252,349,446,552,670,785",
                        "endColumns": "94,101,96,96,105,117,114,100",
                        "endOffsets": "145,247,344,441,547,665,780,881"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-is.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-is/values-is.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-is/values-is.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,257,354,454,557,661,772",
                        "endColumns": "94,106,96,99,102,103,110,100",
                        "endOffsets": "145,252,349,449,552,656,767,868"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-it.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-it/values-it.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-it/values-it.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,354,456,565,672,802",
                        "endColumns": "97,101,98,101,108,106,129,100",
                        "endOffsets": "148,250,349,451,560,667,797,898"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-iw.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-iw/values-iw.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-iw/values-iw.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,149,251,348,445,546,646,752",
                        "endColumns": "93,101,96,96,100,99,105,100",
                        "endOffsets": "144,246,343,440,541,641,747,848"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ja.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ja/values-ja.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ja/values-ja.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,147,247,341,437,530,623,724",
                        "endColumns": "91,99,93,95,92,92,100,100",
                        "endOffsets": "142,242,336,432,525,618,719,820"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ka.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ka/values-ka.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ka/values-ka.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,352,451,557,661,779",
                        "endColumns": "95,101,98,98,105,103,117,100",
                        "endOffsets": "146,248,347,446,552,656,774,875"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-kk.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-kk/values-kk.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-kk/values-kk.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,155,257,359,462,566,663,774",
                        "endColumns": "99,101,101,102,103,96,110,100",
                        "endOffsets": "150,252,354,457,561,658,769,870"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-km.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-km/values-km.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-km/values-km.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,253,351,451,552,664,776",
                        "endColumns": "94,102,97,99,100,111,111,100",
                        "endOffsets": "145,248,346,446,547,659,771,872"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-kn.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-kn/values-kn.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-kn/values-kn.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,256,357,463,564,672,800",
                        "endColumns": "97,102,100,105,100,107,127,100",
                        "endOffsets": "148,251,352,458,559,667,795,896"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ko.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ko/values-ko.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ko/values-ko.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,147,247,341,438,534,632,732",
                        "endColumns": "91,99,93,96,95,97,99,100",
                        "endOffsets": "142,242,336,433,529,627,727,828"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ky.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ky/values-ky.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ky/values-ky.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,155,257,360,467,569,673,784",
                        "endColumns": "99,101,102,106,101,103,110,100",
                        "endOffsets": "150,252,355,462,564,668,779,880"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-lo.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-lo/values-lo.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-lo/values-lo.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,254,353,451,552,650,761",
                        "endColumns": "95,102,98,97,100,97,110,100",
                        "endOffsets": "146,249,348,446,547,645,756,857"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-lt.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-lt/values-lt.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-lt/values-lt.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,263,362,465,576,686,806",
                        "endColumns": "97,109,98,102,110,109,119,100",
                        "endOffsets": "148,258,357,460,571,681,801,902"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-lv.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-lv/values-lv.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-lv/values-lv.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,355,456,563,671,786",
                        "endColumns": "97,101,99,100,106,107,114,100",
                        "endOffsets": "148,250,350,451,558,666,781,882"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-mk.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-mk/values-mk.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-mk/values-mk.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,352,450,555,658,774",
                        "endColumns": "97,101,96,97,104,102,115,100",
                        "endOffsets": "148,250,347,445,550,653,769,870"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ml.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ml/values-ml.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ml/values-ml.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,157,260,362,466,569,670,792",
                        "endColumns": "101,102,101,103,102,100,121,100",
                        "endOffsets": "152,255,357,461,564,665,787,888"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-mn.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-mn/values-mn.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-mn/values-mn.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,356,454,559,671,790",
                        "endColumns": "97,101,100,97,104,111,118,100",
                        "endOffsets": "148,250,351,449,554,666,785,886"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-mr.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-mr/values-mr.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-mr/values-mr.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,155,259,360,463,565,670,787",
                        "endColumns": "99,103,100,102,101,104,116,100",
                        "endOffsets": "150,254,355,458,560,665,782,883"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ms.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ms/values-ms.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ms/values-ms.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,252,349,459,565,683,798",
                        "endColumns": "94,101,96,109,105,117,114,100",
                        "endOffsets": "145,247,344,454,560,678,793,894"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-my.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-my/values-my.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-my/values-my.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,158,262,365,467,572,678,797",
                        "endColumns": "102,103,102,101,104,105,118,100",
                        "endOffsets": "153,257,360,462,567,673,792,893"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-nb.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-nb/values-nb.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-nb/values-nb.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,149,251,348,447,555,661,781",
                        "endColumns": "93,101,96,98,107,105,119,100",
                        "endOffsets": "144,246,343,442,550,656,776,877"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ne.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ne/values-ne.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ne/values-ne.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,158,261,363,469,567,667,775",
                        "endColumns": "102,102,101,105,97,99,107,100",
                        "endOffsets": "153,256,358,464,562,662,770,871"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-nl.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-nl/values-nl.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-nl/values-nl.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,157,259,359,459,566,670,789",
                        "endColumns": "101,101,99,99,106,103,118,100",
                        "endOffsets": "152,254,354,454,561,665,784,885"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-or.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-or/values-or.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-or/values-or.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,158,260,363,468,569,671,790",
                        "endColumns": "102,101,102,104,100,101,118,100",
                        "endOffsets": "153,255,358,463,564,666,785,886"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-pa.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-pa/values-pa.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pa/values-pa.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,355,456,558,656,785",
                        "endColumns": "97,101,99,100,101,97,128,100",
                        "endOffsets": "148,250,350,451,553,651,780,881"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-pl.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-pl/values-pl.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pl/values-pl.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,352,451,565,670,792",
                        "endColumns": "96,101,97,98,113,104,121,100",
                        "endOffsets": "147,249,347,446,560,665,787,888"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-pt-rBR.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-pt-rBR/values-pt-rBR.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pt-rBR/values-pt-rBR.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,353,453,563,673,793",
                        "endColumns": "96,101,98,99,109,109,119,100",
                        "endOffsets": "147,249,348,448,558,668,788,889"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-pt-rPT.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-pt-rPT/values-pt-rPT.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pt-rPT/values-pt-rPT.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,353,453,560,666,787",
                        "endColumns": "96,101,98,99,106,105,120,100",
                        "endOffsets": "147,249,348,448,555,661,782,883"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-pt.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-pt/values-pt.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-pt/values-pt.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,353,453,563,673,793",
                        "endColumns": "96,101,98,99,109,109,119,100",
                        "endOffsets": "147,249,348,448,558,668,788,889"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ro.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ro/values-ro.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ro/values-ro.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,355,454,556,665,782",
                        "endColumns": "97,101,99,98,101,108,116,100",
                        "endOffsets": "148,250,350,449,551,660,777,878"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ru.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ru/values-ru.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ru/values-ru.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,356,457,562,665,782",
                        "endColumns": "97,101,100,100,104,102,116,100",
                        "endOffsets": "148,250,351,452,557,660,777,878"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-si.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-si/values-si.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-si/values-si.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,157,260,365,470,569,673,787",
                        "endColumns": "101,102,104,104,98,103,113,100",
                        "endOffsets": "152,255,360,465,564,668,782,883"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-sk.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-sk/values-sk.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sk/values-sk.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,253,354,452,562,670,792",
                        "endColumns": "95,101,100,97,109,107,121,100",
                        "endOffsets": "146,248,349,447,557,665,787,888"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-sl.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-sl/values-sl.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sl/values-sl.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,352,456,559,661,778",
                        "endColumns": "96,101,97,103,102,101,116,100",
                        "endOffsets": "147,249,347,451,554,656,773,874"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-sq.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-sq/values-sq.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sq/values-sq.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,154,256,354,451,559,670,792",
                        "endColumns": "98,101,97,96,107,110,121,100",
                        "endOffsets": "149,251,349,446,554,665,787,888"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-sr.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-sr/values-sr.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sr/values-sr.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,352,456,560,665,781",
                        "endColumns": "97,101,96,103,103,104,115,100",
                        "endOffsets": "148,250,347,451,555,660,776,877"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-sv.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-sv/values-sv.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sv/values-sv.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,150,252,350,449,557,662,783",
                        "endColumns": "94,101,97,98,107,104,120,100",
                        "endOffsets": "145,247,345,444,552,657,778,879"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-sw.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-sw/values-sw.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-sw/values-sw.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,149,251,348,449,556,663,778",
                        "endColumns": "93,101,96,100,106,106,114,100",
                        "endOffsets": "144,246,343,444,551,658,773,874"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ta.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ta/values-ta.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ta/values-ta.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,254,353,451,558,673,801",
                        "endColumns": "95,102,98,97,106,114,127,100",
                        "endOffsets": "146,249,348,446,553,668,796,897"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-te.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-te/values-te.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-te/values-te.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,157,265,367,468,574,681,805",
                        "endColumns": "101,107,101,100,105,106,123,100",
                        "endOffsets": "152,260,362,463,569,676,800,901"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-th.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-th/values-th.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-th/values-th.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,151,254,352,450,553,658,770",
                        "endColumns": "95,102,97,97,102,104,111,100",
                        "endOffsets": "146,249,347,445,548,653,765,866"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-tl.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-tl/values-tl.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-tl/values-tl.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,355,452,559,667,789",
                        "endColumns": "96,101,100,96,106,107,121,100",
                        "endOffsets": "147,249,350,447,554,662,784,885"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-tr.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-tr/values-tr.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-tr/values-tr.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,352,449,551,657,768",
                        "endColumns": "96,101,97,96,101,105,110,100",
                        "endOffsets": "147,249,347,444,546,652,763,864"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-uk.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-uk/values-uk.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-uk/values-uk.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,155,257,358,459,564,669,782",
                        "endColumns": "99,101,100,100,104,104,112,100",
                        "endOffsets": "150,252,353,454,559,664,777,878"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-ur.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-ur/values-ur.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-ur/values-ur.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,255,357,461,564,662,776",
                        "endColumns": "97,101,101,103,102,97,113,100",
                        "endOffsets": "148,250,352,456,559,657,771,872"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-uz.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-uz/values-uz.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-uz/values-uz.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,157,259,360,460,568,672,791",
                        "endColumns": "101,101,100,99,107,103,118,100",
                        "endOffsets": "152,254,355,455,563,667,786,887"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-v21.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-v21/values-v21.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-v21/values-v21.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9,10,13",
                        "startColumns": "4,4,4,4,4,4,4,4,4,4",
                        "startOffsets": "55,173,237,304,368,484,610,736,864,1036",
                        "endLines": "2,3,4,5,6,7,8,9,12,17",
                        "endColumns": "117,63,66,63,115,125,125,127,12,12",
                        "endOffsets": "168,232,299,363,479,605,731,859,1031,1383"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-vi.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-vi/values-vi.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-vi/values-vi.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,152,254,353,453,556,669,785",
                        "endColumns": "96,101,98,99,102,112,115,100",
                        "endOffsets": "147,249,348,448,551,664,780,881"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-zh-rCN.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-zh-rCN/values-zh-rCN.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zh-rCN/values-zh-rCN.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,147,248,342,436,529,623,719",
                        "endColumns": "91,100,93,93,92,93,95,100",
                        "endOffsets": "142,243,337,431,524,618,714,815"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-zh-rHK.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-zh-rHK/values-zh-rHK.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zh-rHK/values-zh-rHK.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,147,246,340,434,527,620,716",
                        "endColumns": "91,98,93,93,92,92,95,100",
                        "endOffsets": "142,241,335,429,522,615,711,812"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-zh-rTW.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-zh-rTW/values-zh-rTW.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zh-rTW/values-zh-rTW.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,147,246,340,434,527,620,716",
                        "endColumns": "91,98,93,93,92,92,95,100",
                        "endOffsets": "142,241,335,429,522,615,711,812"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values-zu.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values-zu/values-zu.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values-zu/values-zu.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9",
                        "startColumns": "4,4,4,4,4,4,4,4",
                        "startOffsets": "55,153,257,356,459,565,672,785",
                        "endColumns": "97,103,98,102,105,106,112,100",
                        "endOffsets": "148,252,351,454,560,667,780,881"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/multi-v2/values.json

````json
{
    "logs": [
        {
            "outputFile": "com.secondbrain.studylibrary.app-mergeDebugResources-20:/values/values.xml",
            "map": [
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/0ce746c579773c78d982a1aca321ba9d/transformed/activity-1.10.1/res/values/values.xml",
                    "from": {
                        "startLines": "2,3",
                        "startColumns": "4,4",
                        "startOffsets": "55,97",
                        "endColumns": "41,59",
                        "endOffsets": "92,152"
                    },
                    "to": {
                        "startLines": "68,87",
                        "startColumns": "4,4",
                        "startOffsets": "4197,5184",
                        "endColumns": "41,59",
                        "endOffsets": "4234,5239"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/3e85dc3a27e7bbf172ac49206d18ddee/transformed/core-1.15.0/res/values/values.xml",
                    "from": {
                        "startLines": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,98,99,103,104,105,106,112,122,157,178,211",
                        "startColumns": "4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4",
                        "startOffsets": "55,115,187,275,340,406,475,538,608,676,748,818,879,953,1026,1087,1148,1210,1274,1336,1397,1465,1565,1625,1691,1764,1833,1890,1942,2004,2076,2152,2217,2276,2335,2395,2455,2515,2575,2635,2695,2755,2815,2875,2935,2994,3054,3114,3174,3234,3294,3354,3414,3474,3534,3594,3653,3713,3773,3832,3891,3950,4009,4068,4127,4162,4197,4252,4315,4370,4428,4486,4547,4610,4667,4718,4768,4829,4886,4952,4986,5021,5056,5126,5193,5265,5334,5403,5477,5549,5637,5708,5825,6026,6136,6337,6466,6538,6605,6808,7109,8915,9596,10278",
                        "endLines": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,97,98,102,103,104,105,111,121,156,177,210,216",
                        "endColumns": "59,71,87,64,65,68,62,69,67,71,69,60,73,72,60,60,61,63,61,60,67,99,59,65,72,68,56,51,61,71,75,64,58,58,59,59,59,59,59,59,59,59,59,59,58,59,59,59,59,59,59,59,59,59,59,58,59,59,58,58,58,58,58,58,34,34,54,62,54,57,57,60,62,56,50,49,60,56,65,33,34,34,69,66,71,68,68,73,71,87,70,116,12,109,12,128,71,66,24,24,24,24,24,24",
                        "endOffsets": "110,182,270,335,401,470,533,603,671,743,813,874,948,1021,1082,1143,1205,1269,1331,1392,1460,1560,1620,1686,1759,1828,1885,1937,1999,2071,2147,2212,2271,2330,2390,2450,2510,2570,2630,2690,2750,2810,2870,2930,2989,3049,3109,3169,3229,3289,3349,3409,3469,3529,3589,3648,3708,3768,3827,3886,3945,4004,4063,4122,4157,4192,4247,4310,4365,4423,4481,4542,4605,4662,4713,4763,4824,4881,4947,4981,5016,5051,5121,5188,5260,5329,5398,5472,5544,5632,5703,5820,6021,6131,6332,6461,6533,6600,6803,7104,8910,9591,10273,10440"
                    },
                    "to": {
                        "startLines": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,90,93,94,95,96,97,98,99,105,106,107,111,112,116,126,127,128,134,144,179,200,233",
                        "startColumns": "4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4",
                        "startOffsets": "55,115,187,275,340,406,475,538,608,676,748,818,879,953,1026,1087,1148,1210,1274,1336,1397,1465,1565,1625,1691,1764,1833,1890,1942,2004,2076,2152,2217,2276,2335,2395,2455,2515,2575,2635,2695,2755,2815,2875,2935,2994,3054,3114,3174,3234,3294,3354,3414,3474,3534,3594,3653,3713,3773,3832,3891,3950,4009,4068,4127,4162,4239,4294,4357,4412,4470,4528,4589,4652,4709,4760,4810,4871,4928,4994,5028,5063,5348,5565,5632,5704,5773,5842,5916,5988,6554,6625,6742,6943,7053,7254,7913,7985,8052,8255,8556,10362,11043,11725",
                        "endLines": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,90,93,94,95,96,97,98,99,105,106,110,111,115,116,126,127,133,143,178,199,232,238",
                        "endColumns": "59,71,87,64,65,68,62,69,67,71,69,60,73,72,60,60,61,63,61,60,67,99,59,65,72,68,56,51,61,71,75,64,58,58,59,59,59,59,59,59,59,59,59,59,58,59,59,59,59,59,59,59,59,59,59,58,59,59,58,58,58,58,58,58,34,34,54,62,54,57,57,60,62,56,50,49,60,56,65,33,34,34,69,66,71,68,68,73,71,87,70,116,12,109,12,128,71,66,24,24,24,24,24,24",
                        "endOffsets": "110,182,270,335,401,470,533,603,671,743,813,874,948,1021,1082,1143,1205,1269,1331,1392,1460,1560,1620,1686,1759,1828,1885,1937,1999,2071,2147,2212,2271,2330,2390,2450,2510,2570,2630,2690,2750,2810,2870,2930,2989,3049,3109,3169,3229,3289,3349,3409,3469,3529,3589,3648,3708,3768,3827,3886,3945,4004,4063,4122,4157,4192,4289,4352,4407,4465,4523,4584,4647,4704,4755,4805,4866,4923,4989,5023,5058,5093,5413,5627,5699,5768,5837,5911,5983,6071,6620,6737,6938,7048,7249,7378,7980,8047,8250,8551,10357,11038,11720,11887"
                    }
                },
                {
                    "source": "/Users/gchikoti/Music/study-library/android/app/src/main/res/values/themes.xml",
                    "from": {
                        "startLines": "1",
                        "startColumns": "4",
                        "startOffsets": "16",
                        "endLines": "9",
                        "endColumns": "12",
                        "endOffsets": "541"
                    },
                    "to": {
                        "startLines": "117",
                        "startColumns": "4",
                        "startOffsets": "7383",
                        "endLines": "125",
                        "endColumns": "12",
                        "endOffsets": "7908"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/1ccb3f3e0d6c941de3653f71b709c6a9/transformed/lifecycle-viewmodel-2.6.2/res/values/values.xml",
                    "from": {
                        "startLines": "2",
                        "startColumns": "4",
                        "startOffsets": "55",
                        "endColumns": "49",
                        "endOffsets": "100"
                    },
                    "to": {
                        "startLines": "89",
                        "startColumns": "4",
                        "startOffsets": "5298",
                        "endColumns": "49",
                        "endOffsets": "5343"
                    }
                },
                {
                    "source": "/Users/gchikoti/Music/study-library/android/app/src/main/res/values/strings.xml",
                    "from": {
                        "startLines": "1,6,5,4,2,3",
                        "startColumns": "4,4,4,4,4,4",
                        "startOffsets": "16,486,398,310,80,199",
                        "endColumns": "63,71,87,87,118,110",
                        "endOffsets": "75,553,481,393,194,305"
                    },
                    "to": {
                        "startLines": "92,100,101,102,103,104",
                        "startColumns": "4,4,4,4,4,4",
                        "startOffsets": "5501,6076,6148,6236,6324,6443",
                        "endColumns": "63,71,87,87,118,110",
                        "endOffsets": "5560,6143,6231,6319,6438,6549"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/6f57d445dc2b7b17599cecc7d5b53684/transformed/savedstate-1.2.1/res/values/values.xml",
                    "from": {
                        "startLines": "2",
                        "startColumns": "4",
                        "startOffsets": "55",
                        "endColumns": "53",
                        "endOffsets": "104"
                    },
                    "to": {
                        "startLines": "88",
                        "startColumns": "4",
                        "startOffsets": "5244",
                        "endColumns": "53",
                        "endOffsets": "5293"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/2b6cda71f2c63e15028aecb216a7e1e3/transformed/lifecycle-runtime-2.6.2/res/values/values.xml",
                    "from": {
                        "startLines": "2",
                        "startColumns": "4",
                        "startOffsets": "55",
                        "endColumns": "42",
                        "endOffsets": "93"
                    },
                    "to": {
                        "startLines": "86",
                        "startColumns": "4",
                        "startOffsets": "5141",
                        "endColumns": "42",
                        "endOffsets": "5179"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/310728483b1ffcc4b83ed17145c8c204/transformed/startup-runtime-1.1.1/res/values/values.xml",
                    "from": {
                        "startLines": "2",
                        "startColumns": "4",
                        "startOffsets": "55",
                        "endColumns": "82",
                        "endOffsets": "133"
                    },
                    "to": {
                        "startLines": "91",
                        "startColumns": "4",
                        "startOffsets": "5418",
                        "endColumns": "82",
                        "endOffsets": "5496"
                    }
                },
                {
                    "source": "/Users/gchikoti/.gradle/caches/8.9/transforms/a48e7e82dca0cf42a42eeecf8a2a0e74/transformed/core-viewtree-1.0.0/res/values/values.xml",
                    "from": {
                        "startLines": "2",
                        "startColumns": "4",
                        "startOffsets": "55",
                        "endColumns": "42",
                        "endOffsets": "93"
                    },
                    "to": {
                        "startLines": "85",
                        "startColumns": "4",
                        "startOffsets": "5098",
                        "endColumns": "42",
                        "endOffsets": "5136"
                    }
                }
            ]
        }
    ]
}
````

## File: android/app/build/intermediates/merged_res_blame_folder/debug/mergeDebugResources/out/single/mergeDebugResources.json

````json
[
    {
        "merged": "com.secondbrain.studylibrary.app-debug-22:/drawable_ic_library.xml.flat",
        "source": "com.secondbrain.studylibrary.app-main-24:/drawable/ic_library.xml"
    },
    {
        "merged": "com.secondbrain.studylibrary.app-debug-22:/layout_activity_main.xml.flat",
        "source": "com.secondbrain.studylibrary.app-main-24:/layout/activity_main.xml"
    }
]
````

## File: android/app/build/intermediates/navigation_json/debug/extractDeepLinksDebug/navigation.json

````json
[]
````

## File: android/app/build/intermediates/packaged_manifests/debug/processDebugManifestForPackage/AndroidManifest.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.secondbrain.studylibrary.debug"
    android:versionCode="1"
    android:versionName="1.0.0-debug" >

    <uses-sdk
        android:minSdkVersion="26"
        android:targetSdkVersion="35" />

    <uses-permission android:name="android.permission.INTERNET" />

    <permission
        android:name="com.secondbrain.studylibrary.debug.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"
        android:protectionLevel="signature" />

    <uses-permission android:name="com.secondbrain.studylibrary.debug.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION" />

    <application
        android:allowBackup="true"
        android:appComponentFactory="androidx.core.app.CoreComponentFactory"
        android:debuggable="true"
        android:extractNativeLibs="false"
        android:icon="@drawable/ic_library"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_library"
        android:supportsRtl="true"
        android:theme="@style/Theme.StudyLibrary"
        android:usesCleartextTraffic="false" >
        <activity
            android:name="com.secondbrain.studylibrary.MainActivity"
            android:exported="true"
            android:screenOrientation="unspecified" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.startup.InitializationProvider"
            android:authorities="com.secondbrain.studylibrary.debug.androidx-startup"
            android:exported="false" >
            <meta-data
                android:name="androidx.profileinstaller.ProfileInstallerInitializer"
                android:value="androidx.startup" />
        </provider>

        <receiver
            android:name="androidx.profileinstaller.ProfileInstallReceiver"
            android:directBootAware="false"
            android:enabled="true"
            android:exported="true"
            android:permission="android.permission.DUMP" >
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.INSTALL_PROFILE" />
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.SKIP_FILE" />
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.SAVE_PROFILE" />
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.BENCHMARK_OPERATION" />
            </intent-filter>
        </receiver>
    </application>

</manifest>
````

## File: android/app/build/intermediates/packaged_manifests/debug/processDebugManifestForPackage/output-metadata.json

````json
{
  "version": 3,
  "artifactType": {
    "type": "PACKAGED_MANIFESTS",
    "kind": "Directory"
  },
  "applicationId": "com.secondbrain.studylibrary.debug",
  "variantName": "debug",
  "elements": [
    {
      "type": "SINGLE",
      "filters": [],
      "attributes": [],
      "versionCode": 1,
      "versionName": "1.0.0-debug",
      "outputFile": "AndroidManifest.xml"
    }
  ],
  "elementType": "File"
}
````

## File: android/app/build/intermediates/packaged_res/debug/packageDebugResources/drawable/ic_library.xml

````xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="48dp"
    android:height="48dp"
    android:viewportWidth="48"
    android:viewportHeight="48">
    <path
        android:fillColor="#1E6B68"
        android:pathData="M8,9c0,-1.1 0.9,-2 2,-2h12c3.3,0 6,2.7 6,6v26c-1.7,-1.3 -3.7,-2 -6,-2H10c-1.1,0 -2,-0.9 -2,-2V9z" />
    <path
        android:fillColor="#E66D43"
        android:pathData="M40,9c0,-1.1 -0.9,-2 -2,-2H26c-3.3,0 -6,2.7 -6,6v26c1.7,-1.3 3.7,-2 6,-2h12c1.1,0 2,-0.9 2,-2V9z" />
    <path
        android:fillColor="#F4F0E7"
        android:pathData="M13,15h9v2h-9zM13,20h9v2h-9zM26,15h9v2h-9zM26,20h9v2h-9z" />
</vector>
````

## File: android/app/build/intermediates/packaged_res/debug/packageDebugResources/layout/activity_main.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#F4F0E7">

    <WebView
        android:id="@+id/library_web_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:overScrollMode="never" />

    <ProgressBar
        android:id="@+id/loading_progress"
        style="?android:attr/progressBarStyleLarge"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:indeterminateTint="#1E6B68" />

    <LinearLayout
        android:id="@+id/error_panel"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_gravity="center"
        android:background="#F4F0E7"
        android:gravity="center"
        android:orientation="vertical"
        android:padding="32dp"
        android:visibility="gone">

        <TextView
            android:id="@+id/error_title"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Study Library unavailable"
            android:textColor="#1D2523"
            android:textSize="22sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/error_message"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:gravity="center"
            android:textColor="#71807A"
            android:textSize="14sp" />

        <Button
            android:id="@+id/retry_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp"
            android:text="Try again"
            android:textColor="#FFFFFF" />
    </LinearLayout>
</FrameLayout>
````

## File: android/app/build/intermediates/packaged_res/debug/packageDebugResources/values/values.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Second Brain Study Library</string>
    <string name="download_description">Study Library download</string>
    <string name="external_link_error">This external link could not be opened.</string>
    <string name="https_required">Release builds require an HTTPS library URL.</string>
    <string name="network_error">The study library could not be reached. Check your connection and try again.</string>
    <string name="reader_restarted">The reader restarted unexpectedly. Try loading the library again.</string>
    <style name="Theme.StudyLibrary" parent="android:style/Theme.Material.Light.NoActionBar">
        <item name="android:fontFamily">sans</item>
        <item name="android:windowActionModeOverlay">true</item>
        <item name="android:colorAccent">#1E6B68</item>
        <item name="android:statusBarColor">#F4F0E7</item>
        <item name="android:navigationBarColor">#F4F0E7</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
    </style>
</resources>
````

## File: android/app/build/intermediates/signing_config_versions/debug/writeDebugSigningConfigVersions/signing-config-versions.json

````json
{"enableV1Signing":false,"enableV2Signing":true,"enableV3Signing":false,"enableV4Signing":false}
````

## File: android/app/build/outputs/apk/debug/output-metadata.json

````json
{
  "version": 3,
  "artifactType": {
    "type": "APK",
    "kind": "Directory"
  },
  "applicationId": "com.secondbrain.studylibrary.debug",
  "variantName": "debug",
  "elements": [
    {
      "type": "SINGLE",
      "filters": [],
      "attributes": [],
      "versionCode": 1,
      "versionName": "1.0.0-debug",
      "outputFile": "app-debug.apk"
    }
  ],
  "elementType": "File",
  "minSdkVersionForDexing": 26
}
````

## File: android/app/proguard-rules.pro

````
# The WebView JavaScript bridge is intentionally not used. Keep the wrapper small.
````

## File: android/app/src/main/AndroidManifest.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_library"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_library"
        android:supportsRtl="true"
        android:theme="@style/Theme.StudyLibrary"
        android:usesCleartextTraffic="${allowCleartext}">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="unspecified">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
````

## File: android/app/src/main/java/com/secondbrain/studylibrary/MainActivity.kt

````kotlin
package com.secondbrain.studylibrary

import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.view.View
import android.webkit.CookieManager
import android.webkit.DownloadListener
import android.webkit.RenderProcessGoneDetail
import android.webkit.URLUtil
import android.webkit.WebResourceRequest
import android.webkit.WebResourceError
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private lateinit var progress: ProgressBar
    private lateinit var errorPanel: View
    private lateinit var errorMessage: TextView
    private lateinit var libraryUri: Uri

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        webView = findViewById(R.id.library_web_view)
        progress = findViewById(R.id.loading_progress)
        errorPanel = findViewById(R.id.error_panel)
        errorMessage = findViewById(R.id.error_message)
        libraryUri = Uri.parse(BuildConfig.LIBRARY_URL)

        configureWebView()
        findViewById<Button>(R.id.retry_button).setOnClickListener { loadLibrary() }
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack() else finish()
            }
        })

        if (savedInstanceState == null) loadLibrary() else webView.restoreState(savedInstanceState)
    }

    private fun configureWebView() {
        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            builtInZoomControls = false
            displayZoomControls = false
            mediaPlaybackRequiresUserGesture = true
        }
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val host = request.url.host
                return if (host == libraryUri.host) false else openExternal(request.url)
            }

            override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
                progress.visibility = View.VISIBLE
                errorPanel.visibility = View.GONE
                super.onPageStarted(view, url, favicon)
            }

            override fun onPageFinished(view: WebView, url: String) {
                progress.visibility = View.GONE
                errorPanel.visibility = View.GONE
                CookieManager.getInstance().flush()
                super.onPageFinished(view, url)
            }

            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                super.onReceivedError(view, request, error)
                if (request.isForMainFrame) showError(getString(R.string.network_error))
            }

            override fun onRenderProcessGone(view: WebView, detail: RenderProcessGoneDetail): Boolean {
                showError(getString(R.string.reader_restarted))
                return true
            }
        }
        webView.setDownloadListener(DownloadListener { url, userAgent, contentDisposition, mimeType, _ ->
            val request = DownloadManager.Request(Uri.parse(url))
            request.setMimeType(mimeType)
            request.addRequestHeader("User-Agent", userAgent)
            CookieManager.getInstance().getCookie(url)?.let { request.addRequestHeader("Cookie", it) }
            request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimeType))
            request.setDescription(getString(R.string.download_description))
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, URLUtil.guessFileName(url, contentDisposition, mimeType))
            getSystemService(DownloadManager::class.java).enqueue(request)
        })
    }

    private fun loadLibrary() {
        if (!BuildConfig.DEBUG && libraryUri.scheme != "https") {
            showError(getString(R.string.https_required))
            return
        }
        errorPanel.visibility = View.GONE
        webView.visibility = View.VISIBLE
        webView.loadUrl(BuildConfig.LIBRARY_URL)
    }

    private fun openExternal(uri: Uri): Boolean {
        return try {
            startActivity(Intent(Intent.ACTION_VIEW, uri))
            true
        } catch (_: Exception) {
            showError(getString(R.string.external_link_error))
            true
        }
    }

    private fun showError(message: String) {
        progress.visibility = View.GONE
        webView.visibility = View.GONE
        errorMessage.text = message
        errorPanel.visibility = View.VISIBLE
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onDestroy() {
        CookieManager.getInstance().flush()
        webView.stopLoading()
        webView.destroy()
        super.onDestroy()
    }
}
````

## File: android/app/src/main/res/drawable/ic_library.xml

````xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="48dp"
    android:height="48dp"
    android:viewportWidth="48"
    android:viewportHeight="48">
    <path
        android:fillColor="#1E6B68"
        android:pathData="M8,9c0,-1.1 0.9,-2 2,-2h12c3.3,0 6,2.7 6,6v26c-1.7,-1.3 -3.7,-2 -6,-2H10c-1.1,0 -2,-0.9 -2,-2V9z" />
    <path
        android:fillColor="#E66D43"
        android:pathData="M40,9c0,-1.1 -0.9,-2 -2,-2H26c-3.3,0 -6,2.7 -6,6v26c1.7,-1.3 3.7,-2 6,-2h12c1.1,0 2,-0.9 2,-2V9z" />
    <path
        android:fillColor="#F4F0E7"
        android:pathData="M13,15h9v2h-9zM13,20h9v2h-9zM26,15h9v2h-9zM26,20h9v2h-9z" />
</vector>
````

## File: android/app/src/main/res/layout/activity_main.xml

````xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#F4F0E7">

    <WebView
        android:id="@+id/library_web_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:overScrollMode="never" />

    <ProgressBar
        android:id="@+id/loading_progress"
        style="?android:attr/progressBarStyleLarge"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:indeterminateTint="#1E6B68" />

    <LinearLayout
        android:id="@+id/error_panel"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_gravity="center"
        android:background="#F4F0E7"
        android:gravity="center"
        android:orientation="vertical"
        android:padding="32dp"
        android:visibility="gone">

        <TextView
            android:id="@+id/error_title"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Study Library unavailable"
            android:textColor="#1D2523"
            android:textSize="22sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/error_message"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:gravity="center"
            android:textColor="#71807A"
            android:textSize="14sp" />

        <Button
            android:id="@+id/retry_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp"
            android:text="Try again"
            android:textColor="#FFFFFF" />
    </LinearLayout>
</FrameLayout>
````

## File: android/app/src/main/res/values/strings.xml

````xml
<resources>
    <string name="app_name">Second Brain Study Library</string>
    <string name="network_error">The study library could not be reached. Check your connection and try again.</string>
    <string name="reader_restarted">The reader restarted unexpectedly. Try loading the library again.</string>
    <string name="https_required">Release builds require an HTTPS library URL.</string>
    <string name="external_link_error">This external link could not be opened.</string>
    <string name="download_description">Study Library download</string>
</resources>
````

## File: android/app/src/main/res/values/themes.xml

````xml
<resources>
    <style name="Theme.StudyLibrary" parent="android:style/Theme.Material.Light.NoActionBar">
        <item name="android:fontFamily">sans</item>
        <item name="android:windowActionModeOverlay">true</item>
        <item name="android:colorAccent">#1E6B68</item>
        <item name="android:statusBarColor">#F4F0E7</item>
        <item name="android:navigationBarColor">#F4F0E7</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:windowLightNavigationBar">true</item>
    </style>
</resources>
````

## File: android/build.gradle.kts

````kotlin
plugins {
    id("com.android.application") version "8.7.3" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
}
````

## File: android/gradle.properties

````
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
````

## File: android/gradle/wrapper/gradle-wrapper.properties

````
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
````

## File: android/settings.gradle.kts

````kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "study-library-android"
include(":app")
````

