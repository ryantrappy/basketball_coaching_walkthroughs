import { tacticalPassingReads } from './tacticalReads';
import type { OffenseId, InboundsId, PassingDecision, Point } from './types';
import { inboundsReads } from './inboundsReads';
// These are conditional choices at the decision point, before the example pass.
// `to` follows a player as they move; `point` describes an attack toward the rim.
export const passingReads: Record<OffenseId | InboundsId, PassingDecision> = {
 ...tacticalPassingReads,
 ...inboundsReads,
 'pick-pop': { from: 1, start: 2, options: [
  { to: 5, title: 'Find the pop', condition: 'When x5 commits to the drive, pass back to 5 outside the arc before the recovery.', example: true, bend: -25 },
  { to: 3, title: 'Skip to the corner', condition: 'If x3 leaves the weak-side corner to help in the lane, skip to 3. Read the flight path before releasing.', bend: 35 },
  { to: 4, title: 'Kick to the wing', condition: 'If x4 pinches in to stop the ball, find 4 on the right wing before the rotation recovers.', bend: -30 },
 ]},
 'pick-roll': { from: 1, start: 2, options: [
  { to: 5, title: 'Hit the roller', condition: 'When x5 steps to the ball and the low defender stays home, deliver the pocket pass to 5.', example: true, bend: -24 },
  { to: 3, title: 'Skip behind the tag', condition: 'If x3 tags the roller, pass to 3 in the weak-side corner instead of forcing the roll pass.', bend: 30 },
  { to: 2, title: 'Find the strong-side corner', condition: 'If x2 helps off the strong-side corner, kick to 2. Keep the dribble alive until the help commits.', bend: -25 },
 ]},
 'short-roll': { from: 5, start: 2, options: [
  { to: 3, title: 'Find the corner', condition: 'When x3 steps across to protect the rim, hit 3 in the corner behind that help.', example: true, bend: 30 },
  { to: 4, title: 'Find the lifted wing', condition: 'If x4 pinches in from the wing, pass to 4 before the trapping defenders can recover.', bend: -35 },
  { point: [300,105], kind: 'drive', title: 'Keep it to the rim', condition: 'If the low defenders stay with their shooters, attack the open lane yourself.', bend: 12 },
 ]},
 spain: { from: 1, start: 2, options: [
  { to: 4, title: 'Find the pop', condition: 'When the defense stays with the roll, pass back to 4 as the back-screener exits beyond the arc.', example: true, bend: -32 },
  { to: 5, title: 'Hit the roller', condition: 'If the back screen delays x5 and no low defender rotates, find 5 at the rim. Lob only with a clear window.', bend: -25 },
  { to: 2, title: 'Kick to the corner', condition: 'If x2 leaves the corner to cover the roll, pass to 2 behind the help.', bend: 25 },
 ]},
 'drive-kick': { from: 1, start: 1, options: [
  { to: 3, title: 'Skip to the weak side', condition: 'When x3 leaves the opposite corner to protect the rim, skip to 3 while the lane is clear.', example: true, bend: 25 },
  { to: 2, title: 'Kick to the near corner', condition: 'If x2 steps in from the strong-side corner, pass to 2. The corner stays wide to preserve this window.', bend: -25 },
  { to: 4, title: 'Return to the slot', condition: 'If x4 sinks into the paint, find 4 lifting behind the drive. They can shoot or keep the ball moving.', bend: -30 },
 ]},
 handoff: { from: 1, start: 2, options: [
  { to: 5, title: 'Feed the roll', condition: 'If x5 steps up to contain the receiver, pass to 5 rolling behind the help.', example: true, bend: -30 },
  { to: 2, title: 'Find the corner', condition: 'When x2 rotates into the lane to tag 5, find 2 in the right corner.', bend: 30 },
  { point: [320,105], kind: 'drive', title: 'Keep it downhill', condition: 'If the big stays with 5 and your defender trails the handoff, keep the ball and attack the rim.', bend: 24 },
 ]},
 'empty-corner': {from:1,start:2,options:[
  {to:5,title:'Find the empty-side roll',condition:'If x5 stays with the ball and the weak-side low defender is late, find 5 in the vacant lane.',example:true,bend:-25},
  {to:3,title:'Skip behind the tag',condition:'When x3 crosses the lane to tag, pass behind them to the weak-side corner.',bend:30},
  {to:2,title:'Use the lifted outlet',condition:'If x2 sinks into the lane, find 2 lifted behind the action to shoot or start the next drive.',bend:-30},
 ]},
 'ghost-screen': {from:1,start:2,options:[
  {to:4,title:'Find the ghosting shooter',condition:'When the two defenders commit to the handler or hesitate in the exchange, return the ball to 4 in space.',example:true,bend:-25},
  {point:[340,115],kind:'drive',title:'Attack the gap',condition:'If both defenders follow the shooter, keep the ball and attack before help can meet the drive.',bend:20},
  {to:2,title:'Kick behind the help',condition:'If x2 leaves the strong-side corner to contain the drive, find 2 behind the rotation.',bend:-25},
 ]},
 'forty-five-cut': {from:1,start:2,options:[
  {to:4,title:'Hit the 45 cut',condition:'If x4 loses sight of 4 while helping on the drive, pass to the cut behind their head.',example:true,bend:-20},
  {to:3,title:'Find the corner',condition:'If x3 steps across to cover the cutter, pass to 3 in the weak-side corner.',bend:30},
  {to:5,title:'Use the safety outlet',condition:'When the lane and corner are covered, pass back to 5 at the top and keep the advantage moving.',bend:-30},
 ]},
 hammer: {from:1,start:2,options:[
  {to:3,title:'Find the opposite corner',condition:'If the back screen delays x3 and the baseline window is clear, pass across to 3 in the opposite corner.',example:true,bend:12},
  {to:4,title:'Find the screener',condition:'If the defense switches out to the shooter and loses 4, find the screener in the space left behind.',bend:-25},
  {to:5,title:'Use the slot outlet',condition:'If help closes the baseline pass, keep your balance and find 5 as the safety outlet.',bend:-30},
 ]},
};

// Trim both ends so arrows meet the edge of each player marker, not its center.
export function readPath(from: Point, to: Point, bend = 0): {d: string; label: Point} {
 const dx = to[0]-from[0], dy = to[1]-from[1], length = Math.hypot(dx,dy) || 1;
 const trim = Math.min(23,length*.22);
 const start = [from[0]+dx/length*trim, from[1]+dy/length*trim];
 const end = [to[0]-dx/length*trim, to[1]-dy/length*trim];
 const control = [(start[0]+end[0])/2-dy/length*bend, (start[1]+end[1])/2+dx/length*bend];
 const label: Point = [.16*start[0]+.48*control[0]+.36*end[0], .16*start[1]+.48*control[1]+.36*end[1]];
 return { d: `M${start} Q${control} ${end}`, label };
}
