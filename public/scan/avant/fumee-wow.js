/* La fumee de l'accueil vyvre.fr (copie de fumee.js, qui reste intacte), avec deux reactions pour la propale G WOW :
   VYF.onde(x,y,force)  une onde part d'un point de l'ecran et deforme la fumee (meme teinte, seule la lumiere monte)
   VYF.pouls(force)     la fumee respire une fois plus fort
   Aucune couleur n'est ajoutee : la palette du shader est celle de l'accueil. */
window.VYF=(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var c=document.createElement('canvas'); c.id='sig-gl'; document.body.insertBefore(c,document.body.firstChild);
  var g=document.createElement('div'); g.id='sig-grain'; document.body.insertBefore(g,c.nextSibling);
  var gl=c.getContext('webgl',{alpha:false,antialias:false});
  var api={onde:function(){},pouls:function(){}};
  if(!gl) return api;
  var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs='precision highp float;uniform vec2 r;uniform float t;uniform vec2 m;uniform vec4 o0;uniform vec4 o1;uniform vec4 o2;uniform float pu;'+
  'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
  'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'+
  'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}'+
  /* une onde : anneau qui s'elargit (x,y centre, z age en s, w force) */
  'float ring(vec2 uv,vec4 o){if(o.w<=0.)return 0.;float d=length(uv-o.xy);float R=o.z*.62;return o.w*exp(-pow((d-R)*7.5,2.))*exp(-o.z*1.05)*smoothstep(0.,.08,o.z);}'+
  'vec2 dir(vec2 uv,vec4 o){return normalize(uv-o.xy+1e-4);}'+
  'uniform float v;void main(){vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;float tt=t*.022;'+
  'float r0=ring(uv,o0),r1=ring(uv,o1),r2=ring(uv,o2);float rg=r0+r1+r2;'+
  'vec2 uvw=uv+dir(uv,o0)*r0*.045+dir(uv,o1)*r1*.045+dir(uv,o2)*r2*.045;'+
  'vec2 dm=uvw-m;float dl=length(dm);float inf=exp(-dl*dl*2.4);'+'float ang=inf*(.16+v*.25)*sin(t*.12+dl*3.);float ca=cos(ang),sa=sin(ang);'+'vec2 q=m+mat2(ca,-sa,sa,ca)*dm;q+=normalize(dm+1e-4)*inf*(.012+v*.03)*sin(dl*8.-t*.6);'+
  'vec2 w=vec2(fbm(q*1.6+tt),fbm(q*1.6-tt*.7+3.1));vec2 w2=vec2(fbm(q*2.2+w*1.4+tt*.5),fbm(q*2.2+w*1.4-tt*.4));'+
  'float f=fbm(q*1.2+w2*1.8);'+
  'vec3 base=vec3(.016,.018,.024);vec3 plat=vec3(.93,.91,.87);vec3 champ=vec3(.85,.78,.62);vec3 cyan=vec3(.62,.84,.9);'+
  'float band=smoothstep(.42,.62,f)*smoothstep(.85,.62,f);'+
  'vec3 col=base+plat*band*.22+champ*smoothstep(.55,.8,f)*.18+cyan*smoothstep(.2,.35,f)*smoothstep(.45,.3,f)*.12;'+
  'float spec=pow(max(0.,1.-abs(f-.58)*9.),6.);col+=vec3(1.)*spec*(.22+rg*.35);'+
  'col+=champ*.10*exp(-dl*dl*7.)+plat*.08*inf*smoothstep(.45,.6,f)*(.5+v);'+
  'col*=1.-.55*length(uv*vec2(.7,1.));col*=1.+rg*.55+pu*.16;gl_FragColor=vec4(col,1.);}';
  function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o;}
  var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
  var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  var lp=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
  var ur=gl.getUniformLocation(pr,'r'),ut=gl.getUniformLocation(pr,'t'),um=gl.getUniformLocation(pr,'m'),uv2=gl.getUniformLocation(pr,'v'),
      uo=[gl.getUniformLocation(pr,'o0'),gl.getUniformLocation(pr,'o1'),gl.getUniformLocation(pr,'o2')],upu=gl.getUniformLocation(pr,'pu');
  var vit=0,px=0,py=0,mx=0,my=0,tx=0,ty=0,dpr=Math.min(devicePixelRatio||1,1.25),pouls=0,poulsC=0;
  var ondes=[{x:0,y:0,t0:-99,f:0},{x:0,y:0,t0:-99,f:0},{x:0,y:0,t0:-99,f:0}], io=0;
  function size(){c.width=innerWidth*dpr*.6;c.height=innerHeight*dpr*.6;c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';gl.viewport(0,0,c.width,c.height);}
  size();addEventListener('resize',size);
  /* point de l'ecran -> coordonnees du shader ; le canvas est agrandi par etape (peau.css), on en tient compte */
  function versUV(x,y){ var R=c.getBoundingClientRect(); var cx=(x-R.left)/R.width*innerWidth, cy=(y-R.top)/R.height*innerHeight;
    return [(cx/innerWidth-.5)*innerWidth/innerHeight, -(cy/innerHeight-.5)]; }
  var suivre=function(x,y){var nx=(x/innerWidth-.5)*innerWidth/innerHeight,ny=-(y/innerHeight-.5);vit=Math.min(1,vit+Math.hypot(nx-px,ny-py)*2.2);px=nx;py=ny;tx=nx;ty=ny;};
  addEventListener('pointermove',function(e){suivre(e.clientX,e.clientY);},{passive:true});
  addEventListener('pointerdown',function(e){suivre(e.clientX,e.clientY);vit=Math.min(1,vit+.2);},{passive:true});
  addEventListener('touchmove',function(e){var tp=e.touches&&e.touches[0];if(tp)suivre(tp.clientX,tp.clientY);},{passive:true});
  var t0=performance.now(), maintenant=0;
  (function frame(now){
    maintenant=(now-t0)/1000;
    mx+=(tx-mx)*.018;my+=(ty-my)*.018;vit*=.975;
    poulsC+=(pouls-poulsC)*.12; pouls*=.955;
    gl.uniform2f(ur,c.width,c.height);gl.uniform1f(ut,reduce?0:maintenant);gl.uniform2f(um,mx,my);gl.uniform1f(uv2,vit);gl.uniform1f(upu,poulsC);
    for(var i=0;i<3;i++){var o=ondes[i],age=maintenant-o.t0;gl.uniform4f(uo[i],o.x,o.y,age,age<4.5?o.f:0);}
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    if(!reduce)requestAnimationFrame(frame);
  })(t0);
  if(reduce) return api;
  api.onde=function(x,y,f){ var u=versUV(x,y), o=ondes[io]; io=(io+1)%3; o.x=u[0]; o.y=u[1]; o.t0=maintenant; o.f=f==null?1:f; };
  api.pouls=function(f){ pouls=Math.min(1.4,pouls+(f==null?1:f)); };
  return api;
})();
