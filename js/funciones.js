function loadScript(url) {
    var script = document.createElement("script"); 
    script.src = url; 
    document.body.appendChild(script); 
}
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
	return /PlayStation.*4\.55.*601\.2/.test(ua)?455:
            /PlayStation.*5\.05.*601\.2/.test(ua)?505:
			/PlayStation.*6\.72.*605\.1\.15/.test(ua)?672:0;
}
function showHide(e){
	e.style.display = (e.style.display=='none')?'block':'none';
}

i = 0;
cargaCompleta=false;
script='';
function init(){
	i = 0;
	cargaCompleta=false;
	script='';
}
intervaloId=setInterval(cargando, 1000);
function cargando(){
	if(!cargaCompleta){
		document.getElementById('contador').innerHTML = document.getElementById('contador').innerHTML.replace(/\d+/,(i<100)?i++:i=0);
	}else{
		document.getElementById('contador').style.display = 'none';
		clearInterval(intervaloId);
		try{
			eval(script);
			alert('FIN de la carga');
		}catch(e){
			alert('Error en funciones.js->cargando(): '+e);
		}
	}
		
} 

function run(f){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', f, true);
	xhr.responseType = (/\.js$/.test(f))?'text':'arraybuffer';
	var payload=[];
	xhr.onload = function(e) {
		try{
		ccode = (/\.js$/.test(f))?this.responseText:pako.ungzip(this.response,{ to: 'string' });
		script = script.replace(f, '\n//'+f+'\n\n'+ccode);
		document.getElementById("msg").innerHTML=script+'<rb>';
		cargaCompleta=--numArchivos == 0;
		}catch(e){
			alert('Error en funciones.js->run(): '+e);
		}
	};
	xhr.send();	
}





