// COMMON
const U=await pinmap('U3');const uc=comps.find(c=>c.getState_Designator()==='U3');
for(const p of await uc.getAllPins())if([3,4,6,7,8,9,31].includes(Number(p.getState_PinNumber()))){const a=p.toAsync();a.setState_NoConnected(true);await a.done();}
for(const [n,net] of Object.entries({38:'DW_VIO_D',37:'UWB_CS_N',36:'UWB_MISO',35:'UWB_MOSI',34:'UWB_SCK',33:'UWB_RST_N',32:'UWB_WAKE',30:'GND',29:'+3V3',28:'DW_VDD2A',27:'DW_VTX_D',26:'+3V3',23:'+3V3'})){const p=U[n];await wire([p.x,p.y,1000,p.y],net);await port(1000,p.y,net);}
await wire([940,425,980,425,980,415,940,415],'GND');await wire([980,425,980,450],'GND');await flag(980,450,'GND');
await wire([940,275,980,275,980,265,940,265],'GND');await port(980,275,'GND');
for(const [ns,y] of [[[10,11,12],335],[[14,15,16,17],295],[[19,20],245]]){for(const n of ns)await wire([U[n].x,U[n].y,690,U[n].y],'GND');await wire([690,U[ns[0]].y,690,U[ns[ns.length-1]].y],'GND');await port(690,y,'GND');}
await wire([730,425,680,425],'UWB_IRQ');await port(680,425,'UWB_IRQ');
const RA=await pinmap('R30'),RP=await pinmap('R31');
await wire([730,415,680,415,680,RA[2].y,RA[2].x,RA[2].y],'DW_SPIPHA');await wire([RA[1].x,RA[1].y,RA[1].x,375],'GND');await flag(RA[1].x,375,'GND');
await wire([730,385,610,385,610,RP[2].y,RP[2].x,RP[2].y],'DW_SPIPOL');await wire([RP[1].x,RP[1].y,RP[1].x,345],'GND');await flag(RP[1].x,345,'GND');
for(const [ref,topNet,bottomNet] of [['R32','UWB_IRQ','GND'],['R33','+3V3','UWB_CS_N'],['R34','UWB_WAKE','GND']]){const ps=await pinmap(ref),top=Object.values(ps).sort((a,b)=>b.y-a.y)[0],bot=Object.values(ps).sort((a,b)=>a.y-b.y)[0];await wire([top.x,top.y,top.x,580],topNet);if(topNet==='+3V3')await flag(top.x,580,topNet);else await port(top.x,580,topNet);await wire([bot.x,bot.y,bot.x,500],bottomNet);if(bottomNet==='GND')await flag(bot.x,500,'GND');else await port(bot.x,500,bottomNet);}
const F=await pinmap('FB1');await wire([F[1].x,F[1].y,1080,390],'+3V3');await flag(1080,390,'+3V3');await wire([F[2].x,F[2].y,1450,390],'DW_VDD2A');await port(1450,390,'DW_VDD2A');
const decouplers=[['C20','+3V3',320,240],['C21','+3V3',320,240],['C22','+3V3',320,240],['C23','+3V3',320,240],['C24','+3V3',320,240],['C25','+3V3',200,120],['C26','+3V3',200,120],['C27','+3V3',200,120],['C28','DW_VTX_D',200,120],['C29','DW_VIO_D',200,120],['C30','DW_VDD2A',390,310]];
for(const [ref,net,yt,yb] of decouplers){const ps=await pinmap(ref),top=Object.values(ps).sort((a,b)=>b.y-a.y)[0],bot=Object.values(ps).sort((a,b)=>a.y-b.y)[0];await wire([top.x,top.y,top.x,yt],net);await wire([bot.x,bot.y,bot.x,yb],'GND');await flag(bot.x,yb,'GND');if(net==='+3V3')await flag(top.x,yt,net);else if(ref!=='C30')await port(top.x,yt,net);}
const Y=await pinmap('Y1'),CX=await pinmap('C31'),CO=await pinmap('C32');
await wire([U[21].x,U[21].y,990,235,990,105,1065,105,1065,Y[1].y,Y[1].x,Y[1].y],'DW_XTI');
await wire([CX[2].x,CX[2].y,CX[2].x,105],'DW_XTI');await wire([CX[1].x,CX[1].y,CX[1].x,30],'GND');await flag(CX[1].x,30,'GND');
await wire([U[22].x,U[22].y,1010,245,1010,130,1200,130,1200,CO[2].y],'DW_XTO');
await wire([Y[3].x,Y[3].y,1170,Y[3].y,1170,130],'DW_XTO');await wire([CO[1].x,CO[1].y,CO[1].x,30],'GND');await flag(CO[1].x,30,'GND');
await wire([Y[4].x,Y[4].y,1070,Y[4].y,1070,120],'GND');await flag(1070,120,'GND');await wire([Y[2].x,Y[2].y,1160,Y[2].y,1160,30],'GND');await flag(1160,30,'GND');
const yc=comps.find(c=>c.getState_Designator()==='Y1');await eda.sch_PrimitiveComponent.modify(yc,{addIntoBom:false,name:'8Y38472012 / DNP - ESR TBD'});
for(const [ref,n,chipnet,feed] of [['C40',13,'DW_RF2','ANT2_FEED_TBD'],['C41',18,'DW_RF1','ANT1_FEED_TBD']]){const C=await pinmap(ref);await wire([U[n].x,U[n].y,C[2].x,C[2].y],chipnet);await wire([C[1].x,C[1].y,420,C[1].y],feed);await port(420,C[1].y,feed);}
await text(740,550,'DW3220 / SPI / 38.4 MHz',18,true);
await text(1060,460,'[SPEC] VTX_D and VIO_D: capacitor nodes only.\n[DESIGN] SPI mode 0; CS high, WAKE low before firmware.',11);
await text(1050,350,'U3 external supply decoupling',12,true);
await text(70,290,'双天线馈电 / DRAFT',16,true);
await text(70,230,'ANT1 / ANT2 physical design: TBD (user confirmed).\n[SPEC] 50 ohm RF1/RF2; 2 pF series DC block.\n[TBD-MEASURE] match, mutual coupling and phase centers.\nNo verified 16.9 mm phase-center spacing; stackup TBD.',11);
await text(80,120,'Y1 候选晶体暂不装配：参考手册推荐该型号，\n但当前 ESR 80 ohm 与表 10 的 60 ohm 条件有差异；\n需厂家确认或起振/温度/电压裕量验证后定版。',11);
return await finish();
