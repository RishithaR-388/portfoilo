import {readFile, writeFile, mkdir, cp, rm, access, rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import config from '../terminal-config.js';
import {renderPage, validateConfig} from './page.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
validateConfig(config);
if (config.profile.resume && !config.profile.resume.startsWith('https://')) await access(path.join(root,config.profile.resume));
const html = renderPage(config);
if (process.argv.includes('--check')) {
  if (await readFile(path.join(root,'index.html'),'utf8') !== html) throw new Error('Generated index.html is stale. Run npm run build.');
  console.log('Generated HTML matches the configuration.');
} else {
  await writeFile(path.join(root,'index.html'),html);
  await rm(path.join(root,'.dist-stage'),{recursive:true,force:true});
  await mkdir(path.join(root,'.dist-stage'),{recursive:true});
  for (const item of ['index.html','terminal-config.js','LICENSE','assets','css','js']) {
    await cp(path.join(root,item),path.join(root,'.dist-stage',item),{recursive:true,filter: source => !/\.pdf$/i.test(source) && !/style_(?:lila|midnight|chocolate|bluescreen|og|rainbow|olive|orange)\.css$|caret\.js$|utils\.cjs$|utils\.js$|ascii_banner\.js$|\.test\.js$/.test(source)});
  }
  await rm(path.join(root,'dist'),{recursive:true,force:true});
  await rename(path.join(root,'.dist-stage'),path.join(root,'dist'));
  console.log('Built index.html and runtime-only dist/.');
}
