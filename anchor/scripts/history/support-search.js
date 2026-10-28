const out={};for(const k of ['C14663','C15850','C15849','C21190','C2286','C117030','C124376','C23186','C25190','C7519'])out[k]=await eda.lib_Device.getByLcscIds(k,undefined,true);
for(const k of ['8Y38472012','Res_0603','Cap_0603','22uF 10V tantalum','1x04 2.54','TestPoint'])out[k]=await eda.lib_Device.search(k,undefined,undefined,undefined,6,1);return out;
