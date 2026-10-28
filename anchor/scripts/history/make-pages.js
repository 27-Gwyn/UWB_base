const p=await eda.dmt_Project.getCurrentProjectInfo();if(p?.uuid!=='2ceff1de2cdb41d6a9101840f44c2b87')throw Error('Wrong project');
const s='fff8ecc88c1d6f03';
const b=await eda.dmt_Board.getBoardInfo('Anchor');if(b?.uuid!=='972ce89fb0e827ad'||b.schematic.uuid!==s)throw Error('Wrong board/schematic');
const records=[];let pages=await eda.dmt_Schematic.getAllSchematicPagesInfo();
if(pages.find(p=>p.uuid==='a2ae37ea91715ac4')?.name.toLowerCase()==='p1')records.push({renamed:await eda.dmt_Schematic.modifySchematicPageName('a2ae37ea91715ac4','02_ESP32S3')});
for(const name of ['00_OVERVIEW','01_POWER_USB','03_DW3220','04_RF_ANTENNA','05_DEBUG_TEST']){let found=pages.find(p=>p.parentSchematicUuid===s&&p.name.toUpperCase()===name);if(!found){const id=await eda.dmt_Schematic.createSchematicPage(s);if(!id)throw Error('Page create failed');records.push({pageUuid:id,name});if(!await eda.dmt_Schematic.modifySchematicPageName(id,name))throw Error('Page name failed');}}
return {records,pages:await eda.dmt_Schematic.getAllSchematicPagesInfo()};
