import fs from 'node:fs';
const [jsPath, outPath] = process.argv.slice(2);
const response = await fetch('http://127.0.0.1:49620/execute', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:fs.readFileSync(jsPath,'utf8')})});
const body = await response.json();
fs.writeFileSync(outPath,JSON.stringify(body,null,2));
console.log(process.argv.includes('--quiet') ? JSON.stringify({success:body.success,error:body.error,keys:Object.keys(body.result||{}),saved:outPath}) : JSON.stringify(body));
