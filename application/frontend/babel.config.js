module.exports = {
  presets: [
    "@babel/preset-env", // For transforming ES6
    "@babel/preset-react", // For transforming JSX
  ],
  plugins: [
    "@babel/plugin-transform-runtime", // For async/await and generators
  ],
  
};
