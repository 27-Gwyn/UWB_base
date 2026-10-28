const doc=await eda.dmt_SelectControl.getCurrentDocumentInfo();
if(doc?.uuid!=='dff4243c09a73712')throw Error('Expected project-owned U1 symbol');
const before=await eda.sys_FileManager.getDocumentSource();
const records=before.split('\n').filter(Boolean).map(line=>{const [a,b]=line.replace(/\|$/,'').split('||');return [JSON.parse(a),JSON.parse(b)];});
const pins={e2:{x:0,y:55,rotation:270},e6:{x:85,y:-15,rotation:180},e10:{x:-85,y:0,rotation:0},e14:{x:85,y:15,rotation:180}};
const attrs={e3:{x:0,y:28,align:'CENTER_BOTTOM'},e4:{x:5,y:47,align:'LEFT_BOTTOM'},e7:{x:60,y:-11,align:'RIGHT_BOTTOM'},e8:{x:72,y:-16,align:'LEFT_BOTTOM'},e11:{x:-60,y:4,align:'LEFT_BOTTOM'},e12:{x:-72,y:-1,align:'RIGHT_BOTTOM'},e15:{x:60,y:19,align:'RIGHT_BOTTOM'},e16:{x:72,y:14,align:'LEFT_BOTTOM'}};
for(const [h,b] of records){
if(h.type==='PART')b.BBOX=[-65,-35,65,35];
if(h.id==='e0')Object.assign(b,{dotX1:-65,dotY1:-35,dotX2:65,dotY2:35});
if(pins[h.id])Object.assign(b,pins[h.id],{length:20});
if(attrs[h.id])Object.assign(b,attrs[h.id]);
}
const source=records.filter(([h])=>h.type!=='ELLIPSE').map(([h,b])=>JSON.stringify(h)+'||'+JSON.stringify(b)+'|').join('\n');
const updated=await eda.sys_FileManager.setDocumentSource(source);
if(!updated)throw Error('Symbol source update failed');
const saved=await eda.sch_Document.save();
return {updated,saved,before,after:await eda.sys_FileManager.getDocumentSource()};
