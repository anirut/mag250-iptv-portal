'use strict'

require('consoleplusplus');
var request = require('request');
var cheerio = require('cheerio');
var grubber = module.exports = {
	urls: {
		films: 'http://ex.ua/rss/2'
	},
	films: {
		init: function(next) {
			grubber.films.list(next);
		},
		list: function(next) {
			console.time('EX list');
			new Promise(function(resolve, reject) {
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
						resolve(filmsList);
					} else reject( new Error(error) );
				});
			})
			.then(function(l) { next({ list: l }) })
			.catch(function(e) { next({ error: e }) });
			console.timeEnd('EX list');
		},
		getPoster: function($, ent) {
			if (!$ || !ent) return;
			var tmpSrc = $(ent).children('description').text().trim(),
				reg = /(http:\/\/fs\w+\.[a-z./0-9]+[^?])/g;
			return tmpSrc.match(reg);
		},
		getStream: function(url, next) {
			if (!url) next({ error: 'grubber.getStream::Need pass url!' });

			console.time('EX stream');
			new Promise(function(resolve, reject) {
				request(url, function(error, response, body) {
					if (!error) {
						var $ = cheerio.load(body);
						var html = $('body').html();
						var reg = /player_list[a-z0-9_='"{}/:,. ]+/g;
						var list = html.match(reg);
						if (list && list[0]) resolve(list[0].match(/http[:/.a-z0-9]+/g));
						else reject('There is no player_list in html');
					} else reject( new Error(error) );
				});
			})
			.then(function(s) { next({ stream: s }) })
			.catch(function(e) { next({ error: e }) });
			console.timeEnd('EX stream');
		}
	}
};