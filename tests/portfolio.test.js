// @vitest-environment jsdom
import {describe,it,expect,vi,afterEach} from 'vitest';
import config from '../terminal-config.js';
import {parseCommand,createRegistry,findCommand,suggestionsFor,CommandHistory} from '../js/commands.js';
import {element,safeLink,createTranscript} from '../js/render.js';
import {fetchRepos,sanitizeRepos} from '../js/github.js';
import {validateConfig,renderPage} from '../scripts/page.mjs';
afterEach(()=>vi.restoreAllMocks());
describe('command behavior',()=>{
 const registry=createRegistry(config);
 it('normalizes only the command name and handles whitespace',()=>{expect(parseCommand('  PROJECT   Mixed Case  ')).toEqual({name:'project',args:'Mixed Case'});expect(parseCommand('  ')).toEqual({name:'',args:''});});
 it('resolves aliases and completes arguments from the registry',()=>{expect(findCommand(registry,'whoami').section).toBe('about');expect(suggestionsFor(registry,'project rec')).toEqual(['project recommendations']);expect(suggestionsFor(registry,'theme set p')).toEqual(['theme set paper']);});
 it('restores the input draft after browsing bounded history',()=>{const h=new CommandHistory(2);h.push('one');h.push('two');h.push('three');expect(h.items).toEqual(['two','three']);expect(h.move(-1,'unfinished')).toBe('three');expect(h.move(-1,'three')).toBe('two');expect(h.move(1,'two')).toBe('three');expect(h.move(1,'three')).toBe('unfinished');});
});
describe('safe content and transcript lifecycle',()=>{
 it('renders markup as text and rejects unsafe links',()=>{const p=element('p','<img src=x onerror=alert(1)>');expect(p.querySelector('img')).toBeNull();expect(p.textContent).toContain('<img');expect(safeLink('bad','javascript:alert(1)').tagName).toBe('SPAN');});
 it('bounds entries and clears synchronously without queued output',async()=>{const box=element('div'),panel=element('details'),count=element('span');const t=createTranscript(box,panel,count,2);t.add('1');t.add('2');t.add('<script>');expect(box.children).toHaveLength(2);expect(box.querySelector('script')).toBeNull();t.clear();await Promise.resolve();expect(box.children).toHaveLength(0);expect(count.textContent).toBe('0');expect(panel.open).toBe(false);});
});
describe('GitHub resilience',()=>{
 const row={name:'repo',html_url:'https://github.com/name/repo',description:'<b>text</b>'};
 it('rejects invalid responses and filters unsafe destinations and forks',()=>{expect(()=>sanitizeRepos({})).toThrow();expect(sanitizeRepos([row,{...row,html_url:'javascript:alert(1)'},{...row,fork:true}])).toEqual([row]);});
 it('handles rate limiting',async()=>{await expect(fetchRepos('someone',{fetcher:vi.fn().mockResolvedValue({ok:false,status:403}),storage:{getItem:()=>null}})).rejects.toThrow('limiting');});
 it('uses valid unexpired cache and survives blocked storage',async()=>{const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>[row]});expect(await fetchRepos('someone',{fetcher,now:1000,storage:{getItem:()=>JSON.stringify({time:900,repos:[row]})}})).toEqual([row]);expect(fetcher).not.toHaveBeenCalled();expect(await fetchRepos('someone',{fetcher,storage:{getItem:()=>{throw Error();},setItem:()=>{throw Error();}}})).toEqual([row]);});
});
describe('configuration and static document',()=>{
 it('validates config and rejects malformed IDs and links',()=>{expect(()=>validateConfig(config)).not.toThrow();expect(()=>validateConfig({...config,projects:[...config.projects,config.projects[0]]})).toThrow();expect(()=>validateConfig({...config,links:[{url:'javascript:alert(1)'}]})).toThrow();});
 it('includes accessible semantic content without scripts and escapes configured copy',()=>{document.documentElement.innerHTML=renderPage({...config,profile:{...config.profile,name:'<script>unsafe</script>'}});expect(document.querySelectorAll('h1')).toHaveLength(1);expect(document.querySelector('h1').textContent).toContain('<script>');expect(document.querySelector('#experience').textContent).toContain('Visa');const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);expect(new Set(ids).size).toBe(ids.length);});
});

describe('additional failure states',()=>{
 it('handles empty GitHub accounts',async()=>{expect(await fetchRepos('empty',{fetcher:vi.fn().mockResolvedValue({ok:true,json:async()=>[]}),storage:{getItem:()=>null,setItem:()=>{}}})).toEqual([]);});
 it('times out stalled GitHub requests',async()=>{
  vi.useFakeTimers();
  const fetcher=vi.fn((_url,{signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')))));
  const result=fetchRepos('slow',{fetcher,storage:{getItem:()=>null}});
  const assertion=expect(result).rejects.toThrow('Aborted');await vi.advanceTimersByTimeAsync(7000);await assertion;vi.useRealTimers();
 });
});
