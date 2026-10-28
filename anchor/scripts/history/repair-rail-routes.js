// COMMON
const ws=await eda.sch_PrimitiveWire.getAll();
const old1=ws.find(w=>w.getState_PrimitiveId()==='d1f57fb9e9b60f08');
const old2=ws.find(w=>w.getState_PrimitiveId()==='d3d9122eacb433a4');
if(!old1||!old2)throw Error('Repair groups changed');
const beforeRoutes={mcu:old1.getState_Line(),power:old2.getState_Line()};
await eda.sch_PrimitiveWire.modify(old1,{line:[[765,835,735,835],[735,835,735,990],[735,990,690,990],[690,990,620,990],[690,990,690,970],[620,990,620,970]],net:'+3V3'});
const badFlag=comps.filter(c=>c.getState_ComponentType()==='netflag'&&c.getState_Net()==='GND'&&c.getState_X()===735&&c.getState_Y()===870);if(badFlag.length!==1)throw Error('Ground flag repair ambiguous');await eda.sch_PrimitiveComponent.delete(badFlag[0]);
await wire([765,845,750,845,750,885],'GND');await flag(750,885,'GND');
await eda.sch_PrimitiveWire.modify(old2,{line:[[195,950,180,950],[180,950,180,1000],[180,1000,310,1000],[310,1000,310,950],[285,950,310,950],[310,950,350,950],[350,950,420,950],[350,950,350,935],[420,950,420,940]],net:'+3V3'});
await wire([420,900,420,870],'GND');
return {beforeRoutes,saved:await eda.sch_Document.save()};
