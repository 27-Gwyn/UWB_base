import json,pathlib
p=pathlib.Path(__file__).parent
orig=json.loads((p/'placed.json').read_text(encoding='utf-8'))['result']['placed']
names={r['component']['designator']:r['component']['name'] for r in orig}
s='const names='+json.dumps(names,ensure_ascii=False)+';\n'
s+='''for(const c of await eda.sch_PrimitiveComponent.getAll()){
const ref=c.getState_Designator();if(names[ref]){const a=c.toAsync();a.setState_Name(names[ref]);await a.done();}
}
const source=await eda.sys_FileManager.getDocumentSource();
const rows=source.split('\\n').filter(l=>l.includes('||')).map(l=>l.replace(/\\|$/,'').split('||').map(JSON.parse));
const comps=await eda.sch_PrimitiveComponent.getAll();const refs=Object.fromEntries(comps.map(c=>[c.getState_PrimitiveId(),c.getState_Designator()]));
for(const [h,b]of rows){if(h.type!=='ATTR')continue;
if(b.fontSize>=1000)await eda.sch_PrimitiveAttribute.modify(h.id,{fontSize:b.key==='Designator'?0.14:0.10});
if(b.key==='Name'&&['J1','J2'].includes(refs[b.parentId]))await eda.sch_PrimitiveAttribute.modify(h.id,{valueVisible:false});
}
const flags=[];
for(const c of comps){if(c.getState_ComponentType()!=='netflag')continue;const x=c.getState_X();let y;if(Math.abs(x-350)<1)y=750;if(Math.abs(x-1100)<1)y=740;if(Math.abs(x-900)<1)y=430;if(y===undefined)continue;const oldY=c.getState_Y();const net=c.getState_Net();const a=c.toAsync();a.setState_Y(y);await a.done();const w=await eda.sch_PrimitiveWire.create([x,oldY,x,y],net);if(!w)throw Error('Flag wire failed');flags.push({net,x,y});}
const text=[[180,660,'2P 2.54mm'],[1470,660,'2P 2.54mm'],[440,570,'25V  X5R'],[580,570,'50V  X7R'],[1020,570,'10V  固体钽'],[1170,570,'50V  X7R'],[1340,480,'红色']];
for(const [x,y,s]of text)await eda.sch_PrimitiveText.create(x,y,s,0,null,null,10,false,false,false,2);
return {flags,saved:await eda.sch_Document.save(),source:await eda.sys_FileManager.getDocumentSource(),drc:await eda.sch_Drc.check(true,true,true)};
'''
(p/'fix_presentation.js').write_text(s,encoding='utf-8')
