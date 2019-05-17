module.exports = {
    watch: true,
    mode: 'development',
    entry: {
        main: './js/index.js'
    },
    output: {
        libraryTarget: 'umd',
        filename: 'build/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]

    }
};
