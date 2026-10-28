const out={};async function pack(f){if(!f)return {error:'undefined'};const a=new Uint8Array(await f.arrayBuffer());let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.slice(i,i+8192));return {name:f.name,size:f.size,data:btoa(s)}}
for(const [k,fn] of [['project',()=>eda.sys_FileManager.getProjectFile('UWB_Anchor_DRAFT','', 'epro2')],['bom',()=>eda.sch_ManufactureData.getBomFile('Anchor_actual','csv')]]){try{out[k]=await pack(await fn());}catch(e){out[k]={error:String(e)}}}
return out;
