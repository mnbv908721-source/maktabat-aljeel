'use strict';
const CACHE='maktabat-aljeel-shell-v23-commerce-release';
const ROOT=new URL('./',self.location.href);
const SHELL=['./category-all.svg','./category-stationery.svg','./category-books.svg','./category-games.svg','./category-electronics.svg','./category-accessories.svg','./category-beauty.svg','./category-printing.svg','./category-parties.svg','./category-gifts.svg','./category-digital.svg','./category-services.svg','./','./index.html','./style.css','./mountain-library-logo.webp','./app.js','./commerce.js','./state.js','./cloud.js','./cloud-config.js','./cloud.css','./account.js','./images/avatar.svg','./digital.js','./media/book-page-1.png','./media/book-page-2.png','./media/book-page-3.png','./media/reading-guide.pdf','./media/lesson-1.webm','./media/lesson-2.webm','./media/lesson-3.webm','./invoice.js','./attachments.js','./vendor/jspdf.umd.min.js','./fonts/Amiri-Regular.ttf','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./images/item-1.svg','./images/item-2.svg','./images/item-3.svg','./images/item-4.svg','./images/item-5.svg','./images/item-6.svg','./images/item-7.svg'].map(path=>new URL(path,ROOT).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('maktabat-aljeel-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname))return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).catch(()=>caches.match(new URL('./index.html',ROOT).href)));
  }else if(SHELL.includes(url.href)){
    event.respondWith(caches.match(event.request).then(cached=>cached?mediaResponse(event.request,cached):fetch(event.request)));
  }
});




async function mediaResponse(request,response){const range=request.headers.get('Range');if(!range)return response;const blob=await response.blob(),match=/^bytes=(\d*)-(\d*)$/.exec(range);if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${blob.size}`}});const start=match[1]?Number(match[1]):Math.max(0,blob.size-Number(match[2])),end=match[1]?(match[2]?Math.min(Number(match[2]),blob.size-1):blob.size-1):blob.size-1;if(start>end||start>=blob.size)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${blob.size}`}});return new Response(blob.slice(start,end+1),{status:206,headers:{'Content-Type':response.headers.get('Content-Type')||'application/octet-stream','Content-Length':String(end-start+1),'Content-Range':`bytes ${start}-${end}/${blob.size}`,'Accept-Ranges':'bytes'}});}

