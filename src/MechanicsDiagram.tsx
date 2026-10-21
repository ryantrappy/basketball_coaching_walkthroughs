import { useEffect, useId, useState } from 'react';
import type { Drill, BodyFocus, Joint } from './drillTypes';
import type { Point, StepIndex } from './types';
import { drillPoses, interpolatePose } from './drillPoses';

interface Props{drill:Drill;progress:number;left:boolean;camera:'front'|'side';focus:BodyFocus}
const line=(points:Point[])=>points.map(p=>p.join(',')).join(' ');
export default function MechanicsDiagram({drill,progress,left,camera,focus}:Props){
 const [compact,setCompact]=useState(matchMedia('(max-width:700px)').matches);
 useEffect(()=>{const query=matchMedia('(max-width:700px)');const change=()=>setCompact(query.matches);query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);
 const id=useId().replace(/:/g,''),at=Math.min(3,Math.floor(progress)) as StepIndex,poses=drillPoses(drill.id,camera);
 const p=interpolatePose(poses[at],poses[Math.min(3,at+1)],progress-at,left),phase=drill.phases[at],shooting=drill.skill==='Shooting';
 const handsOpacity=focus==='base'?.25:1,baseOpacity=focus==='hands'?.25:1,torsoOpacity=focus==='all'?1:.48;
 const arm=(side:'left'|'right')=>[p[`${side}Shoulder`],p[`${side}Elbow`],p[`${side}Hand`]];
 const handAngle=(side:'left'|'right')=>{
  if(shooting&&at>=2&&side==='right')return left?25:-25;
  const hand=p[`${side}Hand`];
  return Math.hypot(p.ball[0]-hand[0],p.ball[1]-hand[1])<65?Math.atan2(p.ball[1]-hand[1],p.ball[0]-hand[0])*180/Math.PI-90:0;
 };
 const leg=(side:'left'|'right')=>[p[`${side}Hip`],p[`${side}Knee`],p[`${side}Ankle`]];
 const activeHand:Joint=drill.id==='guide'?'leftHand':Math.hypot(p.leftHand[0]-p.ball[0],p.leftHand[1]-p.ball[1])<Math.hypot(p.rightHand[0]-p.ball[0],p.rightHand[1]-p.ball[1])?'leftHand':'rightHand';
 const labels:{joint:Joint;point:Point;group:BodyFocus}[]=[{joint:'head',point:[left?475:25,90],group:'all'},{joint:'rightHip',point:[left?475:25,270],group:'base'},{joint:activeHand,point:[left?25:475,150],group:'hands'},{joint:'rightAnkle',point:[left?25:475,355],group:'base'}];
 return <svg className="mechanics-svg" viewBox={compact?'175 40 295 430':'0 0 640 480'} role="img" aria-label={`${drill.name}, body mechanics, phase ${at+1}: ${phase.title}, ${left?'left':'right'}-handed, ${camera} view`}>
  <defs>
   <linearGradient id={`${id}jersey`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e3ebd6"/><stop offset="1" stopColor="#a9c6ac"/></linearGradient>
   <marker id={`${id}arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="currentColor" strokeWidth="1.6"/></marker>
  </defs>
  <path className="mechanics-ground" d="M185 450H455"/><ellipse cx="319" cy="450" rx="101" ry="9" fill="#0c2d25" opacity=".7"/>
  <path d={`M${p.neck[0]} 80V450`} stroke="#abc8b4" opacity=".15" strokeDasharray="4 7"/>
  {shooting&&<path className="ball-flight" d={left?'M283 94Q170 -22 75 87':'M357 94Q470 -22 565 87'} opacity={at>=2?.45:.1}/>}
  {shooting&&<g opacity=".4" stroke="#eeb177" fill="none"><ellipse cx={left?75:565} cy="87" rx="18" ry="5"/><path d={left?'M54 84v-24h-8':'M586 84v-24h8'}/></g>}
  <g opacity={baseOpacity} className="body-base">
   {(['left','right'] as const).map(side=><g key={side}><polyline points={line(leg(side))} className="body-limb limb-shadow"/><polyline points={line(leg(side))} className="body-limb leg-limb"/><circle cx={p[`${side}Knee`][0]} cy={p[`${side}Knee`][1]} r="6" className="joint-node"/><g transform={`translate(${p[`${side}Ankle`]}) rotate(${left?-8:8})`}><path d="M-13-6Q-5-10 5-5L23 3Q27 10 18 12H-15Z" className="body-shoe"/><path d="M-11 8H21" stroke="#e8e8cf" strokeWidth="2"/></g></g>)}
   <polygon points={line([p.leftHip,[p.leftHip[0]-8,p.leftHip[1]+32],[p.leftHip[0]+18,p.leftHip[1]+39],[p.neck[0],p.leftHip[1]+17],[p.rightHip[0]-11,p.rightHip[1]+39],[p.rightHip[0]+11,p.rightHip[1]+32],p.rightHip])} fill="#204b41" stroke="#98b8a2" strokeWidth="1.8"/>
  </g>
  <g opacity={torsoOpacity}>
   <polygon points={line([p.leftShoulder,p.rightShoulder,p.rightHip,p.leftHip])} fill={`url(#${id}jersey)`} stroke="#e6eddd" strokeWidth="1.5" strokeLinejoin="round"/>
   <path d={`M${p.leftShoulder}L${p.leftHip}`} stroke="#7fa98d" strokeWidth="7"/>
   <path d={`M${p.neck[0]-10} ${p.head[1]+20}h20v${p.leftShoulder[1]-p.head[1]-16}q-10 8-20 0Z`} fill="#cba780"/>
   <ellipse cx={p.head[0]} cy={p.head[1]} rx={camera==='side'?21:23} ry="28" fill="#d4b18a"/>
   <path d={`M${p.head[0]-22} ${p.head[1]-5}q0-31 24-25q23 2 20 21l-8-7q-16 7-36 11`} fill="#102f29"/>
   {camera==='side'?<><path d={`M${p.head[0]+(left?-19:19)} ${p.head[1]-4}l${left?-7:7} 10h${left?6:-6}`} stroke="#d4b18a" strokeWidth="5" fill="none"/><circle cx={p.head[0]+(left?-13:13)} cy={p.head[1]-3} r="2.2" fill="#27463c"/></>:<><path d={`M${p.head[0]-10} ${p.head[1]-3}h3m14 0h3`} stroke="#27463c" strokeWidth="2.5"/><path d={`M${p.head[0]-8} ${p.head[1]+12}q8 4 15 0`} stroke="#ac825f" fill="none"/></>}
   <text x={(p.leftShoulder[0]+p.rightShoulder[0])/2} y={(p.leftShoulder[1]+p.leftHip[1])/2+4} textAnchor="middle" className="jersey-mark">sr</text>
  </g>
  <g opacity={handsOpacity} className="body-hands">{(['left','right'] as const).map(side=><g key={side}><polyline points={line(arm(side))} className="body-limb limb-shadow"/><polyline points={line(arm(side))} className="body-limb arm-limb"/><circle cx={p[`${side}Elbow`][0]} cy={p[`${side}Elbow`][1]} r="5" className="joint-node"/><g transform={`translate(${p[`${side}Hand`]}) rotate(${handAngle(side)})`}><ellipse rx="8" ry="10" fill="#d4b18a"/><path d="M-5 3v10m4-8v11m4-10v9m4-11v7" fill="none" stroke="#d4b18a" strokeWidth="3" strokeLinecap="round"/></g></g>)}</g>
  <g className="mechanics-ball" transform={`translate(${p.ball})`}><circle r="17"/><path d="M-17 0h34M0-17v34M-12-12Q6 0-12 12M12-12Q-6 0 12 12"/></g>
  <g className="body-motion" aria-hidden="true" opacity={focus==='hands'?1:.5}>
   {!shooting&&<path d={`M${p.ball[0]+(left?-27:27)} ${Math.min(p.ball[1]+25,388)}v30`} markerEnd={`url(#${id}arrow)`}/>}
   {shooting&&at<3&&<path d={`M${left?245:399} 290v-35`} markerEnd={`url(#${id}arrow)`}/>}
  </g>
  {!compact&&labels.map(({joint,point,group},i)=>{
   const target:Point=joint==='head'?[p.head[0]+(left?-26:26),p.head[1]-3]:p[joint],leftBox=point[0]<300,edge=leftBox?point[0]+140:point[0]-10;
   return <g key={joint} className={`body-callout ${focus!=='all'&&focus!==group?'dim-callout':''}`}><path d={`M${edge} ${point[1]+15}H${leftBox?210:440}L${target}`} /><circle cx={target[0]} cy={target[1]} r="4"/><text x={point[0]} y={point[1]} className="callout-number">{'ABCD'[i]} · {['Eyes & trunk','Hips & load','Hand & ball','Feet & contact'][i]}</text><text x={point[0]} y={point[1]+22}>{phase.labels[i]}</text></g>;
  })}
 </svg>;
}

export function HandDetail({shooting,phase,left,singleHand=false}:{shooting:boolean;phase:number;left:boolean;singleHand?:boolean}){
 const released=shooting&&phase>=2;
 return <svg viewBox="0 0 280 155" role="img" aria-label={shooting?'Release detail: shooting hand supplies force, guide hand supports the side':'Dribble contact detail: hand above the ball, fingers direct the bounce'}>
  <path d="M30 132H250" stroke="#d6ded1"/>
  <g transform={left?'translate(280 0) scale(-1 1)':undefined}>
   <g transform={`translate(${released?155:142} ${shooting?released?35:65:93})`}><circle r="28" fill="#e6ad78" stroke="#a36c40" strokeWidth="1.4"/><path d="M-28 0h56M0-28v56M-20-20Q11 0-20 20M20-20Q-11 0 20 20" fill="none" stroke="#a36c40" strokeWidth="1"/></g>
   {shooting?<>
    <path d={released?'M65 128L102 94L119 65':'M65 128L103 107L115 103'} fill="none" stroke="#345e4e" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
    <g fill="none" stroke="#c49d76" strokeLinecap="round" strokeLinejoin="round">
     <path d={released?'M116 67L127 61L143 72':'M112 104L130 98L145 97'} strokeWidth="11"/>
     <path d={released?'M128 60L145 67L150 78M130 64L144 72L147 82M130 68L141 77L142 85':'M140 97L154 91L163 79M137 100L154 95L166 84M132 101L149 99L161 91'} strokeWidth="3.5"/>
     <path d={released?'M117 66L117 79L126 85':'M117 100L122 89L133 88'} strokeWidth="4"/>
    </g>
    <g opacity={singleHand?.16:1}><path d={released?'M223 128L205 101L197 86':'M223 128L196 103L184 84'} fill="none" stroke="#8ca892" strokeWidth="13" strokeLinecap="round"/><path d={released?'M196 87L188 75L190 64':'M183 85L177 73L177 57'} fill="none" stroke="#c49d76" strokeWidth="9" strokeLinecap="round"/><path d={released?'M190 75L195 62M187 76L186 60M184 77L179 64':'M174 74L171 56M178 71L178 51M182 72L184 55'} fill="none" stroke="#c49d76" strokeWidth="3.5" strokeLinecap="round"/></g>
    <path d="M75 83V55m-5 8 5-8 5 8" fill="none" stroke="#bd773e" strokeWidth="2"/>
   </>:<>
    <path d="M54 29L100 49L116 52" fill="none" stroke="#345e4e" strokeWidth="16" strokeLinecap="round"/>
    <path d="M114 51L135 51L150 57" fill="none" stroke="#c49d76" strokeWidth="12" strokeLinecap="round"/>
    <path d="M141 51L158 56L166 65M137 55L154 62L160 70M132 58L148 66L153 73M126 57L130 69L138 72" fill="none" stroke="#c49d76" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M192 70v46m-6-8 6 8 6-8" fill="none" stroke="#bd773e" strokeWidth="2"/>
   </>}
  </g>
  <text x="20" y="151" fontSize="10" fill="#345e4e">{shooting?'Shooting hand: force':'Contact above the ball'}</text>{shooting&&<text x="175" y="151" fontSize="10" fill="#67816b">{singleHand?'Off hand stays off':'Guide hand: support'}</text>}
 </svg>;
}

export function FootworkDetail({drill,phase,left}:{drill:Drill;phase:number;left:boolean}){
 const shooting=drill.skill==='Shooting',hop=drill.id==='hop',stepStop=['one-two','pull-up'].includes(drill.id),stationary=['pound','touch','guide'].includes(drill.id);
 const offset=phase===0&&(stepStop||drill.id==='between')?20:0;
 const feet:Point[]=[[110,105-offset],[175,105+offset]];
 const active=(i:number)=>stationary||hop||phase>=2||i===phase;
 let arrows='M110 38v20m-5-7 5 7 5-7M175 38v20m-5-7 5 7 5-7';
 if(!stationary&&!hop&&!stepStop){
  arrows=drill.id==='retreat'&&phase===1?'M110 42v24m-5-7 5 7 5-7M175 42v24m-5-7 5 7 5-7':phase<2?'M175 48l25-17m-10 0 10 0-2 10':'M175 49L130 25m4 10-4-10 11 1';
 }
 if(stepStop)arrows=phase===0?'M70 106q-13-34 8-54m-11 4 11-4-2 12M211 120q20-34 0-53m0 12 0-12 10 7':'M110 55V31m-5 7 5-7 5 7M175 55V31m-5 7 5-7 5 7';
 if(shooting&&phase===2)arrows='M110 55V27m-5 7 5-7 5 7M175 55V27m-5 7 5-7 5 7';
 return <svg viewBox="0 0 280 155" role="img" aria-label={`${drill.name} footwork detail, ${hop?'two-foot landing':stepStop?'first foot then second foot':stationary?'stable pressure through both feet':'load and push from a staggered base'}, phase ${phase+1}`}>
  <path d="M30 130H250" stroke="#d6ded1"/><path d="M140 30V130" stroke="#d6ded1" strokeDasharray="4 5"/>
  {feet.map(([x,y],i)=><g key={i} transform={`translate(${left?280-x:x},${y}) rotate(${i===0?-9:9})`}><path d="M-12 12V-14Q-10-31 1-31Q13-31 13-14V12Q1 21-12 12Z" fill={active(i)?'#315b49':'#b5c7b3'} stroke="#315b49" strokeWidth="1"/><text y="-8" textAnchor="middle" fill={active(i)?'#fffef2':'#315b49'} fontSize="12" fontWeight="700">{hop?'↓':stepStop?i+1:i===0?left?'R':'L':left?'L':'R'}</text>{stationary&&<><circle r="3" cy="9" fill="#dba675"/><circle r="3" cy="-16" fill="#dba675"/></>}</g>)}
  <g transform={left?'translate(280 0) scale(-1 1)':undefined}><path d={arrows} fill="none" stroke="#bf7b43" strokeWidth="2"/></g>
  <text x="140" y="150" textAnchor="middle" fontSize="10" fill="#67816b">{hop?'Receive the landing on both feet':stepStop?left?'1 right → 2 left · shown rep':'1 left → 2 right · shown rep':stationary?'Pressure through heel and forefoot':'Dark foot = loaded contact'}</text>
 </svg>;
}
