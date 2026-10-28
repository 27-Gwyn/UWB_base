const out={};for(const id of ['C25804','C25803','C25808','C23179','C22962','C81598'])out[id]=await eda.lib_Device.getByLcscIds(id,undefined,true);
for(const k of ['TS-1187A-B-A-B','BLM18AG601SN1D','GRM1555C1H2R0CA01D','GRM155R71C104KA88D','8Y38472012','C0603 10pF'])out[k]=await eda.lib_Device.search(k,undefined,undefined,undefined,4,1);return out;
