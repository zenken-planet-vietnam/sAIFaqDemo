const path = require('path');
//  const fs = require('fs')
module.exports = {
  //if you run with https
  //  devServer:{
  //     https: {
  //       key: fs.readFileSync('./certificates/localhost-key.pem'),
  //       cert: fs.readFileSync('./certificates/localhost.pem'),
  //     },
  //     public: 'https://localhost:8080/'
  //   },
  configureWebpack: {
    resolve: {

      alias: {
        //aliases go here  
        //    '@': path.resolve('src'),
        '@axios': path.resolve(__dirname, 'src/axios'),
        '@core': path.resolve(__dirname, 'src/@core'),
      },
    },
  },

}