import { useState, useRef, useEffect } from "react";

const RED="#E4002B",BLACK="#0A0A0A",DARK="#141414",PANEL="#1C1C1C",SURF="#252525",BDR="#2E2E2E";
const W="#FFFFFF",AM="#FFB300",BL="#4FC3F7",GN="#00C853";
const MF="claude-haiku-4-5-20251001",MQ="claude-sonnet-4-20250514";

// Validated product URLs — all link to specific product pages (not collections or homepages)
const PRODS={
  "NQiX 1000":"https://global.niu.com/product/NQiX-1000",
  "NQiX 500":"https://global.niu.com/product/NQiX-500",
  "NQiX 300":"https://global.niu.com/product/NQiX-300",
  "NQiX 150":"https://global.niu.com/product/NQiX-150",
  "KQi3 Pro":"https://global.niu.com/product/KQi3-Pro",
  "KQi2 Pro":"https://global.niu.com/product/KQi2-Pro",
  "KQi1 Pro":"https://global.niu.com/product/KQi1-Pro",
  "NQiX":"https://global.niu.com/product/NQiX-150",
  "NQi":"https://global.niu.com/product/NQi-GT",
  "MQiX":"https://global.niu.com/product/MQiX",
  "MQi":"https://global.niu.com/product/MQi-GT",
  "UQi":"https://global.niu.com/product/UQi-GT-Pro",
  "RQi":"https://global.niu.com/product/RQi-C1",
  "SQi":"https://global.niu.com/product/SQi",
  "KQi3":"https://global.niu.com/product/KQi3-Pro",
  "KQi2":"https://global.niu.com/product/KQi2-Pro",
  "KQi1":"https://global.niu.com/product/KQi1-Pro",
};
// Safe NIU internal links — only pages confirmed to exist
const NIU_LINKS={
  blog:"https://global.niu.com/blogs/news",
  shop:"https://global.niu.com/collections/all",
  home:"https://global.niu.com",
  de:"https://global.niu.com/de",
  fr:"https://global.niu.com/fr",
  es:"https://global.niu.com/es",
  it:"https://global.niu.com/it",
};
const LP={de:"https://global.niu.com/de/product/",fr:"https://global.niu.com/fr/product/",es:"https://global.niu.com/es/product/",it:"https://global.niu.com/it/product/"};
const LANGS={de:{label:"German",code:"DE",color:"#3a7bd5",base:"https://global.niu.com/de",blogs:"https://global.niu.com/de/blogs"},fr:{label:"French",code:"FR",color:"#e84c4c",base:"https://global.niu.com/fr",blogs:"https://global.niu.com/fr/blogs"},es:{label:"Spanish",code:"ES",color:"#f5a623",base:"https://global.niu.com/es",blogs:"https://global.niu.com/es/blogs"},it:{label:"Italian",code:"IT",color:"#27ae60",base:"https://global.niu.com/it",blogs:"https://global.niu.com/it/blogs"}};
const SANITY_DATASET="production";
const SANITY_API_VERSION="2024-01-01";
const SANITY_LANG={en:"en",de:"de_DE",fr:"fr_FR",es:"es_ES",it:"it_IT"};
const VC={APPROVED:GN,REVIEW:AM,BLOCKED:RED};

const ALL_TOPICS=[
  {title:"Why Micromobility Is Winning the Urban Commute",angle:"Car ownership decline vs e-scooter adoption in European cities"},
  {title:"NIU KQi3 Pro: The Commuter's Honest Review",angle:"Real-world performance, range, ride quality for daily riders"},
  {title:"The True Cost of Commuting: E-Scooter vs Car vs Public Transport",angle:"Data-led cost comparison with cost-of-living context"},
  {title:"How Cities Are Building Around Micromobility",angle:"Bike lanes, scooter zones, infrastructure investment"},
  {title:"EV Battery Tech Explained: What Makes a Scooter Last Longer",angle:"Demystifying range and battery life"},
  {title:"The Rise of Last-Mile Delivery on Electric Scooters",angle:"How logistics is shifting to e-mobility"},
  {title:"10 Things Every New E-Scooter Rider Should Know",angle:"Safety and lifestyle guide for first-time NIU Crew members"},
  {title:"Sustainability and Urban Mobility: What the Numbers Say",angle:"IEA and BloombergNEF data on emissions reductions"},
  {title:"Riding Smart: How to Get the Most Range from Your NIU",angle:"Range optimisation, charging habits, maintenance tips"},
  {title:"Micromobility Regulation in Europe: What Riders Need to Know",angle:"Regulatory overview across key EU markets"},
  {title:"NIU NQiX 150: Everything You Need to Know",angle:"Full product deep-dive on NIU's flagship urban scooter"},
  {title:"How Electric Scooters Are Reducing Carbon Emissions in Cities",angle:"Quantified environmental impact vs cars and public transport"},
  {title:"The Best Urban Commuter Scooters of 2025",angle:"Comparison guide placing NIU models in the market context"},
  {title:"Smart Charging: How to Extend Your NIU Battery Life",angle:"Practical guide on charging habits, storage, and battery health"},
  {title:"E-Scooter Safety in 2025: Rules, Gear, and Best Practices",angle:"What every rider needs to know about staying safe"},
  {title:"NIU KQi2 Pro vs KQi3 Pro: Which Should You Buy?",angle:"Head-to-head comparison to help buyers choose"},
  {title:"How the Gig Economy Is Driving Demand for E-Scooters",angle:"Delivery riders, logistics fleets, and the shift to electric"},
  {title:"From Car to Scooter: Real Commuter Stories",angle:"Community-led stories of people switching to e-scooters"},
  {title:"How to Choose the Right E-Scooter for Your City",angle:"Buyer's guide matching rider needs to NIU model specs"},
  {title:"The Economics of Owning an E-Scooter vs a Car",angle:"5-year TCO breakdown including insurance, fuel, parking"},
  {title:"How Micromobility Is Transforming Last-Mile Logistics",angle:"Fleet solutions, delivery operators, and NIU's role"},
  {title:"Why Young Professionals Are Choosing Scooters Over Cars",angle:"Lifestyle trend piece targeting NIU's core demographic"},
  {title:"Electric Scooters and Public Transport: A Perfect Partnership",angle:"How e-scooters complement buses, trains, and metro networks"},
  {title:"The Future of Urban Transport: What 2030 Looks Like",angle:"Forward-looking trend piece on cities, EVs, and micromobility"},
  {title:"How to Commute Faster in Any City with an E-Scooter",angle:"Practical routing and time-saving tips for NIU riders"},
  {title:"Urban Heat Islands and the Case for Zero-Emission Commuting",angle:"Climate science meets urban transport"},
  {title:"NIU NQiX 1000: The Performance Scooter Reviewed",angle:"Deep-dive on NIU's most powerful model"},
  {title:"Scooter Sharing vs Owning: What Makes More Sense in 2025?",angle:"Cost and convenience analysis for urban riders"},
  {title:"How NIU Scooters Are Built: Quality, Design, and Innovation",angle:"Brand story focusing on engineering and manufacturing"},
  {title:"The Complete Guide to E-Scooter Insurance in Europe",angle:"What riders need to know about coverage across EU markets"},
];
const LENGTHS=["Short (~600 words)","Standard (~900 words)","Long-form (~1400 words)"];

// Token tracker
let TOK={input:0,output:0};
const tCbs=[];
function onTok(fn){tCbs.push(fn);}
function fireTok(){tCbs.forEach(fn=>{try{fn({...TOK});}catch(e){}});}

// Job queue
const JQ={running:false,queue:[],cbs:[]};
function onQ(fn){JQ.cbs.push(fn);}
function emitQ(m){JQ.cbs.forEach(fn=>{try{fn(m);}catch(e){}});}
async function processQ(){
  if(JQ.running||JQ.queue.length===0)return;
  JQ.running=true;
  while(JQ.queue.length>0){
    const job=JQ.queue[0];
    try{emitQ(job.label||"Processing...");const result=await rawCall(job.opts);job.resolve(result);JQ.queue.shift();}
    catch(e){
      if(e.message&&e.message.startsWith("RATE_LIMIT:")){
        const secs=parseInt(e.message.split(":")[2])||60;
        for(let s=secs;s>0;s-=10){emitQ("Rate limit — retrying in "+Math.ceil(s/60)+"m "+(s%60)+"s");await new Promise(r=>setTimeout(r,10000));}
        emitQ("Retrying...");await new Promise(r=>setTimeout(r,2000));
      }else{job.reject(e);JQ.queue.shift();}
    }
  }
  JQ.running=false;emitQ("");
}
function enqueue(opts){return new Promise((resolve,reject)=>{JQ.queue.push({opts,resolve,reject,label:opts.label});processQ();});}

async function rawCall(opts){
  const{model,system,maxTokens=5000,useSearch=false}=opts;
  let messages=opts.messages||[{role:"user",content:opts.userMsg||""}];
  const tools=useSearch?[{type:"web_search_20250305",name:"web_search"}]:undefined;
  for(let i=0;i<12;i++){
    const body={model,max_tokens:maxTokens,system,messages};
    if(tools)body.tools=tools;
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(res.status===429){const t=await res.text();const m=t.match(/"resets_at":(\d+)/);const w=m?Math.max(30,parseInt(m[1])-Math.floor(Date.now()/1000)+10):120;throw new Error("RATE_LIMIT:"+Math.ceil(w/60)+":"+w);}
    if(!res.ok){const t=await res.text();throw new Error("API "+res.status+": "+t);}
    const data=await res.json();
    if(data.error)throw new Error(data.error.message);
    if(data.usage){TOK.input+=data.usage.input_tokens||0;TOK.output+=data.usage.output_tokens||0;fireTok();}
    const content=data.content,stop=data.stop_reason;
    const texts=content.filter(b=>b.type==="text").map(b=>b.text);
    if(stop==="end_turn"||stop==="max_tokens"){
      let raw=texts.join("").trim().replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/```\s*$/,"").trim();
      try{return JSON.parse(raw);}catch(e1){}
      const fi=raw.indexOf("{");
      if(fi>0){const fb2=raw.slice(fi);try{return JSON.parse(fb2);}catch(e2){const lc2=fb2.lastIndexOf("}");if(lc2!==-1){try{return JSON.parse(fb2.slice(0,lc2+1));}catch(e3){}}}}
      const lc=raw.lastIndexOf("}");
      if(lc!==-1){try{return JSON.parse(raw.slice(0,lc+1));}catch(e4){}}
      if(stop==="max_tokens"&&maxTokens<16000){
        emitQ("Response truncated — retrying with larger budget...");
        const body2={model,max_tokens:Math.min(16000,maxTokens*2),system,messages};
        if(tools)body2.tools=tools;
        const res2=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body2)});
        if(res2.ok){
          const d2=await res2.json();
          if(d2.usage){TOK.input+=d2.usage.input_tokens||0;TOK.output+=d2.usage.output_tokens||0;fireTok();}
          const t2=(d2.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim().replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/```\s*$/,"").trim();
          try{return JSON.parse(t2);}catch(e5){}
          const f2=t2.indexOf("{");
          if(f2>=0){try{return JSON.parse(t2.slice(f2));}catch(e6){const l2=t2.lastIndexOf("}");if(l2!==-1){try{return JSON.parse(t2.slice(f2,l2+1));}catch(e7){}}}}
        }
      }
      throw new Error("JSON parse failed: "+raw.slice(0,200));
    }
    if(stop==="tool_use"){
      messages=[...messages,{role:"assistant",content},{role:"user",content:content.filter(b=>b.type==="tool_use").map(b=>({type:"tool_result",tool_use_id:b.id,content:"Search: "+JSON.stringify(b.input)}))}];
      continue;
    }
    if(texts.length>0){try{return JSON.parse(texts.join("").trim());}catch(e){}}
    throw new Error("Unexpected stop: "+stop);
  }
  throw new Error("Loop limit");
}

// Sanity helpers
function slugify(str){return(str||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function mdToPortableText(md){
  if(!md)return[];
  const blocks=[];
  const lines=md.split("\n");
  let i=0;
  while(i<lines.length){
    const line=lines[i];
    if(!line.trim()){i++;continue;}
    const h3m=line.match(/^### (.+)$/);const h2m=line.match(/^## (.+)$/);const h1m=line.match(/^# (.+)$/);
    if(h3m||h2m||h1m){
      const text=(h3m||h2m||h1m)[1].replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1");
      blocks.push({_type:"block",_key:"b"+blocks.length,style:h3m?"h3":"h2",children:[{_type:"span",_key:"s0",text,marks:[]}],markDefs:[]});
      i++;continue;
    }
    if(line.match(/^- .+/)){
      while(i<lines.length&&lines[i].match(/^- .+/)){
        const text=lines[i].replace(/^- /,"").replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1");
        blocks.push({_type:"block",_key:"b"+blocks.length,style:"normal",listItem:"bullet",level:1,children:[{_type:"span",_key:"s0",text,marks:[]}],markDefs:[]});
        i++;
      }
      continue;
    }
    const paraLines=[];
    while(i<lines.length&&lines[i].trim()){paraLines.push(lines[i]);i++;}
    const text=paraLines.join(" ").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1");
    if(text.trim())blocks.push({_type:"block",_key:"b"+blocks.length,style:"normal",children:[{_type:"span",_key:"s0",text:text.trim(),marks:[]}],markDefs:[]});
  }
  return blocks;
}

// Sanity push — direct fetch (CORS must allow https://claude.ai with credentials)
async function pushToSanity(token,projectId,headline,article,metaDesc,langCode){
  if(!token||!token.trim())throw new Error("API token missing.");
  if(!projectId||!projectId.trim())throw new Error("Project ID missing. Enter it in the sidebar (e.g. abc123xy).");
  const pid=projectId.trim();
  if(pid.length<4||pid.includes(" ")||pid.startsWith("http")){
    throw new Error("Project ID looks incorrect: \""+pid+"\". It should be a short alphanumeric code like \"abc123xy\" — find yours at sanity.io/manage.");
  }
  const langId=SANITY_LANG[langCode]||"en";
  const slug=slugify(headline);
  const docId="drafts."+slug+"-"+langCode+"-"+Date.now();
  const doc={_id:docId,_type:"post",title:headline,slug:{_type:"slug",current:slug},language:langId,excerpt:metaDesc||"",body:mdToPortableText(article),publishedAt:null,status:"draft","__i18n_lang":langId};
  const endpoint="https://"+pid+".api.sanity.io/v"+SANITY_API_VERSION+"/data/mutate/"+SANITY_DATASET;
  let res;
  try{
    res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token.trim()},body:JSON.stringify({mutations:[{createOrReplace:doc}]})});
  }catch(fetchErr){
    throw new Error("Cannot reach Sanity ("+endpoint+"). Likely cause: Project ID \""+pid+"\" is wrong, or network blocked. Error: "+fetchErr.message);
  }
  if(!res.ok){
    let msg=res.statusText;
    try{const d=await res.json();msg=d.error?.description||d.message||JSON.stringify(d);}catch(e){}
    if(res.status===401||res.status===403)throw new Error("Auth failed ("+res.status+"). Token may lack write permissions.");
    if(res.status===404)throw new Error("Not found (404). Project ID \""+pid+"\" is likely incorrect.");
    throw new Error("Sanity "+res.status+": "+msg);
  }
  const data=await res.json();
  return{docId,slug,langId,results:data.results};
}

// Prompts
const PR_LITE=[
  "CRITICAL: Respond with ONLY a raw JSON object. No preamble. Start with { end with }.",
  "Senior SEO and GEO strategist for NIU Technologies (electric scooters, urban mobility).",
  "Generate keyword research. Requirements:",
  "- 8 seo_keywords minimum: AT LEAST 60% must be non-branded (no NIU product names). Mix of informational, commercial, transactional. Branded keywords (NIU, KQi, NQiX) must not exceed 40%.",
  "- 5 geo_phrases minimum: conversational, question-style or location-specific phrases suited for AI search (Perplexity, SearchGPT, voice search). Match the geographic scope of the topic — if the topic is global or product-focused, use broad phrases; only use city/region-specific phrases if the topic is explicitly geo-targeted.",
  "- 3 data_points: ONLY cite verifiable sources (IEA, BloombergNEF, Statista, McKinsey, EU Commission). URL must be a SPECIFIC article page (e.g. https://electrive.com/2024/01/15/niu-q3-results) — NEVER a homepage like https://statista.com or https://iea.org. Omit the data point entirely if you cannot provide a direct article URL.",
  "- 2 content_gaps, 1 trending_angle. Each keyword: suggested_section (intro|context|data_section|product_mention|subheading|conclusion), geo_region, branded (true/false).",
  '{"seo_keywords":[{"term":"s","intent":"informational|navigational|commercial|transactional","difficulty":"low|medium|high","geo_region":"EU|APAC|US|global","suggested_section":"s","branded":false}],"geo_phrases":["p1","p2","p3","p4","p5"],"data_points":[{"stat":"s","source":"s","year":2024,"url":"s"}],"content_gaps":["g1","g2"],"trending_angle":"s"}'
].join("\n");

const PR_FULL=[
  "CRITICAL: Respond with ONLY a raw JSON object. No preamble. Start with { end with }.",
  "You are a senior SEO strategist and research analyst for NIU Technologies (electric scooters, urban mobility).",
  "RESEARCH MANDATE — use web_search strategically (up to 6 searches total):",
  "1. YOUTUBE: Search YouTube for recent NIU-related videos (reviews, tests, comparisons). Include titles and channel names as yt_sources in your response.",
  "2. REGIONAL SEARCH: Search regional Google domains to capture local perspectives:",
  "   - German: search site:google.de OR site:1000ps.de OR site:elektroroller-tests.de for NIU reviews",
  "   - French: search site:lesnumeriques.com OR site:motomag.com for NIU content",
  "   - UK/Global: search for NIU reviews on whichev.net, autoexpress.co.uk, electrive.com",
  "3. REPUTABLE SOURCES ONLY: Prioritise electrive.com, insideevs.com, electricvehicleresearch.com, IEA, BloombergNEF, Statista, EU Commission for data.",
  "4. SPECIFIC URLS: Every data_point URL must be a direct article link (e.g. https://electrive.com/2024/01/15/niu-launches-...) — never a homepage.",
  "Requirements:",
  "- 8 seo_keywords minimum: 60%+ non-branded, max 40% branded. Include long-tail variants.",
  "- 5 geo_phrases minimum: conversational phrases for AI/voice search. Match the geographic scope of the topic — global scope for general topics, regional/city-level only when the topic is explicitly location-focused.",
  "- 3 data_points: verified sources only, direct article URL required — omit if URL is a homepage or unverifiable.",
  "- 2 content_gaps, 1 trending_angle, yt_sources array (YouTube video titles/channels found).",
  '{"seo_keywords":[{"term":"s","intent":"informational|navigational|commercial|transactional","difficulty":"low|medium|high","geo_region":"EU|APAC|US|global","suggested_section":"s","branded":false}],"geo_phrases":["p1","p2","p3","p4","p5"],"data_points":[{"stat":"s","source":"s","year":2024,"url":"https://specific-article-url.com/article-slug"}],"content_gaps":["g1","g2"],"trending_angle":"s","yt_sources":[{"title":"s","channel":"s","url":"s"}]}'
].join("\n");

const PW=[
  "CRITICAL: Respond with ONLY a raw JSON object. No preamble. Start with { end with }.",
  "Senior content writer for NIU Technologies blog (https://global.niu.com/blog).",
  "WRITING STYLE: Professional, authoritative, engaging. Human and natural — not corporate or stiff, never casual. Write like a knowledgeable journalist covering urban mobility.",
  "STRUCTURE: Strong hook. Clear logical flow. Format article title as ### H3. Use ## for section subheadings — headings should reflect the actual content and argument, not geographic locations unless the topic demands it. Forward-looking conclusion. Be concise — quality over length.",
  "TONE: Select the tone that best serves the article topic and editor notes. Analytical and data-led for research/statistics topics; confident and specific for product reviews and comparisons; warm and direct for community and lifestyle topics; authoritative and forward-looking for trend and industry pieces. Never apply a tone that conflicts with the subject matter.",
  "BRAND POLICY: Always position NIU Technologies positively and as the market leader in urban electric mobility. When other brands or competitors are mentioned, describe them neutrally or in comparison — never endorse, recommend, or favour competing products over NIU. If a comparison is made, NIU must come out favourably.",
  "SEO INTEGRATION MANDATORY: Every provided SEO keyword MUST appear verbatim at least once in its suggested_section. Minimum 3 integrated. Read naturally — never bolded or isolated.",
  "GEO PHRASES: Integrate provided GEO phrases naturally ONLY where they fit the topic and flow of the article. Do NOT force city or region references into articles that are not geographically focused. If the topic is a product review, technical guide, or brand story, weave GEO phrases in lightly or omit them — never use them as forced subheadings that break the narrative. Only use city/region references if they add genuine context or relevance to the article topic.",
  "IMPORTANT: headlines MUST be a JSON array []. Return exactly 5 headlines as an array.",
  "SOCIAL: Return linkedin (professional, thought-leadership, 3-4 sentences, no hashtags) and meta_captions (Facebook/Instagram, warm, 2-3 sentences, 2-3 hashtags).",
  "HYPERLINKS: 3-4 inline links. Allowed NIU links: https://global.niu.com (homepage), https://global.niu.com/blogs/news (blog index), https://global.niu.com/product/MODEL (specific product — use exact slugs like KQi3-Pro, NQiX-150, NQiX-500, NQiX-1000). BANNED: /collections/electric-scooters and any /collections/ path — these 404. External links: ONLY cite specific article pages (e.g. https://www.1000ps.de/testbericht-...) — never link to a homepage like https://1000ps.de/. If unsure of exact URL, omit the hyperlink entirely.",
  "DATA: ONLY cite real verifiable publications. Never fabricate statistics or URLs.",
  "Return keyword_map confirming placement.",
  '{"headlines":["headline 1","headline 2","headline 3","headline 4","headline 5"],"article":"full markdown article","meta":"max 155 chars","linkedin":["li1","li2","li3"],"meta_captions":["m1","m2","m3"],"keyword_map":{"term":"sentence"}}'
].join("\n");

const PE=[
  "CRITICAL: Respond with ONLY a raw JSON object. No preamble. Start with { end with }.",
  "NIU editorial compliance officer. Score blog (each /20, total /100): brand_safety, factual_accuracy, seo_quality, legal_regulatory, brand_tone. APPROVED>=85. REVIEW 60-84. BLOCKED<60.",
  '{"scores":{"brand_safety":0,"factual_accuracy":0,"seo_quality":0,"legal_regulatory":0,"brand_tone":0},"total":0,"verdict":"APPROVED|REVIEW|BLOCKED","verdict_reason":"s","flags":[{"severity":"info|warning|block","area":"s","detail":"s","suggestion":"s","suggested_edit":"s","action":"edit|delete|clarify"}],"editor_notes":"s"}'
].join("\n");

const PRV=[
  "CRITICAL: Respond with ONLY a raw JSON object. No preamble. Start with { end with }.",
  "NIU blog editor. Apply editor feedback precisely. Maintain brand tone and hyperlinks.",
  '{"headlines":[],"article":"markdown","meta":"s","captions":[],"revision_summary":"s"}'
].join("\n");

const PF=[
  "CRITICAL: Respond with ONLY a raw JSON object. No preamble. Start with { end with }.",
  "NIU blog editor. Apply ONE specific edit as instructed. SURGICAL EDIT: Make ONLY the described change. Preserve all markdown, headings, and hyperlinks. Return the complete revised article.",
  '{"article":"full revised markdown"}'
].join("\n");

function makeTrP(lang,du,attr,baseUrl,blogsUrl,productPrefix){
  return ["CRITICAL: Raw JSON only. No preamble. Start with { end with }.","Localisation writer for NIU Technologies. Translate to "+lang+". NOT word-for-word — write naturally.",du?"Use informal "+du+" form throughout.":"","Attribution: "+attr+". Vary phrasing naturally.","URL RULES: Replace https://global.niu.com with "+baseUrl+". Replace https://global.niu.com/product/ with "+productPrefix+".","SEO/GEO: Use keywords real "+lang+" speakers search for. Include city references for "+lang+" markets. Maintain min 3 SEO keywords and 3 GEO phrases.",'{"headline":"s","article":"markdown","meta":"s","captions":["s1","s2","s3"]}'].filter(Boolean).join("\n");
}

// Helpers
function addLinks(text){
  if(!text)return text;let r=text;
  // Apply product links (longest names first to avoid partial matches)
  Object.entries(PRODS).sort((a,b)=>b[0].length-a[0].length).forEach(([n,u])=>{
    const s=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    try{r=r.replace(new RegExp("(?<!\\[)(?<!/)(?<![\\w-])("+s+")(?![^\\[]*\\])(?![^(]*\\))","g"),"["+n+"]("+u+")");}catch(e){}
  });
  // Strip any /collections/ links — these 404 on the NIU site
  r=r.replace(/\[([^\]]+)\]\(https?:\/\/[^)]*\/collections\/[^)]*\)/g,"$1");
  // Strip bare homepage links (no path beyond domain)
  // Matches links like [text](https://www.1000ps.de/) or [text](https://motorrad-online.de)
  r=r.replace(/\[([^\]]+)\]\(https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/?\)/g,"$1");
  // Also strip global NIU homepage links
  r=r.replace(/\[([^\]]+)\]\(https?:\/\/global\.niu\.com\/?(?:#[^)]+)?\)/g,"$1");
  return r;
}
function localiseLinks(text,code){if(!text||!code)return text;const p=LP[code];if(!p)return text;return text.replace(/https:\/\/global\.niu\.com\/product\//g,p);}
function mdPlain(md){
  if(!md)return "";
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g,"$1")
    .replace(/\*\*(.+?)\*\*/g,"$1")
    .replace(/\*(.+?)\*/g,"$1")
    // Convert ### title → H3 marker that pastes as heading in rich text fields
    .replace(/^### (.+)$/gm,"$1")
    // Convert ## subheadings → keep as bold-style separator
    .replace(/^## (.+)$/gm,"$1")
    // Convert # → plain
    .replace(/^# (.+)$/gm,"$1");
}
function copyText(t){const s=t||"";if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(s).catch(()=>fbCopy(s));return fbCopy(s);}
function fbCopy(t){const el=document.createElement("textarea");el.value=t;el.style.cssText="position:fixed;opacity:0;top:0;left:0";document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);return Promise.resolve();}
function findCtx(article,term){if(!article||!term)return null;const lo=article.toLowerCase();const i=lo.indexOf(term.toLowerCase());if(i===-1)return null;return article.slice(Math.max(0,i-50),Math.min(article.length,i+term.length+80));}

function buildHL(md,kws,geos){
  if(!md)return buildHL_plain(md);
  const safeKws=(kws||[]).filter(k=>k&&(k.term||k)&&typeof(k.term||k)==="string");
  const safeGeos=(geos||[]).filter(p=>p&&typeof p==="string"&&p.length>2);
  if(!safeKws.length&&!safeGeos.length)return buildHL_plain(md);
  let h=md.replace(/^### (.+)$/gm,"<h3 style='color:"+W+";font-size:1.05rem;margin:1.3em 0 0.35em;font-weight:700;'>$1</h3>").replace(/^## (.+)$/gm,"<h2 style='color:"+W+";font-size:1.2rem;margin:1.5em 0 0.45em;font-weight:800;'>$1</h2>").replace(/^# (.+)$/gm,"<h1 style='color:"+W+";font-size:1.4rem;margin:1.3em 0 0.45em;font-weight:900;'>$1</h1>").replace(/\[(.+?)\]\((.+?)\)/g,"<a href='$2' style='color:"+RED+";text-decoration:underline;' target='_blank' rel='noopener'>$1</a>").replace(/\*\*(.+?)\*\*/g,"<strong style='color:"+W+";'>$1</strong>").replace(/\*(.+?)\*/g,"<em style='color:#ddd;'>$1</em>").replace(/^- (.+)$/gm,"<li style='color:"+W+";margin:0.3em 0;'>$1</li>").replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g,m=>"<ul style='margin:0.7em 0 0.7em 1.3em;'>"+m+"</ul>").replace(/\n\n/g,"</p><p style='margin:0.8em 0;line-height:1.8;color:"+W+";'>")+"</p>";
  h="<p style='margin:0.8em 0;line-height:1.8;color:"+W+";'>"+h;
  const terms=[...safeGeos.map(p=>({term:p,bg:"#E8FF4755",bd:"#E8FF47"})),...safeKws.map(k=>({term:k.term||k,bg:BL+"44",bd:BL}))].sort((a,b)=>(b.term||"").length-(a.term||"").length);
  terms.forEach(({term,bg,bd})=>{
    if(!term||term.length<3)return;
    const esc=term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    try{h=h.replace(new RegExp("(?<![\\w>-])("+esc+")(?![\\w<-])","gi"),m=>"<mark style='background:"+bg+";border-radius:3px;padding:1px 4px;border-bottom:2px solid "+bd+";color:"+W+";font-weight:600;display:inline;'>"+m+"</mark>");}catch(e){}
  });
  return h;
}
function buildHL_plain(md){
  if(!md)return "";
  let h=md.replace(/^### (.+)$/gm,"<h3 style='color:"+W+";font-size:1.05rem;margin:1.3em 0 0.35em;font-weight:700;'>$1</h3>").replace(/^## (.+)$/gm,"<h2 style='color:"+W+";font-size:1.2rem;margin:1.5em 0 0.45em;font-weight:800;'>$1</h2>").replace(/^# (.+)$/gm,"<h1 style='color:"+W+";font-size:1.4rem;margin:1.3em 0 0.45em;font-weight:900;'>$1</h1>").replace(/\[(.+?)\]\((.+?)\)/g,"<a href='$2' style='color:"+RED+";text-decoration:underline;' target='_blank' rel='noopener'>$1</a>").replace(/\*\*(.+?)\*\*/g,"<strong style='color:"+W+";'>$1</strong>").replace(/\*(.+?)\*/g,"<em style='color:#ddd;'>$1</em>").replace(/^- (.+)$/gm,"<li style='color:"+W+";margin:0.3em 0;'>$1</li>").replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g,m=>"<ul style='margin:0.7em 0 0.7em 1.3em;'>"+m+"</ul>").replace(/\n\n/g,"</p><p style='margin:0.8em 0;line-height:1.8;color:"+W+";'>")+"</p>";
  return "<p style='margin:0.8em 0;line-height:1.8;color:"+W+";'>"+h;
}
function ArtMD({md}){return <div dangerouslySetInnerHTML={{__html:buildHL_plain(md)}}/>;}

function Pill({color,children}){const c=color||RED;return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:3,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",background:c+"22",color:c,border:"1px solid "+c+"33"}}>{children}</span>;}
function Lbl({children}){return <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#666",marginBottom:5}}>{children}</div>;}
function Hr(){return <div style={{height:1,background:BDR,margin:"4px 0"}}/>;}
function Btn({children,onClick,disabled,variant,fullWidth}){
  const v=variant||"default";
  const b={fontFamily:"inherit",cursor:disabled?"not-allowed":"pointer",border:"none",borderRadius:5,fontWeight:700,fontSize:12,padding:"8px 16px",width:fullWidth?"100%":"auto",opacity:disabled?0.4:1};
  const s={primary:{background:RED,color:W},ghost:{background:"transparent",color:W,border:"1px solid "+BDR},amber:{background:AM+"22",color:AM,border:"1px solid "+AM+"44"},blue:{background:BL+"18",color:BL,border:"1px solid "+BL+"44"},green:{background:GN+"18",color:GN,border:"1px solid "+GN+"44"},default:{background:SURF,color:W,border:"1px solid "+BDR}};
  return <button onClick={disabled?undefined:onClick} style={{...b,...s[v]}}>{children}</button>;
}
function CBtn({text,label,variant}){const [c,setC]=useState(false);function go(){copyText(text||"").then(()=>{setC(true);setTimeout(()=>setC(false),2000);});}return <Btn onClick={go} variant={c?"green":variant||"default"}>{c?"Copied!":label||"Copy"}</Btn>;}
function Spin({label}){return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,padding:"50px 0"}}><div style={{width:36,height:36,borderRadius:"50%",border:"3px solid #333",borderTop:"3px solid "+RED,animation:"sp 0.8s linear infinite"}}/><style>{"@keyframes sp{to{transform:rotate(360deg)}}"}</style><div style={{color:W,fontSize:13}}>{label}</div></div>;}

function CancelSpin({label,phase,onCancel}){
  const phaseColors={researching:BL,writing:AM,evaluating:GN};
  const col=phaseColors[phase]||RED;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,padding:"50px 0"}}>
      <div style={{position:"relative",width:56,height:56,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"3px solid #333",borderTop:"3px solid "+col,animation:"sp 0.8s linear infinite"}}/>
        <div style={{width:14,height:14,borderRadius:2,background:"#333"}}/>
      </div>
      <div style={{color:W,fontSize:13,fontWeight:500}}>{label}</div>
      <button
        onClick={onCancel}
        style={{padding:"7px 20px",borderRadius:5,border:"1px solid #444",background:"transparent",color:"#888",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4,transition:"all 0.15s"}}
        onMouseEnter={e=>{e.target.style.borderColor=RED;e.target.style.color=RED;e.target.style.background=RED+"15";}}
        onMouseLeave={e=>{e.target.style.borderColor="#444";e.target.style.color="#888";e.target.style.background="transparent";}}
      >
        Cancel
      </button>
    </div>
  );
}
function Logo(){return <svg width="30" height="30" viewBox="0 0 100 85" fill="none"><path fill={RED} d="M22 5C20 4 18 5 17 7L12 15 6 18C3 20 1 23 1 27V35C1 40 4 44 8 46L4 57C2 61 3 66 6 69L22 82C26 86 32 86 36 83L50 72 64 83C68 86 74 86 78 82L94 69C97 66 98 61 96 57L92 46C96 44 99 40 99 35V27C99 23 97 20 94 18L88 15 83 7C82 5 80 4 78 5L68 9C63 7 57 6 50 6 43 6 37 7 32 9ZM50 24L66 24 74 42 50 62 26 42Z"/></svg>;}
function TokM({s}){const t=s.input+s.output;if(t===0)return <span style={{fontSize:10,color:"#444",padding:"4px 10px"}}>No usage</span>;const p=Math.min(100,Math.round(t/500000*100));const c=p>80?RED:p>50?AM:GN;return <div style={{background:"#111",border:"1px solid "+BDR,borderRadius:5,padding:"4px 10px",minWidth:130}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:10,color:W}}>{Math.round(t/1000)}k tokens</span><span style={{fontSize:10,fontWeight:700,color:c}}>{p}%</span></div><div style={{background:"#222",borderRadius:2,height:3}}><div style={{width:p+"%",height:"100%",background:c,borderRadius:2}}/></div></div>;}
function SBar({label,val,prev}){
  const c=val>=16?GN:val>=12?AM:RED;const imp=prev!=null&&val>prev;
  return <div style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3,alignItems:"center"}}><span style={{fontSize:11,color:W}}>{label}</span><div style={{display:"flex",alignItems:"center",gap:6}}>{imp&&<span style={{fontSize:9,color:GN,fontWeight:700}}>+{val-prev}</span>}<span style={{fontSize:11,fontWeight:700,color:c}}>{val}/20</span></div></div><div style={{background:"#111",borderRadius:2,height:4}}><div style={{width:(val/20*100)+"%",height:"100%",background:c,borderRadius:2,transition:"width 0.5s ease"}}/></div></div>;
}

function KwRow({kw,art,kwMap,onApply}){
  const [showS,setShowS]=useState(false);
  const k=kw||{};const mapE=kwMap[k.term]||kwMap[(k.term||"").toLowerCase()];const foundT=art?.article&&art.article.toLowerCase().includes((k.term||"").toLowerCase());const found=!!(mapE||foundT);const ctx=mapE||(foundT?findCtx(art?.article,k.term):null);
  return(
    <div style={{background:SURF,border:"1px solid "+(found?BDR:AM+"44"),borderRadius:5,padding:"7px 10px",marginBottom:4}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <div style={{fontSize:11,fontWeight:600,color:W}}>{k.term}</div>
        {!found&&art&&<button onClick={()=>setShowS(s=>!s)} style={{fontSize:9,padding:"2px 7px",borderRadius:3,border:"1px solid "+AM+"44",background:AM+"15",color:AM,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>{showS?"Hide":"Add to article"}</button>}
      </div>
      <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:ctx?4:0}}>
        <Pill color={BL}>{k.intent}</Pill>
        <Pill color={k.difficulty==="low"?GN:k.difficulty==="medium"?AM:RED}>{k.difficulty}</Pill>
        {k.suggested_section&&<Pill color="#9B59B6">{"-> "+k.suggested_section}</Pill>}
        {k.branded===true?<Pill color={AM}>branded</Pill>:<Pill color={GN}>non-branded</Pill>}
        {found?<Pill color={GN}>found</Pill>:art?<Pill color={AM}>check</Pill>:null}
      </div>
      {ctx&&<div style={{fontSize:10,color:"#aaa",padding:"3px 6px",background:"#111",borderRadius:3,borderLeft:"2px solid "+GN,lineHeight:1.5,marginBottom:3}}><span style={{color:GN,fontWeight:700,marginRight:4}}>Used:</span>{"..."+ctx.slice(0,110)+(ctx.length>110?"...":"")}</div>}
      {!found&&showS&&art&&<KwSuggest kw={k.term} section={k.suggested_section} onApply={p=>{onApply(p);setShowS(false);}}/>}
    </div>
  );
}

function KwSuggest({kw,section,onApply}){
  const [loading,setLoading]=useState(false);const [sug,setSug]=useState(null);
  async function gen(){
    setLoading(true);
    try{const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:MF,max_tokens:150,messages:[{role:"user",content:'Write ONE natural sentence containing the exact phrase "'+kw+'" for a NIU electric scooter blog post '+section+' section. Return only the sentence.'}]})});const d=await res.json();setSug((d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim());}catch(e){setSug("Could not generate suggestion.");}
    setLoading(false);
  }
  return(
    <div style={{marginTop:6,background:"#111",border:"1px solid "+AM+"33",borderRadius:4,padding:"8px 10px"}}>
      <div style={{fontSize:9,color:AM,fontWeight:700,textTransform:"uppercase",marginBottom:5}}>Suggestion for {section}</div>
      {!sug&&!loading&&<button onClick={gen} style={{fontSize:10,padding:"3px 10px",borderRadius:3,border:"1px solid "+AM+"44",background:AM+"15",color:AM,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Generate</button>}
      {loading&&<div style={{fontSize:10,color:"#666"}}>Generating...</div>}
      {sug&&<div><div style={{fontSize:11,color:W,lineHeight:1.6,marginBottom:6,padding:"4px 6px",background:AM+"12",borderRadius:3}}>"{sug}"</div><div style={{display:"flex",gap:6}}><CBtn text={sug} label="Copy"/><button onClick={()=>onApply("\n\n"+sug)} style={{fontSize:10,padding:"3px 10px",borderRadius:3,border:"1px solid "+GN+"44",background:GN+"15",color:GN,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Add to article</button><button onClick={()=>setSug(null)} style={{fontSize:10,padding:"3px 8px",borderRadius:3,border:"1px solid #333",background:"transparent",color:"#666",cursor:"pointer",fontFamily:"inherit"}}>Retry</button></div></div>}
    </div>
  );
}

function HeadlinesTab({art,selH,setSelH,setArt,topic}){
  const [refreshing,setRefreshing]=useState(false);const [refreshErr,setRefreshErr]=useState("");
  async function refreshHeadlines(){
    if(!art)return;setRefreshing(true);setRefreshErr("");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:MF,max_tokens:800,messages:[{role:"user",content:"Generate 5 new, distinct SEO-optimised headline options for a NIU Technologies blog post about: \""+topic+"\"\nArticle excerpt: "+((art.article||"").slice(0,300))+"...\nReturn ONLY a JSON array of 5 strings."}]})});
      const d=await res.json();const text=(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();const clean=text.replace(/^```json\s*/i,"").replace(/```\s*$/,"").trim();const fi=clean.indexOf("[");const parsed=JSON.parse(fi>=0?clean.slice(fi):clean);
      if(Array.isArray(parsed)&&parsed.length>0)setArt(a=>({...a,headlines:parsed}));
    }catch(e){setRefreshErr("Could not refresh: "+e.message);}
    setRefreshing(false);
  }
  function replaceTitle(h){
    if(!art)return;let updated=(art.article||"").replace(/^#{1,3} .+$/m,"### "+h);
    if(!updated.match(/^#{1,3} /m))updated="### "+h+"\n\n"+updated;
    setArt(a=>({...a,article:updated,headlines:(a.headlines||[]).map((hl,i)=>i===selH?h:hl)}));
  }
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:640}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
        <div><div style={{fontWeight:700,fontSize:14,color:W}}>Headline Options</div><div style={{fontSize:10,color:"#666",marginTop:2}}>Select then click Replace to update the article title.</div></div>
        <button onClick={refreshHeadlines} disabled={refreshing} style={{padding:"6px 12px",borderRadius:5,border:"1px solid "+BL+"33",background:BL+"18",color:BL,fontSize:10,fontWeight:700,cursor:refreshing?"not-allowed":"pointer",fontFamily:"inherit",opacity:refreshing?0.5:1}}>{refreshing?"Refreshing...":"Refresh Headlines"}</button>
      </div>
      {refreshErr&&<div style={{fontSize:10,color:"#ffaaaa",background:RED+"15",border:"1px solid "+RED+"40",borderRadius:4,padding:"5px 8px"}}>{refreshErr}</div>}
      {(art.headlines||[]).map((h,i)=>(
        <div key={i} onClick={()=>setSelH(i)} style={{background:selH===i?RED+"10":PANEL,border:"1px solid "+(selH===i?RED:BDR),borderRadius:6,padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:8}}>
          <div style={{width:17,height:17,borderRadius:"50%",flexShrink:0,background:selH===i?RED:"#2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:selH===i?W:"#888"}}>{i+1}</div>
          <div style={{flex:1,fontSize:12,fontWeight:600,lineHeight:1.5,color:W}}>{h}</div>
          {selH===i&&<button onClick={e=>{e.stopPropagation();replaceTitle(h);}} style={{padding:"4px 10px",borderRadius:4,border:"none",background:RED,color:W,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Replace</button>}
        </div>
      ))}
    </div>
  );
}


// ─── Login Gate ───────────────────────────────────────────────────────────────
const ENCODED_PW = "TklVQmxvZ1N0dWRpbzIwMjUh";

function LoginGate({onAuth}){
  const [pw,setPw]=useState("");
  const [err,setErr]=useState(false);
  const [shake,setShake]=useState(false);
  const [show,setShow]=useState(false);

  function attempt(){
    if(btoa(pw)===ENCODED_PW){
      // Store session auth so page refresh doesn't require re-login
      try{sessionStorage.setItem("niu_auth","1");}catch(e){}
      onAuth();
    }else{
      setErr(true);setShake(true);
      setTimeout(()=>setShake(false),600);
      setTimeout(()=>setErr(false),2500);
      setPw("");
    }
  }

  return(
    <div style={{
      minHeight:"100vh",background:BLACK,display:"flex",alignItems:"center",
      justifyContent:"center",fontFamily:"'DM Sans','Segoe UI',Arial,sans-serif",
      position:"relative",overflow:"hidden"
    }}>
      {/* Background pattern */}
      <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)"}}/>
      <div style={{position:"absolute",top:-120,right:-120,width:400,height:400,borderRadius:"50%",background:RED+"18",filter:"blur(80px)"}}/>
      <div style={{position:"absolute",bottom:-80,left:-80,width:300,height:300,borderRadius:"50%",background:RED+"10",filter:"blur(60px)"}}/>

      <div style={{
        width:"100%",maxWidth:380,padding:"0 24px",
        animation:shake?"shakeAnim 0.5s ease":"none",
        position:"relative",zIndex:1
      }}>
        <style>{`
          @keyframes shakeAnim{
            0%,100%{transform:translateX(0)}
            15%{transform:translateX(-8px)}
            30%{transform:translateX(8px)}
            45%{transform:translateX(-6px)}
            60%{transform:translateX(6px)}
            75%{transform:translateX(-3px)}
            90%{transform:translateX(3px)}
          }
          @keyframes fadeUp{
            from{opacity:0;transform:translateY(20px)}
            to{opacity:1;transform:translateY(0)}
          }
          .login-input:focus{border-color:#E4002B !important;outline:none;}
          .login-btn:hover:not(:disabled){background:#c8001f !important;}
        `}</style>

        {/* Logo */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:36,animation:"fadeUp 0.5s ease both"}}>
          <svg width="48" height="42" viewBox="0 0 100 85" fill="none">
            <path fill="#E4002B" d="M22 5C20 4 18 5 17 7L12 15 6 18C3 20 1 23 1 27V35C1 40 4 44 8 46L4 57C2 61 3 66 6 69L22 82C26 86 32 86 36 83L50 72 64 83C68 86 74 86 78 82L94 69C97 66 98 61 96 57L92 46C96 44 99 40 99 35V27C99 23 97 20 94 18L88 15 83 7C82 5 80 4 78 5L68 9C63 7 57 6 50 6 43 6 37 7 32 9ZM50 24L66 24 74 42 50 62 26 42Z"/>
          </svg>
          <div style={{marginTop:14,fontWeight:900,fontSize:22,letterSpacing:"0.02em",color:"#FFFFFF"}}>NIU Blog Studio</div>
          <div style={{fontSize:11,color:"#444",marginTop:4,letterSpacing:"0.12em",textTransform:"uppercase"}}>Content Intelligence</div>
        </div>

        {/* Card */}
        <div style={{
          background:"#141414",border:"1px solid #2E2E2E",borderRadius:12,
          padding:"28px 28px 24px",animation:"fadeUp 0.5s 0.1s ease both",opacity:0,
          animationFillMode:"forwards"
        }}>
          <div style={{fontSize:13,fontWeight:700,color:"#FFFFFF",marginBottom:4}}>Sign in to continue</div>
          <div style={{fontSize:11,color:"#555",marginBottom:20}}>Enter your access password to open the tool.</div>

          <div style={{marginBottom:14,position:"relative"}}>
            <input
              className="login-input"
              type={show?"text":"password"}
              value={pw}
              onChange={e=>{setPw(e.target.value);setErr(false);}}
              onKeyDown={e=>e.key==="Enter"&&attempt()}
              placeholder="Password"
              autoFocus
              style={{
                width:"100%",background:"#0a0a0a",
                border:"1px solid "+(err?"#E4002B":"#2E2E2E"),
                borderRadius:6,padding:"10px 40px 10px 12px",
                color:"#FFFFFF",fontSize:13,fontFamily:"inherit",
                boxSizing:"border-box",transition:"border-color 0.2s"
              }}
            />
            <button
              onClick={()=>setShow(s=>!s)}
              style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"#555",cursor:"pointer",fontSize:11,padding:"2px 4px"}}
            >{show?"Hide":"Show"}</button>
          </div>

          {err&&<div style={{fontSize:11,color:"#E4002B",marginBottom:10,fontWeight:600}}>Incorrect password. Please try again.</div>}

          <button
            className="login-btn"
            onClick={attempt}
            disabled={!pw.trim()}
            style={{
              width:"100%",background:"#E4002B",color:"#FFFFFF",border:"none",
              borderRadius:6,padding:"11px",fontWeight:700,fontSize:13,
              cursor:pw.trim()?"pointer":"not-allowed",fontFamily:"inherit",
              opacity:pw.trim()?1:0.45,transition:"background 0.15s, opacity 0.15s"
            }}
          >Sign in</button>
        </div>

        <div style={{textAlign:"center",marginTop:16,fontSize:10,color:"#333",animation:"fadeUp 0.5s 0.2s ease both",opacity:0,animationFillMode:"forwards"}}>
          NIU Technologies — Internal Use Only
        </div>
      </div>
    </div>
  );
}

function BlogStudio({onLogout}){
  const [topic,setTopic]=useState("");
  const [len,setLen]=useState(LENGTHS[1]);
  const [notes,setNotes]=useState("");
  const [mode,setMode]=useState("lite");
  const [pdfs,setPdfs]=useState([]);
  const fRef=useRef(null);
  const cancelRef=useRef(false); // set to true to abort run() mid-flight
  const [cancelled,setCancelled]=useState(false);
  const [phase,setPhase]=useState("idle");
  const [qMsg,setQMsg]=useState("");
  const [res,setRes]=useState(null);
  const [art,setArt]=useState(null);
  const [ev,setEv]=useState(null);
  const [prevScores,setPrevScores]=useState(null);
  const [tr,setTr]=useState(null);
  const [tring,setTring]=useState(false);
  const [trS,setTrS]=useState({});
  const [tab,setTab]=useState("home");
  const [selH,setSelH]=useState(0);
  const [err,setErr]=useState("");
  const [fb,setFb]=useState("");
  const [rev,setRev]=useState(false);
  const [revN,setRevN]=useState(0);
  const [revMsg,setRevMsg]=useState("");
  const [apF,setApF]=useState(null);
  const [flagHighlight,setFlagHighlight]=useState(null);
  const [langT,setLangT]=useState("en");
  const [tok,setTok]=useState({input:0,output:0});
  const [edit,setEdit]=useState(false);
  const [draft,setDraft]=useState("");
  const [showHL,setShowHL]=useState(false);
  const [hist,setHist]=useState([]);
  const [histV,setHistV]=useState(null);
  const [activeHistId,setActiveHistId]=useState(null);
  const [pool,setPool]=useState(ALL_TOPICS.slice(0,10));
  const [poolOff,setPoolOff]=useState(10);
  const [sanityToken]=useState(()=>atob("c2tTYWJNdjN4SHNLcVZKczJ4WFVBTVBYU2xKZWRqNEdCSFpFRnhqUTl4MG5kR1FxdERoeWUzZ0I1QVBoUVYySEFwdE1GS0hUNXRhUGdDdXVjaDhKSnhndnFPS1NDdGlRZFhrRUNnQ3M1a2ZvaXlGSzc4amVBZUc4VzRWM3RDUjNpRWE1bElHNTRZZExRVW5QNW81aTdvUU9OaGo1VGYyZkpNRllVM3VhUWVUQnhGeVdvdTRS"));
  const [sanityProjectId,setSanityProjectId]=useState("");
  const [pushing,setPushing]=useState(false);
  const [pushResult,setPushResult]=useState(null);
  const [verifiedSources,setVerifiedSources]=useState([]); // confirmed-live sources with extracted content

  useEffect(()=>{onTok(s=>setTok({...s}));onQ(m=>setQMsg(m));},[]);

  function handlePDF(e){
    const files=Array.from(e.target.files||[]).filter(f=>f.type==="application/pdf");
    files.slice(0,3-pdfs.length).forEach(f=>{const r=new FileReader();r.onload=ev2=>setPdfs(prev=>[...prev,{name:f.name,b64:ev2.target.result.split(",")[1]}].slice(0,3));r.readAsDataURL(f);});
    if(e.target)e.target.value="";
  }

  const busy=["researching","writing","evaluating"].includes(phase)||rev||tring;
  const curH=art?.headlines?.[selH]||"";

  function cancelRun(){
    cancelRef.current=true;   // signal run() to stop at next checkpoint
    JQ.queue.length=0;        // drain the job queue immediately
    JQ.running=false;
    setCancelled(true);
    setPhase("idle");
    emitQ("");
  }


  // ── Option 2 Search Engine: find real articles, fetch content, verify ──────
  async function searchAndVerifySources(topic){
    emitQ("Searching for verified sources...");
    const verified=[];

    // Build targeted search queries for this topic
    const queries=[
      'NIU electric scooter '+topic.slice(0,40)+' review 2024 2025',
      'NIU Technologies '+topic.slice(0,30)+' site:electrive.com OR site:insideevs.com OR site:1000ps.de OR site:autoexpress.co.uk',
      topic.slice(0,40)+' electric scooter data statistics IEA BloombergNEF 2024',
    ];

    for(const q of queries){
      if(cancelRef.current)break;
      try{
        // Use web_search via Anthropic to get real URLs
        const searchRes=await fetch("https://api.anthropic.com/v1/messages",{
          method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            model:MF,max_tokens:1200,
            tools:[{type:"web_search_20250305",name:"web_search"}],
            messages:[{role:"user",content:"Search for: "+q+" Return a JSON list of up to 3 results with url, title, snippet. Only include results with specific article URLs (not homepages). Format: [{url,title,snippet}]"}]
          })
        });
        if(!searchRes.ok)continue;
        const sd=await searchRes.json();
        if(sd.usage){TOK.input+=sd.usage.input_tokens||0;TOK.output+=sd.usage.output_tokens||0;fireTok();}

        // Extract URLs from tool results and text
        const toolResults=(sd.content||[]).filter(b=>b.type==="tool_result"||b.type==="tool_use");
        const texts=(sd.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");

        // Parse URLs from the response text
        const urlMatches=texts.match(/https?:\/\/[^\s\)"']+/g)||[];
        const articleUrls=urlMatches.filter(u=>{
          // Must have a path beyond just the domain
          try{const p=new URL(u).pathname;return p&&p.length>5&&!p.match(/^\/?(?:index)?\.?html?$/);}catch(e){return false;}
        }).slice(0,3);

        // Try to extract content snippet from the text response
        const snippetMatch=texts.match(/"snippet"\s*:\s*"([^"]{30,200})"/);
        const snippet=snippetMatch?snippetMatch[1]:"";

        for(const url of articleUrls){
          if(verified.find(v=>v.url===url))continue; // deduplicate
          verified.push({url,title:"",snippet,verified:true,query:q});
        }
      }catch(e){}

      if(verified.length>=6)break; // enough sources
    }

    // Step 2: Fetch top 3 candidate URLs and extract real content
    const toFetch=verified.slice(0,3);
    const withContent=await Promise.all(toFetch.map(async(src2)=>{
      try{
        const fetchRes=await fetch("https://api.anthropic.com/v1/messages",{
          method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            model:MF,max_tokens:500,
            tools:[{type:"web_search_20250305",name:"web_search"}],
            messages:[{role:"user",content:"Fetch this URL and extract: (1) the page title, (2) one key statistic or factual claim relevant to electric scooters or NIU, (3) confirm the URL is a real article not a homepage. URL: "+src2.url+" Return JSON: {title, stat, confirmed_url, is_article}"}]
          })
        });
        if(!fetchRes.ok)return src2;
        const fd=await fetchRes.json();
        if(fd.usage){TOK.input+=fd.usage.input_tokens||0;TOK.output+=fd.usage.output_tokens||0;fireTok();}
        const ft=(fd.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
        try{
          const clean=ft.replace(/^```json\s*/i,"").replace(/```\s*$/,"").trim();
          const fi=clean.indexOf("{");
          const parsed=JSON.parse(fi>=0?clean.slice(fi):clean);
          if(parsed.is_article===false)return null; // confirmed not an article
          return{
            url:parsed.confirmed_url||src2.url,
            title:parsed.title||"",
            stat:parsed.stat||src2.snippet||"",
            verified:true,
            source:new URL(src2.url).hostname.replace("www.",""),
          };
        }catch(e){return src2;}
      }catch(e){return null;}
    }));

    const final=withContent.filter(Boolean).slice(0,4);
    setVerifiedSources(final);
    return final;
  }

  async function run(){
    cancelRef.current=false;  // reset before each new run
    setCancelled(false);
    if(!topic.trim()){setErr("Please enter a topic.");return;}
    setErr("");setRes(null);setArt(null);setEv(null);setTr(null);setRevN(0);setRevMsg("");setEdit(false);setShowHL(false);setPushResult(null);
    const wc=len.includes("600")?"600 words":len.includes("900")?"900 words":"1400 words";
    try{
      setPhase("researching");

      // ── Research Mode: parallel keyword scan + verified source search ────
      let rd, verSources=[];
      if(mode==="research"){
        // Run keyword generation and live source verification in parallel
        emitQ("Generating keywords and searching for verified sources...");
        [rd, verSources]=await Promise.all([
          enqueue({model:MF,system:PR_FULL,userMsg:'Topic: "'+topic+'"\nReturn ONLY raw JSON starting with {',maxTokens:6000,useSearch:true,label:"Keyword research..."}),
          searchAndVerifySources(topic)
        ]);
      }else{
        rd=await enqueue({model:MF,system:PR_LITE,userMsg:'Topic: "'+topic+'"\nReturn ONLY raw JSON starting with {',maxTokens:4000,useSearch:false,label:"Generating keywords..."});
      }

      setRes(rd);
      if(cancelRef.current)return;

      // YouTube context (research mode)
      let ytContext="";
      if(mode==="research"&&(rd.yt_sources||[]).length>0){
        try{
          const ytTitles=(rd.yt_sources||[]).slice(0,3).map(v=>v.title+" ("+v.channel+")").join("; ");
          const ytSum=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:MF,max_tokens:400,messages:[{role:"user",content:"Summarise in 2-3 sentences the key themes from these NIU scooter YouTube videos: "+ytTitles+". Return only the summary."}]})});
          if(ytSum.ok){const yd=await ytSum.json();ytContext=(yd.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();}
        }catch(e){}
      }

      if(cancelRef.current)return;
      setPhase("writing");
      const kInst=(rd.seo_keywords||[]).map(k=>'USE "'+k.term+'" in '+k.suggested_section+' section').join("; ");

      // Build verified citations block for writing prompt
      const verCitationsBlock=verSources.length>0
        ?[
          "VERIFIED SOURCES — cite ONLY these in the article. Each has been confirmed as a real, live article page:",
          ...verSources.map((s,i)=>`${i+1}. SOURCE: ${s.source} | URL: ${s.url} | CONTENT: "${s.stat||s.snippet||s.title}" | Use this URL as an inline hyperlink when referencing this source.`),
          "CITATION RULE: If you cite a statistic or claim from one of these sources, you MUST include the exact URL as a markdown hyperlink [anchor text](url). Do not cite any source not in this list."
        ].join("\n")
        :"";

      const baseMsg=['Write a NIU Mobility blog post.','Topic: "'+topic+'"',"Length: "+wc,notes?"Notes: "+notes:"","MANDATORY SEO KEYWORD PLACEMENT (min 3): "+kInst,(rd.geo_phrases&&rd.geo_phrases.length>0)?"GEO PHRASES (integrate naturally where relevant to the topic — do not force city references into non-geographic content): "+JSON.stringify(rd.geo_phrases||[]):"",verCitationsBlock||("Data points: "+JSON.stringify((rd.data_points||[]).slice(0,4))),"Angle: "+(rd.trending_angle||""),ytContext?"YouTube/video insights to weave in naturally: "+ytContext:"","EXTERNAL LINKS RULE: Only use URLs from the VERIFIED SOURCES list above. Never invent or guess URLs.","Return ONLY valid JSON starting with {"].filter(Boolean).join("\n");
      const pdfContent=pdfs.map(p=>({type:"document",source:{type:"base64",media_type:"application/pdf",data:p.b64}}));
      const writeMessages=pdfContent.length>0?[{role:"user",content:[...pdfContent,{type:"text",text:baseMsg+"\n\nUse the uploaded PDF(s) for additional context."}]}]:[{role:"user",content:baseMsg}];
      let ad=await enqueue({model:MQ,system:PW,messages:writeMessages,maxTokens:wc==="600 words"?6500:wc==="900 words"?8000:10000,label:"Writing article..."});
      if(ad&&ad.headlines&&!Array.isArray(ad.headlines))ad.headlines=Object.values(ad.headlines);
      if(ad&&ad.captions&&!Array.isArray(ad.captions))ad.captions=Object.values(ad.captions);
      if(ad?.article)ad.article=addLinks(ad.article);
      if(ad?.keyword_map)setRes(r=>({...r,keyword_map:ad.keyword_map}));
      setArt(ad);setSelH(0);
      if(cancelRef.current)return; // cancelled after writing — keep the article
      setPhase("evaluating");
      const evd=await enqueue({model:MF,system:PE,userMsg:"HEADLINE: "+(ad.headlines?.[0]||"")+"\nMETA: "+(ad.meta||"")+"\nARTICLE:\n"+(ad.article||"")+"\nReturn JSON.",maxTokens:4000,label:"Brand safety check..."});
      setEv(evd);
      const entry={id:Date.now(),topic,headline:(ad.headlines||[])[0]||topic,date:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),time:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),art:ad,eval:evd,mode};
      setHist(p=>[entry,...p].slice(0,50));setActiveHistId(entry.id);
      setPool(prev=>{const idx=prev.findIndex(t=>t.title===topic);if(idx===-1)return prev;const next=ALL_TOPICS[poolOff];if(!next)return prev.map((t,i)=>i===idx?{...t,used:true}:t);const updated=[...prev];updated[idx]={...next,isNew:true};setPoolOff(o=>o+1);return updated;});
      setPhase("done");setTab("article");
    }catch(e){if(!cancelRef.current)setErr("Pipeline error: "+e.message);setPhase("idle");
    }finally{cancelRef.current=false;}
  }

  async function applyFB(){
    if(!fb.trim()||!art)return;setRev(true);setErr("");
    try{
      const rv=await enqueue({model:MQ,system:PRV,userMsg:"HEADLINE: "+curH+"\nARTICLE:\n"+(art.article||"")+"\nMETA: "+(art.meta||"")+"\nFEEDBACK:\n"+fb+"\nReturn JSON.",maxTokens:6000,label:"Applying feedback..."});
      if(rv?.article)rv.article=addLinks(rv.article);
      setArt(a=>({...a,...rv}));setRevMsg(rv.revision_summary||"Updated.");setRevN(n=>n+1);setFb("");setTr(null);setEdit(false);
      try{const ev2=await enqueue({model:MF,system:PE,userMsg:"HEADLINE: "+(rv.headlines?.[0]||"")+"\nMETA: "+(rv.meta||"")+"\nARTICLE:\n"+(rv.article||"")+"\nReturn JSON.",maxTokens:4000,label:"Re-evaluating..."});if(ev2){setPrevScores(ev?.scores||null);setEv(ev2);}}catch(e2){}
    }catch(e){setErr("Revision failed: "+e.message);}
    setRev(false);
  }

  async function applyFlag(flag,idx){
    if(!art)return;setApF(idx);setErr("");setFlagHighlight(null);
    try{
      const fullArticle=art.article||"";
      const paragraphs=fullArticle.split("\n\n");

      // Find the most relevant paragraph by matching flag detail or area
      const detail=(flag.detail||"").toLowerCase();
      const area=(flag.area||"").toLowerCase();
      let targetIdx=paragraphs.findIndex(p=>{
        const pl=p.toLowerCase();
        return pl.includes(detail.slice(0,40))||pl.includes(area.slice(0,30));
      });
      if(targetIdx===-1)targetIdx=1; // default to second paragraph if no match

      const targetPara=paragraphs[targetIdx];

      // Always use LLM on the specific paragraph — much more reliable than string matching
      const editMsg=[
        "You are editing a specific paragraph in a NIU Technologies blog post.",
        "ACTION: "+flag.action,
        "ISSUE: "+flag.detail,
        "INSTRUCTION: "+flag.suggested_edit,
        "PARAGRAPH TO EDIT:",
        targetPara,
        "Return ONLY the revised paragraph as plain text. No explanation, no JSON, no quotes."
      ].join("\n");

      const res2=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:MQ,max_tokens:800,messages:[{role:"user",content:editMsg}]})
      });

      let updated=fullArticle;
      if(res2.ok){
        const d2=await res2.json();
        const revisedPara=(d2.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
        if(revisedPara&&revisedPara.length>10){
          if(flag.action==="delete"){
            updated=paragraphs.filter((_,i)=>i!==targetIdx).join("\n\n");
          }else{
            updated=paragraphs.map((p,i)=>i===targetIdx?revisedPara:p).join("\n\n");
          }
          // Store the new paragraph text so we can highlight it in the article view
          setFlagHighlight(flag.action==="delete"?null:revisedPara.slice(0,100));
        }
      }

      updated=addLinks(updated);
      setArt(a=>({...a,article:updated}));
      setEv(e=>e?{...e,flags:(e.flags||[]).map((f,i)=>i===idx?{...f,applied:true}:f)}:e);

      // Re-score with excerpt
      try{
        const ev2=await enqueue({model:MF,system:PE,userMsg:"HEADLINE: "+curH+"\nMETA: "+(art.meta||"")+"\nARTICLE (excerpt):\n"+updated.slice(0,3000)+"\nReturn JSON.",maxTokens:4000,label:"Updating scores..."});
        if(ev2){const prevFlags=ev?.flags||[];const mergedFlags=(ev2.flags||[]).map((f,i)=>{const prev=prevFlags[i];return prev?.applied?{...f,applied:true}:f;});setPrevScores(ev?.scores||null);setEv({...ev2,flags:mergedFlags});}
      }catch(e3){}

      setTab("article");
    }catch(e){setErr("Edit failed: "+e.message);}
    setApF(null);
  }

  // Core translation call — single combined API call with retry on 429
  async function trCall(code,clean,curH2,artMeta){
    const cfg=LANGS[code];
    const prefix=LP[code]||"https://global.niu.com/product/";
    const duMap={de:"du",fr:"tu",es:"tu",it:"tu"};
    const cityMap={de:"Berlin, Hamburg, Munich",fr:"Paris, Lyon, Marseille",es:"Madrid, Barcelona",it:"Milan, Rome, Turin"};
    const du=duMap[code]||"";
    const cities=cityMap[code]||"";

    // Single combined call: translate body + headline + meta + captions together
    // Using Haiku (not Sonnet) — avoids rate limits when 4 fire at once
    // max_tokens 5000 is enough for any article translation in Haiku
    const system=[
      "CRITICAL: Respond with ONLY a raw JSON object. No preamble. Start with { end with }.",
      "You are a professional localisation writer for NIU Technologies.",
      "Translate the full blog post to "+cfg.label+". Write naturally for "+cfg.label+"-speaking urban commuters — NOT word-for-word.",
      du?"Use the informal "+du+" form throughout.":"",
      "Preserve all markdown: ### headings, ## subheadings, **bold**, bullet lists.",
      "Replace https://global.niu.com with "+cfg.base+". Replace /product/ slugs with "+prefix+"SLUG.",
      cities?"Reference "+cities+" naturally where relevant.":"",
      "Position NIU Technologies positively throughout.",
      '{"headline":"translated headline","article":"full translated markdown","meta":"max 155 chars","captions":["caption 1","caption 2","caption 3"]}'
    ].filter(Boolean).join("\n");

    for(let attempt=0;attempt<3;attempt++){
      if(attempt>0){
        // Wait before retry: 15s on first retry, 35s on second
        const wait=attempt===1?15000:35000;
        setTrS(s=>({...s,[code]:"retry "+attempt}));
        await new Promise(r=>setTimeout(r,wait));
      }
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:MF, // Haiku — fast, low rate-limit pressure, handles translation well
          max_tokens:5000,
          system,
          messages:[{role:"user",content:"HEADLINE: "+curH2+"\nMETA: "+(artMeta||"")+"\nARTICLE:\n"+clean+"\nReturn ONLY the JSON."}]
        })
      });
      if(res.status===429){
        // Rate limited — wait and retry
        const t=await res.text();
        const m=t.match(/"resets_at":(\d+)/);
        const waitSecs=m?Math.max(20,parseInt(m[1])-Math.floor(Date.now()/1000)+5):30;
        setTrS(s=>({...s,[code]:"rate-limit "+waitSecs+"s"}));
        await new Promise(r=>setTimeout(r,waitSecs*1000));
        continue;
      }
      if(!res.ok)throw new Error("API "+res.status);
      const data=await res.json();
      if(data.usage){TOK.input+=data.usage.input_tokens||0;TOK.output+=data.usage.output_tokens||0;fireTok();}
      const texts=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text);
      let raw=texts.join("").trim().replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/```\s*$/,"").trim();
      let d;
      try{d=JSON.parse(raw);}catch(e1){
        const fi=raw.indexOf("{");
        if(fi>=0){
          try{d=JSON.parse(raw.slice(fi));}catch(e2){
            const lc=raw.lastIndexOf("}");
            if(lc>fi){try{d=JSON.parse(raw.slice(fi,lc+1));}catch(e3){}}
          }
        }
      }
      if(d&&d.article&&d.article.length>50)return d;
      // Empty response — retry
    }
    throw new Error("Translation failed after 3 attempts");
  }

  async function trOne(code){
    setTrS(s=>({...s,[code]:"running"}));
    try{
      const clean=(art.article||"").replace(/\[([^\]]+)\]\(https:\/\/global\.niu\.com\/[^)]+\)/g,"$1");
      const d=await trCall(code,clean,curH,art.meta||"");
      if(d.article)d.article=localiseLinks(addLinks(d.article),code);
      setTr(t=>({...(t||{}),[code]:d}));
      setTrS(s=>({...s,[code]:"done"}));
    }catch(e){
      console.error("Translation error for "+code+":",e);
      setTrS(s=>({...s,[code]:"error:"+e.message.slice(0,80)}));
    }
  }

  async function runAllTr(){
    setTring(true);setTr({});setTrS({});
    // Stagger starts by 1.5s each — avoids all 4 hitting the API simultaneously
    // Still much faster than sequential (total ~10-20s vs 60s+)
    const codes=["de","fr","es","it"];
    const promises=codes.map((code,i)=>
      new Promise(r=>setTimeout(r,i*1500)).then(()=>trOne(code))
    );
    await Promise.all(promises);
    setTring(false);setTab("translations");
  }
  function loadHist(entry){setArt(entry.art);setEv(entry.eval||null);setSelH(0);setEdit(false);setShowHL(false);setTr(null);setRevN(0);setRevMsg("");setActiveHistId(entry.id);setTab("article");}
  function loadMore(){const next=ALL_TOPICS.slice(poolOff,poolOff+5);if(!next.length)return;setPool(p=>[...p,...next]);setPoolOff(o=>o+next.length);}

  async function pushBlog(langCode,headline,article,meta){
    if(!sanityProjectId.trim()){setPushResult({ok:false,msg:"Enter your Sanity Project ID in the sidebar first."});return;}
    setPushing(true);setPushResult(null);
    try{
      const result=await pushToSanity(sanityToken,sanityProjectId,headline,article,meta,langCode||"en");
      setPushResult({ok:true,msg:"Successfully pushed to Sanity as draft. Visible in your Sanity Studio under Blog Posts — awaiting manual review before publishing.",docId:result.docId,lang:langCode||"en"});
    }catch(e){setPushResult({ok:false,msg:"Push failed: "+e.message});}
    setPushing(false);
  }

  const tabs=[
    {id:"home",label:"Home"},
    {id:"history",label:"All Blogs",badge:hist.length>0?String(hist.length):null,bc:BL},
    ...(art?[
      {id:"article",label:"Article"},
      ...(res?[{id:"keywords",label:"Keywords"}]:[]),
      {id:"headlines",label:"Headlines"},
      {id:"meta",label:"Meta"},
      {id:"social",label:"Social"},
      ...(ev?[{id:"evaluation",label:"Evaluation",badge:ev.verdict,bc:VC[ev.verdict]}]:[]),
      {id:"translations",label:"Translations",badge:tr&&Object.keys(tr).length===4?"Done":null,bc:GN},
    ]:[]),
  ];
  const inp={width:"100%",background:SURF,border:"1px solid "+BDR,borderRadius:5,padding:"8px 10px",color:W,fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};

  return(
    <div style={{minHeight:"100vh",background:BLACK,fontFamily:"'DM Sans','Segoe UI',Arial,sans-serif",color:W,display:"flex",flexDirection:"column"}}>
      <div style={{background:DARK,borderBottom:"1px solid "+BDR,padding:"0 18px",display:"flex",alignItems:"center",minHeight:50,gap:12,position:"sticky",top:0,zIndex:100,flexShrink:0}}>
        <Logo/>
        <div style={{marginRight:"auto"}}><div style={{fontWeight:900,fontSize:13,letterSpacing:"0.04em",color:W}}>NIU Blog Studio</div><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.08em"}}>Content Intelligence</div></div>
        <div style={{display:"flex",border:"1px solid "+BDR,borderRadius:5,overflow:"hidden"}}>
          {[{id:"lite",l:"Lite"},{id:"research",l:"Research"}].map(m=>(
            <button key={m.id} onClick={()=>setMode(m.id)} style={{padding:"5px 12px",border:"none",background:mode===m.id?RED+"22":"transparent",color:mode===m.id?RED:"#666",fontSize:10,fontWeight:mode===m.id?700:400,cursor:"pointer",fontFamily:"inherit",borderRight:m.id==="lite"?"1px solid "+BDR:"none"}}>{m.l}</button>
          ))}
        </div>
        <TokM s={tok}/>
      </div>
      <div style={{background:DARK,borderBottom:"2px solid "+RED,display:"flex",alignItems:"stretch",overflowX:"auto",padding:"0 18px",minHeight:38,flexShrink:0,position:"sticky",top:50,zIndex:99}}>
        {tabs.map(t=>{const isA=tab===t.id;return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"0 14px",background:"transparent",border:"none",borderBottom:isA?"3px solid "+RED:"3px solid transparent",color:isA?W:"#666",fontWeight:isA?700:400,fontSize:12,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
            {t.label}{t.badge&&<span style={{background:t.bc||GN,color:"#000",borderRadius:3,padding:"1px 5px",fontSize:9,fontWeight:800}}>{t.badge}</span>}
          </button>
        );})}
      </div>
      {qMsg&&<div style={{background:"#1a1200",borderBottom:"1px solid "+AM+"44",padding:"7px 20px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}><div style={{width:7,height:7,borderRadius:"50%",background:AM,animation:"pu 1.2s infinite",flexShrink:0}}/><style>{"@keyframes pu{0%,100%{opacity:1}50%{opacity:0.3}}"}</style><div style={{fontSize:12,color:AM,flex:1}}>{qMsg}</div><div style={{fontSize:10,color:"#555"}}>Processing automatically</div></div>}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* LEFT SIDEBAR */}
        <div style={{width:265,flexShrink:0,background:DARK,borderRight:"1px solid "+BDR,padding:"13px 12px",display:"flex",flexDirection:"column",gap:9,overflowY:"auto"}}>
          {/* Generated Blogs at top */}
          {hist.length>0&&(
            <div style={{marginBottom:2}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                <Lbl>Generated Blogs</Lbl>
                <span style={{fontSize:9,color:"#555"}}>{hist.length} total</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:3,maxHeight:200,overflowY:"auto"}}>
                {hist.map(entry=>{
                  const isActive=activeHistId===entry.id;const vc=entry.eval?VC[entry.eval.verdict]||AM:"#444";
                  return(
                    <div key={entry.id} onClick={()=>loadHist(entry)} style={{background:isActive?RED+"18":"#111",border:"1px solid "+(isActive?RED:BDR),borderRadius:5,padding:"6px 9px",cursor:"pointer",transition:"all 0.15s"}}>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        {isActive&&<div style={{width:5,height:5,borderRadius:"50%",background:RED,flexShrink:0}}/>}
                        <div style={{fontSize:10,fontWeight:isActive?700:500,color:isActive?W:"#888",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{entry.headline}</div>
                      </div>
                      <div style={{display:"flex",gap:4,marginTop:3,alignItems:"center"}}>
                        <span style={{fontSize:8,color:"#555"}}>{entry.date}</span>
                        {entry.eval&&<span style={{display:"inline-block",padding:"1px 4px",borderRadius:2,fontSize:8,fontWeight:700,background:vc+"22",color:vc}}>{entry.eval.verdict}</span>}
                        {isActive&&<span style={{fontSize:8,color:RED,fontWeight:700,marginLeft:"auto"}}>ACTIVE</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Hr/>
            </div>
          )}
          <div>
            <Lbl>Blog Topic</Lbl>
            <textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Why urban commuters switch to e-scooters" rows={3} style={{...inp,resize:"vertical"}}/>
            <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>
              {pool.filter(t=>!hist.some(h=>h.topic===t.title)).slice(0,4).map(t=>(
                <button key={t.title} onClick={()=>{setTopic(t.title);setNotes("");}} style={{padding:"2px 6px",borderRadius:10,border:"1px solid #2a2a2a",background:"transparent",color:"#666",fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{t.title.substring(0,22)}...</button>
              ))}
            </div>
          </div>
          <div>
            <Lbl>Length</Lbl>
            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              {LENGTHS.map(l=><button key={l} onClick={()=>setLen(l)} style={{padding:"5px 8px",borderRadius:3,border:"1px solid "+(len===l?RED:BDR),background:len===l?RED+"22":"transparent",color:len===l?RED:W,fontSize:10,cursor:"pointer",fontFamily:"inherit",textAlign:"left",fontWeight:len===l?700:400}}>{l}</button>)}
            </div>
          </div>
          <div>
            <Lbl>Editor Notes</Lbl>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="e.g. Focus on EU markets, mention NQiX 150..." rows={2} style={{...inp,resize:"vertical",fontSize:11}}/>
          </div>
          <div>
            <Lbl>PDF Context (max 3)</Lbl>
            {pdfs.map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#111",border:"1px solid "+GN+"33",borderRadius:4,padding:"4px 8px",marginBottom:3}}>
                <span style={{fontSize:10,color:GN,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:170}}>{p.name}</span>
                <button onClick={()=>setPdfs(prev=>prev.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:"#666",cursor:"pointer",fontSize:11,fontFamily:"inherit",flexShrink:0}}>✕</button>
              </div>
            ))}
            {pdfs.length<3&&<div style={{background:SURF,border:"1px dashed "+BDR,borderRadius:5,padding:8,textAlign:"center",cursor:"pointer"}} onClick={()=>fRef.current?.click()}><input ref={fRef} type="file" accept=".pdf,application/pdf" multiple style={{display:"none"}} onChange={handlePDF}/><div style={{fontSize:10,color:"#555"}}>+ Add PDF ({3-pdfs.length} remaining)</div></div>}
          </div>
          {/* Sanity CMS */}
          <div style={{background:GN+"0a",border:"1px solid "+GN+"22",borderRadius:5,padding:"7px 9px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:GN,flexShrink:0}}/>
              <div style={{fontSize:10,color:GN,fontWeight:600}}>Sanity CMS — token loaded</div>
            </div>
            <div style={{fontSize:9,color:"#777",marginBottom:4}}>Project ID</div>
            <input value={sanityProjectId} onChange={e=>setSanityProjectId(e.target.value)} placeholder="e.g. abc123xy (from sanity.io/manage)" style={{width:"100%",background:"#111",border:"1px solid "+BDR,borderRadius:4,padding:"5px 8px",color:W,fontSize:10,fontFamily:"monospace",outline:"none",boxSizing:"border-box"}}/>
            {!sanityProjectId&&<div style={{fontSize:9,color:AM,marginTop:3}}>Enter Project ID to enable push</div>}
          </div>
          {pushResult&&(
            <div style={{background:pushResult.ok?GN+"12":RED+"12",border:"1px solid "+(pushResult.ok?GN:RED)+"40",borderRadius:6,padding:"10px 11px"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:pushResult.ok?6:0}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:pushResult.ok?GN:RED,color:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,flexShrink:0}}>{pushResult.ok?"✓":"!"}</div>
                <div style={{fontSize:10,fontWeight:700,color:pushResult.ok?GN:"#ffaaaa"}}>{pushResult.ok?"Pushed to Sanity":"Push failed"}</div>
                <button onClick={()=>setPushResult(null)} style={{marginLeft:"auto",background:"transparent",border:"none",color:"#555",cursor:"pointer",fontSize:11,lineHeight:1}}>✕</button>
              </div>
              {pushResult.ok&&<div style={{fontSize:10,color:"#ccc",lineHeight:1.5}}>{pushResult.msg}{pushResult.docId&&<div style={{marginTop:4,fontSize:9,color:"#666",fontFamily:"monospace",wordBreak:"break-all"}}>ID: {pushResult.docId}</div>}</div>}
              {!pushResult.ok&&<div style={{fontSize:10,color:"#ffaaaa",lineHeight:1.5,marginTop:2}}>{pushResult.msg}</div>}
            </div>
          )}
          <Hr/>
          <div style={{background:mode==="lite"?GN+"0a":BL+"0a",border:"1px solid "+(mode==="lite"?GN:BL)+"22",borderRadius:5,padding:"6px 9px"}}>
            <div style={{fontSize:10,fontWeight:700,color:mode==="lite"?GN:BL,marginBottom:2}}>{mode==="lite"?"Lite Mode":"Research Mode"}</div>
            <div style={{fontSize:9,color:"#666"}}>{mode==="lite"?"~80% fewer tokens.":"Live web search."}</div>
          </div>
          {err&&<div style={{background:RED+"15",border:"1px solid "+RED+"40",borderRadius:5,padding:"6px 9px",color:"#ffaaaa",fontSize:10,lineHeight:1.5}}><strong>Error:</strong> {err}</div>}
          {cancelled&&!busy&&<div style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:5,padding:"6px 9px",fontSize:10,color:"#888",textAlign:"center"}}>Pipeline cancelled. Ready to run again.</div>}
          <Btn onClick={run} disabled={busy} variant="primary" fullWidth>{busy&&!rev&&!tring?"Processing...":"Run Pipeline"}</Btn>
          <button
            onClick={onLogout}
            style={{width:"100%",padding:"7px",borderRadius:5,border:"1px solid #2a2a2a",background:"transparent",color:"#555",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#E4002B44";e.currentTarget.style.color="#E4002B";e.currentTarget.style.background="#E4002B0a";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#2a2a2a";e.currentTarget.style.color="#555";e.currentTarget.style.background="transparent";}}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div style={{flex:1,overflowY:"auto",padding:"18px 22px"}}>
          {(busy&&!rev&&!tring)&&<CancelSpin label={phase==="researching"?"Researching keywords...":phase==="writing"?"Writing article...":"Brand safety check..."} phase={phase} onCancel={cancelRun}/>}
          {rev&&<Spin label="Applying feedback..."/>}
          {tring&&(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"40px 0"}}>
              <div style={{width:36,height:36,borderRadius:"50%",border:"3px solid #333",borderTop:"3px solid "+GN,animation:"sp 0.8s linear infinite"}}/>
              <div style={{color:W,fontSize:13,fontWeight:500}}>Translating all languages...</div>
              <div style={{width:320,maxWidth:"90%"}}>
                {Object.entries(LANGS).map(([code,cfg])=>{
                  const st=trS[code];
                  const done=st==="done";
                  const errored=(st||"").startsWith("error");
                  const running=st==="running";
                  return(
                    <div key={code} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <div style={{width:28,fontSize:10,fontWeight:700,color:cfg.color}}>{cfg.code}</div>
                      <div style={{flex:1,background:"#222",borderRadius:3,height:6,overflow:"hidden"}}>
                        <div style={{
                          height:"100%",borderRadius:3,
                          background:done?GN:errored?RED:rateLimited?AM+"88":running?cfg.color+"88":"#333",
                          width:done?"100%":rateLimited?"45%":running?"60%":"0%",
                          transition:"width 0.4s ease"
                        }}/>
                      </div>
                      <div style={{width:70,fontSize:9,color:done?GN:errored?RED:running?cfg.color:"#555",fontWeight:600}}>
                        {done?"Done":errored?"Failed":rateLimited?"Rate limited...":running?"Translating...":"Waiting"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HOME */}
          {!busy&&tab==="home"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20,maxWidth:780}}>
              <div style={{background:"linear-gradient(135deg,"+RED+"20,transparent 60%)",border:"1px solid "+RED+"30",borderRadius:10,padding:"26px 28px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><Logo/><div><div style={{fontWeight:900,fontSize:18,color:W}}>NIU Blog Studio</div><div style={{fontSize:11,color:"#555"}}>AI-powered content for global.niu.com/blog</div></div></div>
                <p style={{color:W,fontSize:13,lineHeight:1.7,margin:"0 0 14px",maxWidth:480}}>Research-backed, brand-safe blog articles with product backlinks, SEO and GEO optimisation, Sanity CMS integration, and four-language localisation.</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[["Job Queue",AM],["Hybrid Models",BL],["4 Languages",RED],["Sanity CMS",GN]].map(([l,c])=><Pill key={l} color={c}>{l}</Pill>)}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[{id:"lite",l:"Lite Mode",d:"~80% fewer tokens. Model knowledge. Best for regular use.",c:GN},{id:"research",l:"Research Mode",d:"Live web search. Real stats from IEA, BloombergNEF, Statista.",c:BL}].map(m=>(
                  <div key={m.id} onClick={()=>setMode(m.id)} style={{background:mode===m.id?m.c+"10":PANEL,border:"1px solid "+(mode===m.id?m.c:BDR),borderRadius:7,padding:14,cursor:"pointer"}}>
                    <div style={{fontWeight:700,fontSize:12,color:mode===m.id?m.c:W,marginBottom:4}}>{m.l}</div>
                    <div style={{fontSize:10,color:"#666"}}>{m.d}</div>
                    {mode===m.id&&<div style={{marginTop:6,fontSize:9,color:m.c,fontWeight:700}}>Active</div>}
                  </div>
                ))}
              </div>
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div><div style={{fontWeight:800,fontSize:14,color:W}}>Suggested Topics</div><div style={{fontSize:10,color:"#555",marginTop:2}}>Used topics are automatically replaced</div></div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}><Pill color={BL}>{pool.length} shown</Pill>{poolOff<ALL_TOPICS.length&&<Pill color="#555">{ALL_TOPICS.length-poolOff} more</Pill>}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {pool.map((t,i)=>{const used=hist.some(h=>h.topic===t.title);const isNew=!!t.isNew;return(
                    <div key={t.title+i} onClick={()=>{setTopic(t.title);setNotes("");}} style={{background:used?SURF:PANEL,border:"1px solid "+(isNew&&!used?GN+"66":BDR),borderLeft:"3px solid "+(used?"#333":isNew?GN:RED),borderRadius:5,padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:9,opacity:used?0.5:1}}>
                      <div style={{width:17,height:17,borderRadius:"50%",background:used?"#2a2a2a":isNew?GN+"22":RED+"22",color:used?"#555":isNew?GN:RED,fontSize:8,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                          <div style={{fontWeight:700,fontSize:12,color:used?"#666":W}}>{t.title}</div>
                          {isNew&&!used&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:GN+"22",color:GN,fontWeight:700,textTransform:"uppercase",flexShrink:0}}>New</span>}
                          {used&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:"#333",color:"#555",fontWeight:700,textTransform:"uppercase",flexShrink:0}}>Used</span>}
                        </div>
                        <div style={{fontSize:10,color:used?"#444":"#666"}}>{t.angle}</div>
                      </div>
                      {!used&&<div style={{fontSize:9,color:isNew?GN:RED,fontWeight:700,flexShrink:0,padding:"3px 7px",border:"1px solid "+(isNew?GN:RED)+"33",borderRadius:3}}>Use</div>}
                    </div>
                  );})}
                </div>
                {poolOff<ALL_TOPICS.length&&<button onClick={loadMore} style={{width:"100%",marginTop:8,padding:"8px",borderRadius:5,border:"1px dashed "+BDR,background:"transparent",color:"#555",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>+ Load more topics ({ALL_TOPICS.length-poolOff} available)</button>}
              </div>
            </div>
          )}

          {/* ALL BLOGS */}
          {!busy&&tab==="history"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:780}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div><div style={{fontWeight:800,fontSize:16,color:W}}>All Generated Blogs</div><div style={{fontSize:11,color:"#555",marginTop:2}}>{hist.length} article{hist.length!==1?"s":""} this session</div></div>
                {hist.length>0&&<Btn onClick={()=>{setHist([]);setActiveHistId(null);}} variant="ghost">Clear all</Btn>}
              </div>
              {hist.length===0?(<div style={{background:PANEL,border:"1px solid "+BDR,borderRadius:8,padding:"32px 20px",textAlign:"center"}}><div style={{fontSize:28,marginBottom:10}}>📝</div><div style={{fontWeight:700,color:"#555",marginBottom:16}}>No blogs yet</div><Btn onClick={()=>setTab("home")} variant="primary">Go to Home</Btn></div>):(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {hist.map(entry=>{
                    const isV=histV===entry.id;const isActive=activeHistId===entry.id;const vc=entry.eval?VC[entry.eval.verdict]||AM:"#444";
                    return(
                      <div key={entry.id}>
                        <div style={{background:isActive?RED+"10":PANEL,border:"2px solid "+(isActive?RED:BDR),borderRadius:8,padding:"12px 16px",cursor:"pointer"}} onClick={()=>setHistV(isV?null:entry.id)}>
                          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>{isActive&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:3,background:RED,color:W,fontWeight:800,flexShrink:0}}>ACTIVE</span>}<div style={{fontWeight:700,fontSize:13,color:isActive?W:"#ccc",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.headline}</div></div>
                              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:10,color:"#555"}}>{entry.date} at {entry.time}</span><Pill color={entry.mode==="lite"?GN:BL}>{entry.mode==="lite"?"Lite":"Research"}</Pill>{entry.eval&&<Pill color={vc}>{entry.eval.verdict}</Pill>}</div>
                            </div>
                            <div style={{display:"flex",gap:6,flexShrink:0,alignItems:"center"}}><Btn onClick={e=>{e.stopPropagation();loadHist(entry);}} variant={isActive?"ghost":"primary"}>{isActive?"Reload":"Load"}</Btn><span style={{fontSize:11,color:"#555",transform:isV?"rotate(180deg)":"none",display:"inline-block"}}>▾</span></div>
                          </div>
                        </div>
                        {isV&&(
                          <div style={{background:"#0d0d0d",border:"1px solid "+BDR,borderTop:"none",borderRadius:"0 0 8px 8px",padding:"16px 18px",maxHeight:380,overflowY:"auto"}}>
                            <div style={{fontSize:9,color:RED,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:8}}>Preview</div>
                            <ArtMD md={(entry.art.article||"").slice(0,1200)+((entry.art.article||"").length>1200?"\n\n...":"")}/>
                            <div style={{marginTop:12,display:"flex",gap:6}}>
                              <CBtn text={"# "+entry.headline+"\n\n"+(entry.art.article||"")+"\n\n---\nMeta: "+(entry.art.meta||"")} label="Copy Markdown"/>
                              <CBtn text={entry.headline+"\n\n"+mdPlain(entry.art.article)+"\n\n---\nMeta: "+(entry.art.meta||"")} label="Copy for Publishing" variant="primary"/>
                              <Btn onClick={()=>loadHist(entry)} variant="amber">Load into Editor</Btn>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* KEYWORDS */}
          {!busy&&tab==="keywords"&&res&&(
            <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:900}}>
              <div style={{background:SURF,border:"1px solid "+BDR,borderRadius:8,padding:"14px 16px"}}>
                <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#666",marginBottom:10}}>Legend</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 20px"}}>
                  <div><div style={{fontSize:10,fontWeight:700,color:W,marginBottom:6}}>Search Intent</div>{[{l:"Informational",c:BL,d:"User wants to learn. Good for educational content."},{l:"Navigational",c:GN,d:"User looking for a specific brand or page."},{l:"Commercial",c:"#E8FF47",d:"User comparing options before buying."},{l:"Transactional",c:AM,d:"User ready to buy. Use in CTAs."}].map(({l,c,d})=>(<div key={l} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}><span style={{display:"inline-block",padding:"2px 7px",borderRadius:3,fontSize:9,fontWeight:700,textTransform:"uppercase",background:c+"22",color:c,border:"1px solid "+c+"33",flexShrink:0,marginTop:1}}>{l}</span><span style={{fontSize:10,color:"#888",lineHeight:1.4}}>{d}</span></div>))}</div>
                  <div><div style={{fontSize:10,fontWeight:700,color:W,marginBottom:6}}>Difficulty & Status</div>{[{l:"Low",c:GN,d:"Easier to rank. Prioritise first."},{l:"Medium",c:AM,d:"Moderate competition."},{l:"High",c:RED,d:"Very competitive."}].map(({l,c,d})=>(<div key={l} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}><span style={{display:"inline-block",padding:"2px 7px",borderRadius:3,fontSize:9,fontWeight:700,textTransform:"uppercase",background:c+"22",color:c,border:"1px solid "+c+"33",flexShrink:0,marginTop:1}}>{l}</span><span style={{fontSize:10,color:"#888",lineHeight:1.4}}>{d}</span></div>))}{[{l:"non-branded",c:GN,d:"60%+ target. No NIU product names."},{l:"branded",c:AM,d:"Max 40%. Mentions NIU/KQi/NQiX."},{l:"-> intro",c:"#9B59B6",d:"Suggested article section."},{l:"found",c:GN,d:"Confirmed present in article."},{l:"check",c:AM,d:"Not confirmed — use Add to article."},{l:"GEO",c:"#E8FF47",d:"AI/voice search phrase."}].map(({l,c,d})=>(<div key={l} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}><span style={{display:"inline-block",padding:"2px 7px",borderRadius:3,fontSize:9,fontWeight:700,textTransform:"uppercase",background:c+"22",color:c,border:"1px solid "+c+"33",flexShrink:0,marginTop:1}}>{l}</span><span style={{fontSize:10,color:"#888",lineHeight:1.4}}>{d}</span></div>))}</div>
                </div>
              </div>
              {res.trending_angle&&<div style={{background:RED+"08",border:"1px solid "+RED+"22",borderRadius:6,padding:"9px 12px"}}><div style={{fontSize:9,color:RED,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:2}}>Trending Angle</div><div style={{fontSize:12,color:W,fontStyle:"italic"}}>"{res.trending_angle}"</div></div>}
              {(res.seo_keywords||[]).length>0&&(()=>{const total=(res.seo_keywords||[]).length;const branded=(res.seo_keywords||[]).filter(k=>k.branded===true).length;const pct=Math.round(((total-branded)/total)*100);const col=pct>=60?GN:pct>=40?AM:RED;return(<div style={{background:col+"0a",border:"1px solid "+col+"33",borderRadius:6,padding:"9px 12px",display:"flex",alignItems:"center",gap:12}}><div style={{flex:1}}><div style={{fontSize:10,fontWeight:700,color:col,marginBottom:2}}>Non-Branded Keywords: {pct}%</div><div style={{background:"#222",borderRadius:2,height:4}}><div style={{width:pct+"%",height:"100%",background:col,borderRadius:2}}/></div></div><div style={{fontSize:9,color:"#666"}}>Target: 60%+</div></div>);})()}
              <div style={{display:"grid",gridTemplateColumns:art?"1fr 1fr":"1fr",gap:14}}>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div><Lbl>SEO Keywords</Lbl>{(res.seo_keywords||[]).map((k,i)=><KwRow key={i} kw={k} art={art} kwMap={res.keyword_map||{}} onApply={p=>setArt(a=>({...a,article:(a?.article||"")+p}))}/>)}</div>
                  <div><Lbl>GEO / AI Search Phrases</Lbl>{(res.geo_phrases||[]).map((p,i)=><div key={i} style={{background:SURF,border:"1px solid "+BDR,borderRadius:5,padding:"6px 10px",display:"flex",alignItems:"center",gap:7,marginBottom:4}}><span style={{color:"#E8FF47",fontSize:9,fontWeight:700}}>GEO</span><span style={{fontSize:11,color:W,flex:1}}>"{p}"</span></div>)}</div>
                  {(res.data_points||[]).length>0&&<div><Lbl>Data Points</Lbl>{(res.data_points||[]).map((d,i)=><div key={i} style={{background:SURF,border:"1px solid "+BDR,borderRadius:6,padding:"8px 11px",marginBottom:4}}><div style={{fontSize:12,color:W,fontWeight:600,lineHeight:1.5}}>"{d.stat}"</div><div style={{marginTop:3,display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}><Pill color={BL}>{d.source}</Pill>{d.year&&<span style={{fontSize:9,color:"#555"}}>{d.year}</span>}{d.url&&d.url!=="s"&&d.url.startsWith("http")&&!d.url.match(/\.(com|de|fr|it|es|uk|io|net|org)\/?$/)&&<a href={d.url} target="_blank" rel="noopener" style={{display:"inline-block",padding:"2px 8px",borderRadius:3,fontSize:9,fontWeight:700,background:BL+"18",color:BL,border:"1px solid "+BL+"33",textDecoration:"none"}}>View Source</a>}</div></div>)}</div>}
                  {verifiedSources.length>0&&(
                    <div style={{marginTop:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <Lbl>Verified Sources</Lbl>
                        <span style={{fontSize:9,padding:"2px 6px",borderRadius:3,background:GN+"22",color:GN,fontWeight:700}}>LIVE CONFIRMED</span>
                      </div>
                      {verifiedSources.map((s,i)=>(
                        <div key={i} style={{background:"#0a1a0a",border:"1px solid "+GN+"33",borderRadius:6,padding:"8px 11px",marginBottom:5}}>
                          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                            <div style={{width:7,height:7,borderRadius:"50%",background:GN,flexShrink:0}}/>
                            <span style={{fontSize:10,fontWeight:700,color:GN}}>{s.source}</span>
                            <a href={s.url} target="_blank" rel="noopener" style={{marginLeft:"auto",fontSize:9,padding:"2px 8px",borderRadius:3,background:GN+"18",color:GN,border:"1px solid "+GN+"33",textDecoration:"none",flexShrink:0}}>View Article</a>
                          </div>
                          {s.stat&&<div style={{fontSize:11,color:W,lineHeight:1.5,fontStyle:"italic"}}>"{s.stat.slice(0,140)+(s.stat.length>140?"...":"")}"</div>}
                          <div style={{fontSize:9,color:"#555",marginTop:3,wordBreak:"break-all"}}>{s.url}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {(res.yt_sources||[]).length>0&&<div style={{marginTop:8}}><Lbl>YouTube Sources Found</Lbl>{(res.yt_sources||[]).map((v,i)=><div key={i} style={{background:SURF,border:"1px solid #ff000033",borderRadius:5,padding:"6px 10px",marginBottom:4,display:"flex",alignItems:"center",gap:8}}><div style={{width:18,height:18,borderRadius:3,background:"#ff0000",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:W,fontSize:8,fontWeight:900}}>▶</span></div><div style={{flex:1}}><div style={{fontSize:11,color:W,fontWeight:600}}>{v.title}</div><div style={{fontSize:9,color:"#888"}}>{v.channel}</div></div>{v.url&&v.url.startsWith("http")&&<a href={v.url} target="_blank" rel="noopener" style={{fontSize:9,color:"#ff6666",textDecoration:"underline",flexShrink:0}}>Watch</a>}</div>)}</div>}
                </div>
                {art&&(
                  <div>
                    <Lbl>Article Preview — Keyword Highlights</Lbl>
                    <div style={{display:"flex",gap:10,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:12,height:8,borderRadius:2,background:BL+"44",borderBottom:"2px solid "+BL}}></span><span style={{fontSize:9,color:"#888"}}>SEO keyword</span></div>
                      <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:12,height:8,borderRadius:2,background:"#E8FF4744",borderBottom:"2px solid #E8FF47"}}></span><span style={{fontSize:9,color:"#888"}}>GEO phrase</span></div>
                    </div>
                    <div style={{background:"#0d0d0d",border:"1px solid "+BDR,borderRadius:8,padding:"16px 18px",maxHeight:600,overflowY:"auto",fontSize:12,lineHeight:1.7,color:W}}>
                      <div dangerouslySetInnerHTML={{__html:buildHL(art.article,res.seo_keywords,res.geo_phrases)}}/>
                    </div>
                  </div>
                )}
                {!art&&<div style={{background:SURF,border:"1px dashed "+BDR,borderRadius:8,padding:20,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center"}}><div><div style={{fontSize:12,color:"#555",marginBottom:4}}>Article preview</div><div style={{fontSize:10,color:"#333"}}>Run the pipeline to see keywords highlighted</div></div></div>}
              </div>
            </div>
          )}

          {/* ARTICLE */}
          {!busy&&tab==="article"&&art&&(
            <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:720}}>
              <div style={{background:"linear-gradient(90deg,"+RED+"18,transparent)",border:"1px solid "+RED+"28",borderRadius:7,padding:"10px 13px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
                <div><div style={{fontSize:11,fontWeight:700,color:RED}}>Ready to publish</div><div style={{fontSize:10,color:W}}>Clean text for CMS</div></div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  <CBtn text={"# "+curH+"\n\n"+(art.article||"")+"\n\n---\nMeta: "+(art.meta||"")} label="Copy Markdown"/>
                  <CBtn text={curH+"\n\n"+mdPlain(art.article)+"\n\n---\nMeta: "+(art.meta||"")} label="Copy for Publishing" variant="primary"/>
                  {res&&<Btn onClick={()=>setShowHL(h=>!h)} variant={showHL?"amber":"ghost"}>{showHL?"Hide Keywords":"Show Keywords"}</Btn>}
                  <Btn onClick={()=>{if(!edit){setDraft(art.article||"");setEdit(true);}else{setArt(a=>({...a,article:draft}));setEdit(false);}}} variant={edit?"green":"ghost"}>{edit?"Save Edits":"Edit Article"}</Btn>
                  <Btn onClick={()=>{setPushResult(null);pushBlog("en",curH,art.article||"",art.meta||"");}} disabled={pushing||!sanityProjectId} variant="blue">{pushing?"Pushing...":"Push to Sanity"}</Btn>
                </div>
              </div>
              {ev&&(()=>{const col=VC[ev.verdict]||AM;return(<div style={{background:col+"10",border:"1px solid "+col+"28",borderRadius:5,padding:"6px 10px",display:"flex",alignItems:"center",gap:7}}><div style={{width:17,height:17,borderRadius:"50%",background:col,color:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:900,flexShrink:0}}>{ev.verdict==="APPROVED"?"OK":"!"}</div><div><div style={{fontWeight:700,fontSize:10,color:col}}>{ev.verdict}</div><div style={{fontSize:10,color:W}}>{ev.verdict_reason}</div></div></div>);})()}
              {flagHighlight&&tab==="article"&&(
                <div style={{background:"#00C85314",border:"1px solid #00C85344",borderRadius:6,padding:"9px 14px",display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:GN,color:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,flexShrink:0}}>✓</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:11,color:GN,marginBottom:3}}>Edit applied successfully</div><div style={{fontSize:10,color:"#aaa",fontStyle:"italic",lineHeight:1.5}}>"{flagHighlight}..."</div></div>
                  <button onClick={()=>setFlagHighlight(null)} style={{background:"transparent",border:"none",color:"#555",cursor:"pointer",fontSize:13,lineHeight:1,flexShrink:0}}>✕</button>
                </div>
              )}
              {pushResult?.ok&&tab==="article"&&(
                <div style={{background:GN+"14",border:"1px solid "+GN+"44",borderRadius:6,padding:"10px 14px",display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:GN,color:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,flexShrink:0}}>✓</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:11,color:GN,marginBottom:3}}>Article pushed to Sanity as draft</div><div style={{fontSize:10,color:"#ccc",lineHeight:1.5}}>Saved to your Blog Posts collection. Log in to Sanity Studio to review and publish when ready.</div>{pushResult.docId&&<div style={{fontSize:9,color:"#666",marginTop:4,fontFamily:"monospace"}}>Draft ID: {pushResult.docId}</div>}</div>
                  <button onClick={()=>setPushResult(null)} style={{background:"transparent",border:"none",color:"#555",cursor:"pointer",fontSize:13,lineHeight:1,flexShrink:0}}>✕</button>
                </div>
              )}
              <div style={{background:PANEL,borderRadius:9,padding:"20px 24px",border:"1px solid "+BDR}}>
                <div style={{marginBottom:12,paddingBottom:10,borderBottom:"1px solid "+BDR}}>
                  <div style={{fontSize:"1.2rem",fontWeight:900,lineHeight:1.3,color:W,letterSpacing:"-0.4px"}}>{curH}</div>
                  <div style={{marginTop:7,display:"flex",gap:4,flexWrap:"wrap"}}><Pill color={RED}>NIU Blog</Pill>{revN>0&&<Pill color={AM}>{revN} revision{revN>1?"s":""}</Pill>}</div>
                </div>
                {edit?(<div><div style={{fontSize:10,color:AM,marginBottom:6,fontWeight:600}}>Editing — click Save Edits when done</div><textarea value={draft} onChange={e=>setDraft(e.target.value)} style={{width:"100%",minHeight:400,background:"#111",border:"1px solid "+AM,borderRadius:6,padding:14,color:W,fontSize:13,lineHeight:1.8,fontFamily:"'Courier New',monospace",outline:"none",boxSizing:"border-box",resize:"vertical"}}/><div style={{display:"flex",gap:8,marginTop:8}}><Btn onClick={()=>{setArt(a=>({...a,article:draft}));setEdit(false);}} variant="green">Save Edits</Btn><Btn onClick={()=>setEdit(false)} variant="ghost">Cancel</Btn></div></div>)
                :showHL&&res?(<div><div style={{display:"flex",gap:10,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}><div style={{fontSize:10,color:AM,fontWeight:600}}>SEO keyword highlighting active</div><div style={{display:"flex",gap:8}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:12,height:8,borderRadius:2,background:BL+"44",borderBottom:"2px solid "+BL}}></span><span style={{fontSize:9,color:"#888"}}>SEO</span></div><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:12,height:8,borderRadius:2,background:"#E8FF4744",borderBottom:"2px solid #E8FF47"}}></span><span style={{fontSize:9,color:"#888"}}>GEO</span></div></div></div><div dangerouslySetInnerHTML={{__html:buildHL(art.article,res?.seo_keywords,res?.geo_phrases)}}/></div>)
                :(<ArtMD md={art.article||""}/>)}
              </div>
              {/* Feedback — only on article tab */}
              <div style={{background:DARK,border:"1px solid "+BDR,borderRadius:9,padding:"16px 20px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{fontWeight:700,fontSize:13,color:W}}>Feedback</div>
                  {revN>0&&<Pill color={AM}>{revN} revision{revN>1?"s":""}</Pill>}
                  <div style={{fontSize:11,color:"#555",marginLeft:"auto"}}>Describe changes to update the article</div>
                </div>
                {revMsg&&<div style={{background:GN+"10",border:"1px solid "+GN+"28",borderRadius:4,padding:"6px 10px",marginBottom:8,fontSize:10,color:W}}><span style={{color:GN,fontWeight:700}}>Last update: </span>{revMsg}</div>}
                <textarea value={fb} onChange={e=>setFb(e.target.value)} placeholder="e.g. Strengthen the opening paragraph, add more EU city data, reference KQi3 Pro in the conclusion..." rows={3} style={{width:"100%",background:SURF,border:"1px solid "+BDR,borderRadius:5,padding:"9px 11px",color:W,fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box",resize:"vertical",lineHeight:1.6}}/>
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <Btn onClick={applyFB} disabled={rev||!fb.trim()} variant="amber">{rev?"Revising...":"Apply Feedback"}</Btn>
                  {fb.trim()&&<Btn onClick={()=>setFb("")} variant="ghost">Clear</Btn>}
                </div>
              </div>
            </div>
          )}

          {/* HEADLINES */}
          {!busy&&tab==="headlines"&&art&&<HeadlinesTab art={art} selH={selH} setSelH={setSelH} setArt={setArt} topic={topic}/>}

          {/* META */}
          {!busy&&tab==="meta"&&art&&(
            <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:560}}>
              <div style={{background:PANEL,borderRadius:7,padding:"13px 15px",border:"1px solid "+BDR}}><Lbl>Meta Description</Lbl><p style={{fontSize:12,lineHeight:1.65,color:W,margin:0}}>{art.meta}</p><div style={{marginTop:7,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{fontSize:10,color:(art.meta||"").length<=155?GN:RED}}>{(art.meta||"").length}/155</div><CBtn text={art.meta||""}/></div></div>
              <div style={{background:W,borderRadius:7,padding:"13px 15px"}}><div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Google Preview</div><div style={{fontSize:11,color:"#006621",marginBottom:2}}>global.niu.com/blog</div><div style={{fontSize:15,color:"#1a0dab",marginBottom:3,lineHeight:1.3}}>{curH}</div><div style={{fontSize:12,color:"#4d5156",lineHeight:1.5}}>{art.meta}</div></div>
            </div>
          )}

          {/* SOCIAL */}
          {!busy&&tab==="social"&&art&&(
            <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:680}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:24,height:24,borderRadius:4,background:"#0077b5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:W,fontSize:11,fontWeight:900}}>in</span></div><div style={{fontWeight:700,fontSize:13,color:W}}>LinkedIn</div><div style={{fontSize:10,color:"#555",marginLeft:4}}>Professional, thought-leadership tone</div></div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {(art.linkedin&&art.linkedin.length>0?art.linkedin:art.captions||[]).slice(0,3).map((c,i)=>(
                    <div key={i} style={{background:PANEL,border:"1px solid #0077b533",borderRadius:7,padding:"11px 14px",display:"flex",gap:8,alignItems:"flex-start"}}><div style={{width:18,height:18,borderRadius:3,background:"#0077b522",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"#0077b5",flexShrink:0}}>{i+1}</div><p style={{flex:1,margin:0,fontSize:11,lineHeight:1.75,color:W}}>{c}</p><CBtn text={c} label="Copy"/></div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:24,height:24,borderRadius:4,background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:W,fontSize:10,fontWeight:900}}>f</span></div><div style={{fontWeight:700,fontSize:13,color:W}}>Meta (Facebook / Instagram)</div><div style={{fontSize:10,color:"#555",marginLeft:4}}>Human, approachable, well-written</div></div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {(art.meta_captions&&art.meta_captions.length>0?art.meta_captions:art.captions||[]).slice(0,3).map((c,i)=>(
                    <div key={i} style={{background:PANEL,border:"1px solid #e1306c33",borderRadius:7,padding:"11px 14px",display:"flex",gap:8,alignItems:"flex-start"}}><div style={{width:18,height:18,borderRadius:3,background:"#e1306c22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"#e1306c",flexShrink:0}}>{i+1}</div><p style={{flex:1,margin:0,fontSize:11,lineHeight:1.75,color:W}}>{c}</p><CBtn text={c} label="Copy"/></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EVALUATION */}
          {!busy&&tab==="evaluation"&&ev&&(()=>{
            const sc=ev.scores||{};const tot=ev.total||Object.values(sc).reduce((a,b)=>a+(b||0),0);const col=VC[ev.verdict]||AM;
            return(
              <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:660}}>
                <div style={{background:col+"10",border:"1px solid "+col+"36",borderRadius:9,padding:"13px 15px",display:"flex",alignItems:"center",gap:12}}><div style={{width:30,height:30,borderRadius:"50%",background:col,color:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,flexShrink:0}}>{ev.verdict==="APPROVED"?"OK":"!"}</div><div style={{flex:1}}><div style={{fontWeight:800,fontSize:13,color:col}}>{ev.verdict}</div><div style={{fontSize:11,color:W,marginTop:2}}>{ev.verdict_reason}</div></div><div style={{fontSize:24,fontWeight:900,color:col}}>{tot}</div></div>
                <div style={{background:PANEL,borderRadius:8,padding:"13px 15px",border:"1px solid "+BDR}}><Lbl>Scores — {tot}/100</Lbl>{[["brand_safety","Brand Safety"],["factual_accuracy","Factual Accuracy"],["seo_quality","SEO Quality"],["legal_regulatory","Legal"],["brand_tone","Brand Tone"]].map(([k,l])=><SBar key={k} label={l} val={sc[k]||0} prev={prevScores?prevScores[k]:null}/>)}</div>
                {(ev.flags||[]).length>0&&(
                  <div style={{background:PANEL,borderRadius:8,padding:"13px 15px",border:"1px solid "+BDR}}>
                    <Lbl>Flags & Actions</Lbl>
                    {ev.flags.map((f,i)=>{const fc=f.severity==="block"?RED:f.severity==="warning"?AM:GN;const applying=apF===i;return(
                      <div key={i} style={{background:fc+"08",border:"1px solid "+(f.applied?"#282828":fc+"22"),borderRadius:5,padding:"8px 10px",marginBottom:6,opacity:f.applied?0.5:1}}>
                        <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:3}}><Pill color={f.applied?"#555":fc}>{f.applied?"applied":f.severity}</Pill><span style={{fontSize:10,fontWeight:700,color:W}}>{f.area}</span></div>
                        <div style={{fontSize:11,color:W,marginBottom:4}}>{f.detail}</div>
                        {f.suggestion&&<div style={{fontSize:10,color:"#aaa",borderLeft:"2px solid "+fc,paddingLeft:6,marginBottom:5,fontStyle:"italic"}}>{f.suggestion}</div>}
                        {f.suggested_edit&&!f.applied&&(<div><div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>Suggested edit</div><div style={{background:"#111",borderRadius:3,padding:"5px 8px",fontSize:10,color:W,marginBottom:5,lineHeight:1.5}}>{f.suggested_edit}</div><Btn onClick={()=>applyFlag(f,i)} disabled={applying} variant="amber">{applying?"Applying...":"Apply & View"}</Btn></div>)}
                        {f.applied&&<div style={{fontSize:9,color:"#555",fontStyle:"italic"}}>Applied — view in Article tab</div>}
                      </div>
                    );})}
                  </div>
                )}
                {ev.editor_notes&&<div style={{background:PANEL,borderRadius:6,padding:"10px 12px",border:"1px solid "+BDR}}><Lbl>Editor Notes</Lbl><p style={{margin:0,fontSize:11,color:W,lineHeight:1.65}}>{ev.editor_notes}</p></div>}
              </div>
            );
          })()}

          {/* TRANSLATIONS */}
          {!busy&&tab==="translations"&&(
            <div style={{display:"flex",flexDirection:"column",gap:11,maxWidth:740}}>
              {!tr?(<div style={{background:PANEL,borderRadius:9,padding:"26px 20px",border:"1px solid "+BDR,textAlign:"center"}}><div style={{fontWeight:800,fontSize:18,color:W,marginBottom:6}}>EN  DE  FR  ES  IT</div><div style={{fontSize:11,color:"#666",marginBottom:14}}>4 parallel calls. Auto-retry on rate limits. Locale-specific product URLs.</div><Btn onClick={runAllTr} variant="primary">Translate Now</Btn></div>):(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    <button onClick={()=>setLangT("en")} style={{padding:"6px 12px",borderRadius:5,border:"1px solid "+(langT==="en"?W:BDR),background:langT==="en"?W+"18":"transparent",color:langT==="en"?W:"#666",fontWeight:langT==="en"?700:400,fontSize:11,cursor:"pointer",fontFamily:"inherit",minWidth:62,textAlign:"center"}}><div style={{fontWeight:800,fontSize:11}}>EN</div><div style={{fontSize:9,marginTop:1}}>English</div></button>
                    {Object.entries(LANGS).map(([code,cfg])=>{const active=langT===code;const st=trS[code];const lg=tr[code];const empty=!lg?.article;return(<button key={code} onClick={()=>setLangT(code)} style={{padding:"6px 12px",borderRadius:5,border:"1px solid "+(active?cfg.color:BDR),background:active?cfg.color+"18":"transparent",color:active?cfg.color:W,fontWeight:active?700:400,fontSize:11,cursor:"pointer",fontFamily:"inherit",minWidth:62,textAlign:"center"}}><div style={{fontWeight:800,fontSize:11}}>{cfg.code}</div><div style={{fontSize:9,marginTop:1}}>{st==="running"?"translating...":empty?(st||"error").startsWith("error")?"failed":"retry needed":cfg.label}</div></button>);})}
                  </div>
                  {langT==="en"&&art&&(
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      <div style={{background:"linear-gradient(90deg,#ffffff18,transparent)",border:"1px solid #ffffff28",borderRadius:6,padding:"9px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}><div style={{fontSize:10,fontWeight:700,color:W}}>EN — English (Original)</div><div style={{display:"flex",gap:6}}><CBtn text={"# "+curH+"\n\n"+(art.article||"")+"\n\n---\nMeta: "+(art.meta||"")} label="Copy EN"/><Btn onClick={()=>{setPushResult(null);pushBlog("en",curH,art.article||"",art.meta||"");}} disabled={pushing||!sanityProjectId} variant="blue">{pushing?"Pushing...":"Push EN to Sanity"}</Btn></div></div>
                      <div style={{background:PANEL,borderRadius:8,padding:"18px 22px",border:"1px solid "+BDR}}><div style={{marginBottom:11,paddingBottom:10,borderBottom:"1px solid "+BDR}}><div style={{fontSize:9,color:W,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:3}}>EN Headline</div><div style={{fontSize:"1.1rem",fontWeight:900,lineHeight:1.3,color:W}}>{curH}</div></div><ArtMD md={art.article||""}/></div>
                      <div style={{background:PANEL,borderRadius:5,padding:"9px 12px",border:"1px solid "+BDR,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}><div style={{flex:1}}><Lbl>Meta ({(art.meta||"").length}/155)</Lbl><p style={{margin:0,fontSize:11,color:W,lineHeight:1.6}}>{art.meta}</p></div><CBtn text={art.meta||""}/></div>
                      <div style={{background:PANEL,borderRadius:5,padding:"9px 12px",border:"1px solid "+BDR}}><Lbl>Social — English</Lbl><div style={{display:"flex",flexDirection:"column",gap:4}}>{(art.captions||[]).map((cap,i)=><div key={i} style={{background:"#111",borderRadius:4,padding:"7px 9px",display:"flex",gap:7,alignItems:"flex-start"}}><span style={{color:W,fontSize:9,fontWeight:700,flexShrink:0}}>{"#"+(i+1)}</span><p style={{flex:1,margin:0,fontSize:10,color:W,lineHeight:1.6}}>{cap}</p><CBtn text={cap}/></div>)}</div></div>
                    </div>
                  )}
                  {langT!=="en"&&tr[langT]&&(()=>{
                    const lg=tr[langT];const cfg=LANGS[langT];const empty=!lg.article;
                    if(empty)return(<div style={{background:PANEL,borderRadius:7,padding:16,border:"1px solid "+BDR,textAlign:"center"}}><div style={{color:RED,fontWeight:700,marginBottom:6}}>Translation failed for {cfg.label}</div><Btn onClick={()=>trOne(langT)} variant="primary">Retry {cfg.label}</Btn></div>);
                    const lCopy="# "+lg.headline+"\n\n"+(lg.article||"")+"\n\n---\nMeta: "+(lg.meta||"");
                    return(
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        <div style={{background:"linear-gradient(90deg,"+cfg.color+"18,transparent)",border:"1px solid "+cfg.color+"28",borderRadius:6,padding:"9px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}><div style={{fontSize:10,fontWeight:700,color:cfg.color}}>{cfg.code} — {cfg.label} ready</div><div style={{display:"flex",gap:6}}><CBtn text={lCopy} label={"Copy "+cfg.code}/><Btn onClick={()=>{setPushResult(null);pushBlog(langT,lg.headline,lg.article||"",lg.meta||"");}} disabled={pushing||!sanityProjectId} variant="blue">{pushing?"Pushing...":"Push "+cfg.code+" to Sanity"}</Btn></div></div>
                        <div style={{background:PANEL,borderRadius:8,padding:"18px 22px",border:"1px solid "+BDR}}><div style={{marginBottom:11,paddingBottom:10,borderBottom:"1px solid "+BDR}}><div style={{fontSize:9,color:cfg.color,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:3}}>{cfg.code} Headline</div><div style={{fontSize:"1.1rem",fontWeight:900,lineHeight:1.3,color:W}}>{lg.headline}</div></div><ArtMD md={lg.article||""}/></div>
                        <div style={{background:PANEL,borderRadius:5,padding:"9px 12px",border:"1px solid "+BDR,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}><div style={{flex:1}}><Lbl>Meta ({(lg.meta||"").length}/155)</Lbl><p style={{margin:0,fontSize:11,color:W,lineHeight:1.6}}>{lg.meta}</p></div><CBtn text={lg.meta||""}/></div>
                        <div style={{background:PANEL,borderRadius:5,padding:"9px 12px",border:"1px solid "+BDR}}><Lbl>Social — {cfg.label}</Lbl><div style={{display:"flex",flexDirection:"column",gap:4}}>{(lg.captions||[]).map((cap,i)=><div key={i} style={{background:"#111",borderRadius:4,padding:"7px 9px",display:"flex",gap:7,alignItems:"flex-start"}}><span style={{color:cfg.color,fontSize:9,fontWeight:700,flexShrink:0}}>{"#"+(i+1)}</span><p style={{flex:1,margin:0,fontSize:10,color:W,lineHeight:1.6}}>{cap}</p><CBtn text={cap}/></div>)}</div></div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// Root — handles auth gate before rendering the full app
// Auth state lives here so BlogStudio's hooks always run in full
export default function App(){
  const [authed,setAuthed]=useState(()=>{
    try{return sessionStorage.getItem("niu_auth")==="1";}catch(e){return false;}
  });
  function handleLogout(){
    try{sessionStorage.removeItem("niu_auth");}catch(e){}
    setAuthed(false);
  }
  if(!authed)return <LoginGate onAuth={()=>setAuthed(true)}/>;
  return <BlogStudio onLogout={handleLogout}/>;
}
