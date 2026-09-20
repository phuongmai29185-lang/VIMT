const $=id=>document.getElementById(id);
const input=$('fileInput'),canvas=$('canvas'),ctx=canvas.getContext('2d');
let img=null,name='anh-the';
const sizes={'2x3':[2,3],'3x4':[3,4],'4x6':[4,6]};

function fit(){
 if(!img)return;
 const [w,h]=sizes[$('size').value],dpi=300;
 canvas.width=Math.round(w/2.54*dpi);canvas.height=Math.round(h/2.54*dpi);draw();
}
function draw(){
 if(!img)return;
 ctx.fillStyle=$('bg').value;ctx.fillRect(0,0,canvas.width,canvas.height);
 const iw=img.naturalWidth,ih=img.naturalHeight,target=canvas.width/canvas.height,r=iw/ih;
 let sw=iw,sh=ih,sx=0,sy=0;
 if(r>target){sw=ih*target;sx=(iw-sw)/2}else{sh=iw/target;sy=(ih-sh)/2}
 const zoom=+$('zoom').value/100,scale=Math.max(canvas.width/sw,canvas.height/sh)*zoom;
 const dw=sw*scale,dh=sh*scale;
 const px=canvas.width/2+(+$('posX').value/100)*canvas.width*.35-dw/2;
 const py=canvas.height/2+(+$('posY').value/100)*canvas.height*.35-dh/2;
 ctx.imageSmoothingQuality='high';ctx.drawImage(img,sx,sy,sw,sh,px,py,dw,dh);
 const s=sizes[$('size').value];
 $('dimension').textContent=`${s[0]} × ${s[1]} cm • ${canvas.width}×${canvas.height}px`;
}
input.addEventListener('change',e=>{
 const f=e.target.files[0];if(!f)return;
 name=f.name.replace(/\.[^.]+$/,'');
 const url=URL.createObjectURL(f);img=new Image();
 img.onload=()=>{
  $('editor').classList.remove('disabled');$('status').textContent='Đã tải ảnh';$('fileName').textContent=f.name;
  document.querySelector('.preview-wrap').classList.add('has-image');fit();URL.revokeObjectURL(url);
 };img.src=url;
});
['posX','posY','zoom','size','bg'].forEach(id=>$(id).addEventListener('input',fit));
$('resetBtn').onclick=()=>{$('posX').value=0;$('posY').value=0;$('zoom').value=100;draw()};
$('downloadBtn').onclick=()=>{
 if(!img)return alert('Hãy chọn ảnh trước.');
 const a=document.createElement('a');a.download=name+'_anh-the_'+$('size').value+'.jpg';
 a.href=canvas.toDataURL('image/jpeg',+$('quality').value);a.click();
};
$('sheetBtn').onclick=()=>{
 if(!img)return alert('Hãy chọn ảnh trước.');
 const a4=document.createElement('canvas'),d=a4.getContext('2d'),dpi=150;
 a4.width=Math.round(21/2.54*dpi);a4.height=Math.round(29.7/2.54*dpi);
 d.fillStyle='#fff';d.fillRect(0,0,a4.width,a4.height);
 const gap=Math.round(.35*dpi/2.54),cw=canvas.width/2,ch=canvas.height/2;
 const margin=Math.round(1*dpi/2.54),cols=Math.floor((a4.width-margin*2+gap)/(cw+gap)),rows=Math.floor((a4.height-margin*2+gap)/(ch+gap));
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)d.drawImage(canvas,margin+x*(cw+gap),margin+y*(ch+gap),cw,ch);
 const a=document.createElement('a');a.download=name+'_A4.jpg';a.href=a4.toDataURL('image/jpeg',.95);a.click();
};
$('themeBtn').onclick=()=>document.body.classList.toggle('dark');