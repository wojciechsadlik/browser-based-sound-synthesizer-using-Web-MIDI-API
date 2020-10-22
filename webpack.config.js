const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        publicPath: 'public',
        filename: 'index.js',
        path: path.resolve(__dirname, 'public')
    },
    devServer: {
        publicPath: '/',
        contentBase: './public',
        hot: true
    }
}