setTimeout(function stop(){},2000);
if(main_ret == 179 /* already hacked */ || main_ret == 0 /* success */)
{
    alert("You're all set!");
    read_ptr_at(0);


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
//		payload = new Uint32Array(newbuffer.buffer);
	manejoCookies(document.cookie,false);
	window.mira_blob_2_len = nuevaLen;
	window.mira_blob_2 = malloc(window.mira_blob_2_len);
	write_mem(window.mira_blob_2, payload);
};
xhr.send();
}
else
    alert("Jailbreak failed! Reboot your PS4 and try again.");