export function parseCommand(raw) {
  const trimmed=raw.trim();
  if (!trimmed) return {name:'',args:''};
  const match=trimmed.match(/^(\S+)(?:\s+([\s\S]*))?$/);
  return {name:match[1].toLowerCase(),args:match[2]||''};
}
export function createRegistry(config) {
  const registry=[
    {name:'help',group:'Explore',description:'See commands and keyboard tips'},
    {name:'about',aliases:['whoami'],section:'about',group:'Explore',description:'A little about me'},
    {name:'experience',section:'experience',group:'Explore',description:'My professional journey'},
    {name:'projects',section:'projects',group:'Explore',description:'Selected projects and research'},
    {name:'project',group:'Explore',description:'Open a project detail',arguments:config.projects.map(p=>p.id)},
    {name:'skills',section:'skills',group:'Explore',description:'Languages, tools, and platforms'},
    {name:'education',section:'education',group:'Explore',description:'My academic foundations'},
    {name:'resume',section:'resume',group:'Connect',description:config.profile.resume?'Open or download my résumé':'Request my résumé by email'},
    {name:'contact',aliases:['links'],section:'contact',group:'Connect',description:'Get in touch'},
    {name:'email',group:'Connect',description:'Show my email address',link:`mailto:${config.profile.email}`},
    ...config.links.map(l=>({name:l.name.toLowerCase().replace(/\s+/g,''),group:'Connect',description:`Find me on ${l.name}`,link:l.url})),
    {name:'theme',group:'Terminal',description:'Choose Graphite, Paper, or system',arguments:['ls','set graphite','set paper','system']},
    {name:'history',group:'Terminal',description:'View session command history'},
    {name:'clear',group:'Terminal',description:'Clear the command transcript'},
    {name:'home',section:'home',group:'Terminal',description:'Back to the overview'},
  ];
  if (config.features.ascii) registry.push({name:'banner',group:'Terminal',description:'A little ASCII identity'});
  if (config.features.extras) registry.push({name:'extras',group:'Terminal',description:'A small terminal easter egg'});
  return registry;
}
export function findCommand(registry,name) {return registry.find(c=>c.name===name||c.aliases?.includes(name));}
export function suggestionsFor(registry,raw) {
  const value=raw.trimStart().toLowerCase();
  if(!value) return [];
  const names=registry.flatMap(c=>[c.name,...(c.aliases||[])]);
  const argumentOptions=registry.flatMap(c=>(c.arguments||[]).map(a=>`${c.name} ${a}`));
  return [...names,...argumentOptions].filter(n=>n.startsWith(value)&&n!==value).slice(0,6);
}
export class CommandHistory {
  constructor(limit=100){this.items=[];this.limit=limit;this.index=0;this.draft='';}
  push(value){this.items.push(value);if(this.items.length>this.limit)this.items.shift();this.index=this.items.length;this.draft='';}
  move(direction,current){
    if(this.index===this.items.length)this.draft=current;
    this.index=Math.max(0,Math.min(this.items.length,this.index+direction));
    return this.index===this.items.length?this.draft:this.items[this.index];
  }
}
