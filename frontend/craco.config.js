const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#8785A2",
              "@input-bg": "#E3E3E3",
              "@border-radius-base": "7px",
              "@input-border-color": "#E3E3E3",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
