const project=await eda.dmt_Project.getCurrentProjectInfo(),document=await eda.dmt_SelectControl.getCurrentDocumentInfo();
if(project?.uuid!=='2ceff1de2cdb41d6a9101840f44c2b87'||document?.uuid!=='a2ae37ea91715ac4')throw Error('Target is not focused; no mutation');
const f=await eda.sch_ManufactureData.getNetlistFile('Anchor_resume_actual','JLCEDA');
const bounds=await eda.dmt_EditorControl.zoomToAllPrimitives();await new Promise(r=>setTimeout(r,500));
const im=await eda.dmt_EditorControl.getCurrentRenderedAreaImage();const a=new Uint8Array(await im.arrayBuffer());let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.slice(i,i+8192));
return {projectUuid:project.uuid,document,bounds,netlist:await f.text(),source:await eda.sys_FileManager.getDocumentSource(),components:await eda.sch_PrimitiveComponent.getAll(),wires:await eda.sch_PrimitiveWire.getAll(),image:btoa(s)};
