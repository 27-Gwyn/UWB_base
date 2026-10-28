await eda.dmt_EditorControl.zoomToRegion(350,1140,1040,420);
await new Promise(r=>setTimeout(r,600));
const f=await eda.dmt_EditorControl.getCurrentRenderedAreaImage();const a=new Uint8Array(await f.arrayBuffer());let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.slice(i,i+8192));
return {data:btoa(s),source:await eda.sys_FileManager.getDocumentSource(),components:await eda.sch_PrimitiveComponent.getAll(),drc:await eda.sch_Drc.check(true,false,true)};
