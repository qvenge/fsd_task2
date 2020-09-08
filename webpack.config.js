const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { setPage, getEntries, getHtmlPlugins } = require('./my-utils');
const BemIntegratorPlugin = require('./bem-integrator-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const pages = [
    setPage('./pages/uikit/formelements/formelements.pug'),
    setPage('./pages/uikit/colorsandtype/colorsandtype.pug'),
    setPage('./pages/uikit/cards/cards.pug'),
];

module.exports = {
    mode: devMode ? 'development' : 'production',

    context: path.resolve(__dirname, 'src'),
    entry: getEntries(pages),
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
    },
    output: {
        chunkFilename: '[id].chunk.js',
        path: path.resolve(__dirname, 'dist'),
        filename: (chunkData) => {
            //console.log(chunkData)
            return '[name].bundle.js';
        },
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //     },
    // },
    module: {
        rules: [
            {
                test: /\.pug$/i,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attributes: {
                                list: [
                                    {
                                        attribute: 'src',
                                        type: 'src'
                                    },
                                    {
                                        attribute: 'srcset',
                                        type: 'srcset'
                                    },
                                    {
                                        attribute: 'data-src',
                                        type: 'src'
                                    },
                                    {
                                        attribute: 'data-srcset',
                                        type: 'srcset'
                                    }
                                ]
                            }
                        },
                    },
                    {
                        loader: BemIntegratorPlugin.preHtmlLoader,
                    },
                    {
                        loader: BemIntegratorPlugin.pugHtmlLoader,
                        options: {
                            resolve: true,
                            pretty: true,
                        }
                    }
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    // devMode ? 'style-loader' :
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                            hmr: false,
                        },
                    },
                    'style-loader', 
                    'css-loader'
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // devMode ? 'style-loader' :
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                            hmr: false,
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        ...getHtmlPlugins(pages),
        new BemIntegratorPlugin({
            levels: [
                './common.blocks',
                './fsd.blocks'
            ], 
            techs: 'scss',
            scripts: 'js'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false,
        }),
    ],
    resolve: {
        modules: ['node_modules']
    }
};