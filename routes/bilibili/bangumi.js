const axios = require('axios');
const template = require('../../utils/template');
const config = require('../../config');

module.exports = async (ctx) => {
    const seasonid = ctx.params.seasonid;

    const response = await axios({
        method: 'get',
        url: `https://bangumi.bilibili.com/jsonp/seasoninfo/${seasonid}.ver?callback=seasonListCallback&jsonp=jsonp&_=${+new Date()}`,
        headers: {
            'User-Agent': config.ua,
            'Referer': `https://bangumi.bilibili.com/anime/${seasonid}/`
        }
    });

    const data = JSON.parse(response.data.match(/^seasonListCallback\((.*)\);$/)[1]).result || {};

    ctx.body = template({
        title: data.title,
        link: `https://bangumi.bilibili.com/anime/${seasonid}/`,
        description: data.evaluate,
        item: data.episodes && data.episodes.map((item) => ({
            title: `第${item.index}话 ${item.index_title}`,
            description: `更新时间：${item.update_time}<img referrerpolicy="no-referrer" src="${item.cover}">`,
            pubDate: new Date(item.update_time).toUTCString(),
            link: item.webplay_url
        })),
    });
};