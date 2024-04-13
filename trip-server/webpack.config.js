// webpack.config.js

const path = require('path');

module.exports = {
  // Server-side webpack configuration
  // ...
  externals: {
    zlib: 'zlib',
    path: 'path',
    crypto: 'crypto',
    fs: 'fs',
    stream: 'stream'
  },
  // ...
};
