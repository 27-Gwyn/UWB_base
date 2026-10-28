// COMMON
const ws=await eda.sch_PrimitiveWire.getAll();
const near=(a,n)=>a.some(v=>Math.abs(v-n)<0.00001);
const mode=ws.find(w=>near(w.getState_Line(),680)&&near(w.getState_Line(),435)&&near(w.getState_Line(),425));
const xto=ws.find(w=>w.getState_PrimitiveId()==='038a158ba307c66f');
if(!mode||!xto)throw Error('Repair state changed');
const old={mode:{id:mode.getState_PrimitiveId(),line:mode.getState_Line()},xto:{id:xto.getState_PrimitiveId(),line:xto.getState_Line()}};
if(!await eda.sch_PrimitiveWire.delete([mode.getState_PrimitiveId(),xto.getState_PrimitiveId()]))throw Error('Delete failed');
const R=await pinmap('R30');await wire([730,415,665,415,665,R[2].y,R[2].x,R[2].y],'DW_SPIPHA');
await wire([730,425,680,425],'UWB_IRQ');
const C=await pinmap('C26');const bot=Object.values(C).sort((a,b)=>a.y-b.y)[0];await wire([bot.x,bot.y,bot.x,120],'GND');
const Y=await pinmap('Y1'),CO=await pinmap('C32');
await wire([940,245,1010,245,1010,130,1200,130,1200,CO[2].y],'DW_XTO');
await wire([Y[3].x,Y[3].y,1180,Y[3].y,1180,130],'DW_XTO');
return {old,...await finish()};
