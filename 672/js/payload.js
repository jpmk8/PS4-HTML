// JavaScript Document
var cookies = getCookies();
if(/\.bin/.test(cookies['payload'])){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', cookies['payload'], true);
    xhr.responseType = 'arraybuffer';
    var payload=[];
    xhr.onload = function(e) {
		var buffer = new Uint8Array(this.response);
		var nuevaLen = buffer.length; 
		while(nuevaLen % 4 != 0)
			nuevaLen++;
		var payload = new Uint8Array(nuevaLen);
		for(var i = 0;i < buffer.length;i++)
			payload[i]=buffer[i];
//		payload = new Uint32Array(newbuffer.buffer);
		manejoCookies(document.cookie,false);
		window.mira_blob_2_len = nuevaLen;
		window.mira_blob_2 = malloc(window.mira_blob_2_len);
		write_mem(window.mira_blob_2, payload);
    };
    xhr.send();
}
else if (/\.js/.test(cookies['payload']))
    loadScript(url)
function aguardandoPlayload(){}
setTimeout(aguardandoPlayload, 200);

manejoCookies(document.cookie,false);