/**
* webpack.config.js
* @author Sidharth Mishra
* @description My webpack configuration for compiliing and bundling src files
* @created Fri Nov 17 2017 20:22:42 GMT-0800 (PST)
* @copyright 2017 Sidharth Mishra
* @last-modified Fri Nov 17 2017 20:22:42 GMT-0800 (PST)
*/

//# imports CommonJS style
const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
//# imports CommonJS style

//# HTMLWebpackPlugin configuration for injecting code into the app.html's body
const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, "/src/app.html"),
  filename: "./bin/app.html",
  inject: "body"
});
//# HTMLWebpackPlugin configuration for injecting code into the app.html's body

/**
 * The Webpack configuration object, configures Webpack for the project.
 */
const webpackConfig = {
  //# entry points, can be multiple files if multiple JS files are needed in the library/project
  // The key names are used for naming the outputs which use the `[name]` to resolve themselves.
  entry: {
    rrbank: path.join(__dirname, "/src/ts/Bank.tsx") // the entry point of the dependency graph
  },
  //# entry points, can be multiple files if multiple JS files are needed in the library/project

  //# output, I compile this JS code as a library
  output: {
    filename: "./bin/[name].js"
  },
  //# output, I compile this JS code as a library

  //# module specific configurations, and loaders
  module: {
    loaders: [
      //# use babel to transpile JSX and ES6
      {
        test: /\.tsx?$/i, // matches files ending with js or jsx
        loader: "awesome-typescript-loader",
        exclude: /node_modules/i
      }
      //# use babel to transpile JSX and ES6
    ]
  },
  //# module specific configurations, and loaders

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  //# plugin configurations
  plugins: [
    //# HTML webpack plugin
    // This plugin is used for easy generation of HTML content
    HTMLWebpackPluginConfig,
    //# HTML webpack plugin

    //# ProvidePlugin configuration
    // The ProvidePlugin is used for providing variables, imports automatically.
    // Because of this plugin, the moment `$` or `jQuery` or `window.jQuery` etc
    // variables are required in my code, they are resolved by Webpack by importing the "jquery"
    // library automatically for me.
    // So, I don't need to write `import jQuery from "jquery"` in my ES6 code,
    // rather I can directly use `jQuery`. Webpack will take care of resolutions :)
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "window.$": "jquery",
      "this.jQuery": "jquery",
      "this.$": "jquery"
    })
    //# ProvidePlugin configuration
  ]
  //# plugin configurations
};

//# export webpack configuration
module.exports = webpackConfig;
//# export webpack configuration
