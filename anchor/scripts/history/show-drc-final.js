// COMMON
return {document:await eda.dmt_SelectControl.getCurrentDocumentInfo(),details:await eda.sch_Drc.check(true,true,true)};
