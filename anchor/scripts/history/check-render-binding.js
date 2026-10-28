// COMMON
const d=await eda.dmt_SelectControl.getCurrentDocumentInfo();const activated=await eda.dmt_EditorControl.activateDocument(d.tabId);const bounds=await eda.dmt_EditorControl.zoomToAllPrimitives(d.tabId);await new Promise(r=>setTimeout(r,800));
const f=await eda.dmt_EditorControl.getCurrentRenderedAreaImage(d.tabId);const a=new Uint8Array(await f.arrayBuffer());let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.slice(i,i+8192));return {d,activated,bounds,data:btoa(s)};
