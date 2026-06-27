// Allows side-effect imports of global stylesheets (e.g. `import '../global.css'`
// in app/_layout.tsx). TypeScript has no built-in knowledge of CSS modules in a
// React Native project, so without this declaration, TS6's stricter module
// resolution reports "cannot find module" for any plain `.css` import.
declare module '*.css';