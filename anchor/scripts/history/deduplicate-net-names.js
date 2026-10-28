// COMMON
const source=await eda.sys_FileManager.getDocumentSource();
const wireIds=new Set((await eda.sch_PrimitiveWire.getAll()).map(w=>w.getState_PrimitiveId()));
const seen=new Map(),removed=[],kept=[];
const lines=source.split('\n').filter(line=>{
 if(!line.includes('||'))return true;let h,b;try{const p=line.slice(0,-1).split('||');h=JSON.parse(p[0]);b=JSON.parse(p[1]);}catch{return true;}
 if(h.type==='DOCHEAD'&&(b.docType!=='SCH_PAGE'||b.uuid!==PAGE))throw Error('Source outside target page');
 if(h.type==='ATTR'&&b.key==='NET'&&wireIds.has(b.parentId)){
  if(seen.has(b.parentId)){if(seen.get(b.parentId)!==b.value)throw Error('Conflicting net names require electrical review');removed.push({id:h.id,parentId:b.parentId,value:b.value});return false;}
  seen.set(b.parentId,b.value);kept.push({id:h.id,parentId:b.parentId,value:b.value});
 }return true;
});
const beforePins=Object.fromEntries(await Promise.all(comps.filter(c=>c.getState_ComponentType()==='part').map(async c=>[c.getState_Designator(),await c.getAllPins()])));
const written=await eda.sys_FileManager.setDocumentSource(lines.join('\n'));if(!written)throw Error('Source edit rejected');
const saved=await eda.sch_Document.save();
const afterComps=await eda.sch_PrimitiveComponent.getAll();
const afterPins=Object.fromEntries(await Promise.all(afterComps.filter(c=>c.getState_ComponentType()==='part').map(async c=>[c.getState_Designator(),await c.getAllPins()])));
return {removed,kept,beforePins,afterPins,written,saved,source:await eda.sys_FileManager.getDocumentSource()};
