export function element(tag,text,className) {
  const node=document.createElement(tag);
  if(text!==undefined)node.textContent=text;
  if(className)node.className=className;
  return node;
}
export function safeLink(label,url) {
  const link=element('a',label);
  if(!/^(https:\/\/|mailto:|assets\/)/.test(url||'')) return element('span',label);
  link.setAttribute('href',url);
  if(url.startsWith('https://')||url.startsWith('assets/')) {link.target='_blank';link.rel='noopener noreferrer';}
  return link;
}
export function createTranscript(container,panel,count,limit=30) {
  function add(raw) {
    const wasNearBottom=container.scrollHeight-container.scrollTop-container.clientHeight<50;
    const entry=element('div',undefined,'command-entry');
    entry.append(element('p',`$ ${raw}`));container.append(entry);
    while(container.children.length>limit)container.firstElementChild.remove();
    count.textContent=String(container.children.length);
    panel.open=true;
    if(wasNearBottom)container.scrollTop=container.scrollHeight;
    return entry;
  }
  function clear(){container.replaceChildren();count.textContent='0';panel.open=false;}
  return {add,clear};
}
export function renderHelp(entry,registry,run) {
  entry.append(element('p','Explore by clicking a command or typing it. This terminal navigates the website; it does not execute shell commands.'));
  for(const group of ['Explore','Connect','Terminal']) {
    entry.append(element('h3',group));const list=element('ul',undefined,'help-list');
    registry.filter(c=>c.group===group).forEach(c=>{
      const item=element('li'),button=element('button',c.name+(c.aliases?` / ${c.aliases.join(', ')}`:''));
      button.type='button';button.addEventListener('click',()=>run(c.name));
      item.append(button,element('span',` — ${c.description}`));list.append(item);
    });entry.append(list);
  }
  entry.append(element('p','Examples: project recommendations · theme set paper. Enter: run · ↑/↓: history · Alt+→: complete · Esc: dismiss suggestions. Tab always moves focus. History is kept only for this page session (last 100 commands); transcript keeps the last 30 entries.'));
}
