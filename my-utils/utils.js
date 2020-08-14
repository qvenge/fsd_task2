const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function setPage(pagePath) {
    return Object.assign({ path: pagePath }, path.parse(pagePath));
}

function getEntries(pages) {
    return pages.reduce((result, page) => {
        result[page.name] = page.path.replace(new RegExp(`${page.ext}$`), '.js');
        return result;
    }, {});
}

function getEntryNames(pages) {
    return pages.map(page => page.name);
}

function getHtmlPlugins(pages) {
    return pages.map(page =>
        new HtmlWebpackPlugin({
            chunks: [page.name],
            filename: `${page.name}.html`,
            template: page.path
        })
    );
}

module.exports = { setPage, getEntries, getEntryNames, getHtmlPlugins };