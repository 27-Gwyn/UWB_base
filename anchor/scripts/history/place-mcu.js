const p=await eda.dmt_Project.getCurrentProjectInfo();if(p?.uuid!=='2ceff1de2cdb41d6a9101840f44c2b87')throw Error('Wrong project');
await eda.dmt_EditorControl.openDocument('a2ae37ea91715ac4');
const all=await eda.sch_PrimitiveComponent.getAll();if(all.some(c=>c.getState_Designator()==='U2'))throw Error('U2 exists; inspect before retry');
const u=await eda.sch_PrimitiveComponent.create({libraryUuid:'0819f05c4eef4c71ace90d822a990e87',uuid:'701a1177d7184d1bbf7f86d69d9385c2'},600,600);
if(!u)throw Error('MCU create failed');await eda.sch_PrimitiveComponent.modify(u,{designator:'U2',name:'ESP32-S3-WROOM-1-N16R8'});
return {component:u,pins:await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(u.getState_PrimitiveId()),attributes:await eda.sch_PrimitiveAttribute.getAll(u.getState_PrimitiveId())};
