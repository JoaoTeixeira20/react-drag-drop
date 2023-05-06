# CREATE REACT PACKAGE

This package provides the minimum configuration to create a react package to export components with a preview for development... And it's blazingly fast!

# USAGE

## Notes before using

Create the **.env** configuration file if you want to configure the port where the dev server will run (example using bash)

    cp .env.example .env

This is the port where the esbuild server will run, default is 3000

> ESBUILD_SERVER_PORT

## Installation

    npm i

## Commands

    npm run start

To start the application on preview mode, it will start a server on default port 3000 with everything you declare on the path above, (the entrypoint of your app)

> src/development/Preview.tsx

    npm run build

To build the application for npm publishing, first ensure all you want to bundle it's included on this file

> src/index.ts

This folder is ignored from the src directory on the build process (only used to preview your app before shipping)

> src/development

# UNDER THE HOOD

## Preview

For **preview mode**, the hot reload it's implemented with feature:

https://github.com/evanw/esbuild/pull/2816

on

> public/esbuilt-hot-reload/esbuild-hot-reload.js

there is an eventSource that will listen to changes emmited by the esbuild context

the entrypoint of the server is

> public/index.html

It's implemented an error stack tracing wrapper that catches rendering erros with an error boundary

https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

this wrapper also prints the stack trace back from your components names and paths

## Build

For **build mode** it's being used tsc compiler to generate js and types declarations from

> tsconfig.build.json

That extends 

> tsconfig.json

For debugging, I have sourcemap enabled on esbuild on dev mode that enables breakpoints on the **src** directory (a vscode debugging config is included on the project)

# IMPROVEMENTS

- Error handling on hot-reload build implementations.
- Ability to select an host instead of localhost.
- Compatibility with older javascript versions (currently shipping on ES6 and dependent on project target transpilers).
- Addition of config for jest tests on developed components for build export.
- Special file types bundling (like svgs for example)
# NOTES

I'm fresh on packaging and npm publishing, I wanted to improve the bundling of types and the old javascript compatibility but relying only on esbuild

Exploring HMR solutions to implement on dev mode.
