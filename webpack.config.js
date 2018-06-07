const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        demo: path.resolve(__dirname, './main/demo.js'),
        logsys: path.resolve(__dirname, './main/logsys.js'),
        lazy: path.resolve(__dirname, './main/lazy.js')
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },{
            test: /\.sass$/,
            use: ['style-loader', 'css-loader','sass-loader']
        },
        //{
        // 	test: /\.js$/,
        // 	exclude: /node_modules/
        // }
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8000,
        open: true,
        index: 'index.html'
    }
}