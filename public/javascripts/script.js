$(function() {
	$('#content .item').first().focus();

	$('body').on('keydown', switcher);

	/*
		Init vlc player with events
	*/
		// stbEvent = {
		// 	onEvent : function(data){},
		// 	event : 0
		// };
		var stb = gSTB;

		// stb.InitEvents();
		stb.DeinitPlayer();
		stb.Stop();
		stb.InitPlayer();
		stb.SetVolume(85);
		// stb.Play('auto http://fs.to/get/playvideo/64z34idird3n3vgp397ts9pdi.0.1139013157.2185543202.1464866031.mp4');
		// $('#content').fadeOut();

		// debug(stb);
});

function debug(stb) {
	var debugPlayer = {
		'IsPlaying': stb.IsPlaying(),
		'AudioPIDs': stb.GetAudioPIDs(),
		'AudioPID':  stb.GetAudioPID(),
		'VideoInfo': stb.GetVideoInfo(),
		'MetadataInfo': stb.GetMetadataInfo(),
		'Speed': stb.GetSpeed(),
		'Position': stb.GetPosTimeEx(),
		'Duration': stb.GetMediaLenEx(),
		'BufferLoad': stb.GetBufferLoad()
	}, tmp = $('<div>');

	for (ent in debugPlayer) {
		tmp.append( $('<div>').text([ent, ' : ', debugPlayer[ent]].join('')) );
	}
	$('#kCode').html( tmp.html() ).show();
	tmp = null;
}
function switcher(evt) {
	var kCode = evt.which || evt.keyCode,
		item = $('#content .item:focus'),
		stb = gSTB;

	$('#kCode').html(kCode).show();

	switch(kCode) {
		case 112: // f1
			window.location.reload() || location.reload();	
			break;
		case 13: // ok
			getStreamLink(evt);
			break;
		case 37: // left
			if (stb.IsPlaying()) {
				stb.SetPosPercentEx( stb.GetPosPercentEx() - 1000 );
			} else {
				item.prev('.item').focus();
			}
			break;
		case 39: // right
			if (stb.IsPlaying()) {
				stb.SetPosPercentEx( stb.GetPosPercentEx() + 1000 );
			} else {
				item.next('.item').focus();
			}
			break;
		case 49: // 1
			window.location.href = '/films?type=fs';
			break;
		case 50: // 2
			window.location.href = '/films?type=ex';
			break;
		case 38, 40: // up & down
			break;
		case 82: // pause/resume
			stb.IsPlaying() ? stb.Pause() : stb.Continue();
			break;
		case 83: // stop
			stb.Stop();
			$('#content').fadeIn();
			break;
		case 107: // volume up
			stb.SetVolume( stb.GetVolume() + 10 );
			break;
		case 109: // volume down
			stb.SetVolume( stb.GetVolume() - 10 );
			break;
		case 8: // back
			window.location.href = '/';
			break;
	}
}
function getStreamLink(evt) {
	var tgt = $(evt.target);
	var url = ['/getStream?url=', tgt.data('src'), '&type=', tgt.parent().data('type')].join('');
	$.getJSON(url, function(data) {
		if (data) {
			gSTB.Play( ['auto ', data].join('') );
			$('#content').fadeOut();
		}
	});
}

// function Player() { this.stb = (typeof gSTB != 'undefined') ? gSTB : false; }
	// Player.prototype.init = function() { return this.stb && this.stb.InitPlayer(); }
	// Player.prototype.play = function(url) { this.stb.Play(['auto ', url].join('')); }
	// Player.prototype.stop = function() { this.stb.Stop(); }