const f=await eda.sch_ManufactureData.getNetlistFile('Anchor_actual','JLCEDA');if(!f)throw Error('No netlist file');return {name:f.name,size:f.size,text:await f.text()};
