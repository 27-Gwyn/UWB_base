// COMMON
const wires=await eda.sch_PrimitiveWire.getAll();
const hidden=[];for(const w of wires){for(const a of await eda.sch_PrimitiveAttribute.getAll(w.getState_PrimitiveId())){await eda.sch_PrimitiveAttribute.modify(a,{valueVisible:false,keyVisible:false});hidden.push(a.getState_PrimitiveId());}}
const parts=await eda.sch_PrimitiveComponent.getAll();const portAttrs=[];
for(const c of parts){if(c.getState_ComponentType()!=='netport')continue;const x=c.getState_X(),y=c.getState_Y();for(const a of await eda.sch_PrimitiveAttribute.getAll(c.getState_PrimitiveId()))if(a.getState_Key()==='Name'||a.getState_Key()==='Net'){portAttrs.push(a);}}
return {hidden,portAttrs,pins:await pinmap('U2'),attributes:await eda.sch_PrimitiveAttribute.getAll(),saved:await eda.sch_Document.save()};
