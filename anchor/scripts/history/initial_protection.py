import pathlib,json
from audit_evidence import filedocs,pinDefs,pads
root=pathlib.Path(__file__).parent
ev=json.loads((root/'used-library-evidence.json').read_text(encoding='utf8'))['result']
snap=json.loads((root/'library-snapshots.json').read_text(encoding='utf8'))['result'];out=[]
for key,v in snap.items():
    for typ,field in [('SYMBOL','symbolFile'),('FOOTPRINT','footprintFile')]:
        sid=v['device']['association']['symbolUuid' if typ=='SYMBOL' else 'footprintUuid'];a,_=filedocs(v[field]);b,_=filedocs(ev['files'][sid]['file']);fn=pinDefs if typ=='SYMBOL' else pads;out.append({'part':key,'kind':typ,'unchanged':fn(a[(typ,sid)])==fn(b[(typ,sid)])})
(root/'initial-library-protection.json').write_text(json.dumps(out,indent=2),encoding='utf8')
assert all(r['unchanged'] for r in out)
print('Initial -> final source library definition checks:',len(out),'PASS')
