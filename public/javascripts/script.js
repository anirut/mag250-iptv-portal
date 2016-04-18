$(function() {
	// var player = new Player();
	$('body').on('keydown', function(e) {
		var kCode = e.which || e.keyCode;

		$('#kCode').html(kCode);
		// player.init();

		switch(kCode) {
			case 112: // ok 
				window.location.reload() || location.reload();	
				break;
			// case 82: //play/pause
			// 	player.play('http://data08-cdn.datalock.ru/fi2lm/74d00f7d6545f2d3360a5e8137342379/7f_Borodach.01.a1.26.01.16.mp4');
			// 	break;
			// default:
			// 	player.stop();
			// 	break;
		}
	});

	// var list = {
	// 	'Физрук download': 'https://fs.to/get/dl/5q1zvlj19dnb95lsb35027jx2.0.1139013157.974127405.1460732823/Fizruk.s03e07.2016.SATRip.avi',
	// 	'Бородач stream': 'http://data08-cdn.datalock.ru/fi2lm/74d00f7d6545f2d3360a5e8137342379/7f_Borodach.01.a1.26.01.16.mp4',
	// 	'Физрук stream': 'http://n41.filecdn.to/ff/YWVhMTM1MWE3YTYxZmFlMGQ2MGNiOTY3YjU0NmYzMWN8ZnN0b3wzMjgwNjI1MjUzfDEwMDAwfDJ8MHxufDQxfGI2YTRiYTdlZmQ3ZGYzOTMzNjkxZWY4MjZlMTNlMTkzfDB8MjE6Ny4xMjphfDB8MTIzMzExNDY2NnwxNDYwOTQwMzYxLjkwMjE,/playvideo_5q1zvlobdgzwaame6jcnivd6e.0.1765758616.974127405.1460732825.mp4'
	// };

	// stbEvent = {
	// 	onEvent : function(data){},
	// 	event : 0
	// };
	var stb = gSTB;

	// stb.InitEvents();
	stb.InitPlayer();
	stb.Play('auto http://hdgo.louvre.zerocdn.com/2a283c033561ced9645a27e4fe5f5a1a:2016041803/flv/720-58fe074c1cad1beb2e255cda47f590bf.flv');
	$('body').fadeOut();

	var debug = {
		'IsPlaying': stb.IsPlaying(),
		'AudioPIDs': stb.GetAudioPIDs(),
		'AudioPID':  stb.GetAudioPID(),
		'VideoInfo': stb.GetVideoInfo(),
		'MetadataInfo': stb.GetMetadataInfo(),
		'Speed': stb.GetSpeed(),
		'Position': stb.GetPosTimeEx(),
		'Duration': stb.GetMediaLenEx(),
		'BufferLoad': stb.GetBufferLoad()
	}, ent, ul = $('<ul>');

	for (ent in debug) {
		ul.append($('<li>').text( [ent, ' : ', debug[ent]].join('') ));
	}
	$('body').append(ul);
});

// function Player() { this.stb = (typeof gSTB != 'undefined') ? gSTB : false; }
// Player.prototype.init = function() { return this.stb && this.stb.InitPlayer(); }
// Player.prototype.play = function(url) { this.stb.Play(['auto ', url].join('')); }
// Player.prototype.stop = function() { this.stb.Stop(); }