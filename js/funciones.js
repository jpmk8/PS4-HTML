// JavaScript Document
function getParams(url){
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
    while(match = regex.exec(url)) {
        params[match[1]] = match[2];
    }
    return params;
}

function getCookies(){
	var regex = /([^=]+)=([^;]*)(; |)/g,
    cookies = {},
	match;
    while(match = regex.exec(decodeURIComponent(document.cookie))) {
        cookies[match[1]] = match[2];
    }
	return cookies;
}

function manejoCookies(valores,crear){
    var d = new Date();
	if(!crear)
		valores = decodeURIComponent(valores);
    d.setTime(d.getTime() + (60*1000*( (crear)?1:-1 )));
	valores.split(';').forEach(function (v){
        document.cookie = v + ';expires=' +  d.toUTCString();
    });
}

function loadScript(url) {
    var script = document.createElement("script"); 
    script.src = url; 
    document.body.appendChild(script); 
}
function toHEX4(int){
    hex = int.toString(16);
    hex = ('0x00000000'.slice(0, 10 - hex.length) + hex).replace(/0x([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/,'$4$3$2$1');
    return hex; //parseInt(hex);
}
function versionPS4(ua){
	version=/PlayStation.*4\.55.*601\.2/.test(ua)?455:
            /PlayStation.*5\.05.*601\.2/.test(ua)?505:
			/PlayStation.*6\.72.*605\.1\.15/.test(ua)?672:0;
}





