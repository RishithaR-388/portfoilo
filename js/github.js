const TTL=10*60*1000;
export function sanitizeRepos(data) {
  if(!Array.isArray(data))throw new Error('Invalid GitHub response');
  return data.filter(r=>typeof r.name==='string'&&typeof r.html_url==='string'&&/^https:\/\/github\.com\//.test(r.html_url)&&!r.fork).slice(0,4).map(r=>({name:r.name.slice(0,120),description:typeof r.description==='string'?r.description.slice(0,300):'No description provided.',html_url:r.html_url}));
}
export async function fetchRepos(user,{fetcher=fetch,storage,now=Date.now(),signal}={}) {
  const key=`portfolio-repos-${user}`;
  try{storage??=sessionStorage;const cached=JSON.parse(storage.getItem(key));if(cached&&Number.isFinite(cached.time)&&now>=cached.time&&now-cached.time<TTL)return sanitizeRepos(cached.repos);}catch{/* Fetch fresh data. */}
  const controller=new AbortController();
  const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});
  const timeout=setTimeout(abort,7000);
  try{
    const response=await fetcher(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=30`,{signal:controller.signal});
    if(!response.ok)throw new Error(response.status===403||response.status===429?'GitHub is limiting requests. Please try again later.':'GitHub repositories could not be loaded.');
    const repos=sanitizeRepos(await response.json());
    try{storage?.setItem(key,JSON.stringify({time:now,repos}));}catch{/* Optional cache. */}
    return repos;
  }finally{clearTimeout(timeout);signal?.removeEventListener('abort',abort);}
}
