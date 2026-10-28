import json,pathlib,zipfile,base64,io,hashlib,csv,collections
from audit_native import parse,project
root=pathlib.Path(__file__).parent
load=lambda n:json.loads((root/n).read_text(encoding='utf-8-sig'))['result']
docs=project(root/'UWB_Anchor_DRAFT.epro2');base=project(root/'UWB_before_Anchor.epro2')
ev=load('used-library-evidence.json');instances=load('reopen-check.json')['components'];parts=[c for c in instances if c['componentType']=='part']
origins=json.loads((root/'device-origins.json').read_text())
libDir=root/'libraries';libDir.mkdir(exist_ok=True)
def filedocs(info):
    data=base64.b64decode(info['data']);z=zipfile.ZipFile(io.BytesIO(data));s=z.read(next(n for n in z.namelist() if n.endswith('.elibu'))).decode('utf8');return parse(s),data
def pinDefs(d):
    attrs={}
    for (typ,id),b in d.items():
        if typ=='ATTR' and b.get('parentId'):attrs.setdefault(b['parentId'],{})[b['key']]=b['value']
    pins=[]
    for (typ,id),b in d.items():
        if typ!='PIN':continue
        a=attrs.get(id,{})
        pins.append({'number':str(a.get('Pin Number',a.get('NUMBER',''))),'name':a.get('Pin Name',a.get('NAME','')),'type':a.get('Pin Type',b.get('electric','')),'part':b.get('partId'),'geometry':{k:round(v,8) if isinstance(v,float) else v for k,v in b.items() if k in ['x','y','rotation','length','display','pinShape']}})
    return sorted(pins,key=lambda p:(p['part'] or '',p['number']))
def pads(d):
    return sorted([{k:v for k,v in b.items() if k not in ['locked','zIndex','groupId','netName']} for (typ,id),b in d.items() if typ=='PAD'],key=lambda b:(str(b.get('num')),b.get('centerX',0),b.get('centerY',0)))
hashobj=lambda x:hashlib.sha256(json.dumps(x,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
checks=[];rows=[];libs={};bom=[]
actual=json.loads(load('actual-netlist-final.json')['text']);actualBy={c['props']['Designator']:c for c in actual['components'].values()}
for c in parts:
    ref=c['designator'];src=origins[c['component']['uuid']].split('|')[0];d=ev['devices'][src];a=d['association'];s=a['symbolUuid'];f=a['footprintUuid'];localmeta=docs[('DEVICE',c['component']['uuid'])][('META','META')];localAttrs=localmeta['attributes'];ls=localAttrs['Symbol'].split('|')[0];lf=localAttrs['Footprint'].split('|')[0]
    os,sd=filedocs(ev['files'][s]['file']);of,fd=filedocs(ev['files'][f]['file']);ps=pinDefs(os[('SYMBOL',s)]);qs=pinDefs(docs[('SYMBOL',ls)]);pf=pads(of[('FOOTPRINT',f)]);qf=pads(docs[('FOOTPRINT',lf)])
    pnums=collections.Counter(str(p['num']) for p in pf);snums={p['number'] for p in ps};mapped=set(pnums)==snums
    check={'reference':ref,'source_device':src,'local_device':c['component']['uuid'],'source_symbol':s,'local_symbol':ls,'source_footprint':f,'local_footprint':lf,'symbol_pins':len(ps),'physical_pads':len(pf),'symbol_pin_definition_same':ps==qs,'footprint_pads_same':pf==qf,'symbol_to_pad_numbers_complete':mapped,'source_pin_hash':hashobj(ps),'embedded_pin_hash':hashobj(qs),'source_pad_hash':hashobj(pf),'embedded_pad_hash':hashobj(qf)};checks.append(check)
    for pin in ps:rows.append({'reference':ref,'manufacturer':d['property'].get('manufacturer',''),'mpn':d['property'].get('manufacturerId',''),'datasheet_revision':'DW3000 v1.3' if ref=='U3' else 'ESP32-S3 module v1.8' if ref=='U2' else 'AMS 2012-09-14' if ref=='U1' else 'ST DS4260 Rev7' if ref=='U4' else 'supplier library snapshot / draft','datasheet_pin':pin['number'],'symbol_pin':pin['number'],'pin_name':pin['name'],'footprint_pad':pin['number'],'pad_multiplicity':pnums[pin['number']],'verification':'PASS library identity; electrical function per pin_connections.csv' if mapped and ps==qs and pf==qf else 'BLOCKED','source':src+'|'+d['libraryUuid']})
    for uuid,info in [(s,sd),(f,fd)]:
        if uuid not in libs:(libDir/(uuid+'.elibz2')).write_bytes(info);libs[uuid]={'uuid':uuid,'path':'eda/libraries/'+uuid+'.elibz2','sha256':hashlib.sha256(info).hexdigest()}
    props=actualBy[ref]['props'];bom.append({'reference':ref,'manufacturer':props.get('Manufacturer',''),'mpn':props.get('Manufacturer Part',''),'supplier':props.get('Supplier',''),'supplier_id':props.get('Supplier Part',''),'value':props.get('Value',''),'name':props.get('Name',''),'add_into_bom':props.get('Add into BOM',''),'device_uuid':c['component']['uuid'],'source_device_uuid':src,'footprint_uuid':lf,'status':'USER_REVIEW' if ref in ['Y1','R1','TP1','TP2','TP3'] else 'DRAFT - sourcing not frozen'})
def csvwrite(name,items):
    with (root/name).open('w',encoding='utf-8-sig',newline='') as f:w=csv.DictWriter(f,fieldnames=items[0].keys());w.writeheader();w.writerows(items)
csvwrite('library_pin_map.csv',rows);csvwrite('bom_draft.csv',bom)
protected=[]
for k in [('SCH_PAGE','9964ccdae00bdeb6'),('PCB','a456c9db5ecb73a6'),('PCB','4073973915e05746')]:
    b,a=base.get(k),docs.get(k);protected.append({'document_type':k[0],'uuid':k[1],'same_records':b==a,'before_hash':hashobj(sorted([(str(k),v) for k,v in (b or {}).items()])),'after_hash':hashobj(sorted([(str(k),v) for k,v in (a or {}).items()]))})
pins=load('reopen-check.json')['pins'];spec=json.loads((root/'expected-connections.json').read_text());nc=[]
for ref,pmap in spec.items():
    bynum={p['pinNumber']:p for p in pins[ref]}
    for pn,net in pmap.items():
        if not net:nc.append({'ref':ref,'pin':pn,'noConnected':bynum[pn]['noConnected']})
cleanup=load('net-name-cleanup.json')
def pinStable(p):return {r:sorted([{k:p[k] for k in ['pinNumber','pinName','pinType','x','y','rotation','pinLength','pinShape','noConnected']} for p in ps],key=lambda p:p['pinNumber']) for r,ps in p.items()}
report={'schema':'anchor-native-audit-v1','library_checks':checks,'all_library_checks_pass':all(c['symbol_pin_definition_same'] and c['footprint_pads_same'] and c['symbol_to_pad_numbers_complete'] for c in checks),'nc':nc,'all_nc_marks_present':all(p['noConnected'] for p in nc),'net_attribute_cleanup_pin_invariance':pinStable(cleanup['beforePins'])==pinStable(cleanup['afterPins']),'protected_documents':protected,'libraries':list(libs.values()),'limitations':['Libraries checked by canonical pin definitions and footprint pads, not a claim of byte-identical exported ZIP headers.','Multipart and hidden-power fixtures are not used in this design; no general-purpose adapter certification is claimed.','Current live system libraries were snapshotted; five key libraries also have earlier session snapshots.','BOM sourcing, antenna implementation, crystal qualification and power measurements remain open.']}
(root/'native-audit.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf8')
print(json.dumps({'library_checks_pass':report['all_library_checks_pass'],'components':len(checks),'pin_rows':len(rows),'libraries':len(libs),'NC':len(nc),'NC_pass':report['all_nc_marks_present'],'cleanup_pin_invariant':report['net_attribute_cleanup_pin_invariance'],'protected':protected,'failed_library_checks':[c['reference'] for c in checks if not(c['symbol_pin_definition_same'] and c['footprint_pads_same'] and c['symbol_to_pad_numbers_complete'])]},ensure_ascii=False))
