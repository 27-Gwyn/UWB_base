// COMMON
const requested={left:0,right:1655/6,top:1170*3/4,bottom:1170/2};
const zoomed=await eda.dmt_EditorControl.zoomToRegion(requested.left,requested.right,requested.top,requested.bottom);
await new Promise(r=>setTimeout(r,1000));
if(!zoomed)throw Error('Zoom failed');
const f=await eda.dmt_EditorControl.getCurrentRenderedAreaImage();const a=new Uint8Array(await f.arrayBuffer());let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.slice(i,i+8192));
return {'1_0':{requested,zoomed,viewportMapping:'center crop after settled native viewport',data:btoa(s)}};
