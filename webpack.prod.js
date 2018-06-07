const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        utility: path.resolve(__dirname, './build.js'),
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.sass$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            }
        ]
    },
    devtool: 'source-map'
}