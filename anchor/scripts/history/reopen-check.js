// COMMON
const beforeSource=await eda.sys_FileManager.getDocumentSource();
const saved=await eda.sch_Document.save();if(!saved)throw Error('Save failed; do not close');
const beforeDoc=await eda.dmt_SelectControl.getCurrentDocumentInfo();if(beforeDoc.uuid!==PAGE)throw Error('Wrong target');
const closed=await eda.dmt_EditorControl.closeDocument(beforeDoc.tabId);if(!closed)throw Error('Close failed');
const opened=await eda.dmt_EditorControl.openDocument(PAGE);if(!opened)throw Error('Reopen failed');
const afterDoc=await eda.dmt_SelectControl.getCurrentDocumentInfo();
const afterSource=await eda.sys_FileManager.getDocumentSource();
const afterComps=await eda.sch_PrimitiveComponent.getAll();
return {saved,closed,opened,beforeDoc,afterDoc,beforeSource,afterSource,pins:Object.fromEntries(await Promise.all(afterComps.filter(c=>c.getState_ComponentType()==='part').map(async c=>[c.getState_Designator(),await c.getAllPins()]))),components:afterComps};
