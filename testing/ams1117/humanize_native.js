const doc=await eda.dmt_SelectControl.getCurrentDocumentInfo();if(doc.uuid!=='dff4243c09a73712')throw Error('Wrong symbol');
const before=await eda.sys_FileManager.getDocumentSource();
const changes={e2:{x:0,y:-55,rotation:270,pinLength:20},e6:{x:85,y:15,rotation:0,pinLength:20},e10:{x:-85,y:0,rotation:180,pinLength:20},e14:{x:85,y:-15,rotation:0,pinLength:20}};
for(const [id,p] of Object.entries(changes))await eda.sch_PrimitivePin.modify(id,p);
await eda.sch_PrimitiveRectangle.modify('e0',{topLeftX:-65,topLeftY:35,width:130,height:70});
const attr={e3:{x:0,y:-25,alignMode:5},e4:{x:5,y:-45},e7:{x:60,y:19,alignMode:8},e8:{x:72,y:24},e11:{x:-60,y:4,alignMode:2},e12:{x:-72,y:9},e15:{x:60,y:-11,alignMode:8},e16:{x:72,y:-6}};
for(const [id,p]of Object.entries(attr))await eda.sch_PrimitiveAttribute.modify(id,p);
const circles=await eda.sch_PrimitiveCircle.getAll();if(circles.length)await eda.sch_PrimitiveCircle.delete(circles.map(c=>c.getState_PrimitiveId()));
return {saved:await eda.sch_Document.save(),pins:await eda.sch_PrimitivePin.getAll(),before,after:await eda.sys_FileManager.getDocumentSource()};
