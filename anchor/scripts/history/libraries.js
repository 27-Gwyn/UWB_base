const lib='0819f05c4eef4c71ace90d822a990e87';
const ids={ESP:'701a1177d7184d1bbf7f86d69d9385c2',DW:'ded2baa611094d329d161b961a5b1aeb',AMS:'9f9c6cb41c7449fd8acf96aceed2661a'};
const out={};for(const [k,id] of Object.entries(ids)){const d=await eda.lib_Device.get(id,lib);out[k]={device:d,symbol:await eda.lib_Symbol.get(d.symbolUuid,lib),footprint:await eda.lib_Footprint.get(d.footprintUuid,lib)}}
out.extra={};for(const k of ['USBLC6-2SC6','TYPE-C-31-M-12','38.4MHz'])out.extra[k]=await eda.lib_Device.search(k,undefined,undefined,undefined,20,1);
return out;
