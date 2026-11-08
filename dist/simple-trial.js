(()=>{
const en=document.documentElement.lang==='en',t=(ar,e)=>en?e:ar;
const dialog=document.createElement('dialog');dialog.className='lead-dialog';dialog.setAttribute('aria-labelledby','trial-title');
const fields=[['name','الاسم الكامل','Full name','text','name'],['organization','اسم المدرسة أو الجهة','School or organization','text','organization'],['email','البريد الإلكتروني','Email','email','email'],['phone','رقم الجوال مع رمز الدولة','Phone with country code','tel','tel']];
dialog.innerHTML='<div class="trial-heading"><button class="lead-close" type="button" aria-label="'+t('إغلاق','Close')+'">×</button><span class="lead-tag">GOEGSA · '+t('تجربة مجانية 14 يومًا','Free 14-day trial')+'</span><h2 id="trial-title">'+t('ابدأ تجربتك المجانية.','Start your free trial.')+'</h2><p>'+t('أكمل بياناتك لبدء التنزيل وفتح رسالة طلب التجربة.','Complete your details to start the download and open your trial request message.')+'</p></div><form class="lead-form"><div class="trial-fields">'+fields.map(([name,ar,eng,type,autocomplete])=>'<label>'+t(ar,eng)+'<input name="'+name+'" type="'+type+'" autocomplete="'+autocomplete+'" required maxlength="160" '+(type==='tel'?'dir="ltr" placeholder="+966 5X XXX XXXX"':type==='email'?'dir="ltr"':'minlength="2"')+'></label>').join('')+'<fieldset class="trial-channel"><legend>'+t('طريقة الإرسال','Send via')+'</legend><label><input name="channel" type="radio" value="email" checked>'+t('البريد الإلكتروني','Email')+'</label><label><input name="channel" type="radio" value="whatsapp">'+t('واتساب','WhatsApp')+'</label></fieldset><label class="lead-check"><input name="marketing" type="checkbox" required><span>'+t('أوافق على تلقي عروض GOEGSA والمتابعة التسويقية عبر البريد والجوال وواتساب.','I agree to GOEGSA offers and marketing follow-ups by email, phone and WhatsApp.')+'</span></label><small>'+t('ستُضمّن بياناتك في الرسالة إلى GOEGSA. يمكنك طلب إيقاف التسويق في أي وقت.','Your details will be included in your message to GOEGSA. You can ask us to stop marketing at any time.')+'</small></div><div class="trial-actions"><small id="trial-requirements">'+t('أكمل جميع البيانات ووافق على العروض لتفعيل الزر.','Complete all details and agree to offers to enable the button.')+'</small><button class="btn lead-submit" type="submit" disabled aria-describedby="trial-requirements">'+t('إرسال وتنزيل البرنامج','Send & download the program')+'</button><div class="lead-status" role="status" aria-live="polite"></div><a class="btn trial-download" hidden>'+t('إعادة تنزيل البرنامج','Download again')+'</a></div></form>';
document.body.append(dialog);
const form=dialog.querySelector('form'),submit=dialog.querySelector('.lead-submit'),download=dialog.querySelector('.trial-download');
const privacyNote=document.createElement('p');privacyNote.className='privacy-form-note';const privacyLink=document.createElement('a');privacyLink.href=(en?'/en/':'/')+'privacy/';privacyLink.target='_blank';privacyLink.rel='noopener noreferrer';privacyLink.textContent=t('سياسة الخصوصية','Privacy policy');privacyNote.append(privacyLink);dialog.querySelector('.trial-fields').prepend(privacyNote);
dialog.querySelector('.lead-close').onclick=()=>dialog.close();
function ready(){
 for(const name of ['name','organization']){const field=form.querySelector('[name="'+name+'"]');field.setCustomValidity(field.value.trim().length>=2?'':t('أدخل حرفين على الأقل.','Enter at least two characters.'));}
 const phone=form.querySelector('[name="phone"]'),number=phone.value.replace(/[\s().-]/g,'');
 phone.setCustomValidity(/^(?:\+|00)[1-9]\d{6,14}$/.test(number)?'':t('أدخل رقم جوال صحيحًا مع رمز الدولة، مثل +966500000000.','Enter a valid phone number with country code, e.g. +966500000000.'));
 submit.disabled=!form.checkValidity();return !submit.disabled;
}
form.addEventListener('input',ready);form.addEventListener('change',ready);
document.addEventListener('click',e=>{if(e.target.closest('[data-simple-trial]')){e.preventDefault();ready();dialog.showModal();}});
form.addEventListener('submit',e=>{
 e.preventDefault();if(!ready()){form.reportValidity();return;}
 const data=new FormData(form),channel=data.get('channel');if(!['email','whatsapp'].includes(channel))return;
 const message=[t('طلب تجربة نظام إدارة المدارس','School Management System trial request'),...fields.map(([name,ar,eng])=>t(ar,eng)+': '+data.get(name).trim()),t('الموافقة التسويقية: نعم','Marketing consent: Yes')].join('\n');
 const href=channel==='whatsapp'?'https://wa.me/'+SITE_CONFIG.whatsapp.number+'?text='+encodeURIComponent(message):'mailto:'+SITE_CONFIG.contacts.sales+'?subject='+encodeURIComponent(t('طلب نسخة تجريبية من GOEGSA','GOEGSA trial request'))+'&body='+encodeURIComponent(message);
 const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=t('فتح الرسالة مجددًا','Open the message again');
 const status=dialog.querySelector('.lead-status');status.replaceChildren(a);const notice=document.createElement('p');notice.textContent=t('بدأ طلب التنزيل. راجع الرسالة وأرسلها. إن لم يبدأ التحميل، استخدم إعادة التنزيل.','Download requested. Review and send your message. If the download does not start, use Download again.');status.prepend(notice);
 download.href=SITE_CONFIG.products.school.trial.downloadUrl;download.target='_self';download.rel='noopener noreferrer';download.setAttribute('download','SchoolSystemSetup.exe');download.hidden=false;
 // Request the attachment before handing off to the email app or WhatsApp.
 download.click();a.click();
});
ready();
})();
