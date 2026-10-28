// COMMON
const targets=['d1f57fb9e9b60f08','d3d9122eacb433a4'];
const ws=await eda.sch_PrimitiveWire.getAll();if(!targets.every(id=>ws.some(w=>w.getState_PrimitiveId()===id)))throw Error('Repair group missing; inventory first');
const flags=comps.filter(c=>c.getState_ComponentType()==='netflag'&&c.getState_Net()==='GND'&&c.getState_X()===735&&c.getState_Y()===870);
const deletedWires=await eda.sch_PrimitiveWire.delete(targets);
const deletedFlags=await eda.sch_PrimitiveComponent.delete(flags.map(c=>c.getState_PrimitiveId()));
const still=await eda.sch_PrimitiveWire.getAll();if(still.some(w=>targets.includes(w.getState_PrimitiveId())))throw Error('Wire deletion did not apply');
await wire([[765,835,735,835],[735,835,735,990],[735,990,690,990],[690,990,620,990],[690,990,690,970],[620,990,620,970]],'+3V3');
await wire([765,845,750,845,750,885],'GND');await flag(750,885,'GND');
await wire([[195,950,180,950],[180,950,180,1000],[180,1000,310,1000],[310,1000,310,950],[285,950,310,950],[310,950,350,950],[350,950,420,950],[350,950,350,935],[420,950,420,940]],'+3V3');
await wire([420,900,420,870],'GND');
return {deletedWires,deletedFlags,...await finish()};
