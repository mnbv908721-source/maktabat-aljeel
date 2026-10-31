/* Arabic invoice layout. jsPDF (MIT) and Amiri (OFL) are bundled locally. */
(function(root){
  'use strict';
  function build(jsPDF,fontBase64,items,date=new Date(),number='DEMO',options={}){
    if(!items.length)throw new Error('لا يمكن إصدار فاتورة لسلة فارغة.');
    const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true,putOnlyUsedFonts:true});
    doc.addFileToVFS('Amiri-Regular.ttf',fontBase64);
    doc.addFont('Amiri-Regular.ttf','Amiri','normal');
    doc.setFont('Amiri','normal');
    doc.setLanguage('ar-IQ-u-nu-latn');
    doc.setProperties({title:'فاتورة - مكتبة الجبل',subject:'ملخص الطلب وليس إثبات دفع',author:'مكتبة الجبل',creator:'مكتبة الجبل'});
    const green=[18,92,192],muted=[110,126,121];
    function arabic(text,x,y,size=12,color=green){doc.setFontSize(size);doc.setTextColor(...color);doc.setR2L(false);doc.text(String(text),x,y,{align:'right'});}
    function numeric(text,x,y,size=12,color=green){doc.setFontSize(size);doc.setTextColor(...color);doc.setR2L(false);doc.text(String(text),x,y,{align:'right'});}
    const money=n=>n.toLocaleString('ar-IQ-u-nu-latn');
    doc.setFillColor(...green);doc.rect(0,0,210,7,'F');
    arabic('مكتبة الجبل',192,28,27);
    arabic(options.isDemo?'فاتورة مشتريات تجريبية':'فاتورة مشتريات',192,40,14,muted);
    doc.setFillColor(235,243,255);doc.roundedRect(18,18,51,18,3,3,'F');
    arabic(options.isDemo?'نسخة تجريبية':'تفاصيل الطلب',63,29,14);
    doc.setDrawColor(221,229,218);doc.line(18,49,192,49);
    arabic('رقم الفاتورة',192,60,11,muted);numeric(number,143,60,11);
    arabic('تاريخ الطلب',192,70,11,muted);
    const day=new Intl.DateTimeFormat('ar-IQ-u-nu-latn',{timeZone:'Asia/Baghdad',year:'numeric',month:'long',day:'numeric',calendar:'gregory'}).format(date);
    arabic(day,143,70,12);
    arabic('العملة: الدينار العراقي',192,81,11,muted);

    doc.setFillColor(...green);doc.roundedRect(18,90,174,14,2,2,'F');
    arabic('الصنف',186,99,12,[255,255,255]);
    arabic('الكمية',106,99,12,[255,255,255]);
    arabic('سعر الوحدة',80,99,12,[255,255,255]);
    arabic('الإجمالي',43,99,12,[255,255,255]);
    let y=104; const rowHeight=items.length>5?14:18;
    for(const [index,item] of items.entries()){
      if(!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>99||!Number.isSafeInteger(item.price)||item.price<0)throw new Error('بيانات السلة غير صالحة.');
      // The local catalog contains at most seven short names; all rows fit A4.
      doc.setFillColor(...(index%2?[255,255,255]:[246,248,243]));doc.rect(18,y,174,rowHeight,'F');
      arabic(item.title,186,y+11,12);
      numeric(money(item.quantity),106,y+11,12);
      numeric(money(item.price),80,y+11,12);
      numeric(money(item.price*item.quantity),43,y+11,12);
      doc.setDrawColor(229,234,225);doc.line(18,y+rowHeight,192,y+rowHeight);
      y+=rowHeight;
    }
    const total=items.reduce((sum,item)=>sum+item.price*item.quantity,0);
    y+=9;doc.setFillColor(235,243,255);doc.roundedRect(18,y,174,20,3,3,'F');
    arabic('المجموع الكلي',186,y+13,16);
    numeric(money(total),85,y+13,17);arabic('د.ع',41,y+13,12);
    arabic('شكراً لاختيارك مكتبة الجبل',192,y+35,15);
    arabic('هذه الفاتورة ملخص للطلب، وليست إثبات دفع.',192,y+46,11,muted);
    doc.setDrawColor(221,229,218);doc.line(18,277,192,277);
    arabic('مكتبة الجبل | نقرأ اليوم، نصنع الغد',192,286,11,muted);
    numeric('1 / 1',34,286,10,muted);
    return doc;
  }
  root.AljeelInvoice={build};
  if(typeof module!=='undefined'&&module.exports)module.exports={build};
})(typeof window!=='undefined'?window:globalThis);



