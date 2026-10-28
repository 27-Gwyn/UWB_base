// COMMON
const pre=await eda.dmt_SelectControl.getCurrentDocumentInfo();
const boolean=await eda.sch_Drc.check(true,false,false);
const afterBoolean=await eda.dmt_SelectControl.getCurrentDocumentInfo();
const details=await eda.sch_Drc.check(true,false,true);
const afterDetails=await eda.dmt_SelectControl.getCurrentDocumentInfo();
return {pre,boolean,afterBoolean,details,afterDetails,scopeVerified:[pre,afterBoolean,afterDetails].every(d=>d.uuid===PAGE)};
