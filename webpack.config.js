module.exports = {
    devServer: {
        publicPath: '/dist',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                resolve: { extensions: ['.js', '.jsx'] },
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};
