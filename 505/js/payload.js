cookies = getCookies();
var xhr = new XMLHttpRequest();
xhr.open('GET', cookies['payload'], true);
xhr.responseType = 'arraybuffer';
var payload=[];
xhr.onload = function(e) {
	var buffer = new Uint8Array(this.response);
	var nuevaLen = buffer.length + (4 - buffer.length % 4); 
	var payload = new Uint8Array(nuevaLen);
	for(var i = 0;i < buffer.length;i++)
		payload[i]=buffer[i];
	payload = new Uint32Array(payload.buffer);
	manejoCookies(document.cookie,false);
};
xhr.send();
