import re,subprocess,json
ids="000641360 000641427 000641369 000641425 010596274 010536481 000641365 000641429 000641423 000641426 000641428 000641408 000641355 001791255 001791257 000641354 000641435 000641434 000641367 000442454 000641417 000442434 000442436 000442432 000641359 000641430 000641418 000442441 001791256 000442423 000641422 000442453 000641432 001791254 000849397 000442448 000442450 000641405 000641416 000641413".split()
out={}
for i in ids:
    x=subprocess.run(['curl','-s','-m','30',f'https://bdm.insee.fr/series/sdmx/data/SERIES_BDM/{i}?lastNObservations=12'],capture_output=True,text=True).stdout
    t=re.search(r'TITLE_FR="([^"]*)"',x); t=t.group(1) if t else '?'
    obs=re.findall(r'TIME_PERIOD="([^"]+)" OBS_VALUE="([^"]+)"',x)
    if not obs: obs=[(a,b) for b,a in re.findall(r'OBS_VALUE="([^"]+)"[^>]*TIME_PERIOD="([^"]+)"',x)]
    vals=[float(v) for p,v in obs if v not in ('NaN','')]
    per=[p for p,v in obs]
    avg=round(sum(vals)/len(vals),2) if vals else None
    out[i]={'titre':t.replace('Prix moyens mensuels de vente au détail en métropole - ',''),'periodes':[min(per),max(per)] if per else None,'n':len(vals),'moyenne_12m':avg,'dernier':vals[-1] if vals else None}
    print(i,out[i])
json.dump(out,open('insee_prix.json','w'),ensure_ascii=False,indent=1)
