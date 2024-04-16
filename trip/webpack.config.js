const path = require('path');

module.exports = {
    // Other webpack configuration options...

    resolve: {
        fallback: {
            zlib: require.resolve('browserify-zlib'), // for zlib
            path: require.resolve('path-browserify'), // for path
            crypto: require.resolve('crypto-browserify'), // for crypto
            fs: false, // for fs
            stream: require.resolve('stream-browserify') // for stream
        }
    },

    // Other webpack configuration options...
};
