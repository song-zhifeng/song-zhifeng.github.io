(()=>{'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const projects=qa('article.project'),views=qa('main>section[id],main>article[id]'),navLinks=qa('.sidebar nav a');
const projectMap=new Map(projects.map(p=>[p.id,p]));
const viewMap=new Map(views.map(p=>[p.id,p]));
const details=qa('.project-details'),toggle=q('#toggle-details'),mode=q('#reading-mode');
const context=q('#reader-context'),contextName=q('#reader-name'),progress=q('.reading-progress');
let focusMode=true,currentId='overview',scrollTick=false,reportData=null,printState=null,toastTimer;
function getReport(id){if(!reportData)reportData=JSON.parse(q('#report-data').textContent);return reportData[id];}
function makeURL(id){const r=getReport(id);if(!r||!r.url)throw Error('Missing report');return new URL(r.url,document.baseURI).href;}
function toast(message){const t=q('#toast');t.textContent=message;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,3800);}
function download(id){try{const a=document.createElement('a');a.href=makeURL(id);a.download=getReport(id).name;document.body.append(a);a.click();a.remove();toast(id==='portfolio_pdf'?'已准备 PDF 提交版下载':'已准备原始报告下载');}catch(e){toast('暂时无法下载报告，请刷新页面后重试。');}}
qa('[data-download]').forEach(b=>b.addEventListener('click',()=>download(b.dataset.download)));
qa('[data-report]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.report;try{if(getReport(id).mime!=='application/pdf'){download(id);return;}window.open(makeURL(id)+'#page='+(b.dataset.page||1),'_blank','noopener');}catch(e){toast('暂时无法打开报告，请刷新页面后重试。');}}));

const filters=qa('.filter'),cards=qa('.index-card'),search=q('#project-search');
const searchText=new Map(projects.map(p=>[p.id,(p.textContent+' '+p.id).toLowerCase()]));
let selectedFilter='all';
function filterProjects(){
 const words=search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);let count=0;
 cards.forEach(card=>{const text=searchText.get(card.hash.slice(1))||'';const yes=(selectedFilter==='all'||card.dataset.cats.split(' ').includes(selectedFilter))&&words.every(word=>text.includes(word));card.classList.toggle('dimmed',!yes);if(yes)count++;});
 const selected=filters.find(b=>b.dataset.filter===selectedFilter);
 q('#filter-status').textContent=(selected?selected.textContent:'全部项目')+' · '+count+' 个案例'+(words.length?' · 搜索：'+search.value.trim():'');
 q('#no-results').hidden=count>0;q('#clear-search').hidden=!search.value;
}
filters.forEach(b=>b.addEventListener('click',()=>{selectedFilter=b.dataset.filter;filters.forEach(f=>f.setAttribute('aria-pressed',String(f===b)));filterProjects();}));
search.addEventListener('input',filterProjects);
q('#clear-search').addEventListener('click',()=>{search.value='';filterProjects();search.focus();});
q('#project-search-form').addEventListener('submit',e=>e.preventDefault());
function relevantDetails(){return focusMode&&projectMap.has(currentId)?qa('.project-details',projectMap.get(currentId)):details;}
function setToggleLabel(){const ds=relevantDetails(),open=ds.length>0&&ds.every(d=>d.open);toggle.textContent=focusMode?(open?'收起补充说明':'展开补充说明'):(open?'收起全部详情':'展开全部详情');toggle.setAttribute('aria-expanded',String(open));toggle.hidden=focusMode&&!projectMap.has(currentId);}
toggle.addEventListener('click',()=>{const ds=relevantDetails(),open=!ds.every(d=>d.open);ds.forEach(d=>d.open=open);setToggleLabel();});
details.forEach(d=>d.addEventListener('toggle',setToggleLabel));
function updateProgress(){const span=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform='scaleX('+(span>0?Math.min(1,Math.max(0,window.scrollY/span)):0)+')';scrollTick=false;}
function showView(id,navigate=false){
 const target=viewMap.get(id)||viewMap.get('overview');currentId=target.id;
 document.body.classList.toggle('focus-mode',focusMode);
 views.forEach(v=>v.classList.toggle('focus-hidden',focusMode&&!(v===target||(currentId==='overview'&&v.id==='directory'))));
 mode.textContent=focusMode?'连续阅读':'逐个项目阅读';mode.setAttribute('aria-pressed',String(focusMode));
 context.hidden=!focusMode||!projectMap.has(currentId);
 if(!context.hidden)contextName.textContent=q('.project-number',target).textContent+' / '+q('h2',target).textContent;
 navLinks.forEach(a=>{const active=a.hash==='#'+currentId;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 setToggleLabel();
 if(navigate)requestAnimationFrame(()=>{const heading=q('h2,h1',target);if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}if(currentId==='overview')window.scrollTo({top:0,behavior:'auto'});else target.scrollIntoView({block:'start',behavior:'auto'});updateProgress();});
 else requestAnimationFrame(updateProgress);
}
mode.addEventListener('click',()=>{focusMode=!focusMode;showView(currentId,true);});
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.hash.slice(1);if(!viewMap.has(id))return;e.preventDefault();if(location.hash===a.hash)showView(id,true);else location.hash=id;});
window.addEventListener('hashchange',()=>showView(location.hash.slice(1),true));
if('IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>{if(focusMode)return;const e=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(e)navLinks.forEach(a=>{const active=a.hash==='#'+e.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-8% 0px -68% 0px',threshold:0});views.forEach(v=>obs.observe(v));}
window.addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(updateProgress);scrollTick=true;}},{passive:true});
window.addEventListener('resize',updateProgress);
function preparePrint(){if(!printState)printState=details.map(d=>d.open);document.body.classList.add('printing');details.forEach(d=>d.open=true);}
window.addEventListener('beforeprint',preparePrint);
window.addEventListener('afterprint',()=>{if(printState)details.forEach((d,i)=>d.open=printState[i]);printState=null;document.body.classList.remove('printing');setToggleLabel();});
q('#print').addEventListener('click',async()=>{const b=q('#print');b.disabled=true;preparePrint();try{await Promise.all(qa('img[src]').map(im=>im.decode?im.decode().catch(()=>{}):Promise.resolve()));if(document.fonts)await document.fonts.ready;window.print();}finally{b.disabled=false;}});
const dialog=q('#lightbox'),fullImage=q('#lightbox-img'),caption=q('#lightbox-caption');
qa('[data-lightbox]').forEach(b=>b.addEventListener('click',()=>{const img=q('img',b);fullImage.src=img.src;fullImage.alt=img.alt;caption.textContent=img.alt;dialog.showModal();}));
q('#close-lightbox').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
filterProjects();showView(location.hash.slice(1)||'overview',Boolean(location.hash));
})();
