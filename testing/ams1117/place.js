const project=await eda.dmt_Project.getCurrentProjectInfo();
const doc=await eda.dmt_SelectControl.getCurrentDocumentInfo();
if(project?.friendlyName!=='AI_Driving_PCB_Test'||doc?.uuid!=='ba9ae5b49cdb7591')throw Error('Project/page mismatch');
const libraryUuid='0819f05c4eef4c71ace90d822a990e87';
const placements=[
['J1','413e1ee0270e47adab3cd56aebe55635',200,700,0,true],
['C1','8c1f4a9e9d204b148b36ce719c891bd1',420,600,90,false],
['C2','96b39256cc3f4d80bd3b503deb4f3328',560,600,90,false],
['U1','9f9c6cb41c7449fd8acf96aceed2661a',750,700,0,false],
['C3','60b599cc41fc4332b802ee995fcea20f',1000,600,90,false],
['C4','96b39256cc3f4d80bd3b503deb4f3328',1150,600,90,false],
['J2','413e1ee0270e47adab3cd56aebe55635',1490,700,0,false],
['R1','18db11499a04403ba8c98e2f7a687fbc',1320,560,0,false],
['D1','044668f4d8a64015bfbf32f95a0f5c4c',1320,420,90,false]
];
const existing=await eda.sch_PrimitiveComponent.getAll();
for(const [ref,uuid,x,y,rot,mirror] of placements){
if(existing.some(c=>c.getState_Designator()===ref))continue;
const c=await eda.sch_PrimitiveComponent.create({libraryUuid,uuid},x,y,'',rot,mirror,true,true);
if(!c)throw Error('Create failed '+ref);
const a=c.toAsync();a.setState_Designator(ref);await a.done();
}
const result=[];
for(const c of await eda.sch_PrimitiveComponent.getAll()){
if(!c.getState_Designator())continue;
result.push({component:c,pins:await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(c.getState_PrimitiveId()),bbox:await eda.sch_Primitive.getPrimitivesBBox([c.getState_PrimitiveId()])});
}
return {placed:result};
