# Darkest Dungeon
A Darkest Dungeon clone built with web technology.

## Getting started

> You need to own and have a local installation of Darkest Dungeon on your device. This is because this project relies on assets imported from Darkest Dungeon. If you do not own Darkest Dungeon you will need to modify this project with your own assets.

- Install a package manager (ie. [npm](https://www.npmjs.com)) on your machine
- Clone this repository
- Run `npm install` in the project root folder (or the equivalent of the package manager of your choice)
- Run `ts-node ./dev/importAssets.ts <path-to-steam-directory>`

> Requires [SoX](http://sox.sourceforge.net/) CLI to be installed

> Don't have webpack-dev-server running while importing as this might interfere with the file system.

- Run `npm run dev-server` in the project root folder
- Visit `localhost:8080` in your browser
