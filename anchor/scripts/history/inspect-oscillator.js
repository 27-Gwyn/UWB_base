// COMMON
const all=await eda.sch_PrimitiveComponent.getAll();
const filtered=all.filter(c=>['U3','Y1','C31','C32','C26'].includes(c.getState_Designator())||(c.getState_X()>970&&c.getState_X()<1250&&c.getState_Y()<215&&['netport','netflag'].includes(c.getState_ComponentType())));
return {objects:await Promise.all(filtered.map(async c=>({c,pins:await c.getAllPins(),attributes:await eda.sch_PrimitiveAttribute.getAll(c.getState_PrimitiveId())}))),wires:(await eda.sch_PrimitiveWire.getAll()).filter(w=>w.getState_Line().some((x,i,a)=>i%2===0&&x>970&&x<1250&&a[i+1]<215)),source:await eda.sys_FileManager.getDocumentSource()};
