const p=await eda.dmt_Project.getCurrentProjectInfo();const d=await eda.dmt_SelectControl.getCurrentDocumentInfo();if(p.friendlyName!=='AI_Driving_PCB_Test'||d.uuid!=='ba9ae5b49cdb7591')throw Error('Wrong document');
const comps=await eda.sch_PrimitiveComponent.getAll();const by=Object.fromEntries(comps.filter(c=>c.getState_Designator()).map(c=>[c.getState_Designator(),c]));
const edits={U1:{rotation:180,mirror:true,name:'AMS1117-3.3'},C1:{name:'10uF / 25V'},C2:{name:'100nF / 50V'},C3:{rotation:270,name:'22uF / 10V Ta'},C4:{name:'100nF / 50V'},J1:{name:'2P 2.54mm'},J2:{name:'2P 2.54mm'},R1:{rotation:90,y:610,name:'1kΩ'},D1:{y:510,name:'RED / KT-0603R'}};
for(const [ref,props]of Object.entries(edits))await eda.sch_PrimitiveComponent.modify(by[ref].getState_PrimitiveId(),props);
const pins={};for(const c of await eda.sch_PrimitiveComponent.getAll()){const ref=c.getState_Designator();if(ref)pins[ref]=await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(c.getState_PrimitiveId());}
const pin=(r,n)=>{const a=pins[r].find(p=>p.pinNumber===n);if(!a)throw Error('Missing '+r+n);return [a.x,a.y];};
const y5=pin('U1','3')[1],y3=pin('U1','4')[1];
const x1=pin('C1','2')[0],x2=pin('C2','2')[0],x3=pin('C3','1')[0],x4=pin('C4','2')[0];
const segments={'+5V':[], '+3V3':[],GND:[],LED_A:[]};const add=(net,pts)=>segments[net].push(pts.flat());
add('+5V',[pin('J1','1'),[300,705],[300,y5],[350,y5],[x1,y5],[x2,y5],pin('U1','3')]);
for(const r of ['C1','C2']){const a=pins[r].reduce((a,b)=>a.y>b.y?a:b);add('+5V',[[a.x,a.y],[a.x,y5]]);}
add('+3V3',[pin('U1','4'),[x3,y3],[1100,y3],[x4,y3],[1320,y3],[1440,y3],[1440,705],pin('J2','1')]);
for(const r of ['C3','C4']){const a=pins[r].reduce((a,b)=>a.y>b.y?a:b);add('+3V3',[[a.x,a.y],[a.x,y3]]);}
const rt=pins.R1.reduce((a,b)=>a.y>b.y?a:b);add('+3V3',[[rt.x,rt.y],[rt.x,y3]]);
add('GND',[[280,470],[x1,470],[x2,470],[650,470],[900,470],[x3,470],[x4,470],[1320,470],[1420,470]]);
add('GND',[pin('J1','2'),[280,695],[280,470]]);add('GND',[pin('J2','2'),[1420,695],[1420,470]]);
add('GND',[pin('U1','1'),[650,pin('U1','1')[1]],[650,470]]);
for(const r of ['C1','C2','C3','C4']){const a=pins[r].reduce((a,b)=>a.y<b.y?a:b);add('GND',[[a.x,a.y],[a.x,470]]);}
add('GND',[pin('D1','2'),[1320,470]]);
const rb=pins.R1.reduce((a,b)=>a.y<b.y?a:b);add('LED_A',[[rb.x,rb.y],pin('D1','1')]);
if((await eda.sch_PrimitiveWire.getAll()).length)throw Error('Wires already exist; inspect before retry');
const created=[];for(const net of ['+5V','+3V3','GND','LED_A']){const w=await eda.sch_PrimitiveWire.create(segments[net],net);if(!w)throw Error('Wire failed '+net);created.push(w);}
const f2=await eda.sch_PrimitiveComponent.createNetFlag('Power','+3V3',675,pin('U1','2')[1],180,false);if(!f2)throw Error('Pin2 flag failed');
await eda.sch_PrimitiveWire.create([...pin('U1','2'),675,pin('U1','2')[1]],'+3V3');
await eda.sch_PrimitiveComponent.createNetFlag('Power','+5V',350,y5,0,false);
await eda.sch_PrimitiveComponent.createNetFlag('Power','+3V3',1100,y3,0,false);
await eda.sch_PrimitiveComponent.createNetFlag('Ground','GND',900,470,0,false);
return {pins,wires:await eda.sch_PrimitiveWire.getAll(),components:await eda.sch_PrimitiveComponent.getAll(),source:await eda.sys_FileManager.getDocumentSource()};
