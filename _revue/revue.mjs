// Revue UI « Votre assiette » : node revue.mjs <prefixe>   (MOB=1 pour 390x844)
// Copie adaptee de runcam.mjs : port 9361, profil a part, captures dans le scratchpad.
import { spawn } from 'node:child_process'; import fs from 'node:fs';
const CAM = '/private/tmp/claude-501/-Users-charles-Documents/a96d476b-03a5-4773-b410-0a21e760836c/scratchpad/cdp/droit.y4m';
const OUT = process.env.OUT || '/private/tmp/claude-501/-Users-charles-Documents/a96d476b-03a5-4773-b410-0a21e760836c/scratchpad/revue/';
fs.mkdirSync(OUT, { recursive:true });
const pref = process.argv[2] || (process.env.MOB ? 'm' : 'd');
const W = process.env.MOB ? 390 : 1440, Hh = process.env.MOB ? 844 : 900;
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--use-file-for-fake-video-capture=' + CAM,'--autoplay-policy=no-user-gesture-required','--remote-debugging-port=9361','--user-data-dir=' + OUT + 'prof','--window-size=1440,900','--mute-audio','about:blank'], { stdio:'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ver; for(let i=0;i<80;i++){ try{ ver = await (await fetch('http://127.0.0.1:9361/json/list')).json(); if(ver && ver.find(t => t.type === 'page')) break; }catch(e){} await sleep(250); }
const ws = new WebSocket(ver.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const att = {};
ws.onmessage = m => { const d = JSON.parse(m.data); if(d.method === 'Runtime.exceptionThrown') console.log('EXC', (d.params.exceptionDetails.exception && d.params.exceptionDetails.exception.description || '').slice(0, 300)); if(d.id && att[d.id]){ att[d.id](d); delete att[d.id]; } };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; att[i] = r; ws.send(JSON.stringify({ id:i, method, params })); });
const ev = async (expr) => { const r = await cmd('Runtime.evaluate', { expression:expr, awaitPromise:true, returnByValue:true }); return r.result && r.result.result ? r.result.result.value : r; };
let n = 0; const shot = async (nom) => { const r = await cmd('Page.captureScreenshot', { format:'jpeg', quality:80 }); const f = OUT + pref + '_' + String(n++).padStart(2,'0') + '_' + nom + '.jpg'; fs.writeFileSync(f, Buffer.from(r.result.data, 'base64')); console.log('SHOT', f); };
const attendre = async (expr, ms = 20000) => { const t = Date.now(); while(Date.now() - t < ms){ if(await ev('!!(' + expr + ')')) return true; await sleep(300); } console.log('TIMEOUT', expr); return false; };
try {
await cmd('Page.enable'); await cmd('Runtime.enable');
await cmd('Emulation.setDeviceMetricsOverride', process.env.MOB ? { width:W, height:Hh, deviceScaleFactor:2, mobile:true } : { width:W, height:Hh, deviceScaleFactor:1, mobile:false });
if(process.env.MOB) await cmd('Emulation.setTouchEmulationEnabled', { enabled:true, maxTouchPoints:5 });
await cmd('Page.navigate', { url:'http://localhost:8765/scan/?v=200' }); await sleep(4500);
await ev("document.getElementById('btn-scan').click()");
await attendre("document.getElementById('vy-avant')", 15000); await sleep(2500);
console.log(await ev("(()=>{ try { document.getElementById('vy-avant').contentWindow.eval(\"parent.postMessage({vyvreAvant:'lancer',prefs:{}},'*')\"); return 'post ok'; } catch(e){ return 'post err ' + e.message; } })()"));
await attendre("document.querySelector('#sg-intro .si-skip')", 60000); await sleep(1500);
await ev("document.querySelector('#sg-intro .si-skip').click()");
await attendre("window.__vyScores || (window.vyvreLastScanResult && window.vyvreLastScanResult.scores)", 60000); await sleep(3000);
// la carte d'entree dans les resultats
if(await ev("!!document.getElementById('vy-as-entree')")){ await ev("document.querySelector('#vy-as-entree h3').scrollIntoView({block:'center'})"); await sleep(1200); await shot('entree'); }
console.log('ENTREE', JSON.stringify(await ev("(()=>{ const e=document.getElementById('vy-as-entree'); if(!e) return null; const cs=getComputedStyle(e); const b=e.querySelector('button').getBoundingClientRect(); return { w:e.offsetWidth, h:e.offsetHeight, btnH:b.height, sibs:[...e.parentNode.children].map(c=>c.id||c.className).slice(-6) }; })()")));
if(process.env.PROBE){ console.log('PROBE', JSON.stringify(await ev(process.env.PROBE))); throw new Error('fin sonde'); }
await ev("window.vyAliment.ouvrir()"); await attendre("document.getElementById('vy-as-rien')", 15000); await sleep(1200);
const pages = async (nom) => { const hs = await ev("(()=>{ const o=document.getElementById('vy-as'); return [o.scrollHeight,o.clientHeight]; })()"); console.log(nom, 'scrollHeight', hs);
  for(let y = 0, k = 0; y < hs[0] && k < 40; y += Math.round(hs[1]*0.85), k++){ await ev("document.getElementById('vy-as').scrollTop=" + y); await sleep(450); await shot(nom + k); } await ev("document.getElementById('vy-as').scrollTop=0"); };
await pages('question');
// etat : allergie cochee, pour voir les puces dependantes
await ev("document.querySelector('#vy-as-cases .puce[data-c=allergie]').click()"); await sleep(500); await pages('allergie');
// mesures de la question
console.log('MESQ', JSON.stringify(await ev(`(()=>{ const o=document.getElementById('vy-as'); const r=[]; o.querySelectorAll('button,a,.puce,summary,input').forEach(e=>{ const b=e.getBoundingClientRect(); if(b.width&&b.height<44) r.push([(e.id||e.className||e.tagName)+':'+(e.textContent||'').trim().slice(0,28), Math.round(b.width)+'x'+Math.round(b.height)]); }); return r.slice(0,60); })()`)));
await ev("document.querySelector('#vy-as-cases .puce[data-c=allergie]').click()"); await sleep(300);
await ev("document.getElementById('vy-as-rien').click()"); await sleep(600); await shot('rien');
await ev("document.getElementById('vy-as-accept').click()");
for(const t of [600, 1500, 2600, 4200, 6500, 9000, 11500]){ await sleep(t - (shot.last || 0)); shot.last = t; await shot('roue' + t); }
await attendre("document.querySelector('#vy-as .ruban')", 20000); await sleep(1500);
await pages('assiette');
console.log('MESA', JSON.stringify(await ev(`(()=>{ const o=document.getElementById('vy-as'); const r=[]; o.querySelectorAll('button,a,.puce,summary,input').forEach(e=>{ const b=e.getBoundingClientRect(); if(b.width&&b.height<44) r.push([(e.id||e.className||e.tagName)+':'+(e.textContent||'').trim().slice(0,28), Math.round(b.width)+'x'+Math.round(b.height)]); }); const fs={}; o.querySelectorAll('*').forEach(e=>{ if(!e.childNodes.length||![...e.childNodes].some(c=>c.nodeType===3&&c.textContent.trim())) return; const s=getComputedStyle(e); const k=s.fontSize+' '+s.fontWeight+' '+s.fontFamily.split(',')[0]+' '+s.fontStyle+' '+s.color+' op'+s.opacity; fs[k]=(fs[k]||0)+1; }); return { petits:r.slice(0,80), nPetits:r.length, polices:fs, h2:[...o.querySelectorAll('h1,h2')].map(h=>h.textContent) }; })()`)));
if(process.env.MOB){ // premium combo, geo etat
  console.log('COMBO', await ev("(()=>{ const z=document.getElementById('vy-as-combo'); return z? z.innerText.slice(0,600):null; })()"));
}
} catch(e){ console.log('ERR', e && e.message); }
ws.close(); chrome.kill(); process.exit(0);
