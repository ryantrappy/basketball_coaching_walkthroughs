import { coverageVariants, scenarioFor, outcomeFrames, playerCue } from './learning';
import OfflineStatus from './OfflineStatus';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Concept, ConceptGroup, ConceptId, DefenseId, InboundsId, OffenseId, Point, Section, StepIndex, Decision, EntityId, Frame } from './types';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, BookOpen, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Maximize2, Pause, Play, RotateCcw, X } from 'lucide-react';
import { concepts, sources } from './concepts';
import { passingReads, readPath } from './passingReads';
import { defensiveReads } from './defensiveReads';
import ConceptMenu from './ConceptMenu';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import './styles.css';

const views: {id: Section; label: string; defaultLesson: ConceptId}[] = [
 {id:'offense',label:'Offense',defaultLesson:'pick-pop'},
 {id:'defense',label:'Defense',defaultLesson:'drop-coverage'},
 {id:'inbounds',label:'Inbounds',defaultLesson:'box-cross'},
];
const viewLabel = (side: Section) => views.find(view=>view.id===side)!.label;
const sideOf = (concept: Concept): Section => concept.side || 'offense';
const lessonHref = (concept: Concept) => `#${sideOf(concept)==='offense'?'':`${sideOf(concept)}/`}${concept.id}`;
const getConcept = (id: ConceptId): Concept => {
 const concept=concepts.find(c=>c.id===id);
 if(!concept)throw new Error(`Unknown lesson: ${id}`);
 return concept;
};
const conceptFromHash = (): Concept => {
 const hash=window.location.hash.slice(1);
 const view=views.find(item=>item.id===hash.split('/')[0]);
 return concepts.find(c=>c.id===hash.split('/').at(-1)) || getConcept(view?.defaultLesson || 'pick-pop');
};
const mix = (a: Point,b: Point,t: number): Point => [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
const ballAt = (frame: Frame): Point => frame.ballPosition || [frame.players[frame.ball-1][0]+19,frame.players[frame.ball-1][1]-15];
interface CourtProps {
 concept: Concept;
 progress: number;
 defense: boolean;
 paths: boolean;
 reads: boolean;
 focusedRead: number | null;
 showOffense?: boolean;
 decision: Decision;
 player: EntityId | null;
}
function Court({ concept, progress, defense, paths, reads, focusedRead, showOffense = true, decision, player }: CourtProps) {
 const at=Math.min(Math.floor(progress),3) as StepIndex, next=Math.min(at+1,3) as StepIndex, t=progress-at;
 const a=concept.frames[at], b=concept.frames[next];
 const positions=a.players.map((p,i)=>mix(p,b.players[i],t));
 const ball=mix(ballAt(a),ballAt(b),t);
 const target=concept.frames[Math.min(Math.floor(progress)+1,3)];
 const isDefense=sideOf(concept)==='defense';
 const inbound=concept.inbound;
 const showReads=reads && at>=decision.start;
 const routeOrigins=isDefense&&at===3?concept.frames[2].players:positions;
 const passOrigin=inbound&&decision.from===inbound.player?inbound.spot:positions[decision.from-1];
 const routes=decision.options.map(option=>{
  const from=option.from || decision.from;
  const route=readPath(isDefense?routeOrigins[from-1]:passOrigin,option.to?target.players[option.to-1]:option.point,option.bend);
  if(isDefense&&Math.hypot(...target.players[from-1].map((v,i)=>v-routeOrigins[from-1][i]))<60)route.label=[positions[from-1][0]+26,positions[from-1][1]-22];
  return route;
 });
 return <svg className={`court ${isDefense?'defense-court':''} ${inbound?'inbounds-court':''}`} viewBox={inbound?(inbound.edge==='baseline'?'-35 -70 670 565':'-85 -25 720 520'):'0 0 600 470'} role="img" aria-label={`${concept.name}, step ${at+1}: ${concept.steps[at].title}`}>
  <defs><pattern id="grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".5" fill="#fff" opacity=".035"/></pattern><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="#eeb177" strokeWidth="1.6"/></marker><marker id="read-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="context-stroke" strokeWidth="1.6"/></marker></defs>
  <rect x="-85" y="-70" width="755" height="565" fill="#183f36"/><rect x="-85" y="-70" width="755" height="565" fill="url(#grain)"/>
  {inbound&&<rect className="out-of-bounds-strip" x={inbound.edge==='baseline'?-35:-85} y={inbound.edge==='baseline'?-70:-25} width={inbound.edge==='baseline'?670:110} height={inbound.edge==='baseline'?95:520}/> }
  <g className="court-lines" fill="none" stroke="#abc2b4" strokeWidth="1.3" opacity=".53">
   <path d="M25 25H575V445H25Z"/><path d="M212 25V211H388V25 M212 211 A88 88 0 0 0 388 211"/><path d="M212 211 A88 88 0 0 1 388 211" strokeDasharray="5 6"/>
   <path d="M62 25V106 A238 238 0 0 0 538 106V25"/><path d="M265 66H335 M300 66V79"/><circle cx="300" cy="89" r="10" stroke="#eeb177" strokeWidth="2"/><path d="M253 89 A47 47 0 0 0 347 89"/>
   <path d="M247 445 A53 53 0 0 1 353 445"/>
   {[136,158,181].map(y=><path key={y} d={`M203 ${y}h9 M388 ${y}h9`}/>)}
  </g>
  <text x="300" y="414" textAnchor="middle" className="court-watermark">SECOND READ</text>
  {paths && showOffense && positions.slice(0,5).map((p,i)=>(!concept.visiblePlayers||concept.visiblePlayers.includes((i+1) as EntityId))&&Math.hypot(target.players[i][0]-p[0],target.players[i][1]-p[1])>25 && <path key={i} d={`M${p} L${target.players[i]}`} stroke="#eeb177" strokeWidth="2" fill="none" markerEnd="url(#arrow)" opacity={isDefense?.22:showReads?.25:.85}/>)}
  {isDefense&&paths&&positions.slice(5).map((p,i)=>{
   if(showReads&&decision.options.some(option=>option.from===i+6))return null;
   const origin=at===3?concept.frames[2].players[i+5]:p;
   if(Math.hypot(...target.players[i+5].map((v,j)=>v-origin[j]))<12)return null;
   return <path key={i} className="defensive-movement" d={readPath(origin,target.players[i+5],-10).d} markerEnd="url(#read-arrow)"/>;
  })}
  {paths && !showReads && concept.frames[at].pass && (()=>{const [from,to]=concept.frames[at].pass;return <path d={`M${positions[from-1]} L${positions[to-1]}`} stroke="#eeb177" strokeDasharray="5 6" strokeWidth="2" markerEnd="url(#arrow)"/>})()}
  {showReads && <g className="read-routes" aria-hidden="true">
   {decision.options.map((option,i)=><path key={option.title} data-read={i} className={`read-route ${option.example?'example-route':'alternate-route'} ${isDefense?'assignment-route':option.kind==='drive'?'drive-route':''} ${focusedRead!==null&&focusedRead!==i?'muted-route':''}`} d={routes[i].d} markerEnd="url(#read-arrow)"/>)}
   {!isDefense&&decision.options.map(option=>{
    if(!option.to)return null;
    const to=option.to, destination=target.players[to-1];
    if(Math.hypot(...positions[to-1].map((v,i)=>v-destination[i]))<=28)return null;
    return <g key={to} className="read-arrival" transform={`translate(${destination})`}><circle r="16"/><text y="4" textAnchor="middle">{to}</text></g>;
   })}
   {isDefense?decision.options.map((option,i)=><circle key={i} className={`read-source ${focusedRead!==null&&focusedRead!==i?'muted-route':''}`} cx={positions[(option.from ?? decision.from)-1][0]} cy={positions[(option.from ?? decision.from)-1][1]} r="23"/>):<circle className="read-source" cx={passOrigin[0]} cy={passOrigin[1]} r="23"/>}
  </g>}
  {defense && positions.slice(5).map(([x,y],i)=>(!concept.visiblePlayers||concept.visiblePlayers.includes((i+6) as EntityId))&&<g key={i} transform={`translate(${x},${y})`} opacity={player!==null&&player!==i+6?.25:1} className={`defender ${isDefense&&focusedRead!==null&&decision.options[focusedRead].from!==i+6?'muted-defender':''}`}><circle r="15"/><path d="M-4 -4L4 4M4 -4L-4 4"/><text x={isDefense?0:21} y="4" textAnchor={isDefense?'middle':'start'}>{isDefense?`x${i+1}`:i+1}</text></g>)}
  {showOffense&&positions.slice(0,5).map(([x,y],i)=>(!concept.visiblePlayers||concept.visiblePlayers.includes((i+1) as EntityId))&&<g key={i} transform={`translate(${x},${y})`} opacity={player!==null&&player!==i+1?.25:1} className="player"><circle r="17"/><text y="5" textAnchor="middle">{i+1}</text></g>)}
  <g transform={`translate(${ball[0]},${ball[1]})`} className="ball"><circle r="8"/><path d="M-8 0H8M0-8V8M-5-6Q4 0-5 6"/></g>
  {showReads && <g className="route-labels" aria-hidden="true">{decision.options.map((option,i)=><g key={option.title} transform={`translate(${routes[i].label})`} className={`${option.example?'example-label':'alternate-label'} ${focusedRead!==null&&focusedRead!==i?'muted-route':''}`}><circle r="12"/><text y="4" textAnchor="middle">{'ABC'[i]}</text></g>)}</g>}
  {inbound&&<g className="throw-in-spot" transform={`translate(${inbound.spot[0]},${inbound.edge==='baseline'?-51:inbound.spot[1]-40})`}><rect x="-51" y="-11" width="102" height="22" rx="5"/><text y="4" textAnchor="middle">{at<2?`${inbound.player} · inbounder`:'Throw-in spot'}</text></g>}
  {showOffense&&(concept.screens?.[at] || []).map(player=><path key={player} d={`M${positions[player-1][0]-8} ${positions[player-1][1]-22}l17 8`} stroke="#eeb177" strokeWidth="4" strokeLinecap="round"/>)}
 </svg>;
}
function App(){
 const initial=conceptFromHash();
 const [id,setId]=useState<ConceptId>(initial.id),[progress,setProgress]=useState(0),[playing,setPlaying]=useState(false),[speed,setSpeed]=useState(1),[defense,setDefense]=useState(true),[offense,setOffense]=useState(true),[paths,setPaths]=useState(true),[reads,setReads]=useState(true),[focusedRead,setFocusedRead]=useState<number | null>(null),[help,setHelp]=useState(false),[expanded,setExpanded]=useState(false),[openGroup,setOpenGroup]=useState<ConceptGroup | null>(initial.group);
 const [coverage,setCoverage]=useState(0),[training,setTraining]=useState(false),[answer,setAnswer]=useState<number|null>(null),[player,setPlayer]=useState<EntityId|null>(null);
 const board=useRef<HTMLDivElement>(null), baseConcept=getConcept(id);
 const baseDecision=baseConcept.side==='defense'?defensiveReads[id as DefenseId]:passingReads[id as OffenseId | InboundsId];
 const variants=coverageVariants(baseConcept,baseDecision), variant=variants[coverage];
 const studyConcept: Concept=variant?{...baseConcept,frames:variant.frames,steps:variant.steps}:baseConcept;
 const decision=variant?.decision || baseDecision, scenario=variant?.scenario || scenarioFor(studyConcept,decision);
 const concealed=training&&answer===null;
 const concept: Concept={...studyConcept,frames:outcomeFrames(studyConcept,decision,training?answer:null)};
 const limit=concealed?decision.start:3, step=Math.min(Math.floor(progress),3) as StepIndex;
 const side=sideOf(concept), isDefense=concept.side==='defense', isInbounds=concept.side==='inbounds';
 const library=concepts.filter(c=>sideOf(c)===side);
 const lastLesson=useRef<Record<Section, ConceptId>>({
  offense:sideOf(initial)==='offense'?initial.id:'pick-pop',
  defense:sideOf(initial)==='defense'?initial.id:'drop-coverage',
  inbounds:sideOf(initial)==='inbounds'?initial.id:'box-cross',
 });
 const showReads=reads&&!concealed&&step>=decision.start;
 const select=(newId: ConceptId,writeHistory=true)=>{
  const nextConcept=concepts.find(c=>c.id===newId);
  if(!nextConcept)return;
  lastLesson.current[sideOf(nextConcept)]=newId;
  setCoverage(0);setTraining(false);setAnswer(null);setPlayer(null);setOpenGroup(nextConcept.group);setFocusedRead(null);setId(newId);setProgress(0);setPlaying(false);
  if(writeHistory&&location.hash!==lessonHref(nextConcept))history.pushState(null,'',lessonHref(nextConcept));
 };
 const move=(direction: -1 | 1)=>{setPlaying(false);setProgress(p=>Math.max(0,Math.min(limit,direction>0?Math.floor(p)+1:Math.ceil(p)-1)));};
 const togglePlay=()=>{if(progress>=limit)setProgress(0);setPlaying(p=>!p);};
 useEffect(()=>{if(!playing)return;let raf=0,last: number | undefined;const tick=(time: number)=>{if(last){const delta=(time-last)/2400*speed;setProgress(p=>{const n=Math.min(limit,p+delta);if(n===limit)setPlaying(false);return n;});}last=time;raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);},[playing,speed,limit]);
 useEffect(()=>{const onHash=()=>{select(conceptFromHash().id,false);};window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash);},[]);
 useEffect(()=>{const key=(e: KeyboardEvent)=>{if(['INPUT','SELECT','BUTTON','TEXTAREA'].includes(document.activeElement?.tagName || ''))return;if(e.key==='Escape'){setHelp(false);setExpanded(false);}if(e.code==='Space'){e.preventDefault();togglePlay();}if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);});
 useEffect(()=>{if(!expanded&&!help)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;};},[expanded,help]);
 useEffect(()=>{
  if(!help&&!expanded)return;
  const previous=document.activeElement;
  const dialog=document.querySelector<HTMLElement>(help?'.help-modal':'.expanded-board');
  if(!dialog)return;
  const getFocusable=()=>[...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, a[href]')];
  getFocusable()[0]?.focus();
  const trap=(e: KeyboardEvent)=>{
   if(e.key==='Escape'){setHelp(false);setExpanded(false);}
   if(e.key!=='Tab')return;
   const items=getFocusable(), first=items[0], last=items.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  };
  dialog.addEventListener('keydown',trap);
  return()=>{dialog.removeEventListener('keydown',trap);if(previous instanceof HTMLElement)previous.focus();};
 },[help,expanded]);
 useEffect(()=>{if(!training)setFocusedRead(null);},[step,training]);
 const goRelated=(newId: ConceptId)=>{select(newId);board.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});};
 return <><header className="site-header"><a className="brand" href="#pick-pop" onClick={()=>select('pick-pop')} aria-label="Second Read home"><span className="brand-symbol">s<span>r</span><i/></span><span>second read<span className="brand-sub">The player’s playbook</span></span></a><div className="header-right"><nav className="side-nav" aria-label="Playbook views">{views.map(view=><a key={view.id} href={lessonHref(getConcept(lastLesson.current[view.id]))} aria-current={side===view.id?'page':undefined} onClick={e=>{e.preventDefault();select(lastLesson.current[view.id]);}}>{view.label}<span>{concepts.filter(c=>sideOf(c)===view.id).length}</span></a>)}</nav><button className="icon-button" aria-label="Open playbook guide" onClick={()=>setHelp(true)}><CircleHelp aria-hidden="true" size={19}/></button></div></header>
 <OfflineStatus/><main className={`${side}-view`}><div className="intro"><div><div className="eyebrow"><span/> {isDefense?'Five defenders. One connected possession.':isInbounds?'Dead ball. Live reads.':'A little film room. A lot of court sense.'}</div><h1>{isDefense?'Win the next rotation.':isInbounds?'Make the inbound count.':'See the game differently.'}</h1><p>{isDefense?'Cover the first action. Understand the help. Finish the possession.':isInbounds?'Baseline and sideline sets with a scoring look, a counter, and a clear way to get it in.':'The spacing, timing, and reads that turn a familiar play into an advantage.'}</p></div><div className="intro-note"><BookOpen aria-hidden="true" size={19}/><span>{isDefense?'Read the threat.':isInbounds?'Know the release.':'Study the action.'}<br/><strong>{isDefense?'Move as the ball moves.':isInbounds?'Keep the safety in view.':'Bring it to your next run.'}</strong></span></div></div>
 <div className="workspace" ref={board}><aside className="library"><div className="library-title"><h2>{isDefense?'Defensive playbook':isInbounds?'Inbounds playbook':'The playbook'}</h2><span>{String(library.length).padStart(2,'0')}</span></div><ConceptMenu lessons={library} activeId={id} openGroup={openGroup} onToggle={group=>setOpenGroup(current=>current===group?null:group)} onSelect={select}/><div className="library-note"><span className="drawn-star">✳</span><p>{isDefense?'Your matchup is one job.':isInbounds?'First, get it in.':'Don’t memorize the route.'}<br/><strong>{isDefense?'The possession belongs to five.':isInbounds?'Then punish the coverage.':'Understand the advantage.'}</strong></p></div></aside>
 <section className="lesson" aria-label="Selected concept"><div className="lesson-heading"><div><span className="topic-label">{concept.group}</span><h2>{concept.name}</h2></div><span className="lesson-badge">{concept.tag}</span></div><p className="description">{concept.description}</p>
 {isInbounds&&<div className="inbound-context"><dl className="inbound-setup"><div><dt>Throw-in</dt><dd>{concept.inbound.edge==='baseline'?'Baseline':'Frontcourt sideline'}</dd></div><div><dt>Inbounder</dt><dd>Player {concept.inbound.player}</dd></div><div><dt>Safety outlet</dt><dd>Player {concept.inbound.safety}</dd></div></dl><p>Release before the throw-in count expires. Step onto the court only after releasing the pass.</p></div>}
 <div className="learning-tools">
 {variants.length>0&&<label>Coverage<select aria-label="Coverage" value={coverage} onChange={e=>{setCoverage(Number(e.target.value));setProgress(0);setPlaying(false);setAnswer(null);setFocusedRead(null);}}>{variants.map((v,i)=><option key={v.id} value={i}>{v.label}</option>)}</select></label>}
 <label>Follow a player<select aria-label="Follow a player" value={player || ''} onChange={e=>{setPlayer(e.target.value?Number(e.target.value) as EntityId:null);setDefense(true);setOffense(true);}}><option value="">All players</option>{Array.from({length:10},(_,i)=>(i+1) as EntityId).filter(p=>!concept.visiblePlayers||concept.visiblePlayers.includes(p)).map(p=><option key={p} value={p}>{p>5?`Defender x${p-5}`:`Player ${p}`}</option>)}</select></label>
 <button className={training?'mode-button selected':'mode-button'} aria-pressed={training} onClick={()=>{setTraining(!training);setPlayer(null);setDefense(true);setOffense(true);setAnswer(null);setProgress(training?0:decision.start);setPlaying(false);setFocusedRead(null);}}>{training?'Return to study':'Make the read'}</button>
 </div>{variant&&<p className="coverage-context">{variant.description}</p>}
 <div className={`board-layout ${expanded?'expanded-board':''}`} role={expanded?'dialog':undefined} aria-modal={expanded?'true':undefined} aria-label={expanded?'Expanded playboard':undefined}>
 <div className="playboard"><div className="board-top"><span><i/> {isDefense?'Defense walkthrough':isInbounds?(concept.inbound.edge==='baseline'?'Baseline inbounds':'Sideline inbounds'):concept.group.includes('Transition')?'Transition walkthrough':'Half-court walkthrough'}</span><button className="board-icon" aria-label={expanded?'Close expanded diagram':'Expand diagram'} onClick={()=>setExpanded(v=>!v)}>{expanded?<X aria-hidden="true" size={17}/>:<Maximize2 aria-hidden="true" size={16}/>}</button></div><Court concept={concept} progress={progress} defense={isDefense||defense} paths={paths&&!concealed} reads={reads&&!concealed} decision={decision} player={player} focusedRead={focusedRead} showOffense={!isDefense||offense}/><div className="court-legend"><span><i className="legend-offense"/> Offense</span><span><i className="legend-defense">{isDefense?'x':'×'}</i> Defense</span><span><i className="legend-pass"/> {showReads&&!isDefense?'Example action':'Pass'}</span>{showReads&&<span><i className="legend-read"/> {isDefense?'Defensive jobs':'Other reads'}</span>}<span><i className="legend-move"/> {isDefense?'Offense movement':'Movement'}</span></div><div className="play-controls"><div className="transport"><button className="reset-button" aria-label="Reset animation" onClick={()=>{setProgress(0);setPlaying(false);}}><RotateCcw aria-hidden="true" size={16}/></button><button aria-label="Previous step" disabled={progress===0} onClick={()=>move(-1)}><ChevronLeft aria-hidden="true" size={21}/></button><button className="play-button" onClick={togglePlay} aria-label={playing?'Pause animation':'Play animation'}>{playing?<Pause aria-hidden="true" size={18} fill="currentColor"/>:<Play aria-hidden="true" size={18} fill="currentColor"/>}</button><button aria-label="Next step" disabled={progress>=limit} onClick={()=>move(1)}><ChevronRight aria-hidden="true" size={21}/></button></div><span className="step-count">{step+1} <span>/ 4</span></span><label className="speed"><span className="sr-only">Playback speed</span><select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1">1× speed</option><option value="1.5">1.5×</option></select></label></div><label className="timeline"><span className="sr-only">Animation position</span><input aria-label="Animation position" type="range" min="0" max="3" step="0.01" value={progress} onChange={e=>{setPlaying(false);setProgress(Math.min(limit,Number(e.target.value)));}} style={{'--fill':`${progress/3*100}%`} as CSSProperties}/></label><div className="board-options"><label><input type="checkbox" checked={isDefense?offense:defense} onChange={e=>isDefense?setOffense(e.target.checked):setDefense(e.target.checked)}/> {isDefense?'Show offense':'Show defense'}</label><label><input type="checkbox" checked={paths} onChange={e=>setPaths(e.target.checked)}/> Movement paths</label><label><input type="checkbox" checked={reads} onChange={e=>{setReads(e.target.checked);setFocusedRead(null);}}/> {isDefense?'Assignments':'Passing reads'}</label></div>
 <div className="read-options" aria-label={isDefense?'Defensive assignments':'Passing reads'}>
  {showReads?<><div className="read-options-heading"><strong>{isDefense?'Three connected jobs':`${decision.from}’s options`}</strong><span>{isDefense?'Select a defender to focus':decision.context || (isInbounds?'Before the entry pass':'Before the example pass')}</span>{focusedRead!==null&&<button onClick={()=>setFocusedRead(null)}>Show all</button>}</div>
  <div className="read-choice-list" role="group" aria-label={isDefense?'Focus a defensive assignment':'Focus a ball route'}>{decision.options.map((option,i)=><button key={option.title} className={`read-choice ${option.example?'example-choice':''}`} aria-pressed={focusedRead===i} onClick={()=>{setPlaying(false);setFocusedRead(focusedRead===i?null:i);}}><span className="read-letter">{'ABC'[i]}</span><span>{option.title}<small>{isDefense?`Defender x${(option.from ?? decision.from)-5}`:option.kind==='drive'?'Keep & drive':option.kind==='shot'?'Shot':`Pass ${decision.from} → ${option.to}`}{!isDefense?(option.safety?' · safety':option.example?' · example':''):''}</small></span></button>)}</div>
  <p className="read-condition">{focusedRead===null?(isDefense?'Select a job to follow that defender. These responsibilities work together as the possession develops.':'Select a route to isolate it and see the defensive read. Each option opens against a different response.'):decision.options[focusedRead].condition}</p></>:<p className="read-waiting">{concealed?'Choose an action to reveal the routes and explanation.':isDefense?(reads?`Defensive assignments appear at step ${decision.start+1}, as the coverage takes shape.`:'Turn on assignments to follow the defenders’ connected responsibilities.'):(reads?`Passing reads appear at step ${decision.start+1}, as the action creates a decision.`:'Turn on passing reads to compare the ball’s possible routes.')}</p>}
 </div></div>
 <div className="training-panel" hidden={!training}><span className="topic-label">Make the read</span><h3>{concealed?'What do you see?':'Read reviewed'}</h3><p>{scenario.prompt}</p><div className="training-choices">{decision.options.map((o,i)=><button key={o.title} aria-pressed={answer===i} disabled={answer!==null} onClick={()=>{setAnswer(i);setFocusedRead(i);setProgress(decision.start);setPlaying(true);}}><b>{'ABC'[i]}</b>{o.title}</button>)}</div>{answer!==null&&<div className="read-feedback" role="status"><strong>{scenario.answers[answer].grade==='strong'?'Strong read':scenario.answers[answer].grade==='viable'?'Conditional option':'High-risk read'}</strong><p>{scenario.answers[answer].feedback}</p><small>{isDefense?'The animation shows the connected rotation.':'The animation illustrates the selected route, not a guaranteed result against live defense.'}</small><button onClick={()=>{setAnswer(null);setProgress(decision.start);setPlaying(false);setFocusedRead(null);}}>Try another read</button></div>}{concealed&&<p className="training-note">Study the positions. Playback stops here until you choose.</p>}</div>
 <div className="step-panel" hidden={training}>{player!==null&&<div className="player-job"><span>{player>5?`Defender x${player-5}`:`Player ${player}`} · step {step+1}</span><p>{playerCue(studyConcept,decision,player,step)}</p></div>}<h3>The breakdown</h3><div className="steps">{concept.steps.map((s,i)=><button className={`step ${i===step?'current':''}`} key={s.title} aria-current={i===step?'step':undefined} onClick={()=>{setProgress(Math.min(limit,i));setPlaying(false);}}><span className="step-number">{i+1}</span><span><strong>{s.title}</strong><span className="step-text">{s.text}</span></span></button>)}</div><div className="coach-cue"><span>Coach’s cue</span><p>{concept.steps[step].cue}</p></div></div></div>
 <div className="watch-note" hidden={concealed}><span className="note-icon">↗</span><div><strong>Keep your eyes here</strong><p>{concept.focus}</p></div></div>
 </section></div>
 <section className="deeper" hidden={concealed}><div className="deeper-heading"><div><span className="topic-label">Beyond the diagram</span><h2>{isDefense?'The first stop is a start.':isInbounds?'Get the ball in.':'The action is the start.'}<br/>{isDefense?'The next rotation is the test.':isInbounds?'Keep the next read alive.':'The read is the skill.'}</h2></div><p>{isDefense?'Every coverage gives something up. Know the threat you are taking away and how your teammates cover what comes next.':isInbounds?'A play earns its place when it works against a different response. Read the denial, protect the entry, and flow into the next action.':'One clean example is useful. Knowing what changes when the defense adjusts is what travels to a game.'}</p></div><div className="advanced-grid"><div className="coverage"><h3>{isDefense?'When the offense adjusts':isInbounds?'When the entry is covered':'Read the coverage'}</h3>{concept.reads.map(([title,text])=><details key={id+title}><summary>{title}<ChevronDown aria-hidden="true" size={16}/></summary><p>{text}</p></details>)}<p className="diagram-note">{isDefense?'The diagram shows one team’s example coverage. Adjust the call, depth, and help rules to your personnel and opponent.':isInbounds?'These examples start from a designated frontcourt throw-in spot. Slow playback is for studying the routes; the official’s throw-in count still governs live play.':'The diagram shows one possible possession. Defender positions illustrate the read; they are not a fixed defensive system.'}</p></div><div className="practice-column"><div className="mistake"><h3><span/> The common breakdown</h3><p>{concept.mistake}</p></div><div className="practice"><h3>Take it to the court</h3><p>{concept.practice}</p></div></div><div className="connections"><h3>Connect the concepts</h3><p>{isDefense?'See the action from both sides.':isInbounds?'From the entry to the next action.':'Same advantage. A different answer.'}</p>{concept.related.map(r=>{const c=getConcept(r);return <button key={r} onClick={()=>goRelated(r)}><span>{c.name}<small className="related-side">{sideOf(c)!==side?viewLabel(sideOf(c)):''}</small></span><ArrowUpRight aria-hidden="true" size={16}/></button>;})}<a className="source" href={sources[concept.source].url} target="_blank" rel="noreferrer">Coaching reference<ArrowUpRight aria-hidden="true" size={13}/><small>{sources[concept.source].label}</small></a></div></div></section>
 </main><footer><a className="footer-brand" href="#pick-pop" onClick={()=>select('pick-pop')}>second read<span>Basketball, understood.</span></a><p>For the next possession.</p><button onClick={()=>setHelp(true)}>How to use the playbook<ArrowUpRight aria-hidden="true" size={14}/></button></footer>
 {help&&<div className="modal-shade" onClick={()=>setHelp(false)}><section className="help-modal" role="dialog" aria-modal="true" aria-labelledby="guide-title" onClick={e=>e.stopPropagation()}><button className="icon-button modal-close" aria-label="Close guide" onClick={()=>setHelp(false)}><X aria-hidden="true" size={21}/></button><BookOpen aria-hidden="true" size={26}/><h2 id="guide-title">Your own film room.</h2><p>Choose Offense, Defense, or Inbounds, open a play type, choose a concept, play the possession, and use the four steps to inspect the timing. Slow it to 0.25× or scrub to any point.</p><p>Choose a coverage to compare the defense, follow a player for their job at each step, or use Make the read to choose before revealing the explanation. Zone and transition lessons live in their own play types.</p><p><strong>Read all ten players.</strong> Turn defense and paths on or off to isolate what matters. Numbers match offensive players with their defenders; orange marks the ball and movement. At the decision point, lettered routes compare the example pass with other possible reads. Select a route below the court to isolate it and see what the defense must do to open it.</p><p>On Defense, the cyan paths follow defenders and the assignment buttons isolate their jobs. Defensive numbers keep their original identities after a switch. Inbounds diagrams show the thrower outside the boundary, a high safety, and the entry routes; the give-and-go also shows a second pass after the entry. Open the notes for counters and tradeoffs, then follow related concepts to see the same action from both sides.</p><div className="shortcuts"><span><kbd>←</kbd><kbd>→</kbd> Previous / next step</span><span><kbd>Space</kbd> Play / pause</span><span><kbd>Esc</kbd> Close this panel</span></div><button className="primary-button" onClick={()=>setHelp(false)}>Back to the court</button></section></div>}
 </>;
}
const root=document.getElementById('root');
if(!root)throw new Error('Missing application root');
createRoot(root).render(<App/>);
