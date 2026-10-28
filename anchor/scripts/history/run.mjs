import fs from 'node:fs';
const [script,out] = process.argv.slice(2);
const source=fs.readFileSync(script,'utf8');
const code=source.startsWith('// COMMON')?fs.readFileSync(new URL('./common.js',import.meta.url),'utf8')+'\n'+source:source;
const r=await fetch('http://127.0.0.1:49620/execute',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,windowId:'e3618554-b319-4aac-a46c-b9169094be03'})});
const b=await r.json();fs.writeFileSync(out,JSON.stringify(b,null,2));
console.log(JSON.stringify({success:b.success,error:b.error,keys:Object.keys(b.result||{}),saved:out}));
