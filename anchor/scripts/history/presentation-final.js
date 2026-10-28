// COMMON
const source=await eda.sys_FileManager.getDocumentSource();
const byId=new Map(comps.map(c=>[c.getState_PrimitiveId(),c]));
const changes=[];
const lines=source.split('\n').map(line=>{
 if(!line.includes('||'))return line;
 const split=line.replace(/\|$/,'').split('||');const h=JSON.parse(split[0]),b=JSON.parse(split[1]);const old=JSON.stringify(b);
 if(h.type==='DOCHEAD'&&(b.docType!=='SCH_PAGE'||b.uuid!==PAGE))throw Error('Wrong source');
 if(h.type==='ATTR'){
  const c=byId.get(b.parentId),ref=c?.getState_Designator(),type=c?.getState_ComponentType();
  if(c&&['Name','Designator'].includes(b.key)){
   if(ref==='U2'){b.x=775;b.y=b.key==='Name'?-980:-955;b.fontSize=8;b.align='LEFT_MIDDLE';}
   if(ref==='U3'){b.x=750;b.y=b.key==='Name'?-485:-460;b.fontSize=8;b.align='LEFT_MIDDLE';}
   if(ref==='SW3'){b.x=650;b.y=b.key==='Name'?-675:-690;b.fontSize=8;b.align='LEFT_MIDDLE';}
   if(ref==='R10'){b.x=1075;b.y=b.key==='Name'?-850:-870;b.fontSize=8;b.align='LEFT_MIDDLE';}
   if(['R30','R31','R33','R34'].includes(ref)&&b.key==='Name')b.value='10k';
   if(ref==='R32'&&b.key==='Name')b.value='100k';
   if(ref==='R30'&&b.key==='Designator'){b.x=625;b.y=-455;b.align='LEFT_MIDDLE';}
   if(type==='netflag'&&Math.abs(c.getState_X()-570)<.001&&Math.abs(c.getState_Y()-345)<.001&&b.key==='Name')b.valueVisible=false;
   if(type==='netport'&&c.getState_Rotation()===0&&b.key==='Name'){
    const x=c.getState_X(),y=c.getState_Y();
    if(x===1000&&y>=250&&y<=410){b.x=1050;b.y=-y;b.align='LEFT_MIDDLE';b.fontSize=7.5;}
    if(x===1260&&y>=790){b.x=1250;b.y=-y;b.align='RIGHT_MIDDLE';b.fontSize=7.5;}
   }
  }
 }
 if(h.type==='TEXT'&&h.id==='aa13a7cb00ed9e6c')b.y=-515;
 if(h.type==='TEXT'&&h.id==='81ac7c565cb77dad'){b.x=1140;b.y=-610;b.value='RST_N: MCU open-drain LOW / release only.\nNo external pull-up; no push-pull HIGH.';}
 if(JSON.stringify(b)!==old){changes.push({id:h.id,type:h.type,before:JSON.parse(old),after:b});return JSON.stringify(h)+'||'+JSON.stringify(b)+'|';}return line;
});
const beforePins=Object.fromEntries(await Promise.all(comps.filter(c=>c.getState_ComponentType()==='part').map(async c=>[c.getState_Designator(),await c.getAllPins()])));
if(!await eda.sys_FileManager.setDocumentSource(lines.join('\n')))throw Error('Source rejected');
await eda.sch_Document.save();
const afterComps=await eda.sch_PrimitiveComponent.getAll();
const afterPins=Object.fromEntries(await Promise.all(afterComps.filter(c=>c.getState_ComponentType()==='part').map(async c=>[c.getState_Designator(),await c.getAllPins()])));
return {changes,beforePins,afterPins,source:await eda.sys_FileManager.getDocumentSource()};
