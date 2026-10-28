// COMMON
const nc=[4,5,6,10,11,15,16,22,23,24,25,26,28,29,30,31,32,33,34,35,38,39];
const u=comps.find(c=>c.getState_Designator()==='U2');const pins=await u.getAllPins();let results=[];
for(const p of pins){if(nc.includes(Number(p.getState_PinNumber()))){const a=p.toAsync();a.setState_NoConnected(true);results.push(await a.done());}}
for(const c of comps){if(c.getState_ComponentType()!=='netport')continue;const x=c.getState_X(),y=c.getState_Y();if((x===710&&y>690)||(x===550&&y===580)||(x===530&&(y===450||y===500))||(x===490&&y===800)||(x===560&&y===675)){for(const a of await eda.sch_PrimitiveAttribute.getAll(c.getState_PrimitiveId()))if(a.getState_Key()==='Name')await eda.sch_PrimitiveAttribute.modify(a,{x:x-15,y,alignMode:8,fontSize:9});}}
// Shift R10 display text outside the UART0 line corridor.
for(const ref of ['R10','R11','R12','R13','R14','C10']){const c=comps.find(c=>c.getState_Designator()===ref);for(const a of await eda.sch_PrimitiveAttribute.getAll(c.getState_PrimitiveId())){if(a.getState_Key()==='Designator')await eda.sch_PrimitiveAttribute.modify(a,{x:c.getState_X()+12,y:c.getState_Y()+17,fontSize:9,alignMode:1});if(a.getState_Key()==='Name')await eda.sch_PrimitiveAttribute.modify(a,{x:c.getState_X()+12,y:c.getState_Y()-5,fontSize:9,alignMode:1});}}
return {ncResults:results,pins:await u.getAllPins(),saved:await eda.sch_Document.save()};
