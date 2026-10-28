import json,pathlib
p=pathlib.Path(__file__).parent
original=json.loads((p/'placed.json').read_text(encoding='utf-8'))['result']['placed']
metadata={r['component']['designator']:{'supplierId':r['component']['supplierId'],'otherProperty':r['component']['otherProperty']} for r in original}
script='const original='+json.dumps(metadata,ensure_ascii=False)+';\n'
script+='''for(const c of await eda.sch_PrimitiveComponent.getAll()){
const ref=c.getState_Designator();if(!original[ref])continue;
const a=c.toAsync();a.setState_SupplierId(original[ref].supplierId);a.setState_OtherProperty(original[ref].otherProperty);if(ref==='D1')a.setState_Name('RED');await a.done();
}
return {components:await eda.sch_PrimitiveComponent.getAll()};'''
(p/'repair_metadata.js').write_text(script,encoding='utf-8')
