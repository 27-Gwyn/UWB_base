// COMMON
const source=await eda.sys_FileManager.getDocumentSource();
const byId=new Map(comps.map(c=>[c.getState_PrimitiveId(),c]));
const wireIds=new Set((await eda.sch_PrimitiveWire.getAll()).map(w=>w.getState_PrimitiveId()));const changes=[];
const lines=source.split('\n').map(line=>{
 if(!line.includes('||'))return line;
 const [h,b]=line.replace(/\|$/,'').split('||').map(JSON.parse),old=JSON.stringify(b);
 if(h.type==='DOCHEAD'&&b.uuid!==PAGE)throw Error('Wrong page');
 if(h.type==='ATTR'){
  if(b.key==='NET'&&wireIds.has(b.parentId))b.valueVisible=false;
  const c=byId.get(b.parentId),ref=c?.getState_Designator();
  if(c&&['Name','Designator'].includes(b.key)){
   if(ref==='SW1'){b.x=395;b.y=b.key==='Name'?-775:-790;b.fontSize=8;b.align='LEFT_MIDDLE';}
   if(ref==='SW2'){b.x=1085;b.y=b.key==='Name'?-695:-715;b.fontSize=8;b.align='LEFT_MIDDLE';}
   if(ref==='R30'){b.x=635;b.y=b.key==='Name'?-400:-415;b.fontSize=8;b.align='RIGHT_MIDDLE';}
   if(c.getState_ComponentType()==='netport'&&b.key==='Name'){
    if(c.getState_Net()==='UWB_IRQ'&&c.getState_X()===680){b.x=700;b.y=-440;b.align='CENTER_MIDDLE';}
    if(c.getState_Net()==='ESP_EN'&&c.getState_X()===490){b.x=490;b.y=-815;b.align='CENTER_MIDDLE';}
    if(c.getState_Net()==='BOOT_N'&&c.getState_X()===1010){b.x=1000;b.y=-750;b.align='LEFT_MIDDLE';}
   }
   if(c.getState_ComponentType()==='netflag'&&b.key==='Name'){
    const x=c.getState_X(),y=c.getState_Y();
    if(x===1080&&y===390){b.x=x;b.y=-430;b.rotation=0;b.align='CENTER_MIDDLE';}
    if(x>=1100&&x<=1240&&y===240)b.valueVisible=false;
    if(x>=1100&&x<=1240&&y===200){b.x=x+12;b.y=-200;b.rotation=0;b.align='LEFT_MIDDLE';}
   }
  }
 }
 if(h.type==='TEXT'&&h.id==='aa13a7cb00ed9e6c'){b.x=800;b.y=-515;b.fontSize=16;}
 if(h.type==='TEXT'&&h.id==='1fc924463a628485'){b.x=1130;b.y=-350;}
 if(h.type==='TEXT'&&h.id==='81ac7c565cb77dad'){b.x=70;b.y=-175;b.fontSize=10;}
 if(JSON.stringify(b)!==old){changes.push({id:h.id,type:h.type,before:JSON.parse(old),after:b});return JSON.stringify(h)+'||'+JSON.stringify(b)+'|';}return line;
});
if(!await eda.sys_FileManager.setDocumentSource(lines.join('\n')))throw Error('Rejected');
return {changes,saved:await eda.sch_Document.save(),source:await eda.sys_FileManager.getDocumentSource()};
