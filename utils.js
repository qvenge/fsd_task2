const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getEntries(pages) {
    const result = {};

    for (const page of pages) {
        const parsed = path.parse(page);
        result[parsed.name] = page.replace(new RegExp(`${parsed.ext}$`), '.js');
    }

    return result;
}


function getHtmlPlugins(pages) {
    return pages.map(page => {
        const parsed = path.parse(page);

        return new HtmlWebpackPlugin({
            chunks: [parsed.name],
            filename: `${parsed.name}.html`,
            template: page
        })
    });
}

module.exports = { getEntries, getHtmlPlugins };