// COMMON
for(const c of comps){const type=c.getState_ComponentType(),x=c.getState_X(),y=c.getState_Y(),ref=c.getState_Designator();const attrs=await eda.sch_PrimitiveAttribute.getAll(c.getState_PrimitiveId());
 if(type==='netport'&&c.getState_Rotation()===0){for(const a of attrs)if(a.getState_Key()==='Name'){
  if(x===1000&&y>=250&&y<=410)await eda.sch_PrimitiveAttribute.modify(a,{x:x+50,y,alignMode:2,fontSize:0.075});
  else if(x===1260&&y>=790)await eda.sch_PrimitiveAttribute.modify(a,{x:x-10,y,alignMode:8,fontSize:0.075});
 }}
 if(type==='netflag'&&Math.abs(x-570)<.001&&Math.abs(y-345)<.001)for(const a of attrs)if(a.getState_Key()==='Name')await eda.sch_PrimitiveAttribute.modify(a,{valueVisible:false});
 if(ref==='R30'||ref==='R31'||ref==='R33'||ref==='R34')for(const a of attrs)if(a.getState_Key()==='Name')await eda.sch_PrimitiveAttribute.modify(a,{value:'10k'});
 if(ref==='R32')for(const a of attrs)if(a.getState_Key()==='Name')await eda.sch_PrimitiveAttribute.modify(a,{value:'100k'});
 if(ref==='SW3')for(const a of attrs){if(a.getState_Key()==='Designator')await eda.sch_PrimitiveAttribute.modify(a,{x:650,y:690,alignMode:1});if(a.getState_Key()==='Name')await eda.sch_PrimitiveAttribute.modify(a,{x:650,y:675,alignMode:1,fontSize:0.08});}
 if(ref==='R30')for(const a of attrs)if(a.getState_Key()==='Designator')await eda.sch_PrimitiveAttribute.modify(a,{x:625,y:455,alignMode:1});
}
const texts=await eda.sch_PrimitiveText.getAll();for(const t of texts){const content=t.getState_Content();if(content==='DW3220 / SPI / 38.4 MHz')await eda.sch_PrimitiveText.modify(t,{x:740,y:515});if(content.startsWith('[SPEC] RST_N:'))await eda.sch_PrimitiveText.modify(t,{x:1140,y:610,content:'RST_N: MCU open-drain LOW / release only.\nNo external pull-up; no push-pull HIGH.'});}
return {saved:await eda.sch_Document.save()};
