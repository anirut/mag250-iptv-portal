'use strict'

require('consoleplusplus');
var request = require('request');
var cheerio = require('cheerio');
var img2Base64 = require('./img2cssBase64.js');
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
							list = $('channel').children('item'),
							a, title, desc, prPosterList = [];

						list.each(function(i, ent) {
							title = $(ent).children('title');
							a = $(ent).children('link');
							desc = $(ent).children('description').text().trim();
							prPosterList.push(
								grubber.films.getPoster($, {
									title: title.text(),
									poster: desc,
									link: a.text()
								})
							);
						});

						Promise.all(prPosterList)
							.then(resolve, function(error) { reject( new Error(error) ) });
					} else reject( new Error(error) );
				});
			})
			.then(function(l) { next({ list: l }) })
			.catch(function(e) { next({ error: e }) });
			console.timeEnd('EX list');
		},
		getPoster: function($, ent) {
			if (!$ || !ent.poster) return new Error('ex:getPoster:cherrio or ent.poster isn\'t found');
			var tmp = ent.poster.match(/http:\/\/fs\w+\.[a-z./0-9?]+/g);
			ent.poster = tmp.length ? tmp[0].replace(/\d{3}$/g, '200') : ent.poster;
			return img2Base64.getPoster(ent);
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