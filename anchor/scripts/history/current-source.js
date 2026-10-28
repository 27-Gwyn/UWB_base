// COMMON
return {source:await eda.sys_FileManager.getDocumentSource(),wires:await eda.sch_PrimitiveWire.getAll(),components:await eda.sch_PrimitiveComponent.getAll(),portPins:await Promise.all(comps.filter(c=>['netport','netflag'].includes(c.getState_ComponentType())).slice(0,4).map(async c=>({c,pins:await c.getAllPins()})))};
