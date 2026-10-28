const LIB='0819f05c4eef4c71ace90d822a990e87';
const PROJECT='2ceff1de2cdb41d6a9101840f44c2b87', PAGE='a2ae37ea91715ac4';
const before=await eda.dmt_Project.getCurrentProjectInfo();if(before?.uuid!==PROJECT)throw Error('Wrong project');
const active=await eda.dmt_SelectControl.getCurrentDocumentInfo();
if(active?.uuid!==PAGE)await eda.dmt_EditorControl.openDocument(PAGE);
const focus=await eda.dmt_SelectControl.getCurrentDocumentInfo();if(focus?.uuid!==PAGE)throw Error('Wrong page');
const log=[];
let comps=await eda.sch_PrimitiveComponent.getAll();
async function place(ref,uuid,x,y,rotation=0,name){
 let c=comps.find(c=>c.getState_Designator()===ref);
 const knownImported={U2:'befca1cc7f376be3',R1:'a465317a75ca2b24'};
 if(c&&c.getState_Component().uuid!==uuid&&c.getState_Component().uuid!==knownImported[ref])throw Error('Existing reference has different device: '+ref);
 if(!c){c=await eda.sch_PrimitiveComponent.create({libraryUuid:LIB,uuid},x,y,undefined,rotation,false,true,true);if(!c)throw Error('Create failed '+ref);log.push({ref,id:c.getState_PrimitiveId()});comps.push(c);}
 await eda.sch_PrimitiveComponent.modify(c,{x,y,rotation,designator:ref,...(name?{name}:{})});
 return {id:c.getState_PrimitiveId(),ref,pins:await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(c.getState_PrimitiveId())};
}
async function wire(points,net){const w=await eda.sch_PrimitiveWire.create(points,net);if(!w)throw Error('Wire failed '+net+' '+JSON.stringify(points));log.push({type:'wire',id:w.getState_PrimitiveId(),net});return w;}
async function text(x,y,t,size=12,bold=false){const a=await eda.sch_PrimitiveText.create(x,y,t,0,null,'Arial',size,bold,false,false,1);if(!a)throw Error('Text failed');log.push({type:'text',id:a.getState_PrimitiveId()});return a;}
async function port(x,y,net,rotation=0){const a=await eda.sch_PrimitiveComponent.createNetPort('BI',net,x,y,rotation,false);if(!a)throw Error('Port failed '+net);log.push({type:'port',id:a.getState_PrimitiveId(),net});return a;}
async function flag(x,y,net){const a=await eda.sch_PrimitiveComponent.createNetFlag(net==='GND'?'Ground':'Power',net,x,y);if(!a)throw Error('Flag failed '+net);log.push({type:'flag',id:a.getState_PrimitiveId(),net});return a;}
async function pinmap(ref){const c=(await eda.sch_PrimitiveComponent.getAll()).find(c=>c.getState_Designator()===ref);if(!c)throw Error('Missing '+ref);const pins=await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(c.getState_PrimitiveId());return Object.fromEntries(pins.map(p=>[p.pinNumber,p]));}
async function finish(){return {log,saved:await eda.sch_Document.save(),components:await eda.sch_PrimitiveComponent.getAll(),pins:Object.fromEntries(await Promise.all((await eda.sch_PrimitiveComponent.getAll()).filter(c=>c.getState_ComponentType()==='part').map(async c=>[c.getState_Designator(),await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(c.getState_PrimitiveId())])))};}
