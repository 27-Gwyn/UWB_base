const p=await eda.dmt_Project.getCurrentProjectInfo();
const d=await eda.dmt_SelectControl.getCurrentDocumentInfo();
if(p?.uuid!=='2ceff1de2cdb41d6a9101840f44c2b87'||d?.uuid!=='a2ae37ea91715ac4')throw Error('Target changed');
return {components:await eda.sch_PrimitiveComponent.getAll(),wires:await eda.sch_PrimitiveWire.getAll(),parts:Object.fromEntries(await Promise.all(['ESP32-S3-WROOM-1-N16R8','DW3220','AMS1117-3.3','USBLC6-2SC6'].map(async k=>[k,await eda.lib_Device.search(k,undefined,undefined,undefined,10,1)])))};
