/* Optional GA4 analytics. No Google script is loaded before explicit consent. */
(()=>{
 'use strict';
 const id='G-ZE9MX5P93B',key='goegsa.analytics.v1',en=document.documentElement.lang==='en';
 const routes=new Set(['','products/','products/school-management/','services/','about/','contact/','privacy/','terms/'].flatMap(p=>['/'+p,'/en/'+p]));
 if(location.hostname!=='goegsa.com'||!routes.has(location.pathname))return;
 const t=(ar,english)=>en?english:ar;
 let choice=null,loaded=false;
 try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&Date.now()-saved.time<180*86400000&&['accepted','denied'].includes(saved.choice))choice=saved.choice;}catch{}
 window['ga-disable-'+id]=choice!=='accepted';
 const page={page_location:'https://goegsa.com'+location.pathname,page_referrer:'',page_title:en?'GOEGSA — '+location.pathname:'GOEGSA — '+location.pathname};
 try{page.page_referrer=document.referrer?new URL(document.referrer).origin+'/':'';}catch{}
 function gtag(){window.dataLayer.push(arguments);}
 function start(){
  window['ga-disable-'+id]=false;
  if(loaded){gtag('consent','update',{analytics_storage:'granted'});return;}
  loaded=true;window.dataLayer=window.dataLayer||[];
  gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  gtag('consent','update',{analytics_storage:'granted'});
  gtag('set',{...page,allow_google_signals:false,allow_ad_personalization_signals:false});
  gtag('js',new Date());
  gtag('config',id,{send_page_view:true,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:7776000,...page});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
 }
 function stop(){
  window['ga-disable-'+id]=true;
  if(loaded)gtag('consent','update',{analytics_storage:'denied'});
  for(const cookie of document.cookie.split(';')){const name=cookie.split('=')[0].trim();if(!/^_ga(?:_|$)/.test(name))continue;for(const domain of ['', '; domain=goegsa.com','; domain=.goegsa.com'])document.cookie=name+'=; max-age=0; path=/'+domain;}
 }
 function track(name,params={}){if(choice!=='accepted'||!loaded)return;gtag('event',name,{...page,...params,send_to:id});}
 const notice=document.createElement('section');notice.className='analytics-notice';notice.setAttribute('aria-label',t('إعدادات الإحصاءات','Analytics preferences'));
 notice.innerHTML='<p>'+t('إحصاءات Google؟','Google analytics?')+'</p><div><button type="button" data-analytics-accept>'+t('قبول','Accept')+'</button><button type="button" data-analytics-reject>'+t('رفض','Reject')+'</button><a href="'+(en?'/en/':'/')+'privacy/">'+t('الخصوصية','Privacy')+'</a><button type="button" data-analytics-close hidden>'+t('إغلاق','Close')+'</button></div><small role="status"></small>';
 notice.hidden=choice!==null;document.body.append(notice);
 const preferences=document.createElement('button');preferences.type='button';preferences.className='analytics-preferences';preferences.textContent=t('إعدادات الإحصاءات','Analytics preferences');
 const privacyPage=/^\/(?:en\/)?privacy\/$/.test(location.pathname);
 const privacyContent=privacyPage?document.querySelector('#main'):null;
 (privacyContent||document.querySelector('footer')||document.body).append(preferences);
 function updatePreferences(){preferences.hidden=!privacyPage&&choice==='accepted';}
 updatePreferences();
 preferences.addEventListener('click',()=>{notice.hidden=false;notice.querySelector('[data-analytics-close]').hidden=false;notice.querySelector('[data-analytics-accept]').focus({preventScroll:true});});
 function choose(value){choice=value;try{localStorage.setItem(key,JSON.stringify({choice,time:Date.now()}));}catch{}if(choice==='accepted')start();else stop();notice.hidden=true;updatePreferences();if(!preferences.hidden)preferences.focus({preventScroll:true});}
 notice.querySelector('[data-analytics-accept]').addEventListener('click',()=>choose('accepted'));
 notice.querySelector('[data-analytics-reject]').addEventListener('click',()=>choose('denied'));
 notice.querySelector('[data-analytics-close]').addEventListener('click',()=>{notice.hidden=true;updatePreferences();if(!preferences.hidden)preferences.focus({preventScroll:true});});
 document.addEventListener('click',event=>{
  const target=event.target.closest('[data-simple-trial],.trial-download');if(!target)return;
  if(target.matches('[data-simple-trial]'))track('trial_form_open',{product:'school_management'});
  else if(!target.hidden){try{const url=new URL(target.href);if(url.origin==='https://github.com'&&/^\/mohammednassar101-lgtm\/school-system-updates\/releases\/(?:download\/v\d+\.\d+\.\d+|latest\/download)\/SchoolSystemSetup\.exe$/.test(url.pathname)&&!url.search&&!url.hash)track('file_download',{file_name:'SchoolSystemSetup.exe',file_extension:'exe',product:'school_management'});}catch{}}
 });
 document.addEventListener('submit',event=>{const form=event.target;if(!form.matches('.lead-form')||!form.checkValidity())return;const channel=form.querySelector('input[name="channel"]:checked')?.value;if(['email','whatsapp'].includes(channel))track('trial_request_open',{channel,product:'school_management'});});
 window.addEventListener('storage',event=>{if(event.key===key)location.reload();});
 if(choice==='accepted')start();else stop();
})();
