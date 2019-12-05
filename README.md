[![Angular Logo](https://www.vectorlogo.zone/logos/angular/angular-icon.svg)](https://angular.io/) [![Electron Logo](https://www.vectorlogo.zone/logos/electronjs/electronjs-icon.svg)](https://electronjs.org/)

# Introduction

Currently runs with:

- Angular v7.1.4
- Electron v4.0.0
- Electron Builder v20.28.1

With this sample, you can :

- Run your app in a local development environment with Electron & Hot reload
- Run your app in a production environment
- Package your app into an executable file for Linux, Windows & Mac

## Getting Started

Clone this repository locally :

- Install GitKraken: https://nodejs.org/dist/v10.14.2/node-v10.14.2-x64.msi

> 1- Open GitKraken

> 2- Log in with your github account

> 3- Clone the project

> ``` bash
> git clone https://github.com/paduction/TodoManager.git
> ```

Install dependencies with npm :

- Install NodeJs: https://www.gitkraken.com/download/windows64
- Open up your terminal and go where the file was installed: ```"cd pathname\TodoManager"```
- Install the latest version of Angular with command:  ```"npm install -g @angular/cli"```

> ``` bash
> npm install
> ```

There is an issue with `yarn` and `node_modules` that are only used in electron on the backend when the application is built by the packager. Please use `npm` as dependencies manager.


If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

``` bash
npm install -g @angular/cli
```

## To build for development

- **in a terminal window** -> npm start

You can use your Angular + Electron app in a local development environment with hot reload !

The application code is managed by `main.ts`. In this sample, the app runs with a simple Angular App (http://localhost:4200) and an Electron window.
You can disable "Developer Tools" by commenting `win.webContents.openDevTools();` in `main.ts`.

## Included Commands

|Command|Description|
|--|--|
|`npm run ng:serve:web`| Execute the app in the browser |
|`npm run build`| Build the app. Your built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Your built files are in the /dist folder. |
|`npm run electron:local`| Builds your application and start electron
|`npm run electron:linux`| Builds your application and creates an app consumable on linux system |
|`npm run electron:windows`| On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems |
|`npm run electron:mac`|  On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |

⚠ ⚠ Do this in the Terminal to interrupt the program: "Ctrl+C" ⚠ ⚠

**Your application is optimised. Only /dist folder and node dependencies are included in the executable.**

## You want to use a specific lib (like rxjs) in electron main thread ?

You can do this! Just by importing your library in npm dependencies (not devDependencies) with `npm install --save`. It will be loaded by electron during build phase and added to the final package. Then use your library by importing it in `main.ts` file. Easy no ?

## Browser mode

Maybe you want to execute the application in the browser with hot reload ? You can do it with `npm run ng:serve:web`.
Note that you can't use Electron or NodeJS native libraries in this case. Please check `providers/electron.service.ts` to watch how conditional import of electron/Native libraries is done.

## How configure angular with electron ?

* Source 1: https://alligator.io/angular/electron/
* Source 2: https://angularfirebase.com/lessons/desktop-apps-with-electron-and-angular/

## How configure the communication port between client side (angular) and server side ?

* Client side (Angular)

- Go where the file project "TodoManager" is located
- Once inside the "TodoManager" file, you have to go: *src / assets / config*
- Inside the "config" file you find the config.json

> Open it, then configure the __ws_url__ property:
>> * default is __8080__ port with "http://localhost: **8080**"
>> * if you want communicate with the __8081__ port, you replace it by "http://localhost: **8081**"

* Server side (Angular)

- Go where the file project "TodoManager" is located
- Once inside the "TodoManager" file, you have to go: *server / config*
- Inside the "config" file you find the config.json
- Open it, then configure the __port__ property:

> * default is __8080__ port with *port: "__8080__"*
> * if you want communicate with the __8081__ port, you replace it by *port: "__8081__"*

⚠ You have to restart all (client and server side) ! ⚠

## TodoManager

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.5, NodeJS (+NPM) and electron.

## Authors

* Maxime Kellner
* David Cellier
