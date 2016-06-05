'use strict'

var request = require('request');
module.exports = {
	getPoster: function(entity) {
		return new Promise(function(resolve, reject) {
			request({
				uri: entity.poster,
				encoding: 'binary'
			}, function(error, response, body) {
				if (!error) {
					entity.poster = [
						'data:', response.headers['content-type'], ';base64,',
						new Buffer(body.toString(), 'binary').toString('base64')
					].join('');
					resolve(entity);
				} else reject( new Error(error) );
			});
		});
	}
};