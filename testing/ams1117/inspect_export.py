import json,zipfile,pathlib
p=pathlib.Path(__file__).parent
s=(p/'baseline.epru').read_text(encoding='utf-8')
docs=[]
for line in s.splitlines():
    if '||' not in line: continue
    head,body=line.rstrip('|').split('||',1)
    h,b=json.loads(head),json.loads(body)
    if h['type']=='DOCHEAD':
        docs.append({'head':b,'records':[]})
    if docs:docs[-1]['records'].append([h,b])
(p/'baseline-documents.json').write_text(json.dumps(docs,ensure_ascii=False,indent=2),encoding='utf-8')
for d in docs:
    t=d['head'].get('docType');u=d['head'].get('uuid')
    print(t,u,len(d['records']))
    if t=='FOOTPRINT' and u=='3a9b09a87c41bfd0':
        print('U1 pads',*[r for r in d['records'] if r[0]['type']=='PAD'],sep='\n')
    if t=='SYMBOL' and u in ['dff4243c09a73712','ade8d7fe0955d273']:
        print('U1 symbol',d)
