from PIL import Image
import json
im=Image.open('interfel-1.png')  # rendu de calendrier-de-saison-fruits-legumes.pdf (Interfel) par pdftoppm -r 110.convert('RGB'); S=1733/1334
fr=[("abricot",379),("ananas",422),("cerise",465),("chataigne",508),("citron",551),("clementine",594),("coing",637),("figue",681),("fraise",724),("fruit_passion",767),("grenade",810),("kaki",853),("kiwi",896),("litchi",939),("mangue",983),("melon",1026),("noisette",1068),("noix",1111),("orange",1154),("peche_nectarine",1197),("petits_fruits_rouges",1240),("poire",1284),("pomelo",1327),("pomme",1369),("prune",1412),("raisin",1455),("rhubarbe",1498)]
lg=[("ail",379),("artichaut",422),("asperge",465),("aubergine",508),("avocat",551),("betterave",594),("blette",637),("brocoli",680),("carotte",723),("celeri_branche",766),("celeri_rave",809),("champignon_paris",852),("chou_bruxelles",895),("chou_fleur",938),("chou_pomme",981),("concombre",1024),("courges",1067),("courgette",1110),("echalote",1153),("endive",1196),("epinard",1239),("fenouil",1282),("haricot_ecosser",1325),("haricot_vert",1368),("herbes_aromatiques",1411),("legumes_anciens",1454),("mache",1497),("navet",1540),("oignon",1583),("patate_douce",1626),("petit_pois",1669),("poireau",1712),("poivron",1755),("radis",1798),("salade",1841),("tomate",1884)]
def cls(p,orange):
    r,g,b=p
    if orange:
        if g<150 and r>200: return 'coeur'
        if g<200 and r>230: return 'saison'
        if b<215 and r>240: return 'dispo'
        return '-'
    else:
        if g<130: return 'coeur'
        if g<185: return 'saison'
        if g<228 and b<215: return 'dispo'
        return '-'
out={}
for rows,x0,orange in [(fr,327,True),(lg,948,False)]:
    for n,y in rows:
        res=[]
        for m in range(12):
            x=x0+m*27.4-7; yy=y-11
            p=im.getpixel((int(x*S),int(yy*S)))
            res.append(cls(p,orange))
        out[n]={'coeur':[i+1 for i,c in enumerate(res) if c=='coeur'],'saison':[i+1 for i,c in enumerate(res) if c=='saison'],'dispo':[i+1 for i,c in enumerate(res) if c=='dispo']}
        print(f"{n:22s}"," ".join({'coeur':'#','saison':'s','dispo':'.','-':'_'}[c] for c in res))
json.dump(out,open('interfel_saisons.json','w'),ensure_ascii=False,indent=0)
