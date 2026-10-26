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
