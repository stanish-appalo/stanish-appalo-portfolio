(function(){
var doc=document.documentElement;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var curtain=document.querySelector('.curtain');

// nav
var nav=document.querySelector('.nav');
var burger=document.querySelector('.burger');
if(burger)burger.addEventListener('click',function(){nav.classList.toggle('open');burger.textContent=nav.classList.contains('open')?'Close':'Menu'});
addEventListener('scroll',function(){nav&&nav.classList.toggle('solid',scrollY>40)},{passive:true});

// clock
var ck=document.getElementById('clock');
if(ck)(function t(){ck.textContent='Chennai '+new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'});setTimeout(t,30000)})();

// cursor dot
var dc=document.createElement('div');dc.className='dotc';document.body.appendChild(dc);
addEventListener('mousemove',function(e){dc.style.left=e.clientX+'px';dc.style.top=e.clientY+'px'});
document.querySelectorAll('a,button,.icons div').forEach(function(a){a.addEventListener('mouseenter',function(){dc.classList.add('big')});a.addEventListener('mouseleave',function(){dc.classList.remove('big')})});

// typewriter {{ name }}
var tw=document.querySelector('[data-tw]');
if(tw){var words=tw.dataset.tw.split('|'),wi=0,ci=0,del=false,out=tw.querySelector('.txt');
  (function type(){var w=words[wi];ci+=del?-1:1;out.textContent=w.slice(0,ci);
    var d=del?45:95; if(!del&&ci===w.length){del=true;d=1600} else if(del&&ci===0){del=false;wi=(wi+1)%words.length;d=350}
    setTimeout(type,d)})();}

// floating preview on project rows
var fl=document.querySelector('.float');
if(fl){var fi=fl.querySelector('img');
  addEventListener('mousemove',function(e){fl.style.left=e.clientX+'px';fl.style.top=e.clientY+'px'});
  document.querySelectorAll('[data-img]').forEach(function(r){
    r.addEventListener('mouseenter',function(){fi.src=r.dataset.img;fl.classList.add('on')});
    r.addEventListener('mouseleave',function(){fl.classList.remove('on')});
  });}

if(!window.gsap||reduce){doc.classList.add('reduce');if(curtain)curtain.remove();return;}
gsap.registerPlugin(ScrollTrigger);
var lenis=new Lenis({lerp:.085});window.__lenis=lenis;
lenis.on('scroll',ScrollTrigger.update);
gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var h=a.getAttribute('href');if(h.length>1){e.preventDefault();lenis.scrollTo(h,{offset:-70})}})});

// scribbles: prep stroke
document.querySelectorAll('.scrib path').forEach(function(p){var l=p.getTotalLength();p.style.strokeDasharray=l;p.style.strokeDashoffset=l});
function draw(svg,delay){gsap.to(svg.querySelectorAll('path'),{strokeDashoffset:0,duration:1.1,ease:'power2.inOut',stagger:.25,delay:delay||0})}

// intro: curtain up, hero lines rise
var heroLines=document.querySelectorAll('.hero .ln>span');
gsap.set(heroLines,{yPercent:110});
var tl=gsap.timeline({delay:.15});
if(curtain){tl.to(curtain.querySelector('span>span'),{yPercent:-110,duration:.6,ease:'power3.in'}).to(curtain,{yPercent:-100,duration:.9,ease:'expo.inOut'},'-=.1').set(curtain,{display:'none'});}
tl.to(heroLines,{yPercent:0,duration:1.15,ease:'expo.out',stagger:.09},'-=.45');
var hs=document.querySelector('.hero .scrib');if(hs)tl.add(function(){draw(hs)},'-=.5');

// outgoing transition for internal pages
document.querySelectorAll('a[href$=".html"]').forEach(function(a){
  a.addEventListener('click',function(e){
    if(e.metaKey||e.ctrlKey||a.target==='_blank')return;
    e.preventDefault();var href=a.getAttribute('href');
    if(!curtain){location.href=href;return}
    var lbl=curtain.querySelector('span>span');lbl.textContent=a.dataset.label||a.textContent.trim().split(' ')[0];
    gsap.set(curtain,{display:'grid',yPercent:100});gsap.set(lbl,{yPercent:110});
    gsap.timeline({onComplete:function(){location.href=href}}).to(curtain,{yPercent:0,duration:.7,ease:'expo.inOut'}).to(lbl,{yPercent:0,duration:.45,ease:'power3.out'},'-=.2');
  });
});
addEventListener('pageshow',function(e){if(e.persisted&&curtain)gsap.set(curtain,{display:'none'})});

// masked line reveals elsewhere (Chandni-style)
gsap.utils.toArray('.ln').forEach(function(l){
  if(l.closest('.hero'))return;
  gsap.from(l.children,{yPercent:110,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:l,start:'top 90%'}});
});
gsap.utils.toArray('.rv').forEach(function(el){if(el.closest('.hero')){gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',delay:1.3});return}gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}})});
gsap.utils.toArray('.scrib').forEach(function(s){if(s.closest('.hero'))return;ScrollTrigger.create({trigger:s,start:'top 80%',once:true,onEnter:function(){draw(s)}})});

// word scrub statement (Bogdan)
document.querySelectorAll('.stmt').forEach(function(s){
  s.innerHTML=s.textContent.trim().split(/\s+/).map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');
  gsap.to(s.querySelectorAll('.w'),{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:s,start:'top 75%',end:'bottom 35%',scrub:true}});
});
gsap.utils.toArray('.duo .shot img').forEach(function(i){gsap.fromTo(i,{yPercent:-10},{yPercent:0,ease:'none',scrollTrigger:{trigger:i.closest('.duo'),scrub:true}})});

gsap.utils.toArray('.drift').forEach(function(d){gsap.fromTo(d,{xPercent:d.dataset.dir==='r'?-6:6},{xPercent:d.dataset.dir==='r'?2:-2,ease:'none',scrollTrigger:{trigger:d,scrub:1}})});

// counters
document.querySelectorAll('[data-n]').forEach(function(b){var o={v:0},to=+b.dataset.n,suf=b.dataset.s||'';
  ScrollTrigger.create({trigger:b,start:'top 92%',once:true,onEnter:function(){gsap.to(o,{v:to,duration:1.8,ease:'power2.out',onUpdate:function(){b.textContent=Math.round(o.v).toLocaleString('en-IN')+suf}})}})});

// magnetic CTAs
document.querySelectorAll('.cta,.mag').forEach(function(m){
  m.addEventListener('mousemove',function(e){var r=m.getBoundingClientRect();gsap.to(m,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.4,duration:.4})});
  m.addEventListener('mouseleave',function(){gsap.to(m,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'})});
});
})();
(function(){var h=document.querySelector('.hscript');if(!h)return;if(!window.gsap||matchMedia('(prefers-reduced-motion: reduce)').matches){h.style.opacity=1;return}
gsap.fromTo(h,{opacity:0,scale:.6,rotate:-20},{opacity:1,scale:1,rotate:-3,duration:.9,ease:'back.out(2)',delay:2.1});})();
(function(){
document.querySelectorAll('.tear').forEach(function(t){var w=1000,h=44,p=[],x=0;while(x<=w){p.push(x+','+(10+Math.random()*24).toFixed(1));x+=6+Math.random()*16}p.push(w+','+(10+Math.random()*24).toFixed(1));
  var d=t.dataset.flip?'M0,0 L'+p.join(' L')+' L'+w+',0Z':'M0,'+h+' L'+p.join(' L')+' L'+w+','+h+'Z';
  t.innerHTML='<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none"><path d="'+d+'" fill="'+t.dataset.fill+'"/></svg>'});
var hls=document.querySelectorAll('.hl');
if(!window.gsap||matchMedia('(prefers-reduced-motion: reduce)').matches){hls.forEach(function(h){h.classList.add('on')});return}
hls.forEach(function(h){ScrollTrigger.create({trigger:h,start:'top 88%',once:true,onEnter:function(){h.classList.add('on')}})});
gsap.utils.toArray('.hero>.bg img,.hero>.bg video').forEach(function(i){gsap.to(i,{yPercent:12,ease:'none',scrollTrigger:{trigger:i.closest('.hero'),start:'top top',end:'bottom top',scrub:true}})});
gsap.utils.toArray('.strip img').forEach(function(i){gsap.fromTo(i,{yPercent:-18},{yPercent:0,ease:'none',scrollTrigger:{trigger:i.parentNode,scrub:true}})});
var t=document.querySelectorAll('.title .ch>span');
if(t.length){gsap.from(t,{yPercent:110,duration:1.1,ease:'expo.out',stagger:.06,scrollTrigger:{trigger:'.title',start:'top 85%'}});
  gsap.from('.title .badge',{scale:0,rotate:-180,duration:1.2,ease:'back.out(1.6)',scrollTrigger:{trigger:'.title',start:'top 85%'}})}
if(document.querySelector('.pols'))gsap.from('.pol',{y:140,opacity:0,rotate:function(i){return i%2?14:-14},duration:1.2,ease:'expo.out',stagger:.1,scrollTrigger:{trigger:'.pols',start:'top 80%'}});
document.querySelectorAll('.marq').forEach(function(el,k){var tr=el.querySelectorAll('.track'),x=0,sp=0,dir=k%2?1:-1,last=scrollY;
  gsap.ticker.add(function(){var w=tr[0].offsetWidth;if(!w)return;var v=Math.abs(scrollY-last);last=scrollY;sp=Math.max(sp*.9,Math.min(v*.4,16));x+=(.6+sp)*dir;if(x<=-w)x+=w;if(x>0)x-=w;tr.forEach(function(q){q.style.transform='translateX('+x+'px)'})})});
var st=document.querySelector('#stk');
if(st){gsap.to(st,{rotate:200,transformOrigin:'50% 50%',ease:'none',scrollTrigger:{trigger:'.band',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.fromTo('.sticker',{scale:.6},{scale:1.05,ease:'none',scrollTrigger:{trigger:'.band',start:'top bottom',end:'center center',scrub:1}})}
})();
(function(){var n=document.querySelector('.nav');if(!n)return;var last=scrollY;
addEventListener('scroll',function(){var y=scrollY;if(n.classList.contains('open'))return;
  if(y>last+4&&y>180)n.classList.add('hide');else if(y<last-4||y<=180)n.classList.remove('hide');last=y},{passive:true});})();
(function(){var n=document.querySelector('.nav'),b=document.querySelector('.burger');if(!n||!b)return;
new MutationObserver(function(){var o=n.classList.contains('open');document.documentElement.classList.toggle('menu-open',o);if(window.__lenis)o?__lenis.stop():__lenis.start()}).observe(n,{attributes:true,attributeFilter:['class']});
n.querySelectorAll('.links a').forEach(function(a){a.addEventListener('click',function(){n.classList.remove('open');b.textContent='Menu'})});})();
(function(){
if(!document.body.hasAttribute('data-line'))return;
var NS='http://www.w3.org/2000/svg',svg,main,glow,head,len=0,ys=[],N=600,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e}
function spline(p){var d='M'+p[0][0]+' '+p[0][1];for(var i=0;i<p.length-1;i++){var a=p[i-1]||p[i],b=p[i],c=p[i+1],e=p[i+2]||c;
  d+=' C'+(b[0]+(c[0]-a[0])/6)+' '+(b[1]+(c[1]-a[1])/6)+' '+(c[0]-(e[0]-b[0])/6)+' '+(c[1]-(e[1]-b[1])/6)+' '+c[0]+' '+c[1]}return d}
function build(){
  if(svg)svg.remove();
  var W=document.documentElement.clientWidth,H=document.body.scrollHeight,hero=document.querySelector('.hero'),y=hero?hero.offsetTop+hero.offsetHeight-60:0;
  var dark=document.querySelector('main .dark'),end=dark?dark.offsetTop+120:H-100,step=Math.max(380,Math.min(620,W*.42)),side=1,i=0,pts=[[W*.18,y]];
  while(y<end){y=Math.min(y+step,end);var x=side>0?W*(.82+Math.random()*.08):W*(.1+Math.random()*.08);
    if(i%2===1){var cx=(pts[pts.length-1][0]+x)/2,cy=y-step*.5,r=Math.min(130,W*.09);
      pts.push([cx-r*side*.2,cy-r*.9],[cx+r*side,cy-r*.3],[cx+r*side*.6,cy+r*.8],[cx-r*side*.6,cy+r*.5],[cx-r*side*.3,cy-r*.4]);}
    pts.push([x,y]);side*=-1;i++}
  var d=spline(pts),sw=W<700?12:26;
  svg=el('svg',{'class':'scroll-line',height:H,viewBox:'0 0 '+W+' '+H});
  var defs=el('defs',{}),g=el('linearGradient',{id:'rib',gradientUnits:'userSpaceOnUse',x1:0,y1:0,x2:W*.3,y2:1400,spreadMethod:'reflect'});
  [['0','#7a2cf0'],['.4','#a855ff'],['.7','#d9ff1f'],['1','#7a2cf0']].forEach(function(s){g.appendChild(el('stop',{offset:s[0],'stop-color':s[1]}))});
  defs.appendChild(g);svg.appendChild(defs);
  glow=el('path',{d:d,'class':'rib-glow','stroke-width':sw*2.4});main=el('path',{d:d,'class':'rib','stroke-width':sw});
  var hi=el('path',{d:d,'class':'rib-hi','stroke-width':Math.max(2,sw*.18)});
  head=el('circle',{r:sw*.95,'class':'rib-head'});
  [glow,main,hi,head].forEach(function(n){var w=n.getAttribute("stroke-width");if(w)n.style.strokeWidth=w+"px";svg.appendChild(n)});
  document.body.insertBefore(svg,document.body.firstChild);
  len=main.getTotalLength();[glow,main,hi].forEach(function(p){p.style.strokeDasharray=len});
  ys=[];for(var s=0;s<=N;s++)ys.push(main.getPointAtLength(len*s/N).y);
  update();
}
var cur=0;
function update(){if(!main)return;var t=reduce?1e9:scrollY+innerHeight*.62,k=0;for(var s=0;s<=N;s++){if(ys[s]<=t)k=s}
  cur=len*k/N;draw()}
var shown=0;
function draw(){shown+= reduce?(cur-shown):(cur-shown)*.14;if(Math.abs(cur-shown)<.5)shown=cur;var o=len-shown;
  glow.style.strokeDashoffset=o;main.style.strokeDashoffset=o;svg.querySelector('.rib-hi').style.strokeDashoffset=o;
  var p=main.getPointAtLength(shown);head.setAttribute('cx',p.x);head.setAttribute('cy',p.y);head.style.opacity=shown>4&&shown<len-4?1:0;
  if(shown!==cur)requestAnimationFrame(draw)}
var tm;addEventListener('load',build);addEventListener('resize',function(){clearTimeout(tm);tm=setTimeout(build,250)});
addEventListener('scroll',update,{passive:true});
})();
