// COMMON
const fixed=[];
for(const c of comps){for(const a of await eda.sch_PrimitiveAttribute.getAll(c.getState_PrimitiveId())){const size=a.getState_FontSize();if(size&&size>1){await eda.sch_PrimitiveAttribute.modify(a,{fontSize:0.09});fixed.push({id:a.getState_PrimitiveId(),before:size});}}}
return {fixed,saved:await eda.sch_Document.save()};
