const path = require('path');

module.exports = {
    entry: './src/ModuleGenerator.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],

    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        alias: {
            '~': path.resolve(__dirname, 'src')
        }
    },
    devtool: 'inline-source-map',
};