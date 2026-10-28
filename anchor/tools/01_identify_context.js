const version = eda.sys_Environment.getEditorCurrentVersion();
const project = await eda.dmt_Project.getCurrentProjectInfo();
const schematic = await eda.dmt_Schematic.getCurrentSchematicInfo();
const page = await eda.dmt_Schematic.getCurrentSchematicPageInfo();
const pages = schematic
    ? await eda.dmt_Schematic.getCurrentSchematicAllSchematicPagesInfo()
    : [];
return {
    purpose: "read_only_context_identification",
    version,
    project: project ?? null,
    schematic: schematic ?? null,
    page: page ?? null,
    pages,
    schematicCreatedByThisScript: false,
    designChecksRunByThisScript: false
};
