/* I Love Classic Cars 앱: 차대번호(VIN) 촬영·확인 화면 (채림 디자인안 #1)
   - 앱(Capacitor)에서는 폰 내장 글자 인식(아이폰 Vision / 안드로이드 ML Kit)을 IccOcr 플러그인으로 부름
   - 웹 미리보기에서는 카메라 사진을 보여 주고 사용자가 직접 입력
   - VIN 규칙: 17자리, I·O·Q는 쓰지 않음 → O→0, I→1, Q→0 자동 교정
   - 헷갈리는 글자(8/B, 5/S, 2/Z, 6/G)는 밑줄, 눌러서 고름 */
(function(){
  var KO=(document.documentElement.lang||'ko').indexOf('ko')===0;
  var T=KO?{btn:'촬영',title:'차대번호 촬영',close:'닫기',hint:'차대번호 한 줄을 틀 안에 맞춰 주세요',
    shot:'찍기',manual:'직접 입력',ok:'이 번호로 검색',check:'밑줄 글자만 확인해 주세요. 누르면 고를 수 있어요',
    num:'숫자',let:'영문',len:function(n){return n+' / 17자리'},nocam:'카메라를 쓸 수 없어요. 직접 입력해 주세요',
    old:'17자리가 아니어도 검색할 수 있어요 (옛 차대번호)'}
   :{btn:'Scan',title:'Scan VIN',close:'Close',hint:'Fit one line of the VIN inside the frame',
    shot:'Capture',manual:'Type it',ok:'Search this VIN',check:'Check only the underlined letters. Tap to choose',
    num:'number',let:'letter',len:function(n){return n+' / 17'},nocam:'Camera not available. Please type the VIN',
    old:'You can search even if it is not 17 characters (older VIN)'};
  var PAIR={'8':'B','B':'8','5':'S','S':'5','2':'Z','Z':'2','6':'G','G':'6'};
  function clean(s){s=(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(s.length===17)s=s.replace(/O|Q/g,'0').replace(/I/g,'1');return s}
  var css=document.createElement('style');css.textContent=
  '#vbtn{flex:0 0 auto;margin-left:6px;padding:0 10px;height:auto;align-self:stretch;background:transparent;border:1px solid #2AA84B;color:#fff;font:inherit;border-radius:0;cursor:pointer;white-space:nowrap}'+
  '#vbtn .vbl{display:none}#vbtn .vbs{display:block}@media(min-width:700px){#vbtn{flex-direction:row!important;gap:6px!important;font-size:13px!important}#vbtn .vbl{display:inline}#vbtn .vbs{display:none}}'+
  '#vsheet{position:fixed;inset:0;z-index:99999;background:#171B26;color:#E8EAEE;display:none;flex-direction:column;font:15px/1.5 -apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif}'+
  '#vsheet.on{display:flex}'+
  '#vsheet .vt{background:#1F4D36;color:#fff;padding:calc(env(safe-area-inset-top) + 12px) 14px 10px;display:flex;align-items:center;justify-content:space-between;font-weight:600}'+
  '#vsheet .vt button{background:none;border:0;color:#fff;font:inherit;font-weight:400;padding:0;min-width:56px;text-align:left}'+
  '#vsheet .vc{position:relative;height:38vh;background:#23262d;overflow:hidden}'+
  '#vsheet video,#vsheet canvas{width:100%;height:100%;object-fit:cover;display:block}'+
  '#vsheet .vf{position:absolute;left:5%;right:5%;top:40%;height:20%;border:2px solid #2AA84B;box-shadow:0 0 0 999px #0008;pointer-events:none}'+
  '#vsheet .vh{text-align:center;font-size:13px;color:#cfd3da;padding:8px 12px}'+
  '#vsheet .vv{margin:4px 14px;padding:10px 6px;border:1px solid #2AA84B;font:700 19px Menlo,Consolas,monospace;text-align:center;letter-spacing:1px;white-space:nowrap;overflow-x:auto}'+
  '#vsheet .vstrip{display:none;margin:10px 14px 0;width:calc(100% - 28px);height:64px;object-fit:cover;border:1px solid #3a4152}#vsheet .vv span{cursor:pointer}#vsheet .vv span.amb{border-bottom:3px solid #d9a441}'+
  '#vsheet .vi{display:none;margin:4px 14px;width:calc(100% - 28px);box-sizing:border-box;padding:10px;background:transparent;border:1px solid #2AA84B;color:#fff;font:700 18px Menlo,Consolas,monospace;letter-spacing:1px;text-transform:uppercase;border-radius:0}'+
  '#vsheet .vp{display:none;gap:8px;justify-content:center;margin:8px}'+
  '#vsheet .vp button{background:transparent;border:1px solid #8a93a6;color:#fff;padding:6px 16px;font:600 15px Menlo,monospace;border-radius:0}'+
  '#vsheet .vp button.on{background:#2AA84B33;border-color:#2AA84B}'+
  '#vsheet .vb{display:flex;gap:10px;margin:12px 14px}'+
  '#vsheet .vb button{flex:1;padding:12px 0;background:transparent;border:1px solid #c9ced8;color:#fff;font:inherit;border-radius:0;white-space:nowrap}'+
  '#vsheet .vb .go{background:#2AA84B;border-color:#2AA84B;font-weight:600}';
  document.head.appendChild(css);
  var sh=document.createElement('div');sh.id='vsheet';sh.innerHTML=
   '<div class="vt"><button class="x">✕ '+T.close+'</button><span>'+T.title+'</span><span style="min-width:56px"></span></div>'+
   '<div class="vc"><video playsinline muted autoplay></video><canvas style="display:none"></canvas><div class="vf"></div></div>'+
   '<div class="vh h1">'+T.hint+'</div>'+
   '<img class="vstrip" alt=""><div class="vv"></div><input class="vi" maxlength="20" autocomplete="off" spellcheck="false">'+
   '<div class="vh h2"></div><div class="vp"></div>'+
   '<div class="vb"><button class="m">'+T.manual+'</button><button class="s">'+T.shot+'</button><button class="go" style="display:none">'+T.ok+'</button></div>';
  var V='',pos=-1,stream=null;
  function $(s){return sh.querySelector(s)}
  function draw(){var h='';for(var i=0;i<V.length;i++){var c=V[i];h+='<span data-i="'+i+'"'+(PAIR[c]?' class="amb"':'')+'>'+c+'</span>'}
    $('.vv').innerHTML=h||'&nbsp;';
    var amb=/[8B5S2Z6G]/.test(V);
    $('.h2').textContent=V?(amb?T.check:(V.length===17?T.len(17):T.old)):'';
    $('.go').style.display=V?'':'none';$('.s').style.display=V?'none':'';}
  function pick(i){pos=i;var c=V[i];if(!PAIR[c])return;var a=/[0-9]/.test(c)?c:PAIR[c],b=PAIR[a];
    $('.vp').style.display='flex';
    $('.vp').innerHTML='<button data-c="'+a+'" class="'+(c===a?'on':'')+'">'+a+' '+T.num+'</button><button data-c="'+b+'" class="'+(c===b?'on':'')+'">'+b+' '+T.let+'</button>';}
  $('.vv').addEventListener('click',function(e){var s=e.target.closest('span[data-i]');if(s)pick(+s.dataset.i)});
  $('.vp').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;V=V.slice(0,pos)+b.dataset.c+V.slice(pos+1);draw();pick(pos)});
  function stop(){if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}}
  function close(){stop();sh.classList.remove('on')}
  $('.x').onclick=close;
  $('.m').onclick=function(){var i=$('.vi');i.style.display='block';$('.vv').style.display='none';i.value=V;i.focus()};
  $('.vi').addEventListener('input',function(){V=clean(this.value);draw()});
  function frameData(){var v=$('video'),c=$('canvas');c.width=v.videoWidth||1280;c.height=v.videoHeight||720;c.getContext('2d').drawImage(v,0,0,c.width,c.height);
    v.style.display='none';c.style.display='block';
    var k=document.createElement('canvas'),sy=Math.round(c.height*.36),sh2=Math.round(c.height*.28);k.width=c.width;k.height=sh2;k.getContext('2d').drawImage(c,0,sy,c.width,sh2,0,0,c.width,sh2);
    var u=k.toDataURL('image/jpeg',.85),im=$('.vstrip');im.src=u;im.style.display='block';$('.vc').style.display='none';return u}
  $('.s').onclick=function(){
    var P=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.IccOcr;
    if(P){P.scanVin().then(function(r){V=clean(r&&r.text);draw()}).catch(function(){$('.m').onclick()});return}
    try{frameData()}catch(e){}
    $('.m').onclick();};
  $('.go').onclick=function(){var q=document.getElementById('q'),g=document.getElementById('go');
    if(q){q.value=V;q.dispatchEvent(new Event('input',{bubbles:true}))}close();if(g)g.click();};
  function open(){V='';pos=-1;$('.vp').style.display='none';$('.vi').style.display='none';$('.vv').style.display='';$('.vstrip').style.display='none';$('.vc').style.display='';
    $('video').style.display='block';$('canvas').style.display='none';draw();sh.classList.add('on');
    if(window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.IccOcr)return;
    if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){
      navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false}).then(function(s){stream=s;$('video').srcObject=s})
      .catch(function(){$('.h1').textContent=T.nocam;$('.m').onclick()})}
    else{$('.h1').textContent=T.nocam;$('.m').onclick()}}
  function mount(){var go=document.getElementById('go');if(!go||document.getElementById('vbtn'))return!!go;
    var b=document.createElement('button');b.id='vbtn';b.type='button';b.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;margin:auto"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.6l1.6-2.2h6.6L16.9 7h2.6A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.4"/></svg><span class="vbl">'+(KO?'차대번호 촬영':'Scan VIN')+'</span><span class="vbs">'+T.btn+'</span>';b.setAttribute('aria-label',T.title);
    [['flex','0 0 auto'],['min-width','46px'],['padding','0 8px'],['display','flex'],['flex-direction','column'],['align-items','center'],['justify-content','center'],['gap','1px'],['margin-left','6px'],['background','transparent'],['border','1px solid #2AA84B'],['border-radius','0'],['font-size','10px'],['line-height','1.1'],['color','#fff']].forEach(function(p){b.style.setProperty(p[0],p[1],'important')});b.onclick=open;
    go.parentNode.insertBefore(b,go);document.body.appendChild(sh);return true}
  if(!mount()){var n=0,t=setInterval(function(){if(mount()||++n>40)clearInterval(t)},150)}
})();
