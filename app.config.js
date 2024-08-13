import 'dotenv/config';

export default {
    "expo": {
      "name": "aushilfappsupa",
      "slug": "aushilfappsupa",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/images/bienenlogo.png",
      "scheme": "myapp",
      "userInterfaceStyle": "automatic",
      "splash": {
        "image": "./assets/animations/LoadingWarp.json",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "ios": {
        "supportsTablet": true,
        "bundleIdentifier": "com.wirhelfenausev.aushilfapp"
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./assets/images/bienenlogo.png",
          "backgroundColor": "#ffffff"
        },
        "package": "com.wirhelfenausev.aushilfapp",
        "intentFilters": [
          {
            "action": "VIEW",
            "data": [
              {
                "scheme": "myapp"
              }
            ],
            "category": ["BROWSABLE", "DEFAULT"]
          }
        ]
      },
      "web": {
        "bundler": "metro",
        "output": "static",
        "favicon": "./assets/images/bienenlogo.png"
      },
      "plugins": [
        "expo-router",
        "expo-font",
        ["expo-image-picker",
        {
          "photosPermission": "Erlauben Sie der App den Zugriff auf Ihre Fotos, um ein Profilbild auszuwählen."
        }]
      ],
      extra: {
        "eas": {
        "projectId": "fb205a3d-b7b8-4ae8-ab3c-4be06d153305"
      },
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY,
      },
      "experiments": {
        "typedRoutes": true
      }
    }
  }