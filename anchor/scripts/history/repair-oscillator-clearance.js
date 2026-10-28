// COMMON
const ids=['b3ca29823007b570','f565524652907caf','dd5c08506a669686','60966f75c5fd89c6','2332f2e435d5b010'];
const flags=['4675cb18688edc9c','a3440bad55ba67a1','c70c7a371b26bd32','459b11ae2c7c9898'];
const ws=await eda.sch_PrimitiveWire.getAll();if(!ids.every(id=>ws.some(w=>w.getState_PrimitiveId()===id)))throw Error('Oscillator state changed; inspect before repair');
const beforeSource=await eda.sys_FileManager.getDocumentSource();
if(!await eda.sch_PrimitiveWire.delete(ids))throw Error('Delete oscillator wires failed');
if(!await eda.sch_PrimitiveComponent.delete(flags))throw Error('Delete oscillator ground flags failed');
for(const [ref,x,y] of [['Y1',840,90],['C31',750,90],['C32',930,90]]){const c=comps.find(c=>c.getState_Designator()===ref);await eda.sch_PrimitiveComponent.modify(c,{x,y});}
const Y=await pinmap('Y1'),A=await pinmap('C31'),B=await pinmap('C32'),U=await pinmap('U3');
await wire([[U[21].x,U[21].y,960,U[21].y],[960,U[21].y,960,200],[960,200,780,200],[780,200,780,A[2].y],[780,A[2].y,780,Y[1].y],[780,Y[1].y,Y[1].x,Y[1].y],[A[2].x,A[2].y,780,A[2].y]],'DW_XTI');
await wire([[U[22].x,U[22].y,990,U[22].y],[990,U[22].y,990,180],[990,180,B[2].x,180],[B[2].x,180,900,180],[900,180,900,Y[3].y],[900,Y[3].y,Y[3].x,Y[3].y],[B[2].x,B[2].y,B[2].x,180]],'DW_XTO');
await wire([Y[4].x,Y[4].y,800,Y[4].y,800,130],'GND');await flag(800,130,'GND');
await wire([Y[2].x,Y[2].y,880,Y[2].y,880,50],'GND');await flag(880,50,'GND');
for(const P of [A[1],B[1]]){await wire([P.x,P.y,P.x,50],'GND');await flag(P.x,50,'GND');}
return {beforeSource,deletedWires:ids,deletedFlags:flags,...await finish()};
