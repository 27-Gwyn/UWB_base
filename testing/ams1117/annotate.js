const doc=await eda.dmt_SelectControl.getCurrentDocumentInfo();if(doc.uuid!=='ba9ae5b49cdb7591')throw Error('Wrong page');
const source=await eda.sys_FileManager.getDocumentSource();
const attrs=source.split('\n').filter(l=>l.includes('||')).map(l=>l.replace(/\|$/,'').split('||').map(JSON.parse)).filter(([h])=>h.type==='ATTR');
const cs=await eda.sch_PrimitiveComponent.getAll();
const position={J1:[[180,750],[180,660]],C1:[[440,620],[440,595]],C2:[[580,620],[580,595]],U1:[[750,805],[750,780]],C3:[[1020,620],[1020,595]],C4:[[1170,620],[1170,595]],J2:[[1470,750],[1470,660]],R1:[[1340,625],[1340,600]],D1:[[1340,525],[1340,500]]};
for(const c of cs){const ref=c.getState_Designator();const id=c.getState_PrimitiveId();if(position[ref]){for(const [h,b]of attrs.filter(([h,b])=>b.parentId===id))if(b.key==='Designator'||b.key==='Name'){const isRef=b.key==='Designator';const [x,y]=position[ref][isRef?0:1];await eda.sch_PrimitiveAttribute.modify(h.id,{x,y,rotation:0,alignMode:ref==='U1'?5:2,fontSize:isRef?14:10,bold:isRef,valueVisible:true});}}else if(c.getState_ComponentType()==='netflag'&&Math.abs(c.getState_X()-675)<1){for(const [h,b]of attrs.filter(([h,b])=>b.parentId===id))if(b.key==='Name')await eda.sch_PrimitiveAttribute.modify(h.id,{x:630,y:735,rotation:0,alignMode:5,fontSize:10});}}
if((await eda.sch_PrimitiveText.getAll()).length)throw Error('Notes already exist');
const notes=[
[160,970,'AMS1117 5V → 3.3V 稳压板',28,true],
[160,920,'外部稳定直流 5V 输入  |  固定 3.3V 输出  |  目标负载 300mA（需散热验证）',15,false],
[180,850,'01  5V 输入',17,true],[420,850,'02  输入滤波',17,true],[740,850,'03  线性稳压',17,true],[1000,850,'04  输出滤波',17,true],[1400,850,'05  3.3V 输出',17,true],
[720,585,'U1: 2、4脚同为 VOUT',12,false],[720,560,'4脚为散热片，接 +3V3',12,false],
[160,375,'设计说明',17,true],
[160,340,'[SPEC] C3：22uF / 10V 固体钽；按 AMS 原厂手册选型。C1/C2、C3/C4 应紧靠对应电源引脚。',13,false],
[160,305,'[TARGET] LED：Vf=1.8～2.4V，I≈0.9～1.5mA；R1 功耗≤2.25mW（额定100mW）。',13,false],
[160,270,'[TARGET] 300mA 负载损耗≈0.51W；加静态电流与 LED 后约0.54W（Iq典型5mA）。',13,false],
[160,235,'[TBD-MEASURE] 大散热焊盘及其铜皮属于 +3V3。持续电流取决于铜面积、环境温度和实测温升。',13,false],
[160,200,'仅用于稳定5V直流输入；禁止反接及外部反向驱动输出。固定版本不使用反馈分压。',13,false]
];
for(const [x,y,s,size,bold]of notes)await eda.sch_PrimitiveText.create(x,y,s,0,'#24384B',null,size,bold,false,false,1);
return {saved:await eda.sch_Document.save(),source:await eda.sys_FileManager.getDocumentSource()};
