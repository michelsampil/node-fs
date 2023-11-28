# node-ts

## Creating a Node TS project

- mkdir my-ts-project
- cd my-ts-project
- npm init -y
- npm install typescript
- npm install ts-node --save-dev

## Live-reloading - Nodemon for ts

- npm install nodemon --save-dev
- create a new file named nodemon.json with the following content

{
"watch": ["src"], // Specify the directory to watch for changes (e.g., your source code directory).
"ext": "ts", // Specify the file extension to watch (TypeScript files in this case).
"exec": "ts-node", // The command to execute when changes are detected.
"delay": 500, // Optional: Add a delay to avoid excessive recompilation.
"legacyWatch": true // Optional: Enable the legacy watch mode if needed.
}

- update the package.json script section

"scripts": {
"start": "nodemon src/app.ts"
}

## How to run

- npm install
- npm run start
