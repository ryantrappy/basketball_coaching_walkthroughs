import type { Concept, CoverageVariant, Decision, EntityId, Four, Frame, PassingDecision, ReadScenario } from './types';

export function coverageVariants(concept: Concept, decision: Decision): CoverageVariant[] {
 if(!['pick-roll','pick-pop','empty-corner'].includes(concept.id))return [];
 const original=decision as PassingDecision;
 const base: CoverageVariant={id:'drop',label:'Drop',description:'The big contains the ball below the screen while the guard chases over.',frames:concept.frames,steps:concept.steps,decision:original,scenario:scenarioFor(concept,original)};
 const switched=structuredClone(concept.frames);
 switched[2].players[5]=[305,205];switched[2].players[9]=[355,265];
 switched[3].players[5]=[310,145];switched[3].players[9]=[375,225];
 if(concept.id==='pick-pop'){switched[2].players[4]=[300,245];switched[3].players[4]=[300,150];switched[2].players[5]=[310,225];switched[3].players[5]=[310,130];}
 if(concept.id==='empty-corner'){switched[2].players[5]=[445,170];switched[2].players[9]=[420,225];switched[3].players[5]=[360,125];switched[3].players[9]=[400,195];}
 switched[3].ball=1;switched[3].pass=null;
 const switchDecision: PassingDecision={from:1,start:2,options:[
  {kind:'drive',point:[405,165],title:'Attack the new matchup',condition:'x5 has the ball. Create separation against the bigger defender instead of expecting the original pocket pass.',example:true},
  {to:5,title:'Find the inside seal',condition:'5 must seal x1 and show a target before this pass is available.'},
  {to:3,title:'Force the corner skip',condition:'x3 has stayed home. A skip here gives up the mismatch without moving the help.'},
 ]};
 const switchSteps=structuredClone(concept.steps);switchSteps[2]={title:'Recognize the switch',text:'x5 takes the handler while x1 moves inside with 5. The original two-on-one has become two individual matchups.',cue:'Keep the dribble alive while the screener seals.'};switchSteps[3]={title:'Play the new matchup',text:'Attack x5 in space or feed 5 after an inside seal. Re-screen if neither matchup gives you an advantage.',cue:'A switch changes the read; it does not require a forced pass.'};
 const variants: CoverageVariant[]=[base,{id:'switch',label:'Switch',description:'The defenders exchange assignments. Look for the new matchup or an inside seal.',frames:switched,steps:switchSteps,decision:switchDecision,scenario:{prompt:'The defenders have exchanged assignments. Which advantage would you pursue?',answers:[{grade:'strong',feedback:'x5 is now on the ball. Attacking that matchup keeps pressure on the defense.'},{grade:'viable',feedback:'An inside seal against x1 can work. Wait until 5 has position and a clear target.'},{grade:'risky',feedback:'The corner defender has not helped. That skip does not exploit the switch.'}]}}];
 const trapped=structuredClone(concept.frames);
 trapped[2].players[0]=[365,300];trapped[2].players[5]=[345,320];trapped[2].players[9]=[390,275];trapped[2].players[4]=[300,225];
 trapped[3].players[4]=[300,190];trapped[3].players[5]=[365,305];trapped[3].players[9]=[385,275];trapped[3].ball=5;trapped[3].pass=[1,5];
 const blitzSteps=structuredClone(concept.steps);blitzSteps[2]={title:'Release before the trap closes',text:'Both defenders commit to the ball. 5 stops in the pocket instead of diving beyond the passing window.',cue:'Find the release while you still have an angle.'};blitzSteps[3]={title:'Play behind the two',text:'5 catches facing the rim with two defenders behind the ball. Attack the middle and read the next helper.',cue:'The short roller becomes the playmaker.'};
 variants.push({id:'blitz',label:'Blitz',description:'Two defenders trap the ball. Release into the short roll before the angle closes.',frames:trapped,steps:blitzSteps,decision:{from:1,start:2,options:[{to:5,title:'Release to the pocket',condition:'5 is available behind the trap, creating a four-on-three.',example:true},{to:3,title:'Skip over the trap',condition:'A possible escape if you can see a clean passing lane; the longer flight gives the defense time.'},{kind:'drive',point:[400,190],title:'Split the trap',condition:'Both defenders are square to the ball. Forcing the split risks a turnover.'}]},scenario:{prompt:'Two defenders have committed to the ball. Where is the advantage?',answers:[{grade:'strong',feedback:'The pocket pass gets the ball behind both defenders while the four-on-three is available.'},{grade:'viable',feedback:'A clean skip can escape the trap, but requires a clear sightline and a pass that beats the rotation.'},{grade:'risky',feedback:'These defenders have closed the gap. Splitting them is a high-risk way to ignore the available release.'}]}});
 if(concept.id==='empty-corner'){
 const iced=structuredClone(concept.frames);
 iced[1].players[5]=[450,290];iced[1].players[9]=[475,210];
 iced[2].players[0]=[515,225];iced[2].players[4]=[400,270];iced[2].players[5]=[495,260];iced[2].players[9]=[490,175];
 iced[3].players[0]=[520,195];iced[3].players[4]=[380,265];iced[3].players[5]=[510,230];iced[3].players[9]=[505,155];iced[3].ball=5;iced[3].pass=[1,5];
 const iceSteps=structuredClone(concept.steps);iceSteps[1]={title:'Recognize the denial',text:'x1 jumps to the high side, taking away the middle screen. x5 waits below the ball toward the empty baseline.',cue:'See the call before driving into the big.'};iceSteps[2]={title:'Reject and draw the big',text:'1 takes the baseline while 5 opens to the middle. x5 moves across to contain the ball.',cue:'Keep a passing angle back to the screener.'};iceSteps[3]={title:'Find the release',text:'With x5 containing the baseline, 1 returns the ball to 5 in the open middle. Re-screen if the defense recovers early.',cue:'Move the ball out of the sideline pressure.'};
 variants.push({id:'ice',label:'ICE',description:'On this side screen, x1 denies the middle and the big contains the empty baseline.',frames:iced,steps:iceSteps,decision:{from:1,start:2,options:[{to:5,title:'Return to the middle',condition:'x5 has moved to the baseline. Find 5 opening in the middle.',example:true},{kind:'drive',point:[535,125],title:'Continue along the baseline',condition:'Keep going only if x5 leaves a real finishing window.'},{to:3,title:'Throw the long skip',condition:'The opposite corner defender has stayed home and the big crowds the passing angle.'}]},scenario:{prompt:'The high side is denied and the big is containing the baseline. Which outlet keeps the advantage?',answers:[{grade:'strong',feedback:'5 is available in the middle behind the big’s baseline commitment.'},{grade:'viable',feedback:'A baseline finish is possible if the big gives ground. The illustrated big is still between you and the rim.'},{grade:'risky',feedback:'The corner defender is attached. A long skip from this angle asks the ball to do too much.'}]}});
 }
 return variants;
}
export function scenarioFor(concept: Concept, decision: Decision): ReadScenario {
 const scenarios: Partial<Record<Concept['id'],ReadScenario>>={
 'zone-high-post':{prompt:'The center has stepped toward the high-post catch. Where does the next advantage open?',answers:[{grade:'strong',feedback:'The short corner is behind the center’s step. Pass before the low wing can recover.'},{grade:'risky',feedback:'The middle defender is stepping into the drive. Move the ball behind that help.'},{grade:'viable',feedback:'A kick-out can work if the top defender pinches in. In this picture the short corner offers the deeper advantage.'}]},
 'zone-overload':{prompt:'The low wing is staying with the corner while the middle slides across. Which window is open now?',answers:[{grade:'strong',feedback:'The short corner sits between the low wing and the arriving center. Hit that seam now.'},{grade:'viable',feedback:'A reversal is a useful reset if you miss the inside window.'},{grade:'risky',feedback:'The low wing is already covering the corner. That pass does not shift the zone.'}]},
 'two-on-one':{prompt:'The lone defender has moved toward the ball. What creates the best finish?',answers:[{grade:'strong',feedback:'The defender committed to the handler. Pass across before reaching the baseline.'},{grade:'viable',feedback:'Keep it if the defender recovers toward 2; here they have stepped to the ball.'},{grade:'risky',feedback:'An early jumper releases the defender from having to choose between two layup threats.'}]},
 'three-on-two':{prompt:'The first defender stops the ball and the back defender shades right. Which side is exposed?',answers:[{grade:'strong',feedback:'The left lane is behind the back defender’s commitment. Find 3 before the defense can split the runners.'},{grade:'risky',feedback:'The back defender is shading toward 2. This pass goes into the help.'},{grade:'viable',feedback:'A confident shooter can use this space, but the left runner offers a closer finish.'}]},
 };
 if(scenarios[concept.id])return scenarios[concept.id]!;
 const strong=decision.options.findIndex(o=>o.example);
 return {prompt:concept.side==='defense'?'Choose a responsibility, then follow how it connects to the other defenders. Several jobs must happen together.':`You are player ${decision.from}. Read the defenders at this moment and choose your next action.`,answers:decision.options.map((o,i)=>({grade:concept.side==='defense'?'strong':i===strong?'strong':'viable',feedback:concept.side==='defense'?o.condition:i===strong?`This is the illustrated opening. ${o.condition}`:`This is a conditional alternative, not an equally open pass in this picture. ${o.condition}`})) as ReadScenario['answers']};
}
export function outcomeFrames(concept: Concept, decision: Decision, choice: number | null): Four<Frame> {
 if(choice===null||concept.side==='defense')return concept.frames;
 const frames=structuredClone(concept.frames),option=decision.options[choice];
 for(let i=decision.start;i<4;i++){frames[i].ball=decision.from;frames[i].pass=null;delete frames[i].ballPosition;}
 if(option.kind==='drive'&&option.point){frames[3].players[decision.from-1]=option.point;}
 else if(option.kind==='shot'){frames[3].ballPosition=[300,89];}
 else if(option.to){frames[3].ball=option.to;frames[3].pass=[decision.from as 1|2|3|4|5,option.to as 1|2|3|4|5];}
 return frames;
}
const area=(p: [number,number])=>p[1]<170?'near the baseline':p[0]<180?'on the left side':p[0]>420?'on the right side':p[1]>310?'above the arc':'in the middle';
export function playerCue(concept: Concept, decision: Decision, player: EntityId, step: number): string {
 const current=concept.frames[step],next=concept.frames[Math.min(step+1,3)],p=current.players[player-1];
 const roleCues: Partial<Record<Concept['id'],Partial<Record<EntityId,Four<string>>>>>={
 'spain':{4:['Start inside and see x5. Leave enough distance to establish a legal blind screen.','Approach x5’s recovery path as the first ball screen starts.','Get stationary for the back screen as 5 dives. Do not chase x5.','Pop to the vacant slot. Catch ready; staying in the lane lets your defender help on 5.'],5:['Prepare to screen for 1 while 4 waits inside.','Set the first screen and let the handler clear your hip.','Dive as 4 back-screens your defender. Show a target at the rim.','Finish if the rim pass comes; keep the lane open if the ball goes to the pop.']},
 'short-roll':{5:['Prepare to screen with a clear pocket behind the ball defenders.','Set the screen and recognize both defenders committing to 1.','Stop in the middle, catch on balance, and face the rim.','Read the low defender: finish if they stay home, pass behind them if they commit.']},
 'two-on-one':{2:['Run wide enough that the lone defender cannot cover both lanes.','Keep pace with the ball while preserving a diagonal passing window.','Show hands as the defender steps toward 1. Avoid drifting behind the backboard.','Catch and finish promptly before the defender can recover.']},
 'zone-high-post':{4:['Find the seam between the top guards and the center.','Show hands in the gap as the ball moves the top line.','Catch facing the rim and make the center choose.','Deliver behind the center, then re-space for a return pass.'],5:['Occupy the short corner behind the bottom line.','Stay visible to the high post without stacking on the same passing line.','Show a target behind the center’s step toward 4.','Catch ready to finish or pass if the low wing collapses.']},
 };
 const authored=roleCues[concept.id]?.[player];
 if(authored)return authored[step];
 const assignment=decision.options.find(o=>o.from===player);
 if(player>5){
  if(assignment)return step<decision.start?`Start ${area(p)}, seeing the ball and the next threat. Prepare to ${assignment.title.toLowerCase()} as the action develops.`:assignment.condition;
  if(concept.group==='Zone defense'||concept.group==='Zone offense')return `Stay connected ${area(p)}. See the ball and the nearest gap; shift with the pass and locate a body when the shot goes up.`;
  if(concept.group.includes('Transition'))return `Recover inside out ${area(p)}. Identify the most dangerous uncovered threat and communicate the matchup.`;
  return `Stay connected ${area(p)}. See the ball and your current assignment. Help only when the threat requires it, then recover as the ball moves.`;
 }
 if(concept.inbound?.player===player&&step<2)return 'Keep both feet outside the boundary, read the denial, and find the entry or safety before the count expires.';
 if(concept.screens?.[step as 0|1|2|3]?.some(p=>p===player))return 'Arrive at the defender’s hip and get stationary. Hold a legal angle, then separate after the handler clears your shoulder.';
 if(current.ball===player)return `${player===decision.from?'You own this decision. ':''}${concept.steps[step].cue}`;
 const read=decision.options.find(o=>o.to===player);
 if(read&&step<decision.start)return `Stay available ${area(p)} and time your movement with the ball. Your upcoming window: ${read.title.toLowerCase()}.`;
 if(read)return `Show a clear target ${area(next.players[player-1])}. ${read.condition}`;
 const moving=Math.hypot(p[0]-next.players[player-1][0],p[1]-next.players[player-1][1])>30;
 return moving?`Relocate ${area(next.players[player-1])} as the action develops. Preserve the passing window and arrive ready for the next touch.`:`Hold your spacing ${area(p)}. Make your defender choose between staying attached and helping; be ready on the catch.`;
}
