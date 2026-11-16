import config from '../terminal-config.js';
import {createRegistry,parseCommand,findCommand,suggestionsFor,CommandHistory} from './commands.js';
import {element,safeLink,createTranscript,renderHelp} from './render.js';
import {themeController,themes} from './theme.js';
import {fetchRepos} from './github.js';

const input=document.querySelector('#command-input');
const form=document.querySelector('#command-form');
const suggestions=document.querySelector('#suggestions');
const status=document.querySelector('#live-status');
const panel=document.querySelector('#transcript-panel');
const transcript=createTranscript(document.querySelector('#transcript'),panel,document.querySelector('#transcript-count'));
const registry=createRegistry(config), history=new CommandHistory();
let composing=false, clipboardTimer, resumeAvailable=Boolean(config.profile.resume);
function announce(message){status.textContent=message;}
function navigate(id,update=true,focus=true){
  const section=document.getElementById(id);
  if(!section)return false;
  if(section.matches('.project-card'))section.querySelector('details').open=true;
  if(update&&location.hash!==`#${id}`)window.history.pushState(null,'',`#${id}`);
  const heading=id==='main'?section:section.querySelector('h2,h1,h3')||section;
  if(focus){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||!config.features.motion;
  section.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
  document.querySelectorAll('nav a').forEach(a=>{
    if(a.hash===`#${id}`||(id.startsWith('project-')&&a.hash==='#projects'))a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
  });
  return true;
}
function updateSuggestions(){
  suggestions.replaceChildren();
  const options=suggestionsFor(registry,input.value);
  suggestions.hidden=!options.length;
  options.forEach(option=>{const button=element('button',option);button.type='button';button.addEventListener('click',()=>{input.value=option;suggestions.hidden=true;input.focus();});suggestions.append(button);});
}
function message(entry,text){entry.append(element('p',text));}
export function run(raw){
  if(raw.length>240){announce('Commands are limited to 240 characters.');return;}
  const {name,args}=parseCommand(raw);if(!name)return;
  history.push(raw);input.value='';suggestions.hidden=true;
  if(name==='clear'){transcript.clear();announce('Transcript cleared. Portfolio content is unchanged.');return;}
  const entry=transcript.add(raw), command=findCommand(registry,name);
  if(!command){const options=suggestionsFor(registry,name.slice(0,2));message(entry,`Command not found: ${name}. ${options.length?`Try ${options[0]} or help.`:'Type help to see available commands.'}`);announce('Command not found. Try help.');return;}
  if(command.section){
    navigate(command.section);message(entry,`Opened ${command.section==='home'?'the overview':command.section}.`);
    if(command.name==='resume'&&!resumeAvailable){message(entry,config.profile.resume?'The PDF is temporarily unavailable. Please email me for a copy.':'My résumé is available on request. Please email me for a copy.');entry.append(safeLink(config.profile.email,`mailto:${config.profile.email}`));}
    else if(command.name==='resume'){entry.append(safeLink('Open résumé (PDF)',config.profile.resume),document.createTextNode(' · '));const download=safeLink('Download résumé',config.profile.resume);download.setAttribute('download','');entry.append(download);}
  }else if(command.link){entry.append(safeLink(command.name==='email'?config.profile.email:`Open ${command.name} ↗`,command.link));}
  else switch(command.name){
    case 'help':renderHelp(entry,registry,run);break;
    case 'project':{
      const project=config.projects.find(p=>p.id===args.trim().toLowerCase());
      if(project){navigate(`project-${project.id}`);message(entry,`Opened ${project.subtitle}.`);}else message(entry,`Choose a project: ${config.projects.map(p=>`project ${p.id}`).join(' · ')}`);break;
    }
    case 'theme':{
      const words=args.toLowerCase().trim().split(/\s+/);
      if(words[0]==='ls')message(entry,`Available themes: ${themes.join(', ')}. Current selection: ${themeController.get()}.`);
      else if(words[0]==='system'&&words.length===1){themeController.set('system');message(entry,'Theme follows your system preference.');}
      else if(words[0]==='set'&&words.length===2&&themeController.set(words[1]))message(entry,`Theme set to ${words[1]}.`);
      else message(entry,'Try theme ls, theme set graphite, theme set paper, or theme system.');break;
    }
    case 'history':history.items.forEach((item,i)=>message(entry,`${i+1}  ${item}`));break;
    case 'banner':entry.append(element('pre',`┌────────────────────┐\n│  ${config.profile.name.padEnd(18)}│\n│  backend · data    │\n└────────────────────┘`));break;
    case 'extras':message(entry,'sudo make coffee → A good idea. Sadly, this terminal only serves portfolio content.');break;
  }
  announce(`${command.name} command completed.`);
}
form.addEventListener('submit',event=>{event.preventDefault();if(!composing)run(input.value);});
input.addEventListener('compositionstart',()=>{composing=true;});
input.addEventListener('compositionend',()=>{composing=false;updateSuggestions();});
input.addEventListener('input',()=>{if(!composing)updateSuggestions();});
input.addEventListener('keydown',event=>{
  if(event.isComposing||composing)return;
  if(event.key==='ArrowUp'||event.key==='ArrowDown'){event.preventDefault();input.value=history.move(event.key==='ArrowUp'?-1:1,input.value);suggestions.hidden=true;}
  if(event.key==='Escape')suggestions.hidden=true;
  if(event.altKey&&event.key==='ArrowRight'){
    const first=suggestionsFor(registry,input.value)[0];if(first){event.preventDefault();input.value=first;updateSuggestions();}
  }
});
document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>run(button.dataset.command)));
document.addEventListener('click',event=>{
  const anchor=event.target.closest('a[href^="#"]');
  if(!anchor||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const id=anchor.getAttribute('href').slice(1);
  if(!document.getElementById(id))return;
  event.preventDefault();
  if(anchor.classList.contains('back-project'))anchor.closest('details').open=false;
  navigate(id);
});
window.addEventListener('popstate',()=>{const id=decodeHash();navigate(document.getElementById(id)?id:'home',false);});
window.addEventListener('hashchange',()=>{const id=decodeHash();if(document.getElementById(id))navigate(id,false);});
function decodeHash(){try{return decodeURIComponent(location.hash.slice(1));}catch{return '';}}
const initial=decodeHash();if(initial)requestAnimationFrame(()=>navigate(document.getElementById(initial)?initial:'home',false,false));

const copy=document.querySelector('#copy-email');
copy.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(config.profile.email);copy.textContent='Copied ✓';announce('Email address copied.');}
  catch{copy.textContent='Select email to copy';announce('Clipboard unavailable. Select the email address and copy it manually.');}
  clearTimeout(clipboardTimer);clipboardTimer=setTimeout(()=>{copy.textContent='Copy email';},3000);
});
const extras=document.querySelector('.github-extra');let loading=false,loaded=false;
async function loadGithub(){
  if(loading||loaded)return;loading=true;
  const box=document.querySelector('#github-repos');box.replaceChildren(element('p','Loading public repositories…'));box.setAttribute('aria-busy','true');
  try{
    const repos=await fetchRepos(config.profile.githubUsername);box.replaceChildren();
    if(!repos.length)box.append(element('p','No public repositories to display. The featured projects above are still available.'));
    else{const list=element('ul');repos.forEach(repo=>{const li=element('li');li.append(safeLink(repo.name,repo.html_url),element('p',repo.description));list.append(li);});box.append(list);}loaded=true;announce('GitHub repositories loaded.');
  }catch(error){
    const text=error.name==='AbortError'?'GitHub took too long to respond.':error.message;
    const button=element('button','Try again');button.type='button';button.addEventListener('click',loadGithub);box.replaceChildren(element('p',`${text} Your featured projects are available above.`),button);announce('GitHub unavailable. Featured projects remain available.');
  }finally{loading=false;box.removeAttribute('aria-busy');}
}
extras?.addEventListener('toggle',()=>{if(extras.open)loadGithub();});
document.querySelectorAll('[data-enhance]').forEach(node=>{node.hidden=false;});

// A missing asset should not leave an unexplained dead download action.
if (config.profile.resume) fetch(config.profile.resume,{method:'HEAD'}).then(response=>{
  if(response.ok)return;
  resumeAvailable=false;
  document.querySelectorAll('a').forEach(link=>{
    if(link.getAttribute('href')===config.profile.resume){
      link.removeAttribute('href');link.setAttribute('aria-disabled','true');link.title='PDF temporarily unavailable. Please email me for a copy.';
    }
  });
  document.querySelector('.resume-actions').append(element('p','PDF temporarily unavailable. Email me for a copy.'));
}).catch(()=>{/* Keep native links usable when only the HEAD request is blocked. */});
