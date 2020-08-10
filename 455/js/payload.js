// JavaScript Document
var cookies = getCookies();
if(/\.bin/.test(cookies['payload'])){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', cookies['payload'], true);
    xhr.responseType = 'arraybuffer';
    var payload=[];
    xhr.onload = function(e) {
        payload = new Uint32Array(this.response);
    };
    xhr.send();
}
else if (/\.js/.test(cookies['payload']))
    loadScript(url)

setTimeout(aguardandoPlayload, 200);

manejoCookies(document.cookie,false);