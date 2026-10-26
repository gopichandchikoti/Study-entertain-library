# Exact Web Shell Source Bundle

This file is a generated exact source bundle. Create each target path and copy the corresponding fenced block verbatim. Do not redesign or paraphrase these files during exact replication.

Generated from the current project on 2026-09-30T22:23:55.551Z.

## File: .env.example

````
# Local development
NODE_ENV=development
PORT=4444
STORAGE_MODE=filesystem
STUDY_CONTENT_DIR=/absolute/path/to/study-root
MAX_UPLOAD_BYTES=104857600

# Optional separate REST API service. Leave empty for same-origin local mode.
API_ORIGIN=http://localhost:4450

# Hosted mode: set STORAGE_MODE=supabase and keep these values server-side.
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=study-library

# Optional shared-password protection for a private deployment.
LIBRARY_ACCESS_PASSWORD=
SESSION_SECRET=

# Optional OpenAI-compatible upload classifier. Never expose these secrets in client build variables.
AI_BASE_URL=
AI_API_KEY=
AI_MODEL=gpt-4o-mini
````

## File: .gitignore

````
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Android / Gradle
android/.gradle/
android/build/
android/app/build/
android/local.properties
*.keystore
*.jks

# Personal local catalog
data/
````

## File: .oxlintrc.json

````json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
````

## File: index.html

````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#111917" />
    <meta name="description" content="A calm local library for learning from your markdown notes and diagrams." />
    <title>Second brain | Study library</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
````

## File: package.json

````json
{
  "name": "study-library",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "engines": {
    "node": ">=22.5.0"
  },
  "scripts": {
    "dev": "concurrently -k \"webpack serve --mode development\" \"tsx watch server/index.ts\"",
    "build": "tsc -b && pnpm typecheck:server && webpack --mode production",
    "start": "pnpm build && NODE_ENV=production PORT=4444 tsx server/index.ts",
    "serve": "NODE_ENV=production tsx server/index.ts",
    "storage:seed": "node scripts/seed-supabase.mjs",
    "typecheck": "tsc -b && pnpm typecheck:server",
    "typecheck:server": "tsc -p tsconfig.server.json --noEmit",
    "lint": "oxlint .",
    "preview": "webpack serve --mode production --host 0.0.0.0 --port 4444"
  },
  "dependencies": {
    "epubjs": "^0.3.93",
    "express": "^5.2.1",
    "jszip": "^3.10.2",
    "lucide-react": "^1.47.0",
    "mammoth": "^1.13.0",
    "marked": "^18.0.14",
    "multer": "^2.4.0",
    "pdf-parse": "^2.4.5",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-markdown": "^10.1.0",
    "rehype-highlight": "^7.0.2",
    "rehype-sanitize": "^6.0.0",
    "remark-gfm": "^4.0.1"
  },
  "devDependencies": {
    "@babel/core": "^8.0.6",
    "@babel/preset-env": "^8.0.6",
    "@babel/preset-react": "^8.0.1",
    "@babel/preset-typescript": "^8.0.1",
    "@types/express": "^5.0.6",
    "@types/multer": "^2.2.0",
    "@types/node": "^24.13.3",
    "@types/pdf-parse": "^1.1.5",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "babel-loader": "^10.1.1",
    "concurrently": "^10.0.5",
    "css-loader": "^7.1.5",
    "html-webpack-plugin": "^5.6.8",
    "oxlint": "^1.81.0",
    "style-loader": "^4.0.0",
    "tsx": "^4.23.15",
    "typescript": "~6.0.2",
    "webpack": "^5.111.1",
    "webpack-cli": "^7.2.3",
    "webpack-dev-server": "^6.0.0"
  }
}
````

## File: pnpm-lock.yaml

````yaml
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    dependencies:
      epubjs:
        specifier: ^0.3.93
        version: 0.3.93
      express:
        specifier: ^5.2.1
        version: 5.2.1
      jszip:
        specifier: ^3.10.2
        version: 3.10.2
      lucide-react:
        specifier: ^1.47.0
        version: 1.48.0(react@19.3.0)
      mammoth:
        specifier: ^1.13.0
        version: 1.13.0
      marked:
        specifier: ^18.0.14
        version: 18.0.14
      multer:
        specifier: ^2.4.0
        version: 2.4.0
      pdf-parse:
        specifier: ^2.4.5
        version: 2.4.5
      react:
        specifier: ^19.2.8
        version: 19.3.0
      react-dom:
        specifier: ^19.2.8
        version: 19.3.0(react@19.3.0)
      react-markdown:
        specifier: ^10.1.0
        version: 10.1.0(@types/react@19.3.0)(react@19.3.0)
      rehype-highlight:
        specifier: ^7.0.2
        version: 7.0.2
      rehype-sanitize:
        specifier: ^6.0.0
        version: 6.0.0
      remark-gfm:
        specifier: ^4.0.1
        version: 4.0.1
    devDependencies:
      '@babel/core':
        specifier: ^8.0.6
        version: 8.0.6
      '@babel/preset-env':
        specifier: ^8.0.6
        version: 8.0.6(@babel/core@8.0.6)
      '@babel/preset-react':
        specifier: ^8.0.1
        version: 8.0.1(@babel/core@8.0.6)
      '@babel/preset-typescript':
        specifier: ^8.0.1
        version: 8.0.1(@babel/core@8.0.6)
      '@types/express':
        specifier: ^5.0.6
        version: 5.0.6
      '@types/multer':
        specifier: ^2.2.0
        version: 2.3.0
      '@types/node':
        specifier: ^24.13.3
        version: 24.19.0
      '@types/pdf-parse':
        specifier: ^1.1.5
        version: 1.1.5
      '@types/react':
        specifier: ^19.2.18
        version: 19.3.0
      '@types/react-dom':
        specifier: ^19.2.7
        version: 19.3.0(@types/react@19.3.0)
      babel-loader:
        specifier: ^10.1.1
        version: 10.1.1(@babel/core@8.0.6)(webpack@5.111.1)
      concurrently:
        specifier: ^10.0.5
        version: 10.0.5
      css-loader:
        specifier: ^7.1.5
        version: 7.1.5(webpack@5.111.1)
      html-webpack-plugin:
        specifier: ^5.6.8
        version: 5.6.8(webpack@5.111.1)
      oxlint:
        specifier: ^1.81.0
        version: 1.86.0
      style-loader:
        specifier: ^4.0.0
        version: 4.0.0(webpack@5.111.1)
      tsx:
        specifier: ^4.23.15
        version: 4.23.15
      typescript:
        specifier: ~6.0.2
        version: 6.0.3
      webpack:
        specifier: ^5.111.1
        version: 5.111.1(postcss@8.5.28)(webpack-cli@7.2.3)
      webpack-cli:
        specifier: ^7.2.3
        version: 7.2.3(json5@2.2.3)(webpack-dev-server@6.0.0)(webpack@5.111.1)
      webpack-dev-server:
        specifier: ^6.0.0
        version: 6.0.0(webpack-cli@7.2.3)(webpack@5.111.1)

packages:

  '@babel/code-frame@8.0.6':
    resolution: {integrity: sha512-uMHhvmDmwFiLuiozaoRYTZHqMFuu3fem/X9JY78lohAuLoh8LSGGC8JqUzo2cVuBsBxkjMZNk56CE7ock8Xxkw==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/compat-data@8.0.5':
    resolution: {integrity: sha512-YLsYoQMvL8l8WrGpN3Zj7O1wK5LEBN+cQtux7BcuHyxIXve724XG+zuJ1n3U1cUweRtTzQOA4IHbuQw3N34SZw==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/core@8.0.6':
    resolution: {integrity: sha512-5zwYt1V4ji3mXKKRIAkohSJ29WepxNwxQi+7y7P5AcVPh1dcxnZBU2cfxHnPwS+u9+lZnXPsv30TQaF2xg+Tfg==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/generator@8.0.6':
    resolution: {integrity: sha512-/pcanjdRsonCexCuxgGD8fKnBLLzk2i9uM4kmcmGyyev2R5YDs+rafMYZ89RvaGY1mW8T7C5au0TyYaEeHBGng==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helper-annotate-as-pure@8.0.0':
    resolution: {integrity: sha512-NSpMkMsvvZqzThJ0p1B02cbtA2ObEyfBvq950bmNkyxsxvcxwhvvCB036rKhlEnuBBo30bOrk13u3FzlKSoRrw==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helper-compilation-targets@8.0.6':
    resolution: {integrity: sha512-HTrtZ4+iA0+kzdbCgvdSk1U4pEl3BvpGnlUbualCGNbrVhhQvhgBzurTUmqpWyvyHbWYWaIfdx2mOlL9LJjsew==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helper-create-class-features-plugin@8.0.6':
    resolution: {integrity: sha512-Hy7wG2Pk1LnAkFMq0CbBk789XMTYVzYGxR7tKgk+TOpZckQRME3Tdou4mMT/8DFjJFxFZ8R6UsS4DR/duBKlVA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/helper-create-regexp-features-plugin@8.0.5':
    resolution: {integrity: sha512-TWnIgw21pAv/FbBKB8ks26DMxQ+A3aBdi1HUBp+QhqSE8QdOqJgSK/FEvdMYPTZcHBBJPZ5pN6DDKmC5ZYPJbg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/helper-define-polyfill-provider@1.0.0':
    resolution: {integrity: sha512-9jzVaTeZyXRDKTgUnNzcPQMO8y0ga3o+Z4fKjNet9Fcx7slgKa83qRbz0EwROSd6qO6CoEe/HQszqSPKb5lhkw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    peerDependencies:
      '@babel/core': ^7.4.0 || ^8.0.0

  '@babel/helper-globals@8.0.6':
    resolution: {integrity: sha512-OdnA/N52LhzFpeUuVz5YGuSWjc7TPHiFmVYZbPlSgExocO2GwbxVpSni9MVs5wwW+wZ4kPuwBEBN9pIPDYz1mA==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helper-member-expression-to-functions@8.0.5':
    resolution: {integrity: sha512-GLe05QD98BkNFTkjaqeqF9QSRoHLKrrB4tpoplyQuuPrQJ72rtmkM4wvqJLX/sjZPqkbK5MUYSsuUTqdJoOVjA==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helper-module-imports@8.0.0':
    resolution: {integrity: sha512-NZ7mSS93o4ndX4KrbD7W8Sf3QT8Qe24PrnFyUcuOPDzK6faqDFKjY9RG7he7+I7FdiQ4llpnosFqzrXa+Vy3Ew==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helper-module-transforms@8.0.6':
    resolution: {integrity: sha512-YUi+3X0cb0v97xKhuqkLdrwQtP6XXv1eVbhLRCFyMwG481UskbMQk4mjH7K/Jg3oJ1KLskvFwwq4kF/QnABkWQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/helper-optimise-call-expression@8.0.0':
    resolution: {integrity: sha512-3W6satvtPuCUkUx63S2jMoW9EQNYkADgs1HTfufmL7gCmAulHMKupA/12WNz4A0GMMFn/YnWWwqOT9IZrJHQjg==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helper-plugin-utils@8.0.1':
    resolution: {integrity: sha512-3PKFgjTyPlhFhorfP+SjKQxLViIL++zWjFOO4hGriYU+Bsm983DxEM1JmDRJVWXV0O9npu+xXRqz7Pbd3mh70g==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/helper-remap-async-to-generator@8.0.1':
    resolution: {integrity: sha512-baAKuLEMmu6BCSY3tuiU7qglM1qOZt6F1SrFScA241oNqksxkxfEZEKztlGRmoVns9AQ5UgArH7RsUEjxWnzgQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/helper-replace-supers@8.0.1':
    resolution: {integrity: sha512-B1SZADIcy3tmH8CmWvj4SHi/oAPom4UL3uknTc2QRNsPVLFk/sPnZvQL/8kj7Y5omvjMqie0vklvs6XM4OLW5Q==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/helper-skip-transparent-expression-wrappers@8.0.0':
    resolution: {integrity: sha512-xmCA9kP3IhySsqhzwIdWGlDN/1A4cCKNBO/uwZx/3YzmDoMePwno2Q5/Bq0q+tYaKbeF940YiKV/kaW8Mzvpjw==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helper-string-parser@8.0.6':
    resolution: {integrity: sha512-+6HYEBnsDRZHJtUTAEfMQd0zMDqdFHS7C+5vAsEZqBUr3vEMWOWlHJ0Jz1gS8jJIlCvLsuA6ivmeoqzH936YcA==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helper-validator-identifier@8.0.6':
    resolution: {integrity: sha512-HYx0YmuchRxRSpnjvcNffnPS8DCauKNmnumIuHG3jnQAVewRA7kfJGwF13ayEpSZs7s4R/oBH4eppuXcAQd5JQ==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helper-validator-option@8.0.0':
    resolution: {integrity: sha512-U4Dybxh4WESWHt5XhBeExi4DrY0/DNK1aHpQbsrQXCUbFHuMweT0TpLEWKvaraV2Y6fS+ZXunsZ8zIuZIgvF2Q==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helper-wrap-function@8.0.0':
    resolution: {integrity: sha512-Qpm8+wi5xfDkBfollanwriCcKniFfBmMmaKB01GVM6VGzKXo1fdxosZp04qEr5HM+LKhwr3hG1yRy8+ORsficA==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/helpers@8.0.5':
    resolution: {integrity: sha512-fQtPOXjYOYv85PIdwotp2TJGVYOycX0PQq+l844fFAxOULtBy8BVF35GyeueX0r4KvDthqPH5xAI1clQPk/2uA==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/parser@8.0.6':
    resolution: {integrity: sha512-LpGDIYJAzc3Y3PT9x+FxBrGYu2PlWxLmyN7SwPTzaX0LSwEmFJBsRnPBqmaXF2r1v+Zhz6lNiEJ+7yKtM5+Ugg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    hasBin: true

  '@babel/plugin-bugfix-firefox-class-in-computed-class-key@8.0.1':
    resolution: {integrity: sha512-Ytgjjne4RnG3Oig7ik+NfY4ebRY30BPptVkkyu1f72eINJXRM3/bkU++tIc5aPvyLmo4KH20avq0xJ2o+9aEnw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-bugfix-safari-class-field-initializer-scope@8.0.1':
    resolution: {integrity: sha512-X7pAMBhuKluA7UfwZNvKN0XVVu/AGeo84Z75eJl85rcb8J2aBzLK92btahM1X5h0oi0QIrbe0qIMA/0+4Buk7w==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@8.0.1':
    resolution: {integrity: sha512-DJviKTxYfH0hFwnMiW4dnPyMGzS3Hrr4zUfXl1zwQ0QiGlGlNYklLoPSYEQr8S7nau0/K7NdQjTh0qbYuyFjCA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6':
    resolution: {integrity: sha512-vk9CzgaQGcTTBL8F0YNr7LBEka6pXP/I5KcMj0oicGXUquWSNqxiijHGQkHF+s8m910NbGMpn5mU2sFV7AQjBA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1':
    resolution: {integrity: sha512-x8bi0LFVD2xkULjfNn+hCMg16yAFHAM9fS/ThSFeYBi+0MP9K6qcY2BZb4urUwC7PYtEy5wPe6TKjOEjXrCGFA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@8.0.1':
    resolution: {integrity: sha512-P8+RN2n7ts2s1vnE+lXdHYf+dhnmcGSen/kWzBsVluT9Sey5AqmcRXYWlHqgQxaNlKTD5YMa1tf5z4d1v8W88w==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-syntax-jsx@8.0.1':
    resolution: {integrity: sha512-n0jtCOxEovhU7METqSQjcZO9pX53nu9uNIjMS+hEt+Nt9jA7oOZoBIgbCxhhASmF6T6rPDGge5UAvh6Z4eFz/g==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-syntax-typescript@8.0.3':
    resolution: {integrity: sha512-jmTPwps7oSQSZaV1SxkQ3C12UWyufGysGc5OzDpZzvPAIX4mO7dJT3hoqkWVrSImvkcMiknir1iLN1SNV/CZzg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-arrow-functions@8.0.1':
    resolution: {integrity: sha512-o/gr7kRlq3PKLLuYth4udOsrC7geBerti+QtwPeyxMOsEQO1d8kDHqk9r2PtMx2y9i8FG7tzyTerfv1yMLSMsQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-async-generator-functions@8.0.6':
    resolution: {integrity: sha512-4K13qZ2TVi9W/NHMg3y0Fguu63cPjGNZT5TpPctIUDdiuIpxo4jwvySGrPWlD6KD00exvpx6Y6l5foFEpnzDcg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-async-to-generator@8.0.1':
    resolution: {integrity: sha512-e1jmmEU4p2Lx64sA1+EF8e8/RxPuegzbXcEbmFp5alDyLE+f2ViUpZ77bRWMXzihTwgVVmn/TOpqDbAuS5g1Ew==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-block-scoped-functions@8.0.1':
    resolution: {integrity: sha512-0V97/gcf7LIgPieEiK1YT0eXa18XJFSLOTZjzEZhA9SJIqZhD/IwGUrCitBzXSmnGCP7hchwC6svHtJ/Eidcpg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-block-scoping@8.0.5':
    resolution: {integrity: sha512-czkN3g76Ns2wMe1C0IuceKUCqCe/yJ1by0qz4h4znq74K/Ks7K2Fx6Dplq9ecS65Z3rJHxT9a/kDSF2LbEov8w==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-class-properties@8.0.1':
    resolution: {integrity: sha512-tORnYiVhIHnKj90TgbSZXrO24f9oEpA6MgFxpIDSKKlHv7AzBIRhkMlYevanueLNYaQXqZWarfCgXM4bWTfNiw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-class-static-block@8.0.5':
    resolution: {integrity: sha512-hyqluKOSy6PVOoHDEb4xsjFbtOSy+FFNzHNCrAHS5T+LxS8BtZHBCIVYFAcWzhBf/wRYsYu2uEpUvRmHYeOf8A==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-classes@8.0.5':
    resolution: {integrity: sha512-GKFgovQQzZfEDFxclYFDOiw/Pszxa1epcs7RasL7yyeqi6rxL61Vbqt0uSDPc2M7XXCmNZnQZaK19333v6rabA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-computed-properties@8.0.1':
    resolution: {integrity: sha512-i4l3OGLO8DUDcwdnyraOvILbhqdUf4QgfzhVxSOSzRy49XKXrY7pwaSg9gDSKmhZfNPrEMciBSJSciQh/CjB1A==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-destructuring@8.0.5':
    resolution: {integrity: sha512-evjxc5fGvpXG2WMGSalpX8IJZVumLIDgk5r5eRhvXRDqFX/GPWq1BeRfJalPCcwJfrR5A/wvegUhx9W5Nr7/mg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-dotall-regex@8.0.1':
    resolution: {integrity: sha512-czOUoSaZljJ92yu+bYlXqb/UBN8K9daNCob/B6/7nthSvfGP6YhCnfqD64XWfyb2dN4ypxALNplApoJrsMd4fw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-duplicate-keys@8.0.1':
    resolution: {integrity: sha512-kNnVLkxFUEcTtCyB5PFVQ5Xoy88Bk1lU/ZgDu97CW8eNhRH2Wsiy8Sq5l5dFnwtIUYjzsXHU77jUy1W5AtGSIw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1':
    resolution: {integrity: sha512-Tv43P47o6fuHgBL7HLHQg3WKXohW9CEUGjLtnCDW27yJLK0zKUdTTqREbZbycNHA83hewMjde5tF6ekrHu9bAA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-dynamic-import@8.0.1':
    resolution: {integrity: sha512-AS9GlgKc43tJNRu7yOvLaTko4qmdOb+8M69uNS8i421WLO20eVez7LdG5khKdi8E0LIQpYzzzdGIrdXWnO753g==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-explicit-resource-management@8.0.5':
    resolution: {integrity: sha512-Vr20jk/ZxRGu30o0jYvcKl2Pf0tiyr8H9q2ZGxYD6yjOpv9DdP6//I85q0cSOdADZhsu/ZZoApjGVCfl4xnVJw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-exponentiation-operator@8.0.1':
    resolution: {integrity: sha512-DsZvUUklUmDQ7d2vp+VjqgUWD51mGxhZZ1FPdPP9Hcj0vsgGUKX+zEBGp/vzB1O5PZUxWT/Euq5fu39M9dm9wg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-export-namespace-from@8.0.1':
    resolution: {integrity: sha512-bFzznm46bvWGaTYKle3iolbBJ+oPBfUjwCPesxlFE3SQ7DaY9EHf/8Y5ZzrodKJi8JDdcAyaVWaDUSVyhULh0g==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-for-of@8.0.1':
    resolution: {integrity: sha512-rpeXtgELjpIBQH/+YmyFlD9timPEVCyqY+TNednzoeoTYvXSBEeUvYnYE+BK8rB8m6hHiNK7aL9QWKhGifEJCw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-function-name@8.0.1':
    resolution: {integrity: sha512-H1L/JfPf3CqmubuaiZaquXKQ8MRs4YWSsgRllkTviM8TafcCNnlvc4/fJZ3rXP8HmFM+/Bg+TlsPehUI9BtDFA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-json-strings@8.0.1':
    resolution: {integrity: sha512-Mowp8X0J6p7ZehLU82B5e65te2uuSeDHyxrEROwEAS2VKXNXssfw5ZMqhY7k9iXTsOv1Xs/49G3lDCj9Vvw8qQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-literals@8.0.1':
    resolution: {integrity: sha512-ai7kfPRcfyUV1EszXoF1PvL3IuJoCuH08WSEPoRcJTWfZZ55VL/rcfvbVY16QLA3jjbzzSneQSoCtD3L6OyUjw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-logical-assignment-operators@8.0.1':
    resolution: {integrity: sha512-Emvtr5zkEGyCNAmt+qKD5EUh8G0RbxV9EZWrDdX0LuVy5tBq1B3fOIslvVF9aCJmpnwS/AvAT53b9LxAZyXlng==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-member-expression-literals@8.0.1':
    resolution: {integrity: sha512-3Axi9abnyGsm/hh6DsKPZ1Cr9fTtKqS7w0Ig5g12mU269YclpH8pV3xMln2vPLexXgUp6S6L+I06d9/YOLfRKA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-modules-amd@8.0.1':
    resolution: {integrity: sha512-FDdhET8y1YFDNRuoynqSf23WTzbBBpbIB2oRrlFX7YYm9uWtFvJDSD1r/epBSjfPkOjeaaLgRW9xNnt3JGx46A==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-modules-commonjs@8.0.1':
    resolution: {integrity: sha512-PMuzulWrrzFNmY3lXSk/tV9NRb7y0eZZLJY4UEo2TKszroxvUZHAPPi+T9FDyrQhod+TQA+t+8/QYaaMpiEuhA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-modules-systemjs@8.0.1':
    resolution: {integrity: sha512-0NEHanXmnFEnfT2dLKTXnu7m8GXFsnxRgteBC2aH21hYMBwAgxu5dcTdi/Eg+ToI1HbZe0CHwz4XRLgRNQhYoQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-modules-umd@8.0.1':
    resolution: {integrity: sha512-XKTa2J2MdkmbVEeChq9f7Or0VYcsF0NyVBgytRyeN9F+J+ETAB2SHhfkG4toz/ssuU0i+h/QgJ6ddo5YakSQcA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-named-capturing-groups-regex@8.0.1':
    resolution: {integrity: sha512-zCHu+Jr2gTdJE48lN9SV/kXueCW2M79mKtKJc/ttfzzr/jvgdQdCd17RADMqFRQc/25MLxdtjTmlD0HSAMOlIQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-new-target@8.0.1':
    resolution: {integrity: sha512-QSQxVg1x4PuOuhWUs4Y9u+x9Y+ER8z6G3tC+bDLBzvoOrNLJrEBQLRnwrTP8e5klihAw6Z+e9X5RjdAKcAGapA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-nullish-coalescing-operator@8.0.1':
    resolution: {integrity: sha512-AgCJAmQLF7+PtsK79wJqr4xJ2StHCXlz7JL5CVFP4HejJx25Tk6yl1ZrXvi0cKh3VGDVnfVxefxnrpsBirgpyQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-numeric-separator@8.0.1':
    resolution: {integrity: sha512-it2DmUyLIA1GQUXlFDEnI+/G89mTgxndnAiZYpW8xYR6LboblfirMqiWJeTna5uypQJg7viTT4D1iEURRtFcfw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-object-rest-spread@8.0.1':
    resolution: {integrity: sha512-VmxkDu6bBdbxRzqn6E93hYucug4OVa6svSO19W//vVzNUGAmQzk3QRyHyyEtfcjSLR3NWfRsWwVM9zExLmd+2w==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-object-super@8.0.1':
    resolution: {integrity: sha512-fDkPXRTRKGm25bAq01q82UM4ypPqdVXCwphUUm4t1dL01fGIG0v8KRvT+4BjhMAtRxtPuI34t5Vs7yjRgs3ZgQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-optional-catch-binding@8.0.1':
    resolution: {integrity: sha512-b2OQ74uGliyATcasTjxGy2O/86UI/n+EN4juB4EMfEwTi9j9uq70PuP0L8fW77vfRY66gO/YoTo/WbIdQ/Si1g==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-optional-chaining@8.0.5':
    resolution: {integrity: sha512-w8ouIDKdmUc2oyvBx4S/WtiQM7bMww5LGjB2A4L1+sDWZGw37XxzqOqfgHnPm+2ldINmAqrf2ekzpeJ/sS9poQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-parameters@8.0.5':
    resolution: {integrity: sha512-oXsstDkzuE+gOqBz2+e1VFqDew0KlGgd9GT4MGptmcIq3uDbxcowHRSaqMCvp3nbiZws4wTm8Phuk9ZJO3NtTg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-private-methods@8.0.1':
    resolution: {integrity: sha512-TrFCGcXaVDh6S5IRhmLSRTY9H80VTCMQWnZtzBRg4RWg3KCLmdmsmj4M15kZAPZfoPkWL/SJb4em3Py/vOiX8g==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-private-property-in-object@8.0.5':
    resolution: {integrity: sha512-OilYoElZMdD/My3fJTh0jLOPy8Y9Jfpcb9nPXG0Bpy4oRbZeeVX39P1cXKsPwnXTBZg7qEKk8TQ0lzpJvdK3yw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-property-literals@8.0.1':
    resolution: {integrity: sha512-Z/qx4cxUtYR1nt7XWRutObPxDks98fEYsjWbVeKEqZH6y3AGknmgzCqmHf2FHWZCl1DfoPeuJY+3hZ+35D+2tg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-react-display-name@8.0.1':
    resolution: {integrity: sha512-soLishXlkyu6jcICPyO3HEP7A3GCzKEnn7XfvYrImuWEOwFAz93qShmWSYPf5ww0ZkO4By0zsN2bVIDF54fSdA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-react-jsx-development@8.0.1':
    resolution: {integrity: sha512-Hb+HUZpV9KFHjm+F+P3aLDMi8QXU9l3ROCQv20z18Me2sGyW5nNNR5YTevNlgHvCpFek3BnAwhDGq/BRndXViw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-react-jsx@8.0.1':
    resolution: {integrity: sha512-NgkoF7Uq+30TmOPDdNUimT0Nta02uVjqJRFNlVWKrbOCu/CkzfHa4aMnIs0lMpkMmZmWA1e42Va+F04i/pY1zw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-react-pure-annotations@8.0.1':
    resolution: {integrity: sha512-7/8UwU8hoPBurXa9tUiTTC8aACTRy5tCqLUtqikHp2eGiWoEB57AduOdbQ71OOMTEvawKrGhv3WfzkDpI+/oSg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-regenerator@8.0.6':
    resolution: {integrity: sha512-ky/yW+PcQfHyOhbQFNkcHOCIHXaEANYaXCucZ1MY1PdSJRjaf3AX/TMKS6nCij73YtU1bVNy7Zx5NWAJy42TQA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-regexp-modifiers@8.0.1':
    resolution: {integrity: sha512-02ITRDBesPdTYU0oShAzERwEPzozOUQSXlz3qrt8JGuhalBJQv9z5NjgHJPC9sS3Fsam8gDtfAEpBnqZwUIdjQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-reserved-words@8.0.1':
    resolution: {integrity: sha512-+aykZi7ZP3U84veqfJXm3HhPZGddWFi64g7jr0ni6tb1zel+1ey+SL+IRKPoZXFyFqvYEsoqrmx4PyEJRlHl/Q==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-shorthand-properties@8.0.1':
    resolution: {integrity: sha512-JddANd9yPVH8dYgVoNkqAH5BftnsDxFpG51Zas7sc6F3poz5QWcejHNGO8a/57IX5ByjGSzEmYk9Z7ZMa5MWaw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-spread@8.0.5':
    resolution: {integrity: sha512-thqaGFTViCmJxUPJ3IivfaGHz8eodOL7UbsZ2gMOybSi8uQFXFEoabnnILMl4ZCok0vVrKD4HKq9MJWSj5qqxw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-sticky-regex@8.0.1':
    resolution: {integrity: sha512-IsVP6WrZZQdaG2zLmeKwWiI+ua2NB5L1+f77C2/8z2NCDz7uxlIA/lnwocYOJk9PXcOC2sZgRls3LN4XpNduzQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-template-literals@8.0.1':
    resolution: {integrity: sha512-JXvtj5+BJA9Qv3prDzW2z2DkGTJNmG0BObTdUD03STiu1Jr4fNQkQy3hYZgPL46a2RjcuhwBMYf49BOuJ98gnA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-typeof-symbol@8.0.1':
    resolution: {integrity: sha512-+wJoxgxP2gtey0UMUOMhzMMji2XHO/Uu6MXUh/r5Yhc2jngKzK/wFxY2WNe4UCaRcMvCb4gcnB8wIgFXJsocXg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-typescript@8.0.6':
    resolution: {integrity: sha512-WF3yRlQtClzScvQbWct00ix63+w3DPiyU0WmCBU4YqK539n3VvJFElElpevoD8wfu6953CbiNoUZBi2B7/5jXw==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-unicode-escapes@8.0.1':
    resolution: {integrity: sha512-TAXJepIJ6vZphytTwcf+LuXi2M2ZWI43VCqNw+1ZZLPP/38Z1A8j4Mahvg8kqDgMOSM/cakk+hedTJCiw3jQuQ==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-unicode-property-regex@8.0.1':
    resolution: {integrity: sha512-zjBN9tSMSuomNDfurL69Gf7+v4D2t5uI1mSZaYJDo88SKpbduhCXqtxH7Tx66iCF6caWYwnBzSM0tnCozmQq5Q==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-unicode-regex@8.0.1':
    resolution: {integrity: sha512-v0oO83cvT5lwbcIVRShpx4vaHD8AvM9IBowsQuTeP+kGmhh3recJQs33Bl6dlo3/2g9amlznLbFGn4VJbPCJqA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/plugin-transform-unicode-sets-regex@8.0.1':
    resolution: {integrity: sha512-MlQeyS0K7gh0XNeLBMS/3Z07HjDOKhA7xm2L18GyxOXyiFHI9E+ZuQ4mFYmcLjluXsE/Wf6dABIqZvKpKw0Z3w==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/preset-env@8.0.6':
    resolution: {integrity: sha512-Ekl110OgRBQtibBTXrXyuxhy2p7QxpzWT45cFOZCBFKBan3o8vN54sQ26GtqyTyORSNWKx0GOmIdLTTu/Y+prA==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/preset-modules@0.2.0':
    resolution: {integrity: sha512-yz0RBN2fx4fjCeFcTWsWgL7PxSRltvTa0Qg14HkWCU3qS8MO7ZSJlBVbGceynd5C9NsJwwUHNQD3dc6tYO+jqQ==}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/preset-react@8.0.1':
    resolution: {integrity: sha512-jrFuPp/pTddFZbtmWhdLNAYc6UMcpboeUPnw0BBrm4nOmcAko/1TRcFi1PzWCeOFRU+VaSiKmat87W1HvR7mIg==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/preset-typescript@8.0.1':
    resolution: {integrity: sha512-qrPhQIN1NLrPmzgazF9XKQqXrOcp/WJly+K+6ReFonn24FZqRJO7clxOJo6Ni75L+2vAqI3cHVU2OJLBxoPp5A==}
    engines: {node: ^22.18.0 || >=24.11.0}
    peerDependencies:
      '@babel/core': ^8.0.0

  '@babel/template@8.0.0':
    resolution: {integrity: sha512-eAD0QW/AlbamBbw0FeGiwasbCVPq5ncW0HNVyLP3B9czqLyh4gvw+5JTSNt6le9+ziAU7mqDZsKTHf3jTb4chQ==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/traverse@8.0.6':
    resolution: {integrity: sha512-ilYV+qLStGzSKLipJlETdvdtpK3rAuwfCmCoGKv15MU4EoeIuLkespSNoNLFGOPSciEHx9TLWtN5mv0fz5w5mQ==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@babel/types@8.0.6':
    resolution: {integrity: sha512-c+xgSWboV2pdwXP67BUWDVRHi2BO5Q3KwxyFVs7taVTY+fsK47/L51ZXQoV9rozHJDNHvJ4v4WEsI/IlxV2l2A==}
    engines: {node: ^22.18.0 || >=24.11.0}

  '@discoveryjs/json-ext@1.1.0':
    resolution: {integrity: sha512-Xc3VhU02wqZ1HvHRJUwL09HkZSTvidqY5Ya0NXBSYOxAp+Ln9dcJr9fySI+CkONzP3PekQo9WdzCv0PGER/mOA==}
    engines: {node: '>=14.17.0'}

  '@esbuild/aix-ppc64@0.28.2':
    resolution: {integrity: sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==}
    engines: {node: '>=18'}
    cpu: [ppc64]
    os: [aix]

  '@esbuild/android-arm64@0.28.2':
    resolution: {integrity: sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [android]

  '@esbuild/android-arm@0.28.2':
    resolution: {integrity: sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==}
    engines: {node: '>=18'}
    cpu: [arm]
    os: [android]

  '@esbuild/android-x64@0.28.2':
    resolution: {integrity: sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [android]

  '@esbuild/darwin-arm64@0.28.2':
    resolution: {integrity: sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [darwin]

  '@esbuild/darwin-x64@0.28.2':
    resolution: {integrity: sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [darwin]

  '@esbuild/freebsd-arm64@0.28.2':
    resolution: {integrity: sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [freebsd]

  '@esbuild/freebsd-x64@0.28.2':
    resolution: {integrity: sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [freebsd]

  '@esbuild/linux-arm64@0.28.2':
    resolution: {integrity: sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [linux]

  '@esbuild/linux-arm@0.28.2':
    resolution: {integrity: sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==}
    engines: {node: '>=18'}
    cpu: [arm]
    os: [linux]

  '@esbuild/linux-ia32@0.28.2':
    resolution: {integrity: sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==}
    engines: {node: '>=18'}
    cpu: [ia32]
    os: [linux]

  '@esbuild/linux-loong64@0.28.2':
    resolution: {integrity: sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==}
    engines: {node: '>=18'}
    cpu: [loong64]
    os: [linux]

  '@esbuild/linux-mips64el@0.28.2':
    resolution: {integrity: sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==}
    engines: {node: '>=18'}
    cpu: [mips64el]
    os: [linux]

  '@esbuild/linux-ppc64@0.28.2':
    resolution: {integrity: sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==}
    engines: {node: '>=18'}
    cpu: [ppc64]
    os: [linux]

  '@esbuild/linux-riscv64@0.28.2':
    resolution: {integrity: sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==}
    engines: {node: '>=18'}
    cpu: [riscv64]
    os: [linux]

  '@esbuild/linux-s390x@0.28.2':
    resolution: {integrity: sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==}
    engines: {node: '>=18'}
    cpu: [s390x]
    os: [linux]

  '@esbuild/linux-x64@0.28.2':
    resolution: {integrity: sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [linux]

  '@esbuild/netbsd-arm64@0.28.2':
    resolution: {integrity: sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [netbsd]

  '@esbuild/netbsd-x64@0.28.2':
    resolution: {integrity: sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [netbsd]

  '@esbuild/openbsd-arm64@0.28.2':
    resolution: {integrity: sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [openbsd]

  '@esbuild/openbsd-x64@0.28.2':
    resolution: {integrity: sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [openbsd]

  '@esbuild/openharmony-arm64@0.28.2':
    resolution: {integrity: sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [openharmony]

  '@esbuild/sunos-x64@0.28.2':
    resolution: {integrity: sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [sunos]

  '@esbuild/win32-arm64@0.28.2':
    resolution: {integrity: sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [win32]

  '@esbuild/win32-ia32@0.28.2':
    resolution: {integrity: sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==}
    engines: {node: '>=18'}
    cpu: [ia32]
    os: [win32]

  '@esbuild/win32-x64@0.28.2':
    resolution: {integrity: sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [win32]

  '@jridgewell/gen-mapping@0.3.13':
    resolution: {integrity: sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==}

  '@jridgewell/gen-mapping@0.4.0-beta.0':
    resolution: {integrity: sha512-JdGNkbE4GlNPYQhM0L95fBQr7ctLZJ276QXQLTad4t1oSdnnCI3fDq9DW3BqYAWv8Wc3+HS+4Gsii1oPMCfz1w==}

  '@jridgewell/resolve-uri@3.1.2':
    resolution: {integrity: sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==}
    engines: {node: '>=6.0.0'}

  '@jridgewell/source-map@0.3.11':
    resolution: {integrity: sha512-ZMp1V8ZFcPG5dIWnQLr3NSI1MiCU7UETdS/A0G8V/XWHvJv3ZsFqutJn1Y5RPmAPX6F3BiE397OqveU/9NCuIA==}

  '@jridgewell/sourcemap-codec@1.6.0':
    resolution: {integrity: sha512-T7jf+5zgsZHwNJ4lvQ7/aezbyk0nNX+zJVWpmHA7VYsEx7a7qr5Rg5IbtJFqkgze5Y2sruq1RUY8Q837Od7iFw==}

  '@jridgewell/trace-mapping@0.3.31':
    resolution: {integrity: sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==}

  '@jsonjoy.com/base64@1.1.2':
    resolution: {integrity: sha512-q6XAnWQDIMA3+FTiOYajoYqySkO+JSat0ytXGSuRdq9uXE7o92gzuQwQM14xaCRlBLGq3v5miDGC4vkVTn54xA==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/base64@17.67.0':
    resolution: {integrity: sha512-5SEsJGsm15aP8TQGkDfJvz9axgPwAEm98S5DxOuYe8e1EbfajcDmgeXXzccEjh+mLnjqEKrkBdjHWS5vFNwDdw==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/buffers@1.2.1':
    resolution: {integrity: sha512-12cdlDwX4RUM3QxmUbVJWqZ/mrK6dFQH4Zxq6+r1YXKXYBNgZXndx2qbCJwh3+WWkCSn67IjnlG3XYTvmvYtgA==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/buffers@17.67.0':
    resolution: {integrity: sha512-tfExRpYxBvi32vPs9ZHaTjSP4fHAfzSmcahOfNxtvGHcyJel+aibkPlGeBB+7AoC6hL7lXIE++8okecBxx7lcw==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/codegen@1.0.0':
    resolution: {integrity: sha512-E8Oy+08cmCf0EK/NMxpaJZmOxPqM+6iSe2S4nlSBrPZOORoDJILxtbSUEDKQyTamm/BVAhIGllOBNU79/dwf0g==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/codegen@17.67.0':
    resolution: {integrity: sha512-idnkUplROpdBOV0HMcwhsCUS5TRUi9poagdGs70A6S4ux9+/aPuKbh8+UYRTLYQHtXvAdNfQWXDqZEx5k4Dj2Q==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/fs-core@4.80.0':
    resolution: {integrity: sha512-qMKWshnyjbyhm+NbzqGE3w5y1mckFFEMj0aDPU2/JBNh1BzIjVy9esq9lBmRnNVmhMEkxwDzLZ8Gqh5G1P5Dag==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/fs-fsa@4.80.0':
    resolution: {integrity: sha512-ZBEKl7J6dbkRCfmrFV48Re211A/FHqniTUhsWCsaRteNSOqMgkX3qF1UreVgwB9oSPm81JLAwhIi6Lb/NH/PoA==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/fs-node-builtins@4.80.0':
    resolution: {integrity: sha512-OIOIhqaWiwUySFMny4epIAoviXsyMaQQ63PTc3zH+5HEOvarl5hpUmZIhp2m5+OfyKAh5ylxXnQIgew1OgJDVw==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/fs-node-to-fsa@4.80.0':
    resolution: {integrity: sha512-ljeaR5xwtX1EyRmB0wvXANUMQZ3mjKcm7z8s2N8D8SLQ04CcAGtUhHFRZQXFb9mhgFyEVMydQGQtSOFS7pcrFQ==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/fs-node-utils@4.80.0':
    resolution: {integrity: sha512-xwHeVVi3f+Khg/Fmb8i5qoYVmQ08QznE5TWhQokUmIZjz4KBPzU+zt/+bahBI6G1ghtqajt27lWuAciIxApuzA==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/fs-node@4.80.0':
    resolution: {integrity: sha512-yiBlUfkMMRFFGy8CD/h2zd5rPnrM6bjlF+nx2LRAxNV6hOSiuObQIUEE7m7y2VTMisjxCRtzINH94bFGySWL7g==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/fs-print@4.80.0':
    resolution: {integrity: sha512-1ocZLJw/m/xlq0moaIHO7HV9nHRVBUvdc2zMzhsJGkFOrqfwWvexfCv5cYCPPLRhP+9p3yunoi4Ep5YhRORC9Q==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/fs-snapshot@4.80.0':
    resolution: {integrity: sha512-3AV23Q1H228KTtJKTUE0nNq8FCtxSvtENOLrEat80wkAJCKHuqQEv8yjhpS8Bei2OEFJAnluGXp9Ri2SWBlROw==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/json-pack@1.21.0':
    resolution: {integrity: sha512-+AKG+R2cfZMShzrF2uQw34v3zbeDYUqnQ+jg7ORic3BGtfw9p/+N6RJbq/kkV8JmYZaINknaEQ2m0/f693ZPpg==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/json-pack@17.67.0':
    resolution: {integrity: sha512-t0ejURcGaZsn1ClbJ/3kFqSOjlryd92eQY465IYrezsXmPcfHPE/av4twRSxf6WE+TkZgLY+71vCZbiIiFKA/w==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/json-pointer@1.0.2':
    resolution: {integrity: sha512-Fsn6wM2zlDzY1U+v4Nc8bo3bVqgfNTGcn6dMgs6FjrEnt4ZCe60o6ByKRjOGlI2gow0aE/Q41QOigdTqkyK5fg==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/json-pointer@17.67.0':
    resolution: {integrity: sha512-+iqOFInH+QZGmSuaybBUNdh7yvNrXvqR+h3wjXm0N/3JK1EyyFAeGJvqnmQL61d1ARLlk/wJdFKSL+LHJ1eaUA==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/util@1.9.0':
    resolution: {integrity: sha512-pLuQo+VPRnN8hfPqUTLTHk126wuYdXVxE6aDmjSeV4NCAgyxWbiOIeNJVtID3h1Vzpoi9m4jXezf73I6LgabgQ==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@jsonjoy.com/util@17.67.0':
    resolution: {integrity: sha512-6+8xBaz1rLSohlGh68D1pdw3AwDi9xydm8QNlAFkvnavCJYSze+pxoW2VKP8p308jtlMRLs5NTHfPlZLd4w7ew==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  '@leichtgewicht/ip-codec@2.0.5':
    resolution: {integrity: sha512-Vo+PSpZG2/fmgmiNzYK9qWRh8h/CHrwD0mo1h1DzL4yzHNSfWYujGTYsWGreD000gcgmZ7K4Ys6Tx9TxtsKdDw==}

  '@napi-rs/canvas-android-arm64@0.1.80':
    resolution: {integrity: sha512-sk7xhN/MoXeuExlggf91pNziBxLPVUqF2CAVnB57KLG/pz7+U5TKG8eXdc3pm0d7Od0WreB6ZKLj37sX9muGOQ==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [android]

  '@napi-rs/canvas-darwin-arm64@0.1.80':
    resolution: {integrity: sha512-O64APRTXRUiAz0P8gErkfEr3lipLJgM6pjATwavZ22ebhjYl/SUbpgM0xcWPQBNMP1n29afAC/Us5PX1vg+JNQ==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [darwin]

  '@napi-rs/canvas-darwin-x64@0.1.80':
    resolution: {integrity: sha512-FqqSU7qFce0Cp3pwnTjVkKjjOtxMqRe6lmINxpIZYaZNnVI0H5FtsaraZJ36SiTHNjZlUB69/HhxNDT1Aaa9vA==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [darwin]

  '@napi-rs/canvas-linux-arm-gnueabihf@0.1.80':
    resolution: {integrity: sha512-eyWz0ddBDQc7/JbAtY4OtZ5SpK8tR4JsCYEZjCE3dI8pqoWUC8oMwYSBGCYfsx2w47cQgQCgMVRVTFiiO38hHQ==}
    engines: {node: '>= 10'}
    cpu: [arm]
    os: [linux]

  '@napi-rs/canvas-linux-arm64-gnu@0.1.80':
    resolution: {integrity: sha512-qwA63t8A86bnxhuA/GwOkK3jvb+XTQaTiVML0vAWoHyoZYTjNs7BzoOONDgTnNtr8/yHrq64XXzUoLqDzU+Uuw==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [linux]
    libc: [glibc]

  '@napi-rs/canvas-linux-arm64-musl@0.1.80':
    resolution: {integrity: sha512-1XbCOz/ymhj24lFaIXtWnwv/6eFHXDrjP0jYkc6iHQ9q8oXKzUX1Lc6bu+wuGiLhGh2GS/2JlfORC5ZcXimRcg==}
    engines: {node: '>= 10'}
    cpu: [arm64]
    os: [linux]
    libc: [musl]

  '@napi-rs/canvas-linux-riscv64-gnu@0.1.80':
    resolution: {integrity: sha512-XTzR125w5ZMs0lJcxRlS1K3P5RaZ9RmUsPtd1uGt+EfDyYMu4c6SEROYsxyatbbu/2+lPe7MPHOO/0a0x7L/gw==}
    engines: {node: '>= 10'}
    cpu: [riscv64]
    os: [linux]
    libc: [glibc]

  '@napi-rs/canvas-linux-x64-gnu@0.1.80':
    resolution: {integrity: sha512-BeXAmhKg1kX3UCrJsYbdQd3hIMDH/K6HnP/pG2LuITaXhXBiNdh//TVVVVCBbJzVQaV5gK/4ZOCMrQW9mvuTqA==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [linux]
    libc: [glibc]

  '@napi-rs/canvas-linux-x64-musl@0.1.80':
    resolution: {integrity: sha512-x0XvZWdHbkgdgucJsRxprX/4o4sEed7qo9rCQA9ugiS9qE2QvP0RIiEugtZhfLH3cyI+jIRFJHV4Fuz+1BHHMg==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [linux]
    libc: [musl]

  '@napi-rs/canvas-win32-x64-msvc@0.1.80':
    resolution: {integrity: sha512-Z8jPsM6df5V8B1HrCHB05+bDiCxjE9QA//3YrkKIdVDEwn5RKaqOxCJDRJkl48cJbylcrJbW4HxZbTte8juuPg==}
    engines: {node: '>= 10'}
    cpu: [x64]
    os: [win32]

  '@napi-rs/canvas@0.1.80':
    resolution: {integrity: sha512-DxuT1ClnIPts1kQx8FBmkk4BQDTfI5kIzywAaMjQSXfNnra5UFU9PwurXrl+Je3bJ6BGsp/zmshVVFbCmyI+ww==}
    engines: {node: '>= 10'}

  '@noble/hashes@1.8.0':
    resolution: {integrity: sha512-jCs9ldd7NwzpgXDIf6P3+NrHh9/sD6CQdxHyjQI+h/6rDNo88ypBxxz45UDuZHz9r3tNz7N/VInSVoVdtXEI4A==}
    engines: {node: ^14.21.3 || >=16}

  '@oxlint/binding-android-arm-eabi@1.86.0':
    resolution: {integrity: sha512-63Ozq6yQn79B2UxjSZ9huJmI+3/ZPI7hxAe6TyFh9oQL447KnIMoffOdtog+h4KILbQr61ZRvFPW5gYbAUgpgQ==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm]
    os: [android]

  '@oxlint/binding-android-arm64@1.86.0':
    resolution: {integrity: sha512-JdLGp44phbf/0Du236Dt06yfK6Qw8xhTFeDvHJdjk167r59OfP5+BL31mgMYVnswS8e+j6tFuccSY0QDC/lgCw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [android]

  '@oxlint/binding-darwin-arm64@1.86.0':
    resolution: {integrity: sha512-h+vkOr4ik6KLFCXdtNVEj9xfnXfNUpPoF95QjORdhiSpLqQePzcN81kGHjAgsw1/G7WBWK5KsFKbI2UK8EyzMA==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [darwin]

  '@oxlint/binding-darwin-x64@1.86.0':
    resolution: {integrity: sha512-wbglRuH5eKsp68keTOOeKDHU1astWSRYFsh2bwKQTAPb44rD6kVgzYI1ZrAJRTc6/7PH55ZXFCQx0rQXrj0UdA==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [x64]
    os: [darwin]

  '@oxlint/binding-freebsd-x64@1.86.0':
    resolution: {integrity: sha512-yTQ7QSOlNfQsrfbeVweTiegQJLKPjUKgXp/JpGiFzza6Hp29S9LAoH77TM3L0RjK39iQRZB5lk5iq2t241Mfag==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [x64]
    os: [freebsd]

  '@oxlint/binding-linux-arm-gnueabihf@1.86.0':
    resolution: {integrity: sha512-QYJGy0E2Tv8GAayyBIeHFTwQb8u+zrvrOYrifuDGZDr9ad5XsDhiMScpZymhS9fwWjqrgG2ZUwT4vpY0ISqp4Q==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm]
    os: [linux]

  '@oxlint/binding-linux-arm-musleabihf@1.86.0':
    resolution: {integrity: sha512-oQo83CafLT8p3qh0AGkN0tSUIh5Hm63mfDsoqUmBQUBnSZLNBAbyRaAftfGY5a0cKZ34dG6jAtMYgcY5kZqt5g==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm]
    os: [linux]

  '@oxlint/binding-linux-arm64-gnu@1.86.0':
    resolution: {integrity: sha512-EM6wy5c2UM12qPb7iDJDBAZvHyfEJGH6iosFgaFiaRZpirz99//EHcUyD2KAskz07x1TULuiAtsojf4nvWWksw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [linux]
    libc: [glibc]

  '@oxlint/binding-linux-arm64-musl@1.86.0':
    resolution: {integrity: sha512-vCiUQb9ZNzZalxYRU4mlZwUqT5f+c7Sk9DwUOplWHtik3Dl4r3DVnUB5tBeRuTAUe6MUVCTylNW7TkkN8J1oTw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [linux]
    libc: [musl]

  '@oxlint/binding-linux-ppc64-gnu@1.86.0':
    resolution: {integrity: sha512-T0AzE89yjTYmOhB/hb6i+rWTpe2mYt+xiguBhs9DEPIJTZ1H8OYqsE4VxJHHw2Wlq8Mztwvp2P8NV87ZOuhPRw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [ppc64]
    os: [linux]
    libc: [glibc]

  '@oxlint/binding-linux-riscv64-gnu@1.86.0':
    resolution: {integrity: sha512-s49r0K2f5Oc7fJoMUO1WkdhYK5Ob79uYRwWQ/XNoGysaOq3RUGmGUbHSuXiyydTTA+P9xEdDEnnlZVXiaSJhlw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [riscv64]
    os: [linux]
    libc: [glibc]

  '@oxlint/binding-linux-riscv64-musl@1.86.0':
    resolution: {integrity: sha512-JIa2tYR8ayb3nvcMSZzn4O/xTy13S7MHllu7cBD+B5qDQXXSRy/Vwk1aNpiTjZmBJGwKCHOy/NvnY5Xcwg27uQ==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [riscv64]
    os: [linux]
    libc: [musl]

  '@oxlint/binding-linux-s390x-gnu@1.86.0':
    resolution: {integrity: sha512-XwXMyBsAuWZkhZU74UNcfQKr1CJJAKnS80dZzOnjl6A4fKcf91IjFgidegQugMHA5SN8ulwDXEDV1yPntjXgQQ==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [s390x]
    os: [linux]
    libc: [glibc]

  '@oxlint/binding-linux-x64-gnu@1.86.0':
    resolution: {integrity: sha512-C1WjukSyMnr66b+w1/tV8RFVv6d9v0MzDf4p9IxVXknqgmTHBgZh1pccN1eHzFr0b9Tbb3OXoPsAAdAuHAQfeA==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [x64]
    os: [linux]
    libc: [glibc]

  '@oxlint/binding-linux-x64-musl@1.86.0':
    resolution: {integrity: sha512-ap6KLmvC38c6MdYzsIh25cXQupqYvjd37tMNftzrX1DCtkX1Gcf2B+S2B17dD4lKa5c5gJog7DQJyDo82PBKyw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [x64]
    os: [linux]
    libc: [musl]

  '@oxlint/binding-openharmony-arm64@1.86.0':
    resolution: {integrity: sha512-996Q9w/2GLwNyy5Djs39Jt09aFlr4b7TPhoj7dvo5FHmcyiF68nPz73HNc5UAYKIYeK+M9JzPQ4Wg1r1dXvP6A==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [openharmony]

  '@oxlint/binding-win32-arm64-msvc@1.86.0':
    resolution: {integrity: sha512-9uTCHYTknNkug5+46ViSoUMuOuGWK61D87QnblU6CXaWKJC630Z7dbls61vdHxya/cR2ycQZ6Mm6ckgF6Cag5g==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [win32]

  '@oxlint/binding-win32-ia32-msvc@1.86.0':
    resolution: {integrity: sha512-a47ga7EKVfMU8rO0i1m3mGwfNRj3FhQyt1d/ukO/E9u1HHF3KpR3tyb3VhuJBGEVPF8uR4exSyHUyx7xbE+uxw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [ia32]
    os: [win32]

  '@oxlint/binding-win32-x64-msvc@1.86.0':
    resolution: {integrity: sha512-az4dzifCRzES1crwu6pDFXzJTIanrdxXFL9TbiJWrx9LKcuacbR83aPvxDA1LKLNswi/RoqitC7Afcflhu3zBQ==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [x64]
    os: [win32]

  '@peculiar/asn1-cms@2.10.0':
    resolution: {integrity: sha512-CkX0H4NCIOMHOU3rh2xXZywinYZ/EnJlaOlJiGI0e5L4XjFqHf4iH30LMbXWChVppdA9ljbanjtzQFOhDNfTWg==}
    engines: {node: '>=14'}

  '@peculiar/asn1-csr@2.10.0':
    resolution: {integrity: sha512-jTPTr/9rxKM+niQLMF3jiAMb0lWHUhUHIuSOhdGCIfpB4FAQYf9SoiXOgxP8bS/68IB+bj+1OHvVnDVCQfVUZw==}
    engines: {node: '>=14'}

  '@peculiar/asn1-ecc@2.10.0':
    resolution: {integrity: sha512-GFd3iOjFrWX+QWH2R2dO5QSJyyRGv9CIBKtRlGlPNCvb2RvmCbBDexe91MJgV76c69d998Xsa+CvuQ98seoiPg==}
    engines: {node: '>=14'}

  '@peculiar/asn1-pfx@2.10.0':
    resolution: {integrity: sha512-1y3QK9ZH1IPleAMmRoJlPS10eGkAWnULETW8zDFNUK1ffqpG7zmDY+kYBMYQgwlcQZ2iitLm2z2EBP0xzRXpaA==}
    engines: {node: '>=14'}

  '@peculiar/asn1-pkcs8@2.10.0':
    resolution: {integrity: sha512-Ri+BZT9bnwqlHWmhs7lvWjvJRxKev2hA2+4EbZajgeYWCbR8hyv0znF4DhsFouOhMj2nSDV/iGJ6DMQtwITnCw==}
    engines: {node: '>=14'}

  '@peculiar/asn1-pkcs9@2.10.0':
    resolution: {integrity: sha512-XIXsbDQFezYk6fudczkuvawkRD4GNpISGCqfYhdkJlvcGF/RFknU+0DDJagOaJqBf+PdPzk4J9oMqDGcvfR9HQ==}
    engines: {node: '>=14'}

  '@peculiar/asn1-rsa@2.10.0':
    resolution: {integrity: sha512-4Jvmwlh3gZAhNZ4/u7JSyLuce9hofOFZ4o3PYKAccCImGnyaT5CMym/ATgvAvqpOYFNW531oPZvJlEBhJy9VfA==}
    engines: {node: '>=14'}

  '@peculiar/asn1-schema@2.10.0':
    resolution: {integrity: sha512-GhokD41lV4gQrrLYm3wCkHfBOnJrnhDMgt4XeMW8gzfE1UdJqIuSwsE+ggf82XBjUXRJylcm+KIGQFa4utIVLw==}
    engines: {node: '>=14'}

  '@peculiar/asn1-x509-attr@2.10.0':
    resolution: {integrity: sha512-/85GtKOKmgvuSJNlaFfwGWNdRSZZ+hpF02NyM01XiCdzpaZONiBltDyfluFPvFx966CR+ZHNSG1jniwpy07oGg==}
    engines: {node: '>=14'}

  '@peculiar/asn1-x509@2.10.0':
    resolution: {integrity: sha512-ucNVg8+ANveTpMN3fy9lA2alryONdXc2A4cEG2hMniWbvQt+YOZoe8BI80YYNO8FBcuDY1qbDQ4uQGQVraHxGA==}
    engines: {node: '>=14'}

  '@peculiar/utils@2.0.3':
    resolution: {integrity: sha512-+oL3HPFRIZ1St2K50lWCXiioIgSoxzz7R1J3uF6neO2yl1sgmpgY6XXJH4BdpoDkMWznQTeYF6oWNDZLCdQ4eQ==}

  '@peculiar/x509@1.14.3':
    resolution: {integrity: sha512-C2Xj8FZ0uHWeCXXqX5B4/gVFQmtSkiuOolzAgutjTfseNOHT3pUjljDZsTSxXFGgio54bCzVFqmEOUrIVk8RDA==}
    engines: {node: '>=20.0.0'}

  '@types/body-parser@1.19.6':
    resolution: {integrity: sha512-HLFeCYgz89uk22N5Qg3dvGvsv46B8GLvKKo1zKG4NybA8U2DiEO3w9lqGg29t/tfLRJpJ6iQxnVw4OnB7MoM9g==}

  '@types/bonjour@3.5.13':
    resolution: {integrity: sha512-z9fJ5Im06zvUL548KvYNecEVlA7cVDkGUi6kZusb04mpyEFKCIZJvloCcmpmLaIahDpOQGHaHmG6imtPMmPXGQ==}

  '@types/connect-history-api-fallback@1.5.4':
    resolution: {integrity: sha512-n6Cr2xS1h4uAulPRdlw6Jl6s1oG8KrVilPN2yUITEs+K48EzMJJ3W1xy8K5eWuFvjp3R74AOIGSmp2UfBJ8HFw==}

  '@types/connect@3.4.38':
    resolution: {integrity: sha512-K6uROf1LD88uDQqJCktA4yzL1YYAK6NgfsI0v/mTgyPKWsX1CnJ0XPSDhViejru1GcRkLWb8RlzFYJRqGUbaug==}

  '@types/debug@4.1.13':
    resolution: {integrity: sha512-KSVgmQmzMwPlmtljOomayoR89W4FynCAi3E8PPs7vmDVPe84hT+vGPKkJfThkmXs0x0jAaa9U8uW8bbfyS2fWw==}

  '@types/estree-jsx@1.0.5':
    resolution: {integrity: sha512-52CcUVNFyfb1A2ALocQw/Dd1BQFNmSdkuC3BkZ6iqhdMfQz7JWOFRuJFloOzjk+6WijU56m9oKXFAXc7o3Towg==}

  '@types/estree@1.0.9':
    resolution: {integrity: sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==}

  '@types/express-serve-static-core@5.1.3':
    resolution: {integrity: sha512-dPfW8NFiOF4wOHc7+N/QSxlY9cfSsenewGbAz8C8U/MULPd/YZ27LvJUIlzaXie7e6Ove9YunJGgC9tbHD2cKw==}

  '@types/express@5.0.6':
    resolution: {integrity: sha512-sKYVuV7Sv9fbPIt/442koC7+IIwK5olP1KWeD88e/idgoJqDm3JV/YUiPwkoKK92ylff2MGxSz1CSjsXelx0YA==}

  '@types/gensync@1.0.5':
    resolution: {integrity: sha512-MbsRCT7mTikHwKZ0X+LVUTLRrZZRLipTuXEO9qOYO+zmjMVk81axyClMROf6uoPD9MRVu46bx8zoR0Ad9q3NAg==}

  '@types/hast@3.0.5':
    resolution: {integrity: sha512-rp/ezSWaD1m44dPKICGhiskI13nVr7qTloFwDa/IYkhhf5nzwP+zIQcIJh3WIFSBOy/H1PzB40jPjMDksN4F+g==}

  '@types/html-minifier-terser@6.1.0':
    resolution: {integrity: sha512-oh/6byDPnL1zeNXFrDXFLyZjkr1MsBG667IM792caf1L2UPOOMf65NFzjUH/ltyfwjAGfs1rsX1eftK0jC/KIg==}

  '@types/http-errors@2.0.5':
    resolution: {integrity: sha512-r8Tayk8HJnX0FztbZN7oVqGccWgw98T/0neJphO91KkmOzug1KkofZURD4UaD5uH8AqcFLfdPErnBod0u71/qg==}

  '@types/jsesc@2.5.1':
    resolution: {integrity: sha512-9VN+6yxLOPLOav+7PwjZbxiID2bVaeq0ED4qSQmdQTdjnXJSaCVKTR58t15oqH1H5t8Ng2ZX1SabJVoN9Q34bw==}

  '@types/json-schema@7.0.15':
    resolution: {integrity: sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==}

  '@types/localforage@0.0.34':
    resolution: {integrity: sha512-tJxahnjm9dEI1X+hQSC5f2BSd/coZaqbIl1m3TCl0q9SVuC52XcXfV0XmoCU1+PmjyucuVITwoTnN8OlTbEXXA==}
    deprecated: This is a stub types definition for localforage (https://github.com/localForage/localForage). localforage provides its own type definitions, so you don't need @types/localforage installed!

  '@types/mdast@4.0.4':
    resolution: {integrity: sha512-kGaNbPh1k7AFzgpud/gMdvIm5xuECykRR+JnWKQno9TAXVa6WIVCGTPvYGekIDL4uwCZQSYbUxNBSb1aUo79oA==}

  '@types/ms@2.1.0':
    resolution: {integrity: sha512-GsCCIZDE/p3i96vtEqx+7dBUGXrc7zeSK3wwPHIaRThS+9OhWIXRqzs4d6k1SVU8g91DrNRWxWUGhp5KXQb2VA==}

  '@types/multer@2.3.0':
    resolution: {integrity: sha512-i7STIm9V4K2MPH4ZYMtrZAwNxs3kglk2LgleaTuB9pUXgADBcQYQuYMd7+6xgTIxfoggIkFA/DkkvycdZpIARA==}

  '@types/node@24.19.0':
    resolution: {integrity: sha512-zY+5tKxXdhGh1PYI0ac+7juvEu4OI6vWtVVoj5i2m42jxAY1U+zHGt6QCyOFwykdP62sM3MJ9stoYYUw5aCWew==}

  '@types/pdf-parse@1.1.5':
    resolution: {integrity: sha512-kBfrSXsloMnUJOKi25s3+hRmkycHfLK6A09eRGqF/N8BkQoPUmaCr+q8Cli5FnfohEz/rsv82zAiPz/LXtOGhA==}

  '@types/qs@6.15.1':
    resolution: {integrity: sha512-GZHUBZR9hckSUhrxmp1nG6NwdpM9fCunJwyThLW1X3AyHgd9IlHb6VANpQQqDr2o/qQp6McZ3y/IA2rVzKzSbw==}

  '@types/range-parser@1.2.7':
    resolution: {integrity: sha512-hKormJbkJqzQGhziax5PItDUTMAM9uE2XXQmM37dyd4hVM+5aVl7oVxMVUiVQn2oCQFN/LKCZdvSM0pFRqbSmQ==}

  '@types/react-dom@19.3.0':
    resolution: {integrity: sha512-ZI7bU42mZXXKHn/qNLEw2IrbiINU7X5+vfgdixBHkCNpYWXjKgfQ/P+uyGb5CjOLB9UcnTeg3rylQtV2hym44Q==}
    peerDependencies:
      '@types/react': ^19.3.0

  '@types/react@19.3.0':
    resolution: {integrity: sha512-N0rFCuH9YoxG9/m61l9MfpJKfmLOVU0em7ipIz6TRgSSkvReLB9vL85GB+yr8Bs5leqpvg96JSwF4ZS1s4viQg==}

  '@types/send@1.2.1':
    resolution: {integrity: sha512-arsCikDvlU99zl1g69TcAB3mzZPpxgw0UQnaHeC1Nwb015xp8bknZv5rIfri9xTOcMuaVgvabfIRA7PSZVuZIQ==}

  '@types/serve-index@1.9.4':
    resolution: {integrity: sha512-qLpGZ/c2fhSs5gnYsQxtDEq3Oy8SXPClIXkW5ghvAvsNuVSA8k+gCONcUCS/UjLEYvYps+e8uBtfgXgvhwfNug==}

  '@types/serve-static@2.2.0':
    resolution: {integrity: sha512-8mam4H1NHLtu7nmtalF7eyBH14QyOASmcxHhSfEoRyr0nP/YdoesEtU+uSRvMe96TW/HPTtkoKqQLl53N7UXMQ==}

  '@types/unist@2.0.11':
    resolution: {integrity: sha512-CmBKiL6NNo/OqgmMn95Fk9Whlp2mtvIv+KNpQKN2F4SjvrEesubTRWGYSg+BnWZOnlCaSTU1sMpsBOzgbYhnsA==}

  '@types/unist@3.0.3':
    resolution: {integrity: sha512-ko/gIFJRv177XgZsZcBwnqJN5x/Gien8qNOn0D5bQU/zAzVf9Zt3BlcUiLqhV9y4ARk0GbT3tnUiPNgnTXzc/Q==}

  '@types/ws@8.18.2':
    resolution: {integrity: sha512-67MQl+fpWKVTT1NYdnmo3U4sc/xPo/zQBncVnI74qmQa0z/b+1g6iYqNmGCPbxO+zz2aklb08a0oHfegiVd0/w==}

  '@ungap/structured-clone@1.4.0':
    resolution: {integrity: sha512-1mEZtMKPM09vDmQt5y7YvmN2+DFTP7Tg0EWXdic8/C6VRnpb33e4ghisCIE3WZjsE2N8mf+QV1Zqh7ZFYLWInQ==}

  '@webassemblyjs/ast@1.14.1':
    resolution: {integrity: sha512-nuBEDgQfm1ccRp/8bCQrx1frohyufl4JlbMMZ4P1wpeOfDhF6FQkxZJ1b/e+PLwr6X1Nhw6OLme5usuBWYBvuQ==}

  '@webassemblyjs/floating-point-hex-parser@1.13.2':
    resolution: {integrity: sha512-6oXyTOzbKxGH4steLbLNOu71Oj+C8Lg34n6CqRvqfS2O71BxY6ByfMDRhBytzknj9yGUPVJ1qIKhRlAwO1AovA==}

  '@webassemblyjs/helper-api-error@1.13.2':
    resolution: {integrity: sha512-U56GMYxy4ZQCbDZd6JuvvNV/WFildOjsaWD3Tzzvmw/mas3cXzRJPMjP83JqEsgSbyrmaGjBfDtV7KDXV9UzFQ==}

  '@webassemblyjs/helper-buffer@1.14.1':
    resolution: {integrity: sha512-jyH7wtcHiKssDtFPRB+iQdxlDf96m0E39yb0k5uJVhFGleZFoNw1c4aeIcVUPPbXUVJ94wwnMOAqUHyzoEPVMA==}

  '@webassemblyjs/helper-numbers@1.13.2':
    resolution: {integrity: sha512-FE8aCmS5Q6eQYcV3gI35O4J789wlQA+7JrqTTpJqn5emA4U2hvwJmvFRC0HODS+3Ye6WioDklgd6scJ3+PLnEA==}

  '@webassemblyjs/helper-wasm-bytecode@1.13.2':
    resolution: {integrity: sha512-3QbLKy93F0EAIXLh0ogEVR6rOubA9AoZ+WRYhNbFyuB70j3dRdwH9g+qXhLAO0kiYGlg3TxDV+I4rQTr/YNXkA==}

  '@webassemblyjs/helper-wasm-section@1.14.1':
    resolution: {integrity: sha512-ds5mXEqTJ6oxRoqjhWDU83OgzAYjwsCV8Lo/N+oRsNDmx/ZDpqalmrtgOMkHwxsG0iI//3BwWAErYRHtgn0dZw==}

  '@webassemblyjs/ieee754@1.13.2':
    resolution: {integrity: sha512-4LtOzh58S/5lX4ITKxnAK2USuNEvpdVV9AlgGQb8rJDHaLeHciwG4zlGr0j/SNWlr7x3vO1lDEsuePvtcDNCkw==}

  '@webassemblyjs/leb128@1.13.2':
    resolution: {integrity: sha512-Lde1oNoIdzVzdkNEAWZ1dZ5orIbff80YPdHx20mrHwHrVNNTjNr8E3xz9BdpcGqRQbAEa+fkrCb+fRFTl/6sQw==}

  '@webassemblyjs/utf8@1.13.2':
    resolution: {integrity: sha512-3NQWGjKTASY1xV5m7Hr0iPeXD9+RDobLll3T9d2AO+g3my8xy5peVyjSag4I50mR1bBSN/Ct12lo+R9tJk0NZQ==}

  '@webassemblyjs/wasm-edit@1.14.1':
    resolution: {integrity: sha512-RNJUIQH/J8iA/1NzlE4N7KtyZNHi3w7at7hDjvRNm5rcUXa00z1vRz3glZoULfJ5mpvYhLybmVcwcjGrC1pRrQ==}

  '@webassemblyjs/wasm-gen@1.14.1':
    resolution: {integrity: sha512-AmomSIjP8ZbfGQhumkNvgC33AY7qtMCXnN6bL2u2Js4gVCg8fp735aEiMSBbDR7UQIj90n4wKAFUSEd0QN2Ukg==}

  '@webassemblyjs/wasm-opt@1.14.1':
    resolution: {integrity: sha512-PTcKLUNvBqnY2U6E5bdOQcSM+oVP/PmrDY9NzowJjislEjwP/C4an2303MCVS2Mg9d3AJpIGdUFIQQWbPds0Sw==}

  '@webassemblyjs/wasm-parser@1.14.1':
    resolution: {integrity: sha512-JLBl+KZ0R5qB7mCnud/yyX08jWFw5MsoalJ1pQ4EdFlgj9VdXKGuENGsiCIjegI1W7p91rUlcB/LB5yRJKNTcQ==}

  '@webassemblyjs/wast-printer@1.14.1':
    resolution: {integrity: sha512-kPSSXE6De1XOR820C90RIo2ogvZG+c3KiHzqUoO/F34Y2shGzesfqv7o57xrxovZJH/MetF5UjroJ/R/3isoiw==}

  '@xmldom/xmldom@0.7.13':
    resolution: {integrity: sha512-lm2GW5PkosIzccsaZIz7tp8cPADSIlIHWDFTR1N0SzfinhhYgeIQjFMz4rYzanCScr3DqQLeomUDArp6MWKm+g==}
    engines: {node: '>=10.0.0'}
    deprecated: this version has critical issues, please update to the latest version

  '@xmldom/xmldom@0.8.15':
    resolution: {integrity: sha512-/5NV/vDALVFDXgLmfsy9TRCBlKwO2LNBFzpzvb9iIj+jR+eSc6DLYYvVOdivT/jm7MtU6TebYuRmzEOI7w40UA==}
    engines: {node: '>=10.0.0'}

  '@xtuc/ieee754@1.2.0':
    resolution: {integrity: sha512-DX8nKgqcGwsc0eJSqYt5lwP4DH5FlHnmuWWBRy7X0NcaGR0ZtuyeESgMwTYVEtxmsNGY+qit4QYT/MIYTOTPeA==}

  '@xtuc/long@4.2.2':
    resolution: {integrity: sha512-NuHqBY1PB/D8xU6s/thBgOAiAP7HOYDQ32+BFZILJ8ivkUkAHQnWfn6WhL79Owj1qmUnoN/YPhktdIoucipkAQ==}

  accepts@1.3.8:
    resolution: {integrity: sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==}
    engines: {node: '>= 0.6'}

  accepts@2.0.0:
    resolution: {integrity: sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==}
    engines: {node: '>= 0.6'}

  acorn@8.18.0:
    resolution: {integrity: sha512-lGq+9yr1/GuAWaVYIHRjvvySG5/4VfKIvC8EWxStPdcDh/Ka7FG3twP6v4d5BkravUilhIAsG4Qj83t02LWUPQ==}
    engines: {node: '>=0.4.0'}
    hasBin: true

  ajv-formats@3.0.1:
    resolution: {integrity: sha512-8iUql50EUR+uUcdRQ3HDqa6EVyo3docL8g5WJ3FNcWmu62IbkGUue/pEyLBW8VGKKucTPgqeks4fIU1DA4yowQ==}
    peerDependencies:
      ajv: ^8.0.0
    peerDependenciesMeta:
      ajv:
        optional: true

  ajv-keywords@5.1.0:
    resolution: {integrity: sha512-YCS/JNFAUyr5vAuhk1DWm1CBxRHW9LbJ2ozWeemrIqpbsqKjHVxYPyi5GC0rjZIT5JxJ3virVTS8wk4i/Z+krw==}
    peerDependencies:
      ajv: ^8.8.2

  ajv@8.20.0:
    resolution: {integrity: sha512-Thbli+OlOj+iMPYFBVBfJ3OmCAnaSyNn4M1vz9T6Gka5Jt9ba/HIR56joy65tY6kx/FCF5VXNB819Y7/GUrBGA==}

  ansi-html-community@0.0.8:
    resolution: {integrity: sha512-1APHAyr3+PCamwNw3bXCPp4HFLONZt/yIH0sZp0/469KWNTEy+qN5jQ3GVX6DMZ1UXAi34yVwtTeaG/HpBuuzw==}
    engines: {'0': node >= 0.8.0}
    hasBin: true

  ansi-regex@5.0.1:
    resolution: {integrity: sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==}
    engines: {node: '>=8'}

  ansi-regex@6.4.0:
    resolution: {integrity: sha512-KzTVk2tCWAHtYrvvvaP8bJKJq2pVinhLcGEQdtLIYPbmNGNyYe8QwNaTUYQp2J7/vIsUKt5QCqAfUkYyG9DkOw==}
    engines: {node: '>=12'}

  ansi-styles@6.2.3:
    resolution: {integrity: sha512-4Dj6M28JB+oAH8kFkTLUo+a2jwOFkuqb3yucU0CANcRRUbxS0cP0nZYCGjcc3BNXwRIsUVmDGgzawme7zvJHvg==}
    engines: {node: '>=12'}

  append-field@1.0.0:
    resolution: {integrity: sha512-klpgFSWLW1ZEs8svjfb7g4qWY0YS5imI82dTg+QahUvJ8YqAY0P10Uk8tTyh9ZGuYEZEMaeJYCF5BFuX552hsw==}

  argparse@1.0.10:
    resolution: {integrity: sha512-o5Roy6tNG4SL/FOkCAN6RzjiakZS25RLYFrcMttJqbdd8BWrnA+fGz57iN5Pb06pvBGvl5gQ0B48dJlslXvoTg==}

  asn1js@3.0.10:
    resolution: {integrity: sha512-S2s3aOytiKdFRdulw2qPE51MzjzVOisppcVv7jVFR+Kw0kxwvFrDcYA0h7Ndqbmj0HkMIXYWaoj7fli8kgx1eg==}
    engines: {node: '>=12.0.0'}

  babel-loader@10.1.1:
    resolution: {integrity: sha512-JwKSzk2kjIe7mgPK+/lyZ2QAaJcpahNAdM+hgR2HI8D0OJVkdj8Rl6J3kaLYki9pwF7P2iWnD8qVv80Lq1ABtg==}
    engines: {node: ^18.20.0 || ^20.10.0 || >=22.0.0}
    peerDependencies:
      '@babel/core': ^7.12.0 || ^8.0.0-beta.1
      '@rspack/core': ^1.0.0 || ^2.0.0-0
      webpack: '>=5.61.0'
    peerDependenciesMeta:
      '@rspack/core':
        optional: true
      webpack:
        optional: true

  babel-plugin-polyfill-corejs3@1.0.0:
    resolution: {integrity: sha512-yIkslVjbmml2Xjb6XhFW7lISXHsqk6cesxTdDsXoMom4Lnb99DbD3OQbSOoM5Z+ASh8YXYaLAsRQrU2Jeh3Qig==}
    engines: {node: ^20.19.0 || >=22.12.0}
    peerDependencies:
      '@babel/core': ^7.4.0 || ^8.0.0

  bail@2.0.2:
    resolution: {integrity: sha512-0xO6mYd7JB2YesxDKplafRpsiOzPt9V02ddPCLbY1xYGPOX24NTyN50qnUxgCPcSoYMhKpAuBTjQoRZCAkUDRw==}

  base64-js@1.5.1:
    resolution: {integrity: sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==}

  baseline-browser-mapping@2.11.26:
    resolution: {integrity: sha512-GLQdD3y6UF8iVuMJl5fHgE4jdn/ua7n+toKfLgNlg3BqQtOZjpy68T8Tup8/wGWZCDlm7KMg7tPb4MPn7oN0TQ==}
    engines: {node: '>=6.0.0'}
    hasBin: true

  batch@0.6.1:
    resolution: {integrity: sha512-x+VAiMRL6UPkx+kudNvxTl6hB2XNNCG2r+7wixVfIYwu/2HKRXimwQyaumLjMveWvT2Hkd/cAJw+QBMfJ/EKVw==}

  body-parser@2.3.0:
    resolution: {integrity: sha512-2cGmJupaNgg+QUwVLAucDuWuoMZ6EX9iHDRswZ5lsNYEmwPaRknMPCLZz07yTzVq/83p4o/wzbDZbBrTvGGTIw==}
    engines: {node: '>=18'}

  bonjour-service@1.4.4:
    resolution: {integrity: sha512-jCZcVv7eoc4QesRscwEZtSROBen+6LpKAmBIsQYQrsAeVHLyMXWX/t6eIV5KiRZYNUBl8eVqImEEMQ8L5+c/Kw==}

  boolbase@1.0.0:
    resolution: {integrity: sha512-JZOSA7Mo9sNGB8+UjSgzdLtokWAky1zbztM3WRLCbZ70/3cTANmQmOdR7y2g+J0e2WXywy1yS468tY+IruqEww==}

  braces@3.0.3:
    resolution: {integrity: sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==}
    engines: {node: '>=8'}

  browserslist@4.29.3:
    resolution: {integrity: sha512-1R4kiYKXGViqEN0CnoDrXc1StD9niAwu+j2dukWzrD4bJgsD4lDmEp0CRbc6E/vYJIfTHwPmwyaKtVSudICdPA==}
    engines: {node: ^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7}
    hasBin: true

  buffer-from@1.1.2:
    resolution: {integrity: sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==}

  bundle-name@4.1.1:
    resolution: {integrity: sha512-DdH81/zPLVS11EUgWq3tEu/xn+EzljlMYooDNdzWEnFha3R3NBMpMV1UqYIpjYHV/SgpFKMIX1Oh7o06SjM/oA==}
    engines: {node: '>=18'}

  busboy@1.6.0:
    resolution: {integrity: sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==}
    engines: {node: '>=10.16.0'}

  bytes@3.1.2:
    resolution: {integrity: sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==}
    engines: {node: '>= 0.8'}

  bytestreamjs@2.0.1:
    resolution: {integrity: sha512-U1Z/ob71V/bXfVABvNr/Kumf5VyeQRBEm6Txb0PQ6S7V5GpBM3w4Cbqz/xPDicR5tN0uvDifng8C+5qECeGwyQ==}
    engines: {node: '>=6.0.0'}

  call-bind-apply-helpers@1.0.2:
    resolution: {integrity: sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==}
    engines: {node: '>= 0.4'}

  call-bound@1.0.4:
    resolution: {integrity: sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==}
    engines: {node: '>= 0.4'}

  camel-case@4.1.2:
    resolution: {integrity: sha512-gxGWBrTT1JuMx6R+o5PTXMmUnhnVzLQ9SNutD4YqKtI6ap897t3tKECYla6gCWEkplXnlNybEkZg9GEGxKFCgw==}

  caniuse-lite@1.0.30001813:
    resolution: {integrity: sha512-zfjJo4rM0+fUomGDBW/xcDjhIwz/210DGvip2MAMDZ8KHcRPnOHmEgHPZP0UHlZoxr8fYKVJOqcORhYQcG4FKQ==}

  ccount@2.0.1:
    resolution: {integrity: sha512-eyrF0jiFpY+3drT6383f1qhkbGsLSifNAjA61IUjZjmLCWjItY6LB9ft9YhoDgwfmclB2zhu51Lc7+95b8NRAg==}

  chalk@5.6.2:
    resolution: {integrity: sha512-7NzBL0rN6fMUW+f7A6Io4h40qQlG+xGmtMxfbnH/K7TAtt8JQWVQK+6g0UXKMeVJoyV5EkkNsErQ8pVD3bLHbA==}
    engines: {node: ^12.17.0 || ^14.13 || >=16.0.0}

  character-entities-html4@2.1.0:
    resolution: {integrity: sha512-1v7fgQRj6hnSwFpq1Eu0ynr/CDEw0rXo2B61qXrLNdHZmPKgb7fqS1a2JwF0rISo9q77jDI8VMEHoApn8qDoZA==}

  character-entities-legacy@3.0.0:
    resolution: {integrity: sha512-RpPp0asT/6ufRm//AJVwpViZbGM/MkjQFxJccQRHmISF/22NBtsHqAWmL+/pmkPWoIUJdWyeVleTl1wydHATVQ==}

  character-entities@2.0.2:
    resolution: {integrity: sha512-shx7oQ0Awen/BRIdkjkvz54PnEEI/EjwXDSIZp86/KKdbafHh1Df/RYGBhn4hbe2+uKC9FnT5UCEdyPz3ai9hQ==}

  character-reference-invalid@2.0.1:
    resolution: {integrity: sha512-iBZ4F4wRbyORVsu0jPV7gXkOsGYjGHPmAyv+HiHG8gi5PtC9KI2j1+v8/tlibRvjoWX027ypmG/n0HtO5t7unw==}

  chokidar@5.0.0:
    resolution: {integrity: sha512-TQMmc3w+5AxjpL8iIiwebF73dRDF4fBIieAqGn9RGCWaEVwQ6Fb2cGe31Yns0RRIzii5goJ1Y7xbMwo1TxMplw==}
    engines: {node: '>= 20.19.0'}

  chrome-trace-event@1.0.4:
    resolution: {integrity: sha512-rNjApaLzuwaOTjCiT8lSDdGN1APCiqkChLMJxJPWLunPAt5fy8xgU9/jNOchV84wfIxrA0lRQB7oCT8jrn/wrQ==}
    engines: {node: '>=6.0'}

  clean-css@5.3.3:
    resolution: {integrity: sha512-D5J+kHaVb/wKSFcyyV75uCn8fiY4sV38XJoe4CUyGQ+mOU/fMVYUdH1hJC+CJQ5uY3EnW27SbJYS4X8BiLrAFg==}
    engines: {node: '>= 10.0'}

  cliui@9.0.1:
    resolution: {integrity: sha512-k7ndgKhwoQveBL+/1tqGJYNz097I7WOvwbmmU2AR5+magtbjPWQTS1C5vzGkBC8Ym8UWRzfKUzUUqFLypY4Q+w==}
    engines: {node: '>=20'}

  clone-deep@4.0.1:
    resolution: {integrity: sha512-neHB9xuzh/wk0dIHweyAXv2aPGZIVk3pLMe+/RNzINf17fe0OG96QroktYAUm7SM1PBnzTabaLboqqxDyMU+SQ==}
    engines: {node: '>=6'}

  comma-separated-tokens@2.0.3:
    resolution: {integrity: sha512-Fu4hJdvzeylCfQPp9SGWidpzrMs7tTrlu6Vb8XGaRGck8QSNZJJp538Wrb60Lax4fPwR64ViY468OIUTbRlGZg==}

  commander@14.0.3:
    resolution: {integrity: sha512-H+y0Jo/T1RZ9qPP4Eh1pkcQcLRglraJaSLoyOtHxu6AapkjWVCy2Sit1QQ4x3Dng8qDlSsZEet7g5Pq06MvTgw==}
    engines: {node: '>=20'}

  commander@2.20.3:
    resolution: {integrity: sha512-GpVkmM8vF2vQUkj2LvZmD35JxeJOLCwJ9cUkugyk2nuhbv3+mJvpLYYt+0+USMxE+oj+ey/lJEnhZw75x/OMcQ==}

  commander@8.3.0:
    resolution: {integrity: sha512-OkTL9umf+He2DZkUq8f8J9of7yL6RJKI24dVITBmNfZBmri9zYZQrKkuXiKhyfPSu8tUhnVBB1iKXevvnlR4Ww==}
    engines: {node: '>= 12'}

  compressible@2.0.18:
    resolution: {integrity: sha512-AF3r7P5dWxL8MxyITRMlORQNaOA2IkAFaTr4k7BUumjPtRpGDTZpl0Pb1XCO6JeDCBdp126Cgs9sMxqSjgYyRg==}
    engines: {node: '>= 0.6'}

  compression@1.8.2:
    resolution: {integrity: sha512-o8vI5RE5A6EVVOd9o41jKp41aJom+QTEO/Bx8MYNjexMo/Bv2WOjUfZr+aL0WnYSgymUy6zeguqLTsIhV0gMvQ==}
    engines: {node: '>= 0.8.0'}

  concurrently@10.0.5:
    resolution: {integrity: sha512-JaP/CoftUrCcAFW/g//RbgEGwlelnEae6cfBLgH6ZdO6s8jPkn6p9SB9u6pdVxYXoiSnFqseOlHfrEfF82TVOg==}
    engines: {node: '>=22'}
    hasBin: true

  connect-history-api-fallback@2.0.0:
    resolution: {integrity: sha512-U73+6lQFmfiNPrYbXqr6kZ1i1wiRqXnp2nhMsINseWXO8lDau0LGEffJ8kQi4EjLZympVgRdvqjAgiZ1tgzDDA==}
    engines: {node: '>=0.8'}

  content-disposition@1.1.0:
    resolution: {integrity: sha512-5jRCH9Z/+DRP7rkvY83B+yGIGX96OYdJmzngqnw2SBSxqCFPd0w2km3s5iawpGX8krnwSGmF0FW5Nhr0Hfai3g==}
    engines: {node: '>=18'}

  content-type@1.0.5:
    resolution: {integrity: sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==}
    engines: {node: '>= 0.6'}

  content-type@2.1.0:
    resolution: {integrity: sha512-mj7UPXE0jaqaOsukNZRUEfEi2AcL7C/vwmwcHV0O97eO1E1pxBZuyjlZrx5seTaNBg1U6+o35wpa35Qfcc+7ag==}
    engines: {node: '>=18'}

  convert-source-map@2.0.0:
    resolution: {integrity: sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==}

  cookie-signature@1.2.2:
    resolution: {integrity: sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==}
    engines: {node: '>=6.6.0'}

  cookie@0.7.2:
    resolution: {integrity: sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==}
    engines: {node: '>= 0.6'}

  core-js-compat@3.50.0:
    resolution: {integrity: sha512-XGpFGbMLHwSt74YLTKho7Ib242qi6O8MSX+sRokV4oz7iKXvQWGYZthjIhjRGMxjzVkAubBO512dKGYcefmX3Q==}
    engines: {node: '>=6.4.0'}

  core-js@3.50.0:
    resolution: {integrity: sha512-BRWgOLKkFeCgRudR6zrs8p9XJZcE14grzKMMssoYrk6krtuEZ7MTKPIY5RzOnqsEKIR9kst7wNzphttraT+Yqw==}

  core-util-is@1.0.3:
    resolution: {integrity: sha512-ZQBvi1DcpJ4GDqanjucZ2Hj3wEO5pZDS89BWbkcrvdxksJorwUDDZamX9ldFkp9aw2lmBDLgkObEA4DWNJ9FYQ==}

  cross-spawn@7.0.6:
    resolution: {integrity: sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==}
    engines: {node: '>= 8'}

  css-loader@7.1.5:
    resolution: {integrity: sha512-Q7iAfQkU2twNBryKX/vGAlE+GAmkF7quhSzAGNK8fBimxk3+tqg245rH52UPb9dioBolBc8rP0ihmHBaDTJQBA==}
    engines: {node: '>= 18.12.0'}
    peerDependencies:
      '@rspack/core': 0.x || ^1.0.0 || ^2.0.0-0
      webpack: ^5.27.0
    peerDependenciesMeta:
      '@rspack/core':
        optional: true
      webpack:
        optional: true

  css-select@4.3.0:
    resolution: {integrity: sha512-wPpOYtnsVontu2mODhA19JrqWxNsfdatRKd64kmpRbQgh1KtItko5sTnEpPdpSaJszTOhEMlF/RPz28qj4HqhQ==}

  css-what@6.2.2:
    resolution: {integrity: sha512-u/O3vwbptzhMs3L1fQE82ZSLHQQfto5gyZzwteVIEyeaY5Fc7R4dapF/BvRoSYFeqfBk4m0V1Vafq5Pjv25wvA==}
    engines: {node: '>= 6'}

  cssesc@3.0.0:
    resolution: {integrity: sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==}
    engines: {node: '>=4'}
    hasBin: true

  csstype@3.2.3:
    resolution: {integrity: sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==}

  d@1.0.2:
    resolution: {integrity: sha512-MOqHvMWF9/9MX6nza0KgvFH4HpMU0EF5uUDXqX/BtxtU8NfB0QzRtJ8Oe/6SuS4kbhyzVJwjd97EA4PKrzJ8bw==}
    engines: {node: '>=0.12'}

  debug@2.6.9:
    resolution: {integrity: sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true

  debug@4.4.3:
    resolution: {integrity: sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==}
    engines: {node: '>=6.0'}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true

  decode-named-character-reference@1.3.0:
    resolution: {integrity: sha512-GtpQYB283KrPp6nRw50q3U9/VfOutZOe103qlN7BPP6Ad27xYnOIWv4lPzo8HCAL+mMZofJ9KEy30fq6MfaK6Q==}

  default-browser-id@5.0.1:
    resolution: {integrity: sha512-x1VCxdX4t+8wVfd1so/9w+vQ4vx7lKd2Qp5tDRutErwmR85OgmfX7RlLRMWafRMY7hbEiXIbudNrjOAPa/hL8Q==}
    engines: {node: '>=18'}

  default-browser@5.5.1:
    resolution: {integrity: sha512-m1pAzaJgZ/gssEqlOhJkPJp8Xly7QyW6xcrkUa2KKcDeDSEMP7X8xipU3snUcfisTQx0w1AGae+9UtJSfVnXGw==}
    engines: {node: '>=18'}

  define-lazy-prop@3.0.0:
    resolution: {integrity: sha512-N+MeXYoqr3pOgn8xfyRPREN7gHakLYjhsHhWGT3fWAiL4IkAt0iDw14QiiEm2bE30c5XX5q0FtAA3CK5f9/BUg==}
    engines: {node: '>=12'}

  depd@1.1.2:
    resolution: {integrity: sha512-7emPTl6Dpo6JRXOXjLRxck+FlLRX5847cLKEn00PLAgc3g2hTZZgr+e4c2v6QpSmLeFP3n5yUo7ft6avBK/5jQ==}
    engines: {node: '>= 0.6'}

  depd@2.0.0:
    resolution: {integrity: sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==}
    engines: {node: '>= 0.8'}

  dequal@2.0.3:
    resolution: {integrity: sha512-0je+qPKHEMohvfRTCEo3CrPG6cAzAYgmzKyxRiYSSDkS6eGJdyVJm7WaYA5ECaAD9wLB2T4EEeymA5aFVcYXCA==}
    engines: {node: '>=6'}

  destroy@1.2.0:
    resolution: {integrity: sha512-2sJGJTaXIIaR1w4iJSNoN0hnMY7Gpc/n8D4qSCJw8QqFWXf7cuAgnEHxBpweaVcPevC2l3KpjYCx3NypQQgaJg==}
    engines: {node: '>= 0.8', npm: 1.2.8000 || >= 1.4.16}

  devlop@1.1.0:
    resolution: {integrity: sha512-RWmIqhcFf1lRYBvNmr7qTNuyCt/7/ns2jbpp1+PalgE/rDQcBT0fioSMUpJ93irlUhC5hrg4cYqe6U+0ImW0rA==}

  dingbat-to-unicode@1.0.2:
    resolution: {integrity: sha512-R0bRerYzy/EZP6QzD3Hkl6JjUDA1Mnn+pd928w0nWjPzihnbAR6dcjGJGiRyznj5E4S1duEKzWrTqw02DPcdzg==}

  dns-packet@5.6.1:
    resolution: {integrity: sha512-l4gcSouhcgIKRvyy99RNVOgxXiicE+2jZoNmaNmZ6JXiGajBOJAesk1OBlJuM5k2c+eudGdLxDqXuPCKIj6kpw==}
    engines: {node: '>=6'}

  dom-converter@0.2.0:
    resolution: {integrity: sha512-gd3ypIPfOMr9h5jIKq8E3sHOTCjeirnl0WK5ZdS1AW0Odt0b1PaWaHdJ4Qk4klv+YB9aJBS7mESXjFoDQPu6DA==}

  dom-serializer@1.4.1:
    resolution: {integrity: sha512-VHwB3KfrcOOkelEG2ZOfxqLZdfkil8PtJi4P8N2MMXucZq2yLp75ClViUlOVwyoHEDjYU433Aq+5zWP61+RGag==}

  domelementtype@2.3.0:
    resolution: {integrity: sha512-OLETBj6w0OsagBwdXnPdN0cnMfF9opN69co+7ZrbfPGrdpPVNBUj02spi6B1N7wChLQiPn4CSH/zJvXw56gmHw==}

  domhandler@4.3.1:
    resolution: {integrity: sha512-GrwoxYN+uWlzO8uhUXRl0P+kHE4GtVPfYzVLcUxPL7KNdHKj66vvlhiweIHqYYXWlw+T8iLMp42Lm67ghw4WMQ==}
    engines: {node: '>= 4'}

  domutils@2.8.0:
    resolution: {integrity: sha512-w96Cjofp72M5IIhpjgobBimYEfoPjx1Vx0BSX9P30WBdZW2WIKU0T1Bd0kz2eNZ9ikjKgHbEyKx8BB6H1L3h3A==}

  dot-case@3.0.4:
    resolution: {integrity: sha512-Kv5nKlh6yRrdrGvxeJ2e5y2eRUpkUosIW4A2AS38zwSz27zu7ufDwQPi5Jhs3XAlGNetl3bmnGhQsMtkKJnj3w==}

  duck@0.1.12:
    resolution: {integrity: sha512-wkctla1O6VfP89gQ+J/yDesM0S7B7XLXjKGzXxMDVFg7uEn706niAtyYovKbyq1oT9YwDcly721/iUWoc8MVRg==}

  dunder-proto@1.0.1:
    resolution: {integrity: sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==}
    engines: {node: '>= 0.4'}

  ee-first@1.1.1:
    resolution: {integrity: sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==}

  electron-to-chromium@1.5.441:
    resolution: {integrity: sha512-b84H5dyxtHtXYbJRJPLvbS+iud4ys2GVZ61BH7/9lJrfCcIL+Sk+Vh2AW6beaErTdstvjZLgEwkE2j0fZlmwRA==}

  emoji-regex@10.6.0:
    resolution: {integrity: sha512-toUI84YS5YmxW219erniWD0CIVOo46xGKColeNQRgOzDorgBi1v4D71/OFzgD9GO2UGKIv1C3Sp8DAn0+j5w7A==}

  empathic@2.1.0:
    resolution: {integrity: sha512-AnfC1ATldl49/cvZdLPDjBfrRNwbDO05aibiOtzQu3qtlbJtomNLhF30HEtn/7iBz50dlMECqATo3fG0LrdEgw==}
    engines: {node: '>=14'}

  encodeurl@2.0.0:
    resolution: {integrity: sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==}
    engines: {node: '>= 0.8'}

  enhanced-resolve@5.26.0:
    resolution: {integrity: sha512-9vhedylFonb2YGogzUKX6+Ja72gOJbN1QHAqdrvqLwhdl/QWbKopzoUC9EbQNVsAns/bx/4uyqalrQAoy1IByw==}
    engines: {node: '>=10.13.0'}

  entities@2.2.0:
    resolution: {integrity: sha512-p92if5Nz619I0w+akJrLZH0MX0Pb5DX39XOwQTtXSdQQOaYH03S1uIQp4mhOZtAXrxq4ViO67YTiLBo2638o9A==}

  envinfo@7.21.0:
    resolution: {integrity: sha512-Lw7I8Zp5YKHFCXL7+Dz95g4CcbMEpgvqZNNq3AmlT5XAV6CgAAk6gyAMqn2zjw08K9BHfcNuKrMiCPLByGafow==}
    engines: {node: '>=4'}
    hasBin: true

  epubjs@0.3.93:
    resolution: {integrity: sha512-c06pNSdBxcXv3dZSbXAVLE1/pmleRhOT6mXNZo6INKmvuKpYB65MwU/lO7830czCtjIiK9i+KR+3S+p0wtljrw==}

  es-define-property@1.0.1:
    resolution: {integrity: sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==}
    engines: {node: '>= 0.4'}

  es-errors@1.3.0:
    resolution: {integrity: sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==}
    engines: {node: '>= 0.4'}

  es-module-lexer@2.3.2:
    resolution: {integrity: sha512-poHGpORABojJJucnV9KbOavETW8lBVnphkW77ER5/BQ5Fz7oXSoCNek7IH3vR5nRjdsEz926ibFYX8KtLQmdyw==}

  es-object-atoms@1.1.2:
    resolution: {integrity: sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==}
    engines: {node: '>= 0.4'}

  es5-ext@0.10.64:
    resolution: {integrity: sha512-p2snDhiLaXe6dahss1LddxqEm+SkuDvV8dnIQG0MWjyHpcMNfXKPE+/Cc0y+PhxJX3A4xGNeFCj5oc0BUh6deg==}
    engines: {node: '>=0.10'}

  es6-iterator@2.0.3:
    resolution: {integrity: sha512-zw4SRzoUkd+cl+ZoE15A9o1oQd920Bb0iOJMQkQhl3jNc03YqVjAhG7scf9C5KWRU/R13Orf588uCC6525o02g==}

  es6-symbol@3.1.4:
    resolution: {integrity: sha512-U9bFFjX8tFiATgtkJ1zg25+KviIXpgRvRHS8sau3GfhVzThRQrOeksPeT0BWW2MNZs1OEWJ1DPXOQMn0KKRkvg==}
    engines: {node: '>=0.12'}

  esbuild@0.28.2:
    resolution: {integrity: sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==}
    engines: {node: '>=18'}
    hasBin: true

  escalade@3.2.0:
    resolution: {integrity: sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==}
    engines: {node: '>=6'}

  escape-html@1.0.3:
    resolution: {integrity: sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==}

  escape-string-regexp@5.0.0:
    resolution: {integrity: sha512-/veY75JbMK4j1yjvuUxuVsiS/hr/4iHs9FTT6cgTexxdE0Ly/glccBAkloH/DofkjRbZU3bnoj38mOmhkZ0lHw==}
    engines: {node: '>=12'}

  esniff@2.0.1:
    resolution: {integrity: sha512-kTUIGKQ/mDPFoJ0oVfcmyJn4iBDRptjNVIzwIFR7tqWXdVI9xfA2RMwY/gbSpJG3lkdWNEjLap/NqVHZiJsdfg==}
    engines: {node: '>=0.10'}

  estree-util-is-identifier-name@3.0.0:
    resolution: {integrity: sha512-hFtqIDZTIUZ9BXLb8y4pYGyk6+wekIivNVTcmvk8NoOh+VeRn5y6cEHzbURrWbfp1fIqdVipilzj+lfaadNZmg==}

  esutils@2.0.3:
    resolution: {integrity: sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==}
    engines: {node: '>=0.10.0'}

  etag@1.8.1:
    resolution: {integrity: sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==}
    engines: {node: '>= 0.6'}

  event-emitter@0.3.5:
    resolution: {integrity: sha512-D9rRn9y7kLPnJ+hMq7S/nhvoKwwvVJahBi2BPmx3bvbsEdK3W9ii8cBSGjP+72/LnM4n6fo3+dkCX5FeTQruXA==}

  events@3.3.0:
    resolution: {integrity: sha512-mQw+2fkQbALzQ7V0MY0IqdnXNOeTtP4r0lN9z7AAawCXgqea7bDii20AYrIBrFd/Hx0M2Ocz6S111CaFkUcb0Q==}
    engines: {node: '>=0.8.x'}

  express@5.2.1:
    resolution: {integrity: sha512-hIS4idWWai69NezIdRt2xFVofaF4j+6INOpJlVOLDO8zXGpUVEVzIYk12UUi2JzjEzWL3IOAxcTubgz9Po0yXw==}
    engines: {node: '>= 18'}

  ext@1.7.0:
    resolution: {integrity: sha512-6hxeJYaL110a9b5TEJSj0gojyHQAmA2ch5Os+ySCiA1QGdS697XWY1pzsrSjqA9LDEEgdB/KypIlR59RcLuHYw==}

  extend@3.0.2:
    resolution: {integrity: sha512-fjquC59cD7CyW6urNXK0FBufkZcoiGG80wTuPujX590cB5Ttln20E2UB4S/WARVqhXffZl2LNgS+gQdPIIim/g==}

  fast-deep-equal@3.1.3:
    resolution: {integrity: sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==}

  fast-uri@3.1.8:
    resolution: {integrity: sha512-GZMtZUTNRpOVIECoXwLNZS5xUGE+mVNbTB8h/7Rwh2TFWcBQiPzTgyZi05BF9UMZKkLJv8XBRJTlU7zg8+ZfMg==}

  fdir@6.5.0:
    resolution: {integrity: sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==}
    engines: {node: '>=12.0.0'}
    peerDependencies:
      picomatch: ^3 || ^4
    peerDependenciesMeta:
      picomatch:
        optional: true

  fill-range@7.1.1:
    resolution: {integrity: sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==}
    engines: {node: '>=8'}

  finalhandler@2.1.1:
    resolution: {integrity: sha512-S8KoZgRZN+a5rNwqTxlZZePjT/4cnm0ROV70LedRHZ0p8u9fRID0hJUZQpkKLzro8LfmC8sx23bY6tVNxv8pQA==}
    engines: {node: '>= 18.0.0'}

  find-up@4.1.0:
    resolution: {integrity: sha512-PpOwAdQ/YlXQ2vj8a3h8IipDuYRi3wceVQQGYWxNINccq40Anw7BlsEXCMbt1Zt+OLA6Fq9suIpIWD0OsnISlw==}
    engines: {node: '>=8'}

  find-up@5.0.0:
    resolution: {integrity: sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==}
    engines: {node: '>=10'}

  flat@5.0.2:
    resolution: {integrity: sha512-b6suED+5/3rTpUBdG1gupIl8MPFCAMA0QXwmljLhvCUKcUvdE4gWky9zpuGCcXHOsz4J9wPGNWq6OKpmIzz3hQ==}
    hasBin: true

  flru@1.0.2:
    resolution: {integrity: sha512-kWyh8ADvHBFz6ua5xYOPnUroZTT/bwWfrCeL0Wj1dzG4/YOmOcfJ99W8dOVyyynJN35rZ9aCOtHChqQovV7yog==}
    engines: {node: '>=6'}

  forwarded@0.2.0:
    resolution: {integrity: sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==}
    engines: {node: '>= 0.6'}

  fresh@2.0.0:
    resolution: {integrity: sha512-Rx/WycZ60HOaqLKAi6cHRKKI7zxWbJ31MhntmtwMoaTeF7XFH9hhBp8vITaMidfljRQ6eYWCKkaTK+ykVJHP2A==}
    engines: {node: '>= 0.8'}

  fsevents@2.3.3:
    resolution: {integrity: sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==}
    engines: {node: ^8.16.0 || ^10.6.0 || >=11.0.0}
    os: [darwin]

  function-bind@1.1.2:
    resolution: {integrity: sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==}

  gensync@1.0.0-beta.2:
    resolution: {integrity: sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==}
    engines: {node: '>=6.9.0'}

  get-caller-file@2.0.5:
    resolution: {integrity: sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==}
    engines: {node: 6.* || 8.* || >= 10.*}

  get-east-asian-width@1.7.0:
    resolution: {integrity: sha512-XjH1AECxf0giL2V1aU8vKyRR2ppRUb5c0EvT7zuJTokQ74bNo52zOtghqdWIqrhUD79fo3x0WfKZdOqxF6LG1Q==}
    engines: {node: '>=18'}

  get-intrinsic@1.3.0:
    resolution: {integrity: sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==}
    engines: {node: '>= 0.4'}

  get-proto@1.0.1:
    resolution: {integrity: sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==}
    engines: {node: '>= 0.4'}

  glob-to-regex.js@1.3.1:
    resolution: {integrity: sha512-zhWhMRsgnOym+1txhUmYJGD6eUsbUdrZv55gCYKuJX8t2p3+M8My23PD09bEIsreGUs5pnSa/idmcfp2/IlqGg==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  gopd@1.2.0:
    resolution: {integrity: sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==}
    engines: {node: '>= 0.4'}

  graceful-fs@4.2.11:
    resolution: {integrity: sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==}

  has-flag@4.0.0:
    resolution: {integrity: sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==}
    engines: {node: '>=8'}

  has-symbols@1.1.0:
    resolution: {integrity: sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==}
    engines: {node: '>= 0.4'}

  hasown@2.0.4:
    resolution: {integrity: sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==}
    engines: {node: '>= 0.4'}

  hast-util-is-element@3.0.0:
    resolution: {integrity: sha512-Val9mnv2IWpLbNPqc/pUem+a7Ipj2aHacCwgNfTiK0vJKl0LF+4Ba4+v1oPHFpf3bLYmreq0/l3Gud9S5OH42g==}

  hast-util-sanitize@5.0.2:
    resolution: {integrity: sha512-3yTWghByc50aGS7JlGhk61SPenfE/p1oaFeNwkOOyrscaOkMGrcW9+Cy/QAIOBpZxP1yqDIzFMR0+Np0i0+usg==}

  hast-util-to-jsx-runtime@2.3.6:
    resolution: {integrity: sha512-zl6s8LwNyo1P9uw+XJGvZtdFF1GdAkOg8ujOw+4Pyb76874fLps4ueHXDhXWdk6YHQ6OgUtinliG7RsYvCbbBg==}

  hast-util-to-text@4.0.2:
    resolution: {integrity: sha512-KK6y/BN8lbaq654j7JgBydev7wuNMcID54lkRav1P0CaE1e47P72AWWPiGKXTJU271ooYzcvTAn/Zt0REnvc7A==}

  hast-util-whitespace@3.0.0:
    resolution: {integrity: sha512-88JUN06ipLwsnv+dVn+OIYOvAuvBMy/Qoi6O7mQHxdPXpjy+Cd6xRkWwux7DKO+4sYILtLBRIKgsdpS2gQc7qw==}

  he@1.2.0:
    resolution: {integrity: sha512-F/1DnUGPopORZi0ni+CvrCgHQ5FyEAHRLSApuYWMmrbSwoN2Mn/7k+Gl38gJnR7yyDZk6WLXwiGod1JOWNDKGw==}
    hasBin: true

  highlight.js@11.11.2:
    resolution: {integrity: sha512-oaXMACAU0kzOMXBjWpNcX+vlwSBCIAiZ9BHa7gA15NOTtT2L/l8OSZDuqS2XppOhZBPJ7hm4o8ep2kyuip2uEQ==}
    engines: {node: '>=12.0.0'}

  html-minifier-terser@6.1.0:
    resolution: {integrity: sha512-YXxSlJBZTP7RS3tWnQw74ooKa6L9b9i9QYXY21eUEvhZ3u9XLfv6OnFsQq6RxkhHygsaUMvYsZRV5rU/OVNZxw==}
    engines: {node: '>=12'}
    hasBin: true

  html-url-attributes@3.0.1:
    resolution: {integrity: sha512-ol6UPyBWqsrO6EJySPz2O7ZSr856WDrEzM5zMqp+FJJLGMW35cLYmmZnl0vztAZxRUoNZJFTCohfjuIJ8I4QBQ==}

  html-webpack-plugin@5.6.8:
    resolution: {integrity: sha512-MZmKQcTnhEh1SPSyMiEytIeDZDUoBZVorNHivQGXMASHf/BSGGOrKa2xQ5bGx3TCe1n109ecCt+cpww7wwWhKA==}
    engines: {node: '>=10.13.0'}
    peerDependencies:
      '@rspack/core': 0.x || 1.x || 2.x
      webpack: ^5.20.0
    peerDependenciesMeta:
      '@rspack/core':
        optional: true
      webpack:
        optional: true

  htmlparser2@6.1.0:
    resolution: {integrity: sha512-gyyPk6rgonLFEDGoeRgQNaEUvdJ4ktTmmUh/h2t7s+M8oPpIPxgNACWa+6ESR57kXstwqPiCut0V8NRpcwgU7A==}

  http-errors@1.8.1:
    resolution: {integrity: sha512-Kpk9Sm7NmI+RHhnj6OIWDI1d6fIoFAtFt9RLaTMRlg/8w49juAStsrBgp0Dp4OdxdVbRIeKhtCUvoi/RuAhO4g==}
    engines: {node: '>= 0.6'}

  http-errors@2.0.1:
    resolution: {integrity: sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==}
    engines: {node: '>= 0.8'}

  http-proxy-middleware@4.2.0:
    resolution: {integrity: sha512-ZA+oNOoM+GLoFTIzhkJptVQov73Srep2LBqhF8hG8CIPKO3nam1jonXVQ/QUH8RbwsmaaVz2SOJdzBNBHNtKbw==}
    engines: {node: ^22.15.0 || ^24.0.0 || >=26.0.0}

  httpxy@0.5.5:
    resolution: {integrity: sha512-uDjmnPyp1q4Sgzf3w+J/Fc6UqcCEj0x4Wjp7OqK5dGhNeDgpyrAmnS6ey8QWrX3SWDon2DMKf9sBa5X9+CVyMA==}

  hyperdyperid@1.2.0:
    resolution: {integrity: sha512-Y93lCzHYgGWdrJ66yIktxiaGULYc6oGiABxhcO5AufBeOyoIdZF7bIfLaOrbM0iGIOXQQgxxRrFEnb+Y6w1n4A==}
    engines: {node: '>=10.18'}

  iconv-lite@0.7.3:
    resolution: {integrity: sha512-IKXpvIzjnC9XTAUbVBcMfGS0EPaIXtW6v+zr+RRp+hqULEpo0owZax6wyRwPOJbWbzjYspQwusTsfVr0ifh4uQ==}
    engines: {node: '>=0.10.0'}

  icss-utils@5.1.0:
    resolution: {integrity: sha512-soFhflCVWLfRNOPU3iv5Z9VUdT44xFRbzjLsEzSr5AQmgqPMTHdU3PMT1Cf1ssx8fLNJDA1juftYl+PUcv3MqA==}
    engines: {node: ^10 || ^12 || >= 14}
    peerDependencies:
      postcss: ^8.1.0

  immediate@3.0.6:
    resolution: {integrity: sha512-XXOFtyqDjNDAQxVfYxuF7g9Il/IbWmmlQg2MYKOH8ExIT1qg6xc4zyS3HaEEATgs1btfzxq15ciUiY7gjSXRGQ==}

  import-local@3.2.0:
    resolution: {integrity: sha512-2SPlun1JUPWoM6t3F0dw0FkCF/jWY8kttcY4f599GLTSjh2OCuuhdTkJQsEcZzBqbXZGKMK2OqW1oZsjtf/gQA==}
    engines: {node: '>=8'}
    hasBin: true

  import-meta-resolve@4.2.0:
    resolution: {integrity: sha512-Iqv2fzaTQN28s/FwZAoFq0ZSs/7hMAHJVX+w8PZl3cY19Pxk6jFFalxQoIfW2826i/fDLXv8IiEZRIT0lDuWcg==}

  inherits@2.0.4:
    resolution: {integrity: sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==}

  inline-style-parser@0.2.7:
    resolution: {integrity: sha512-Nb2ctOyNR8DqQoR0OwRG95uNWIC0C1lCgf5Naz5H6Ji72KZ8OcFZLz2P5sNgwlyoJ8Yif11oMuYs5pBQa86csA==}

  interpret@3.1.1:
    resolution: {integrity: sha512-6xwYfHbajpoF0xLW+iwLkhwgvLoZDfjYfoFNu8ftMoXINzwuymNLd9u/KmwtdT2GbR+/Cz66otEGEVVUHX9QLQ==}
    engines: {node: '>=10.13.0'}

  ipaddr.js@1.9.1:
    resolution: {integrity: sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==}
    engines: {node: '>= 0.10'}

  ipaddr.js@2.5.0:
    resolution: {integrity: sha512-aq+t5NAc+cS6rZQQVWC2x98CPqGtKKTMDd4Gaodv0wShnItdKg/51djkGJ1hqH+Oy0ivDftCbSLCQob8zso01w==}
    engines: {node: '>= 10'}

  is-alphabetical@2.0.1:
    resolution: {integrity: sha512-FWyyY60MeTNyeSRpkM2Iry0G9hpr7/9kD40mD/cGQEuilcZYS4okz8SN2Q6rLCJ8gbCt6fN+rC+6tMGS99LaxQ==}

  is-alphanumerical@2.0.1:
    resolution: {integrity: sha512-hmbYhX/9MUMF5uh7tOXyK/n0ZvWpad5caBA17GsC6vyuCqaWliRG5K1qS9inmUhEMaOBIW7/whAnSwveW/LtZw==}

  is-core-module@2.17.0:
    resolution: {integrity: sha512-J/vG0zBCbIKOQFfufSwyXdMrsohyJIUNkrnmo6WZGzoM7tr/lsbfW5b2BvisL6zsyMzK9UxV9L6c7AoFbyXHOA==}
    engines: {node: '>= 0.4'}

  is-decimal@2.0.1:
    resolution: {integrity: sha512-AAB9hiomQs5DXWcRB1rqsxGUstbRroFOPPVAomNk/3XHR5JyEZChOyTWe2oayKnsSsr/kcGqF+z6yuH6HHpN0A==}

  is-docker@3.0.0:
    resolution: {integrity: sha512-eljcgEDlEns/7AXFosB5K/2nCM4P7FQPkGc/DWLy5rmFEWvZayGrik1d9/QIY5nJ4f9YsVvBkA6kJpHn9rISdQ==}
    engines: {node: ^12.20.0 || ^14.13.1 || >=16.0.0}
    hasBin: true

  is-extglob@2.1.1:
    resolution: {integrity: sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==}
    engines: {node: '>=0.10.0'}

  is-glob@4.0.3:
    resolution: {integrity: sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==}
    engines: {node: '>=0.10.0'}

  is-hexadecimal@2.0.1:
    resolution: {integrity: sha512-DgZQp241c8oO6cA1SbTEWiXeoxV42vlcJxgH+B3hi1AiqqKruZR3ZGF8In3fj4+/y/7rHvlOZLZtgJ/4ttYGZg==}

  is-in-ssh@1.0.0:
    resolution: {integrity: sha512-jYa6Q9rH90kR1vKB6NM7qqd1mge3Fx4Dhw5TVlK1MUBqhEOuCagrEHMevNuCcbECmXZ0ThXkRm+Ymr51HwEPAw==}
    engines: {node: '>=20'}

  is-inside-container@1.0.0:
    resolution: {integrity: sha512-KIYLCCJghfHZxqjYBE7rEy0OBuTd5xCHS7tHVgvCLkx7StIoaxwNW3hCALgEUjFfeRk+MG/Qxmp/vtETEF3tRA==}
    engines: {node: '>=14.16'}
    hasBin: true

  is-network-error@1.3.2:
    resolution: {integrity: sha512-PhBY86zaxNZUuWP6h13Vu5oFe0XY6/UlKzQnYFELzGVHygP3MxmvTfYSG7GN3aIab/iWudSMgjSnG9Dq+nHrgA==}
    engines: {node: '>=16'}

  is-number@7.0.0:
    resolution: {integrity: sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==}
    engines: {node: '>=0.12.0'}

  is-plain-obj@4.1.0:
    resolution: {integrity: sha512-+Pgi+vMuUNkJyExiMBt5IlFoMyKnr5zhJ4Uspz58WOhBF5QoIZkFyNHIbBAtHwzVAgk5RtndVNsDRN61/mmDqg==}
    engines: {node: '>=12'}

  is-plain-object@2.0.4:
    resolution: {integrity: sha512-h5PpgXkWitc38BBMYawTYMWJHFZJVnBquFE57xFpjB8pJFiF6gZ+bU+WyI/yqXiFR5mdLsgYNaPe8uao6Uv9Og==}
    engines: {node: '>=0.10.0'}

  is-promise@4.0.0:
    resolution: {integrity: sha512-hvpoI6korhJMnej285dSg6nu1+e6uxs7zG3BYAm5byqDsgJNWwxzM6z6iZiAgQR4TJ30JmBTOwqZUw3WlyH3AQ==}

  is-wsl@3.1.1:
    resolution: {integrity: sha512-e6rvdUCiQCAuumZslxRJWR/Doq4VpPR82kqclvcS0efgt430SlGIk05vdCN58+VrzgtIcfNODjozVielycD4Sw==}
    engines: {node: '>=16'}

  isarray@1.0.0:
    resolution: {integrity: sha512-VLghIWNM6ELQzo7zwmcg0NmTVyWKYjvIeM83yjp0wRDTmUnrM678fQbcKBo6n2CJEF0szoG//ytg+TKla89ALQ==}

  isexe@2.0.0:
    resolution: {integrity: sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==}

  isobject@3.0.1:
    resolution: {integrity: sha512-WhB9zCku7EGTj/HQQRz5aUQEUeoQZH2bWcltRErOpymJ4boYE6wL9Tbr23krRPSZ+C5zqNSrSw+Cc7sZZ4b7vg==}
    engines: {node: '>=0.10.0'}

  jest-worker@27.5.1:
    resolution: {integrity: sha512-7vuh85V5cdDofPyxn58nrPjBktZo0u9x1g8WtjQol+jZDaE+fhN+cIvTj11GndBnMnyfrUOG1sZQxCdjKh+DKg==}
    engines: {node: '>= 10.13.0'}

  js-tokens@10.0.0:
    resolution: {integrity: sha512-lM/UBzQmfJRo9ABXbPWemivdCW8V2G8FHaHdypQaIy523snUjog0W71ayWXTjiR+ixeMyVHN2XcpnTd/liPg/Q==}

  jsesc@3.1.0:
    resolution: {integrity: sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==}
    engines: {node: '>=6'}
    hasBin: true

  json-schema-traverse@1.0.0:
    resolution: {integrity: sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==}

  json5@2.2.3:
    resolution: {integrity: sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==}
    engines: {node: '>=6'}
    hasBin: true

  jszip@3.10.2:
    resolution: {integrity: sha512-3l+rb15IOWtUhU0H5MFqES/T6Kh7abYwjosBey/vD6hDt8zoEffkSC5Ws5SGtgVw3gBx2NEbhTeSW1+kWkpyTQ==}

  kind-of@6.0.3:
    resolution: {integrity: sha512-dcS1ul+9tmeD95T+x28/ehLgd9mENa3LsvDTtzm3vyBEO7RPptvAD+t44WVXaUjTBRcrpFeFlC8WCruUR456hw==}
    engines: {node: '>=0.10.0'}

  launch-editor@2.14.1:
    resolution: {integrity: sha512-QWBrQsMpH7gPr965dsKD/3cKWiNoTjpATQf++Xq63N6sKRGMwlVXz41O1IZTMfZQgBctD/K5Zt06+/I6pP6+HA==}

  lie@3.1.1:
    resolution: {integrity: sha512-RiNhHysUjhrDQntfYSfY4MU24coXXdEOgw9WGcKHNeEwffDYbF//u87M1EWaMGzuFoSbqW0C9C6lEEhDOAswfw==}

  lie@3.3.0:
    resolution: {integrity: sha512-UaiMJzeWRlEujzAuw5LokY1L5ecNQYZKfmyZ9L7wDHb/p5etKaxXhohBcrw0EYby+G/NA52vRSN4N39dxHAIwQ==}

  localforage@1.10.0:
    resolution: {integrity: sha512-14/H1aX7hzBBmmh7sGPd+AOMkkIrHM3Z1PAyGgZigA1H1p5O5ANnMyWzvpAETtG68/dC4pC0ncy3+PPGzXZHPg==}

  locate-path@5.0.0:
    resolution: {integrity: sha512-t7hw9pI+WvuwNJXwk5zVHpyhIqzg2qTlklJOf0mVxGSbe3Fp2VieZcduNYjaLDoy6p9uGpQEGWG87WpMKlNq8g==}
    engines: {node: '>=8'}

  locate-path@6.0.0:
    resolution: {integrity: sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==}
    engines: {node: '>=10'}

  lodash.debounce@4.0.8:
    resolution: {integrity: sha512-FT1yDzDYEoYWhnSGnpE/4Kj1fLZkDFyqRb7fNt6FdYOSxlUWAtp42Eh6Wb0rGIv/m9Bgo7x4GhQbm5Ys4SG5ow==}

  lodash@4.18.1:
    resolution: {integrity: sha512-dMInicTPVE8d1e5otfwmmjlxkZoUpiVLwyeTdUsi/Caj/gfzzblBcCE5sRHV/AsjuCmxWrte2TNGSYuCeCq+0Q==}

  longest-streak@3.1.0:
    resolution: {integrity: sha512-9Ri+o0JYgehTaVBBDoMqIl8GXtbWg711O3srftcHhZ0dqnETqLaoIK0x17fUw9rFSlK/0NlsKe0Ahhyl5pXE2g==}

  lop@0.4.2:
    resolution: {integrity: sha512-RefILVDQ4DKoRZsJ4Pj22TxE3omDO47yFpkIBoDKzkqPRISs5U1cnAdg/5583YPkWPaLIYHOKRMQSvjFsO26cw==}

  lower-case@2.0.2:
    resolution: {integrity: sha512-7fm3l3NAF9WfN6W3JOmf5drwpVqX78JtoGJ3A6W0a6ZnldM41w2fV5D490psKFTpMds8TJse/eHLFFsNHHjHgg==}

  lowlight@3.3.0:
    resolution: {integrity: sha512-0JNhgFoPvP6U6lE/UdVsSq99tn6DhjjpAj5MxG49ewd2mOBVtwWYIT8ClyABhq198aXXODMU6Ox8DrGy/CpTZQ==}

  lucide-react@1.48.0:
    resolution: {integrity: sha512-R0CIKY/fXiC6y9xRBADgsK+VW2p/pcTJOMhLZf1T+uG+vJUvyUR02nGOgmIIC7MPkiNK4Ox8QDnbqF8rJYWPZQ==}
    peerDependencies:
      react: ^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0

  mammoth@1.13.0:
    resolution: {integrity: sha512-2cawcYFcP7ISfXbBcL9lmVgTNWo88v/52ND1gnywHtVT/pX0//puPnf0iMPV9ZgmuvNOE+zkIhDgZ9M2c2dDDg==}
    engines: {node: '>=12.0.0'}
    hasBin: true

  markdown-table@3.0.4:
    resolution: {integrity: sha512-wiYz4+JrLyb/DqW2hkFJxP7Vd7JuTDm77fvbM8VfEQdmSMqcImWeeRbHwZjBjIFki/VaMK2BhFi7oUUZeM5bqw==}

  marked@18.0.14:
    resolution: {integrity: sha512-mBHK6FBHuBAlhgRe88w9F0O1AbwwXJUcQibUbC/QcdTbVGAD7aWza+xt3N6oT/jCZx3/OMeS+8rnuiHZcQ9s7A==}
    engines: {node: '>= 20'}
    hasBin: true

  marks-pane@1.0.9:
    resolution: {integrity: sha512-Ahs4oeG90tbdPWwAJkAAoHg2lRR8lAs9mZXETNPO9hYg3AkjUJBKi1NQ4aaIQZVGrig7c/3NUV1jANl8rFTeMg==}

  math-intrinsics@1.1.0:
    resolution: {integrity: sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==}
    engines: {node: '>= 0.4'}

  mdast-util-find-and-replace@3.0.2:
    resolution: {integrity: sha512-Tmd1Vg/m3Xz43afeNxDIhWRtFZgM2VLyaf4vSTYwudTyeuTneoL3qtWMA5jeLyz/O1vDJmmV4QuScFCA2tBPwg==}

  mdast-util-from-markdown@2.0.3:
    resolution: {integrity: sha512-W4mAWTvSlKvf8L6J+VN9yLSqQ9AOAAvHuoDAmPkz4dHf553m5gVj2ejadHJhoJmcmxEnOv6Pa8XJhpxE93kb8Q==}

  mdast-util-gfm-autolink-literal@2.0.1:
    resolution: {integrity: sha512-5HVP2MKaP6L+G6YaxPNjuL0BPrq9orG3TsrZ9YXbA3vDw/ACI4MEsnoDpn6ZNm7GnZgtAcONJyPhOP8tNJQavQ==}

  mdast-util-gfm-footnote@2.1.0:
    resolution: {integrity: sha512-sqpDWlsHn7Ac9GNZQMeUzPQSMzR6Wv0WKRNvQRg0KqHh02fpTz69Qc1QSseNX29bhz1ROIyNyxExfawVKTm1GQ==}

  mdast-util-gfm-strikethrough@2.0.1:
    resolution: {integrity: sha512-OuJHqvr455pwu2OaOrir7dbzqs4jlWKOtlu9L6GjcIjjQwNyw02VntQsr/Ek6/A13vgnXfUhBekWRUP1OkNivw==}

  mdast-util-gfm-table@2.0.0:
    resolution: {integrity: sha512-78UEvebzz/rJIxLvE7ZtDd/vIQ0RHv+3Mh5DR96p7cS7HsBhYIICDBCu8csTNWNO6tBWfqXPWekRuj2FNOGOZg==}

  mdast-util-gfm-task-list-item@2.0.0:
    resolution: {integrity: sha512-IrtvNvjxC1o06taBAVJznEnkiHxLFTzgonUdy8hzFVeDun0uTjxxrRGVaNFqkU1wJR3RBPEfsxmU6jDWPofrTQ==}

  mdast-util-gfm@3.1.0:
    resolution: {integrity: sha512-0ulfdQOM3ysHhCJ1p06l0b0VKlhU0wuQs3thxZQagjcjPrlFRqY215uZGHHJan9GEAXd9MbfPjFJz+qMkVR6zQ==}

  mdast-util-mdx-expression@2.0.1:
    resolution: {integrity: sha512-J6f+9hUp+ldTZqKRSg7Vw5V6MqjATc+3E4gf3CFNcuZNWD8XdyI6zQ8GqH7f8169MM6P7hMBRDVGnn7oHB9kXQ==}

  mdast-util-mdx-jsx@3.2.0:
    resolution: {integrity: sha512-lj/z8v0r6ZtsN/cGNNtemmmfoLAFZnjMbNyLzBafjzikOM+glrjNHPlf6lQDOTccj9n5b0PPihEBbhneMyGs1Q==}

  mdast-util-mdxjs-esm@2.0.1:
    resolution: {integrity: sha512-EcmOpxsZ96CvlP03NghtH1EsLtr0n9Tm4lPUJUBccV9RwUOneqSycg19n5HGzCf+10LozMRSObtVr3ee1WoHtg==}

  mdast-util-phrasing@4.1.0:
    resolution: {integrity: sha512-TqICwyvJJpBwvGAMZjj4J2n0X8QWp21b9l0o7eXyVJ25YNWYbJDVIyD1bZXE6WtV6RmKJVYmQAKWa0zWOABz2w==}

  mdast-util-to-hast@13.2.1:
    resolution: {integrity: sha512-cctsq2wp5vTsLIcaymblUriiTcZd0CwWtCbLvrOzYCDZoWyMNV8sZ7krj09FSnsiJi3WVsHLM4k6Dq/yaPyCXA==}

  mdast-util-to-markdown@2.1.3:
    resolution: {integrity: sha512-wgyJtgUkUcdU7zci7uuwc/tzoAhm0TswWhaXuvnWolqug+8jY7bgNkBBL0dYBnHgc/tHL7lCzRdPsdUxUKKBqw==}

  mdast-util-to-string@4.0.0:
    resolution: {integrity: sha512-0H44vDimn51F0YwvxSJSm0eCDOJTRlmN0R1yBh4HLj9wiV1Dn0QoXGbvFAWj2hSItVTlCmBF1hqKlIyUBVFLPg==}

  media-typer@0.3.0:
    resolution: {integrity: sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==}
    engines: {node: '>= 0.6'}

  media-typer@1.1.1:
    resolution: {integrity: sha512-yz3xRaG20c6/BOzvYoDaGtPmGscs7YivItZEEqe6GbwNfHuxu9YNmvnEkMzKldAGY4/80pRcQRZSEnhquk9XuQ==}
    engines: {node: '>= 0.8'}

  memfs@4.80.0:
    resolution: {integrity: sha512-N70W2isi44XdGn7uPo9NJ4zRukcdkwSFHlnYx42SWOH/+hzqNc8P7+tVoA2up4z7faHvNi1RSNCFjxoYQ71VPQ==}

  merge-descriptors@2.0.0:
    resolution: {integrity: sha512-Snk314V5ayFLhp3fkUREub6WtjBfPdCPY1Ln8/8munuLuiYhsABgBVWsozAG+MWMbVEvcdcpbi9R7ww22l9Q3g==}
    engines: {node: '>=18'}

  merge-stream@2.0.0:
    resolution: {integrity: sha512-abv/qOcuPfk3URPfDzmZU1LKmuw8kT+0nIHvKrKgFrwifol/doWcdA4ZqsWQ8ENrFKkd67Mfpo/LovbIUsbt3w==}

  micromark-core-commonmark@2.0.4:
    resolution: {integrity: sha512-wxEeE8v8XVvOrxn1TZj74qYhAtTQsSqufHVS3uNVyT1MupXxhyaHk8/9xDNPh9BmL77QNDgWTkZ3RsYHB2ry7w==}

  micromark-extension-gfm-autolink-literal@2.1.0:
    resolution: {integrity: sha512-oOg7knzhicgQ3t4QCjCWgTmfNhvQbDDnJeVu9v81r7NltNCVmhPy1fJRX27pISafdjL+SVc4d3l48Gb6pbRypw==}

  micromark-extension-gfm-footnote@2.1.0:
    resolution: {integrity: sha512-/yPhxI1ntnDNsiHtzLKYnE3vf9JZ6cAisqVDauhp4CEHxlb4uoOTxOCJ+9s51bIB8U1N1FJ1RXOKTIlD5B/gqw==}

  micromark-extension-gfm-strikethrough@2.1.0:
    resolution: {integrity: sha512-ADVjpOOkjz1hhkZLlBiYA9cR2Anf8F4HqZUO6e5eDcPQd0Txw5fxLzzxnEkSkfnD0wziSGiv7sYhk/ktvbf1uw==}

  micromark-extension-gfm-table@2.1.2:
    resolution: {integrity: sha512-pRzm4kDTu0MjlmBkxmS9yYhw60nncfcEwu9NNdPFSQEFXS95ZKyIIyTSHu/o3ReBUrLKYEq+7YaXCRn/bPB4MA==}

  micromark-extension-gfm-tagfilter@2.0.0:
    resolution: {integrity: sha512-xHlTOmuCSotIA8TW1mDIM6X2O1SiX5P9IuDtqGonFhEK0qgRI4yeC6vMxEV2dgyr2TiD+2PQ10o+cOhdVAcwfg==}

  micromark-extension-gfm-task-list-item@2.1.0:
    resolution: {integrity: sha512-qIBZhqxqI6fjLDYFTBIa4eivDMnP+OZqsNwmQ3xNLE4Cxwc+zfQEfbs6tzAo2Hjq+bh6q5F+Z8/cksrLFYWQQw==}

  micromark-extension-gfm@3.0.0:
    resolution: {integrity: sha512-vsKArQsicm7t0z2GugkCKtZehqUm31oeGBV/KVSorWSy8ZlNAv7ytjFhvaryUiCUJYqs+NoE6AFhpQvBTM6Q4w==}

  micromark-factory-destination@2.0.1:
    resolution: {integrity: sha512-Xe6rDdJlkmbFRExpTOmRj9N3MaWmbAgdpSrBQvCFqhezUn4AHqJHbaEnfbVYYiexVSs//tqOdY/DxhjdCiJnIA==}

  micromark-factory-label@2.0.1:
    resolution: {integrity: sha512-VFMekyQExqIW7xIChcXn4ok29YE3rnuyveW3wZQWWqF4Nv9Wk5rgJ99KzPvHjkmPXF93FXIbBp6YdW3t71/7Vg==}

  micromark-factory-space@2.1.0:
    resolution: {integrity: sha512-fS8hnLIjnjvdQIj39Geug8wWsR0HrYZ43KShKxNfwT7t2LOHo/LbWZEzEaSOjwtjdCsjoE6syHhonEzW0zv0+Q==}

  micromark-factory-title@2.0.1:
    resolution: {integrity: sha512-5bZ+3CjhAd9eChYTHsjy6TGxpOFSKgKKJPJxr293jTbfry2KDoWkhBb6TcPVB4NmzaPhMs1Frm9AZH7OD4Cjzw==}

  micromark-factory-whitespace@2.0.1:
    resolution: {integrity: sha512-Ob0nuZ3PKt/n0hORHyvoD9uZhr+Za8sFoP+OnMcnWK5lngSzALgQYKMr9RJVOWLqQYuyn6ulqGWSXdwf6F80lQ==}

  micromark-util-character@2.1.1:
    resolution: {integrity: sha512-wv8tdUTJ3thSFFFJKtpYKOYiGP2+v96Hvk4Tu8KpCAsTMs6yi+nVmGh1syvSCsaxz45J6Jbw+9DD6g97+NV67Q==}

  micromark-util-chunked@2.0.1:
    resolution: {integrity: sha512-QUNFEOPELfmvv+4xiNg2sRYeS/P84pTW0TCgP5zc9FpXetHY0ab7SxKyAQCNCc1eK0459uoLI1y5oO5Vc1dbhA==}

  micromark-util-classify-character@2.0.1:
    resolution: {integrity: sha512-K0kHzM6afW/MbeWYWLjoHQv1sgg2Q9EccHEDzSkxiP/EaagNzCm7T/WMKZ3rjMbvIpvBiZgwR3dKMygtA4mG1Q==}

  micromark-util-combine-extensions@2.0.1:
    resolution: {integrity: sha512-OnAnH8Ujmy59JcyZw8JSbK9cGpdVY44NKgSM7E9Eh7DiLS2E9RNQf0dONaGDzEG9yjEl5hcqeIsj4hfRkLH/Bg==}

  micromark-util-decode-numeric-character-reference@2.0.2:
    resolution: {integrity: sha512-ccUbYk6CwVdkmCQMyr64dXz42EfHGkPQlBj5p7YVGzq8I7CtjXZJrubAYezf7Rp+bjPseiROqe7G6foFd+lEuw==}

  micromark-util-decode-string@2.0.1:
    resolution: {integrity: sha512-nDV/77Fj6eH1ynwscYTOsbK7rR//Uj0bZXBwJZRfaLEJ1iGBR6kIfNmlNqaqJf649EP0F3NWNdeJi03elllNUQ==}

  micromark-util-edit-map@1.0.0:
    resolution: {integrity: sha512-Pa2ljlsEL6sVwFaYeyrOLSYbQt73JvGbPOYFq+9AElXiSnfI5Q4465RRZ1sHv7lDjDOnGRDDaqPXqClqWK/q1Q==}

  micromark-util-encode@2.0.1:
    resolution: {integrity: sha512-c3cVx2y4KqUnwopcO9b/SCdo2O67LwJJ/UyqGfbigahfegL9myoEFoDYZgkT7f36T0bLrM9hZTAaAyH+PCAXjw==}

  micromark-util-html-tag-name@2.0.1:
    resolution: {integrity: sha512-2cNEiYDhCWKI+Gs9T0Tiysk136SnR13hhO8yW6BGNyhOC4qYFnwF1nKfD3HFAIXA5c45RrIG1ub11GiXeYd1xA==}

  micromark-util-normalize-identifier@2.0.1:
    resolution: {integrity: sha512-sxPqmo70LyARJs0w2UclACPUUEqltCkJ6PhKdMIDuJ3gSf/Q+/GIe3WKl0Ijb/GyH9lOpUkRAO2wp0GVkLvS9Q==}

  micromark-util-resolve-all@2.0.1:
    resolution: {integrity: sha512-VdQyxFWFT2/FGJgwQnJYbe1jjQoNTS4RjglmSjTUlpUMa95Htx9NHeYW4rGDJzbjvCsl9eLjMQwGeElsqmzcHg==}

  micromark-util-sanitize-uri@2.0.1:
    resolution: {integrity: sha512-9N9IomZ/YuGGZZmQec1MbgxtlgougxTodVwDzzEouPKo3qFWvymFHWcnDi2vzV1ff6kas9ucW+o3yzJK9YB1AQ==}

  micromark-util-subtokenize@2.1.0:
    resolution: {integrity: sha512-XQLu552iSctvnEcgXw6+Sx75GflAPNED1qx7eBJ+wydBb2KCbRZe+NwvIEEMM83uml1+2WSXpBAcp9IUCgCYWA==}

  micromark-util-symbol@2.0.1:
    resolution: {integrity: sha512-vs5t8Apaud9N28kgCrRUdEed4UJ+wWNvicHLPxCa9ENlYuAY31M0ETy5y1vA33YoNPDFTghEbnh6efaE8h4x0Q==}

  micromark-util-types@2.0.3:
    resolution: {integrity: sha512-oxB2Ik03hI0gv+VNn9tnh1t1YEe9MDPptViAEgfdf3YQHsn0pzGTgCdlSCJXcwhqm8phaEuM7zeEu3QQzVBrPg==}

  micromark@4.0.3:
    resolution: {integrity: sha512-oGYfQzHSG5dOMovQcJ3fyTmZlWAWpi0XA0sJwJs+i6OT88o1+Jtw/8z0CmdowSLxGhhFK89rQ/oXph/wN02PNw==}

  micromatch@4.0.8:
    resolution: {integrity: sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==}
    engines: {node: '>=8.6'}

  mime-db@1.52.0:
    resolution: {integrity: sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==}
    engines: {node: '>= 0.6'}

  mime-db@1.54.0:
    resolution: {integrity: sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==}
    engines: {node: '>= 0.6'}

  mime-types@2.1.35:
    resolution: {integrity: sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==}
    engines: {node: '>= 0.6'}

  mime-types@3.0.2:
    resolution: {integrity: sha512-Lbgzdk0h4juoQ9fCKXW4by0UJqj+nOOrI9MJ1sSj4nI8aI2eo1qmvQEie4VD1glsS250n15LsWsYtCugiStS5A==}
    engines: {node: '>=18'}

  minimizer-webpack-plugin@5.12.0:
    resolution: {integrity: sha512-PCN1x1OzFeFB2GlP91s46q7Gz8Jf16Z7M45bzpoqrYZlh12QeY6tYVM5h299wbwy1DxnQ69VFmmh8Hb2Ff8mbw==}
    engines: {node: '>= 10.13.0'}
    peerDependencies:
      '@minify-html/node': '*'
      '@napi-rs/image': '*'
      '@swc/core': '*'
      '@swc/css': '*'
      '@swc/html': '*'
      clean-css: '*'
      cssnano: '*'
      csso: '*'
      esbuild: '*'
      html-minifier-terser: '*'
      imagemin: '*'
      lightningcss: '*'
      postcss: '*'
      sharp: '*'
      svgo: '*'
      uglify-js: '*'
      webpack: ^5.1.0
    peerDependenciesMeta:
      '@minify-html/node':
        optional: true
      '@napi-rs/image':
        optional: true
      '@swc/core':
        optional: true
      '@swc/css':
        optional: true
      '@swc/html':
        optional: true
      clean-css:
        optional: true
      cssnano:
        optional: true
      csso:
        optional: true
      esbuild:
        optional: true
      html-minifier-terser:
        optional: true
      imagemin:
        optional: true
      lightningcss:
        optional: true
      postcss:
        optional: true
      sharp:
        optional: true
      svgo:
        optional: true
      uglify-js:
        optional: true

  ms@2.0.0:
    resolution: {integrity: sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==}

  ms@2.1.3:
    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}

  multer@2.4.0:
    resolution: {integrity: sha512-7dqa0ZcFfzbefdTuIkzOSMvZWC0J7FLqBOjJUZvDCXShIURWKxAyTT1wHhnE5q19c7jOJf43IYYKjBmZVZmvhg==}
    engines: {node: '>= 10.16.0'}

  multicast-dns@7.2.5:
    resolution: {integrity: sha512-2eznPJP8z2BFLX50tf0LuODrpINqP1RVIm/CObbTcBRITQgmC/TjcREF1NeTBzIcR5XO/ukWo+YHOjBbFwIupg==}
    hasBin: true

  nanoid@3.3.19:
    resolution: {integrity: sha512-Y2tUNy4ouw6tq5oDSKeQYGOyhkUBhNOcGV/02KC+6kd9eDGqdZd++mjMiIDilrBYvjEnCYvVtsuHCuP+okSfug==}
    engines: {node: ^10 || ^12 || ^13.7 || ^14 || >=15.0.1}
    hasBin: true

  negotiator@0.6.3:
    resolution: {integrity: sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==}
    engines: {node: '>= 0.6'}

  negotiator@0.6.4:
    resolution: {integrity: sha512-myRT3DiWPHqho5PrJaIRyaMv2kgYf0mUVgBNOYMuCH5Ki1yEiQaf/ZJuQ62nvpc44wL5WDbTX7yGJi1Neevw8w==}
    engines: {node: '>= 0.6'}

  negotiator@1.1.0:
    resolution: {integrity: sha512-NMPBRMJgiQHjbd8phG3Vebdx4kZ1H121rbl5IkMqeOsahptB9BKo/d7oJ3zTXqTgagn2bWlNSXkh0QUGM31RYg==}
    engines: {node: '>=18'}

  next-tick@1.1.0:
    resolution: {integrity: sha512-CXdUiJembsNjuToQvxayPZF9Vqht7hewsvy2sOWafLvi2awflj9mOC6bHIg50orX8IJvWKY9wYQ/zB2kogPslQ==}

  no-case@3.0.4:
    resolution: {integrity: sha512-fgAN3jGAh+RoxUGZHTSOLJIqUc2wmoBwGR4tbpNAKmmovFoWq0OdRkb0VkldReO2a2iBT/OEulG9XSUc10r3zg==}

  node-releases@2.0.57:
    resolution: {integrity: sha512-kQK9LGGFiHtrWiNhZtA7Qbw17AQz+dmsEKODRIVTXA9+e5MS/2gZEBhYJt13GrAz5/IOZKddH/0Z3TP/Zgo+yw==}
    engines: {node: '>=18'}

  nth-check@2.1.1:
    resolution: {integrity: sha512-lqjrjmaOoAnWfMmBPL+XNnynZh2+swxiX3WUE0s4yEHI6m+AwrK2UZOimIRl3X/4QctVqS8AiZjFqyOGrMXb/w==}

  object-inspect@1.13.4:
    resolution: {integrity: sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==}
    engines: {node: '>= 0.4'}

  obug@2.2.1:
    resolution: {integrity: sha512-XrsrhT5sybtKI6wakr2SPOlGZWWYbUXZ7a0jT8/QOeAPau+1X/bSegNe5YR75oJmEZQbKningirmGOEJCIk61Q==}
    engines: {node: '>=12.20.0'}

  on-finished@2.4.1:
    resolution: {integrity: sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==}
    engines: {node: '>= 0.8'}

  on-headers@1.1.0:
    resolution: {integrity: sha512-737ZY3yNnXy37FHkQxPzt4UZ2UWPWiCZWLvFZ4fu5cueciegX0zGPnrlY6bwRg4FdQOe9YU8MkmJwGhoMybl8A==}
    engines: {node: '>= 0.8'}

  once@1.4.0:
    resolution: {integrity: sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==}

  open@11.0.4:
    resolution: {integrity: sha512-++Zlftm0kVLPmzC06t6epuWmcRMDbI4z5P3NNX979WA/k23+NtSOynEGzsVfZwguKw2mi5umVgnBlJQMwRz4Pg==}
    engines: {node: '>=20'}

  option@0.2.4:
    resolution: {integrity: sha512-pkEqbDyl8ou5cpq+VsnQbe/WlEy5qS7xPzMS1U55OCG9KPvwFD46zDbxQIj3egJSFc3D+XhYOPUzz49zQAVy7A==}

  oxlint@1.86.0:
    resolution: {integrity: sha512-og0lhgvZfgGF//gOOmZXvtr+GmBbAGEnbEhv/QUg7UW2Wi4wHMnJbnMD+zuHgPdJxdklfgpPupdlAaAySyxrZg==}
    engines: {node: ^20.19.0 || >=22.12.0}
    hasBin: true
    peerDependencies:
      oxlint-tsgolint: '>=7.0.2003'
      vite-plus: '*'
    peerDependenciesMeta:
      oxlint-tsgolint:
        optional: true
      vite-plus:
        optional: true

  p-limit@2.3.0:
    resolution: {integrity: sha512-//88mFWSJx8lxCzwdAABTJL2MyWB12+eIY7MDL2SqLmAkeKU9qxRvWuSyTjm3FUmpBEMuFfckAIqEaVGUDxb6w==}
    engines: {node: '>=6'}

  p-limit@3.1.0:
    resolution: {integrity: sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==}
    engines: {node: '>=10'}

  p-locate@4.1.0:
    resolution: {integrity: sha512-R79ZZ/0wAxKGu3oYMlz8jy/kbhsNrS7SKZ7PxEHBgJ5+F2mtFW2fK2cOtBh1cHYkQsbzFV7I+EoRKe6Yt0oK7A==}
    engines: {node: '>=8'}

  p-locate@5.0.0:
    resolution: {integrity: sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==}
    engines: {node: '>=10'}

  p-retry@8.0.1:
    resolution: {integrity: sha512-NAigyu8hfvJe7MsS18mnc4is0MZtau3QMdBklaJKK23oBQb6occO3UPM3vHmTckW8KhfyjMZaUOqdTFEYliHgg==}
    engines: {node: '>=22'}

  p-try@2.2.0:
    resolution: {integrity: sha512-R4nPAVTAU0B9D35/Gk3uJf/7XYbQcyohSKdvAxIRSNghFl4e71hVoGnBNQz9cWaXxO2I10KTC+3jMdvvoKw6dQ==}
    engines: {node: '>=6'}

  pako@1.0.11:
    resolution: {integrity: sha512-4hLB8Py4zZce5s4yd9XzopqwVv/yGNhV1Bl8NTmCq1763HeK2+EwVTv+leGeL13Dnh2wfbqowVPXCIO0z4taYw==}

  param-case@3.0.4:
    resolution: {integrity: sha512-RXlj7zCYokReqWpOPH9oYivUzLYZ5vAPIfEmCTNViosC78F8F0H9y7T7gG2M39ymgutxF5gcFEsyZQSph9Bp3A==}

  parse-entities@4.0.2:
    resolution: {integrity: sha512-GG2AQYWoLgL877gQIKeRPGO1xF9+eG1ujIb5soS5gPvLQ1y2o8FL90w2QWNdf9I361Mpp7726c+lj3U0qK1uGw==}

  parseurl@1.3.3:
    resolution: {integrity: sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==}
    engines: {node: '>= 0.8'}

  pascal-case@3.1.2:
    resolution: {integrity: sha512-uWlGT3YSnK9x3BQJaOdcZwrnV6hPpd8jFH1/ucpiLRPh/2zCVJKS19E4GvYHvaCcACn3foXZ0cLB9Wrx1KGe5g==}

  path-exists@4.0.0:
    resolution: {integrity: sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==}
    engines: {node: '>=8'}

  path-key@3.1.1:
    resolution: {integrity: sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==}
    engines: {node: '>=8'}

  path-parse@1.0.7:
    resolution: {integrity: sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==}

  path-to-regexp@8.4.2:
    resolution: {integrity: sha512-qRcuIdP69NPm4qbACK+aDogI5CBDMi1jKe0ry5rSQJz8JVLsC7jV8XpiJjGRLLol3N+R5ihGYcrPLTno6pAdBA==}

  path-webpack@0.0.3:
    resolution: {integrity: sha512-AmeDxedoo5svf7aB3FYqSAKqMxys014lVKBzy1o/5vv9CtU7U4wgGWL1dA2o6MOzcD53ScN4Jmiq6VbtLz1vIQ==}

  pdf-parse@2.4.5:
    resolution: {integrity: sha512-mHU89HGh7v+4u2ubfnevJ03lmPgQ5WU4CxAVmTSh/sxVTEDYd1er/dKS/A6vg77NX47KTEoihq8jZBLr8Cxuwg==}
    engines: {node: '>=20.16.0 <21 || >=22.3.0'}
    hasBin: true

  pdfjs-dist@5.4.296:
    resolution: {integrity: sha512-DlOzet0HO7OEnmUmB6wWGJrrdvbyJKftI1bhMitK7O2N8W2gc757yyYBbINy9IDafXAV9wmKr9t7xsTaNKRG5Q==}
    engines: {node: '>=20.16.0 || >=22.3.0'}

  picocolors@1.1.1:
    resolution: {integrity: sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==}

  picomatch@2.3.2:
    resolution: {integrity: sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==}
    engines: {node: '>=8.6'}

  picomatch@4.0.7:
    resolution: {integrity: sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==}
    engines: {node: '>=12'}

  pkg-dir@4.2.0:
    resolution: {integrity: sha512-HRDzbaKjC+AOWVXxAU/x54COGeIv9eb+6CkDSQoNTt4XyWoIJvuPsXizxu/Fr23EiekbtZwmh1IcIG/l/a10GQ==}
    engines: {node: '>=8'}

  pkijs@3.4.1:
    resolution: {integrity: sha512-Oo/NZcSWccq8KyoG7gLE9fnltgHns+pNCjCAp/WmjsUySi+sX7y4z4Xqu4fVb42CDHzRPl33fjzT15V1wvcyhA==}
    engines: {node: '>=16.0.0'}

  postcss-modules-extract-imports@3.1.0:
    resolution: {integrity: sha512-k3kNe0aNFQDAZGbin48pL2VNidTF0w4/eASDsxlyspobzU3wZQLOGj7L9gfRe0Jo9/4uud09DsjFNH7winGv8Q==}
    engines: {node: ^10 || ^12 || >= 14}
    peerDependencies:
      postcss: ^8.1.0

  postcss-modules-local-by-default@4.2.0:
    resolution: {integrity: sha512-5kcJm/zk+GJDSfw+V/42fJ5fhjL5YbFDl8nVdXkJPLLW+Vf9mTD5Xe0wqIaDnLuL2U6cDNpTr+UQ+v2HWIBhzw==}
    engines: {node: ^10 || ^12 || >= 14}
    peerDependencies:
      postcss: ^8.1.0

  postcss-modules-scope@3.2.1:
    resolution: {integrity: sha512-m9jZstCVaqGjTAuny8MdgE88scJnCiQSlSrOWcTQgM2t32UBe+MUmFSO5t7VMSfAf/FJKImAxBav8ooCHJXCJA==}
    engines: {node: ^10 || ^12 || >= 14}
    peerDependencies:
      postcss: ^8.1.0

  postcss-modules-values@4.0.0:
    resolution: {integrity: sha512-RDxHkAiEGI78gS2ofyvCsu7iycRv7oqw5xMWn9iMoR0N/7mf9D50ecQqUo5BZ9Zh2vH4bCUR/ktCqbB9m8vJjQ==}
    engines: {node: ^10 || ^12 || >= 14}
    peerDependencies:
      postcss: ^8.1.0

  postcss-selector-parser@7.1.6:
    resolution: {integrity: sha512-7qASPzhKF2l2KLboRZux8CCTRMdGiV08vWmyKzPz22qZ7ZjQBOeY7rNzNoCLSUiftJ7HUq0GERHmxw/t0dCdMw==}
    engines: {node: '>=4'}

  postcss-value-parser@4.2.0:
    resolution: {integrity: sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==}

  postcss@8.5.28:
    resolution: {integrity: sha512-RRuzqDtt5Y9h3quz5hWhK+TPnsmVs6WwSU6LkJMeY4HstUEDuYTG8UJSdawMRzmzAtV+KEoG8N3Qg2qLy5vM/A==}
    engines: {node: ^10 || ^12 || >=14}

  powershell-utils@0.1.0:
    resolution: {integrity: sha512-dM0jVuXJPsDN6DvRpea484tCUaMiXWjuCn++HGTqUWzGDjv5tZkEZldAJ/UMlqRYGFrD/etByo4/xOuC/snX2A==}
    engines: {node: '>=20'}

  powershell-utils@0.2.1:
    resolution: {integrity: sha512-C+y9x90UElAddDZmV4qOx9W53B61PO7cIqWz2dQsWlwswuq4mr8NEwytdGKboYbQlGZ3awrkTeNvcZiZNHnQ8A==}
    engines: {node: '>=20'}

  pretty-error@4.0.0:
    resolution: {integrity: sha512-AoJ5YMAcXKYxKhuJGdcvse+Voc6v1RgnsR3nWcYU7q4t6z0Q6T86sv5Zq8VIRbOWWFpvdGE83LtdSMNd+6Y0xw==}

  process-nextick-args@2.0.1:
    resolution: {integrity: sha512-3ouUOpQhtgrbOa17J7+uxOTpITYWaGP7/AhoR3+A+/1e9skrzelGi/dXzEYyvbxubEF6Wn2ypscTKiKJFFn1ag==}

  property-information@7.2.0:
    resolution: {integrity: sha512-IAtzIB6sUiWaJYrX9smp3V46pBGbBeLFRGdh25kg1334VcBlD8HzhPeNIWQH9zhGmo2itIe25EHt9dQP7G5hmg==}

  proxy-addr@2.0.8:
    resolution: {integrity: sha512-5nnx0yGyVUcY6t9RnWcARWtwT9F1D8O9rt08htPvnd49W1IgZtmLkhu9WfMzQj1cFxjHIO6connUNVW5k7AVyQ==}
    engines: {node: '>= 0.10'}

  pvtsutils@1.3.6:
    resolution: {integrity: sha512-PLgQXQ6H2FWCaeRak8vvk1GW462lMxB5s3Jm673N82zI4vqtVUPuZdffdZbPDFRoU8kAhItWFtPCWiPpp4/EDg==}

  pvutils@1.2.0:
    resolution: {integrity: sha512-BbubeCEyTuQjVMakvJQ/Sxbc93F2pwmbsxONT/ZRrwU7Ua38d8unYTwXpTVLAKJ4BDuH9IGztCjQcd/N/39Dvg==}
    engines: {node: '>=16.0.0'}

  qs@6.16.0:
    resolution: {integrity: sha512-h6fhOIaRrID2CbEY2fqs+7t+UXZo+MLAnU5gRIq85uFtdiUPCdsApMlHhXogKVM4HM2DVbIjGNTTYH2OcmP1vA==}
    engines: {node: '>=0.6'}

  range-parser@1.3.0:
    resolution: {integrity: sha512-hek2mFQpPuI4E1BBKrSto+BU3e3x4xuarsbiwr3+lf7p44juvFMV0XFWQAP3xUyqXA4RrXLIoaSUGbSt056ZMw==}
    engines: {node: '>= 0.6'}

  raw-body@3.0.2:
    resolution: {integrity: sha512-K5zQjDllxWkf7Z5xJdV0/B0WTNqx6vxG70zJE4N0kBs4LovmEYWJzQGxC9bS9RAKu3bgM40lrd5zoLJ12MQ5BA==}
    engines: {node: '>= 0.10'}

  react-dom@19.3.0:
    resolution: {integrity: sha512-JDk8dgif51OjFoDE70+OT9ICyYr+69HlmihNwp1+Nsfbna3t5sIiCa9ZJktDmQ4/1b/rn26hIAR2uYXDMr5r0Q==}
    peerDependencies:
      react: ^19.3.0

  react-markdown@10.1.0:
    resolution: {integrity: sha512-qKxVopLT/TyA6BX3Ue5NwabOsAzm0Q7kAPwq6L+wWDwisYs7R8vZ0nRXqq6rkueboxpkjvLGU9fWifiX/ZZFxQ==}
    peerDependencies:
      '@types/react': '>=18'
      react: '>=18'

  react@19.3.0:
    resolution: {integrity: sha512-E8LUcbtBWt20bbl2YoHfx4ZDBdxVTfOKtCZn9cDSJ4l6/nuoApcpIBcj47t2wZoVX8g2ZHuMHbiShgCR1T5Sog==}
    engines: {node: '>=0.10.0'}

  readable-stream@2.3.8:
    resolution: {integrity: sha512-8p0AUk4XODgIewSi0l8Epjs+EVnWiK7NoDIEGU0HhE7+ZyY8D1IMY7odu5lRrFXGg71L15KG8QrPmum45RTtdA==}

  readdirp@5.1.1:
    resolution: {integrity: sha512-Kko+Y5XQ6fM+Ce3dq3m9YGxnacYZYl9cA1wZjaF3Vbry2L3i1qVg8+CAgNPsXRArPMUMCaOR7oa9Nqntc43JKA==}
    engines: {node: '>= 20.19.0'}

  rechoir@0.8.0:
    resolution: {integrity: sha512-/vxpCXddiX8NGfGO/mTafwjq4aFa/71pvamip0++IQk3zG8cbCj0fifNPrjjF1XMXUne91jL9OoxmdykoEtifQ==}
    engines: {node: '>= 10.13.0'}

  reflect-metadata@0.2.2:
    resolution: {integrity: sha512-urBwgfrvVP/eAyXx4hluJivBKzuEbSQs9rKWCrCkbSxNv8mxPcUZKeuoF3Uy4mJl3Lwprp6yy5/39VWigZ4K6Q==}

  regenerate-unicode-properties@10.3.0:
    resolution: {integrity: sha512-9ns8odR8e9q3otKeHj3DE80jZYKg6zVeZKE+zQmRKXFoVUcuiTGeO6iusDhPRoIQQPVPRvH+SfBhrTud4eczuw==}
    engines: {node: '>=4'}

  regenerate@1.4.2:
    resolution: {integrity: sha512-zrceR/XhGYU/d/opr2EKO7aRHUeiBI8qjtfHqADTwZd6Szfy16la6kqD0MIUs5z5hx6AaKa+PixpPrR289+I0A==}

  regexpu-core@6.5.2:
    resolution: {integrity: sha512-zkmVH92DlzjSFc4xKGZp/2BXIFrDIdBQBC8gUXKCsMgKYb1bkCkxfSuoW1werDjaTEMTbULkHtKFHe1L+Abnaw==}
    engines: {node: '>=4'}

  regjsgen@0.8.0:
    resolution: {integrity: sha512-RvwtGe3d7LvWiDQXeQw8p5asZUmfU1G/l6WbUXeHta7Y2PEIvBTwH6E2EfmYUK8pxcxEdEmaomqyp0vZZ7C+3Q==}

  regjsparser@0.13.3:
    resolution: {integrity: sha512-ycwFAS14Jw4mppvmK4GR/J6u3WpWpjkEApehuHtLc/8VpPNpDMbQ4WjqwplXifGeyKOzHSFLmSPqzksDQE2Sfg==}
    hasBin: true

  rehype-highlight@7.0.2:
    resolution: {integrity: sha512-k158pK7wdC2qL3M5NcZROZ2tR/l7zOzjxXd5VGdcfIyoijjQqpHd3JKtYSBDpDZ38UI2WJWuFAtkMDxmx5kstA==}

  rehype-sanitize@6.0.0:
    resolution: {integrity: sha512-CsnhKNsyI8Tub6L4sm5ZFsme4puGfc6pYylvXo1AeqaGbjOYyzNv3qZPwvs0oMJ39eryyeOdmxwUIo94IpEhqg==}

  relateurl@0.2.7:
    resolution: {integrity: sha512-G08Dxvm4iDN3MLM0EsP62EDV9IuhXPR6blNz6Utcp7zyV3tr4HVNINt6MpaRWbxoOHT3Q7YN2P+jaHX8vUbgog==}
    engines: {node: '>= 0.10'}

  remark-gfm@4.0.1:
    resolution: {integrity: sha512-1quofZ2RQ9EWdeN34S79+KExV1764+wCUGop5CPL1WGdD0ocPpu91lzPGbwWMECpEpd42kJGQwzRfyov9j4yNg==}

  remark-parse@11.0.0:
    resolution: {integrity: sha512-FCxlKLNGknS5ba/1lmpYijMUzX2esxW5xQqjWxw2eHFfS2MSdaHVINFmhjo+qN1WhZhNimq0dZATN9pH0IDrpA==}

  remark-rehype@11.1.2:
    resolution: {integrity: sha512-Dh7l57ianaEoIpzbp0PC9UKAdCSVklD8E5Rpw7ETfbTl3FqcOOgq5q2LVDhgGCkaBv7p24JXikPdvhhmHvKMsw==}

  remark-stringify@11.0.0:
    resolution: {integrity: sha512-1OSmLd3awB/t8qdoEOMazZkNsfVTeY4fTsgzcQFdXNq8ToTN4ZGwrMnlda4K6smTFKD+GRV6O48i6Z4iKgPPpw==}

  renderkid@3.0.0:
    resolution: {integrity: sha512-q/7VIQA8lmM1hF+jn+sFSPWGlMkSAeNYcPLmDQx2zzuiDfaLrOmumR8iaUKlenFgh0XRPIUeSPlH3A+AW3Z5pg==}

  require-from-string@2.0.2:
    resolution: {integrity: sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==}
    engines: {node: '>=0.10.0'}

  resolve-cwd@3.0.0:
    resolution: {integrity: sha512-OrZaX2Mb+rJCpH/6CpSqt9xFVpN++x01XnN2ie9g6P5/3xelLAkXWVADpdz1IHD/KFfEXyE6V0U01OQ3UO2rEg==}
    engines: {node: '>=8'}

  resolve-from@5.0.0:
    resolution: {integrity: sha512-qYg9KP24dD5qka9J47d0aVky0N+b4fTU89LN9iDnjB5waksiC49rvMB0PrUJQGoTmH50XPiqOvAjDfaijGxYZw==}
    engines: {node: '>=8'}

  resolve@1.22.12:
    resolution: {integrity: sha512-TyeJ1zif53BPfHootBGwPRYT1RUt6oGWsaQr8UyZW/eAm9bKoijtvruSDEmZHm92CwS9nj7/fWttqPCgzep8CA==}
    engines: {node: '>= 0.4'}
    hasBin: true

  router@2.2.0:
    resolution: {integrity: sha512-nLTrUKm2UyiL7rlhapu/Zl45FwNgkZGaCpZbIHajDYgwlJCOzLSk+cIPAnsEqV955GjILJnKbdQC1nVPz+gAYQ==}
    engines: {node: '>= 18'}

  run-applescript@7.1.0:
    resolution: {integrity: sha512-DPe5pVFaAsinSaV6QjQ6gdiedWDcRCbUuiQfQa2wmWV7+xC9bGulGI8+TdRmoFkAPaBXk8CrAbnlY2ISniJ47Q==}
    engines: {node: '>=18'}

  rxjs@7.8.2:
    resolution: {integrity: sha512-dhKf903U/PQZY6boNNtAGdWbG85WAbjT/1xYoZIC7FAY0yWapOBQVsVrDl58W86//e1VpMNBtRV4MaXfdMySFA==}

  safe-buffer@5.1.2:
    resolution: {integrity: sha512-Gd2UZBJDkXlY7GbJxfsE8/nvKkUEU1G38c1siN6QP6a9PT9MmHB8GnpscSmMJSoF8LOIrt8ud/wPtojys4G6+g==}

  safe-buffer@5.2.1:
    resolution: {integrity: sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==}

  safer-buffer@2.1.2:
    resolution: {integrity: sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==}

  scheduler@0.28.0:
    resolution: {integrity: sha512-juorfCmIkIw8tT+p5BXSm6PJjQF/ycEYmKyzURCIt/RaZIhL+PulbQ9Yu2z1HdOJDdqDTlxA1+xKBmHXJsczAw==}

  schema-utils@4.5.0:
    resolution: {integrity: sha512-zJlMCZ0cAR5p/Y4oVpRoqioDMJcGxaXRrQ/4rP4WyR84vc5z/DolXdbvXeDpTwbtocDFr2rhPqHPErDCUtz2kA==}
    engines: {node: '>= 10.13.0'}

  selfsigned@5.5.0:
    resolution: {integrity: sha512-ftnu3TW4+3eBfLRFnDEkzGxSF/10BJBkaLJuBHZX0kiPS7bRdlpZGu6YGt4KngMkdTwJE6MbjavFpqHvqVt+Ew==}
    engines: {node: '>=18'}

  semver@7.8.5:
    resolution: {integrity: sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==}
    engines: {node: '>=10'}
    hasBin: true

  send@1.2.1:
    resolution: {integrity: sha512-1gnZf7DFcoIcajTjTwjwuDjzuz4PPcY2StKPlsGAQ1+YH20IRVrBaXSWmdjowTJ6u8Rc01PoYOGHXfP1mYcZNQ==}
    engines: {node: '>= 18'}

  serve-index@1.9.2:
    resolution: {integrity: sha512-KDj11HScOaLmrPxl70KYNW1PksP4Nb/CLL2yvC+Qd2kHMPEEpfc4Re2e4FOay+bC/+XQl/7zAcWON3JVo5v3KQ==}
    engines: {node: '>= 0.8.0'}

  serve-static@2.2.1:
    resolution: {integrity: sha512-xRXBn0pPqQTVQiC8wyQrKs2MOlX24zQ0POGaj0kultvoOCstBQM5yvOhAVSUwOMjQtTvsPWoNCHfPGwaaQJhTw==}
    engines: {node: '>= 18'}

  setimmediate@1.0.5:
    resolution: {integrity: sha512-MATJdZp8sLqDl/68LfQmbP8zKPLQNV6BIZoIgrscFDQ+RsvK/BxeDQOgyxKKoh0y/8h3BqVFnCqQ/gd+reiIXA==}

  setprototypeof@1.2.0:
    resolution: {integrity: sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==}

  shallow-clone@3.0.1:
    resolution: {integrity: sha512-/6KqX+GVUdqPuPPd2LxDDxzX6CAbjJehAAOKlNpqqUpAqPM6HeL8f+o3a+JsyGjn2lv0WY8UsTgUJjU9Ok55NA==}
    engines: {node: '>=8'}

  shebang-command@2.0.0:
    resolution: {integrity: sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==}
    engines: {node: '>=8'}

  shebang-regex@3.0.0:
    resolution: {integrity: sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==}
    engines: {node: '>=8'}

  shell-quote@1.11.0:
    resolution: {integrity: sha512-JdxDPD0DBTyu08pq0kPC0xSNet/qsU07qT6IsX1AS8oO2ICNRY4ldNa8OAI6PuwAH8tG3lxEhbqmyp4Dw4036g==}
    engines: {node: '>= 0.4'}

  shell-quote@1.9.0:
    resolution: {integrity: sha512-Iov+JwFv/2HcTpcwNMKd8+IWNb8tboQJNQTkAY/LLVK7gGH9jy+LGkVqPxfekHl+yMmiqXszdGWXgkfml7hjqA==}
    engines: {node: '>= 0.4'}

  side-channel-list@1.0.1:
    resolution: {integrity: sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==}
    engines: {node: '>= 0.4'}

  side-channel-map@1.0.1:
    resolution: {integrity: sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==}
    engines: {node: '>= 0.4'}

  side-channel-weakmap@1.0.2:
    resolution: {integrity: sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==}
    engines: {node: '>= 0.4'}

  side-channel@1.1.1:
    resolution: {integrity: sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==}
    engines: {node: '>= 0.4'}

  source-map-js@1.2.1:
    resolution: {integrity: sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==}
    engines: {node: '>=0.10.0'}

  source-map-support@0.5.21:
    resolution: {integrity: sha512-uBHU3L3czsIyYXKX88fdrGovxdSCoTGDRZ6SYXtSRxLZUzHg5P/66Ht6uoUlHu9EZod+inXhKo3qQgwXUT/y1w==}

  source-map@0.6.1:
    resolution: {integrity: sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==}
    engines: {node: '>=0.10.0'}

  space-separated-tokens@2.0.2:
    resolution: {integrity: sha512-PEGlAwrG8yXGXRjW32fGbg66JAlOAwbObuqVoJpv/mRgoWDQfgH1wDPvtzWyUSNAXBGSk8h755YDbbcEy3SH2Q==}

  sprintf-js@1.0.3:
    resolution: {integrity: sha512-D9cPgkvLlV3t3IzL0D0YLvGA9Ahk4PcvVwUbN0dSGr1aP0Nrt4AEnTUbuGvquEC0mA64Gqt1fzirlRs5ibXx8g==}

  statuses@1.5.0:
    resolution: {integrity: sha512-OpZ3zP+jT1PI7I8nemJX4AKmAX070ZkYPVWV/AaKTJl+tXCTGyVdC1a4SL8RUQYEwk/f34ZX8UTykN68FwrqAA==}
    engines: {node: '>= 0.6'}

  statuses@2.0.2:
    resolution: {integrity: sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==}
    engines: {node: '>= 0.8'}

  streamsearch@1.1.0:
    resolution: {integrity: sha512-Mcc5wHehp9aXz1ax6bZUyY5afg9u2rv5cqQI3mRrYkGC8rW2hM02jWuwjtL++LS5qinSyhj2QfLyNsuc+VsExg==}
    engines: {node: '>=10.0.0'}

  string-width@7.2.0:
    resolution: {integrity: sha512-tsaTIkKW9b4N+AEj+SVA+WhJzV7/zMhcSu78mLKWSk7cXMOSHsBKFWUs0fWwq8QyK3MgJBQRX6Gbi4kYbdvGkQ==}
    engines: {node: '>=18'}

  string_decoder@1.1.1:
    resolution: {integrity: sha512-n/ShnvDi6FHbbVfviro+WojiFzv+s8MPMHBczVePfUpDJLwoLT0ht1l4YwBCbi8pJAveEEdnkHyPyTP/mzRfwg==}

  stringify-entities@4.0.4:
    resolution: {integrity: sha512-IwfBptatlO+QCJUo19AqvrPNqlVMpW9YEL2LIVY+Rpv2qsjCGxaDLNRgeGsQWJhfItebuJhsGSLjaBbNSQ+ieg==}

  strip-ansi@6.0.1:
    resolution: {integrity: sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==}
    engines: {node: '>=8'}

  strip-ansi@7.2.0:
    resolution: {integrity: sha512-yDPMNjp4WyfYBkHnjIRLfca1i6KMyGCtsVgoKe/z1+6vukgaENdgGBZt+ZmKPc4gavvEZ5OgHfHdrazhgNyG7w==}
    engines: {node: '>=12'}

  style-loader@4.0.0:
    resolution: {integrity: sha512-1V4WqhhZZgjVAVJyt7TdDPZoPBPNHbekX4fWnCJL1yQukhCeZhJySUL+gL9y6sNdN95uEOS83Y55SqHcP7MzLA==}
    engines: {node: '>= 18.12.0'}
    peerDependencies:
      webpack: ^5.27.0

  style-to-js@1.1.21:
    resolution: {integrity: sha512-RjQetxJrrUJLQPHbLku6U/ocGtzyjbJMP9lCNK7Ag0CNh690nSH8woqWH9u16nMjYBAok+i7JO1NP2pOy8IsPQ==}

  style-to-object@1.0.14:
    resolution: {integrity: sha512-LIN7rULI0jBscWQYaSswptyderlarFkjQ+t79nzty8tcIAceVomEVlLzH5VP4Cmsv6MtKhs7qaAiwlcp+Mgaxw==}

  supports-color@10.2.2:
    resolution: {integrity: sha512-SS+jx45GF1QjgEXQx4NJZV9ImqmO2NPz5FNsIHrsDjh2YsHnawpan7SNQ1o8NuhrbHZy9AZhIoCUiCeaW/C80g==}
    engines: {node: '>=18'}

  supports-color@8.1.1:
    resolution: {integrity: sha512-MpUEN2OodtUzxvKQl72cUF7RQ5EiHsGvSsVG0ia9c5RbWGL2CI4C7EpPS8UTBIplnlzZiNuV56w+FuNxy3ty2Q==}
    engines: {node: '>=10'}

  supports-preserve-symlinks-flag@1.0.0:
    resolution: {integrity: sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==}
    engines: {node: '>= 0.4'}

  tapable@2.3.3:
    resolution: {integrity: sha512-uxc/zpqFg6x7C8vOE7lh6Lbda8eEL9zmVm/PLeTPBRhh1xCgdWaQ+J1CUieGpIfm2HdtsUpRv+HshiasBMcc6A==}
    engines: {node: '>=6'}

  terser@5.51.2:
    resolution: {integrity: sha512-bWnjSNscmuI+GJze6ZupnHP8G/cTcsJF+bXCeQknk2SHQsgbNJnLrqiH9jZ2W4STPVXH2mDKKRX3iwPhc9Cn/Q==}
    engines: {node: '>=10'}
    hasBin: true

  thingies@2.6.1:
    resolution: {integrity: sha512-cV/CMGTK3M4MlnJ/0At6ismOw/A0EEniDNScajjz/Br3c1sqE72YD01rGpPTKwd27wAxI5Pr+6+0w8yofzFRYw==}
    engines: {node: '>=10.18'}
    peerDependencies:
      tslib: ^2

  thunky@1.1.0:
    resolution: {integrity: sha512-eHY7nBftgThBqOyHGVN+l8gF0BucP09fMo0oO/Lb0w1OF80dJv+lDVpXG60WMQvkcxAkNybKsrEIE3ZtKGmPrA==}

  tinyglobby@0.2.17:
    resolution: {integrity: sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==}
    engines: {node: '>=12.0.0'}

  to-regex-range@5.0.1:
    resolution: {integrity: sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==}
    engines: {node: '>=8.0'}

  toidentifier@1.0.1:
    resolution: {integrity: sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==}
    engines: {node: '>=0.6'}

  tree-dump@1.1.0:
    resolution: {integrity: sha512-rMuvhU4MCDbcbnleZTFezWsaZXRFemSqAM+7jPnzUl1fo9w3YEKOxAeui0fz3OI4EU4hf23iyA7uQRVko+UaBA==}
    engines: {node: '>=10.0'}
    peerDependencies:
      tslib: '2'

  tree-kill@1.2.2:
    resolution: {integrity: sha512-L0Orpi8qGpRG//Nd+H90vFB+3iHnue1zSSGmNOOCh1GLJ7rUKVwV2HvijphGQS2UmhUZewS9VgvxYIdgr+fG1A==}
    hasBin: true

  trim-lines@3.0.1:
    resolution: {integrity: sha512-kRj8B+YHZCc9kQYdWfJB2/oUl9rA99qbowYYBtr4ui4mZyAQ2JpvVBd/6U2YloATfqBhBTSMhTpgBHtU0Mf3Rg==}

  trough@2.2.0:
    resolution: {integrity: sha512-tmMpK00BjZiUyVyvrBK7knerNgmgvcV/KLVyuma/SC+TQN167GrMRciANTz09+k3zW8L8t60jWO1GpfkZdjTaw==}

  tslib@1.14.1:
    resolution: {integrity: sha512-Xni35NKzjgMrwevysHTCArtLDpPvye8zV/0E4EyYn43P7/7qvQwPh9BGkHewbMulVntbigmcT7rdX3BNo9wRJg==}

  tslib@2.8.1:
    resolution: {integrity: sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==}

  tsx@4.23.15:
    resolution: {integrity: sha512-Yiex1Ovn8z2xPpOWckIiysV1SSyRMY9BkLF++q0yKiDxCqRhosKfMg3janKkiLBwZ5c/YryloKwGZcrEmtwxKw==}
    engines: {node: '>=18.0.0'}
    hasBin: true

  tsyringe@4.10.0:
    resolution: {integrity: sha512-axr3IdNuVIxnaK5XGEUFTu3YmAQ6lllgrvqfEoR16g/HGnYY/6We4oWENtAnzK6/LpJ2ur9PAb80RBt7/U4ugw==}
    engines: {node: '>= 6.0.0'}

  type-is@1.6.18:
    resolution: {integrity: sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==}
    engines: {node: '>= 0.6'}

  type-is@2.1.0:
    resolution: {integrity: sha512-faYHw0anBbc/kWF3zFTEnxSFOAGUX9GFbOBthvDdLsIlEoWOFOtS0zgCiQYwIskL9iGXZL3kAXD8OoZ4GmMATA==}
    engines: {node: '>= 18'}

  type@2.7.3:
    resolution: {integrity: sha512-8j+1QmAbPvLZow5Qpi6NCaN8FB60p/6x8/vfNqOk/hC+HuvFZhL4+WfekuhQLiqFZXOgQdrs3B+XxEmCc6b3FQ==}

  typescript@6.0.3:
    resolution: {integrity: sha512-y2TvuxSZPDyQakkFRPZHKFm+KKVqIisdg9/CZwm9ftvKXLP8NRWj38/ODjNbr43SsoXqNuAisEf1GdCxqWcdBw==}
    engines: {node: '>=14.17'}
    hasBin: true

  underscore@1.13.8:
    resolution: {integrity: sha512-DXtD3ZtEQzc7M8m4cXotyHR+FAS18C64asBYY5vqZexfYryNNnDc02W4hKg3rdQuqOYas1jkseX0+nZXjTXnvQ==}

  undici-types@7.24.6:
    resolution: {integrity: sha512-WRNW+sJgj5OBN4/0JpHFqtqzhpbnV0GuB+OozA9gCL7a993SmU+1JBZCzLNxYsbMfIeDL+lTsphD5jN5N+n0zg==}

  unicode-canonical-property-names-ecmascript@2.0.1:
    resolution: {integrity: sha512-dA8WbNeb2a6oQzAQ55YlT5vQAWGV9WXOsi3SskE3bcCdM0P4SDd+24zS/OCacdRq5BkdsRj9q3Pg6YyQoxIGqg==}
    engines: {node: '>=4'}

  unicode-match-property-ecmascript@2.0.0:
    resolution: {integrity: sha512-5kaZCrbp5mmbz5ulBkDkbY0SsPOjKqVS35VpL9ulMPfSl0J0Xsm+9Evphv9CoIZFwre7aJoa94AY6seMKGVN5Q==}
    engines: {node: '>=4'}

  unicode-match-property-value-ecmascript@2.2.1:
    resolution: {integrity: sha512-JQ84qTuMg4nVkx8ga4A16a1epI9H6uTXAknqxkGF/aFfRLw1xC/Bp24HNLaZhHSkWd3+84t8iXnp1J0kYcZHhg==}
    engines: {node: '>=4'}

  unicode-property-aliases-ecmascript@2.2.0:
    resolution: {integrity: sha512-hpbDzxUY9BFwX+UeBnxv3Sh1q7HFxj48DTmXchNgRa46lO8uj3/1iEn3MiNUYTg1g9ctIqXCCERn8gYZhHC5lQ==}
    engines: {node: '>=4'}

  unified@11.0.5:
    resolution: {integrity: sha512-xKvGhPWw3k84Qjh8bI3ZeJjqnyadK+GEFtazSfZv/rKeTkTjOJho6mFqh2SM96iIcZokxiOpg78GazTSg8+KHA==}

  unist-util-find-after@5.0.0:
    resolution: {integrity: sha512-amQa0Ep2m6hE2g72AugUItjbuM8X8cGQnFoHk0pGfrFeT9GZhzN5SW8nRsiGKK7Aif4CrACPENkA6P/Lw6fHGQ==}

  unist-util-is@6.0.1:
    resolution: {integrity: sha512-LsiILbtBETkDz8I9p1dQ0uyRUWuaQzd/cuEeS1hoRSyW5E5XGmTzlwY1OrNzzakGowI9Dr/I8HVaw4hTtnxy8g==}

  unist-util-position@5.0.0:
    resolution: {integrity: sha512-fucsC7HjXvkB5R3kTCO7kUjRdrS0BJt3M/FPxmHMBOm8JQi2BsHAHFsy27E0EolP8rp0NzXsJ+jNPyDWvOJZPA==}

  unist-util-stringify-position@4.0.0:
    resolution: {integrity: sha512-0ASV06AAoKCDkS2+xw5RXJywruurpbC4JZSm7nr7MOt1ojAzvyyaO+UxZf18j8FCF6kmzCZKcAgN/yu2gm2XgQ==}

  unist-util-visit-parents@6.0.2:
    resolution: {integrity: sha512-goh1s1TBrqSqukSc8wrjwWhL0hiJxgA8m4kFxGlQ+8FYQ3C/m11FcTs4YYem7V664AhHVvgoQLk890Ssdsr2IQ==}

  unist-util-visit@5.1.0:
    resolution: {integrity: sha512-m+vIdyeCOpdr/QeQCu2EzxX/ohgS8KbnPDgFni4dQsfSCtpz8UqDyY5GjRru8PDKuYn7Fq19j1CQ+nJSsGKOzg==}

  unpipe@1.0.0:
    resolution: {integrity: sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==}
    engines: {node: '>= 0.8'}

  update-browserslist-db@1.3.3:
    resolution: {integrity: sha512-pJ2sYawQS0R/WI928Gj5GlPhTGzbMelq0+4INtSYNDV9ErKJcX6xjGWkoG/VnB3dpUm00zALaqkrUD77pO5TDQ==}
    hasBin: true
    peerDependencies:
      browserslist: '>= 4.21.0'

  util-deprecate@1.0.2:
    resolution: {integrity: sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==}

  utila@0.4.0:
    resolution: {integrity: sha512-Z0DbgELS9/L/75wZbro8xAnT50pBVFQZ+hUEueGDU5FN51YSCYM+jdxsfCiHjwNP/4LCDD0i/graKpeBnOXKRA==}

  vary@1.1.2:
    resolution: {integrity: sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==}
    engines: {node: '>= 0.8'}

  verkit@0.3.2:
    resolution: {integrity: sha512-zj/ob3UsvJGN0whEAKFp53REA5X66hvffVqoCtVQAakJKnKlH+/PcOfMoFwIG/o4rElqLv/ycAFlx8ZlXUorCg==}
    engines: {node: '>=18.12.0'}

  vfile-message@4.0.3:
    resolution: {integrity: sha512-QTHzsGd1EhbZs4AsQ20JX1rC3cOlt/IWJruk893DfLRr57lcnOeMaWG4K0JrRta4mIJZKth2Au3mM3u03/JWKw==}

  vfile@6.0.3:
    resolution: {integrity: sha512-KzIbH/9tXat2u30jf+smMwFCsno4wHVdNmzFyL+T/L3UGqqk6JKfVqOFOZEpZSHADH1k40ab6NUIXZq422ov3Q==}

  watchpack@2.5.2:
    resolution: {integrity: sha512-6i/00NBjP4yGPs+caKSyRfpTF/8Torsu0MOW3mMzIbhgISFder8i7xbqgHlLMwJrdiN8ndBV3UA1/AfzPSr+jg==}
    engines: {node: '>=10.13.0'}

  webpack-cli@7.2.3:
    resolution: {integrity: sha512-vDFU7jrfCctnN7jJQWPl+V26B51GLp11prVZXg50oeonsgeBzSTJEWmXkjHsOjTgMjlPOQM8GWLh33X9RN/0ow==}
    engines: {node: '>=20.9.0'}
    hasBin: true
    peerDependencies:
      js-yaml: ^4.0.0 || ^5.0.0
      json5: ^2.2.3
      toml: ^3.0.0 || ^4.0.0 || ^5.0.0
      webpack: ^5.101.0
      webpack-bundle-analyzer: ^4.0.0 || ^5.0.0
      webpack-dev-server: ^5.0.0 || ^6.0.0
    peerDependenciesMeta:
      js-yaml:
        optional: true
      json5:
        optional: true
      toml:
        optional: true
      webpack-bundle-analyzer:
        optional: true
      webpack-dev-server:
        optional: true

  webpack-dev-middleware@8.3.0:
    resolution: {integrity: sha512-jFNNMB29ugmkEUFW9cpWNqcWFQNwuMTMVoRpKVAiz/5nh3gA4x9x6DRPhNHGc/SLre7pEP9yrAPDAmCvdCblKg==}
    engines: {node: '>= 20.9.0'}
    peerDependencies:
      webpack: ^5.101.0
    peerDependenciesMeta:
      webpack:
        optional: true

  webpack-dev-server@6.0.0:
    resolution: {integrity: sha512-q9SD4ItOGhZLeU6EGT10caDZdHjF50Pz1DtkRZZOPsfluMXOkacWKKOtSBSLVkPqKiF67eFUC0rI88U/tSFPEw==}
    engines: {node: '>= 22.15.0'}
    hasBin: true
    peerDependencies:
      webpack: ^5.101.0
      webpack-cli: '*'
    peerDependenciesMeta:
      webpack:
        optional: true
      webpack-cli:
        optional: true

  webpack-merge@6.0.1:
    resolution: {integrity: sha512-hXXvrjtx2PLYx4qruKl+kyRSLc52V+cCvMxRjmKwoA+CBbbF5GfIBtR6kCvl0fYGqTUPKB+1ktVmTHqMOzgCBg==}
    engines: {node: '>=18.0.0'}

  webpack-sources@3.6.0:
    resolution: {integrity: sha512-EIMmPVvNI0CYXyRPp34F2Qk7W37/BZVZIofS6LAUnrNjCVahS+hO4mxwFJDjQjODTGZDtVzLYoN2+1dYkhk9qA==}
    engines: {node: '>=10.13.0'}

  webpack@5.111.1:
    resolution: {integrity: sha512-cNypaz0RP+S4cvQVi1M/3bRUkvNP0xZpL0TjFx+c6jg64VbxD+2weWDgY9UnjRI6dhZgtaj8DU76GGFcJ79xPQ==}
    engines: {node: '>=10.13.0'}
    hasBin: true
    peerDependencies:
      webpack-cli: '*'
    peerDependenciesMeta:
      webpack-cli:
        optional: true

  which@2.0.2:
    resolution: {integrity: sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==}
    engines: {node: '>= 8'}
    hasBin: true

  wildcard@2.0.1:
    resolution: {integrity: sha512-CC1bOL87PIWSBhDcTrdeLo6eGT7mCFtrg0uIJtqJUFyK+eJnzl8A1niH56uu7KMa5XFrtiV+AQuHO3n7DsHnLQ==}

  wrap-ansi@9.0.2:
    resolution: {integrity: sha512-42AtmgqjV+X1VpdOfyTGOYRi0/zsoLqtXQckTmqTeybT+BDIbM/Guxo7x3pE2vtpr1ok6xRqM9OpBe+Jyoqyww==}
    engines: {node: '>=18'}

  wrappy@1.0.2:
    resolution: {integrity: sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==}

  ws@8.22.0:
    resolution: {integrity: sha512-Ydggc987+RO0AnWtZ/7Wq9FtNvcrL1b/RO0ud9mWjUPgDrsAAwQSF51sm2hm1XofbU/4jkpGEsLFsZZxU+1DOg==}
    engines: {node: '>=10.0.0'}
    peerDependencies:
      bufferutil: ^4.0.1
      utf-8-validate: '>=5.0.2'
    peerDependenciesMeta:
      bufferutil:
        optional: true
      utf-8-validate:
        optional: true

  wsl-utils@1.0.0:
    resolution: {integrity: sha512-Hl0ZOAs672vg+06kfujwRhoS6/jehvULrlFkuF2dRu6pHgA8U06h3xqNIqNNU1LTXPcedxByAR4GS6pwQK0mgA==}
    engines: {node: '>=20'}

  xmlbuilder@10.1.1:
    resolution: {integrity: sha512-OyzrcFLL/nb6fMGHbiRDuPup9ljBycsdCypwuyg5AAHvyWzGfChJpCXMG88AGTIMFhGZ9RccFN1e6lhg3hkwKg==}
    engines: {node: '>=4.0'}

  y18n@5.0.8:
    resolution: {integrity: sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==}
    engines: {node: '>=10'}

  yargs-parser@22.0.0:
    resolution: {integrity: sha512-rwu/ClNdSMpkSrUb+d6BRsSkLUq1fmfsY6TOpYzTwvwkg1/NRG85KBy3kq++A8LKQwX6lsu+aWad+2khvuXrqw==}
    engines: {node: ^20.19.0 || ^22.12.0 || >=23}

  yargs@18.0.0:
    resolution: {integrity: sha512-4UEqdc2RYGHZc7Doyqkrqiln3p9X2DZVxaGbwhn2pi7MrRagKaOcIKe8L3OxYcbhXLgLFUS3zAYuQjKBQgmuNg==}
    engines: {node: ^20.19.0 || ^22.12.0 || >=23}

  yocto-queue@0.1.0:
    resolution: {integrity: sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==}
    engines: {node: '>=10'}

  zwitch@2.0.4:
    resolution: {integrity: sha512-bXE4cR/kVZhKZX/RjPEflHaKVhUVl85noU3v6b8apfQEc1x4A+zBxjZ4lN8LqGd6WZ3dl98pY4o717VFmoPp+A==}

snapshots:

  '@babel/code-frame@8.0.6':
    dependencies:
      '@babel/helper-validator-identifier': 8.0.6
      js-tokens: 10.0.0

  '@babel/compat-data@8.0.5': {}

  '@babel/core@8.0.6':
    dependencies:
      '@babel/code-frame': 8.0.6
      '@babel/generator': 8.0.6
      '@babel/helper-compilation-targets': 8.0.6
      '@babel/helpers': 8.0.5
      '@babel/parser': 8.0.6
      '@babel/template': 8.0.0
      '@babel/traverse': 8.0.6
      '@babel/types': 8.0.6
      '@types/gensync': 1.0.5
      convert-source-map: 2.0.0
      empathic: 2.1.0
      gensync: 1.0.0-beta.2
      import-meta-resolve: 4.2.0
      json5: 2.2.3
      obug: 2.2.1
      verkit: 0.3.2

  '@babel/generator@8.0.6':
    dependencies:
      '@babel/parser': 8.0.6
      '@babel/types': 8.0.6
      '@jridgewell/gen-mapping': 0.4.0-beta.0
      '@jridgewell/trace-mapping': 0.3.31
      '@types/jsesc': 2.5.1
      jsesc: 3.1.0

  '@babel/helper-annotate-as-pure@8.0.0':
    dependencies:
      '@babel/types': 8.0.6

  '@babel/helper-compilation-targets@8.0.6':
    dependencies:
      '@babel/compat-data': 8.0.5
      '@babel/helper-validator-option': 8.0.0
      browserslist: 4.29.3
      flru: 1.0.2
      verkit: 0.3.2

  '@babel/helper-create-class-features-plugin@8.0.6(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-annotate-as-pure': 8.0.0
      '@babel/helper-member-expression-to-functions': 8.0.5
      '@babel/helper-optimise-call-expression': 8.0.0
      '@babel/helper-replace-supers': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-skip-transparent-expression-wrappers': 8.0.0
      '@babel/traverse': 8.0.6
      verkit: 0.3.2

  '@babel/helper-create-regexp-features-plugin@8.0.5(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-annotate-as-pure': 8.0.0
      regexpu-core: 6.5.2
      verkit: 0.3.2

  '@babel/helper-define-polyfill-provider@1.0.0(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-compilation-targets': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      lodash.debounce: 4.0.8

  '@babel/helper-globals@8.0.6': {}

  '@babel/helper-member-expression-to-functions@8.0.5':
    dependencies:
      '@babel/traverse': 8.0.6
      '@babel/types': 8.0.6

  '@babel/helper-module-imports@8.0.0':
    dependencies:
      '@babel/traverse': 8.0.6
      '@babel/types': 8.0.6

  '@babel/helper-module-transforms@8.0.6(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-module-imports': 8.0.0
      '@babel/helper-validator-identifier': 8.0.6
      '@babel/traverse': 8.0.6

  '@babel/helper-optimise-call-expression@8.0.0':
    dependencies:
      '@babel/types': 8.0.6

  '@babel/helper-plugin-utils@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6

  '@babel/helper-remap-async-to-generator@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-annotate-as-pure': 8.0.0
      '@babel/helper-wrap-function': 8.0.0
      '@babel/traverse': 8.0.6

  '@babel/helper-replace-supers@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-member-expression-to-functions': 8.0.5
      '@babel/helper-optimise-call-expression': 8.0.0
      '@babel/traverse': 8.0.6

  '@babel/helper-skip-transparent-expression-wrappers@8.0.0':
    dependencies:
      '@babel/traverse': 8.0.6
      '@babel/types': 8.0.6

  '@babel/helper-string-parser@8.0.6': {}

  '@babel/helper-validator-identifier@8.0.6': {}

  '@babel/helper-validator-option@8.0.0': {}

  '@babel/helper-wrap-function@8.0.0':
    dependencies:
      '@babel/template': 8.0.0
      '@babel/traverse': 8.0.6
      '@babel/types': 8.0.6

  '@babel/helpers@8.0.5':
    dependencies:
      '@babel/template': 8.0.0
      '@babel/types': 8.0.6

  '@babel/parser@8.0.6':
    dependencies:
      '@babel/types': 8.0.6

  '@babel/plugin-bugfix-firefox-class-in-computed-class-key@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-bugfix-safari-class-field-initializer-scope@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-skip-transparent-expression-wrappers': 8.0.0

  '@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-skip-transparent-expression-wrappers': 8.0.0
      '@babel/plugin-transform-optional-chaining': 8.0.5(@babel/core@8.0.6)

  '@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-syntax-jsx@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-syntax-typescript@8.0.3(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-arrow-functions@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-async-generator-functions@8.0.6(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-remap-async-to-generator': 8.0.1(@babel/core@8.0.6)
      '@babel/traverse': 8.0.6

  '@babel/plugin-transform-async-to-generator@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-module-imports': 8.0.0
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-remap-async-to-generator': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-block-scoped-functions@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-block-scoping@8.0.5(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-class-properties@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-create-class-features-plugin': 8.0.6(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-class-static-block@8.0.5(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-create-class-features-plugin': 8.0.6(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-classes@8.0.5(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-annotate-as-pure': 8.0.0
      '@babel/helper-compilation-targets': 8.0.6
      '@babel/helper-globals': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-replace-supers': 8.0.1(@babel/core@8.0.6)
      '@babel/traverse': 8.0.6

  '@babel/plugin-transform-computed-properties@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-destructuring@8.0.5(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-dotall-regex@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-create-regexp-features-plugin': 8.0.5(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-duplicate-keys@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-create-regexp-features-plugin': 8.0.5(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-dynamic-import@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-explicit-resource-management@8.0.5(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-destructuring': 8.0.5(@babel/core@8.0.6)

  '@babel/plugin-transform-exponentiation-operator@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-export-namespace-from@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-for-of@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-skip-transparent-expression-wrappers': 8.0.0

  '@babel/plugin-transform-function-name@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-compilation-targets': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-json-strings@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-literals@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-logical-assignment-operators@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-member-expression-literals@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-modules-amd@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-module-transforms': 8.0.6(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-modules-commonjs@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-module-transforms': 8.0.6(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-modules-systemjs@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-module-transforms': 8.0.6(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-validator-identifier': 8.0.6

  '@babel/plugin-transform-modules-umd@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-module-transforms': 8.0.6(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-named-capturing-groups-regex@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-create-regexp-features-plugin': 8.0.5(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-new-target@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-nullish-coalescing-operator@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-numeric-separator@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-object-rest-spread@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-compilation-targets': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-destructuring': 8.0.5(@babel/core@8.0.6)
      '@babel/plugin-transform-parameters': 8.0.5(@babel/core@8.0.6)

  '@babel/plugin-transform-object-super@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-replace-supers': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-optional-catch-binding@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-optional-chaining@8.0.5(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-skip-transparent-expression-wrappers': 8.0.0

  '@babel/plugin-transform-parameters@8.0.5(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-private-methods@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-create-class-features-plugin': 8.0.6(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-private-property-in-object@8.0.5(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-annotate-as-pure': 8.0.0
      '@babel/helper-create-class-features-plugin': 8.0.6(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-property-literals@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-react-display-name@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-react-jsx-development@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/plugin-transform-react-jsx': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-react-jsx@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-annotate-as-pure': 8.0.0
      '@babel/helper-module-imports': 8.0.0
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-syntax-jsx': 8.0.1(@babel/core@8.0.6)
      '@babel/types': 8.0.6

  '@babel/plugin-transform-react-pure-annotations@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-annotate-as-pure': 8.0.0
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-regenerator@8.0.6(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-regexp-modifiers@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-create-regexp-features-plugin': 8.0.5(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-reserved-words@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-shorthand-properties@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-spread@8.0.5(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-skip-transparent-expression-wrappers': 8.0.0

  '@babel/plugin-transform-sticky-regex@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-template-literals@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-typeof-symbol@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-typescript@8.0.6(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-annotate-as-pure': 8.0.0
      '@babel/helper-create-class-features-plugin': 8.0.6(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-skip-transparent-expression-wrappers': 8.0.0
      '@babel/plugin-syntax-typescript': 8.0.3(@babel/core@8.0.6)

  '@babel/plugin-transform-unicode-escapes@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-unicode-property-regex@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-create-regexp-features-plugin': 8.0.5(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-unicode-regex@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-create-regexp-features-plugin': 8.0.5(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/plugin-transform-unicode-sets-regex@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-create-regexp-features-plugin': 8.0.5(@babel/core@8.0.6)
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)

  '@babel/preset-env@8.0.6(@babel/core@8.0.6)':
    dependencies:
      '@babel/compat-data': 8.0.5
      '@babel/core': 8.0.6
      '@babel/helper-compilation-targets': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-validator-option': 8.0.0
      '@babel/plugin-bugfix-firefox-class-in-computed-class-key': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-bugfix-safari-class-field-initializer-scope': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-bugfix-safari-rest-destructuring-rhs-array': 8.0.6(@babel/core@8.0.6)
      '@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-arrow-functions': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-async-generator-functions': 8.0.6(@babel/core@8.0.6)
      '@babel/plugin-transform-async-to-generator': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-block-scoped-functions': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-block-scoping': 8.0.5(@babel/core@8.0.6)
      '@babel/plugin-transform-class-properties': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-class-static-block': 8.0.5(@babel/core@8.0.6)
      '@babel/plugin-transform-classes': 8.0.5(@babel/core@8.0.6)
      '@babel/plugin-transform-computed-properties': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-destructuring': 8.0.5(@babel/core@8.0.6)
      '@babel/plugin-transform-dotall-regex': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-duplicate-keys': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-duplicate-named-capturing-groups-regex': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-dynamic-import': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-explicit-resource-management': 8.0.5(@babel/core@8.0.6)
      '@babel/plugin-transform-exponentiation-operator': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-export-namespace-from': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-for-of': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-function-name': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-json-strings': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-literals': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-logical-assignment-operators': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-member-expression-literals': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-modules-amd': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-modules-commonjs': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-modules-systemjs': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-modules-umd': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-named-capturing-groups-regex': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-new-target': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-nullish-coalescing-operator': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-numeric-separator': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-object-rest-spread': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-object-super': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-optional-catch-binding': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-optional-chaining': 8.0.5(@babel/core@8.0.6)
      '@babel/plugin-transform-parameters': 8.0.5(@babel/core@8.0.6)
      '@babel/plugin-transform-private-methods': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-private-property-in-object': 8.0.5(@babel/core@8.0.6)
      '@babel/plugin-transform-property-literals': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-regenerator': 8.0.6(@babel/core@8.0.6)
      '@babel/plugin-transform-regexp-modifiers': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-reserved-words': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-shorthand-properties': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-spread': 8.0.5(@babel/core@8.0.6)
      '@babel/plugin-transform-sticky-regex': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-template-literals': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-typeof-symbol': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-unicode-escapes': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-unicode-property-regex': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-unicode-regex': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-unicode-sets-regex': 8.0.1(@babel/core@8.0.6)
      '@babel/preset-modules': 0.2.0(@babel/core@8.0.6)
      babel-plugin-polyfill-corejs3: 1.0.0(@babel/core@8.0.6)
      core-js-compat: 3.50.0
      verkit: 0.3.2

  '@babel/preset-modules@0.2.0(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-dotall-regex': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-unicode-property-regex': 8.0.1(@babel/core@8.0.6)
      '@babel/types': 8.0.6
      esutils: 2.0.3

  '@babel/preset-react@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-validator-option': 8.0.0
      '@babel/plugin-transform-react-display-name': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-react-jsx': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-react-jsx-development': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-react-pure-annotations': 8.0.1(@babel/core@8.0.6)

  '@babel/preset-typescript@8.0.1(@babel/core@8.0.6)':
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-plugin-utils': 8.0.1(@babel/core@8.0.6)
      '@babel/helper-validator-option': 8.0.0
      '@babel/plugin-transform-modules-commonjs': 8.0.1(@babel/core@8.0.6)
      '@babel/plugin-transform-typescript': 8.0.6(@babel/core@8.0.6)

  '@babel/template@8.0.0':
    dependencies:
      '@babel/code-frame': 8.0.6
      '@babel/parser': 8.0.6
      '@babel/types': 8.0.6

  '@babel/traverse@8.0.6':
    dependencies:
      '@babel/code-frame': 8.0.6
      '@babel/generator': 8.0.6
      '@babel/helper-globals': 8.0.6
      '@babel/parser': 8.0.6
      '@babel/template': 8.0.0
      '@babel/types': 8.0.6
      obug: 2.2.1

  '@babel/types@8.0.6':
    dependencies:
      '@babel/helper-string-parser': 8.0.6
      '@babel/helper-validator-identifier': 8.0.6

  '@discoveryjs/json-ext@1.1.0': {}

  '@esbuild/aix-ppc64@0.28.2':
    optional: true

  '@esbuild/android-arm64@0.28.2':
    optional: true

  '@esbuild/android-arm@0.28.2':
    optional: true

  '@esbuild/android-x64@0.28.2':
    optional: true

  '@esbuild/darwin-arm64@0.28.2':
    optional: true

  '@esbuild/darwin-x64@0.28.2':
    optional: true

  '@esbuild/freebsd-arm64@0.28.2':
    optional: true

  '@esbuild/freebsd-x64@0.28.2':
    optional: true

  '@esbuild/linux-arm64@0.28.2':
    optional: true

  '@esbuild/linux-arm@0.28.2':
    optional: true

  '@esbuild/linux-ia32@0.28.2':
    optional: true

  '@esbuild/linux-loong64@0.28.2':
    optional: true

  '@esbuild/linux-mips64el@0.28.2':
    optional: true

  '@esbuild/linux-ppc64@0.28.2':
    optional: true

  '@esbuild/linux-riscv64@0.28.2':
    optional: true

  '@esbuild/linux-s390x@0.28.2':
    optional: true

  '@esbuild/linux-x64@0.28.2':
    optional: true

  '@esbuild/netbsd-arm64@0.28.2':
    optional: true

  '@esbuild/netbsd-x64@0.28.2':
    optional: true

  '@esbuild/openbsd-arm64@0.28.2':
    optional: true

  '@esbuild/openbsd-x64@0.28.2':
    optional: true

  '@esbuild/openharmony-arm64@0.28.2':
    optional: true

  '@esbuild/sunos-x64@0.28.2':
    optional: true

  '@esbuild/win32-arm64@0.28.2':
    optional: true

  '@esbuild/win32-ia32@0.28.2':
    optional: true

  '@esbuild/win32-x64@0.28.2':
    optional: true

  '@jridgewell/gen-mapping@0.3.13':
    dependencies:
      '@jridgewell/sourcemap-codec': 1.6.0
      '@jridgewell/trace-mapping': 0.3.31

  '@jridgewell/gen-mapping@0.4.0-beta.0':
    dependencies:
      '@jridgewell/sourcemap-codec': 1.6.0
      '@jridgewell/trace-mapping': 0.3.31

  '@jridgewell/resolve-uri@3.1.2': {}

  '@jridgewell/source-map@0.3.11':
    dependencies:
      '@jridgewell/gen-mapping': 0.3.13
      '@jridgewell/trace-mapping': 0.3.31

  '@jridgewell/sourcemap-codec@1.6.0': {}

  '@jridgewell/trace-mapping@0.3.31':
    dependencies:
      '@jridgewell/resolve-uri': 3.1.2
      '@jridgewell/sourcemap-codec': 1.6.0

  '@jsonjoy.com/base64@1.1.2(tslib@2.8.1)':
    dependencies:
      tslib: 2.8.1

  '@jsonjoy.com/base64@17.67.0(tslib@2.8.1)':
    dependencies:
      tslib: 2.8.1

  '@jsonjoy.com/buffers@1.2.1(tslib@2.8.1)':
    dependencies:
      tslib: 2.8.1

  '@jsonjoy.com/buffers@17.67.0(tslib@2.8.1)':
    dependencies:
      tslib: 2.8.1

  '@jsonjoy.com/codegen@1.0.0(tslib@2.8.1)':
    dependencies:
      tslib: 2.8.1

  '@jsonjoy.com/codegen@17.67.0(tslib@2.8.1)':
    dependencies:
      tslib: 2.8.1

  '@jsonjoy.com/fs-core@4.80.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/fs-node-builtins': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node-utils': 4.80.0(tslib@2.8.1)
      thingies: 2.6.1(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/fs-fsa@4.80.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/fs-core': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node-builtins': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node-utils': 4.80.0(tslib@2.8.1)
      thingies: 2.6.1(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/fs-node-builtins@4.80.0(tslib@2.8.1)':
    dependencies:
      tslib: 2.8.1

  '@jsonjoy.com/fs-node-to-fsa@4.80.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/fs-fsa': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node-builtins': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node-utils': 4.80.0(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/fs-node-utils@4.80.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/fs-node-builtins': 4.80.0(tslib@2.8.1)
      glob-to-regex.js: 1.3.1(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/fs-node@4.80.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/fs-core': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node-builtins': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node-utils': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-print': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-snapshot': 4.80.0(tslib@2.8.1)
      glob-to-regex.js: 1.3.1(tslib@2.8.1)
      thingies: 2.6.1(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/fs-print@4.80.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/fs-node-utils': 4.80.0(tslib@2.8.1)
      tree-dump: 1.1.0(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/fs-snapshot@4.80.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/buffers': 17.67.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node-utils': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/json-pack': 17.67.0(tslib@2.8.1)
      '@jsonjoy.com/util': 17.67.0(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/json-pack@1.21.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/base64': 1.1.2(tslib@2.8.1)
      '@jsonjoy.com/buffers': 1.2.1(tslib@2.8.1)
      '@jsonjoy.com/codegen': 1.0.0(tslib@2.8.1)
      '@jsonjoy.com/json-pointer': 1.0.2(tslib@2.8.1)
      '@jsonjoy.com/util': 1.9.0(tslib@2.8.1)
      hyperdyperid: 1.2.0
      thingies: 2.6.1(tslib@2.8.1)
      tree-dump: 1.1.0(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/json-pack@17.67.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/base64': 17.67.0(tslib@2.8.1)
      '@jsonjoy.com/buffers': 17.67.0(tslib@2.8.1)
      '@jsonjoy.com/codegen': 17.67.0(tslib@2.8.1)
      '@jsonjoy.com/json-pointer': 17.67.0(tslib@2.8.1)
      '@jsonjoy.com/util': 17.67.0(tslib@2.8.1)
      hyperdyperid: 1.2.0
      thingies: 2.6.1(tslib@2.8.1)
      tree-dump: 1.1.0(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/json-pointer@1.0.2(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/codegen': 1.0.0(tslib@2.8.1)
      '@jsonjoy.com/util': 1.9.0(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/json-pointer@17.67.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/util': 17.67.0(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/util@1.9.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/buffers': 1.2.1(tslib@2.8.1)
      '@jsonjoy.com/codegen': 1.0.0(tslib@2.8.1)
      tslib: 2.8.1

  '@jsonjoy.com/util@17.67.0(tslib@2.8.1)':
    dependencies:
      '@jsonjoy.com/buffers': 17.67.0(tslib@2.8.1)
      '@jsonjoy.com/codegen': 17.67.0(tslib@2.8.1)
      tslib: 2.8.1

  '@leichtgewicht/ip-codec@2.0.5': {}

  '@napi-rs/canvas-android-arm64@0.1.80':
    optional: true

  '@napi-rs/canvas-darwin-arm64@0.1.80':
    optional: true

  '@napi-rs/canvas-darwin-x64@0.1.80':
    optional: true

  '@napi-rs/canvas-linux-arm-gnueabihf@0.1.80':
    optional: true

  '@napi-rs/canvas-linux-arm64-gnu@0.1.80':
    optional: true

  '@napi-rs/canvas-linux-arm64-musl@0.1.80':
    optional: true

  '@napi-rs/canvas-linux-riscv64-gnu@0.1.80':
    optional: true

  '@napi-rs/canvas-linux-x64-gnu@0.1.80':
    optional: true

  '@napi-rs/canvas-linux-x64-musl@0.1.80':
    optional: true

  '@napi-rs/canvas-win32-x64-msvc@0.1.80':
    optional: true

  '@napi-rs/canvas@0.1.80':
    optionalDependencies:
      '@napi-rs/canvas-android-arm64': 0.1.80
      '@napi-rs/canvas-darwin-arm64': 0.1.80
      '@napi-rs/canvas-darwin-x64': 0.1.80
      '@napi-rs/canvas-linux-arm-gnueabihf': 0.1.80
      '@napi-rs/canvas-linux-arm64-gnu': 0.1.80
      '@napi-rs/canvas-linux-arm64-musl': 0.1.80
      '@napi-rs/canvas-linux-riscv64-gnu': 0.1.80
      '@napi-rs/canvas-linux-x64-gnu': 0.1.80
      '@napi-rs/canvas-linux-x64-musl': 0.1.80
      '@napi-rs/canvas-win32-x64-msvc': 0.1.80

  '@noble/hashes@1.8.0': {}

  '@oxlint/binding-android-arm-eabi@1.86.0':
    optional: true

  '@oxlint/binding-android-arm64@1.86.0':
    optional: true

  '@oxlint/binding-darwin-arm64@1.86.0':
    optional: true

  '@oxlint/binding-darwin-x64@1.86.0':
    optional: true

  '@oxlint/binding-freebsd-x64@1.86.0':
    optional: true

  '@oxlint/binding-linux-arm-gnueabihf@1.86.0':
    optional: true

  '@oxlint/binding-linux-arm-musleabihf@1.86.0':
    optional: true

  '@oxlint/binding-linux-arm64-gnu@1.86.0':
    optional: true

  '@oxlint/binding-linux-arm64-musl@1.86.0':
    optional: true

  '@oxlint/binding-linux-ppc64-gnu@1.86.0':
    optional: true

  '@oxlint/binding-linux-riscv64-gnu@1.86.0':
    optional: true

  '@oxlint/binding-linux-riscv64-musl@1.86.0':
    optional: true

  '@oxlint/binding-linux-s390x-gnu@1.86.0':
    optional: true

  '@oxlint/binding-linux-x64-gnu@1.86.0':
    optional: true

  '@oxlint/binding-linux-x64-musl@1.86.0':
    optional: true

  '@oxlint/binding-openharmony-arm64@1.86.0':
    optional: true

  '@oxlint/binding-win32-arm64-msvc@1.86.0':
    optional: true

  '@oxlint/binding-win32-ia32-msvc@1.86.0':
    optional: true

  '@oxlint/binding-win32-x64-msvc@1.86.0':
    optional: true

  '@peculiar/asn1-cms@2.10.0':
    dependencies:
      '@peculiar/asn1-schema': 2.10.0
      '@peculiar/asn1-x509': 2.10.0
      '@peculiar/asn1-x509-attr': 2.10.0
      asn1js: 3.0.10
      tslib: 2.8.1

  '@peculiar/asn1-csr@2.10.0':
    dependencies:
      '@peculiar/asn1-schema': 2.10.0
      '@peculiar/asn1-x509': 2.10.0
      asn1js: 3.0.10
      tslib: 2.8.1

  '@peculiar/asn1-ecc@2.10.0':
    dependencies:
      '@peculiar/asn1-schema': 2.10.0
      '@peculiar/asn1-x509': 2.10.0
      asn1js: 3.0.10
      tslib: 2.8.1

  '@peculiar/asn1-pfx@2.10.0':
    dependencies:
      '@peculiar/asn1-cms': 2.10.0
      '@peculiar/asn1-pkcs8': 2.10.0
      '@peculiar/asn1-rsa': 2.10.0
      '@peculiar/asn1-schema': 2.10.0
      asn1js: 3.0.10
      tslib: 2.8.1

  '@peculiar/asn1-pkcs8@2.10.0':
    dependencies:
      '@peculiar/asn1-schema': 2.10.0
      '@peculiar/asn1-x509': 2.10.0
      asn1js: 3.0.10
      tslib: 2.8.1

  '@peculiar/asn1-pkcs9@2.10.0':
    dependencies:
      '@peculiar/asn1-cms': 2.10.0
      '@peculiar/asn1-pfx': 2.10.0
      '@peculiar/asn1-pkcs8': 2.10.0
      '@peculiar/asn1-schema': 2.10.0
      '@peculiar/asn1-x509': 2.10.0
      '@peculiar/asn1-x509-attr': 2.10.0
      asn1js: 3.0.10
      tslib: 2.8.1

  '@peculiar/asn1-rsa@2.10.0':
    dependencies:
      '@peculiar/asn1-schema': 2.10.0
      '@peculiar/asn1-x509': 2.10.0
      asn1js: 3.0.10
      tslib: 2.8.1

  '@peculiar/asn1-schema@2.10.0':
    dependencies:
      '@peculiar/utils': 2.0.3
      asn1js: 3.0.10
      tslib: 2.8.1

  '@peculiar/asn1-x509-attr@2.10.0':
    dependencies:
      '@peculiar/asn1-schema': 2.10.0
      '@peculiar/asn1-x509': 2.10.0
      asn1js: 3.0.10
      tslib: 2.8.1

  '@peculiar/asn1-x509@2.10.0':
    dependencies:
      '@peculiar/asn1-schema': 2.10.0
      '@peculiar/utils': 2.0.3
      asn1js: 3.0.10
      tslib: 2.8.1

  '@peculiar/utils@2.0.3':
    dependencies:
      tslib: 2.8.1

  '@peculiar/x509@1.14.3':
    dependencies:
      '@peculiar/asn1-cms': 2.10.0
      '@peculiar/asn1-csr': 2.10.0
      '@peculiar/asn1-ecc': 2.10.0
      '@peculiar/asn1-pkcs9': 2.10.0
      '@peculiar/asn1-rsa': 2.10.0
      '@peculiar/asn1-schema': 2.10.0
      '@peculiar/asn1-x509': 2.10.0
      pvtsutils: 1.3.6
      reflect-metadata: 0.2.2
      tslib: 2.8.1
      tsyringe: 4.10.0

  '@types/body-parser@1.19.6':
    dependencies:
      '@types/connect': 3.4.38
      '@types/node': 24.19.0

  '@types/bonjour@3.5.13':
    dependencies:
      '@types/node': 24.19.0

  '@types/connect-history-api-fallback@1.5.4':
    dependencies:
      '@types/express-serve-static-core': 5.1.3
      '@types/node': 24.19.0

  '@types/connect@3.4.38':
    dependencies:
      '@types/node': 24.19.0

  '@types/debug@4.1.13':
    dependencies:
      '@types/ms': 2.1.0

  '@types/estree-jsx@1.0.5':
    dependencies:
      '@types/estree': 1.0.9

  '@types/estree@1.0.9': {}

  '@types/express-serve-static-core@5.1.3':
    dependencies:
      '@types/node': 24.19.0
      '@types/qs': 6.15.1
      '@types/range-parser': 1.2.7
      '@types/send': 1.2.1

  '@types/express@5.0.6':
    dependencies:
      '@types/body-parser': 1.19.6
      '@types/express-serve-static-core': 5.1.3
      '@types/serve-static': 2.2.0

  '@types/gensync@1.0.5': {}

  '@types/hast@3.0.5':
    dependencies:
      '@types/unist': 3.0.3

  '@types/html-minifier-terser@6.1.0': {}

  '@types/http-errors@2.0.5': {}

  '@types/jsesc@2.5.1': {}

  '@types/json-schema@7.0.15': {}

  '@types/localforage@0.0.34':
    dependencies:
      localforage: 1.10.0

  '@types/mdast@4.0.4':
    dependencies:
      '@types/unist': 3.0.3

  '@types/ms@2.1.0': {}

  '@types/multer@2.3.0':
    dependencies:
      '@types/express': 5.0.6

  '@types/node@24.19.0':
    dependencies:
      undici-types: 7.24.6

  '@types/pdf-parse@1.1.5':
    dependencies:
      '@types/node': 24.19.0

  '@types/qs@6.15.1': {}

  '@types/range-parser@1.2.7': {}

  '@types/react-dom@19.3.0(@types/react@19.3.0)':
    dependencies:
      '@types/react': 19.3.0

  '@types/react@19.3.0':
    dependencies:
      csstype: 3.2.3

  '@types/send@1.2.1':
    dependencies:
      '@types/node': 24.19.0

  '@types/serve-index@1.9.4':
    dependencies:
      '@types/express': 5.0.6

  '@types/serve-static@2.2.0':
    dependencies:
      '@types/http-errors': 2.0.5
      '@types/node': 24.19.0

  '@types/unist@2.0.11': {}

  '@types/unist@3.0.3': {}

  '@types/ws@8.18.2':
    dependencies:
      '@types/node': 24.19.0

  '@ungap/structured-clone@1.4.0': {}

  '@webassemblyjs/ast@1.14.1':
    dependencies:
      '@webassemblyjs/helper-numbers': 1.13.2
      '@webassemblyjs/helper-wasm-bytecode': 1.13.2

  '@webassemblyjs/floating-point-hex-parser@1.13.2': {}

  '@webassemblyjs/helper-api-error@1.13.2': {}

  '@webassemblyjs/helper-buffer@1.14.1': {}

  '@webassemblyjs/helper-numbers@1.13.2':
    dependencies:
      '@webassemblyjs/floating-point-hex-parser': 1.13.2
      '@webassemblyjs/helper-api-error': 1.13.2
      '@xtuc/long': 4.2.2

  '@webassemblyjs/helper-wasm-bytecode@1.13.2': {}

  '@webassemblyjs/helper-wasm-section@1.14.1':
    dependencies:
      '@webassemblyjs/ast': 1.14.1
      '@webassemblyjs/helper-buffer': 1.14.1
      '@webassemblyjs/helper-wasm-bytecode': 1.13.2
      '@webassemblyjs/wasm-gen': 1.14.1

  '@webassemblyjs/ieee754@1.13.2':
    dependencies:
      '@xtuc/ieee754': 1.2.0

  '@webassemblyjs/leb128@1.13.2':
    dependencies:
      '@xtuc/long': 4.2.2

  '@webassemblyjs/utf8@1.13.2': {}

  '@webassemblyjs/wasm-edit@1.14.1':
    dependencies:
      '@webassemblyjs/ast': 1.14.1
      '@webassemblyjs/helper-buffer': 1.14.1
      '@webassemblyjs/helper-wasm-bytecode': 1.13.2
      '@webassemblyjs/helper-wasm-section': 1.14.1
      '@webassemblyjs/wasm-gen': 1.14.1
      '@webassemblyjs/wasm-opt': 1.14.1
      '@webassemblyjs/wasm-parser': 1.14.1
      '@webassemblyjs/wast-printer': 1.14.1

  '@webassemblyjs/wasm-gen@1.14.1':
    dependencies:
      '@webassemblyjs/ast': 1.14.1
      '@webassemblyjs/helper-wasm-bytecode': 1.13.2
      '@webassemblyjs/ieee754': 1.13.2
      '@webassemblyjs/leb128': 1.13.2
      '@webassemblyjs/utf8': 1.13.2

  '@webassemblyjs/wasm-opt@1.14.1':
    dependencies:
      '@webassemblyjs/ast': 1.14.1
      '@webassemblyjs/helper-buffer': 1.14.1
      '@webassemblyjs/wasm-gen': 1.14.1
      '@webassemblyjs/wasm-parser': 1.14.1

  '@webassemblyjs/wasm-parser@1.14.1':
    dependencies:
      '@webassemblyjs/ast': 1.14.1
      '@webassemblyjs/helper-api-error': 1.13.2
      '@webassemblyjs/helper-wasm-bytecode': 1.13.2
      '@webassemblyjs/ieee754': 1.13.2
      '@webassemblyjs/leb128': 1.13.2
      '@webassemblyjs/utf8': 1.13.2

  '@webassemblyjs/wast-printer@1.14.1':
    dependencies:
      '@webassemblyjs/ast': 1.14.1
      '@xtuc/long': 4.2.2

  '@xmldom/xmldom@0.7.13': {}

  '@xmldom/xmldom@0.8.15': {}

  '@xtuc/ieee754@1.2.0': {}

  '@xtuc/long@4.2.2': {}

  accepts@1.3.8:
    dependencies:
      mime-types: 2.1.35
      negotiator: 0.6.3

  accepts@2.0.0:
    dependencies:
      mime-types: 3.0.2
      negotiator: 1.1.0

  acorn@8.18.0: {}

  ajv-formats@3.0.1(ajv@8.20.0):
    optionalDependencies:
      ajv: 8.20.0

  ajv-keywords@5.1.0(ajv@8.20.0):
    dependencies:
      ajv: 8.20.0
      fast-deep-equal: 3.1.3

  ajv@8.20.0:
    dependencies:
      fast-deep-equal: 3.1.3
      fast-uri: 3.1.8
      json-schema-traverse: 1.0.0
      require-from-string: 2.0.2

  ansi-html-community@0.0.8: {}

  ansi-regex@5.0.1: {}

  ansi-regex@6.4.0: {}

  ansi-styles@6.2.3: {}

  append-field@1.0.0: {}

  argparse@1.0.10:
    dependencies:
      sprintf-js: 1.0.3

  asn1js@3.0.10:
    dependencies:
      pvtsutils: 1.3.6
      pvutils: 1.2.0
      tslib: 2.8.1

  babel-loader@10.1.1(@babel/core@8.0.6)(webpack@5.111.1):
    dependencies:
      '@babel/core': 8.0.6
      find-up: 5.0.0
    optionalDependencies:
      webpack: 5.111.1(postcss@8.5.28)(webpack-cli@7.2.3)

  babel-plugin-polyfill-corejs3@1.0.0(@babel/core@8.0.6):
    dependencies:
      '@babel/core': 8.0.6
      '@babel/helper-define-polyfill-provider': 1.0.0(@babel/core@8.0.6)
      core-js-compat: 3.50.0

  bail@2.0.2: {}

  base64-js@1.5.1: {}

  baseline-browser-mapping@2.11.26: {}

  batch@0.6.1: {}

  body-parser@2.3.0:
    dependencies:
      bytes: 3.1.2
      content-type: 2.1.0
      debug: 4.4.3
      http-errors: 2.0.1
      iconv-lite: 0.7.3
      on-finished: 2.4.1
      qs: 6.16.0
      raw-body: 3.0.2
      type-is: 2.1.0
    transitivePeerDependencies:
      - supports-color

  bonjour-service@1.4.4:
    dependencies:
      fast-deep-equal: 3.1.3
      multicast-dns: 7.2.5

  boolbase@1.0.0: {}

  braces@3.0.3:
    dependencies:
      fill-range: 7.1.1

  browserslist@4.29.3:
    dependencies:
      baseline-browser-mapping: 2.11.26
      caniuse-lite: 1.0.30001813
      electron-to-chromium: 1.5.441
      node-releases: 2.0.57
      update-browserslist-db: 1.3.3(browserslist@4.29.3)

  buffer-from@1.1.2: {}

  bundle-name@4.1.1:
    dependencies:
      run-applescript: 7.1.0

  busboy@1.6.0:
    dependencies:
      streamsearch: 1.1.0

  bytes@3.1.2: {}

  bytestreamjs@2.0.1: {}

  call-bind-apply-helpers@1.0.2:
    dependencies:
      es-errors: 1.3.0
      function-bind: 1.1.2

  call-bound@1.0.4:
    dependencies:
      call-bind-apply-helpers: 1.0.2
      get-intrinsic: 1.3.0

  camel-case@4.1.2:
    dependencies:
      pascal-case: 3.1.2
      tslib: 2.8.1

  caniuse-lite@1.0.30001813: {}

  ccount@2.0.1: {}

  chalk@5.6.2: {}

  character-entities-html4@2.1.0: {}

  character-entities-legacy@3.0.0: {}

  character-entities@2.0.2: {}

  character-reference-invalid@2.0.1: {}

  chokidar@5.0.0:
    dependencies:
      readdirp: 5.1.1

  chrome-trace-event@1.0.4: {}

  clean-css@5.3.3:
    dependencies:
      source-map: 0.6.1

  cliui@9.0.1:
    dependencies:
      string-width: 7.2.0
      strip-ansi: 7.2.0
      wrap-ansi: 9.0.2

  clone-deep@4.0.1:
    dependencies:
      is-plain-object: 2.0.4
      kind-of: 6.0.3
      shallow-clone: 3.0.1

  comma-separated-tokens@2.0.3: {}

  commander@14.0.3: {}

  commander@2.20.3: {}

  commander@8.3.0: {}

  compressible@2.0.18:
    dependencies:
      mime-db: 1.54.0

  compression@1.8.2:
    dependencies:
      bytes: 3.1.2
      compressible: 2.0.18
      debug: 2.6.9
      destroy: 1.2.0
      negotiator: 0.6.4
      on-headers: 1.1.0
      safe-buffer: 5.2.1
      vary: 1.1.2
    transitivePeerDependencies:
      - supports-color

  concurrently@10.0.5:
    dependencies:
      chalk: 5.6.2
      rxjs: 7.8.2
      shell-quote: 1.9.0
      supports-color: 10.2.2
      tree-kill: 1.2.2
      yargs: 18.0.0

  connect-history-api-fallback@2.0.0: {}

  content-disposition@1.1.0: {}

  content-type@1.0.5: {}

  content-type@2.1.0: {}

  convert-source-map@2.0.0: {}

  cookie-signature@1.2.2: {}

  cookie@0.7.2: {}

  core-js-compat@3.50.0:
    dependencies:
      browserslist: 4.29.3

  core-js@3.50.0: {}

  core-util-is@1.0.3: {}

  cross-spawn@7.0.6:
    dependencies:
      path-key: 3.1.1
      shebang-command: 2.0.0
      which: 2.0.2

  css-loader@7.1.5(webpack@5.111.1):
    dependencies:
      icss-utils: 5.1.0(postcss@8.5.28)
      postcss: 8.5.28
      postcss-modules-extract-imports: 3.1.0(postcss@8.5.28)
      postcss-modules-local-by-default: 4.2.0(postcss@8.5.28)
      postcss-modules-scope: 3.2.1(postcss@8.5.28)
      postcss-modules-values: 4.0.0(postcss@8.5.28)
      postcss-value-parser: 4.2.0
      semver: 7.8.5
    optionalDependencies:
      webpack: 5.111.1(postcss@8.5.28)(webpack-cli@7.2.3)

  css-select@4.3.0:
    dependencies:
      boolbase: 1.0.0
      css-what: 6.2.2
      domhandler: 4.3.1
      domutils: 2.8.0
      nth-check: 2.1.1

  css-what@6.2.2: {}

  cssesc@3.0.0: {}

  csstype@3.2.3: {}

  d@1.0.2:
    dependencies:
      es5-ext: 0.10.64
      type: 2.7.3

  debug@2.6.9:
    dependencies:
      ms: 2.0.0

  debug@4.4.3:
    dependencies:
      ms: 2.1.3

  decode-named-character-reference@1.3.0:
    dependencies:
      character-entities: 2.0.2

  default-browser-id@5.0.1: {}

  default-browser@5.5.1:
    dependencies:
      bundle-name: 4.1.1
      default-browser-id: 5.0.1

  define-lazy-prop@3.0.0: {}

  depd@1.1.2: {}

  depd@2.0.0: {}

  dequal@2.0.3: {}

  destroy@1.2.0: {}

  devlop@1.1.0:
    dependencies:
      dequal: 2.0.3

  dingbat-to-unicode@1.0.2: {}

  dns-packet@5.6.1:
    dependencies:
      '@leichtgewicht/ip-codec': 2.0.5

  dom-converter@0.2.0:
    dependencies:
      utila: 0.4.0

  dom-serializer@1.4.1:
    dependencies:
      domelementtype: 2.3.0
      domhandler: 4.3.1
      entities: 2.2.0

  domelementtype@2.3.0: {}

  domhandler@4.3.1:
    dependencies:
      domelementtype: 2.3.0

  domutils@2.8.0:
    dependencies:
      dom-serializer: 1.4.1
      domelementtype: 2.3.0
      domhandler: 4.3.1

  dot-case@3.0.4:
    dependencies:
      no-case: 3.0.4
      tslib: 2.8.1

  duck@0.1.12:
    dependencies:
      underscore: 1.13.8

  dunder-proto@1.0.1:
    dependencies:
      call-bind-apply-helpers: 1.0.2
      es-errors: 1.3.0
      gopd: 1.2.0

  ee-first@1.1.1: {}

  electron-to-chromium@1.5.441: {}

  emoji-regex@10.6.0: {}

  empathic@2.1.0: {}

  encodeurl@2.0.0: {}

  enhanced-resolve@5.26.0:
    dependencies:
      graceful-fs: 4.2.11
      tapable: 2.3.3

  entities@2.2.0: {}

  envinfo@7.21.0: {}

  epubjs@0.3.93:
    dependencies:
      '@types/localforage': 0.0.34
      '@xmldom/xmldom': 0.7.13
      core-js: 3.50.0
      event-emitter: 0.3.5
      jszip: 3.10.2
      localforage: 1.10.0
      lodash: 4.18.1
      marks-pane: 1.0.9
      path-webpack: 0.0.3

  es-define-property@1.0.1: {}

  es-errors@1.3.0: {}

  es-module-lexer@2.3.2: {}

  es-object-atoms@1.1.2:
    dependencies:
      es-errors: 1.3.0

  es5-ext@0.10.64:
    dependencies:
      es6-iterator: 2.0.3
      es6-symbol: 3.1.4
      esniff: 2.0.1
      next-tick: 1.1.0

  es6-iterator@2.0.3:
    dependencies:
      d: 1.0.2
      es5-ext: 0.10.64
      es6-symbol: 3.1.4

  es6-symbol@3.1.4:
    dependencies:
      d: 1.0.2
      ext: 1.7.0

  esbuild@0.28.2:
    optionalDependencies:
      '@esbuild/aix-ppc64': 0.28.2
      '@esbuild/android-arm': 0.28.2
      '@esbuild/android-arm64': 0.28.2
      '@esbuild/android-x64': 0.28.2
      '@esbuild/darwin-arm64': 0.28.2
      '@esbuild/darwin-x64': 0.28.2
      '@esbuild/freebsd-arm64': 0.28.2
      '@esbuild/freebsd-x64': 0.28.2
      '@esbuild/linux-arm': 0.28.2
      '@esbuild/linux-arm64': 0.28.2
      '@esbuild/linux-ia32': 0.28.2
      '@esbuild/linux-loong64': 0.28.2
      '@esbuild/linux-mips64el': 0.28.2
      '@esbuild/linux-ppc64': 0.28.2
      '@esbuild/linux-riscv64': 0.28.2
      '@esbuild/linux-s390x': 0.28.2
      '@esbuild/linux-x64': 0.28.2
      '@esbuild/netbsd-arm64': 0.28.2
      '@esbuild/netbsd-x64': 0.28.2
      '@esbuild/openbsd-arm64': 0.28.2
      '@esbuild/openbsd-x64': 0.28.2
      '@esbuild/openharmony-arm64': 0.28.2
      '@esbuild/sunos-x64': 0.28.2
      '@esbuild/win32-arm64': 0.28.2
      '@esbuild/win32-ia32': 0.28.2
      '@esbuild/win32-x64': 0.28.2

  escalade@3.2.0: {}

  escape-html@1.0.3: {}

  escape-string-regexp@5.0.0: {}

  esniff@2.0.1:
    dependencies:
      d: 1.0.2
      es5-ext: 0.10.64
      event-emitter: 0.3.5
      type: 2.7.3

  estree-util-is-identifier-name@3.0.0: {}

  esutils@2.0.3: {}

  etag@1.8.1: {}

  event-emitter@0.3.5:
    dependencies:
      d: 1.0.2
      es5-ext: 0.10.64

  events@3.3.0: {}

  express@5.2.1:
    dependencies:
      accepts: 2.0.0
      body-parser: 2.3.0
      content-disposition: 1.1.0
      content-type: 1.0.5
      cookie: 0.7.2
      cookie-signature: 1.2.2
      debug: 4.4.3
      depd: 2.0.0
      encodeurl: 2.0.0
      escape-html: 1.0.3
      etag: 1.8.1
      finalhandler: 2.1.1
      fresh: 2.0.0
      http-errors: 2.0.1
      merge-descriptors: 2.0.0
      mime-types: 3.0.2
      on-finished: 2.4.1
      once: 1.4.0
      parseurl: 1.3.3
      proxy-addr: 2.0.8
      qs: 6.16.0
      range-parser: 1.3.0
      router: 2.2.0
      send: 1.2.1
      serve-static: 2.2.1
      statuses: 2.0.2
      type-is: 2.1.0
      vary: 1.1.2
    transitivePeerDependencies:
      - supports-color

  ext@1.7.0:
    dependencies:
      type: 2.7.3

  extend@3.0.2: {}

  fast-deep-equal@3.1.3: {}

  fast-uri@3.1.8: {}

  fdir@6.5.0(picomatch@4.0.7):
    optionalDependencies:
      picomatch: 4.0.7

  fill-range@7.1.1:
    dependencies:
      to-regex-range: 5.0.1

  finalhandler@2.1.1:
    dependencies:
      debug: 4.4.3
      encodeurl: 2.0.0
      escape-html: 1.0.3
      on-finished: 2.4.1
      parseurl: 1.3.3
      statuses: 2.0.2
    transitivePeerDependencies:
      - supports-color

  find-up@4.1.0:
    dependencies:
      locate-path: 5.0.0
      path-exists: 4.0.0

  find-up@5.0.0:
    dependencies:
      locate-path: 6.0.0
      path-exists: 4.0.0

  flat@5.0.2: {}

  flru@1.0.2: {}

  forwarded@0.2.0: {}

  fresh@2.0.0: {}

  fsevents@2.3.3:
    optional: true

  function-bind@1.1.2: {}

  gensync@1.0.0-beta.2: {}

  get-caller-file@2.0.5: {}

  get-east-asian-width@1.7.0: {}

  get-intrinsic@1.3.0:
    dependencies:
      call-bind-apply-helpers: 1.0.2
      es-define-property: 1.0.1
      es-errors: 1.3.0
      es-object-atoms: 1.1.2
      function-bind: 1.1.2
      get-proto: 1.0.1
      gopd: 1.2.0
      has-symbols: 1.1.0
      hasown: 2.0.4
      math-intrinsics: 1.1.0

  get-proto@1.0.1:
    dependencies:
      dunder-proto: 1.0.1
      es-object-atoms: 1.1.2

  glob-to-regex.js@1.3.1(tslib@2.8.1):
    dependencies:
      tslib: 2.8.1

  gopd@1.2.0: {}

  graceful-fs@4.2.11: {}

  has-flag@4.0.0: {}

  has-symbols@1.1.0: {}

  hasown@2.0.4:
    dependencies:
      function-bind: 1.1.2

  hast-util-is-element@3.0.0:
    dependencies:
      '@types/hast': 3.0.5

  hast-util-sanitize@5.0.2:
    dependencies:
      '@types/hast': 3.0.5
      '@ungap/structured-clone': 1.4.0
      unist-util-position: 5.0.0

  hast-util-to-jsx-runtime@2.3.6:
    dependencies:
      '@types/estree': 1.0.9
      '@types/hast': 3.0.5
      '@types/unist': 3.0.3
      comma-separated-tokens: 2.0.3
      devlop: 1.1.0
      estree-util-is-identifier-name: 3.0.0
      hast-util-whitespace: 3.0.0
      mdast-util-mdx-expression: 2.0.1
      mdast-util-mdx-jsx: 3.2.0
      mdast-util-mdxjs-esm: 2.0.1
      property-information: 7.2.0
      space-separated-tokens: 2.0.2
      style-to-js: 1.1.21
      unist-util-position: 5.0.0
      vfile-message: 4.0.3
    transitivePeerDependencies:
      - supports-color

  hast-util-to-text@4.0.2:
    dependencies:
      '@types/hast': 3.0.5
      '@types/unist': 3.0.3
      hast-util-is-element: 3.0.0
      unist-util-find-after: 5.0.0

  hast-util-whitespace@3.0.0:
    dependencies:
      '@types/hast': 3.0.5

  he@1.2.0: {}

  highlight.js@11.11.2: {}

  html-minifier-terser@6.1.0:
    dependencies:
      camel-case: 4.1.2
      clean-css: 5.3.3
      commander: 8.3.0
      he: 1.2.0
      param-case: 3.0.4
      relateurl: 0.2.7
      terser: 5.51.2

  html-url-attributes@3.0.1: {}

  html-webpack-plugin@5.6.8(webpack@5.111.1):
    dependencies:
      '@types/html-minifier-terser': 6.1.0
      html-minifier-terser: 6.1.0
      lodash: 4.18.1
      pretty-error: 4.0.0
      tapable: 2.3.3
    optionalDependencies:
      webpack: 5.111.1(postcss@8.5.28)(webpack-cli@7.2.3)

  htmlparser2@6.1.0:
    dependencies:
      domelementtype: 2.3.0
      domhandler: 4.3.1
      domutils: 2.8.0
      entities: 2.2.0

  http-errors@1.8.1:
    dependencies:
      depd: 1.1.2
      inherits: 2.0.4
      setprototypeof: 1.2.0
      statuses: 1.5.0
      toidentifier: 1.0.1

  http-errors@2.0.1:
    dependencies:
      depd: 2.0.0
      inherits: 2.0.4
      setprototypeof: 1.2.0
      statuses: 2.0.2
      toidentifier: 1.0.1

  http-proxy-middleware@4.2.0:
    dependencies:
      debug: 4.4.3
      httpxy: 0.5.5
      is-glob: 4.0.3
      is-plain-obj: 4.1.0
      micromatch: 4.0.8
    transitivePeerDependencies:
      - supports-color

  httpxy@0.5.5: {}

  hyperdyperid@1.2.0: {}

  iconv-lite@0.7.3:
    dependencies:
      safer-buffer: 2.1.2

  icss-utils@5.1.0(postcss@8.5.28):
    dependencies:
      postcss: 8.5.28

  immediate@3.0.6: {}

  import-local@3.2.0:
    dependencies:
      pkg-dir: 4.2.0
      resolve-cwd: 3.0.0

  import-meta-resolve@4.2.0: {}

  inherits@2.0.4: {}

  inline-style-parser@0.2.7: {}

  interpret@3.1.1: {}

  ipaddr.js@1.9.1: {}

  ipaddr.js@2.5.0: {}

  is-alphabetical@2.0.1: {}

  is-alphanumerical@2.0.1:
    dependencies:
      is-alphabetical: 2.0.1
      is-decimal: 2.0.1

  is-core-module@2.17.0:
    dependencies:
      hasown: 2.0.4

  is-decimal@2.0.1: {}

  is-docker@3.0.0: {}

  is-extglob@2.1.1: {}

  is-glob@4.0.3:
    dependencies:
      is-extglob: 2.1.1

  is-hexadecimal@2.0.1: {}

  is-in-ssh@1.0.0: {}

  is-inside-container@1.0.0:
    dependencies:
      is-docker: 3.0.0

  is-network-error@1.3.2: {}

  is-number@7.0.0: {}

  is-plain-obj@4.1.0: {}

  is-plain-object@2.0.4:
    dependencies:
      isobject: 3.0.1

  is-promise@4.0.0: {}

  is-wsl@3.1.1:
    dependencies:
      is-inside-container: 1.0.0

  isarray@1.0.0: {}

  isexe@2.0.0: {}

  isobject@3.0.1: {}

  jest-worker@27.5.1:
    dependencies:
      '@types/node': 24.19.0
      merge-stream: 2.0.0
      supports-color: 8.1.1

  js-tokens@10.0.0: {}

  jsesc@3.1.0: {}

  json-schema-traverse@1.0.0: {}

  json5@2.2.3: {}

  jszip@3.10.2:
    dependencies:
      lie: 3.3.0
      pako: 1.0.11
      readable-stream: 2.3.8
      setimmediate: 1.0.5

  kind-of@6.0.3: {}

  launch-editor@2.14.1:
    dependencies:
      picocolors: 1.1.1
      shell-quote: 1.11.0

  lie@3.1.1:
    dependencies:
      immediate: 3.0.6

  lie@3.3.0:
    dependencies:
      immediate: 3.0.6

  localforage@1.10.0:
    dependencies:
      lie: 3.1.1

  locate-path@5.0.0:
    dependencies:
      p-locate: 4.1.0

  locate-path@6.0.0:
    dependencies:
      p-locate: 5.0.0

  lodash.debounce@4.0.8: {}

  lodash@4.18.1: {}

  longest-streak@3.1.0: {}

  lop@0.4.2:
    dependencies:
      duck: 0.1.12
      option: 0.2.4
      underscore: 1.13.8

  lower-case@2.0.2:
    dependencies:
      tslib: 2.8.1

  lowlight@3.3.0:
    dependencies:
      '@types/hast': 3.0.5
      devlop: 1.1.0
      highlight.js: 11.11.2

  lucide-react@1.48.0(react@19.3.0):
    dependencies:
      react: 19.3.0

  mammoth@1.13.0:
    dependencies:
      '@xmldom/xmldom': 0.8.15
      argparse: 1.0.10
      base64-js: 1.5.1
      dingbat-to-unicode: 1.0.2
      jszip: 3.10.2
      lop: 0.4.2
      underscore: 1.13.8
      xmlbuilder: 10.1.1

  markdown-table@3.0.4: {}

  marked@18.0.14: {}

  marks-pane@1.0.9: {}

  math-intrinsics@1.1.0: {}

  mdast-util-find-and-replace@3.0.2:
    dependencies:
      '@types/mdast': 4.0.4
      escape-string-regexp: 5.0.0
      unist-util-is: 6.0.1
      unist-util-visit-parents: 6.0.2

  mdast-util-from-markdown@2.0.3:
    dependencies:
      '@types/mdast': 4.0.4
      '@types/unist': 3.0.3
      decode-named-character-reference: 1.3.0
      devlop: 1.1.0
      mdast-util-to-string: 4.0.0
      micromark: 4.0.3
      micromark-util-decode-numeric-character-reference: 2.0.2
      micromark-util-decode-string: 2.0.1
      micromark-util-normalize-identifier: 2.0.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3
      unist-util-stringify-position: 4.0.0
    transitivePeerDependencies:
      - supports-color

  mdast-util-gfm-autolink-literal@2.0.1:
    dependencies:
      '@types/mdast': 4.0.4
      ccount: 2.0.1
      devlop: 1.1.0
      mdast-util-find-and-replace: 3.0.2
      micromark-util-character: 2.1.1

  mdast-util-gfm-footnote@2.1.0:
    dependencies:
      '@types/mdast': 4.0.4
      devlop: 1.1.0
      mdast-util-from-markdown: 2.0.3
      mdast-util-to-markdown: 2.1.3
      micromark-util-normalize-identifier: 2.0.1
    transitivePeerDependencies:
      - supports-color

  mdast-util-gfm-strikethrough@2.0.1:
    dependencies:
      '@types/mdast': 4.0.4
      mdast-util-from-markdown: 2.0.3
      mdast-util-to-markdown: 2.1.3
    transitivePeerDependencies:
      - supports-color

  mdast-util-gfm-table@2.0.0:
    dependencies:
      '@types/mdast': 4.0.4
      devlop: 1.1.0
      markdown-table: 3.0.4
      mdast-util-from-markdown: 2.0.3
      mdast-util-to-markdown: 2.1.3
    transitivePeerDependencies:
      - supports-color

  mdast-util-gfm-task-list-item@2.0.0:
    dependencies:
      '@types/mdast': 4.0.4
      devlop: 1.1.0
      mdast-util-from-markdown: 2.0.3
      mdast-util-to-markdown: 2.1.3
    transitivePeerDependencies:
      - supports-color

  mdast-util-gfm@3.1.0:
    dependencies:
      mdast-util-from-markdown: 2.0.3
      mdast-util-gfm-autolink-literal: 2.0.1
      mdast-util-gfm-footnote: 2.1.0
      mdast-util-gfm-strikethrough: 2.0.1
      mdast-util-gfm-table: 2.0.0
      mdast-util-gfm-task-list-item: 2.0.0
      mdast-util-to-markdown: 2.1.3
    transitivePeerDependencies:
      - supports-color

  mdast-util-mdx-expression@2.0.1:
    dependencies:
      '@types/estree-jsx': 1.0.5
      '@types/hast': 3.0.5
      '@types/mdast': 4.0.4
      devlop: 1.1.0
      mdast-util-from-markdown: 2.0.3
      mdast-util-to-markdown: 2.1.3
    transitivePeerDependencies:
      - supports-color

  mdast-util-mdx-jsx@3.2.0:
    dependencies:
      '@types/estree-jsx': 1.0.5
      '@types/hast': 3.0.5
      '@types/mdast': 4.0.4
      '@types/unist': 3.0.3
      ccount: 2.0.1
      devlop: 1.1.0
      mdast-util-from-markdown: 2.0.3
      mdast-util-to-markdown: 2.1.3
      parse-entities: 4.0.2
      stringify-entities: 4.0.4
      unist-util-stringify-position: 4.0.0
      vfile-message: 4.0.3
    transitivePeerDependencies:
      - supports-color

  mdast-util-mdxjs-esm@2.0.1:
    dependencies:
      '@types/estree-jsx': 1.0.5
      '@types/hast': 3.0.5
      '@types/mdast': 4.0.4
      devlop: 1.1.0
      mdast-util-from-markdown: 2.0.3
      mdast-util-to-markdown: 2.1.3
    transitivePeerDependencies:
      - supports-color

  mdast-util-phrasing@4.1.0:
    dependencies:
      '@types/mdast': 4.0.4
      unist-util-is: 6.0.1

  mdast-util-to-hast@13.2.1:
    dependencies:
      '@types/hast': 3.0.5
      '@types/mdast': 4.0.4
      '@ungap/structured-clone': 1.4.0
      devlop: 1.1.0
      micromark-util-sanitize-uri: 2.0.1
      trim-lines: 3.0.1
      unist-util-position: 5.0.0
      unist-util-visit: 5.1.0
      vfile: 6.0.3

  mdast-util-to-markdown@2.1.3:
    dependencies:
      '@types/mdast': 4.0.4
      '@types/unist': 3.0.3
      longest-streak: 3.1.0
      mdast-util-phrasing: 4.1.0
      mdast-util-to-string: 4.0.0
      micromark-util-character: 2.1.1
      micromark-util-classify-character: 2.0.1
      micromark-util-decode-string: 2.0.1
      micromark-util-html-tag-name: 2.0.1
      unist-util-visit: 5.1.0
      zwitch: 2.0.4

  mdast-util-to-string@4.0.0:
    dependencies:
      '@types/mdast': 4.0.4

  media-typer@0.3.0: {}

  media-typer@1.1.1: {}

  memfs@4.80.0:
    dependencies:
      '@jsonjoy.com/fs-core': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-fsa': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node-builtins': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node-to-fsa': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-node-utils': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-print': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/fs-snapshot': 4.80.0(tslib@2.8.1)
      '@jsonjoy.com/json-pack': 1.21.0(tslib@2.8.1)
      '@jsonjoy.com/util': 1.9.0(tslib@2.8.1)
      glob-to-regex.js: 1.3.1(tslib@2.8.1)
      thingies: 2.6.1(tslib@2.8.1)
      tree-dump: 1.1.0(tslib@2.8.1)
      tslib: 2.8.1

  merge-descriptors@2.0.0: {}

  merge-stream@2.0.0: {}

  micromark-core-commonmark@2.0.4:
    dependencies:
      decode-named-character-reference: 1.3.0
      devlop: 1.1.0
      micromark-factory-destination: 2.0.1
      micromark-factory-label: 2.0.1
      micromark-factory-space: 2.1.0
      micromark-factory-title: 2.0.1
      micromark-factory-whitespace: 2.0.1
      micromark-util-character: 2.1.1
      micromark-util-chunked: 2.0.1
      micromark-util-classify-character: 2.0.1
      micromark-util-edit-map: 1.0.0
      micromark-util-html-tag-name: 2.0.1
      micromark-util-normalize-identifier: 2.0.1
      micromark-util-resolve-all: 2.0.1
      micromark-util-subtokenize: 2.1.0
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-extension-gfm-autolink-literal@2.1.0:
    dependencies:
      micromark-util-character: 2.1.1
      micromark-util-sanitize-uri: 2.0.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-extension-gfm-footnote@2.1.0:
    dependencies:
      devlop: 1.1.0
      micromark-core-commonmark: 2.0.4
      micromark-factory-space: 2.1.0
      micromark-util-character: 2.1.1
      micromark-util-normalize-identifier: 2.0.1
      micromark-util-sanitize-uri: 2.0.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-extension-gfm-strikethrough@2.1.0:
    dependencies:
      devlop: 1.1.0
      micromark-util-chunked: 2.0.1
      micromark-util-classify-character: 2.0.1
      micromark-util-resolve-all: 2.0.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-extension-gfm-table@2.1.2:
    dependencies:
      devlop: 1.1.0
      micromark-factory-space: 2.1.0
      micromark-util-character: 2.1.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-extension-gfm-tagfilter@2.0.0:
    dependencies:
      micromark-util-types: 2.0.3

  micromark-extension-gfm-task-list-item@2.1.0:
    dependencies:
      devlop: 1.1.0
      micromark-factory-space: 2.1.0
      micromark-util-character: 2.1.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-extension-gfm@3.0.0:
    dependencies:
      micromark-extension-gfm-autolink-literal: 2.1.0
      micromark-extension-gfm-footnote: 2.1.0
      micromark-extension-gfm-strikethrough: 2.1.0
      micromark-extension-gfm-table: 2.1.2
      micromark-extension-gfm-tagfilter: 2.0.0
      micromark-extension-gfm-task-list-item: 2.1.0
      micromark-util-combine-extensions: 2.0.1
      micromark-util-types: 2.0.3

  micromark-factory-destination@2.0.1:
    dependencies:
      micromark-util-character: 2.1.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-factory-label@2.0.1:
    dependencies:
      devlop: 1.1.0
      micromark-util-character: 2.1.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-factory-space@2.1.0:
    dependencies:
      micromark-util-character: 2.1.1
      micromark-util-types: 2.0.3

  micromark-factory-title@2.0.1:
    dependencies:
      micromark-factory-space: 2.1.0
      micromark-util-character: 2.1.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-factory-whitespace@2.0.1:
    dependencies:
      micromark-factory-space: 2.1.0
      micromark-util-character: 2.1.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-util-character@2.1.1:
    dependencies:
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-util-chunked@2.0.1:
    dependencies:
      micromark-util-symbol: 2.0.1

  micromark-util-classify-character@2.0.1:
    dependencies:
      micromark-util-character: 2.1.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-util-combine-extensions@2.0.1:
    dependencies:
      micromark-util-chunked: 2.0.1
      micromark-util-types: 2.0.3

  micromark-util-decode-numeric-character-reference@2.0.2:
    dependencies:
      micromark-util-symbol: 2.0.1

  micromark-util-decode-string@2.0.1:
    dependencies:
      decode-named-character-reference: 1.3.0
      micromark-util-character: 2.1.1
      micromark-util-decode-numeric-character-reference: 2.0.2
      micromark-util-symbol: 2.0.1

  micromark-util-edit-map@1.0.0:
    dependencies:
      micromark-util-types: 2.0.3

  micromark-util-encode@2.0.1: {}

  micromark-util-html-tag-name@2.0.1: {}

  micromark-util-normalize-identifier@2.0.1:
    dependencies:
      micromark-util-symbol: 2.0.1

  micromark-util-resolve-all@2.0.1:
    dependencies:
      micromark-util-types: 2.0.3

  micromark-util-sanitize-uri@2.0.1:
    dependencies:
      micromark-util-character: 2.1.1
      micromark-util-encode: 2.0.1
      micromark-util-symbol: 2.0.1

  micromark-util-subtokenize@2.1.0:
    dependencies:
      devlop: 1.1.0
      micromark-util-chunked: 2.0.1
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3

  micromark-util-symbol@2.0.1: {}

  micromark-util-types@2.0.3: {}

  micromark@4.0.3:
    dependencies:
      '@types/debug': 4.1.13
      debug: 4.4.3
      decode-named-character-reference: 1.3.0
      devlop: 1.1.0
      micromark-core-commonmark: 2.0.4
      micromark-factory-space: 2.1.0
      micromark-util-character: 2.1.1
      micromark-util-chunked: 2.0.1
      micromark-util-combine-extensions: 2.0.1
      micromark-util-decode-numeric-character-reference: 2.0.2
      micromark-util-edit-map: 1.0.0
      micromark-util-encode: 2.0.1
      micromark-util-normalize-identifier: 2.0.1
      micromark-util-resolve-all: 2.0.1
      micromark-util-sanitize-uri: 2.0.1
      micromark-util-subtokenize: 2.1.0
      micromark-util-symbol: 2.0.1
      micromark-util-types: 2.0.3
    transitivePeerDependencies:
      - supports-color

  micromatch@4.0.8:
    dependencies:
      braces: 3.0.3
      picomatch: 2.3.2

  mime-db@1.52.0: {}

  mime-db@1.54.0: {}

  mime-types@2.1.35:
    dependencies:
      mime-db: 1.52.0

  mime-types@3.0.2:
    dependencies:
      mime-db: 1.54.0

  minimizer-webpack-plugin@5.12.0(postcss@8.5.28)(webpack@5.111.1):
    dependencies:
      '@jridgewell/trace-mapping': 0.3.31
      jest-worker: 27.5.1
      schema-utils: 4.5.0
      terser: 5.51.2
      webpack: 5.111.1(postcss@8.5.28)(webpack-cli@7.2.3)
    optionalDependencies:
      postcss: 8.5.28

  ms@2.0.0: {}

  ms@2.1.3: {}

  multer@2.4.0:
    dependencies:
      append-field: 1.0.0
      busboy: 1.6.0
      type-is: 1.6.18

  multicast-dns@7.2.5:
    dependencies:
      dns-packet: 5.6.1
      thunky: 1.1.0

  nanoid@3.3.19: {}

  negotiator@0.6.3: {}

  negotiator@0.6.4: {}

  negotiator@1.1.0:
    dependencies:
      content-type: 2.1.0

  next-tick@1.1.0: {}

  no-case@3.0.4:
    dependencies:
      lower-case: 2.0.2
      tslib: 2.8.1

  node-releases@2.0.57: {}

  nth-check@2.1.1:
    dependencies:
      boolbase: 1.0.0

  object-inspect@1.13.4: {}

  obug@2.2.1: {}

  on-finished@2.4.1:
    dependencies:
      ee-first: 1.1.1

  on-headers@1.1.0: {}

  once@1.4.0:
    dependencies:
      wrappy: 1.0.2

  open@11.0.4:
    dependencies:
      default-browser: 5.5.1
      define-lazy-prop: 3.0.0
      is-in-ssh: 1.0.0
      is-inside-container: 1.0.0
      powershell-utils: 0.2.1
      wsl-utils: 1.0.0

  option@0.2.4: {}

  oxlint@1.86.0:
    optionalDependencies:
      '@oxlint/binding-android-arm-eabi': 1.86.0
      '@oxlint/binding-android-arm64': 1.86.0
      '@oxlint/binding-darwin-arm64': 1.86.0
      '@oxlint/binding-darwin-x64': 1.86.0
      '@oxlint/binding-freebsd-x64': 1.86.0
      '@oxlint/binding-linux-arm-gnueabihf': 1.86.0
      '@oxlint/binding-linux-arm-musleabihf': 1.86.0
      '@oxlint/binding-linux-arm64-gnu': 1.86.0
      '@oxlint/binding-linux-arm64-musl': 1.86.0
      '@oxlint/binding-linux-ppc64-gnu': 1.86.0
      '@oxlint/binding-linux-riscv64-gnu': 1.86.0
      '@oxlint/binding-linux-riscv64-musl': 1.86.0
      '@oxlint/binding-linux-s390x-gnu': 1.86.0
      '@oxlint/binding-linux-x64-gnu': 1.86.0
      '@oxlint/binding-linux-x64-musl': 1.86.0
      '@oxlint/binding-openharmony-arm64': 1.86.0
      '@oxlint/binding-win32-arm64-msvc': 1.86.0
      '@oxlint/binding-win32-ia32-msvc': 1.86.0
      '@oxlint/binding-win32-x64-msvc': 1.86.0

  p-limit@2.3.0:
    dependencies:
      p-try: 2.2.0

  p-limit@3.1.0:
    dependencies:
      yocto-queue: 0.1.0

  p-locate@4.1.0:
    dependencies:
      p-limit: 2.3.0

  p-locate@5.0.0:
    dependencies:
      p-limit: 3.1.0

  p-retry@8.0.1:
    dependencies:
      is-network-error: 1.3.2

  p-try@2.2.0: {}

  pako@1.0.11: {}

  param-case@3.0.4:
    dependencies:
      dot-case: 3.0.4
      tslib: 2.8.1

  parse-entities@4.0.2:
    dependencies:
      '@types/unist': 2.0.11
      character-entities-legacy: 3.0.0
      character-reference-invalid: 2.0.1
      decode-named-character-reference: 1.3.0
      is-alphanumerical: 2.0.1
      is-decimal: 2.0.1
      is-hexadecimal: 2.0.1

  parseurl@1.3.3: {}

  pascal-case@3.1.2:
    dependencies:
      no-case: 3.0.4
      tslib: 2.8.1

  path-exists@4.0.0: {}

  path-key@3.1.1: {}

  path-parse@1.0.7: {}

  path-to-regexp@8.4.2: {}

  path-webpack@0.0.3: {}

  pdf-parse@2.4.5:
    dependencies:
      '@napi-rs/canvas': 0.1.80
      pdfjs-dist: 5.4.296

  pdfjs-dist@5.4.296:
    optionalDependencies:
      '@napi-rs/canvas': 0.1.80

  picocolors@1.1.1: {}

  picomatch@2.3.2: {}

  picomatch@4.0.7: {}

  pkg-dir@4.2.0:
    dependencies:
      find-up: 4.1.0

  pkijs@3.4.1:
    dependencies:
      '@noble/hashes': 1.8.0
      asn1js: 3.0.10
      bytestreamjs: 2.0.1
      pvtsutils: 1.3.6
      pvutils: 1.2.0
      tslib: 2.8.1

  postcss-modules-extract-imports@3.1.0(postcss@8.5.28):
    dependencies:
      postcss: 8.5.28

  postcss-modules-local-by-default@4.2.0(postcss@8.5.28):
    dependencies:
      icss-utils: 5.1.0(postcss@8.5.28)
      postcss: 8.5.28
      postcss-selector-parser: 7.1.6
      postcss-value-parser: 4.2.0

  postcss-modules-scope@3.2.1(postcss@8.5.28):
    dependencies:
      postcss: 8.5.28
      postcss-selector-parser: 7.1.6

  postcss-modules-values@4.0.0(postcss@8.5.28):
    dependencies:
      icss-utils: 5.1.0(postcss@8.5.28)
      postcss: 8.5.28

  postcss-selector-parser@7.1.6:
    dependencies:
      cssesc: 3.0.0
      util-deprecate: 1.0.2

  postcss-value-parser@4.2.0: {}

  postcss@8.5.28:
    dependencies:
      nanoid: 3.3.19
      picocolors: 1.1.1
      source-map-js: 1.2.1

  powershell-utils@0.1.0: {}

  powershell-utils@0.2.1: {}

  pretty-error@4.0.0:
    dependencies:
      lodash: 4.18.1
      renderkid: 3.0.0

  process-nextick-args@2.0.1: {}

  property-information@7.2.0: {}

  proxy-addr@2.0.8:
    dependencies:
      forwarded: 0.2.0
      ipaddr.js: 1.9.1

  pvtsutils@1.3.6:
    dependencies:
      tslib: 2.8.1

  pvutils@1.2.0: {}

  qs@6.16.0:
    dependencies:
      es-define-property: 1.0.1
      side-channel: 1.1.1

  range-parser@1.3.0: {}

  raw-body@3.0.2:
    dependencies:
      bytes: 3.1.2
      http-errors: 2.0.1
      iconv-lite: 0.7.3
      unpipe: 1.0.0

  react-dom@19.3.0(react@19.3.0):
    dependencies:
      react: 19.3.0
      scheduler: 0.28.0

  react-markdown@10.1.0(@types/react@19.3.0)(react@19.3.0):
    dependencies:
      '@types/hast': 3.0.5
      '@types/mdast': 4.0.4
      '@types/react': 19.3.0
      devlop: 1.1.0
      hast-util-to-jsx-runtime: 2.3.6
      html-url-attributes: 3.0.1
      mdast-util-to-hast: 13.2.1
      react: 19.3.0
      remark-parse: 11.0.0
      remark-rehype: 11.1.2
      unified: 11.0.5
      unist-util-visit: 5.1.0
      vfile: 6.0.3
    transitivePeerDependencies:
      - supports-color

  react@19.3.0: {}

  readable-stream@2.3.8:
    dependencies:
      core-util-is: 1.0.3
      inherits: 2.0.4
      isarray: 1.0.0
      process-nextick-args: 2.0.1
      safe-buffer: 5.1.2
      string_decoder: 1.1.1
      util-deprecate: 1.0.2

  readdirp@5.1.1: {}

  rechoir@0.8.0:
    dependencies:
      resolve: 1.22.12

  reflect-metadata@0.2.2: {}

  regenerate-unicode-properties@10.3.0:
    dependencies:
      regenerate: 1.4.2

  regenerate@1.4.2: {}

  regexpu-core@6.5.2:
    dependencies:
      regenerate: 1.4.2
      regenerate-unicode-properties: 10.3.0
      regjsgen: 0.8.0
      regjsparser: 0.13.3
      unicode-match-property-ecmascript: 2.0.0
      unicode-match-property-value-ecmascript: 2.2.1

  regjsgen@0.8.0: {}

  regjsparser@0.13.3:
    dependencies:
      jsesc: 3.1.0

  rehype-highlight@7.0.2:
    dependencies:
      '@types/hast': 3.0.5
      hast-util-to-text: 4.0.2
      lowlight: 3.3.0
      unist-util-visit: 5.1.0
      vfile: 6.0.3

  rehype-sanitize@6.0.0:
    dependencies:
      '@types/hast': 3.0.5
      hast-util-sanitize: 5.0.2

  relateurl@0.2.7: {}

  remark-gfm@4.0.1:
    dependencies:
      '@types/mdast': 4.0.4
      mdast-util-gfm: 3.1.0
      micromark-extension-gfm: 3.0.0
      remark-parse: 11.0.0
      remark-stringify: 11.0.0
      unified: 11.0.5
    transitivePeerDependencies:
      - supports-color

  remark-parse@11.0.0:
    dependencies:
      '@types/mdast': 4.0.4
      mdast-util-from-markdown: 2.0.3
      micromark-util-types: 2.0.3
      unified: 11.0.5
    transitivePeerDependencies:
      - supports-color

  remark-rehype@11.1.2:
    dependencies:
      '@types/hast': 3.0.5
      '@types/mdast': 4.0.4
      mdast-util-to-hast: 13.2.1
      unified: 11.0.5
      vfile: 6.0.3

  remark-stringify@11.0.0:
    dependencies:
      '@types/mdast': 4.0.4
      mdast-util-to-markdown: 2.1.3
      unified: 11.0.5

  renderkid@3.0.0:
    dependencies:
      css-select: 4.3.0
      dom-converter: 0.2.0
      htmlparser2: 6.1.0
      lodash: 4.18.1
      strip-ansi: 6.0.1

  require-from-string@2.0.2: {}

  resolve-cwd@3.0.0:
    dependencies:
      resolve-from: 5.0.0

  resolve-from@5.0.0: {}

  resolve@1.22.12:
    dependencies:
      es-errors: 1.3.0
      is-core-module: 2.17.0
      path-parse: 1.0.7
      supports-preserve-symlinks-flag: 1.0.0

  router@2.2.0:
    dependencies:
      debug: 4.4.3
      depd: 2.0.0
      is-promise: 4.0.0
      parseurl: 1.3.3
      path-to-regexp: 8.4.2
    transitivePeerDependencies:
      - supports-color

  run-applescript@7.1.0: {}

  rxjs@7.8.2:
    dependencies:
      tslib: 2.8.1

  safe-buffer@5.1.2: {}

  safe-buffer@5.2.1: {}

  safer-buffer@2.1.2: {}

  scheduler@0.28.0: {}

  schema-utils@4.5.0:
    dependencies:
      '@types/json-schema': 7.0.15
      ajv: 8.20.0
      ajv-formats: 3.0.1(ajv@8.20.0)
      ajv-keywords: 5.1.0(ajv@8.20.0)

  selfsigned@5.5.0:
    dependencies:
      '@peculiar/x509': 1.14.3
      pkijs: 3.4.1

  semver@7.8.5: {}

  send@1.2.1:
    dependencies:
      debug: 4.4.3
      encodeurl: 2.0.0
      escape-html: 1.0.3
      etag: 1.8.1
      fresh: 2.0.0
      http-errors: 2.0.1
      mime-types: 3.0.2
      ms: 2.1.3
      on-finished: 2.4.1
      range-parser: 1.3.0
      statuses: 2.0.2
    transitivePeerDependencies:
      - supports-color

  serve-index@1.9.2:
    dependencies:
      accepts: 1.3.8
      batch: 0.6.1
      debug: 2.6.9
      escape-html: 1.0.3
      http-errors: 1.8.1
      mime-types: 2.1.35
      parseurl: 1.3.3
    transitivePeerDependencies:
      - supports-color

  serve-static@2.2.1:
    dependencies:
      encodeurl: 2.0.0
      escape-html: 1.0.3
      parseurl: 1.3.3
      send: 1.2.1
    transitivePeerDependencies:
      - supports-color

  setimmediate@1.0.5: {}

  setprototypeof@1.2.0: {}

  shallow-clone@3.0.1:
    dependencies:
      kind-of: 6.0.3

  shebang-command@2.0.0:
    dependencies:
      shebang-regex: 3.0.0

  shebang-regex@3.0.0: {}

  shell-quote@1.11.0: {}

  shell-quote@1.9.0: {}

  side-channel-list@1.0.1:
    dependencies:
      es-errors: 1.3.0
      object-inspect: 1.13.4

  side-channel-map@1.0.1:
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
      object-inspect: 1.13.4

  side-channel-weakmap@1.0.2:
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
      object-inspect: 1.13.4
      side-channel-map: 1.0.1

  side-channel@1.1.1:
    dependencies:
      es-errors: 1.3.0
      object-inspect: 1.13.4
      side-channel-list: 1.0.1
      side-channel-map: 1.0.1
      side-channel-weakmap: 1.0.2

  source-map-js@1.2.1: {}

  source-map-support@0.5.21:
    dependencies:
      buffer-from: 1.1.2
      source-map: 0.6.1

  source-map@0.6.1: {}

  space-separated-tokens@2.0.2: {}

  sprintf-js@1.0.3: {}

  statuses@1.5.0: {}

  statuses@2.0.2: {}

  streamsearch@1.1.0: {}

  string-width@7.2.0:
    dependencies:
      emoji-regex: 10.6.0
      get-east-asian-width: 1.7.0
      strip-ansi: 7.2.0

  string_decoder@1.1.1:
    dependencies:
      safe-buffer: 5.1.2

  stringify-entities@4.0.4:
    dependencies:
      character-entities-html4: 2.1.0
      character-entities-legacy: 3.0.0

  strip-ansi@6.0.1:
    dependencies:
      ansi-regex: 5.0.1

  strip-ansi@7.2.0:
    dependencies:
      ansi-regex: 6.4.0

  style-loader@4.0.0(webpack@5.111.1):
    dependencies:
      webpack: 5.111.1(postcss@8.5.28)(webpack-cli@7.2.3)

  style-to-js@1.1.21:
    dependencies:
      style-to-object: 1.0.14

  style-to-object@1.0.14:
    dependencies:
      inline-style-parser: 0.2.7

  supports-color@10.2.2: {}

  supports-color@8.1.1:
    dependencies:
      has-flag: 4.0.0

  supports-preserve-symlinks-flag@1.0.0: {}

  tapable@2.3.3: {}

  terser@5.51.2:
    dependencies:
      '@jridgewell/source-map': 0.3.11
      acorn: 8.18.0
      commander: 2.20.3
      source-map-support: 0.5.21

  thingies@2.6.1(tslib@2.8.1):
    dependencies:
      tslib: 2.8.1

  thunky@1.1.0: {}

  tinyglobby@0.2.17:
    dependencies:
      fdir: 6.5.0(picomatch@4.0.7)
      picomatch: 4.0.7

  to-regex-range@5.0.1:
    dependencies:
      is-number: 7.0.0

  toidentifier@1.0.1: {}

  tree-dump@1.1.0(tslib@2.8.1):
    dependencies:
      tslib: 2.8.1

  tree-kill@1.2.2: {}

  trim-lines@3.0.1: {}

  trough@2.2.0: {}

  tslib@1.14.1: {}

  tslib@2.8.1: {}

  tsx@4.23.15:
    dependencies:
      esbuild: 0.28.2
    optionalDependencies:
      fsevents: 2.3.3

  tsyringe@4.10.0:
    dependencies:
      tslib: 1.14.1

  type-is@1.6.18:
    dependencies:
      media-typer: 0.3.0
      mime-types: 2.1.35

  type-is@2.1.0:
    dependencies:
      content-type: 2.1.0
      media-typer: 1.1.1
      mime-types: 3.0.2

  type@2.7.3: {}

  typescript@6.0.3: {}

  underscore@1.13.8: {}

  undici-types@7.24.6: {}

  unicode-canonical-property-names-ecmascript@2.0.1: {}

  unicode-match-property-ecmascript@2.0.0:
    dependencies:
      unicode-canonical-property-names-ecmascript: 2.0.1
      unicode-property-aliases-ecmascript: 2.2.0

  unicode-match-property-value-ecmascript@2.2.1: {}

  unicode-property-aliases-ecmascript@2.2.0: {}

  unified@11.0.5:
    dependencies:
      '@types/unist': 3.0.3
      bail: 2.0.2
      devlop: 1.1.0
      extend: 3.0.2
      is-plain-obj: 4.1.0
      trough: 2.2.0
      vfile: 6.0.3

  unist-util-find-after@5.0.0:
    dependencies:
      '@types/unist': 3.0.3
      unist-util-is: 6.0.1

  unist-util-is@6.0.1:
    dependencies:
      '@types/unist': 3.0.3

  unist-util-position@5.0.0:
    dependencies:
      '@types/unist': 3.0.3

  unist-util-stringify-position@4.0.0:
    dependencies:
      '@types/unist': 3.0.3

  unist-util-visit-parents@6.0.2:
    dependencies:
      '@types/unist': 3.0.3
      unist-util-is: 6.0.1

  unist-util-visit@5.1.0:
    dependencies:
      '@types/unist': 3.0.3
      unist-util-is: 6.0.1
      unist-util-visit-parents: 6.0.2

  unpipe@1.0.0: {}

  update-browserslist-db@1.3.3(browserslist@4.29.3):
    dependencies:
      browserslist: 4.29.3
      escalade: 3.2.0
      picocolors: 1.1.1

  util-deprecate@1.0.2: {}

  utila@0.4.0: {}

  vary@1.1.2: {}

  verkit@0.3.2: {}

  vfile-message@4.0.3:
    dependencies:
      '@types/unist': 3.0.3
      unist-util-stringify-position: 4.0.0

  vfile@6.0.3:
    dependencies:
      '@types/unist': 3.0.3
      vfile-message: 4.0.3

  watchpack@2.5.2:
    dependencies:
      graceful-fs: 4.2.11

  webpack-cli@7.2.3(json5@2.2.3)(webpack-dev-server@6.0.0)(webpack@5.111.1):
    dependencies:
      '@discoveryjs/json-ext': 1.1.0
      commander: 14.0.3
      cross-spawn: 7.0.6
      envinfo: 7.21.0
      import-local: 3.2.0
      interpret: 3.1.1
      rechoir: 0.8.0
      webpack: 5.111.1(postcss@8.5.28)(webpack-cli@7.2.3)
      webpack-merge: 6.0.1
    optionalDependencies:
      json5: 2.2.3
      webpack-dev-server: 6.0.0(webpack-cli@7.2.3)(webpack@5.111.1)

  webpack-dev-middleware@8.3.0(webpack@5.111.1):
    dependencies:
      ansi-html-community: 0.0.8
      memfs: 4.80.0
      mime-types: 3.0.2
      range-parser: 1.3.0
      schema-utils: 4.5.0
    optionalDependencies:
      webpack: 5.111.1(postcss@8.5.28)(webpack-cli@7.2.3)

  webpack-dev-server@6.0.0(webpack-cli@7.2.3)(webpack@5.111.1):
    dependencies:
      '@types/bonjour': 3.5.13
      '@types/connect-history-api-fallback': 1.5.4
      '@types/express': 5.0.6
      '@types/express-serve-static-core': 5.1.3
      '@types/serve-index': 1.9.4
      '@types/serve-static': 2.2.0
      '@types/ws': 8.18.2
      ansi-html-community: 0.0.8
      bonjour-service: 1.4.4
      chokidar: 5.0.0
      compression: 1.8.2
      connect-history-api-fallback: 2.0.0
      express: 5.2.1
      graceful-fs: 4.2.11
      http-proxy-middleware: 4.2.0
      ipaddr.js: 2.5.0
      launch-editor: 2.14.1
      open: 11.0.4
      p-retry: 8.0.1
      schema-utils: 4.5.0
      selfsigned: 5.5.0
      serve-index: 1.9.2
      tinyglobby: 0.2.17
      webpack-dev-middleware: 8.3.0(webpack@5.111.1)
      ws: 8.22.0
    optionalDependencies:
      webpack: 5.111.1(postcss@8.5.28)(webpack-cli@7.2.3)
      webpack-cli: 7.2.3(json5@2.2.3)(webpack-dev-server@6.0.0)(webpack@5.111.1)
    transitivePeerDependencies:
      - bufferutil
      - supports-color
      - utf-8-validate

  webpack-merge@6.0.1:
    dependencies:
      clone-deep: 4.0.1
      flat: 5.0.2
      wildcard: 2.0.1

  webpack-sources@3.6.0: {}

  webpack@5.111.1(postcss@8.5.28)(webpack-cli@7.2.3):
    dependencies:
      '@types/estree': 1.0.9
      '@types/json-schema': 7.0.15
      '@webassemblyjs/ast': 1.14.1
      '@webassemblyjs/wasm-edit': 1.14.1
      '@webassemblyjs/wasm-parser': 1.14.1
      browserslist: 4.29.3
      chrome-trace-event: 1.0.4
      enhanced-resolve: 5.26.0
      es-module-lexer: 2.3.2
      events: 3.3.0
      graceful-fs: 4.2.11
      mime-db: 1.54.0
      minimizer-webpack-plugin: 5.12.0(postcss@8.5.28)(webpack@5.111.1)
      schema-utils: 4.5.0
      tapable: 2.3.3
      watchpack: 2.5.2
      webpack-sources: 3.6.0
    optionalDependencies:
      webpack-cli: 7.2.3(json5@2.2.3)(webpack-dev-server@6.0.0)(webpack@5.111.1)
    transitivePeerDependencies:
      - '@minify-html/node'
      - '@napi-rs/image'
      - '@swc/core'
      - '@swc/css'
      - '@swc/html'
      - clean-css
      - cssnano
      - csso
      - esbuild
      - html-minifier-terser
      - imagemin
      - lightningcss
      - postcss
      - sharp
      - svgo
      - uglify-js

  which@2.0.2:
    dependencies:
      isexe: 2.0.0

  wildcard@2.0.1: {}

  wrap-ansi@9.0.2:
    dependencies:
      ansi-styles: 6.2.3
      string-width: 7.2.0
      strip-ansi: 7.2.0

  wrappy@1.0.2: {}

  ws@8.22.0: {}

  wsl-utils@1.0.0:
    dependencies:
      is-wsl: 3.1.1
      powershell-utils: 0.1.0

  xmlbuilder@10.1.1: {}

  y18n@5.0.8: {}

  yargs-parser@22.0.0: {}

  yargs@18.0.0:
    dependencies:
      cliui: 9.0.1
      escalade: 3.2.0
      get-caller-file: 2.0.5
      string-width: 7.2.0
      y18n: 5.0.8
      yargs-parser: 22.0.0

  yocto-queue@0.1.0: {}

  zwitch@2.0.4: {}
````

## File: public/favicon.svg

````xml
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="46" fill="none" viewBox="0 0 48 46"><path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" style="fill:#863bff;fill:color(display-p3 .5252 .23 1);fill-opacity:1"/><mask id="a" width="48" height="46" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M25.842 44.938c-.664.844-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.183c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.498 0-3.579-1.842-3.579H1.133c-.92 0-1.456-1.04-.92-1.787L9.91.473c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.578 1.842 3.578h11.377c.943 0 1.473 1.088.89 1.832L25.843 44.94z" style="fill:#000;fill-opacity:1"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#ede6ff" rx="5.508" ry="14.704" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -4.47 31.516)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#ede6ff" rx="10.399" ry="29.851" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -39.328 7.883)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#7e14ff" rx="5.508" ry="30.487" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -25.913 -14.639)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -32.644 -3.334)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -34.34 30.47)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#ede6ff" rx="14.072" ry="22.078" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="rotate(93.35 24.506 48.493)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx=".387" cy="8.972" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(39.51 .387 8.972)"/></g><g filter="url(#k)"><ellipse cx="47.523" cy="-6.092" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 47.523 -6.092)"/></g><g filter="url(#l)"><ellipse cx="41.412" cy="6.333" fill="#47bfff" rx="5.971" ry="9.665" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 41.412 6.333)"/></g><g filter="url(#m)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#n)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#o)"><ellipse cx="35.651" cy="29.907" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 35.651 29.907)"/></g><g filter="url(#p)"><ellipse cx="38.418" cy="32.4" fill="#47bfff" rx="5.971" ry="15.297" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 38.418 32.4)"/></g></g><defs><filter id="b" width="60.045" height="41.654" x="-19.77" y="16.149" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-54.613" y="-7.533" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-49.64" y="2.03" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-45.045" y="20.029" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-43.513" y="21.178" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="15.756" y="-17.901" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-27.636" y="-22.853" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="20.116" y="-38.415" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="24.641" y="-11.323" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="8.244" y="-2.416" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="18.713" y="10.588" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter></defs></svg>
````

## File: public/icons.svg

````xml
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="bluesky-icon" viewBox="0 0 16 17">
    <g clip-path="url(#bluesky-clip)"><path fill="#08060d" d="M7.75 7.735c-.693-1.348-2.58-3.86-4.334-5.097-1.68-1.187-2.32-.981-2.74-.79C.188 2.065.1 2.812.1 3.251s.241 3.602.398 4.13c.52 1.744 2.367 2.333 4.07 2.145-2.495.37-4.71 1.278-1.805 4.512 3.196 3.309 4.38-.71 4.987-2.746.608 2.036 1.307 5.91 4.93 2.746 2.72-2.746.747-4.143-1.747-4.512 1.702.189 3.55-.4 4.07-2.145.156-.528.397-3.691.397-4.13s-.088-1.186-.575-1.406c-.42-.19-1.06-.395-2.741.79-1.755 1.24-3.64 3.752-4.334 5.099"/></g>
    <defs><clipPath id="bluesky-clip"><path fill="#fff" d="M.1.85h15.3v15.3H.1z"/></clipPath></defs>
  </symbol>
  <symbol id="discord-icon" viewBox="0 0 20 19">
    <path fill="#08060d" d="M16.224 3.768a14.5 14.5 0 0 0-3.67-1.153c-.158.286-.343.67-.47.976a13.5 13.5 0 0 0-4.067 0c-.128-.306-.317-.69-.476-.976A14.4 14.4 0 0 0 3.868 3.77C1.546 7.28.916 10.703 1.231 14.077a14.7 14.7 0 0 0 4.5 2.306q.545-.748.965-1.587a9.5 9.5 0 0 1-1.518-.74q.191-.14.372-.293c2.927 1.369 6.107 1.369 8.999 0q.183.152.372.294-.723.437-1.52.74.418.838.963 1.588a14.6 14.6 0 0 0 4.504-2.308c.37-3.911-.63-7.302-2.644-10.309m-9.13 8.234c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.894 0 1.614.82 1.599 1.82.001 1-.705 1.82-1.6 1.82m5.91 0c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.893 0 1.614.82 1.599 1.82 0 1-.706 1.82-1.6 1.82"/>
  </symbol>
  <symbol id="documentation-icon" viewBox="0 0 21 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="m15.5 13.333 1.533 1.322c.645.555.967.833.967 1.178s-.322.623-.967 1.179L15.5 18.333m-3.333-5-1.534 1.322c-.644.555-.966.833-.966 1.178s.322.623.966 1.179l1.534 1.321"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M17.167 10.836v-4.32c0-1.41 0-2.117-.224-2.68-.359-.906-1.118-1.621-2.08-1.96-.599-.21-1.349-.21-2.848-.21-2.623 0-3.935 0-4.983.369-1.684.591-3.013 1.842-3.641 3.428C3 6.449 3 7.684 3 10.154v2.122c0 2.558 0 3.838.706 4.726q.306.383.713.671c.76.536 1.79.64 3.581.66"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M3 10a2.78 2.78 0 0 1 2.778-2.778c.555 0 1.209.097 1.748-.047.48-.129.854-.503.982-.982.145-.54.048-1.194.048-1.749a2.78 2.78 0 0 1 2.777-2.777"/>
  </symbol>
  <symbol id="github-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clip-rule="evenodd"/>
  </symbol>
  <symbol id="social-icon" viewBox="0 0 20 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M12.5 6.667a4.167 4.167 0 1 0-8.334 0 4.167 4.167 0 0 0 8.334 0"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M2.5 16.667a5.833 5.833 0 0 1 8.75-5.053m3.837.474.513 1.035c.07.144.257.282.414.309l.93.155c.596.1.736.536.307.965l-.723.73a.64.64 0 0 0-.152.531l.207.903c.164.715-.213.991-.84.618l-.872-.52a.63.63 0 0 0-.577 0l-.872.52c-.624.373-1.003.094-.84-.618l.207-.903a.64.64 0 0 0-.152-.532l-.723-.729c-.426-.43-.289-.864.306-.964l.93-.156a.64.64 0 0 0 .412-.31l.513-1.034c.28-.562.735-.562 1.012 0"/>
  </symbol>
  <symbol id="x-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clip-rule="evenodd"/>
  </symbol>
</svg>
````

## File: render.yaml

````yaml
services:
  - type: web
    name: study-library
    runtime: node
    plan: free
    buildCommand: corepack enable && pnpm install --frozen-lockfile && pnpm build
    startCommand: pnpm serve
    healthCheckPath: /api/health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: STORAGE_MODE
        value: supabase
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: SUPABASE_STORAGE_BUCKET
        value: study-library
      - key: LIBRARY_ACCESS_PASSWORD
        sync: false
      - key: SESSION_SECRET
        sync: false
      - key: MAX_UPLOAD_BYTES
        value: '104857600'
      - key: API_ORIGIN
        sync: false
      - key: AI_BASE_URL
        sync: false
      - key: AI_API_KEY
        sync: false
      - key: AI_MODEL
        value: gpt-4o-mini
````

## File: src/App.css

````css
:root {
  --paper: #f4f0e7;
  --paper-raised: #fffdf8;
  --ink: #1d2523;
  --muted: #71807a;
  --line: rgba(29, 37, 35, 0.12);
  --line-strong: rgba(29, 37, 35, 0.2);
  --accent: #e66d43;
  --accent-soft: rgba(230, 109, 67, 0.13);
  --teal: #1e6b68;
  --teal-soft: rgba(30, 107, 104, 0.13);
  --shadow: 0 24px 70px rgba(43, 45, 32, 0.14);
  --shadow-small: 0 10px 28px rgba(43, 45, 32, 0.1);
  --code: #212a2a;
  --surface-radius: 18px;
}

:root[data-theme='dark'] {
  --paper: #111917;
  --paper-raised: #182321;
  --ink: #ebefe5;
  --muted: #91a19a;
  --line: rgba(235, 239, 229, 0.1);
  --line-strong: rgba(235, 239, 229, 0.18);
  --accent: #ef825a;
  --accent-soft: rgba(239, 130, 90, 0.14);
  --teal: #6bb7a4;
  --teal-soft: rgba(107, 183, 164, 0.13);
  --shadow: 0 30px 90px rgba(0, 0, 0, 0.28);
  --shadow-small: 0 12px 32px rgba(0, 0, 0, 0.22);
  --code: #0e1514;
}

* { box-sizing: border-box; }

button, input { font: inherit; }
button { cursor: pointer; }

.auth-shell { min-height: 100svh; position: relative; display: grid; place-items: center; overflow: hidden; padding: 24px; color: var(--ink); background: var(--paper); isolation: isolate; }
.auth-shell::before { content: ''; position: absolute; inset: 0; z-index: -1; opacity: 0.55; background-image: linear-gradient(rgba(30, 107, 104, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 107, 104, 0.07) 1px, transparent 1px); background-size: 48px 48px; mask-image: linear-gradient(to bottom right, black, transparent 82%); }
.auth-panel { width: min(430px, 100%); padding: 34px; border: 1px solid var(--line-strong); border-radius: var(--surface-radius); background: color-mix(in srgb, var(--paper-raised) 92%, transparent); box-shadow: var(--shadow); animation: rise-in 620ms both cubic-bezier(.2,.8,.2,1); }
.auth-panel .brand-mark { margin-bottom: 28px; }
.auth-panel h1 { margin: 9px 0 10px; font: 700 clamp(30px, 7vw, 45px)/0.98 'Fraunces', Georgia, serif; letter-spacing: -0.045em; }
.auth-panel > p { margin: 0 0 28px; color: var(--muted); font-size: 13px; line-height: 1.55; }
.auth-panel form { display: grid; gap: 14px; }
.auth-field { display: grid; gap: 7px; color: var(--muted); font: 700 10px 'DM Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; }
.auth-input { display: flex; align-items: center; gap: 9px; min-height: 44px; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 9px; color: var(--teal); background: var(--paper); transition: border-color 180ms ease, box-shadow 180ms ease; }
.auth-input:focus-within { border-color: var(--teal); box-shadow: 0 0 0 4px var(--teal-soft); }
.auth-input input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 14px; letter-spacing: 0; }
.auth-submit { width: 100%; margin-top: 4px; }
.auth-error { display: flex; align-items: center; gap: 7px; margin: 0; color: var(--accent); font-size: 12px; }

.app-shell {
  min-height: 100svh;
  color: var(--ink);
  background: var(--paper);
  position: relative;
  overflow-x: clip;
  isolation: isolate;
}

.ambient-grid {
  position: fixed;
  inset: 0;
  z-index: -1;
  opacity: 0.5;
  background-image: linear-gradient(rgba(30, 107, 104, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 107, 104, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, black, transparent 72%);
  animation: grid-drift 26s linear infinite;
}

.topbar {
  min-height: 78px;
  padding: 18px clamp(18px, 4vw, 64px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--paper) 86%, transparent);
  backdrop-filter: blur(18px);
  position: sticky;
  top: 0;
  z-index: 20;
}

.brand-lockup, .topbar-actions, .rail-heading, .deck-header, .insight-heading, .image-preview-heading, .note-toolbar, .progress-copy, .file-main, .file-actions, .breadcrumb, .toolbar-actions, .note-meta, .note-footer, .image-caption, .next-move { display: flex; align-items: center; }
.brand-lockup { gap: 11px; }
.brand-mark { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 11px; background: var(--teal); color: #eef4e9; box-shadow: 5px 5px 0 rgba(230, 109, 67, 0.35); transform: rotate(-4deg); }
.eyebrow, .section-kicker { font: 700 10px/1.2 'DM Mono', monospace; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin: 0; }
.brand-lockup h1 { margin: 3px 0 0; font: 700 18px/1.1 'Fraunces', Georgia, serif; letter-spacing: -0.02em; }
.topbar-actions { gap: 9px; }
.shell-mode-switch { display: flex; align-items: center; gap: 3px; padding: 3px; border: 1px solid var(--line); border-radius: 9px; background: var(--paper); }
.shell-mode-switch button { min-height: 32px; display: inline-flex; align-items: center; gap: 5px; border: 0; border-radius: 6px; padding: 0 9px; color: var(--muted); background: transparent; font-size: 11px; }
.shell-mode-switch button.is-active { color: var(--ink); background: var(--paper-raised); box-shadow: 0 3px 10px rgba(29, 37, 35, .08); }
.shell-mode-switch button:hover { color: var(--accent); }
.search-box { min-width: min(340px, 39vw); height: 42px; display: flex; align-items: center; gap: 9px; padding: 0 11px; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--paper-raised); color: var(--muted); transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease; }
.search-box:focus-within { border-color: var(--teal); box-shadow: 0 0 0 4px var(--teal-soft); transform: translateY(-1px); }
.search-box input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 13px; }
.search-box input::placeholder { color: var(--muted); }
kbd { padding: 3px 6px; border: 1px solid var(--line); border-radius: 5px; color: var(--muted); font: 10px 'DM Mono', monospace; white-space: nowrap; }
.icon-button, .toolbar-button, .row-action { width: 40px; height: 40px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 10px; background: var(--paper-raised); color: var(--ink); transition: transform 180ms ease, border-color 180ms ease, background 180ms ease; }
.icon-button:hover, .toolbar-button:hover, .row-action:hover { border-color: var(--accent); background: var(--accent-soft); transform: translateY(-2px) rotate(-2deg); }
.icon-button.subtle { width: 34px; height: 34px; background: transparent; }

.workspace { max-width: 1640px; margin: 0 auto; padding: 34px clamp(18px, 4vw, 64px) 60px; display: grid; grid-template-columns: 236px minmax(0, 1fr); gap: clamp(26px, 4vw, 64px); }
.library-rail { min-width: 0; }
.library-rail.is-collapsed { width: 42px; }
.rail-heading { justify-content: space-between; gap: 12px; padding-bottom: 24px; }
.rail-heading h2 { margin: 6px 0 0; font: 700 18px/1.15 'Fraunces', Georgia, serif; overflow-wrap: anywhere; }
.view-tabs { display: grid; gap: 4px; }
.view-tabs button, .category-row, .folder-row { width: 100%; min-height: 38px; display: flex; align-items: center; gap: 9px; border: 0; border-radius: 9px; padding: 0 9px; color: var(--muted); background: transparent; text-align: left; font-size: 12px; transition: color 180ms ease, background 180ms ease, transform 180ms ease; }
.view-tabs button span, .row-count { margin-left: auto; font: 11px 'DM Mono', monospace; color: var(--muted); }
.view-tabs button:hover, .category-row:hover, .folder-row:hover { color: var(--ink); background: var(--accent-soft); transform: none; }
.view-tabs button.is-active, .category-row.is-active { color: var(--ink); background: var(--paper-raised); box-shadow: var(--shadow-small); }
.view-tabs button.is-active svg { color: var(--accent); }
.rail-divider { height: 1px; margin: 22px 0; background: var(--line); }
.rail-section { margin-top: 24px; }
.rail-section-title { display: flex; justify-content: space-between; align-items: center; padding: 0 9px 9px; color: var(--muted); font: 700 10px 'DM Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; }
.count-badge { font-size: 10px; }
.category-row { min-height: 34px; }
.category-swatch { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); margin-left: 2px; }
.category-row:nth-child(3n) .category-swatch { background: var(--teal); box-shadow: 0 0 0 4px var(--teal-soft); }
.category-row:nth-child(4n) .category-swatch { background: #b79550; box-shadow: 0 0 0 4px rgba(183, 149, 80, 0.15); }
.all-swatch { background: var(--teal) !important; box-shadow: 0 0 0 4px var(--teal-soft) !important; }
.folder-list { max-height: 260px; overflow: auto; }
.folder-row { min-height: 32px; }

.content-stage { min-width: 0; transform: translateZ(0); }
.stage-intro { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 24px; animation: rise-in 620ms both cubic-bezier(.2,.8,.2,1); }
.stage-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 8px; }
.stage-intro h2 { max-width: 720px; margin: 8px 0 7px; font: 700 clamp(28px, 4vw, 48px)/0.98 'Fraunces', Georgia, serif; letter-spacing: -0.045em; }
.stage-subtitle { margin: 0; color: var(--muted); font-size: 13px; }
.refresh-button, .upload-button, .text-button, .complete-button, .state-panel button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 40px; border: 1px solid var(--line-strong); border-radius: 9px; padding: 0 13px; color: var(--ink); background: var(--paper-raised); font-size: 12px; transition: transform 180ms ease, border-color 180ms ease, background 180ms ease; white-space: nowrap; text-decoration: none; }
.upload-button { color: #fff9ee; border-color: var(--teal); background: var(--teal); }
.refresh-button:hover, .upload-button:hover, .text-button:hover, .complete-button:hover, .state-panel button:hover { border-color: var(--accent); background: var(--accent-soft); transform: none; }
.upload-button:hover { color: var(--ink); }
.upload-button:disabled, .text-button:disabled { cursor: wait; opacity: 0.6; }
.progress-strip { display: flex; align-items: center; gap: 18px; min-height: 65px; padding: 12px 15px; margin-bottom: 24px; border: 1px solid var(--line); border-radius: 12px; background: color-mix(in srgb, var(--paper-raised) 72%, transparent); animation: rise-in 700ms 80ms both cubic-bezier(.2,.8,.2,1); }
.progress-copy { gap: 10px; min-width: 205px; }
.progress-copy div { display: grid; gap: 2px; }
.progress-copy strong { font-size: 13px; }
.progress-copy span:not(.progress-orbit) { color: var(--muted); font-size: 11px; }
.progress-orbit { width: 30px; height: 30px; display: grid; place-items: center; border: 1px solid var(--teal); border-radius: 50%; position: relative; }
.progress-orbit::before, .progress-orbit::after { content: ''; position: absolute; inset: 5px; border: 1px solid var(--accent); border-radius: 50%; animation: orbit 4s linear infinite; }
.progress-orbit::after { inset: 10px; border-color: var(--teal); animation-direction: reverse; animation-duration: 3s; }
.progress-orbit span { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); }
.progress-track { height: 5px; flex: 1; overflow: hidden; border-radius: 99px; background: var(--line); }
.progress-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--teal), var(--accent)); transition: width 700ms cubic-bezier(.2,.8,.2,1); }
.progress-hint { color: var(--muted); font: 10px 'DM Mono', monospace; white-space: nowrap; }
.content-grid { display: grid; grid-template-columns: minmax(250px, 0.72fr) minmax(380px, 1.3fr); align-items: start; gap: 22px; }
.note-deck, .insight-deck { border: 1px solid var(--line); border-radius: var(--surface-radius); background: color-mix(in srgb, var(--paper-raised) 80%, transparent); box-shadow: var(--shadow-small); }
.note-deck { overflow: hidden; animation: rise-in 740ms 150ms both cubic-bezier(.2,.8,.2,1); }
.deck-header { justify-content: space-between; padding: 18px 18px 15px; border-bottom: 1px solid var(--line); }
.deck-header h3, .insight-heading h3 { margin: 5px 0 0; font: 700 22px/1 'Fraunces', Georgia, serif; letter-spacing: -0.03em; }
.result-count { color: var(--muted); font: 10px 'DM Mono', monospace; }
.file-list { padding: 7px; }
.file-row { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; min-height: 63px; border-radius: 11px; animation: row-reveal 520ms calc(var(--row-index) * 35ms) both cubic-bezier(.2,.8,.2,1); transition: background 180ms ease, transform 180ms ease, box-shadow 180ms ease; }
.file-row:hover { background: var(--accent-soft); transform: none; }
.file-row.is-selected { background: var(--teal-soft); box-shadow: inset 3px 0 var(--teal); }
.file-row.is-completed .file-copy strong { color: var(--muted); text-decoration: line-through; text-decoration-color: var(--teal); }
.file-main { min-width: 0; gap: 10px; align-self: stretch; padding: 9px 8px 9px 10px; color: var(--ink); border: 0; background: transparent; text-align: left; }
.file-icon { flex: 0 0 31px; width: 31px; height: 31px; display: grid; place-items: center; border-radius: 8px; color: var(--accent); background: var(--accent-soft); }
.file-icon.image { color: var(--teal); background: var(--teal-soft); }
.file-icon.pdf { color: #b95a4e; background: rgba(185, 90, 78, 0.13); }
.file-icon.epub { color: var(--teal); background: var(--teal-soft); }
.file-icon.download { color: #8c6d38; background: rgba(183, 149, 80, 0.15); }
.file-icon.text { color: var(--teal); background: var(--teal-soft); }
.file-copy { min-width: 0; display: grid; gap: 4px; }
.file-copy strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 650; }
.file-copy small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted); font-size: 10px; }
.completed-icon { flex: 0 0 auto; color: var(--teal); }
.selected-pulse { width: 5px; height: 5px; margin-left: auto; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 5px var(--accent-soft); animation: pulse 2s ease-in-out infinite; }
.file-actions { gap: 2px; padding-right: 7px; }
.row-action { width: 30px; height: 30px; border: 0; background: transparent; color: var(--muted); }
.file-detail { grid-column: 1 / -1; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 0 12px 12px 51px; color: var(--muted); font-size: 10px; }
.file-detail button { margin-left: auto; border: 0; color: var(--accent); background: transparent; font-size: 10px; }
.asset-divider { display: flex; justify-content: space-between; margin: 12px 8px 3px; padding-top: 13px; border-top: 1px solid var(--line); color: var(--muted); font: 10px 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.1em; }
.state-panel, .reading-state { min-height: 180px; display: grid; place-items: center; align-content: center; gap: 10px; padding: 30px; color: var(--muted); text-align: center; font-size: 13px; }
.state-panel button { min-height: 34px; }
.error-state { color: var(--accent); }
.error-state p { color: var(--muted); }
.loading-orbit { width: 34px; height: 34px; border: 1px solid var(--line-strong); border-top-color: var(--accent); border-right-color: var(--teal); border-radius: 50%; animation: spin 900ms linear infinite; }

.reading-column { min-width: 0; display: grid; gap: 12px; padding-top: 22px; }
.reading-context { min-height: 24px; display: flex; align-items: center; gap: 5px; padding: 0 4px; color: var(--muted); font: 10px 'DM Mono', monospace; letter-spacing: 0.06em; text-transform: uppercase; }
.breadcrumb-link { max-width: 42%; overflow: hidden; padding: 2px 0; border: 0; color: var(--muted); background: transparent; cursor: pointer; font: inherit; text-align: left; text-overflow: ellipsis; white-space: nowrap; }
.breadcrumb-link:hover { color: var(--accent); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
.breadcrumb-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 3px; }
.breadcrumb-separator { flex: 0 0 auto; color: var(--muted); }
.reading-surface { min-height: 640px; position: relative; overflow: hidden; border: 1px solid var(--line-strong); border-radius: var(--surface-radius); background: var(--paper-raised); box-shadow: var(--shadow); }
.reading-surface:hover { box-shadow: 0 30px 90px rgba(30, 107, 104, 0.17); }
.surface-content { min-height: 640px; position: relative; transform: translateZ(8px); transform-style: preserve-3d; }
.surface-glow { position: absolute; inset: 0; pointer-events: none; opacity: 0; background: radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 40%), var(--accent-soft), transparent 38%); transition: opacity 260ms ease; }
.reading-surface:hover .surface-glow { opacity: 0.7; }
.note-toolbar { position: relative; z-index: 1; justify-content: space-between; gap: 12px; padding: 16px 22px; border-bottom: 1px solid var(--line); color: var(--muted); }
.toolbar-actions { gap: 6px; }
.toolbar-button { width: 34px; height: 34px; border-color: var(--line); background: transparent; }
.type-toggle { font: 650 13px 'Fraunces', Georgia, serif; }
.toolbar-status { max-width: 230px; overflow: hidden; color: var(--accent); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.markdown-body { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; padding: 38px clamp(22px, 6vw, 72px) 54px; color: var(--ink); }
.reading-size-large { max-width: 840px; }
.note-meta { flex-wrap: wrap; gap: 10px 14px; margin-bottom: 30px; color: var(--muted); font: 10px 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.06em; }
.note-type { display: inline-flex; align-items: center; gap: 5px; color: var(--accent); }
.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 { color: var(--ink); font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.035em; line-height: 1.04; }
.markdown-body h1 { margin: 0 0 22px; font-size: clamp(34px, 5vw, 57px); }
.markdown-body h2 { margin: 40px 0 12px; font-size: 29px; }
.markdown-body h3 { margin: 28px 0 9px; font-size: 22px; }
.markdown-body p, .markdown-body li { color: color-mix(in srgb, var(--ink) 85%, var(--muted)); font-size: 16px; line-height: 1.78; }
.reading-size-large p, .reading-size-large li { font-size: 18px; }
.markdown-body p { margin: 0 0 18px; }
.markdown-body ul, .markdown-body ol { padding-left: 24px; margin: 9px 0 22px; }
.markdown-body li { padding-left: 4px; margin: 7px 0; }
.markdown-body li::marker { color: var(--accent); }
.markdown-body a { color: var(--teal); text-decoration-thickness: 1px; text-underline-offset: 3px; }
.markdown-body blockquote { margin: 24px 0; padding: 4px 0 4px 18px; border-left: 3px solid var(--accent); color: var(--muted); }
.markdown-body blockquote p { color: inherit; }
.markdown-body code { padding: 2px 5px; border-radius: 4px; color: var(--accent); background: var(--accent-soft); font: 0.86em 'DM Mono', monospace; }
.markdown-body pre { overflow: auto; margin: 22px -14px; padding: 17px; border-radius: 10px; color: #dbe8df; background: var(--code); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06); }
.markdown-body pre code { padding: 0; color: inherit; background: transparent; font-size: 12px; line-height: 1.65; }
.markdown-body table { display: block; overflow: auto; width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 13px; }
.markdown-body th, .markdown-body td { min-width: 120px; padding: 9px 11px; border: 1px solid var(--line-strong); text-align: left; }
.markdown-body th { color: var(--ink); background: var(--accent-soft); }
.markdown-body img { display: block; max-width: 100%; height: auto; margin: 24px auto; border-radius: 8px; border: 1px solid var(--line); box-shadow: var(--shadow-small); }
.note-footer { flex-wrap: wrap; justify-content: space-between; gap: 12px; margin-top: 45px; padding-top: 17px; border-top: 1px solid var(--line); }
.complete-button { min-height: 36px; color: var(--teal); border-color: color-mix(in srgb, var(--teal) 42%, var(--line)); background: var(--teal-soft); }
.complete-button.is-complete { color: var(--paper-raised); border-color: var(--teal); background: var(--teal); }
.footer-path { max-width: 55%; overflow: hidden; color: var(--muted); font: 10px 'DM Mono', monospace; text-overflow: ellipsis; white-space: nowrap; }
.image-preview { position: relative; z-index: 1; padding: 28px; }
.image-preview-heading { justify-content: space-between; align-items: start; gap: 16px; margin-bottom: 22px; }
.image-preview-heading h2 { margin: 7px 0 0; font: 700 clamp(25px, 4vw, 40px)/1 'Fraunces', Georgia, serif; letter-spacing: -0.04em; }
.image-frame { min-height: 430px; display: grid; place-items: center; padding: 20px; border: 1px solid var(--line); border-radius: 12px; background: color-mix(in srgb, var(--teal-soft) 65%, transparent); background-image: linear-gradient(45deg, var(--line) 25%, transparent 25%), linear-gradient(-45deg, var(--line) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--line) 75%), linear-gradient(-45deg, transparent 75%, var(--line) 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0; }
.image-frame img { max-width: 100%; max-height: 540px; object-fit: contain; filter: drop-shadow(0 16px 18px rgba(0, 0, 0, 0.18)); }
.image-caption { gap: 7px; margin-top: 12px; color: var(--muted); font: 10px 'DM Mono', monospace; overflow-wrap: anywhere; }
.file-preview { position: relative; z-index: 1; padding: 28px; }
.file-preview-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.pdf-preview .image-preview-heading { align-items: flex-start; }
.pdf-frame { display: block; width: 100%; height: min(72svh, 780px); min-height: 480px; border: 1px solid var(--line); border-radius: 12px; background: #e7e2d7; }
.epub-frame { min-height: 560px; height: min(72svh, 780px); overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: #f8f4e9; }
.epub-frame > div { height: 100%; }
.epub-controls { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 12px; color: var(--muted); font: 10px 'DM Mono', monospace; text-align: center; }
.epub-controls .text-button { min-height: 34px; padding: 0 10px; }
.download-preview { min-height: 560px; display: grid; align-content: center; justify-items: start; gap: 12px; }
.download-preview h2 { max-width: 680px; margin: 0; font: 700 clamp(28px, 4vw, 48px)/1 'Fraunces', Georgia, serif; letter-spacing: -0.04em; }
.download-preview p { max-width: 520px; margin: 0 0 8px; color: var(--muted); font-size: 14px; line-height: 1.6; }
.download-icon { width: 54px; height: 54px; display: grid; place-items: center; border-radius: 13px; color: var(--accent); background: var(--accent-soft); }
.upload-dialog-backdrop { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 15px; background: rgba(17, 25, 23, 0.62); backdrop-filter: blur(12px); }
.upload-dialog { width: min(670px, 100%); max-height: calc(100svh - 30px); overflow: auto; padding: 24px; border: 1px solid var(--line-strong); border-radius: 16px; color: var(--ink); background: var(--paper-raised); box-shadow: 0 28px 100px rgba(0, 0, 0, 0.3); }
.dialog-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; }
.dialog-header h2 { margin: 7px 0 8px; font: 700 clamp(25px, 4vw, 36px)/1 'Fraunces', Georgia, serif; letter-spacing: -0.04em; }
.dialog-header p { max-width: 500px; margin: 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
.upload-dropzone { min-height: 230px; position: relative; display: grid; place-items: center; align-content: center; gap: 10px; margin: 24px 0 8px; padding: 28px; border: 1px dashed var(--line-strong); border-radius: 13px; color: var(--teal); background: color-mix(in srgb, var(--teal-soft) 65%, transparent); text-align: center; cursor: pointer; transition: border-color 180ms ease, background 180ms ease, transform 180ms ease; }
.upload-dropzone:hover, .upload-dropzone.is-active { border-color: var(--accent); background: var(--accent-soft); transform: translateY(-2px); }
.upload-dropzone input { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; }
.upload-dropzone input:focus-visible + svg { outline: 2px solid var(--accent); outline-offset: 6px; border-radius: 4px; }
.upload-dropzone strong { color: var(--ink); font-size: 15px; }
.upload-dropzone span { max-width: 420px; color: var(--muted); font-size: 12px; line-height: 1.5; }
.spin-icon { animation: spin 900ms linear infinite; }
.upload-review { display: grid; gap: 16px; margin: 24px 0 8px; }
.upload-file-heading { display: flex; align-items: center; gap: 11px; min-width: 0; }
.upload-file-heading > div:last-child { min-width: 0; display: grid; gap: 4px; }
.upload-file-heading strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
.upload-file-heading span { color: var(--muted); font: 10px 'DM Mono', monospace; text-transform: uppercase; }
.upload-file-icon { width: 38px; height: 38px; display: grid; flex: 0 0 auto; place-items: center; border-radius: 9px; color: var(--accent); background: var(--accent-soft); }
.classification-callout { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 13px; border: 1px solid color-mix(in srgb, var(--teal) 36%, var(--line)); border-radius: 10px; color: var(--teal); background: var(--teal-soft); }
.classification-callout > div { min-width: 0; display: grid; gap: 4px; }
.classification-callout strong { color: var(--ink); font-size: 12px; }
.classification-callout span { overflow: hidden; color: var(--muted); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.classification-callout b { color: var(--teal); font: 700 17px 'DM Mono', monospace; }
.upload-fields { display: grid; grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr); gap: 12px; }
.upload-fields label { display: grid; gap: 6px; color: var(--muted); font: 10px 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.06em; }
.upload-fields input, .upload-fields select { min-width: 0; min-height: 40px; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; outline: 0; color: var(--ink); background: var(--paper); font: 12px 'DM Sans', sans-serif; text-transform: none; letter-spacing: 0; }
.upload-fields input:focus, .upload-fields select:focus { border-color: var(--teal); box-shadow: 0 0 0 4px var(--teal-soft); }
.tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
.tag-row span { padding: 5px 8px; border-radius: 999px; color: var(--teal); background: var(--teal-soft); font: 10px 'DM Mono', monospace; }
.upload-preview { border-top: 1px solid var(--line); padding-top: 13px; color: var(--muted); font-size: 12px; }
.upload-preview summary { cursor: pointer; color: var(--teal); }
.upload-preview pre { max-height: 170px; overflow: auto; margin: 12px 0 0; padding: 12px; border-radius: 8px; color: var(--ink); background: var(--paper); font: 11px/1.55 'DM Mono', monospace; white-space: pre-wrap; }
.upload-error { display: flex; align-items: center; gap: 7px; margin: 13px 0 0; color: var(--accent); font-size: 12px; }
.dialog-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--line); }
.insight-deck { padding: 18px; transform: translateZ(24px); animation: rise-in 760ms 320ms both cubic-bezier(.2,.8,.2,1); }
.insight-heading { justify-content: space-between; color: var(--accent); }
.signal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 18px; }
.signal-grid > div { min-height: 84px; display: grid; align-content: center; gap: 4px; padding: 12px; border: 1px solid var(--line); border-radius: 9px; background: color-mix(in srgb, var(--paper) 45%, transparent); }
.signal-grid span, .signal-grid small { color: var(--muted); font-size: 10px; }
.signal-grid strong { font: 700 24px 'Fraunces', Georgia, serif; }
.next-move { gap: 10px; margin-top: 15px; padding: 12px; border-radius: 9px; background: var(--accent-soft); }
.next-icon { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 7px; color: #f8f4e7; background: var(--accent); }
.next-move span { color: var(--accent); font: 10px 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.08em; }
.next-move p { margin: 3px 0 0; color: var(--ink); font-size: 12px; line-height: 1.4; }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

@keyframes rise-in { from { opacity: 0; transform: translateY(18px) translateZ(0); } to { opacity: 1; transform: translateY(0) translateZ(0); } }
@keyframes row-reveal { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
@keyframes grid-drift { from { background-position: 0 0; } to { background-position: 48px 48px; } }
@keyframes orbit { to { transform: rotate(360deg); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 4px var(--accent-soft); } 50% { box-shadow: 0 0 0 8px transparent; } }

@media (max-width: 1050px) {
  .workspace { grid-template-columns: 205px minmax(0, 1fr); gap: 22px; }
  .content-grid { grid-template-columns: 1fr; }
  .reading-column { grid-row: 1; }
  .reading-column { padding-top: 0; }
  .note-deck { grid-row: 2; }
  .reading-surface, .surface-content { min-height: 540px; }
}

@media (max-width: 720px) {
  .topbar { align-items: flex-start; flex-direction: column; padding: 16px 17px; gap: 14px; }
  .topbar-actions { width: 100%; }
  .search-box { min-width: 0; flex: 1; }
  .workspace { display: block; padding: 22px 15px 44px; }
  .library-rail { margin-bottom: 24px; }
  .library-rail.is-collapsed { width: auto; }
  .rail-heading { padding-bottom: 13px; }
  .view-tabs { grid-template-columns: repeat(3, 1fr); }
  .view-tabs button { min-height: 42px; justify-content: center; padding: 0 4px; font-size: 10px; }
  .view-tabs button span { display: none; }
  .rail-divider, .rail-section { display: none; }
  .stage-intro { align-items: flex-start; flex-direction: column; gap: 14px; }
  .stage-actions { width: 100%; justify-content: flex-start; }
  .stage-intro h2 { font-size: 36px; }
  .progress-strip { align-items: flex-start; flex-wrap: wrap; gap: 11px; }
  .progress-copy { min-width: 0; flex: 1; }
  .progress-track { order: 3; flex-basis: 100%; }
  .progress-hint { margin-left: auto; }
  .content-grid { gap: 16px; }
  .reading-surface, .surface-content { min-height: 480px; }
  .markdown-body { padding: 27px 20px 40px; }
  .markdown-body h1 { font-size: 38px; }
  .markdown-body p, .markdown-body li { font-size: 15px; }
  .reading-size-large p, .reading-size-large li { font-size: 17px; }
  .note-toolbar { padding: 13px 16px; }
  .image-preview { padding: 19px; }
  .image-preview-heading { align-items: flex-start; flex-direction: column; }
  .image-frame { min-height: 290px; }
  .file-preview { padding: 19px; }
  .file-preview-actions { width: 100%; }
  .file-preview-actions > * { flex: 1; }
  .pdf-frame { min-height: 410px; }
  .epub-frame { min-height: 410px; }
  .epub-controls span { display: none; }
  .upload-dialog { padding: 19px; }
  .upload-fields { grid-template-columns: 1fr; }
  .dialog-footer > * { flex: 1; }
  .signal-grid > div { min-height: 70px; padding: 9px; }
  .signal-grid strong { font-size: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: 0.001ms !important; }
  .surface-content { transform: translateZ(0); }
}
````

## File: src/App.tsx

````ts
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  ExternalLink,
  File,
  FileUp,
  FileText,
  Folder,
  Image as ImageIcon,
  LoaderCircle,
  ListTree,
  LockKeyhole,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PlayCircle,
  RefreshCw,
  Search,
  Sun,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type DragEvent, type FormEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { ApiError, assetUrl, commitUpload, createEbook, discardUpload, fetchContent, fetchLibrary, fetchSession, fileUrl, login, logout, uploadFile } from './api'
import { UploadDialog } from './features/uploads/UploadDialog'
import { WatchView } from './features/watch/WatchView'
import { formatSize } from './shared/format'
import type { AuthSessionResponse, ContentResponse, FolderNode, LibraryFile, LibraryResponse, PreviewKind, ReadingScale, ReadingView, Theme, UploadResponse } from './types'
import ePub from 'epubjs'
import './App.css'

const storedSet = (key: string): Set<string> => {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? new Set(value.filter((item): item is string => typeof item === 'string')) : new Set()
  } catch {
    return new Set()
  }
}

const saveSet = (key: string, value: Set<string>): void => {
  localStorage.setItem(key, JSON.stringify([...value]))
}

const displayTitle = (file: LibraryFile): string => file.title || file.name

const formatCount = (value: number, label: string): string => `${value} ${label}${value === 1 ? '' : 's'}`

const resolveRelativePath = (fromPath: string, target: string): string | null => {
  if (!target || target.startsWith('#') || target.startsWith('mailto:') || /^https?:\/\//i.test(target)) return null

  try {
    const cleanTarget = target.split('#')[0]
    const resolved = new URL(cleanTarget, `https://study-library.local/${fromPath}`).pathname
    return decodeURIComponent(resolved).replace(/^\/+/, '')
  } catch {
    return null
  }
}

const fileIcon = (file: LibraryFile) => {
  if (file.previewKind === 'image') return <ImageIcon size={15} strokeWidth={1.8} />
  if (file.previewKind === 'pdf') return <FileText size={15} strokeWidth={1.8} />
  if (file.previewKind === 'epub') return <BookOpen size={15} strokeWidth={1.8} />
  if (file.previewKind === 'download') return <File size={15} strokeWidth={1.8} />
  return <FileText size={15} strokeWidth={1.8} />
}

const isInlineContent = (previewKind: PreviewKind): boolean => previewKind === 'markdown' || previewKind === 'text'

const uploadAccept = '.md,.markdown,.mdx,.pdf,.txt,.csv,.json,.xml,.yaml,.yml,.py,.js,.jsx,.ts,.tsx,.html,.css,.sql,.docx,.epub,.pptx,.xlsx,.odt,.ods,.odp,.png,.jpg,.jpeg,.gif,.webp,.svg,.avif'

const flattenFolders = (folders: FolderNode[]): FolderNode[] => folders.flatMap((folder) => [folder, ...flattenFolders(folder.children)])

function App() {
  const [authSession, setAuthSession] = useState<AuthSessionResponse | null>(null)
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [mode, setMode] = useState<'study' | 'watch'>(() => (localStorage.getItem('study-library:mode') as 'study' | 'watch' | null) ?? 'study')
  const [library, setLibrary] = useState<LibraryResponse | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [content, setContent] = useState<ContentResponse | null>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [readingView, setReadingView] = useState<ReadingView>('all')
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => storedSet('study-library:bookmarks'))
  const [completed, setCompleted] = useState<Set<string>>(() => storedSet('study-library:completed'))
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('study-library:theme') as Theme | null) ?? 'dark')
  const [readingScale, setReadingScale] = useState<ReadingScale>('standard')
  const [railOpen, setRailOpen] = useState(true)
  const [focusMode, setFocusMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<{ path: string; message: string } | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'reviewing' | 'committing'>('idle')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadResponse['upload'] | null>(null)
  const [uploadCategory, setUploadCategory] = useState('Unsorted')
  const [uploadFileName, setUploadFileName] = useState('')
  const [isDropActive, setIsDropActive] = useState(false)
  const [ebookState, setEbookState] = useState<'idle' | 'creating'>('idle')
  const [ebookError, setEbookError] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const lastDocumentPath = useRef<string | null>(null)
  const surfaceContentRef = useRef<HTMLDivElement>(null)

  const loadLibrary = async (): Promise<void> => {
    try {
      const nextLibrary = await fetchLibrary()
      setLibrary(nextLibrary)
      setSelectedPath((currentPath) => {
        const nextPath = currentPath && nextLibrary.files.some((file) => file.path === currentPath) ? currentPath : nextLibrary.files.find((file) => file.kind === 'document')?.path ?? nextLibrary.files[0]?.path ?? null
        const nextFile = nextLibrary.files.find((file) => file.path === nextPath)
        if (nextFile?.kind === 'document') lastDocumentPath.current = nextPath
        return nextPath
      })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setAuthSession({ authenticated: false, required: true })
        return
      }
      setLoadError(error instanceof Error ? error.message : 'The library could not be loaded.')
    } finally {
      setIsLoading(false)
    }
  }

  const beginLibraryLoad = (): void => {
    setIsLoading(true)
    setLoadError(null)
    void loadLibrary()
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsLoggingIn(true)
    setAuthError(null)
    void login(authPassword)
      .then((session) => {
        setAuthSession(session)
        setAuthPassword('')
        beginLibraryLoad()
      })
      .catch((error: unknown) => setAuthError(error instanceof Error ? error.message : 'The library could not be unlocked.'))
      .finally(() => setIsLoggingIn(false))
  }

  const handleLogout = (): void => {
    void logout()
      .then((session) => {
        setAuthSession(session)
        setLibrary(null)
        setSelectedPath(null)
        setContent(null)
      })
      .catch((error: unknown) => setAuthError(error instanceof Error ? error.message : 'The library could not be locked.'))
  }

  useEffect(() => {
    void fetchSession()
      .then((session) => {
        setAuthSession(session)
        if (session.authenticated) void loadLibrary()
        else setIsLoading(false)
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : 'The access session could not be checked.')
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!selectedPath) {
      return
    }

    const selectedFile = library?.files.find((file) => file.path === selectedPath)
    if (!selectedFile) return

    if (!isInlineContent(selectedFile.previewKind)) {
      return
    }

    const controller = new AbortController()
    void fetchContent(selectedPath, controller.signal)
      .then(setContent)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setContentError({ path: selectedPath, message: error instanceof Error ? error.message : 'This note could not be opened.' })
      })

    return () => controller.abort()
  }, [library, selectedPath])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('study-library:theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('study-library:mode', mode)
  }, [mode])

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape' && focusMode) setFocusMode(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [focusMode])

  const documents = library?.files.filter((file) => file.kind === 'document') ?? []
  const visibleFiles = (library?.files ?? []).filter((file) => {
    const matchesCategory = activeCategory === 'all' || file.categoryPath === activeCategory
    const normalizedSearch = search.trim().toLowerCase()
    const matchesSearch = !normalizedSearch || [file.title, file.name, file.folderPath].some((value) => value.toLowerCase().includes(normalizedSearch))
    const matchesReadingView = readingView === 'all' || (readingView === 'bookmarked' ? bookmarks.has(file.path) : completed.has(file.path))
    return matchesCategory && matchesSearch && matchesReadingView
  })
  const visibleDocuments = visibleFiles.filter((file) => file.kind === 'document')
  const visibleImages = visibleFiles.filter((file) => file.previewKind === 'image')
  const selectedFile = library?.files.find((file) => file.path === selectedPath) ?? null
  const selectedImage = selectedFile?.previewKind === 'image' ? selectedFile : null
  const selectedContentError = contentError?.path === selectedPath ? contentError.message : null
  const isSelectedContentLoading = Boolean(selectedFile && isInlineContent(selectedFile.previewKind) && content?.path !== selectedPath && !selectedContentError)
  const completedCount = documents.filter((file) => completed.has(file.path)).length
  const progress = documents.length ? Math.round((completedCount / documents.length) * 100) : 0
  const folders = library ? flattenFolders(library.folders) : []
  const categoryOptions = [...new Set([...(library?.categories ?? []).filter((category) => category.path).map((category) => category.name), 'Unsorted', uploadResult?.classification.category ?? ''])].filter(Boolean)

  const selectFile = (file: LibraryFile): void => {
    if (file.kind === 'document') lastDocumentPath.current = file.path
    setSelectedPath(file.path)
  }

  const openUploadDialog = (): void => {
    setUploadOpen(true)
    setUploadError(null)
  }

  const closeUploadDialog = (): void => {
    if (uploadResult) void discardUpload(uploadResult.id)
    setUploadOpen(false)
    setUploadState('idle')
    setUploadError(null)
    setUploadResult(null)
    setUploadCategory('Unsorted')
    setUploadFileName('')
    setIsDropActive(false)
  }

  const handleUploadFile = (file: File | undefined): void => {
    if (!file) return
    if (uploadResult) void discardUpload(uploadResult.id)
    setUploadState('uploading')
    setUploadError(null)
    setUploadResult(null)
    void uploadFile(file)
      .then((response) => {
        setUploadResult(response.upload)
        setUploadCategory(response.upload.classification.category)
        setUploadFileName(response.upload.classification.suggestedFileName)
        setUploadState('reviewing')
      })
      .catch((error: unknown) => {
        setUploadState('idle')
        setUploadError(error instanceof Error ? error.message : 'The upload could not be analyzed.')
      })
  }

  const handleUploadDrop = (event: DragEvent<HTMLLabelElement>): void => {
    event.preventDefault()
    setIsDropActive(false)
    handleUploadFile(event.dataTransfer.files[0])
  }

  const commitCurrentUpload = (): void => {
    if (!uploadResult) return
    setUploadState('committing')
    setUploadError(null)
    void commitUpload(uploadResult.id, uploadCategory, uploadFileName)
      .then(() => {
        setUploadResult(null)
        setUploadOpen(false)
        setUploadState('idle')
        setUploadFileName('')
        beginLibraryLoad()
      })
      .catch((error: unknown) => {
        setUploadState('reviewing')
        setUploadError(error instanceof Error ? error.message : 'The upload could not be added to the library.')
      })
  }

  const createCurrentEbook = (): void => {
    if (!selectedFile || !isInlineContent(selectedFile.previewKind)) return
    setEbookState('creating')
    setEbookError(null)
    void createEbook([selectedFile.path], displayTitle(selectedFile))
      .then((response) => {
        const link = document.createElement('a')
        link.href = fileUrl(response.path)
        link.download = response.fileName
        link.click()
        setEbookState('idle')
        beginLibraryLoad()
      })
      .catch((error: unknown) => {
        setEbookState('idle')
        setEbookError(error instanceof Error ? error.message : 'The ebook could not be created.')
      })
  }

  const toggleBookmark = (filePath: string): void => {
    setBookmarks((current) => {
      const next = new Set(current)
      if (next.has(filePath)) next.delete(filePath)
      else next.add(filePath)
      saveSet('study-library:bookmarks', next)
      return next
    })
  }

  const toggleCompleted = (filePath: string): void => {
    setCompleted((current) => {
      const next = new Set(current)
      if (next.has(filePath)) next.delete(filePath)
      else next.add(filePath)
      saveSet('study-library:completed', next)
      return next
    })
  }

  const handleTilt = (event: PointerEvent<HTMLElement>): void => {
    if (event.pointerType === 'touch') return
    const surfaceContent = surfaceContentRef.current
    if (!surfaceContent) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    surfaceContent.style.setProperty('--glow-x', `${x * 100}%`)
    surfaceContent.style.setProperty('--glow-y', `${y * 100}%`)
  }

  const clearTilt = (): void => {
    const surfaceContent = surfaceContentRef.current
    if (!surfaceContent) return
    surfaceContent.style.setProperty('--glow-x', '50%')
    surfaceContent.style.setProperty('--glow-y', '40%')
  }

  const selectLinkedDocument = (target: string): boolean => {
    if (!selectedPath) return false
    const resolvedPath = resolveRelativePath(selectedPath, target)
    const linkedFile = resolvedPath ? library?.files.find((file) => file.path === resolvedPath && file.kind === 'document') : undefined
    if (!linkedFile) return false
    selectFile(linkedFile)
    return true
  }

  const markdownComponents: Components = {
    a: ({ href, children, ...props }) => {
      const isInternal = Boolean(href && !/^https?:\/\//i.test(href))
      const onClick = (event: MouseEvent<HTMLAnchorElement>): void => {
        if (href && selectLinkedDocument(href)) event.preventDefault()
      }
      return <a href={href} onClick={onClick} {...props} data-internal={isInternal || undefined}>{children}</a>
    },
    img: ({ src, alt, ...props }) => {
      const resolvedSource = src && selectedPath ? resolveRelativePath(selectedPath, src) : null
      const source = resolvedSource ? assetUrl(resolvedSource) : src
      return <img src={source} alt={alt ?? ''} loading="lazy" {...props} />
    },
  }

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && visibleFiles[0]) selectFile(visibleFiles[0])
  }

  if (authSession && !authSession.authenticated) {
    return <LoginView password={authPassword} error={authError} isSubmitting={isLoggingIn} onPasswordChange={setAuthPassword} onSubmit={handleLogin} />
  }

  if (mode === 'watch') {
    return <WatchView theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} onStudy={() => setMode('study')} onLogout={handleLogout} />
  }

  return (
    <div className={`app-shell ${focusMode ? 'is-focus-mode' : ''}`} data-theme={theme}>
      <div className="ambient-grid" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><BookOpen size={20} /></div>
          <div>
            <p className="eyebrow">STUDY LIBRARY / LOCAL INDEX</p>
            <h1>Second brain</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="shell-mode-switch" role="tablist" aria-label="App modes"><button className="is-active" type="button" role="tab" aria-selected="true">Study</button><button type="button" role="tab" aria-selected="false" onClick={() => setMode('watch')}><PlayCircle size={15} />Watch</button></div>
          <label className="search-box">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search study notes</span>
            <input ref={searchRef} value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={onSearchKeyDown} placeholder="Find a concept..." />
            <kbd>Ctrl K</kbd>
          </label>
          <button className="icon-button" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {authSession?.required && <button className="icon-button" type="button" onClick={handleLogout} aria-label="Lock study library" title="Lock study library"><LogOut size={18} /></button>}
          <button className="icon-button" type="button" onClick={() => setFocusMode((current) => !current)} aria-label={focusMode ? 'Exit focus mode' : 'Enter focus mode'} title={focusMode ? 'Exit focus mode' : 'Enter focus mode'}>
            <Zap size={18} />
          </button>
        </div>
      </header>

      <main className="workspace">
        {!focusMode && <aside className={`library-rail ${railOpen ? '' : 'is-collapsed'}`}>
          <div className="rail-heading">
            {railOpen && <div><p className="section-kicker">Your shelves</p><h2>{library?.root ?? 'Loading library'}</h2></div>}
            <button className="icon-button subtle" type="button" onClick={() => setRailOpen((current) => !current)} aria-label={railOpen ? 'Collapse library rail' : 'Expand library rail'} title={railOpen ? 'Collapse library rail' : 'Expand library rail'}>
              {railOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
          </div>
          {railOpen && <>
            <nav className="view-tabs" aria-label="Reading views">
              <button className={readingView === 'all' ? 'is-active' : ''} type="button" onClick={() => setReadingView('all')}><ListTree size={16} />All notes<span>{library?.stats.documents ?? 0}</span></button>
              <button className={readingView === 'bookmarked' ? 'is-active' : ''} type="button" onClick={() => setReadingView('bookmarked')}><Bookmark size={16} />Bookmarked<span>{bookmarks.size}</span></button>
              <button className={readingView === 'completed' ? 'is-active' : ''} type="button" onClick={() => setReadingView('completed')}><CheckCircle2 size={16} />Completed<span>{completedCount}</span></button>
            </nav>
            <div className="rail-divider" />
            <div className="rail-section">
              <div className="rail-section-title"><span>Categories</span><span className="count-badge">{library?.stats.categories ?? 0}</span></div>
              <button className={`category-row ${activeCategory === 'all' ? 'is-active' : ''}`} type="button" onClick={() => setActiveCategory('all')}><span className="category-swatch all-swatch" />Everything<span className="row-count">{library?.stats.documents ?? 0}</span></button>
              {library?.categories.map((category) => <button className={`category-row ${activeCategory === category.path ? 'is-active' : ''}`} type="button" key={category.path || 'root'} onClick={() => setActiveCategory(category.path)}><span className="category-swatch" />{category.name}<span className="row-count">{category.documents}</span></button>)}
            </div>
            <div className="rail-section folder-list">
              <div className="rail-section-title"><span>Folder map</span><span className="count-badge">{folders.length}</span></div>
              {folders.slice(0, 8).map((folder) => <button className="folder-row" type="button" key={folder.path} onClick={() => { setActiveCategory(folder.path.split('/')[0] ?? 'all'); setSearch(folder.name) }}><Folder size={15} />{folder.name}<span className="row-count">{folder.documents.length}</span></button>)}
            </div>
          </>}
        </aside>}

        <section className="content-stage">
          <div className="stage-intro">
            <div><p className="section-kicker">Your learning cockpit</p><h2>{activeCategory === 'all' ? 'Pick up where curiosity left off.' : library?.categories.find((category) => category.path === activeCategory)?.name}</h2><p className="stage-subtitle">A calm index for deep work, built from the folders you already keep.</p></div>
            <div className="stage-actions"><button className="upload-button" type="button" onClick={openUploadDialog}><FileUp size={15} />Import study file</button><button className="refresh-button" type="button" onClick={beginLibraryLoad}><RefreshCw size={15} />Rescan folders</button></div>
          </div>
          <div className="progress-strip">
            <div className="progress-copy"><span className="progress-orbit"><span /></span><div><strong>{progress}% explored</strong><span>{formatCount(completedCount, 'note')} completed in this library</span></div></div>
            <div className="progress-track" aria-label={`${progress}% of notes completed`}><span style={{ width: `${progress}%` }} /></div>
            <span className="progress-hint">{library ? new Date(library.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'} index</span>
          </div>

          <div className="content-grid">
            <section className="note-deck" aria-label="Study files">
              <div className="deck-header"><div><span className="section-kicker">Reading queue</span><h3>{search ? `Results for “${search}”` : 'Your notes'}</h3></div><span className="result-count">{visibleFiles.length} items</span></div>
              {isLoading && <div className="state-panel"><div className="loading-orbit" /><p>Mapping your shelves...</p></div>}
              {!isLoading && loadError && <div className="state-panel error-state"><CircleAlert size={20} /><p>{loadError}</p><button type="button" onClick={beginLibraryLoad}>Try again</button></div>}
              {!isLoading && !loadError && visibleFiles.length === 0 && <div className="state-panel"><BookOpen size={22} /><p>No notes match this view yet.</p><button type="button" onClick={() => { setSearch(''); setActiveCategory('all'); setReadingView('all') }}>Reset view</button></div>}
              <div className="file-list">
                {visibleDocuments.map((file, index) => <FileRow key={file.path} file={file} index={index} isSelected={selectedPath === file.path} isBookmarked={bookmarks.has(file.path)} isCompleted={completed.has(file.path)} onSelect={selectFile} onToggleBookmark={toggleBookmark} onToggleCompleted={toggleCompleted} />)}
                {visibleImages.length > 0 && <div className="asset-divider"><span>Visual references</span><span>{visibleImages.length}</span></div>}
                {visibleImages.map((file, index) => <FileRow key={file.path} file={file} index={index + visibleDocuments.length} isSelected={selectedPath === file.path} isBookmarked={bookmarks.has(file.path)} isCompleted={completed.has(file.path)} onSelect={selectFile} onToggleBookmark={toggleBookmark} onToggleCompleted={toggleCompleted} />)}
              </div>
            </section>

            <section className="reading-column">
              {selectedFile && <nav className="reading-context" aria-label="Current note location">
                <button className="breadcrumb-link" type="button" onClick={() => { setActiveCategory(selectedFile.categoryPath || 'all'); setSearch(''); setReadingView('all') }} aria-current={activeCategory === (selectedFile.categoryPath || 'all') ? 'page' : undefined}>{selectedFile.category}</button>
                <ChevronRight className="breadcrumb-separator" size={14} aria-hidden="true" />
                <button className="breadcrumb-link" type="button" onClick={() => { setActiveCategory(selectedFile.categoryPath || 'all'); setSearch(selectedFile.folderPath); setReadingView('all') }}>{selectedFile.folderPath || 'Library root'}</button>
              </nav>}
              <article className="reading-surface" onPointerMove={handleTilt} onPointerLeave={clearTilt}>
                <div className="surface-content" ref={surfaceContentRef}>
                  <div className="surface-glow" aria-hidden="true" />
                  {selectedImage ? <ImagePreview file={selectedImage} onClose={() => setSelectedPath(lastDocumentPath.current ?? documents[0]?.path ?? null)} /> : selectedFile?.previewKind === 'pdf' ? <PdfPreview file={selectedFile} /> : selectedFile?.previewKind === 'epub' ? <EpubPreview key={selectedFile.path} file={selectedFile} /> : selectedFile?.previewKind === 'download' ? <DownloadPreview file={selectedFile} /> : <>
                  <div className="note-toolbar"><div className="toolbar-actions"><button className="toolbar-button" type="button" onClick={() => selectedFile && toggleBookmark(selectedFile.path)} aria-label={selectedFile && bookmarks.has(selectedFile.path) ? 'Remove bookmark' : 'Bookmark note'} title={selectedFile && bookmarks.has(selectedFile.path) ? 'Remove bookmark' : 'Bookmark note'}>{selectedFile && bookmarks.has(selectedFile.path) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button><button className="toolbar-button" type="button" onClick={() => setReadingScale(readingScale === 'standard' ? 'large' : 'standard')} aria-label={readingScale === 'standard' ? 'Increase reading size' : 'Use standard reading size'} title={readingScale === 'standard' ? 'Increase reading size' : 'Use standard reading size'}><span className="type-toggle">Aa</span></button><button className="toolbar-button" type="button" onClick={createCurrentEbook} disabled={!selectedFile || !isInlineContent(selectedFile.previewKind) || ebookState === 'creating'} aria-label="Create EPUB from this note" title="Create EPUB from this note">{ebookState === 'creating' ? <LoaderCircle className="spin-icon" size={17} /> : <BookOpen size={17} />}</button>{ebookError && <span className="toolbar-status" role="status">{ebookError}</span>}</div></div>
                  {isSelectedContentLoading && <div className="reading-state"><div className="loading-orbit" /><p>Opening the next idea...</p></div>}
                  {!isSelectedContentLoading && selectedContentError && <div className="reading-state error-state"><CircleAlert size={22} /><p>{selectedContentError}</p></div>}
                  {!isSelectedContentLoading && !selectedContentError && content && selectedFile && <div className={`markdown-body reading-size-${readingScale}`}><div className="note-meta"><span className="note-type"><FileText size={14} />{selectedFile.extension.replace('.', '').toUpperCase()} {selectedFile.previewKind === 'markdown' ? 'NOTE' : 'TEXT'}</span><span>{formatSize(selectedFile.size)}</span><span>{new Date(selectedFile.modifiedAt).toLocaleDateString()}</span></div>{selectedFile.previewKind === 'markdown' ? <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize, rehypeHighlight]} components={markdownComponents}>{content.content}</ReactMarkdown> : <pre className="text-file-body">{content.content}</pre>}<div className="note-footer"><button className={`complete-button ${completed.has(selectedFile.path) ? 'is-complete' : ''}`} type="button" onClick={() => toggleCompleted(selectedFile.path)}>{completed.has(selectedFile.path) ? <Check size={16} /> : <CheckCircle2 size={16} />} {completed.has(selectedFile.path) ? 'Completed' : 'Mark as complete'}</button><span className="footer-path">{selectedFile.path}</span></div></div>}
                  {!isSelectedContentLoading && !selectedContentError && !content && !selectedFile && <div className="reading-state"><BookOpen size={26} /><p>Select a note to begin.</p></div>}
                  </>}
                </div>
              </article>
              {!focusMode && <aside className="insight-deck"><div className="insight-heading"><div><span className="section-kicker">Session signals</span><h3>Keep the thread</h3></div><Clock3 size={18} /></div><div className="signal-grid"><div><span>Queue</span><strong>{visibleDocuments.length}</strong><small>notes in view</small></div><div><span>Saved</span><strong>{bookmarks.size}</strong><small>bookmarks</small></div><div><span>Folders</span><strong>{library?.stats.folders ?? 0}</strong><small>to explore</small></div></div><div className="next-move"><div className="next-icon"><ArrowUpRight size={17} /></div><div><span>Next move</span><p>{selectedFile ? `Continue with ${displayTitle(selectedFile)}.` : 'Choose one small idea and stay with it.'}</p></div></div></aside>}
            </section>
          </div>
        </section>
      </main>
      <UploadDialog isOpen={uploadOpen} state={uploadState} error={uploadError} result={uploadResult} categories={categoryOptions} category={uploadCategory} fileName={uploadFileName} accept={uploadAccept} isDropActive={isDropActive} onClose={closeUploadDialog} onFile={handleUploadFile} onDrop={handleUploadDrop} onDragEnter={() => setIsDropActive(true)} onDragLeave={() => setIsDropActive(false)} onCategoryChange={setUploadCategory} onFileNameChange={setUploadFileName} onCommit={commitCurrentUpload} />
    </div>
  )
}

type LoginViewProps = {
  password: string
  error: string | null
  isSubmitting: boolean
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function LoginView({ password, error, isSubmitting, onPasswordChange, onSubmit }: LoginViewProps) {
  return <main className="auth-shell"><div className="auth-orbit" aria-hidden="true" /><section className="auth-panel" aria-labelledby="auth-title"><div className="brand-mark" aria-hidden="true"><BookOpen size={20} /></div><span className="section-kicker">Private study library</span><h1 id="auth-title">Unlock your shelves.</h1><p>Enter the library access password to continue reading.</p><form onSubmit={onSubmit}><label className="auth-field"><span>Password</span><span className="auth-input"><LockKeyhole size={16} aria-hidden="true" /><input type="password" value={password} onChange={(event) => onPasswordChange(event.target.value)} autoComplete="current-password" autoFocus required /></span></label>{error && <p className="auth-error" role="alert"><CircleAlert size={16} />{error}</p>}<button className="upload-button auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="spin-icon" size={16} />Unlocking...</> : <><LockKeyhole size={16} />Open library</>}</button></form></section></main>
}

function PdfPreview({ file }: { file: LibraryFile }) {
  return <div className="file-preview pdf-preview"><div className="image-preview-heading"><div><span className="section-kicker">Textbook preview</span><h2>{displayTitle(file)}</h2></div><div className="file-preview-actions"><a className="text-button" href={fileUrl(file.path)} target="_blank" rel="noreferrer"><ExternalLink size={15} />Open</a><a className="text-button" href={fileUrl(file.path)} download={file.name}><Download size={15} />Download</a></div></div><iframe className="pdf-frame" src={fileUrl(file.path)} title={displayTitle(file)} /><div className="image-caption"><FileText size={15} /><span>{file.path}</span></div></div>
}

function EpubPreview({ file }: { file: LibraryFile }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const renditionRef = useRef<{ next: () => Promise<unknown>; prev: () => Promise<unknown> } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!frameRef.current) return
    const book = ePub(fileUrl(file.path))
    const rendition = book.renderTo(frameRef.current, { width: '100%', height: '100%' })
    renditionRef.current = rendition
    void rendition.display().catch(() => setError('This EPUB could not be opened in the reader.'))

    return () => {
      renditionRef.current = null
      book.destroy()
    }
  }, [file.path])

  const movePage = (direction: 'next' | 'prev'): void => {
    const action = renditionRef.current?.[direction]
    if (action) void action().catch(() => setError('This chapter could not be opened.'))
  }

  return <div className="file-preview epub-preview"><div className="image-preview-heading"><div><span className="section-kicker">Ebook reader</span><h2>{displayTitle(file)}</h2></div><div className="file-preview-actions"><a className="text-button" href={fileUrl(file.path)} download={file.name}><Download size={15} />Download</a></div></div><div className="epub-frame" ref={frameRef}>{error && <div className="reading-state error-state"><CircleAlert size={22} /><p>{error}</p></div>}</div><div className="epub-controls"><button className="text-button" type="button" onClick={() => movePage('prev')}><ChevronLeft size={15} />Previous</button><span>Use the book controls to turn pages</span><button className="text-button" type="button" onClick={() => movePage('next')}>Next<ChevronRight size={15} /></button></div><div className="image-caption"><BookOpen size={15} /><span>{file.path}</span></div></div>
}

function DownloadPreview({ file }: { file: LibraryFile }) {
  return <div className="file-preview download-preview"><div className="download-icon"><File size={26} /></div><span className="section-kicker">File preview</span><h2>{displayTitle(file)}</h2><p>This format is stored safely in the library and can be opened with its native application.</p><div className="file-preview-actions"><a className="upload-button" href={fileUrl(file.path)} target="_blank" rel="noreferrer"><ExternalLink size={15} />Open file</a><a className="text-button" href={fileUrl(file.path)} download={file.name}><Download size={15} />Download</a></div><div className="image-caption"><File size={15} /><span>{file.path}</span></div></div>
}

type FileRowProps = { file: LibraryFile; index: number; isSelected: boolean; isBookmarked: boolean; isCompleted: boolean; onSelect: (file: LibraryFile) => void; onToggleBookmark: (path: string) => void; onToggleCompleted: (path: string) => void }

function FileRow({ file, index, isSelected, isBookmarked, isCompleted, onSelect, onToggleBookmark, onToggleCompleted }: FileRowProps) {
  const [isOpen, setIsOpen] = useState(false)
  return <article className={`file-row ${isSelected ? 'is-selected' : ''} ${isCompleted ? 'is-completed' : ''}`} style={{ '--row-index': index } as CSSProperties}>
    <button className="file-main" type="button" onClick={() => onSelect(file)}><span className={`file-icon ${file.kind} ${file.previewKind}`}>{fileIcon(file)}</span><span className="file-copy"><strong>{displayTitle(file)}</strong><small>{file.folderPath || 'Library root'}</small></span>{isCompleted && <CheckCircle2 className="completed-icon" size={16} />}{isSelected && <span className="selected-pulse" />}</button>
    <div className="file-actions"><button className="row-action" type="button" onClick={() => onToggleBookmark(file.path)} aria-label={isBookmarked ? `Remove ${displayTitle(file)} bookmark` : `Bookmark ${displayTitle(file)}`} title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}>{isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}</button><button className="row-action" type="button" onClick={() => setIsOpen((current) => !current)} aria-label="Open file details" title="File details">{isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</button></div>
    {isOpen && <div className="file-detail"><span>{file.name}</span><span>{formatSize(file.size)} · {new Date(file.modifiedAt).toLocaleDateString()}</span><button type="button" onClick={() => onToggleCompleted(file.path)}>{isCompleted ? 'Unmark complete' : 'Mark complete'}</button></div>}
  </article>
}

function ImagePreview({ file, onClose }: { file: LibraryFile; onClose: () => void }) {
  return <div className="image-preview"><div className="image-preview-heading"><div><span className="section-kicker">Visual reference</span><h2>{displayTitle(file)}</h2></div><button className="text-button" type="button" onClick={onClose}>Back to note</button></div><div className="image-frame"><img src={assetUrl(file.path)} alt={displayTitle(file)} /></div><div className="image-caption"><ImageIcon size={15} /><span>{file.path}</span></div></div>
}

export default App
````

## File: src/Watch.css

````css
.watch-shell { min-height: 100svh; color: var(--ink); background: var(--paper); }
.watch-topbar { min-height: 76px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 18px; padding: 16px clamp(18px, 4vw, 64px); border-bottom: 1px solid var(--line); background: var(--paper-raised); }
.watch-brand { display: flex; align-items: center; gap: 11px; }
.watch-brand-mark { width: 38px; height: 38px; display: grid; place-items: center; color: #f7f0df; background: var(--teal); border-radius: 10px; box-shadow: 4px 4px 0 var(--accent); }
.watch-brand strong { display: block; margin-top: 3px; font: 700 18px/1.1 'Fraunces', Georgia, serif; }
.watch-kicker { color: var(--muted); font: 700 10px/1.2 'DM Mono', monospace; letter-spacing: .14em; text-transform: uppercase; }
.watch-mode-switch { display: flex; align-items: center; gap: 4px; padding: 4px; border: 1px solid var(--line); border-radius: 10px; background: var(--paper); }
.watch-mode-switch button, .watch-tabs button, .watch-lyrics-tabs button { min-height: 32px; display: inline-flex; align-items: center; gap: 6px; border: 0; border-radius: 7px; padding: 0 11px; color: var(--muted); background: transparent; font-size: 12px; }
.watch-mode-switch button.is-active, .watch-tabs button.is-active, .watch-lyrics-tabs button.is-active { color: var(--ink); background: var(--paper-raised); box-shadow: 0 3px 10px rgba(29,37,35,.08); }
.watch-actions { display: flex; justify-content: flex-end; gap: 8px; }
.watch-icon-button { width: 40px; height: 40px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 9px; color: var(--ink); background: var(--paper-raised); }
.watch-icon-button:hover, .watch-control-button:hover { color: var(--accent); border-color: var(--accent); }
.watch-main { max-width: 1500px; margin: 0 auto; padding: 42px clamp(18px, 4vw, 64px) 70px; }
.watch-intro { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 30px; }
.watch-intro h1 { max-width: 690px; margin: 8px 0 8px; font: 700 clamp(32px, 5vw, 58px)/.98 'Fraunces', Georgia, serif; letter-spacing: -.045em; }
.watch-intro p { margin: 0; color: var(--muted); font-size: 13px; }
.watch-search { width: min(300px, 100%); min-height: 42px; display: flex; align-items: center; gap: 9px; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 9px; color: var(--muted); background: var(--paper-raised); }
.watch-search:focus-within { border-color: var(--teal); box-shadow: 0 0 0 4px var(--teal-soft); }
.watch-search input { min-width: 0; width: 100%; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 13px; }
.watch-player-layout { display: grid; grid-template-columns: minmax(0, 1.75fr) minmax(260px, .65fr); gap: 22px; align-items: stretch; }
.watch-player-frame { min-height: 470px; position: relative; display: grid; place-items: center; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 14px; background: #0d1514; box-shadow: var(--shadow); }
.watch-player-frame video { display: block; width: 100%; max-height: 620px; background: #0d1514; }
.watch-audio-art { width: 100%; min-height: 470px; display: grid; place-items: center; align-content: center; gap: 12px; color: var(--teal); background: var(--paper-raised); }
.watch-audio-art span { max-width: 80%; color: var(--ink); font: 700 clamp(28px, 4vw, 50px)/1 'Fraunces', Georgia, serif; text-align: center; }
.watch-audio-art small { color: var(--muted); font: 10px 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
.watch-audio-art audio { display: none; }
.watch-controls { position: absolute; right: 0; bottom: 0; left: 0; padding: 18px 18px 14px; color: #f5efe4; background: rgba(13,21,20,.92); }
.watch-progress { display: grid; grid-template-columns: 42px minmax(0, 1fr) 42px; align-items: center; gap: 9px; font: 10px 'DM Mono', monospace; }
.watch-progress input, .watch-control-select input { accent-color: var(--accent); }
.watch-progress input { width: 100%; }
.watch-control-row { display: flex; align-items: center; gap: 9px; margin-top: 10px; }
.watch-control-button, .watch-play-button { display: grid; place-items: center; color: #f5efe4; border: 1px solid rgba(245,239,228,.3); background: transparent; }
.watch-control-button { width: 34px; height: 34px; border-radius: 7px; }
.watch-play-button { width: 38px; height: 38px; border-radius: 50%; background: var(--accent); border-color: var(--accent); }
.watch-control-select { min-height: 34px; display: inline-flex; align-items: center; gap: 6px; margin-left: 4px; color: #d4ded7; font-size: 11px; }
.watch-control-select select { max-width: 106px; border: 1px solid rgba(245,239,228,.3); border-radius: 6px; padding: 6px 8px; color: #f5efe4; background: #17201e; font-size: 11px; }
.watch-control-select input { width: 74px; }
.watch-quality-label { display: none; }
.watch-details { min-height: 470px; display: flex; flex-direction: column; justify-content: center; padding: 24px 8px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.watch-details h2 { margin: 9px 0 8px; font: 700 clamp(27px, 3vw, 42px)/1.02 'Fraunces', Georgia, serif; letter-spacing: -.04em; }
.watch-details > p { color: var(--muted); line-height: 1.6; }
.watch-path { overflow-wrap: anywhere; font: 10px 'DM Mono', monospace; }
.watch-detail-rule { height: 1px; margin: 20px 0 13px; background: var(--line); }
.watch-detail-row { display: flex; justify-content: space-between; gap: 12px; padding: 7px 0; color: var(--muted); font-size: 12px; }
.watch-detail-row strong { color: var(--ink); font: 11px 'DM Mono', monospace; }
.watch-language { display: flex; align-items: center; gap: 8px; margin-top: 16px; color: var(--muted); font-size: 12px; }
.watch-language select { margin-left: auto; max-width: 150px; border: 1px solid var(--line); border-radius: 6px; padding: 7px; color: var(--ink); background: var(--paper-raised); }
.watch-inline-error { position: absolute; top: 14px; left: 14px; display: inline-flex; align-items: center; gap: 6px; padding: 8px 10px; color: #fff5e8; border: 1px solid rgba(239,130,90,.65); border-radius: 6px; background: rgba(146,57,39,.88); font-size: 11px; }
.watch-empty, .watch-no-results { display: grid; place-items: center; align-content: center; gap: 10px; min-height: 220px; color: var(--muted); text-align: center; }
.watch-empty p, .watch-no-results p { margin: 0; }
.watch-loader { width: 30px; height: 30px; border: 1px solid var(--line-strong); border-top-color: var(--accent); border-right-color: var(--teal); border-radius: 50%; animation: spin 900ms linear infinite; }
.watch-library-section { margin-top: 34px; }
.watch-section-heading { display: flex; align-items: end; justify-content: space-between; gap: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
.watch-section-heading h2 { margin: 6px 0 0; font: 700 26px/1 'Fraunces', Georgia, serif; }
.watch-tabs { display: flex; gap: 4px; }
.watch-tabs button span { margin-left: 3px; font: 10px 'DM Mono', monospace; }
.watch-media-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 18px; margin-top: 8px; }
.watch-media-item { min-width: 0; display: grid; grid-template-columns: 36px minmax(0,1fr) auto; align-items: center; gap: 11px; min-height: 64px; padding: 7px 4px; border: 0; border-bottom: 1px solid var(--line); color: var(--ink); background: transparent; text-align: left; }
.watch-media-item:hover, .watch-media-item.is-selected { background: var(--teal-soft); }
.watch-media-icon { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 7px; color: var(--teal); background: var(--teal-soft); }
.watch-media-icon.audio { color: var(--accent); background: var(--accent-soft); }
.watch-media-copy { min-width: 0; display: grid; gap: 5px; }
.watch-media-copy strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
.watch-media-copy small, .watch-media-arrow { overflow: hidden; color: var(--muted); font: 10px 'DM Mono', monospace; text-overflow: ellipsis; white-space: nowrap; }
.watch-media-arrow { max-width: 130px; }
.watch-lyrics-panel { max-width: 720px; margin: 20px 0 10px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.watch-lyrics-tabs { display: flex; gap: 4px; padding: 8px 0; }
.watch-lyrics-tabs button { padding-left: 0; }
.watch-lyrics-scroll { max-height: 230px; overflow: auto; padding: 2px 0 14px; }
.watch-lyrics-scroll button { display: block; width: 100%; padding: 7px 0; border: 0; color: var(--muted); background: transparent; text-align: left; font-size: 14px; }
.watch-lyrics-scroll button:hover, .watch-lyrics-scroll button.is-active { color: var(--accent); }
.watch-muted { color: var(--muted); font-size: 12px; }

@media (max-width: 900px) {
  .watch-topbar { grid-template-columns: 1fr auto; }
  .watch-mode-switch { grid-column: 1 / -1; grid-row: 2; justify-self: start; }
  .watch-actions { grid-column: 2; grid-row: 1; }
  .watch-player-layout { grid-template-columns: 1fr; }
  .watch-details { min-height: 0; padding: 8px 0 24px; border-top: 0; }
}

@media (max-width: 620px) {
  .watch-main { padding: 26px 15px 44px; }
  .watch-intro { align-items: flex-start; flex-direction: column; gap: 18px; }
  .watch-search { width: 100%; }
  .watch-player-frame, .watch-audio-art { min-height: 330px; }
  .watch-control-row { flex-wrap: wrap; }
  .watch-control-select { margin-left: 0; }
  .watch-media-grid { grid-template-columns: 1fr; }
  .watch-section-heading { align-items: flex-start; flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  .watch-loader { animation-duration: .001ms; }
}
````

## File: src/api.ts

````ts
import type { AuthSessionResponse, ContentResponse, EbookResponse, LibraryResponse, MediaResponse, UploadCommitResponse, UploadResponse } from './types'

const apiOrigin = __API_ORIGIN__.replace(/\/$/, '')
const apiEndpoint = (path: string): string => `${apiOrigin}${path}`

export class ApiError extends Error {
  readonly status: number
  readonly code: string | null

  constructor(message: string, status: number, code: string | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

const requestJson = async <ResponseBody>(url: string, options: RequestInit = {}): Promise<ResponseBody> => {
  const response = await fetch(url, { ...options, credentials: 'include' })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: unknown } | null
    const code = body && typeof (body as { code?: unknown }).code === 'string' ? (body as { code: string }).code : null
    throw new ApiError(typeof body?.message === 'string' ? body.message : `Request failed with status ${response.status}.`, response.status, code)
  }
  return response.json() as Promise<ResponseBody>
}

export const fetchSession = (): Promise<AuthSessionResponse> => requestJson<AuthSessionResponse>(apiEndpoint('/api/auth/session'))

export const login = (password: string): Promise<AuthSessionResponse> => requestJson<AuthSessionResponse>(apiEndpoint('/api/auth/login'), {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ password }),
})

export const logout = (): Promise<AuthSessionResponse> => requestJson<AuthSessionResponse>(apiEndpoint('/api/auth/logout'), { method: 'POST' })

export const fetchLibrary = (signal?: AbortSignal): Promise<LibraryResponse> => requestJson<LibraryResponse>(apiEndpoint('/api/library'), { signal })

export const fetchContent = (filePath: string, signal?: AbortSignal): Promise<ContentResponse> => {
  const query = new URLSearchParams({ path: filePath })
  return requestJson<ContentResponse>(apiEndpoint(`/api/content?${query.toString()}`), { signal })
}

export const assetUrl = (filePath: string): string => {
  const query = new URLSearchParams({ path: filePath })
  return apiEndpoint(`/api/asset?${query.toString()}`)
}

export const fileUrl = (filePath: string): string => {
  const query = new URLSearchParams({ path: filePath })
  return apiEndpoint(`/api/file?${query.toString()}`)
}

export const fetchMedia = (signal?: AbortSignal): Promise<MediaResponse> => requestJson<MediaResponse>(apiEndpoint('/api/media'), { signal })

export const mediaUrl = (filePath: string): string => {
  const query = new URLSearchParams({ path: filePath })
  return apiEndpoint(`/api/media/stream?${query.toString()}`)
}

export const subtitleUrl = (filePath: string): string => {
  const query = new URLSearchParams({ path: filePath })
  return apiEndpoint(`/api/media/subtitle?${query.toString()}`)
}

export const uploadFile = (file: File, signal?: AbortSignal): Promise<UploadResponse> => {
  const body = new FormData()
  body.append('file', file)
  return requestJson<UploadResponse>(apiEndpoint('/api/uploads'), { method: 'POST', body, signal })
}

export const commitUpload = (uploadId: string, category: string, fileName: string, signal?: AbortSignal): Promise<UploadCommitResponse> =>
  requestJson<UploadCommitResponse>(apiEndpoint(`/api/uploads/${encodeURIComponent(uploadId)}/commit`), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ category, fileName }),
    signal,
  })

export const discardUpload = async (uploadId: string): Promise<void> => {
  await fetch(apiEndpoint(`/api/uploads/${encodeURIComponent(uploadId)}`), { method: 'DELETE', credentials: 'include' })
}

export const createEbook = (paths: string[], title: string, signal?: AbortSignal): Promise<EbookResponse> =>
  requestJson<EbookResponse>(apiEndpoint('/api/ebooks'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ paths, title }),
    signal,
  })
````

## File: src/assets/react.svg

````xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
````

## File: src/env.d.ts

````ts
declare const __API_ORIGIN__: string
````

## File: src/epubjs.d.ts

````ts
declare module 'epubjs' {
  type EpubRendition = {
    display: () => Promise<unknown>
    next: () => Promise<unknown>
    prev: () => Promise<unknown>
  }

  type EpubBook = {
    renderTo: (element: HTMLElement, options: { width: string; height: string }) => EpubRendition
    destroy: () => void
  }

  const ePub: (source: string) => EpubBook
  export default ePub
}
````

## File: src/features/uploads/UploadDialog.tsx

````ts
import { CircleAlert, FileText, FileUp, LoaderCircle, Sparkles, Upload, X } from 'lucide-react'
import type { DragEvent } from 'react'
import { formatSize } from '../../shared/format'
import type { UploadResponse } from '../../types'

type UploadDialogProps = {
  isOpen: boolean
  state: 'idle' | 'uploading' | 'reviewing' | 'committing'
  error: string | null
  result: UploadResponse['upload'] | null
  categories: string[]
  category: string
  fileName: string
  accept: string
  isDropActive: boolean
  onClose: () => void
  onFile: (file: File | undefined) => void
  onDrop: (event: DragEvent<HTMLLabelElement>) => void
  onDragEnter: () => void
  onDragLeave: () => void
  onCategoryChange: (value: string) => void
  onFileNameChange: (value: string) => void
  onCommit: () => void
}

export function UploadDialog({ isOpen, state, error, result, categories, category, fileName, accept, isDropActive, onClose, onFile, onDrop, onDragEnter, onDragLeave, onCategoryChange, onFileNameChange, onCommit }: UploadDialogProps) {
  if (!isOpen) return null
  const isBusy = state === 'uploading' || state === 'committing'
  const confidence = result ? Math.round(result.classification.confidence * 100) : 0

  return <div className="upload-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isBusy) onClose() }}>
    <section className="upload-dialog" role="dialog" aria-modal="true" aria-labelledby="upload-dialog-title">
      <header className="dialog-header"><div><span className="section-kicker">Library import</span><h2 id="upload-dialog-title">Bring a textbook into focus</h2><p>Upload a file, review its topic suggestion, then place it in your library.</p></div><button className="icon-button subtle" type="button" onClick={onClose} disabled={isBusy} aria-label="Close import dialog" title="Close import dialog"><X size={18} /></button></header>
      {!result && <label className={`upload-dropzone ${isDropActive ? 'is-active' : ''}`} onDragEnter={(event) => { event.preventDefault(); onDragEnter() }} onDragOver={(event) => event.preventDefault()} onDragLeave={onDragLeave} onDrop={onDrop}>
        <input type="file" accept={accept} onChange={(event) => onFile(event.target.files?.[0])} />
        {state === 'uploading' ? <LoaderCircle className="spin-icon" size={28} /> : <FileUp size={28} />}
        <strong>{state === 'uploading' ? 'Reading the upload...' : 'Choose a study file or drop it here'}</strong>
        <span>PDF, Markdown, images, text, DOCX, EPUB, and common textbook formats</span>
      </label>}
      {result && <div className="upload-review">
        <div className="upload-file-heading"><div className="upload-file-icon"><FileText size={18} /></div><div><strong>{result.originalName}</strong><span>{result.extension.toUpperCase()} · {formatSize(result.size)}</span></div></div>
        <div className="classification-callout"><Sparkles size={17} /><div><strong>{result.classification.source === 'ai' ? 'AI topic suggestion' : 'Local topic suggestion'}</strong><span>{result.classification.summary}</span></div><b>{confidence}%</b></div>
        <div className="upload-fields"><label><span>Folder</span><select value={category} onChange={(event) => onCategoryChange(event.target.value)}>{categories.map((option) => <option key={option} value={option}>{option}</option>)}</select></label><label><span>File name</span><input value={fileName} onChange={(event) => onFileNameChange(event.target.value)} /></label></div>
        {result.classification.tags.length > 0 && <div className="tag-row">{result.classification.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
        {result.previewText && <details className="upload-preview"><summary>View extracted preview</summary><pre>{result.previewText}</pre></details>}
      </div>}
      {error && <p className="upload-error"><CircleAlert size={16} />{error}</p>}
      <footer className="dialog-footer"><button className="text-button" type="button" onClick={onClose} disabled={isBusy}><X size={15} />Cancel</button>{result && <button className="upload-button" type="button" onClick={onCommit} disabled={isBusy || !category || !fileName}>{state === 'committing' ? <><LoaderCircle className="spin-icon" size={15} />Adding...</> : <><Upload size={15} />Add to library</>}</button>}</footer>
    </section>
  </div>
}
````

## File: src/features/watch/WatchView.tsx

````ts
import {
  AudioLines,
  Captions,
  ChevronLeft,
  CircleAlert,
  Gauge,
  ListMusic,
  LogOut,
  Maximize,
  Moon,
  Pause,
  Play,
  Search,
  SkipBack,
  SkipForward,
  Sun,
  Volume2,
} from 'lucide-react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { ApiError, fetchMedia, mediaUrl, subtitleUrl } from '../../api'
import type { MediaFile, Theme } from '../../types'
import '../../Watch.css'

type WatchViewProps = {
  theme: Theme
  onToggleTheme: () => void
  onStudy: () => void
  onLogout: () => void
}

type MediaTab = 'all' | 'video' | 'audio'
type PlayerElement = HTMLVideoElement | HTMLAudioElement

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--'
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainder}`
}

const activeLyricIndexFor = (file: MediaFile | null, currentTime: number): number => {
  if (!file || file.lyrics.length === 0) return -1
  let activeIndex = -1
  file.lyrics.forEach((line, index) => {
    if (line.time <= currentTime) activeIndex = index
  })
  return activeIndex
}

export function WatchView({ theme, onToggleTheme, onStudy, onLogout }: WatchViewProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [tab, setTab] = useState<MediaTab>('all')
  const [search, setSearch] = useState('')
  const [playerTab, setPlayerTab] = useState<'overview' | 'lyrics'>('overview')
  const [selectedLanguage, setSelectedLanguage] = useState('off')
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const playerRef = useRef<PlayerElement>(null)
  const playerFrameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    void fetchMedia(controller.signal)
      .then((response) => {
        setFiles(response.files)
        setSelectedPath((current) => current && response.files.some((file) => file.path === current) ? current : response.files[0]?.path ?? null)
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof ApiError && requestError.status === 404 ? 'No Watch media folder is configured.' : requestError instanceof Error ? requestError.message : 'Watch media could not be loaded.')
        }
      })
      .finally(() => setIsLoading(false))
    return () => controller.abort()
  }, [])

  const selectedFile = files.find((file) => file.path === selectedPath) ?? null
  const visibleFiles = files.filter((file) => {
    const matchesTab = tab === 'all' || file.kind === tab
    const normalizedSearch = search.trim().toLowerCase()
    const matchesSearch = !normalizedSearch || [file.title, file.name, file.path].some((value) => value.toLowerCase().includes(normalizedSearch))
    return matchesTab && matchesSearch
  })
  const activeLyricIndex = activeLyricIndexFor(selectedFile, currentTime)
  const qualities = selectedFile?.qualities.length ? selectedFile.qualities : selectedFile ? [{ label: 'Original', path: selectedFile.path, mimeType: selectedFile.mimeType }] : []
  const subtitleOptions = selectedFile?.subtitles ?? []

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    player.playbackRate = playbackRate
    player.volume = volume
    for (let index = 0; index < player.textTracks.length; index += 1) {
      player.textTracks[index].mode = 'disabled'
    }
    if (selectedLanguage !== 'off') {
      const track = Array.from(player.textTracks).find((candidate) => candidate.language === selectedLanguage)
      if (track) track.mode = 'showing'
    }
  }, [playbackRate, selectedLanguage, volume, selectedPath])

  const togglePlay = (): void => {
    const player = playerRef.current
    if (!player) return
    if (player.paused) void player.play().catch(() => setError('This media file could not be played in the browser.'))
    else player.pause()
  }

  const seekBy = (amount: number): void => {
    const player = playerRef.current
    if (!player) return
    player.currentTime = Math.max(0, Math.min(player.duration || 0, player.currentTime + amount))
  }

  const changeMedia = (file: MediaFile): void => {
    setSelectedPath(file.path)
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)
    setSelectedLanguage('off')
    setPlayerTab(file.kind === 'audio' && file.lyrics.length > 0 ? 'lyrics' : 'overview')
  }

  const selectQuality = (path: string): void => {
    if (path === selectedFile?.path) return
    setSelectedPath(path)
    setCurrentTime(0)
    setIsPlaying(false)
  }

  return <div className="watch-shell" data-theme={theme}>
    <header className="watch-topbar">
      <div className="watch-brand"><div className="watch-brand-mark"><AudioLines size={19} /></div><div><span className="watch-kicker">SECOND BRAIN</span><strong>Watch</strong></div></div>
      <nav className="watch-mode-switch" aria-label="App modes">
        <button type="button" onClick={onStudy}><ChevronLeft size={15} />Study</button>
        <button className="is-active" type="button" aria-current="page">Watch</button>
      </nav>
      <div className="watch-actions">
        <button className="watch-icon-button" type="button" onClick={onToggleTheme} aria-label="Toggle theme" title="Toggle theme">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button className="watch-icon-button" type="button" onClick={onLogout} aria-label="Lock library" title="Lock library"><LogOut size={18} /></button>
      </div>
    </header>

    <main className="watch-main">
      <section className="watch-intro">
        <div><span className="watch-kicker">YOUR SCREENING ROOM</span><h1>Choose something worth staying for.</h1><p>Local video and audio files, indexed from your private media shelf.</p></div>
        <label className="watch-search"><Search size={16} /><span className="sr-only">Search Watch media</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your collection" /></label>
      </section>

      <section className="watch-player-layout">
        <div className={`watch-player-frame ${selectedFile?.kind === 'audio' ? 'is-audio' : ''}`} ref={playerFrameRef}>
          {selectedFile?.kind === 'video' && <video ref={playerRef as RefObject<HTMLVideoElement>} src={mediaUrl(selectedFile.path)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} playsInline preload="metadata">
            {subtitleOptions.map((track) => <track key={track.path} kind="subtitles" src={subtitleUrl(track.path)} srcLang={track.language} label={track.label} />)}
          </video>}
          {selectedFile?.kind === 'audio' && <div className="watch-audio-art"><AudioLines size={46} /><span>{selectedFile.title}</span><small>Audio session</small><audio ref={playerRef as RefObject<HTMLAudioElement>} src={mediaUrl(selectedFile.path)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} preload="metadata" /></div>}
          {!selectedFile && !isLoading && <div className="watch-empty"><AudioLines size={28} /><p>{error ?? 'Add video or audio files to your Desktop media folder.'}</p></div>}
          {isLoading && <div className="watch-empty"><span className="watch-loader" /><p>Mapping your media shelf...</p></div>}
          {error && selectedFile && <div className="watch-inline-error"><CircleAlert size={15} />{error}</div>}
          {selectedFile && <div className="watch-controls">
            <div className="watch-progress"><span>{formatTime(currentTime)}</span><input aria-label="Seek media" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={(event) => { const nextTime = Number(event.target.value); setCurrentTime(nextTime); if (playerRef.current) playerRef.current.currentTime = nextTime }} /><span>{formatTime(duration)}</span></div>
            <div className="watch-control-row"><button className="watch-control-button" type="button" onClick={() => seekBy(-10)} aria-label="Back 10 seconds" title="Back 10 seconds"><SkipBack size={17} /></button><button className="watch-play-button" type="button" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} title={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? <Pause size={19} /> : <Play size={19} fill="currentColor" />}</button><button className="watch-control-button" type="button" onClick={() => seekBy(10)} aria-label="Forward 10 seconds" title="Forward 10 seconds"><SkipForward size={17} /></button><label className="watch-control-select"><Gauge size={15} /><select aria-label="Playback speed" value={playbackRate} onChange={(event) => setPlaybackRate(Number(event.target.value))}><option value="0.75">0.75x</option><option value="1">1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select></label><label className="watch-control-select"><Volume2 size={15} /><input aria-label="Volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>{selectedFile.kind === 'video' && <label className="watch-control-select"><span className="watch-quality-label">Quality</span><select aria-label="Video quality" value={selectedFile.path} onChange={(event) => selectQuality(event.target.value)}>{qualities.map((quality) => <option key={quality.path} value={quality.path}>{quality.label}</option>)}</select></label>}<button className="watch-control-button" type="button" onClick={() => playerFrameRef.current?.requestFullscreen()} aria-label="Fullscreen" title="Fullscreen"><Maximize size={17} /></button></div>
          </div>}
        </div>

        <aside className="watch-details">
          {selectedFile ? <><span className="watch-kicker">{selectedFile.kind === 'video' ? 'NOW PLAYING' : 'NOW LISTENING'}</span><h2>{selectedFile.title}</h2><p className="watch-path">{selectedFile.path}</p><div className="watch-detail-rule" /><div className="watch-detail-row"><span>Format</span><strong>{selectedFile.extension.slice(1).toUpperCase()}</strong></div><div className="watch-detail-row"><span>Size</span><strong>{formatBytes(selectedFile.size)}</strong></div>{selectedFile.kind === 'video' && <label className="watch-language"><Captions size={15} /><span>Language</span><select value={selectedLanguage} onChange={(event) => setSelectedLanguage(event.target.value)}><option value="off">Subtitles off</option>{subtitleOptions.map((track) => <option key={track.language} value={track.language}>{track.label}</option>)}</select></label>}</> : <><span className="watch-kicker">WATCH MODE</span><h2>Your media, quietly organized.</h2><p>Choose a video or song from the collection to begin.</p></>}
        </aside>
      </section>

      <section className="watch-library-section">
        <div className="watch-section-heading"><div><span className="watch-kicker">YOUR LIBRARY</span><h2>{tab === 'audio' ? 'Songs' : tab === 'video' ? 'Films and episodes' : 'Films, episodes, and songs'}</h2></div><div className="watch-tabs"><button className={tab === 'all' ? 'is-active' : ''} type="button" onClick={() => setTab('all')}>All <span>{files.length}</span></button><button className={tab === 'video' ? 'is-active' : ''} type="button" onClick={() => setTab('video')}>Video <span>{files.filter((file) => file.kind === 'video').length}</span></button><button className={tab === 'audio' ? 'is-active' : ''} type="button" onClick={() => setTab('audio')}>Audio <span>{files.filter((file) => file.kind === 'audio').length}</span></button></div></div>
        {selectedFile?.kind === 'audio' && <div className="watch-lyrics-panel"><div className="watch-lyrics-tabs"><button className={playerTab === 'overview' ? 'is-active' : ''} type="button" onClick={() => setPlayerTab('overview')}>Overview</button><button className={playerTab === 'lyrics' ? 'is-active' : ''} type="button" onClick={() => setPlayerTab('lyrics')}><ListMusic size={15} />Lyrics {selectedFile.lyrics.length > 0 && <span>{selectedFile.lyrics.length}</span>}</button></div>{playerTab === 'lyrics' && <div className="watch-lyrics-scroll">{selectedFile.lyrics.length === 0 ? <p className="watch-muted">Add an `.lrc` file beside the song to see synchronized lyrics.</p> : selectedFile.lyrics.map((line, index) => <button className={index === activeLyricIndex ? 'is-active' : ''} type="button" key={`${line.time}-${index}`} onClick={() => { setCurrentTime(line.time); if (playerRef.current) playerRef.current.currentTime = line.time }}>{line.text}</button>)}</div>}</div>}
        <div className="watch-media-grid">{visibleFiles.map((file) => <button className={`watch-media-item ${file.path === selectedPath ? 'is-selected' : ''}`} type="button" key={file.path} onClick={() => changeMedia(file)}><span className={`watch-media-icon ${file.kind}`}>{file.kind === 'video' ? <Play size={17} fill="currentColor" /> : <AudioLines size={17} />}</span><span className="watch-media-copy"><strong>{file.title}</strong><small>{file.kind === 'video' ? 'Video' : 'Song'} · {file.extension.slice(1).toUpperCase()}</small></span><span className="watch-media-arrow">{file.path.split('/').slice(-2, -1)[0] ?? 'Library'}</span></button>)}</div>
        {visibleFiles.length === 0 && !isLoading && <div className="watch-no-results"><Search size={20} /><p>No media matches this view.</p></div>}
      </section>
    </main>
  </div>
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
````

## File: src/index.css

````css
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');

:root {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html { background: #111917; }
body { min-width: 320px; margin: 0; }
#root { min-height: 100svh; }
````

## File: src/main.tsx

````ts
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
````

## File: src/shared/format.ts

````ts
export const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
````

## File: src/styles.d.ts

````ts
declare module '*.css'
````

## File: src/types.ts

````ts
export type FileKind = 'document' | 'image'
export type PreviewKind = 'markdown' | 'image' | 'pdf' | 'text' | 'epub' | 'download'

export type LibraryFile = {
  path: string
  name: string
  kind: FileKind
  category: string
  categoryPath: string
  folderPath: string
  extension: string
  title: string
  previewKind: PreviewKind
  mimeType: string
  size: number
  modifiedAt: string
}

export type FolderNode = {
  name: string
  path: string
  documents: LibraryFile[]
  images: LibraryFile[]
  children: FolderNode[]
}

export type CategorySummary = {
  name: string
  path: string
  documents: number
  images: number
  folders: number
}

export type LibraryResponse = {
  root: string
  generatedAt: string
  stats: {
    documents: number
    images: number
    folders: number
    categories: number
  }
  categories: CategorySummary[]
  folders: FolderNode[]
  files: LibraryFile[]
}

export type ContentResponse = {
  path: string
  content: string
  modifiedAt: string
}

export type UploadClassification = {
  category: string
  suggestedFileName: string
  summary: string
  tags: string[]
  confidence: number
  source: 'ai' | 'rules'
}

export type UploadResponse = {
  upload: {
    id: string
    originalName: string
    extension: string
    mimeType: string
    previewKind: PreviewKind
    size: number
    uploadedAt: string
    classification: UploadClassification
    previewText: string
  }
}

export type UploadCommitResponse = {
  path: string
  file: LibraryFile | null
}

export type EbookResponse = {
  path: string
  fileName: string
  file: LibraryFile | null
}

export type AuthSessionResponse = {
  authenticated: boolean
  required: boolean
}

export type LyricLine = {
  time: number
  text: string
}

export type MediaQuality = {
  label: string
  path: string
  mimeType: string
}

export type SubtitleTrack = {
  label: string
  language: string
  path: string
}

export type MediaFile = {
  path: string
  name: string
  title: string
  kind: 'video' | 'audio'
  extension: string
  mimeType: string
  size: number
  modifiedAt: string
  lyrics: LyricLine[]
  qualities: MediaQuality[]
  subtitles: SubtitleTrack[]
}

export type MediaResponse = {
  root: string
  generatedAt: string
  files: MediaFile[]
}

export type ReadingView = 'all' | 'bookmarked' | 'completed'
export type Theme = 'light' | 'dark'
export type ReadingScale = 'standard' | 'large'
````

## File: tsconfig.app.json

````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
````

## File: tsconfig.json

````json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}
````

## File: tsconfig.server.json

````json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["node"],
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noEmit": true
  },
  "include": ["server"]
}
````

## File: webpack.config.mjs

````js
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'

const { DefinePlugin } = webpack

const currentFile = fileURLToPath(import.meta.url)
const projectRoot = path.dirname(currentFile)
const isProduction = process.env.NODE_ENV === 'production'
const apiOrigin = process.env.API_ORIGIN ?? process.env.VITE_API_ORIGIN ?? ''

export default {
  mode: isProduction ? 'production' : 'development',
  entry: path.resolve(projectRoot, 'src/main.tsx'),
  output: {
    path: path.resolve(projectRoot, 'dist'),
    filename: isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js',
    chunkFilename: isProduction ? 'assets/[name].[contenthash:8].chunk.js' : 'assets/[name].chunk.js',
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults', modules: false }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg|avif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(projectRoot, 'index.html'),
      minify: isProduction,
    }),
    new DefinePlugin({
      __API_ORIGIN__: JSON.stringify(apiOrigin),
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
  performance: {
    hints: 'warning',
  },
  devServer: {
    host: '0.0.0.0',
    port: 4444,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.resolve(projectRoot, 'public'),
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:4445',
        changeOrigin: true,
      },
    ],
  },
}
````

