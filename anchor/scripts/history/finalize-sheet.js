// COMMON
await eda.dmt_Schematic.modifySchematicPageTitleBlock(false);
await eda.dmt_Schematic.modifySchematicPageName(PAGE,'Anchor');
const emptyIds=['cc32c3a21332b45a','94ac9554503a3175','58f099cb3299da10','d493f2dd3e80a1aa','718196f307d82a33'];
const deleted=[];if(!await eda.sch_Document.save())throw Error('Save before page inventory failed');
for(const id of emptyIds){const info=await eda.dmt_Schematic.getSchematicPageInfo(id);if(!info)continue;if(info.parentSchematicUuid!=='fff8ecc88c1d6f03')throw Error('Wrong page ownership');await eda.dmt_EditorControl.openDocument(id);const c=await eda.sch_PrimitiveComponent.getAll(),w=await eda.sch_PrimitiveWire.getAll();if(c.some(c=>c.getState_ComponentType()!=='sheet')||w.length)throw Error('Added page no longer empty: '+id);deleted.push({id,deleted:await eda.dmt_Schematic.deleteSchematicPage(id)});}
await eda.dmt_EditorControl.openDocument(PAGE);
await text(65,1140,'UWB Anchor | ESP32-S3-WROOM-1-N16R8 + DW3220 | DRAFT',22,true);
return {deleted,schematic:await eda.dmt_Schematic.getCurrentSchematicInfo(),saved:await eda.sch_Document.save()};
