import pathlib,json,zipfile,hashlib,collections,csv
root=pathlib.Path(__file__).parent
def parse(data):
    docs={};cur=None
    for line in data.splitlines():
        if '||' not in line:continue
        try:
            head,body=line.split('||',1);h=json.loads(head)
            if body.endswith('|'):body=body[:-1]
            b=json.loads(body) if body else None
        except:continue
        if h['type']=='DOCHEAD':cur=(b['docType'],b['uuid']);docs.setdefault(cur,{})
        elif cur:
            key=(h['type'],str(h.get('id',h['type'])))
            if b is None:docs[cur].pop(key,None)
            else:docs[cur][key]=b
    return {k:v for k,v in docs.items() if not v.get(('DELETE_DOC','DELETE_DOC'),{}).get('isDelete')}
def project(path):
    z=zipfile.ZipFile(path);return parse(z.read(next(n for n in z.namelist() if n.endswith('.epru'))).decode('utf8'))
docs=project(root/'UWB_Anchor_DRAFT.epro2')
sources={uuid:d.get(('META','META'),{}).get('source','') for (dt,uuid),d in docs.items() if dt=='DEVICE'}
(root/'device-origins.json').write_text(json.dumps(sources,indent=2),encoding='utf8')
print('device origins',len(sources))
if __name__=='__main__': print('Native source documents',len(docs))
