const axios = require('axios');
const template = require('../../utils/template');
const cheerio = require('cheerio');
const config = require('../../config');

module.exports = async (ctx) => {
    const response = await axios({
        method: 'get',
        url: 'https://www.jianshu.com',
        headers: {
            'User-Agent': config.ua,
            'Referer': 'https://www.jianshu.com'
        }
    });

    const data = response.data;

    const $ = cheerio.load(data);
    const list = $('.note-list li');

    ctx.body = template({
        title: '简书首页',
        link: 'https://www.jianshu.com',
        description: $('meta[name="description"]').attr('content'),
        item: list && list.map((index, item) => {
            item = $(item);
            return {
                title: item.find('.title').text(),
                description: `作者：${item.find('.nickname').text()}<br>描述：${item.find('.abstract').text()}<br><img referrerpolicy="no-referrer" src="https:${item.find('.img-blur').data('echo')}">`,
                pubDate: new Date(item.find('.time').data('shared-at')).toUTCString(),
                link: `https://www.jianshu.com${item.find('.title').attr('href')}`
            };
        }).get(),
    });
};