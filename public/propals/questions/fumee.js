/* La fumee de la page d'accueil vyvre.fr, extraite telle quelle de /scan/index.html (bloc sig-da-js, lignes 2283-2317). */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---- fond : shader chrome liquide ---- */
  var c=document.createElement('canvas'); c.id='sig-gl'; document.body.insertBefore(c,document.body.firstChild);
  var g=document.createElement('div'); g.id='sig-grain'; document.body.insertBefore(g,c.nextSibling);
  var gl=c.getContext('webgl',{alpha:false,antialias:false});
  if(gl){
    var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs='precision highp float;uniform vec2 r;uniform float t;uniform vec2 m;'+
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'+
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}'+
    'uniform float v;void main(){vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;float tt=t*.022;'+'vec2 dm=uv-m;float dl=length(dm);float inf=exp(-dl*dl*2.4);'+'float ang=inf*(.16+v*.25)*sin(t*.12+dl*3.);float ca=cos(ang),sa=sin(ang);'+'vec2 q=m+mat2(ca,-sa,sa,ca)*dm;q+=normalize(dm+1e-4)*inf*(.012+v*.03)*sin(dl*8.-t*.6);'+
    'vec2 w=vec2(fbm(q*1.6+tt),fbm(q*1.6-tt*.7+3.1));vec2 w2=vec2(fbm(q*2.2+w*1.4+tt*.5),fbm(q*2.2+w*1.4-tt*.4));'+
    'float f=fbm(q*1.2+w2*1.8);'+
    'vec3 base=vec3(.016,.018,.024);vec3 plat=vec3(.93,.91,.87);vec3 champ=vec3(.85,.78,.62);vec3 cyan=vec3(.62,.84,.9);'+
    'float band=smoothstep(.42,.62,f)*smoothstep(.85,.62,f);'+
    'vec3 col=base+plat*band*.22+champ*smoothstep(.55,.8,f)*.18+cyan*smoothstep(.2,.35,f)*smoothstep(.45,.3,f)*.12;'+
    'float spec=pow(max(0.,1.-abs(f-.58)*9.),6.);col+=vec3(1.)*spec*.22;'+
    'col+=champ*.10*exp(-dl*dl*7.)+plat*.08*inf*smoothstep(.45,.6,f)*(.5+v);'+
    'col*=1.-.55*length(uv*vec2(.7,1.));gl_FragColor=vec4(col,1.);}';
    function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o;}
    var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
    var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    var lp=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
    var ur=gl.getUniformLocation(pr,'r'),ut=gl.getUniformLocation(pr,'t'),um=gl.getUniformLocation(pr,'m'),uv2=gl.getUniformLocation(pr,'v');var vit=0,px=0,py=0;
    var mx=0,my=0,tx=0,ty=0,dpr=Math.min(devicePixelRatio||1,1.25);
    function size(){c.width=innerWidth*dpr*.6;c.height=innerHeight*dpr*.6;c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';gl.viewport(0,0,c.width,c.height);}
    size();addEventListener('resize',size);
    var suivre=function(x,y){var nx=(x/innerWidth-.5)*innerWidth/innerHeight,ny=-(y/innerHeight-.5);vit=Math.min(1,vit+Math.hypot(nx-px,ny-py)*2.2);px=nx;py=ny;tx=nx;ty=ny;};addEventListener('pointermove',function(e){suivre(e.clientX,e.clientY);},{passive:true});addEventListener('pointerdown',function(e){suivre(e.clientX,e.clientY);vit=Math.min(1,vit+.2);},{passive:true});addEventListener('touchmove',function(e){var tp=e.touches&&e.touches[0];if(tp)suivre(tp.clientX,tp.clientY);},{passive:true});
    var t0=performance.now();
    (function frame(now){mx+=(tx-mx)*.018;my+=(ty-my)*.018;vit*=.975;gl.uniform2f(ur,c.width,c.height);gl.uniform1f(ut,reduce?0:(now-t0)/1000);gl.uniform2f(um,mx,my);gl.uniform1f(uv2,vit);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);if(!reduce)requestAnimationFrame(frame);})(t0);
  }

  /* la lumière suit la souris sur les boutons ; filtre liquide (turbulence animée) */
})();
