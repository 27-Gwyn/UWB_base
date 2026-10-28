"""Verify the saved delivery using actual native exports, not expected-only data."""
import pathlib,json,csv,hashlib,zipfile,sys
root=pathlib.Path(sys.argv[1]).resolve() if len(sys.argv)>1 else pathlib.Path(__file__).resolve().parent.parent
out=root/'output';issues=[]
def parse(data):
    docs={};cur=None
    for l in data.splitlines():
        if '||' not in l:continue
        try:
            htext,body=l.split('||',1);h=json.loads(htext)
            if body.endswith('|'):body=body[:-1]
            b=json.loads(body) if body else None
        except:continue
        if h['type']=='DOCHEAD':cur=(b['docType'],b['uuid']);docs.setdefault(cur,{})
        elif cur:
            key=(h['type'],str(h.get('id',h['type'])))
            if b is None:docs[cur].pop(key,None)
            else:docs[cur][key]=b
    return {k:v for k,v in docs.items() if not v.get(('DELETE_DOC','DELETE_DOC'),{}).get('isDelete')}
def native(p):
    with zipfile.ZipFile(p) as z:
        assert z.testzip() is None
        return parse(z.read(next(n for n in z.namelist() if n.endswith('.epru'))).decode('utf8'))
raw=json.loads((out/'Anchor_actual.enet').read_text(encoding='utf8'))
actual={c['props']['Designator']:{str(p.get('number',k)):p.get('net','') for k,p in c['pinInfoMap'].items()} for c in raw['components'].values()}
rows=list(csv.DictReader((out/'pin_connections.csv').open(encoding='utf-8-sig',newline='')))
for r in rows:
    got=actual.get(r['reference'],{}).get(r['pin'],'<MISSING>')
    if got!=r['net']:issues.append(f"net mismatch {r['reference']}.{r['pin']}: {got!r}")
if sum(len(x) for x in actual.values())!=len(rows):issues.append('actual pin coverage differs')
audit=json.loads((out/'native-audit.json').read_text(encoding='utf8'))
if not audit['all_library_checks_pass']:issues.append('library pin/pad audit failed')
if not audit['all_nc_marks_present']:issues.append('NC readback failed')
if not audit['net_attribute_cleanup_pin_invariance']:issues.append('pin state changed during net cleanup')
before=native(root/'eda/UWB_before_Anchor.epro2');after=native(root/'eda/UWB_Anchor_DRAFT.epro2')
anchor=after[('SCH_PAGE','a2ae37ea91715ac4')]
pages=[uuid for (typ,uuid),d in after.items() if typ=='SCH_PAGE' and d.get(('META','META'),{}).get('schematic')=='fff8ecc88c1d6f03']
if pages!=['a2ae37ea91715ac4']:issues.append('Anchor does not contain exactly the original single active page')
if after[('SCH','fff8ecc88c1d6f03')][('META','META')].get('board')!='972ce89fb0e827ad':issues.append('schematic board ownership differs')
native_nc=sum(1 for (typ,id),b in anchor.items() if typ=='ATTR' and b.get('key')=='NO_CONNECT' and b.get('value')=='yes')
if native_nc!=31:issues.append('native package NC count differs')
for typ,uuid in [('SCH_PAGE','9964ccdae00bdeb6'),('PCB','a456c9db5ecb73a6'),('PCB','4073973915e05746')]:
    if before[(typ,uuid)]!=after[(typ,uuid)]:issues.append('protected document changed '+uuid)
for r in audit['libraries']:
    p=root/r['path']
    if hashlib.sha256(p.read_bytes()).hexdigest()!=r['sha256']:issues.append('library archive hash changed '+r['uuid'])
rules=json.loads((out/'guarded-drc-final.json').read_text(encoding='utf8'))['result']
if not rules['scopeVerified']:issues.append('DRC target not verified')
checks={'actual_components':len(actual),'actual_pins':sum(map(len,actual.values())),'nc_marks':len(audit['nc']),'connection_and_library_result':'PASS' if not issues else 'FAIL','issues':issues,'drc_boolean':rules['boolean'],'drc_summary':rules['details'],'render_status':'NOT_VERIFIED'}
png=out/'Anchor_DRAFT_A3.png';pdf=out/'Anchor_DRAFT_A3.pdf'
if png.exists() and pdf.exists():
    from PIL import Image
    from pypdf import PdfReader
    im=Image.open(png);nonblank=im.getbbox() is not None and len(im.convert('RGB').getcolors(256) or [])!=1
    pages=len(PdfReader(pdf).pages)
    checks['render_status']='FILES_VALID' if nonblank and pages==1 else 'FAIL';checks['render_pixels']=im.size;checks['pdf_pages']=pages
(out/'delivery-verification.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(checks,ensure_ascii=False));sys.exit(bool(issues))
