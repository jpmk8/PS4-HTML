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
	return /PlayStation.*4\.55.*601\.2/.test(ua)?455:
            /PlayStation.*5\.05.*601\.2/.test(ua)?505:
			/PlayStation.*6\.72.*605\.1\.15/.test(ua)?672:0;
}
function showHide(e){
	e.style.display = (e.style.display=='none')?'block':'none';
}
function convertir(e) {
	elems=e.getElementsByTagName('textarea');
	text=elems[0];
	vars=elems[1];
    regs=[
		{reg: /\/\/.*/g,val: ''},
//		{reg: /(.*)\/\*.*\*\/(.*)/g,val: '$1$2'},
		{reg: /\s*(\||\=|\?|\+|\-|\/|\*|\<|\>|\,|\;|\:|\]|\[|\(|\)|\{|\})\s*/g,val: '$1'},
		{reg: /var /g,val: ''},
		{reg: /set_gadget/g,val: 'sg'},
		{reg: /ropchain_array/g,val: 'rca'},
		{reg: /ropchain_offset/g,val: 'rco'},
		{reg: /ropchain/g,val: 'rc'},
		{reg: /main_ret/g,val: 'mr'},
		{reg: /printf_buf_offset/g,val: 'pbo'},
		{reg: /printf_buf_end/g,val: 'pbe'},
		{reg: /printf_buf/g,val: 'pb'},
		{reg: /printf_ans/g,val: 'pa'},
		{reg: /libc_base/g,val: 'lb'},
		{reg: /webkit_base/g,val: 'wb'},
		{reg: /4294967296/g,val: '_4GB'},
/* 		{reg: /wb\+1838146/g},   //add rax, rcx
		{reg: /lb\+547636/g},    //add rax, rsi
		{reg: /wb\+5202439/g},   //and rax, rcx
		{reg: /wb\+14959219/g},  //cmp rax, rcx ; sete al
		{reg: /wb\+11676600/g},  //cmp rax, rsi ; sete al
		{reg: /wb\+1506828/g},   //imul rax, rcx
		{reg: /wb\+865136/g},    //mov [rax], cl
		{reg: /wb\+954100/g},    //mov [rax], ecx
		{reg: /wb\+2997875/g},   //mov [rax], rcx
		{reg: /wb\+14461559/g},  //mov [rax], rdi
		{reg: /wb\+8975893/g},   //mov [rdi + 0x1;0], r8
		{reg: /wb\+1026352/g},   //mov [rdi + 0x1;0], r9
		{reg: /lb\+562536/g},    //mov [rdi], cx
		{reg: /lb\+471355/g},    //mov [rdi], rax
		{reg: /wb\+7438103/g},   //mov [rsi], rax
		{reg: /lb\+270096/g},    //mov al, [rdi]
		{reg: /lb\+270800/g},    //mov ax, [rdi]
		{reg: /lb\+191169/g},    //mov eax, [rdi]
		{reg: /lb\+186490/g},    //mov rax, [rax]
		{reg: /lb\+191168/g},    //mov rax, [rdi]
		{reg: /wb\+1786005/g},   //mov rax, r11
		{reg: /lb\+759626/g},    //mov rax, r8
		{reg: /lb\+882884/g},    //mov rax, rcx
		{reg: /lb\+50775/g},     //mov rax, rdi
		{reg: /lb\+877877/g},    //mov rax, rdx
		{reg: /lb\+272260/g},    //mov rax, rsi
		{reg: /lb\+547950/g},    //mov rcx, [rdi + 0x18] ; lea rax, [rax + rcx - 1]
		{reg: /lb\+785097/g},    //mov rsp, rbp ; pop rbp
		{reg: /wb\+6227286/g},   //movsxd rax, edi
		{reg: /lb\+269973/g},    //movzx eax, al
		{reg: /lb\+11/g},        //nop
		{reg: /wb\+75236/g},     //or rax, rcx
		{reg: /wb\+3750700/g},   //pop r11 ; mov rax, rdi
		{reg: /wb\+432898/g},    //pop r8
		{reg: /wb\+10235455/g},  //pop r9
		{reg: /lb\+788575/g},    //pop rax
		{reg: /lb\+792472/g},    //pop rcx
		{reg: /lb\+206806/g},    //pop rdi
		{reg: /wb\+105267/g},    //pop rdx
		{reg: /lb\+793877/g},    //pop rsi
		{reg: /lb\+811575/g},    //pop rsp
		{reg: /lb\+523896/g},    //sar edi, cl
		{reg: /wb\+48555/g},     //setl al
		{reg: /wb\+8824269/g},   //setle al
		{reg: /lb\+389047/g},    //setne al
		{reg: /wb\+414627/g},    //shl rax, 3
		{reg: /lb\+877546/g},    //shl rax, cl
		{reg: /lb\+877568/g},    //shr rax, cl
		{reg: /lb\+877175/g},    //sub rax, rcx ; sbb rdx, rcx
		{reg: /lb\+248252/g},    //sub rdi, rsi ; mov rdx, rdi
		{reg: /lb\+785193/g},    //xor rax, rax
		{reg: /lb\+582033/g},    //xor rax, rcx
		{reg: /lb\+785347/g},    //cqo ; idiv rsi */
		{reg:/(lb|wb)\+\d+/g}, 
		//{reg:/db\(\[\d+,\d+\]\)/g},
 		{reg:/db\(\[(\d+,)+\d+\]\)/g},
    ];
    alfaNum = [...'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'];
	noUsar=/do|if|for/;//palabras reservadas
	pos={i:10,j:9,k:9,n:1};
	regs.forEach(function (exp){
//vars.value += exp.reg+'->'+exp.val+'\n';
		if(exp.val !== undefined){
			v = exp.reg.exec(text.value);
			text.value = text.value.replaceAll(exp.reg, exp.val);
			vars.value += (/[a-zA-Z].*/.test(exp.val))?exp.val + '=' + v + ';\n':'';
		}
		else{
			alert(exp.reg);
			for (v=exp.reg.exec(text.value);v!=null;pos.i++,v=exp.reg.exec(text.value)) {
				if (pos.i == alfaNum.length) {
					pos.i = 0;
					pos.j++;
					pos.n = 2;
				}
				if (pos.j == alfaNum.length) {
					pos.j = 0;
					pos.k++;
					pos.n = 3;
				}
				nom = ((pos.n > 2) ? alfaNum[pos.k] : '') + ((pos.n > 1) ? alfaNum[pos.j] : '') + alfaNum[pos.i];
				nom=(noUsar.test(nom))?nom+'_':nom;
				text.value = text.value.replaceAll((v.length>1)?v[0]:v, nom);
				vars.value += nom + '=' + ((v.length>1)?v[0]:v) + ';\n';
			}
		}
	});

}





