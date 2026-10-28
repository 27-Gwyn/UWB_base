// COMMON
// Reject four-pin search hit; replace only these new, unconnected test objects.
for(const ref of ['TP1','TP2','TP3']){const c=comps.find(c=>c.getState_Designator()===ref);if(c){const ps=await c.getAllPins();if(ps.length!==4)throw Error('Unexpected TP state');await eda.sch_PrimitiveComponent.delete(c);}}
comps=await eda.sch_PrimitiveComponent.getAll();
for(const [ref,x,net] of [['TP1',1230,'+3V3'],['TP2',1340,'GND'],['TP3',1450,'VBUS_5V']])await place(ref,'a0e59b8855a7442383da6e1a35112e6f',x,650,0,net);
// T491 symbol positive terminal is pin 1; turn whole instance to put + above.
const c2=comps.find(c=>c.getState_Designator()==='C2');await eda.sch_PrimitiveComponent.modify(c2,{rotation:270});
const U=await pinmap('U1'),C1=await pinmap('C1'),C2=await pinmap('C2'),C3=await pinmap('C3');
await wire([U[3].x,U[3].y,110,U[3].y],'VBUS_5V');await flag(110,940,'VBUS_5V');
await wire([C1[1].x,C1[1].y,110,870],'GND');await flag(110,870,'GND');
await wire([U[1].x,U[1].y,165,U[1].y,165,870],'GND');await flag(165,870,'GND');
await wire([U[2].x,U[2].y,180,U[2].y,180,1000,310,1000,310,U[4].y,U[4].x,U[4].y],'+3V3');
await wire([310,950,420,950],'+3V3');await flag(420,950,'+3V3');
await wire([C2[1].x,C2[1].y,350,950],'+3V3');await wire([C2[2].x,C2[2].y,350,870],'GND');await flag(350,870,'GND');
await wire([C3[1].x,C3[1].y,420,950],'+3V3');await wire([C3[2].x,C3[2].y,420,870],'GND');await flag(420,870,'GND');
const J=await pinmap('J1'),E=await pinmap('U4');
for(const n of ['B8','A8']){const c=comps.find(c=>c.getState_Designator()==='J1');const pp=(await c.getAllPins()).find(p=>p.getState_PinNumber()===n);const a=pp.toAsync();a.setState_NoConnected(true);await a.done();}
await wire([205,545,225,545,225,635,205,635],'VBUS_5V');await wire([225,635,225,680],'VBUS_5V');await flag(225,680,'VBUS_5V');
// VBUS and data escape in separate corridors; crossings without junctions are checked by netlist.
await wire([205,535,215,535,215,510],'GND');await flag(215,510,'GND');await wire([205,645,245,645,245,665],'GND');await flag(245,665,'GND');
await wire([135,615,100,615,100,645,135,645],'GND');await wire([135,625,100,625],'GND');await wire([135,635,100,635],'GND');await flag(100,610,'GND');await wire([100,610,100,615],'GND');
await wire([205,575,255,575,255,595,205,595],'USB_CONN_DM');await wire([255,580,E[1].x,E[1].y],'USB_CONN_DM');
await wire([205,585,275,585,275,605,205,605],'USB_CONN_DP');await wire([275,585,290,585,290,520,E[3].x,E[3].y],'USB_CONN_DP');
await wire([E[6].x,E[6].y,470,580,470,500,530,500],'USB_CONN_DM');
await wire([E[4].x,E[4].y,490,520,490,450,530,450],'USB_CONN_DP');
await wire([E[2].x,E[2].y,295,550,295,490],'GND');await flag(295,490,'GND');
await wire([E[5].x,E[5].y,455,550,455,630],'VBUS_5V');await flag(455,630,'VBUS_5V');
for(const [ref,pn,x] of [['R2','A5',180],['R3','B5',280]]){const R=await pinmap(ref);const P=J[pn];const net='USB_'+pn;await wire([P.x,P.y,x===180?235:285,P.y,x===180?235:285,430,R[2].x,430,R[2].x,R[2].y],net);await wire([R[1].x,R[1].y,R[1].x,340],'GND');await flag(R[1].x,340,'GND');}
for(const [ref,nets] of [['J2',['GND','UART0_TX','UART0_RX']],['J3',['GND','ESP_EN','BOOT_N']]]){const ps=await pinmap(ref);for(let i=1;i<=3;i++){const p=ps[i],x=1260;await wire([p.x,p.y,x,p.y],nets[i-1]);await port(x,p.y,nets[i-1]);}}
for(const [ref,net] of [['TP1','+3V3'],['TP2','GND'],['TP3','VBUS_5V']]){const ps=await pinmap(ref),p=ps[1];await wire([p.x,p.y,p.x-25,p.y],net);await flag(p.x-25,p.y,net);}
await text(65,1080,'USB 供电与 3.3 V 稳压',18,true);
await text(65,830,'[SPEC] AMS: COUT = 22 uF solid tantalum; tab = VOUT.\n[TBD-MEASURE] USB source capability, inrush, dropout and thermal margin.\n5 V -> 3.3 V: 0.51 W @ 300 mA; 0.85 W @ 500 mA (plus bias).',11);
await text(70,730,'USB-C USB2.0 / ESD 保护',16,true);
await text(1180,1080,'UART0 / 恢复 / 测点',18,true);
await text(1190,730,'No 5 V UART. Connect GND before signal.\nUSB OTG and Serial/JTAG share the internal PHY.\nDo not back-power an unpowered board from UART.',11);
return await finish();
