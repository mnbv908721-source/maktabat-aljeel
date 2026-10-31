(function(w){'use strict';
 const defaults=['القرطاسية','الكتب','الألعاب','الألكترونيات وملحقاتها','الأكسسوارات','الكوزمتك','الطباعة','مواد الحفلات والزينة','مواد التغليف والهدايا','المنتجات الرقمية','الخدمات'].map((name,i)=>({id:i+1,name,isService:i===10}));
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money=v=>Number(v||0).toLocaleString('en-US');
 function categories(){return w.AljeelStore.getState().categories??defaults;}
 const relative=p=>p.pricingMode==='relative';
 const price=p=>relative(p)?0:p.discountPrice??p.price;
 const label=p=>relative(p)?`${money(p.pricingRule?.unitPrice)} د.ع / ${money(p.pricingRule?.unitSize)} ${esc(p.pricingRule?.unitLabel||'وحدة')} • يُعتمد بعد التدقيق`:money(price(p))+' د.ع';
 function itemMarkup(item){return `<section class="item-request-details"><h4>${esc(item.title)}</h4>${item.pricingMode==='relative'?`<p class="relative-label">${label(item)}${item.quotedUnits?`<br>الوحدات المدققة: ${money(item.quotedUnits)}`:''}</p>`:''}<p class="item-note">${esc(item.notes||'بدون ملاحظات لهذا العنصر')}</p>${w.AljeelFiles.links(item.attachments||[])}</section>`;}
 const categoryId=p=>p.categoryId??defaults.find(c=>c.name===p.type)?.id??({'قرطاسية':1,'كتاب ورقي':2,'كتاب رقمي':10,'كورس تعليمي':10,'خدمة':11})[p.type]??null;
 async function hydrate(){for(const img of document.querySelectorAll('[data-public-media]')){const key=img.dataset.publicMedia;delete img.dataset.publicMedia;try{const url=await w.AljeelStore.assetUrl(key);if(img.isConnected&&url)img.src=url;}catch{}}}
 w.AljeelCommerce={defaults,categoryId,hydrate,categories,price,relative,label,money,escape:esc,itemMarkup};
})(window);
