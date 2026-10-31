/* Shared order attachment UI. File access is checked by the server. */
(function(w){
 const labels={video:'فيديو',image:'صورة',pdf:'PDF',link:'رابط'};
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function read(files){
  if(files.length>30)throw Error('الحد الأقصى 30 مرفقاً');
  let total=0;
  return Array.from(files).map(file=>{const kind=file.type==='application/pdf'?'pdf':file.type.startsWith('video/')?'video':['image/jpeg','image/png','image/webp'].includes(file.type)?'image':null;
   if(!kind||!file.size||file.size>(kind==='video'?200:20)*1024*1024)throw Error('استخدم صورة JPG/PNG/WebP أو PDF حتى 20 MB أو فيديو حتى 200 MB');
   total+=file.size;if(total>500*1024*1024)throw Error('الحجم الإجمالي لا يتجاوز 500 MB');return {kind,file};
  });
 }
 function list(files){return files.map(f=>`<li>${escape(f.file?.name||f.name||'مرفق')} <small>(${labels[f.kind]||'ملف'})</small></li>`).join('');}
 function picker(){return '<label class="attachment-picker">مرفقات (اختياري)<input name="attachments" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/ogg,video/quicktime,application/pdf"><small>صور أو فيديو أو PDF • حتى 30 ملفاً</small></label><ul class="attachment-selection" aria-live="polite"></ul>';}
 function links(files){return '<div class="attachment-links">'+files.map(f=>`<button type="button" class="subtle-button reset-button" data-order-asset="${escape(f.storageKey||'')}" ${f.kind==='link'?`data-asset-link="${escape(f.url)}"`:''}>${escape(f.file?.name||'فتح المرفق')} (${labels[f.kind]||'ملف'})</button>`).join('')+'</div>';}
 document.addEventListener('change',e=>{if(!e.target.matches('input[name=attachments]'))return;const form=e.target.closest('form'),box=form.querySelector('.attachment-selection');try{const files=read(e.target.files);box.innerHTML=list(files);e.target.setCustomValidity('');}catch(error){box.textContent=error.message;e.target.setCustomValidity(error.message);}});
 document.addEventListener('click',async e=>{const button=e.target.closest('[data-order-asset]');if(!button)return;button.disabled=true;try{const url=button.dataset.assetLink||await w.AljeelStore.assetUrl(button.dataset.orderAsset);if(!url||(new URL(url,location.href).protocol!=='https:'&&!(new URL(url,location.href).origin===location.origin&&['127.0.0.1','localhost'].includes(location.hostname))))throw Error('رابط غير صالح');const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.click();}catch(error){document.dispatchEvent(new CustomEvent('cloud-message',{detail:error.message}));}finally{button.disabled=false;}});
 w.AljeelFiles={read,picker,list,links};
})(window);
