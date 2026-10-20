import type { DefenseId, DefensiveDecision } from './types';
// Coordinated responsibilities, rather than alternate passes. Indices 6–10 are x1–x5.
export const defensiveReads: Record<DefenseId, DefensiveDecision> = {
 'drop-coverage': { from:6, start:1, options:[
  {from:6,to:6,title:'Chase over',condition:'x1 fights over and reconnects to the handler’s hip. Recovery lets the big release back to the roller.',example:true},
  {from:10,to:10,title:'Contain two threats',condition:'x5 keeps the ball and roller in view, retreating at a depth that fits the handler’s shooting and the big’s mobility.'},
  {from:8,to:8,title:'Tag the roll',condition:'x3 gives temporary help against the rim threat, then recovers or exchanges assignments on a skip pass.'},
 ]},
 'switch-coverage': { from:10, start:1, options:[
  {from:10,to:10,title:'Take the handler',condition:'x5 becomes the ball defender and contains with a cushion suited to the new matchup.',example:true},
  {from:6,to:6,title:'Find the roller',condition:'x1 takes 5 immediately, getting inside position before the roller can establish an easy seal.'},
  {from:8,to:8,title:'Be ready to help',condition:'x3 sees the new mismatch and prepares the agreed help or rescue-switch rule without giving up an unnecessary corner three.'},
 ]},
 'blitz-coverage': { from:6, start:1, options:[
  {from:6,to:6,title:'Close the trap',condition:'x1 works with x5 to pressure the handler without leaving a split. Release into recovery as the ball escapes.',example:true},
  {from:8,to:8,title:'Protect the rim',condition:'x3 is the low defender. Meet the short-roll threat and make the catcher decide before they reach the rim.'},
  {from:9,to:9,title:'Split the weak side',condition:'x4 balances the weak-side wing and corner, ready to close on the next pass while the trapping defenders recover.'},
 ]},
 'ice-coverage': { from:6, start:1, options:[
  {from:6,to:6,title:'Deny the middle',condition:'x1 gets above the handler to deny the original screen, then trails the baseline route without giving up the inside shoulder.',example:true},
  {from:10,to:10,title:'Receive the drive',condition:'x5 gets below the ball before it is sent baseline, contains the handler, and stays aware of the screener’s release.'},
  {from:8,to:8,title:'Cover the low side',condition:'x3 reads the rim threat from the weak side. A help rotation must be connected to someone covering the corner.'},
 ]},
 'tag-xout': { from:8, start:1, options:[
  {from:8,to:8,title:'Tag, then rotate up',condition:'x3 interrupts the roll, then rotates to the weak-side wing as x4 takes the corner on the skip.',example:true},
  {from:9,to:9,title:'Close to the corner',condition:'x4 splits two threats, then closes down to 3 on the pass. This frees the tagger to recover to the wing.'},
  {from:10,to:10,title:'Retake the roller',condition:'x5 gets back to the roller so the low defender can leave the lane. Finish by identifying the new box-out matchups.'},
 ]},
 'closeout-contain': { from:8, start:1, options:[
  {from:8,to:8,title:'Contest, then contain',condition:'x3 covers space early, brakes into the contest, and stays attached to the first dribble instead of flying past the shooter.',example:true},
  {from:9,to:9,title:'Prepare the gap help',condition:'x4 sees the closeout drive and prepares a brief stunt if needed, without losing the pass back to 4.'},
  {from:10,to:10,title:'Stay behind the play',condition:'x5 stays balanced between the lane and their matchup, ready for the next penetration without abandoning a shooter early.'},
 ]},
};
