/* I Love Classic Cars: 내차고 · 차계부 (시안 #1, 형 승인 2026-11-18)
   - 가입 없음, 이 기기에만 저장 (localStorage 'icc_garage'), 파일로 내보내기·가져오기
   - 차 여러 대, 차계부 기록(날짜·주행거리·작업·부품비·공임·정비소·영수증 사진·메모·공임 판정)
   - 공임 계산 창에서 "차계부에 저장" → 부품비·공임·정비소·판정 자동 입력
   - 다음 엔진오일 알림: 차마다 교환 주기(km·개월)를 넣었을 때만 표시 */
(function(){
  var KO=(document.documentElement.lang||'ko').indexOf('ko')===0;
  var T=KO?{btn:'내차고',title:'내차고',addCar:'+ 차 추가',ledger:'차계부',year:'올해',parts:'부품',labor:'공임',add:'+ 기록 추가',
    rec:'기록 추가',edit:'기록 고치기',save:'저장',del:'지우기',close:'닫기',date:'날짜',km:'주행거리',job:'작업',shop:'정비소',memo:'메모',photo:'영수증 사진',
    carName:'차 이름',vin:'차대번호',yr:'연식',odo:'지금 주행거리',oil:'엔진오일 주기',oilkm:'km마다',oilmo:'개월마다',
    nextOil:'다음 엔진오일',or:'또는',none:'아직 기록이 없어요. 공임 계산에서 "차계부에 저장"을 누르거나 + 기록 추가를 눌러요.',
    nocar:'내 차를 먼저 넣어 주세요.',byYear:'연도별',total:'누적',exp:'내보내기',imp:'가져오기',
    note:'가입 없이 이 기기에만 저장돼요. 내보내기로 백업하고 새 폰으로 옮길 수 있어요. 차 팔 때 정비 기록으로 그대로 쓸 수 있어요.',
    toLedger:'차계부에 저장',saved:'차계부에 저장했어요',self:'직접 교환',delq:'이 기록을 지울까요?',delcar:'이 차와 기록을 모두 지울까요?',editCar:'차 정보',main:'대표',
    tagOk:'국제 표준 안',tagHi:'비쌈',tagLo:'쌈',tagRip:'바가지 의심',cnt:'건',impOk:'가져왔어요',impNo:'파일을 읽지 못했어요',beta:'시험판(베타)이에요. 기록을 지키려면 가끔 백업 파일 저장을 눌러 주세요.',bk:'백업 파일 저장',paid:'실제로 낸 금액',more:'더 적기',menu:'메뉴',betaTag:'시험판',bkLast:'마지막 백업',bkNever:'아직 백업 안 함',bkNow:'백업할 때가 됐어요',fb:'의견 보내기',futq:'정비 날짜가 오늘보다 뒤예요. 맞나요?',kmq:'앞선 기록보다 주행거리가 적어요 ({a} → {b} km). 계기판을 바꿨다면 메모에 적어 주세요. 이대로 저장할까요?',dupImp:'같은 기록은 건너뛰었어요',newer:'더 새 버전에서 만든 파일이에요. 사이트를 새로고침한 뒤 다시 가져와 주세요.'}
   :{btn:'Garage',title:'My Garage',addCar:'+ Add car',ledger:'Logbook',year:'This year',parts:'Parts',labor:'Labor',add:'+ Add record',
    rec:'Add record',edit:'Edit record',save:'Save',del:'Delete',close:'Close',date:'Date',km:'Mileage',job:'Work',shop:'Shop',memo:'Note',photo:'Receipt photo',
    carName:'Car name',vin:'VIN',yr:'Year',odo:'Current mileage',oil:'Oil interval',oilkm:'km',oilmo:'months',
    nextOil:'Next oil change',or:'or',none:'No records yet. Press "Save to logbook" in Labor, or + Add record.',
    nocar:'Add your car first.',byYear:'By year',total:'Total',exp:'Export',imp:'Import',
    note:'No sign-up. Saved only on this device. Export to back up or move to a new phone. Handy as a service record when you sell.',
    toLedger:'Save to logbook',saved:'Saved to logbook',self:'DIY',delq:'Delete this record?',delcar:'Delete this car and all its records?',editCar:'Car details',main:'Main',
    tagOk:'Within standard',tagHi:'Pricey',tagLo:'Cheap',tagRip:'Possible rip-off',cnt:'',impOk:'Imported',impNo:'Could not read the file',beta:'This is a beta. Press Save backup file now and then to keep your records safe.',bk:'Save backup file',paid:'Amount paid',more:'More details',menu:'Menu',betaTag:'Beta',bkLast:'Last backup',bkNever:'No backup yet',bkNow:'Time to back up',fb:'Send feedback',futq:'The service date is after today. Is that right?',kmq:'Mileage is lower than an earlier record ({a} → {b} km). If the odometer was replaced, add a note. Save anyway?',dupImp:'Duplicate records were skipped',newer:'This file comes from a newer version. Reload the site and import again.'};
  var KEY='icc_garage';
  /* 의견 보내기: 형 결정 — 이메일 대신 페이스북·인스타그램 (계정명 iloveclassiccars.official) */
  var FB='https://www.facebook.com/iloveclassiccars.official',IG='https://www.instagram.com/iloveclassiccars.official';
  var SCHEMA=1;
  function load(){var raw=null;try{raw=localStorage.getItem(KEY);var d=JSON.parse(raw||'null');if(d&&d.cars){if(!d.v)d.v=1;return d}}catch(e){}
    if(raw){try{localStorage.setItem(KEY+'_broken_'+Date.now(),raw)}catch(x){}}
    return {v:SCHEMA,cars:[],recs:[],cur:null}}
  var G=load();
  function save(){var j=JSON.stringify(G);try{var prev=localStorage.getItem(KEY);if(prev&&prev!==j)localStorage.setItem(KEY+'_prev',prev);localStorage.setItem(KEY,j);return true}
    catch(e){alert(KO?'저장 공간이 부족해서 저장하지 못했어요. 기존 기록은 그대로예요. 영수증 사진을 빼고 다시 저장하거나, 백업 보내기 후 정리해 주세요.':'Not enough storage, nothing was saved. Your earlier records are safe. Try again without the photo, or send a backup first.');G=load();return false}}
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
  function needBk(){var n=G.recs.length-(G.bkN||0),d=G.bkAt?(Date.now()-G.bkAt)/864e5:999;return G.recs.length>0&&(n>=5||d>=30)}
  function backup(){var name='ICC_my_garage_'+today()+'.json',txt=JSON.stringify(G,null,1);
    function done(){G.bkAt=Date.now();G.bkN=G.recs.length;save();V.home()}
    try{var f=new File([txt],name,{type:'application/json'});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'I♥CC My Garage'}).then(done,function(){});return}}catch(e){}
    var u=URL.createObjectURL(new Blob([txt],{type:'application/json'})),l=document.createElement('a');l.href=u;l.download=name;document.body.appendChild(l);l.click();setTimeout(function(){URL.revokeObjectURL(u);l.remove()},500);done()}
  function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
  function isKRW(){var t=(document.querySelector('#list article.c .krw')||{}).textContent||(KO?'원':'$');return /원/.test(t)}
  function money(n,c){c=c||(isKRW()?'KRW':'USD');n=Math.round(+n||0);return c==='KRW'?'₩'+n.toLocaleString('ko-KR'):'$'+n.toLocaleString('en-US')}
  function num(t){return parseFloat(String(t||'').replace(/[^0-9.]/g,''))||0}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
  function car(){return G.cars.filter(function(c){return c.id===G.cur})[0]||G.cars[0]||null}
  function recs(c){return G.recs.filter(function(r){return c&&r.car===c.id}).sort(function(a,b){return (b.date||'').localeCompare(a.date||'')||(+b.km||0)-(+a.km||0)})}
  function tot(r){return (r.paid!==undefined&&r.paid!==null&&r.paid!=='')?+r.paid:((+r.parts||0)+(+r.labor||0))}
  var TAG={ok:['ok',T.tagOk],hi:['hi',T.tagHi],lo:['lo',T.tagLo],rip:['hi',T.tagRip],self:['lo',T.self]};

  var css=document.createElement('style');css.textContent=
  '#garb{display:inline-flex;align-items:center;gap:4px}#garb .gic{display:none}@media(max-width:600px){#garb .gic{display:block}}'+
  '#gsh{position:fixed;inset:0;z-index:99998;background:#171B26;color:#E8EAEE;display:none;flex-direction:column;font:14px/1.5 -apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif}#gsh.on{display:flex}'+
  '#gsh .gt{background:#1F4D36;padding:calc(env(safe-area-inset-top) + 12px) 14px 10px;display:flex;justify-content:space-between;align-items:center;font-weight:700;gap:8px}'+
  '#gsh button{font:inherit;color:#fff;background:transparent;border:1px solid #ffffff99;border-radius:0;padding:3px 9px;cursor:pointer;white-space:nowrap}'+
  '#gsh .gt .x{border:0;padding:0;font-weight:400}'+
  '#gsh .gb{flex:1;overflow:auto;padding:10px 12px 90px;max-width:640px;width:100%;margin:0 auto}'+
  '#gsh .car{border:1px solid #2AA84B;padding:10px;margin-bottom:8px;cursor:pointer}#gsh .car b{font-size:15px}#gsh .car .m{color:#9aa3a0;font-size:12px}'+
  '#gsh .mono{font:600 12px Menlo,Consolas,monospace;letter-spacing:.5px;color:#cfd3da}'+
  '#gsh .cars{display:flex;gap:6px;overflow-x:auto;margin-bottom:8px}#gsh .cars button{border-color:#3a4152}#gsh .cars button.on{background:#2AA84B33;border-color:#2AA84B}'+
  '#gsh .sum{display:grid;grid-template-columns:1fr 1fr 1fr;border:1px solid #2a3142;margin:8px 0}'+
  '#gsh .sum div{padding:7px 6px;text-align:right;border-right:1px solid #2a3142;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#gsh .sum div:last-child{border-right:0}'+
  '#gsh .sum small{display:block;text-align:left;font-weight:400;color:#9aa3a0;font-size:11px}'+
  '#gsh .nx{border:1px dashed #d9a441;padding:7px 9px;font-size:12.5px;margin:8px 0}'+
  '#gsh .e{border-top:1px solid #2a3142;padding:8px 2px;cursor:pointer}#gsh .e .h{display:flex;justify-content:space-between;gap:8px;white-space:nowrap}'+
  '#gsh .e .h b{overflow:hidden;text-overflow:ellipsis}#gsh .e .d{display:flex;justify-content:space-between;gap:6px;color:#9aa3a0;font-size:11.5px;white-space:nowrap}'+
  '#gsh .e .d span:first-child{overflow:hidden;text-overflow:ellipsis}'+
  '#gsh .tag{display:inline-block;font-size:10.5px;padding:0 6px;border:1px solid}#gsh .tag.ok{color:#2AA84B}#gsh .tag.hi{color:#d9a441}#gsh .tag.lo{color:#5aa9ff}'+
  '#gsh .addin{display:block;width:100%;margin:2px 0 8px;background:#2AA84B;border:0;padding:11px;font-weight:700}#gsh .btag{font-style:normal;font-size:10.5px;border:1px solid #ffffff99;padding:0 5px;margin-left:4px;font-weight:400}'+
  '#gsh .mlist button{display:block;width:100%;text-align:left;padding:12px 10px;border:0;border-bottom:1px solid #2a3142}#gsh .more{display:none}#gsh .open .more{display:flex}#gsh .mt{background:none;border:0;color:#5aa9ff;padding:10px 0}'+
  '#gsh .addb{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom) + 14px);width:min(616px,calc(100% - 24px));background:#2AA84B;border:0;padding:12px;font-weight:700}'+
  '#gsh .f{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid #2a3142}#gsh .f i{font-style:normal;color:#9aa3a0;font-size:12.5px;white-space:nowrap}'+
  '#gsh .f input,#gsh .f select{background:transparent;color:#fff;border:1px solid #3a4152;border-radius:0;padding:6px 8px;font:inherit;text-align:right;width:58%;min-width:0}'+
  '#gsh .f input[type=file]{text-align:left;font-size:12px}'+
  '#gsh .row2{display:flex;gap:8px;margin-top:12px}#gsh .row2 button{flex:1;padding:10px}#gsh .row2 .go{background:#2AA84B;border-color:#2AA84B;font-weight:700}'+
  '#gsh .nt{color:#9aa3a0;font-size:11.5px;margin-top:12px;line-height:1.6}#gsh .em{color:#9aa3a0;padding:16px 4px}'+
  '#gsh img.rc{max-width:100%;margin-top:8px;border:1px solid #2a3142}'+
  '#icclb .glb{display:block;width:calc(100% - 20px);margin:8px 10px;padding:9px;background:#2AA84B;color:#fff;border:0;border-radius:0;font:inherit;font-weight:700;cursor:pointer}';
  document.head.appendChild(css);
  var S=document.createElement('div');S.id='gsh';
  function open(v,arg){S.classList.add('on');document.body.style.overflow='hidden';(V[v]||V.home)(arg)}
  function close(){S.classList.remove('on');document.body.style.overflow=''}
  function frame(title,right,body,back){S.innerHTML='<div class="gt"><button class="x" data-a="'+(back||'close')+'">'+(back?'‹ ':'✕ ')+(back?T.title:T.close)+'</button><span>'+title+'</span>'+(right||'<span style="min-width:40px"></span>')+'</div><div class="gb">'+body+'</div>'}
  var V={};
  V.home=function(){var c=car();
    if(!c){frame(T.title,'',' <div class="em">'+T.nocar+'</div>');V.car();return}
    var R=recs(c),y=String(new Date().getFullYear()),cur=c.cur||(isKRW()?'KRW':'USD');
    var Ry=R.filter(function(r){return (r.date||'').slice(0,4)===y}),p=0,l=0,t=0;Ry.forEach(function(r){p+=+r.parts||0;l+=+r.labor||0;t+=tot(r)});
    var h='';
    if(needBk())h+='<div class="nx" data-a="exp" style="cursor:pointer">⚠ '+T.bkNow+' · <b>'+T.bk+'</b></div>';
    if(G.cars.length>1)h+='<div class="cars">'+G.cars.map(function(x){return '<button data-car="'+x.id+'" class="'+(x.id===c.id?'on':'')+'">'+esc(x.name)+'</button>'}).join('')+'</div>';
    h+='<div class="car" data-a="editcar"><b>'+esc(c.name)+'</b><div class="m">'+[c.yr,c.km?(+c.km).toLocaleString()+' km':''].filter(Boolean).map(esc).join(' · ')+'</div>'+(c.vin?'<div class="mono">'+esc(c.vin)+'</div>':'')+'</div>';
    h+='<button class="addin" data-a="rec">'+T.add+'</button>';
    h+=R.length?R.map(function(r){var tg=TAG[r.tag];return '<div class="e" data-rec="'+r.id+'"><div class="h"><b>'+esc(r.job||'-')+'</b><span>'+money(tot(r),r.cur||cur)+'</span></div><div class="d"><span>'+[r.date,r.km?(+r.km).toLocaleString()+' km':'',r.shop].filter(Boolean).map(esc).join(' · ')+'</span>'+(tg?'<span class="tag '+tg[0]+'">'+tg[1]+(r.tagp?' '+esc(r.tagp):'')+'</span>':'')+'</div></div>'}).join(''):'<div class="em">'+T.none+'</div>';
    h+='<div class="sum"><div><small>'+T.year+' ('+y+')</small>'+money(t,cur)+'</div><div><small>'+T.parts+'</small>'+money(p,cur)+'</div><div><small>'+T.labor+'</small>'+money(l,cur)+'</div></div>';
    if(c.oilkm||c.oilmo){var o=R.filter(function(r){return /엔진\s*오일|engine oil|oil change/i.test(r.job||'')})[0];
      if(o){var tt=[];if(c.oilkm&&o.km)tt.push((+o.km+ +c.oilkm).toLocaleString()+' km');if(c.oilmo&&o.date){var d=new Date(o.date);d.setMonth(d.getMonth()+ +c.oilmo);tt.push(d.toISOString().slice(0,7))}
        if(tt.length)h+='<div class="nx">⏰ '+T.nextOil+' · '+tt.join(' '+T.or+' ')+'</div>'}}
    frame(T.title+' <i class="btag">'+T.betaTag+'</i>','<button data-a="menu">☰ '+T.menu+'</button>',h)};
  V.menu=function(){var h='<div class="nx" style="border-style:solid;border-color:#2AA84B">'+T.beta+'<br><small style="color:#9aa3a0">'+(G.bkAt?T.bkLast+' '+new Date(G.bkAt).toISOString().slice(0,10):T.bkNever)+'</small></div>'+
     '<div class="mlist"><button data-a="exp">'+T.bk+'</button><button data-a="imp">'+T.imp+'</button><button data-a="newcar">'+T.addCar+'</button><button data-a="years">'+T.byYear+'</button>'+
     '<button data-a="fbk">'+T.fb+' · Facebook</button><button data-a="igm">'+T.fb+' · Instagram</button></div><div class="nt">'+T.note+'</div>';
    frame(T.menu,'',h,'home')};
  V.car=function(isNew){var c=isNew?null:car();var lv='';try{lv=localStorage.getItem('icc_lastvin')||''}catch(e){}
    var nm=c?c.name:('Benz '+String(window.CAR||'w140').toUpperCase());
    var h='<div class="f"><i>'+T.carName+'</i><input id="g_nm" value="'+esc(nm)+'"></div>'+
     '<div class="f"><i>'+T.vin+'</i><input id="g_vin" maxlength="20" style="text-transform:uppercase" value="'+esc(c?c.vin:lv)+'"></div>'+
     '<div class="f"><i>'+T.yr+'</i><input id="g_yr" inputmode="numeric" maxlength="4" value="'+esc(c?c.yr:'')+'"></div>'+
     '<div class="f"><i>'+T.odo+'</i><input id="g_km" type="number" inputmode="numeric" value="'+esc(c?c.km:'')+'"></div>'+
     '<div class="f"><i>'+T.oil+' ('+T.oilkm+')</i><input id="g_ok" type="number" inputmode="numeric" value="'+esc(c?c.oilkm:'')+'"></div>'+
     '<div class="f"><i>'+T.oil+' ('+T.oilmo+')</i><input id="g_om" type="number" inputmode="numeric" value="'+esc(c?c.oilmo:'')+'"></div>'+
     '<div class="row2">'+(c?'<button data-a="delcar">'+T.del+'</button>':'')+'<button class="go" data-a="savecar" data-id="'+(c?c.id:'')+'">'+T.save+'</button></div>';
    frame(c?T.editCar:T.addCar,'',h,G.cars.length?'home':'')};
  V.rec=function(id){var r=G.recs.filter(function(x){return x.id===id})[0]||(typeof id==='object'?id:null);var c=car();var cur=(r&&r.cur)||(c&&c.cur)||(isKRW()?'KRW':'USD');
    var isEd=!!(r&&r.id&&G.recs.some(function(x){return x.id===r.id}));
    var pd=r?(r.paid!==undefined&&r.paid!==''&&r.paid!==null?r.paid:((r.parts!==''&&r.parts!=null)||(r.labor!==''&&r.labor!=null)?(+r.parts||0)+(+r.labor||0):'')):'';
    var opn=isEd&&(r.shop||r.memo||r.photo);
    var h='<div class="frm'+(opn?' open':'')+'"><div class="f"><i>'+T.date+'</i><input id="r_dt" type="date" value="'+esc(r&&r.date||today())+'"></div>'+
     '<div class="f"><i>'+T.km+'</i><input id="r_km" type="number" inputmode="numeric" value="'+esc(r&&r.km?r.km:(c&&c.km||''))+'"></div>'+
     '<div class="f"><i>'+T.job+'</i><input id="r_job" value="'+esc(r?r.job:'')+'" style="text-align:left"></div>'+
     '<div class="f"><i>'+T.paid+' ('+cur+')</i><input id="r_pd" type="number" inputmode="numeric" value="'+esc(pd)+'"></div>'+
     (r&&TAG[r.tag]?'<div class="nx" style="border-style:solid;border-color:#2a3142">'+T.labor+': <span class="tag '+TAG[r.tag][0]+'">'+TAG[r.tag][1]+(r.tagp?' '+esc(r.tagp):'')+'</span>'+(r.tagx?'<br><small>'+esc(r.tagx)+'</small>':'')+'</div>':'')+
     '<button class="mt" data-a="more">'+T.more+' ▾</button>'+
     '<div class="f more"><i>'+T.parts+' ('+cur+')</i><input id="r_p" type="number" inputmode="numeric" value="'+esc(r?r.parts:'')+'"></div>'+
     '<div class="f more"><i>'+T.labor+' ('+cur+')</i><input id="r_l" type="number" inputmode="numeric" value="'+esc(r?r.labor:'')+'"></div>'+
     '<div class="f more"><i>'+T.shop+'</i><input id="r_s" value="'+esc(r?r.shop:'')+'"></div>'+
     '<div class="f more"><i>'+T.photo+'</i><label style="display:flex;gap:8px;align-items:center;cursor:pointer"><span id="r_phn" style="color:#9aa3a0;font-size:12px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span><span style="border:1px solid #3a4152;padding:6px 10px;white-space:nowrap">📷 '+(KO?'사진 고르기':'Choose photo')+'</span><input id="r_ph" type="file" accept="image/*" style="display:none"></label></div>'+(r&&r.photo?'<img class="rc" src="'+r.photo+'">':'')+
     '<div class="f more"><i>'+T.memo+'</i><input id="r_m" value="'+esc(r?r.memo:'')+'" style="text-align:left"></div></div>'+
     '<div class="row2">'+(isEd?'<button data-a="delrec" data-id="'+r.id+'">'+T.del+'</button>':'')+'<button class="go" data-a="saverec">'+T.save+'</button></div>';
    frame(isEd?T.edit:T.rec,'',h,'home');S._r=r||{};S._r.cur=cur};
  V.years=function(){var c=car();if(!c)return V.home();var R=recs(c),Y={},cur=c.cur||(isKRW()?'KRW':'USD'),tot=0,tg={};
    R.forEach(function(r){var y=(r.date||'').slice(0,4)||'-';var v=tot(r);Y[y]=(Y[y]||0)+v;tot+=v;if(r.tag)tg[r.tag]=(tg[r.tag]||0)+1});
    var ys=Object.keys(Y).sort().reverse();
    var h='<div class="sum">'+ys.slice(0,2).map(function(y){return '<div><small>'+y+'</small>'+money(Y[y],cur)+'</div>'}).join('')+(ys.length<2?'<div></div>':'')+'<div><small>'+T.total+'</small>'+money(tot,cur)+'</div></div>';
    h+=ys.map(function(y){return '<div class="e"><div class="h"><b>'+y+'</b><span>'+money(Y[y],cur)+'</span></div></div>'}).join('');
    var tk=Object.keys(tg);if(tk.length)h+='<div class="nx" style="border-style:solid;border-color:#2a3142">'+T.labor+' · '+tk.map(function(k){return '<span class="tag '+TAG[k][0]+'">'+TAG[k][1]+'</span> '+tg[k]+T.cnt}).join(' &nbsp;')+'</div>';
    frame(T.byYear,'',h,'home')};
  function shrink(file,cb){var fr=new FileReader();fr.onload=function(){var im=new Image();im.onload=function(){var w=Math.min(700,im.width),h=Math.round(im.height*w/im.width);var c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);cb(c.toDataURL('image/jpeg',.6))};im.src=fr.result};fr.readAsDataURL(file)}
  S.addEventListener('change',function(e){if(e.target.id==='r_ph'){var n=S.querySelector('#r_phn');if(n)n.textContent=e.target.files[0]?e.target.files[0].name:''}});
  S.addEventListener('click',function(e){var b=e.target.closest('[data-a],[data-rec],[data-car]');if(!b)return;
    if(b.dataset.car){G.cur=b.dataset.car;save();return V.home()}
    if(b.dataset.rec)return V.rec(b.dataset.rec);
    var a=b.dataset.a,$=function(i){return S.querySelector('#'+i)};
    if(a==='close')close();else if(a==='home')V.home();else if(a==='menu')V.menu();else if(a==='more'){S.querySelector('.frm').classList.toggle('open')}else if(a==='newcar')V.car(true);else if(a==='editcar')V.car();else if(a==='rec')V.rec();else if(a==='years')V.years();
    else if(a==='savecar'){var id=b.dataset.id,c=G.cars.filter(function(x){return x.id===id})[0];if(!c){c={id:uid(),cur:isKRW()?'KRW':'USD'};G.cars.push(c)}
      c.name=$('g_nm').value.trim()||'My car';c.vin=$('g_vin').value.toUpperCase().replace(/[^A-Z0-9]/g,'');c.yr=$('g_yr').value.trim();c.km=$('g_km').value;c.oilkm=$('g_ok').value;c.oilmo=$('g_om').value;G.cur=c.id;save();
      if(S._pending){var p=S._pending;S._pending=null;V.rec(p)}else V.home()}
    else if(a==='delcar'){var c2=car();if(c2&&confirm(T.delcar)){G.recs=G.recs.filter(function(r){return r.car!==c2.id});G.cars=G.cars.filter(function(x){return x.id!==c2.id});G.cur=G.cars[0]?G.cars[0].id:null;save();V.home()}}
    else if(a==='saverec'){var c3=car();if(!c3)return;var r=S._r||{},ex=G.recs.filter(function(x){return x.id===r.id})[0];var o=ex||Object.assign({},r,{id:uid(),car:c3.id});
      var nd=$('r_dt').value,nk=+$('r_km').value||0;
      if(nd&&nd>today()&&!confirm(T.futq))return;
      if(nk){var prior=G.recs.filter(function(x){return x.car===c3.id&&x.id!==o.id&&x.date&&x.date<=nd&&+x.km>nk}).sort(function(a,b){return +b.km-+a.km})[0];if(prior&&!confirm(T.kmq.replace('{a}',(+prior.km).toLocaleString()).replace('{b}',nk.toLocaleString())))return}
      o.date=nd;o.km=$('r_km').value;o.job=$('r_job').value.trim();o.parts=$('r_p').value;o.labor=$('r_l').value;o.paid=$('r_pd').value;o.shop=$('r_s').value.trim();o.memo=$('r_m').value.trim();o.cur=r.cur;
      var snap=JSON.stringify(G);if(!ex)G.recs.push(o);if(o.km&&+o.km>(+c3.km||0))c3.km=o.km;
      var f=$('r_ph').files&&$('r_ph').files[0];
      function fin(){if(save())V.home();else G=JSON.parse(snap)}
      if(f){shrink(f,function(d){o.photo=d;fin()})}else fin()}
    else if(a==='delrec'){if(confirm(T.delq)){G.recs=G.recs.filter(function(x){return x.id!==b.dataset.id});save();V.home()}}
    else if(a==='exp')backup();
    else if(a==='fbk')window.open(FB,'_blank','noopener');else if(a==='igm')window.open(IG,'_blank','noopener');
    else if(a==='imp'){var i=document.createElement('input');i.type='file';i.accept='application/json,.json';i.onchange=function(){var fr=new FileReader();fr.onload=function(){try{var d=JSON.parse(fr.result);if(!d||!d.cars||!d.recs)throw 0;if((d.v||1)>SCHEMA){alert(T.newer);return}
        var ids={};G.cars.forEach(function(c){ids[c.id]=1});d.cars.forEach(function(c){if(!ids[c.id])G.cars.push(c)});var rid={};G.recs.forEach(function(r){rid[r.id]=1});var dup=0;d.recs.forEach(function(r){if(!rid[r.id])G.recs.push(r);else dup++});if(!G.cur)G.cur=d.cur;if(save())alert(T.impOk+(dup?' · '+T.dupImp+' ('+dup+')':''));V.home()}catch(e){alert(T.impNo)}};fr.readAsText(i.files[0])};i.click()}
  });
  /* 공임 계산 창 → 차계부에 저장 */
  function hookLabor(P){if(P.querySelector('.glb')||P.classList.contains('rcv'))return;var snd=P.querySelector('#lbsend');if(!snd)return;
    var b=document.createElement('button');b.type='button';b.className='glb';b.textContent=T.toLedger;snd.parentNode.insertBefore(b,snd);
    b.onclick=function(){var Tl=window.__iccT||{};var pv=null,lv=P.querySelector('#lblab');P.querySelectorAll('.r').forEach(function(r){var k=r.querySelector('.k');if(k&&k.textContent===Tl.parts)pv=r.querySelector('.v')});
      var names=[].slice.call(P.querySelectorAll('.hh')).map(function(x){return x.closest('.r').querySelector('.nm')}).map(function(n){return (n.firstChild&&n.firstChild.textContent||'').trim()}).filter(Boolean);
      var hj=[].slice.call(P.querySelectorAll('.hj')).filter(function(x){return x.value!==''}).map(function(x){var n=x.closest('.r').querySelector('.nm');return n?n.textContent.trim():''});
      var job=names.concat(hj).filter(function(x,i,a){return x&&a.indexOf(x)===i});
      var vd=P.querySelector('#ilvd'),tag='',tagp='',tagx='';
      if(vd&&vd.dataset.labor!==undefined&&vd.textContent){var tx=vd.textContent;var bgt=(P.querySelector('#ilbig')||{}).textContent;if(bgt)tx=bgt;tagx=tx+((P.querySelector('#ilsel')||{}).selectedOptions?' · '+P.querySelector('#ilsel').selectedOptions[0].textContent:'');
        var m=tx.match(/(\d+)%/);if(/바가지|rip-off/i.test(tx))tag='rip';else if(vd.classList.contains('hi'))tag='hi';else if(vd.classList.contains('lo'))tag='lo';else tag='ok';if(m&&(tag==='hi'||tag==='rip'))tagp='+'+m[1]+'%'}
      var lab=lv&&lv.textContent!=='–'?num(lv.textContent):'';
      var q=num((P.querySelector('#lbq')||{}).value);var parts=pv?num(pv.textContent):'';
      var il=vd&&vd.dataset.labor!==undefined?+vd.dataset.labor:null;var qd=num((P.querySelector('#ilq')||{}).value);
      var L2=il!=null?il:(q?Math.max(q-(parts||0),0):lab),P2=q?Math.max(q-L2,0):parts;var PD=q?q:((+P2||0)+(+L2||0)||'');
      var rec={job:job.slice(0,4).join(', ')+(job.length>4?' 외 '+(job.length-4):''),parts:P2,labor:L2,paid:PD,shop:(P.querySelector('#lbshop')||{}).value||'',tag:tag,tagp:tagp,tagx:tagx,date:today()};
      if(!lab&&!q&&!qd&&rec.shop==='')rec.tag='';
      open('home');if(!car()){S._pending=rec;V.car(true)}else V.rec(rec)}}
  new MutationObserver(function(){var P=document.getElementById('icclb');if(P)hookLabor(P)}).observe(document.body,{childList:true});
  /* 카메라로 찍은 차대번호를 기억해 두었다가 차 추가에 채움 */
  document.addEventListener('click',function(e){var g=e.target.closest&&e.target.closest('#vsheet .go');if(g){var v=document.querySelector('#vsheet .vv');var t=(v&&v.textContent||'').replace(/[^A-Z0-9]/g,'');if(t)try{localStorage.setItem('icc_lastvin',t)}catch(x){}}},true);
  function mount(){var ab=document.getElementById('appb');if(!ab||document.getElementById('garb'))return!!ab;
    var b=ab.cloneNode(false);b.id='garb';b.removeAttribute('aria-haspopup');b.innerHTML='<svg class="gic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M3 10 12 4l9 6v10H3z"/><path d="M7 20v-7h10v7M7 16h10"/></svg><span class="gtx">'+T.btn+'</span>';b.setAttribute('aria-label',T.btn);b.title=T.btn;b.onclick=function(e){e.preventDefault();e.stopPropagation();open('home')};
    ab.parentNode.insertBefore(b,ab);document.body.appendChild(S);capH();addEventListener('resize',function(){if(!busy)capH()});return true}
  var busy=false;function capH(){var h=document.querySelector('.top h1'),tl=document.querySelector('.top .tl');if(!h||!tl)return;
    h.style.removeProperty('max-width');var hr=h.getBoundingClientRect(),tr=tl.getBoundingClientRect();
    if(tr.left<hr.right+4){h.style.setProperty('max-width',Math.max(80,tr.left-hr.left-8)+'px','important');h.style.setProperty('overflow','hidden','important');h.style.setProperty('white-space','nowrap','important')}
    var fs=parseFloat(getComputedStyle(h).fontSize),n=0;while(h.scrollWidth>h.clientWidth+1&&fs>11&&n<30){fs-=.5;h.style.setProperty('font-size',fs+'px','important');n++}}
  addEventListener('load',function(){setTimeout(capH,100);setTimeout(capH,1200)});if(document.fonts)document.fonts.ready.then(function(){setTimeout(capH,50)});
  if(!mount()){var n=0,t=setInterval(function(){if(mount()||++n>40)clearInterval(t)},150)}
  function narrowOS(){var o=document.getElementById('osb'),sh=document.getElementById('apsh');if(!o)return;var n=innerWidth<=430;
    o.style.setProperty('display',n?'none':'','important');
    if(sh&&!document.getElementById('osb2')){var b2=document.createElement('button');b2.type='button';b2.id='osb2';b2.className='appb';b2.style.cssText='display:block;margin:10px auto 0;padding:6px 14px';
      b2.onclick=function(e){e.preventDefault();o.click();b2.textContent=(KO?'화면 모양 바꾸기: ':'Switch look: ')+o.textContent};b2.textContent=(KO?'화면 모양 바꾸기: ':'Switch look: ')+o.textContent;sh.appendChild(b2)}
    var b3=document.getElementById('osb2');if(b3)b3.style.display=n?'block':'none';
    var lg=document.querySelector('.top .lng');if(lg){lg.style.setProperty('display',n?'none':'','important');
      if(sh&&!document.getElementById('lng2')){var lm=lg.querySelector('.lngm');if(lm){var d=document.createElement('div');d.id='lng2';d.style.cssText='display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:12px 0 0';
        [].slice.call(lm.querySelectorAll('a')).forEach(function(a){var c=a.cloneNode(true);c.style.cssText='border:1px solid currentColor;padding:4px 9px;color:inherit;text-decoration:none;font-size:13px';d.appendChild(c)});sh.appendChild(d)}}
      var l2=document.getElementById('lng2');if(l2)l2.style.display=n?'flex':'none'}
    capH()}
  var nt=0,ni=setInterval(function(){narrowOS();if(document.getElementById('osb')||++nt>30)clearInterval(ni)},200);addEventListener('resize',narrowOS);
  window.__iccGarage={open:open};
})();
