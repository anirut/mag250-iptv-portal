require('consoleplusplus');
var request = require('request');
var cheerio = require('cheerio');
var grubber = module.exports = {
	urls: {
		// <guid isPermaLink> ID необходимого элемента аля http://ex.ua/rss/ID </guid>
		films: 'http://ex.ua/rss/2'
	},
	films: {
		init: function(next) {
			grubber.films.list(next);
		},
		list: function(next) {
			request(grubber.urls['films'], function(error, response, body) {
				if (!error) {
					var $ = cheerio.load(body, { xmlMode: true }),
						list = $('channel').children('item'), a, title, filmsList = [];

					list.each(function(i, ent) {
						title = $(ent).children('title');
						a = $(ent).children('link');
						filmsList.push({
							title: title.text(),
							poster: grubber.films.getPoster($, ent),
							link: a.text()
						});
					});

					next({ list: filmsList });
				} else {
					next({ error: error });
				}
			});
		},
		getPoster: function($, ent) {
			if (!$ || !ent) return;
			var tmpSrc = $(ent).children('description').text().trim(),
				reg = /(http:\/\/fs\w+\.[a-z./0-9]+[^?])/g;
			return tmpSrc.match(reg);
		},
		getStream: function(url, next) {
			if (!url) next({ error: 'grubber.getStream::Need pass url!' });

			request(url, function(error, response, body) {
				if (error) next({error: error});

				var $ = cheerio.load(body);
				var html = $('body').html();
				var reg = /player_list[a-z0-9_='"{}/:,. ]+/g;
				var list = html.match(reg);

				if (list && list[0]) {
					next({ stream: list[0].match(/http[:/.a-z0-9]+/g) });
				} else {
					next({ error: 'There is no player_list in html' });
				}
			});
		}
	}
};