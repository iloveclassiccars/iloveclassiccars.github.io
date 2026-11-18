/* I Love Classic Cars: 국제 표준 공임 (어림)
   형 원칙: 한국은 공임 기준이 없다 → 국제 표준 공임을 넣는다 → 싸게/비싸게/바가지를 알게 한다 (전 세계 차주 마찬가지)
   계산: 작업시간 합계 × 나라별 시간당 공임 = 국제 표준 공임 범위
   시간당 공임 출처 (채림 조사, 2026-11-18 기준):
    독일  독립 €68–104 · 딜러 €93–156  (독일 정비업계 2024 조사, 세전)
    미국  독립 $100–139 (응답 47%, OEC·PartsTech 2025.9) · 딜러 $150–210 (CostInsightHub 2026 가이드, 참고값)
    영국  벤츠 전문점 £65–85 · 벤츠 딜러 £130–180 (2025 업계 인터뷰 참고)
    일본  수입차 ¥6,001–9,000 (45%) · ¥9,001–11,000 (52%) (아이치현 정비진흥회 2023.12, 세금 포함)
    한국  공임 기준 없음 → 형 결정: 숫자 없이 '엿장수 맘대로'로 둠 (2026-11-18)
   W140 S600 참고 작업시간 (Free Labor Times 공개 페이지, 벤츠 공식 AW 아님): 엔진오일 1.0h, 미션오일 1.1h */
(function(){
  var KO=(document.documentElement.lang||'ko').indexOf('ko')===0;
  var R=[
    ['de_i','🇩🇪 '+(KO?'독일 · 일반 정비소':'Germany · independent'),'EUR',68,104,'2024'],
    ['de_d','🇩🇪 '+(KO?'독일 · 딜러':'Germany · dealer'),'EUR',93,156,'2024'],
    ['us_i','🇺🇸 '+(KO?'미국 · 일반 정비소':'USA · independent'),'USD',100,139,'2025'],
    ['us_d','🇺🇸 '+(KO?'미국 · 딜러':'USA · dealer'),'USD',150,210,'2026'],
    ['uk_i','🇬🇧 '+(KO?'영국 · 벤츠 전문점':'UK · Mercedes specialist'),'GBP',65,85,'2025'],
    ['uk_d','🇬🇧 '+(KO?'영국 · 벤츠 딜러':'UK · Mercedes dealer'),'GBP',130,180,'2025'],
    ['jp_i','🇯🇵 '+(KO?'일본 · 수입차 정비':'Japan · import shops'),'JPY',6001,9000,'2023'],
    ['jp_d','🇯🇵 '+(KO?'일본 · 수입차 상위':'Japan · import, upper'),'JPY',9001,11000,'2023'],
    ['kr','🇰🇷 '+(KO?'한국 · 엿장수 맘대로':'Korea · no standard'),'KRW',0,0,'']];
  var STD={eo:1.0,to:1.1}; /* W140 S600 참고 */
  /* 부품별 표준 작업시간 (W140 S600 1997, Free Labor Times 공개 참고값, 채림 조사 2026-11-18)
     점화코일 1개 0.5h(전체 2.3h 상한) · 앞 패드 1.5h · 뒤 패드 1.2h · 뒤 쇼크 한 쌍 1.9h · 라디에이터(S600) 4.5h
     보류: 앞 쇼크·엔진 마운트(S600 외 엔진)·워터펌프·타이밍체인·하네스 */
  var PH={p6:[0.5,2.3],p19:[0.5,2.3],p180:[1.5],p181:[1.2],p182:[1.2],p74:[1.9],p117:[4.5]};
  function partStd(k){var d=PH[k];if(!d)return null;if(d.length===1)return d[0];
    var q=1;var a=document.querySelector('#list .add[data-add="'+k+'"]');if(a){var art=a.closest('article');var b=art&&art.querySelector('.qs b');q=parseInt(b&&b.textContent)||1}
    return Math.min(+(d[0]*q).toFixed(1),d[1])}
  var SYM={EUR:'€',USD:'$',GBP:'£',JPY:'¥',KRW:'₩'};
  var T=KO?{t:'국제 표준 공임 (어림)',pick:'나라 고르기',why:'한국은 공임 기준이 없어요. 나라별 표준 공임과 비교해 싼지 비싼지 바가지인지 보세요.',
      std:'작업만 하는 공임에 표준 시간 넣기 (W140 S600 참고)',rng:'이 작업의 국제 표준 공임',nofx:'원화 환산 환율이 없어 현지 통화로만 보여요',
      yl:'받은 견적 속 공임',cheap:'싸게 하셨어요 · 국제 표준보다 낮아요',fair:'국제 표준 범위 안이에요',high:'비싸요 · 국제 표준보다 {p}% 높아요 · 추가 작업이 있었는지 물어보세요',rip:'바가지 의심 · 국제 표준보다 {p}% 높아요 · 추가 작업이 있었는지 물어보세요',
      src:'시간당 공임: 각국 정비업계 조사(2023~2025). 작업시간: 공개 참고값(벤츠 공식 아님). 어림이에요.',ql:'견적서의 공임',more:'비교 기준 보기',less:'간단히 보기',above:'비교 범위보다 {d} 높아요',below:'비교 범위보다 {d} 낮아요',inr:'비교 범위 안이에요',cmp:'비교 범위',nodata:'비교 자료 없음 · 이 부품은 작업시간 자료가 아직 없어요',kr:'한국은 공임 기준이 없어요 · 엿장수 맘대로',enter:'견적서에 적힌 공임을 넣어 보세요',v_hi:'비쌈',v_rip:'바가지 의심',v_lo:'싸게 하셨어요',v_ok:'적정',ask:'추가 작업이 있었는지 물어보세요'}
    :{t:'International standard labor (estimate)',pick:'Choose a country',why:'Compare with standard labor rates by country to see if a quote is cheap, fair or a rip-off.',
      std:'Fill standard hours (W140 S600 reference)',rng:'International standard labor for this job',nofx:'No exchange rate, shown in local currency',
      yl:'Labor inside your quote',cheap:'Cheap · below the international standard',fair:'Within the international standard',high:'Pricey · {p}% above the international standard · ask if extra work was done',rip:'Possible rip-off · {p}% above the international standard · ask if extra work was done',
      src:'Hourly rates: national repair-trade surveys (2023-2025). Hours: public reference values (not official Mercedes). Estimate only.',ql:'Labor on your quote',more:'Show comparison basis',less:'Simple view',above:'{d} above the comparison range',below:'{d} below the comparison range',inr:'Within the comparison range',cmp:'Comparison range',nodata:'No comparison data · no labor hours for these parts yet',kr:'Korea has no labor standard',enter:'Enter the labor amount on your quote',v_hi:'Pricey',v_rip:'Possible rip-off',v_lo:'Cheap',v_ok:'Fair',ask:'ask if extra work was done'};
  function fx(){var s={usd:1400,eur:1600,jpy:850};try{var v=JSON.parse(localStorage.getItem('w140m')||'null');if(v){s.usd=+v.usd||s.usd;s.eur=+v.eur||s.eur;s.jpy=+v.jpy||s.jpy}}catch(e){}
    return {USD:s.usd,EUR:s.eur,JPY:s.jpy/100,KRW:1,GBP:0}}
  function num(t){return parseFloat(String(t||'').replace(/[^0-9.]/g,''))||0}
  function isKRW(){var t=(document.querySelector('#list article.c .krw')||{}).textContent||'원';return /원/.test(t)}
  function won(n){if(isKRW())return Math.round(n).toLocaleString('ko-KR')+'원';var u=fx().USD||1400;return '$'+Math.round(n/u).toLocaleString('en-US')}
  function inDisp(n){return isKRW()?Math.round(n):Math.round(n/(fx().USD||1400))}
  function loc(n,c){return SYM[c]+Math.round(n).toLocaleString('en-US')}
  var sel=localStorage.getItem('icc_labor_c')||'de_i';
  (function(){var st=document.createElement('style');st.textContent='#icclb.ils>*:not(.uphd):not(#ilbox):not(.glb):not(.qf){display:none!important}'+
   '#ilbig{margin:10px 10px 2px;padding:12px 10px;border:1px solid #3a4152;text-align:center}#ilbig b{display:block;font-size:18px;line-height:1.35}#ilbig span{display:block;font-size:12.5px;margin-top:3px}'+
   '#ilbig.hi{border-color:#d9a441;color:#d9a441}#ilbig.ok{border-color:#2AA84B;color:#2AA84B}#ilbig.lo{border-color:#5aa9ff;color:#5aa9ff}#ilbig.nod{color:#9aa3a0;font-size:13px}'+
   '#ilrg2{text-align:center;color:#9aa3a0;font-size:12px;margin:4px 10px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}';document.head.appendChild(st)})();
  function rowVal(P,label){var out=null;P.querySelectorAll('.r').forEach(function(r){var k=r.querySelector('.k');if(k&&k.textContent===label)out=r.querySelector('.v')});return out}
  function enhance(P){
    if(P.querySelector('#ilsel')||P.classList.contains('rcv')&&false)return;
    var rate=P.querySelector('#lbrate');if(!rate)return;
    var rr=rate.closest('.r');
    var box=document.createElement('div');box.id='ilbox';
    box.innerHTML='<div class="nt" style="padding:6px 10px 4px">'+T.why+'</div>'+
      '<div class="r"><span class="k">'+T.pick+'</span><span><select id="ilsel" style="max-width:210px">'+R.map(function(x){return '<option value="'+x[0]+'"'+(x[0]===sel?' selected':'')+'>'+x[1]+'</option>'}).join('')+'</select></span></div>'+
      '<div class="r"><span class="k">'+T.ql+'</span><span><input id="ilq" type="number" inputmode="numeric" min="0" style="width:120px"></span></div>'+
      '<div id="ilbig"></div><div id="ilrg2"></div>'+
      '<div class="vd" id="ilvd" style="display:none"></div>'+
      '<button type="button" class="gdb" id="iltg">'+T.more+' <i>›</i></button>'+
      '<div id="ildt" style="display:none"><div class="sec">'+T.t+'</div>'+
      '<div class="r"><span class="k" id="ilhr"></span><span class="v" id="ilhv"></span></div>'+
      '<div class="r"><span class="k">'+T.rng+'</span><span class="v" id="ilrg">–</span></div>'+
      '<button type="button" class="gdb" id="ilstd">'+T.std+'</button>'+
      '<div class="nt">'+T.src+'</div></div>';
    var hd=P.querySelector('.uphd');P.insertBefore(box,hd?hd.nextSibling:P.firstChild);
    if(!P.classList.contains('rcv'))P.classList.add('ils');
    box.querySelector('#iltg').onclick=function(){var op=P.classList.toggle('ils');box.querySelector('#ildt').style.display=op?'none':'block';this.innerHTML=(op?T.more:T.less)+' <i>›</i>'};
    var car=(window.CAR||'w140');
    P.querySelectorAll('.hj').forEach(function(x){if(car==='w140'&&STD[x.dataset.j]!=null)x.placeholder=STD[x.dataset.j]});
    if(car==='w140'&&!P.classList.contains('rcv'))P.querySelectorAll('.hh').forEach(function(x){var v=partStd(x.dataset.k);if(v==null)return;x.placeholder=v;
      if(x.value===''){x.value=v;x.title=KO?'표준 작업시간 (참고값)':'Standard hours (reference)';x.dispatchEvent(new Event('input',{bubbles:true}))}});
    var bstd=box.querySelector('#ilstd');if(car!=='w140')bstd.style.display='none';
    bstd.onclick=function(){P.querySelectorAll('.hj').forEach(function(x){if(x.value===''&&x.placeholder){x.value=x.placeholder;x.dispatchEvent(new Event('input',{bubbles:true}))}});upd()};
    box.querySelector('#ilsel').onchange=function(){sel=this.value;try{localStorage.setItem('icc_labor_c',sel)}catch(e){}
      var c=cur(),F=fx()[c[2]];if(!c[3]){rate.value='';rate.dispatchEvent(new Event('input',{bubbles:true}))}else if(F){rate.value=inDisp((c[3]+c[4])/2*F);rate.dispatchEvent(new Event('input',{bubbles:true}))}upd()};
    P.addEventListener('input',function(){setTimeout(upd,0)});
    upd();
    function cur(){return R.filter(function(x){return x[0]===sel})[0]||R[0]}
    function hours(){var h=0;P.querySelectorAll('.hh,.hj').forEach(function(x){if(x.value!=='')h+=+x.value});return h}
    function upd(){var c=cur(),F=fx()[c[2]],h=hours();
      if(!c[3]){box.querySelector('#ilhr').textContent=KO?'시간당 공임':'Hourly rate';box.querySelector('#ilhv').textContent=KO?'기준 없음 · 엿장수 맘대로':'No standard';
        box.querySelector('#ilrg').textContent='–';var z=box.querySelector('#ilvd');z.style.display='none';z.textContent='';delete z.dataset.labor;var bg=box.querySelector('#ilbig');bg.className='nod';bg.textContent=T.kr;box.querySelector('#ilrg2').textContent='';return}
      box.querySelector('#ilhr').textContent=KO?'시간당 공임 ('+c[5]+')':'Hourly rate ('+c[5]+')';
      box.querySelector('#ilhv').textContent=(c[3]===c[4]?loc(c[3],c[2]):loc(c[3],c[2])+'–'+loc(c[4],c[2]))+(F&&c[2]!=='KRW'&&!(c[2]==='USD'&&!isKRW())?' ≈ '+won(c[3]*F)+(c[3]===c[4]?'':'–'+won(c[4]*F)):'')+(!F?' *':'');
      var rg=box.querySelector('#ilrg'),vd=box.querySelector('#ilvd'),big=box.querySelector('#ilbig'),r2=box.querySelector('#ilrg2');
      if(!h){rg.textContent='–';vd.style.display='none';big.className='nod';big.textContent=T.nodata;r2.textContent='';delete vd.dataset.labor;return}
      var lo=c[3]*h,hi=c[4]*h;
      rg.textContent=F?(won(lo*F)+(lo===hi?'':' ~ '+won(hi*F))):(loc(lo,c[2])+' ~ '+loc(hi,c[2])+' ('+T.nofx+')');
      if(!F){big.className='nod';big.textContent='';r2.textContent=rg.textContent;vd.style.display='none';return}
      var L=inDisp(lo*F),H=inDisp(hi*F);var dsp=function(n){return isKRW()?Math.round(n).toLocaleString('ko-KR')+'원':'$'+Math.round(n).toLocaleString('en-US')};
      r2.textContent=T.cmp+' '+dsp(L)+(L===H?'':' ~ '+dsp(H))+' · '+c[1].replace(/^\S+\s/,'');
      var qd=+(box.querySelector('#ilq').value||0),q=+((P.querySelector('#lbq')||{}).value||0),ql;
      if(qd){ql=qd}else{if(!q){big.className='nod';big.textContent=T.enter;vd.style.display='none';delete vd.dataset.labor;return}
        var pv=rowVal(P,(window.__iccT||{}).parts),mv=rowVal(P,(window.__iccT||{}).mg);
        var parts=pv?num(pv.textContent):0,mg=0;if(mv){var m=mv.textContent.split('~');mg=(num(m[0])+num(m[1]))/2}ql=q-parts-mg}
      vd.style.display='none';vd.dataset.labor=Math.round(Math.max(ql,0));
      var p=Math.round((ql/H-1)*100);
      var tx=T.yl+' ≈ '+(isKRW()?Math.round(Math.max(ql,0)).toLocaleString('ko-KR')+'원':'$'+Math.round(Math.max(ql,0)).toLocaleString('en-US'))+' · ';
      if(ql<L){vd.className='vd lo';vd.textContent=tx+T.cheap;big.className='lo';big.innerHTML='<b>'+T.below.replace('{d}',dsp(L-ql))+'</b><span>'+T.v_lo+'</span>'}
      else if(ql<=H){vd.className='vd ok';vd.textContent=tx+T.fair;big.className='ok';big.innerHTML='<b>'+T.inr+'</b><span>'+T.v_ok+'</span>'}
      else if(ql<=H*1.5){vd.className='vd hi';vd.textContent=tx+T.high.replace('{p}',p);big.className='hi';big.innerHTML='<b>'+T.above.replace('{d}',dsp(ql-H))+'</b><span>'+T.v_hi+' · '+T.ask+'</span>'}
      else{vd.className='vd hi';vd.textContent=tx+T.rip.replace('{p}',p);big.className='hi';big.innerHTML='<b>'+T.above.replace('{d}',dsp(ql-H))+'</b><span>'+T.v_rip+' · '+T.ask+'</span>'}}
  }
  new MutationObserver(function(){var P=document.getElementById('icclb');if(P&&!P.querySelector('#ilbox'))enhance(P)}).observe(document.body,{childList:true});
})();
