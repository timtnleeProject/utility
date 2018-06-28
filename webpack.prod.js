//build script的config file 
const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        utility: path.resolve(__dirname, './build.js'),
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, './dist/build-scripts')
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: { minimize: true }
                    }
                ]
            }, {
                test: /\.sass$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: { minimize: true } //minimize css
                    },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', //babel loader to es5
                    options: {
                        presets: ['es2015']
                    }
                }
            }
        ]
    },
    devtool: 'source-map'
}