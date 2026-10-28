// COMMON
for(const w of await eda.sch_PrimitiveWire.getAll())for(const a of await eda.sch_PrimitiveAttribute.getAll(w.getState_PrimitiveId()))await eda.sch_PrimitiveAttribute.modify(a,{valueVisible:false,keyVisible:false});
for(const c of comps){const ref=c.getState_Designator(),type=c.getState_ComponentType(),x=c.getState_X(),y=c.getState_Y();
 if(type==='part'){
  const attrs=await eda.sch_PrimitiveAttribute.getAll(c.getState_PrimitiveId());
  const small=/^(R|C|D|FB)/.test(ref||'');
  if(small){const ps=await c.getAllPins();const vertical=ps.length===2&&Math.abs(ps[0].getState_X()-ps[1].getState_X())<0.001;
   for(const a of attrs){const k=a.getState_Key();if(k==='Designator')await eda.sch_PrimitiveAttribute.modify(a,vertical?{x:x+12,y:y+10,alignMode:3,fontSize:0.08}:{x,y:y+13,alignMode:6,fontSize:0.08});
    if(k==='Name'){let name=c.getState_OtherProperty()?.Value||a.getState_Value();if(ref==='C2')name='22uF Ta';if(ref==='FB1')name='33R @100MHz';if(ref==='D1')name='STATUS';await eda.sch_PrimitiveAttribute.modify(a,vertical?{x:x+12,y:y-8,alignMode:1,fontSize:0.08,value:name}:{x,y:y-13,alignMode:4,fontSize:0.08,value:name});}}
  }
  if(ref==='U2'||ref==='U3'){for(const a of attrs){if(a.getState_Key()==='Name')await eda.sch_PrimitiveAttribute.modify(a,{x:ref==='U2'?775:750,y:ref==='U2'?980:485,fontSize:0.1,alignMode:1});if(a.getState_Key()==='Designator')await eda.sch_PrimitiveAttribute.modify(a,{x:ref==='U2'?775:750,y:ref==='U2'?955:460,fontSize:0.1,alignMode:1});}}
  if(ref==='R10')for(const a of attrs){if(a.getState_Key()==='Name')await eda.sch_PrimitiveAttribute.modify(a,{x:1075,y:850,alignMode:1});if(a.getState_Key()==='Designator')await eda.sch_PrimitiveAttribute.modify(a,{x:1075,y:870,alignMode:1});}
  if((ref||'').startsWith('TP'))for(const a of attrs)if(a.getState_Key()==='Name')await eda.sch_PrimitiveAttribute.modify(a,{valueVisible:false});
  if((ref||'').startsWith('SW'))for(const a of attrs)if(a.getState_Key()==='Designator')await eda.sch_PrimitiveAttribute.modify(a,{x:x-15,y:y+45,fontSize:0.09,alignMode:1});
 }
 if(type==='netport'){for(const a of await eda.sch_PrimitiveAttribute.getAll(c.getState_PrimitiveId()))if(a.getState_Key()==='Name'){
  if((x===1000&&y>=250&&y<=410)||(x===1260&&y>=790)){await eda.sch_PrimitiveAttribute.modify(a,{x:x+15,y,alignMode:2,fontSize:0.075});}
  else if(x===420||x===690||x===680&&y===425){await eda.sch_PrimitiveAttribute.modify(a,{x:x-15,y,alignMode:8,fontSize:0.075});}
 }}
}
return {saved:await eda.sch_Document.save(),components:await eda.sch_PrimitiveComponent.getAll(),pins:Object.fromEntries(await Promise.all(comps.filter(c=>c.getState_ComponentType()==='part').map(async c=>[c.getState_Designator(),await c.getAllPins()])))};
