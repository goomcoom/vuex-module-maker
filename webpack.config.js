const path = require('path');

module.exports = {
    entry: './dist/ModuleGenerator.js',
    output: {
        filename: 'ModuleGenerator.min.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        alias: {
            '~': path.resolve(__dirname, 'src')
        }
    },
    devtool: 'inline-source-map',
};