// COMMON
let n=0;for(const a of await eda.sch_PrimitiveAttribute.getAll()){if(a.getState_FontSize()===9){await eda.sch_PrimitiveAttribute.modify(a,{fontSize:null});n++;}}
return {n,saved:await eda.sch_Document.save()};
