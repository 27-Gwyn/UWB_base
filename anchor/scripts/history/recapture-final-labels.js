// COMMON
const out={};for(const [row,col] of [[2,2],[2,4]]){
const requested={left:1655*col/6,right:1655*(col+1)/6,top:1170*(1-row/4),bottom:1170*(1-(row+1)/4)};
if(!await eda.dmt_EditorControl.zoomToRegion(requested.left,requested.right,requested.top,requested.bottom))throw Error('Zoom failed');
await new Promise(r=>setTimeout(r,1000));
const f=await eda.dmt_EditorControl.getCurrentRenderedAreaImage();const a=new Uint8Array(await f.arrayBuffer());let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.slice(i,i+8192));out[row+'_'+col]={requested,viewportMapping:'settled native viewport',data:btoa(s)};
}return out;
