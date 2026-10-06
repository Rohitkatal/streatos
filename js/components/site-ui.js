/* site-ui.js - your ORIGINAL script (marquee, QR glyph, theme, mega menu, mobile menu, tabs).
   Moved out of index.html unchanged; it now loads as an ES module. */
(function(){
  /* marquee: categories from the concept note */
  var cats=['Pulses','Rice','Grains','Spices','Honey','Dry fruits','Pickles','Traditional foods','Organic products','Natural products','Snacks','Beverages','Regional specialties','Locally sourced goods'];
  var tr=document.getElementById('track'),h='';
  for(var k=0;k<2;k++)cats.forEach(function(c){h+='<span>'+c+'</span>'});
  tr.innerHTML=h;

  /* stylised scan mark (decorative) */
  var g=document.getElementById('glyph'),n=9,s=7,out='';
  for(var y=0;y<n;y++){for(var x=0;x<n;x++){
    var f=(x<3&&y<3)||(x>n-4&&y<3)||(x<3&&y>n-4),on;
    if(f){var fx=x%(n-3),fy=y%(n-3);on=!(fx===1&&fy===1)}
    else{s=(s*1103515245+12345)&0x7fffffff;on=(s>>8)%2===0}
    if(on)out+='<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="currentColor"/>';
  }}
  g.innerHTML=out;

  /* theme */
  var root=document.documentElement;
  function dark(){var t=root.getAttribute('data-theme');return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
  try{var sv=localStorage.getItem('streatos-theme');if(sv)root.setAttribute('data-theme',sv)}catch(e){}
  document.querySelectorAll('[data-theme-toggle]').forEach(function(tb){tb.addEventListener('click',function(){var nx=dark()?'light':'dark';root.setAttribute('data-theme',nx);try{localStorage.setItem('streatos-theme',nx)}catch(e){}})});

  /* mega menus */
  var btns=[].slice.call(document.querySelectorAll('.mm-btn'));
  function closeAll(except){btns.forEach(function(b){if(b===except)return;b.setAttribute('aria-expanded','false');document.getElementById(b.getAttribute('aria-controls')).hidden=true})}
  function open(b){closeAll(b);b.setAttribute('aria-expanded','true');document.getElementById(b.getAttribute('aria-controls')).hidden=false}
  btns.forEach(function(b){
    b.addEventListener('click',function(){b.getAttribute('aria-expanded')==='true'?closeAll():open(b)});
    b.parentNode.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover)').matches)open(b)});
    b.parentNode.addEventListener('mouseleave',function(){if(matchMedia('(hover:hover)').matches)closeAll()});
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
  document.addEventListener('click',function(e){if(!e.target.closest('.mm'))closeAll()});
  document.querySelectorAll('.mm-panel a').forEach(function(a){a.addEventListener('click',closeAll)});

  /* mobile menu */
  var bg=document.getElementById('burger'),mob=document.getElementById('mobile');
  function mobile(show){mob.hidden=!show;bg.setAttribute('aria-expanded',String(show));bg.innerHTML='<svg class="i"><use href="#'+(show?'i-close':'i-menu')+'"/></svg>'}
  bg.addEventListener('click',function(){mobile(mob.hidden)});
  mob.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mobile(false)})});
  matchMedia('(min-width:981px)').addEventListener('change',function(m){if(m.matches)mobile(false)});

  /* tabs */
  var tabs=[].slice.call(document.querySelectorAll('.tab'));
  function pick(id,focus){tabs.forEach(function(t){var on=t.id==='t-'+id;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!on;if(on&&focus)t.focus()})}
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){pick(t.id.slice(2))});
    t.addEventListener('keydown',function(e){
      var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
      if(d){e.preventDefault();pick(tabs[(i+d+tabs.length)%tabs.length].id.slice(2),true)}
    });
  });
  document.querySelectorAll('[data-tab]').forEach(function(a){a.addEventListener('click',function(){pick(a.getAttribute('data-tab'))})});
})();
