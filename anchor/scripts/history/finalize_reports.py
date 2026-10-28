import json,pathlib,sys,hashlib,re,datetime
from audit_native import parse,project
root=pathlib.Path(__file__).parent
read=lambda n:json.loads((root/n).read_text(encoding='utf8'))
R=lambda n:read(n)['result']
hashfile=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def norm(x):
    if isinstance(x,float):return round(x,8)
    if isinstance(x,dict):return {k:norm(v) for k,v in x.items()}
    if isinstance(x,list):return [norm(v) for v in x]
    return x
page=('SCH_PAGE','a2ae37ea91715ac4');docs=project(root/'UWB_Anchor_DRAFT.epro2')
r=R('reopen-check.json');a=parse(r['beforeSource'])[page];b=parse(r['afterSource'])[page]
identity={'project_uuid':'2ceff1de2cdb41d6a9101840f44c2b87','board_uuid':'972ce89fb0e827ad','schematic_uuid':'fff8ecc88c1d6f03','page_uuid':page[1]}
assert docs[('BOARD',identity['board_uuid'])][('META','META')]['title']=='Anchor'
assert docs[('SCH',identity['schematic_uuid'])][('META','META')]['board']==identity['board_uuid']
pages=[u for (t,u),v in docs.items() if t=='SCH_PAGE' and v.get(('META','META'),{}).get('schematic')==identity['schematic_uuid']]
assert pages==[page[1]]
assert norm(a)==norm(b),'Reopened native page changed beyond floating point serialization'
def semantic(records):
    out={};orphans=[]
    for k,v in records.items():
        if k[0] in ['META','ELE_PLACEHOLDER']:continue
        if k[0]=='LINE' and v.get('lineGroup') and ('WIRE',v['lineGroup']) not in records and k not in b:
            orphans.append(k[1]);continue
        out[k]=norm({q:x for q,x in v.items() if q!='zIndex' and not(q=='strikeout' and x is False)})
    return out,orphans
export_semantic,orphans=semantic(docs[page]);runtime_semantic,_=semantic(b)
assert export_semantic==runtime_semantic,'Export does not match reopened source data/geometry'
nc=[v for (t,i),v in docs[page].items() if t=='ATTR' and v.get('key')=='NO_CONNECT' and v.get('value')=='yes']
assert len(nc)==31
parts=R('reopen-check.json')['components'];attrs={}
for (t,i),v in docs[page].items():
    if t=='ATTR':attrs.setdefault(v.get('parentId'),{})[v.get('key')]=v.get('value')
for c in parts:
    if c.get('designator') in ['Y1','C31','C32']:
        assert attrs[c['primitiveId']]['Value']==('38.4MHz' if c['designator']=='Y1' else '3.3pF')
rule=R('guarded-drc-final.json');assert rule['scopeVerified'] and rule['details']==[{'type':'warn','count':3}]
tree=(root/'drc-ui-tree-final.txt').read_text(encoding='utf8')
assert '警告：3，信息：0' in tree
supplier=re.findall(r'文本 ([A-Z]+\d+)\(\$1I\d+\)',tree)
report={'schema':'anchor-final-checks-v1','identity':identity,'single_page':True,'reopened_same_page':r['beforeDoc']['uuid']==r['afterDoc']['uuid']==page[1],
 'reopen_all_records_semantically_equal':True,'rounding_digits':8,'floating_serialization_differences':sum(a.get(k)!=b.get(k) for k in a.keys()|b.keys()),
 'export_matches_reopened_source_data_and_geometry':True,'export_normalization':{'ignored':'META/ELE_PLACEHOLDER, serializer zIndex and omitted strikeout=false; 8-decimal numeric rounding','unreferenced_deleted_wire_child_lines':orphans,'note':'Native archive is unmodified; deleted document and primitive tombstones retained.'},'nc_marks_in_native_package':len(nc),'connections':read('connection-comparison.json'),'library_checks_pass':read('native-audit.json')['all_library_checks_pass'],
 'drc':{'fatal':0,'error':0,'warning':3,'info':0,'boolean':rule['boolean'],'source':'Native EDA DRC panel accessibility text, 2026-10-28 18:28:55–18:28:56; later guarded API summary also 3 warnings','warnings':['ANT1_FEED_TBD single pin network','ANT2_FEED_TBD single pin network','component attributes differ from supplier database'],'supplier_affected_references':supplier},
 'artifacts':{n:hashfile(root/n) for n in ['UWB_Anchor_DRAFT.epro2','Anchor_DRAFT_A3.png','Anchor_DRAFT_A3.pdf','Anchor_actual.csv','actual-netlist-final.json','drc-ui-tree-final.txt']}}
(root/'final-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
(root/'drc-report-final.md').write_text('''# Anchor 原理图规则检查记录

检查对象为原 UWB / Anchor / Schematic2 / Anchor 图页，UUID 见 final-checks.json。当前客户端 3.2.149.88089769。使用严格原理图检查；没有运行 PCB DRC。

最终原生面板 2026-10-28 18:28:55–18:28:56：致命错误 0、错误 0、警告 3、信息 0。开始/完成两个过程日志不计入信息违规数量。后续仅调整两处文字位置，guarded-drc-final.json 再次回读 3 条警告；门禁布尔值仍为 false。

| 警告 | 处理与影响 |
|---|---|
| ANT1_FEED_TBD 单网络，仅连接一个元件引脚 | 用户允许天线实体待核，保留真实未完成状态。 |
| ANT2_FEED_TBD 单网络，仅连接一个元件引脚 | 同上；不放置无依据的天线来消除警告。 |
| 元件属性与供应商编号不匹配 | 一组提示涉及 '''+', '.join(supplier)+'''。含自定义用途名称、值显示与通用器件；仍需采购冻结时复核。不能由库引脚相同推导全部参数已获供应商认证。未执行器件标准化，未改引脚或符号映射。 |

原始证据是 evidence/drc-ui-tree-final.txt 的原生可访问文本与 guarded-drc-final.json 的 API 返回。本记录是整理稿，不能冒充客户端原生 TXT 导出。用户替换的 docs TXT 时间为 18:05:14，仍包含已修复的 XTI/GND 与 XTO 重名，作为历史记录保留；它不是最终计数依据。

导出按钮的自动点击被窗口/坐标校验阻止，未获得新一份客户端 TXT；最终条目通过只读原生窗口读取，不依赖推测。晶体、天线和电源验证限制另见完成情况与电路复核。
''',encoding='utf8')
visual={'schema':'anchor-visual-audit-v1','status':'PASS_FOR_DRAFT_PRESENTATION','page_count':1,'format':'A3 landscape','pixels':[4965,3510],
 'method':'24 real native EDA canvas captures, center-cropped and stitched. No schematic redrawing. Raster PDF rendered again with PDFium and inspected.',
 'inspected':['final full canvas','power','MCU and unused-pin NC marks','USB connector/CC/ESD','DW3220 pins, supplies, oscillator and RF','UART/BOOT/RESET/test points','A3 PNG page boundary and tile seams','rendered one-page PDF'],
 'corrections':['Moved oscillator to free bottom-center area and separated ground branches','Moved MCU names and switch labels clear of wires','Moved UWB_IRQ label below USB port and decoupling heading above supply leads','Removed overlapping duplicate wire text','Recaptured tile 1_0 after detecting native viewport scale change; recaptured two label tiles after final text edits'],
 'electrical_validation':'204 actual exported pins compared separately; NC and source libraries checked independently',
 'limitations':['PDF is a raster review copy, not native vector PDF. Native epro2 remains editable.','DRAFT antenna entities and qualified crystal are intentionally absent/DNP. Visual PASS does not approve the circuit for fabrication.'],
 'files':{n:hashfile(root/n) for n in ['Anchor_DRAFT_A3.png','Anchor_DRAFT_A3.pdf','Anchor_preview.png','PDF-render-check.png','final-full.png','power-dense.png','mcu-dense.png','usb-dense.png','dw_rf-dense.png','debug-dense.png']}}
(root/'visual-audit.json').write_text(json.dumps(visual,ensure_ascii=False,indent=2),encoding='utf8')
p=read('program-state.json');p['updated_at']=datetime.datetime.now(datetime.timezone.utc).isoformat()
p['stages']['product_definition']={'status':'PASS','evidence':['product-brief.yaml','User scope and explicit DRAFT decisions']}
p['stages']['schematic_visual']={'status':'PASS','evidence':['output/visual-audit.json','output/Anchor_DRAFT_A3.pdf']}
p['stages']['circuit']={'status':'BLOCKED','evidence':['output/final-checks.json','circuit-review.md'],'reason':'Antenna, crystal qualification and power margins remain unresolved; not a fabrication release'}
p['risks']=['Antenna geometry/matching not designed','Crystal ESR conflict; Y1 DNP','USB/AMS1117 current, thermal and transient validation pending','BOM sourcing not frozen']
p['artifacts']={'native_project':'eda/UWB_Anchor_DRAFT.epro2','schematic':'output/Anchor_DRAFT_A3.pdf','checks':'output/final-checks.json'}
(root/'program-state.json').write_text(json.dumps(p,ensure_ascii=False,indent=2),encoding='utf8')
print('Final identity, reopen/export, native NC, DRC and visual records prepared.')
