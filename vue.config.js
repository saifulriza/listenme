// vue.config.js
module.exports = {
  //   devServer: {
  //     proxy: "http://192.168.43.191",
  //   },
  //   process: {
  //     version: 10,
  //   },
  pwa: {
    name: "Listening and Writing",
    themeColor: "#473e97",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // configure the workbox plugin
    workboxPluginMode: "GenerateSW",
    // workboxOptions: {
    //   // swSrc is required in InjectManifest mode.
    //   swSrc: "dev/sw.js"
    //   // ...other Workbox options...
    // }
  },
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      css: {
        // Note: the following config format is different between Vue CLI v4 and v3
        // For Vue CLI v3 users, please refer to css-loader v1 documentations
        // https://github.com/webpack-contrib/css-loader/tree/v1.0.1
        modules: {
          localIdentName: "[hash:4]",
        },
        localsConvention: "asIs",
      },
    },
  },
};
