const lib='0819f05c4eef4c71ace90d822a990e87';
const ids={ESP:'701a1177d7184d1bbf7f86d69d9385c2',DW:'ded2baa611094d329d161b961a5b1aeb',AMS:'9f9c6cb41c7449fd8acf96aceed2661a',ESD:'41567551402d47e3a0236ab3d895b322',USB:'74d31c19993b4b9581f3175a7da4b280'};
const out={};
async function file(f){if(!f)return null; const a=new Uint8Array(await f.arrayBuffer());let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.slice(i,i+8192));return {name:f.name,size:f.size,data:btoa(s)}}
for(const [k,id] of Object.entries(ids)){const d=await eda.lib_Device.get(id,lib);const a=d.association;out[k]={device:d,symbol:await eda.lib_Symbol.get(a.symbolUuid,lib),footprint:await eda.lib_Footprint.get(a.footprintUuid,lib),symbolFile:await file(await eda.sys_FileManager.getSymbolFileBySymbolUuid(a.symbolUuid,lib)),footprintFile:await file(await eda.sys_FileManager.getFootprintFileByFootprintUuid(a.footprintUuid,lib))};}return out;
