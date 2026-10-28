// COMMON
const nc=[4,5,6,10,11,15,16,22,23,24,25,26,28,29,30,31,32,33,34,35,38,39];
const U=await pinmap('U2');
for(const n of nc)await eda.sch_PrimitivePin.modify(U[n],{noConnected:true});
const nets={7:'UWB_WAKE',8:'STATUS_LED_N',9:'USER_KEY',12:'UWB_RST_N',13:'USB_DM',14:'USB_DP',17:'UWB_IRQ',18:'UWB_CS_N',19:'UWB_MOSI',20:'UWB_SCK',21:'UWB_MISO',36:'UART0_RX',37:'UART0_TX'};
// Cross-module signal escape uses real wires and native electrical ports.
for(const [n,net] of Object.entries(nets)){
 const p=U[n];let x=p.x,y=p.y;const rot=p.rotation;
 if(rot===180)x-=55;else if(rot===0)x+=55;else y-=55;
 await wire([p.x,p.y,x,y],net);await port(x,y,net,rot===270?90:0);
}
for(const ref of ['C10','C11','C12']){const c=comps.find(c=>c.getState_Designator()===ref);await eda.sch_PrimitiveComponent.modify(c,{rotation:90});}
const R=await pinmap('R1'),C=await pinmap('C10'),C11=await pinmap('C11'),C12=await pinmap('C12');
await wire([R[2].x,R[2].y,R[2].x,925],'+3V3');await flag(R[2].x,925,'+3V3');
await wire([R[1].x,R[1].y,R[1].x,825,U[3].x,825], 'ESP_EN');
await wire([C[2].x,C[2].y,C[2].x,825], 'ESP_EN');
await wire([C[1].x,C[1].y,C[1].x,750], 'GND');await flag(C[1].x,750,'GND');
await wire([U[2].x,U[2].y,735,U[2].y,735,990,620,990],'+3V3');await flag(620,990,'+3V3');
for(const [ref,M] of [['C11',C11],['C12',C12]]){
const top=Object.values(M).sort((a,b)=>b.y-a.y)[0],bot=Object.values(M).sort((a,b)=>a.y-b.y)[0];await wire([top.x,top.y,top.x,990],'+3V3');await wire([bot.x,bot.y,bot.x,915],'GND');await flag(bot.x,915,'GND');}
await wire([U[1].x,U[1].y,735,U[1].y,735,870],'GND');await flag(735,870,'GND');
await wire([U[40].x,U[40].y,980,U[40].y,980,880,U[41].x,880,U[41].x,U[41].y],'GND');await flag(980,845,'GND');
for(const [ref,net,xN,xG] of [['SW1','ESP_EN',490,400],['SW2','BOOT_N',1010,1100],['SW3','USER_KEY',560,640]]){
 const S=await pinmap(ref);await wire([S[1].x,S[1].y,S[1].x,S[1].y+15,S[2].x,S[2].y+15,S[2].x,S[2].y],net);
 await wire([S[3].x,S[3].y,S[3].x,S[3].y-15,S[4].x,S[4].y-15,S[4].x,S[4].y],'GND');await flag(S[3].x,S[3].y-15,'GND');
 await wire([S[1].x,S[1].y,xN,S[1].y],net);await port(xN,S[1].y,net);
}
await wire([490,800,500,800,500,825,540,825],'ESP_EN');
const RB=await pinmap('R10');await wire([RB[2].x,RB[2].y,RB[2].x,875],'+3V3');await flag(RB[2].x,875,'+3V3');await wire([RB[1].x,RB[1].y,1010,RB[1].y,1010,725],'BOOT_N');
await wire([U[27].x,U[27].y,1010,U[27].y,1010,725],'BOOT_N');
const RK=await pinmap('R11');await wire([RK[2].x,RK[2].y,RK[2].x,755],'+3V3');await flag(RK[2].x,755,'+3V3');await wire([RK[1].x,RK[1].y,560,RK[1].y,560,675],'USER_KEY');
const LED=await pinmap('D1'),RL=await pinmap('R12');await wire([RL[2].x,RL[2].y,LED[2].x,LED[2].y],'LED_K');await wire([RL[1].x,RL[1].y,550,RL[1].y],'STATUS_LED_N');await port(550,580,'STATUS_LED_N');await wire([LED[1].x,LED[1].y,735,LED[1].y,735,600],'+3V3');await flag(735,600,'+3V3');
for(const [ref,usb,raw] of [['R13','USB_DM','USB_CONN_DM'],['R14','USB_DP','USB_CONN_DP']]){const M=await pinmap(ref);await wire([M[1].x,M[1].y,530,M[1].y],raw);await port(530,M[1].y,raw);await wire([M[2].x,M[2].y,680,M[2].y],usb);await port(680,M[2].y,usb);}
await text(500,1080,'ESP32-S3 最小系统 / EN、BOOT 与恢复路径',18,true);
await text(1090,780,'BOOT: hold SW2, pulse RESET\nUART0: 3.3 V only\nGPIO35/36/37 reserved for PSRAM',12);
await text(760,605,'[SPEC] RST_N: MCU open-drain LOW / release only; no pull-up.',11);
return await finish();
