// COMMON
const out={};for(let row=0;row<1;row++)for(let col=0;col<6;col++){
const requested={left:1655*col/6,right:1655*(col+1)/6,top:1170*(1-row/4),bottom:1170*(1-(row+1)/4)};
await eda.dmt_EditorControl.zoomToRegion(requested.left,requested.right,requested.top,requested.bottom);await new Promise(r=>setTimeout(r,250));
const f=await eda.dmt_EditorControl.getCurrentRenderedAreaImage();const a=new Uint8Array(await f.arrayBuffer());let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.slice(i,i+8192));out[row+'_'+col]={requested,viewportMapping:'fit rectangle to native canvas; center crop calculated from image aspect ratio',data:btoa(s)};
}return out;
