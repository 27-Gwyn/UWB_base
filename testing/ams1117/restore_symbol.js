const d=await eda.dmt_SelectControl.getCurrentDocumentInfo();if(d.uuid!=='dff4243c09a73712')throw Error('Wrong symbol');
const before=await eda.sys_FileManager.getDocumentSource();
for(const [id,x,y,rotation] of [['e2',-45,10,180],['e6',-45,0,180],['e10',-45,-10,180],['e14',45,0,0]])await eda.sch_PrimitivePin.modify(id,{x,y,rotation,pinLength:10});
await eda.sch_PrimitiveRectangle.modify('e0',{topLeftX:-35,topLeftY:-20,width:70,height:40});
const attrs={e3:{x:-31.3,y:6,alignMode:3},e4:{x:-35.5,y:11,alignMode:9},e7:{x:-31.3,y:-4,alignMode:3},e8:{x:-35.5,y:1,alignMode:9},e11:{x:-31.3,y:-14,alignMode:3},e12:{x:-35.5,y:-9,alignMode:9},e15:{x:31.3,y:-4,alignMode:9},e16:{x:35.5,y:1,alignMode:3}};
for(const [id,p]of Object.entries(attrs))await eda.sch_PrimitiveAttribute.modify(id,p);
return {saved:await eda.sch_Document.save(),pins:await eda.sch_PrimitivePin.getAll(),source:await eda.sys_FileManager.getDocumentSource()};
