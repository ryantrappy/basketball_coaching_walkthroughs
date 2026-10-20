import type { InboundsConcept, InboundSetup } from './types';
import { frame, steps } from './lessonHelpers';

const baseline: InboundSetup = {edge:'baseline',player:1,spot:[420,-12],safety:3};
const sideline: InboundSetup = {edge:'sideline',player:1,spot:[-15,280],safety:3};

export const inboundsConcepts: InboundsConcept[] = [
 {
  id:'box-cross',side:'inbounds',name:'Box cross-screen',group:'Baseline (BLOB)',tag:'Rim first, safety always',inbound:baseline,screens:{1:[4]},
  description:'Start in a box, screen across the lane for the big, and separate a corner receiver from a high safety. The inbounder reads the rim without losing the easy release.',
  focus:'Watch x5 as 4 sets the cross-screen. A trailing defender opens the rim cut; an early switch changes the read.',
  frames:[
   frame({1:[420,-12],2:[220,250],3:[380,250],4:[220,140],5:[380,140],6:[420,55],7:[200,230],8:[405,230],9:[240,155],10:[355,150]}),
   frame({1:[420,-12],2:[400,240],3:[400,310],4:[285,145],5:[380,140],6:[420,55],7:[365,220],8:[385,285],9:[315,170],10:[340,150]}),
   frame({1:[420,-12],2:[550,155],3:[400,355],4:[300,170],5:[235,110],6:[410,65],7:[515,170],8:[385,325],9:[315,195],10:[285,130]}),
   frame({1:[450,65],2:[550,145],3:[400,355],4:[300,180],5:[245,100],6:[410,80],7:[520,165],8:[385,325],9:[315,200],10:[285,125]},5,[1,5]),
  ],
  steps:steps([
   ['Set the box and the safety','1 throws in to the right of the basket. 4 and 5 occupy the blocks; 2 and 3 start higher. 3 owns the high safety release.','The safety is an assignment, not whoever happens to be open.'],
   ['Screen across the lane','4 gets stationary across x5’s path. 5 waits for the screen while 2 clears toward the right corner and 3 lifts.','Create separation before asking the inbounder to pass.'],
   ['Cut and separate the windows','5 cuts tightly to the left side of the rim. The corner and high safety stay in distinct passing lanes.','Read the defender taking the cutter, not just the cutter’s hands.'],
   ['Enter to the best window','The example finds 5. Once the pass is released, 1 enters the floor and the team spaces for the next action.','If the rim is covered, take the release that keeps possession.'],
  ]),
  reads:[['Defense trails the cross-screen','Hit the cutter’s outside hand in the visible window. Avoid a blind pass through the rim protector.'],['Defense switches','The screener can seal the smaller defender, or the corner may open as help sinks. Read the new matchups.'],['Both scoring looks are denied','Use 3 lifting high as the planned safety. They must separate early enough to beat the throw-in count.']],
  mistake:'All four receivers move toward the basket, leaving the inbounder with no pass when the first cut is covered.',
  practice:'Play live 5-on-5 from the box with an official-style count. Alternate trailing and switching, and reward a clean safety entry as well as a score.',
  related:['box-sts','stack-release','switch-coverage'],source:'inbounds',
 },
 {
  id:'box-sts',side:'inbounds',name:'Box screen-the-screener',group:'Baseline (BLOB)',tag:'The second screen creates the shot',inbound:baseline,screens:{1:[4],2:[2]},
  description:'Use a cross-screen to draw attention to the rim, then screen for that first screener to release into the open middle. The inbounder reads both actions in sequence.',
  focus:'Watch x4 after the first screen. Looking toward the rim can cost them the head start on 4’s release.',
  frames:[
   frame({1:[420,-12],2:[225,260],3:[380,260],4:[225,145],5:[380,145],6:[420,55],7:[205,235],8:[405,235],9:[245,165],10:[355,155]}),
   frame({1:[420,-12],2:[260,235],3:[445,325],4:[290,145],5:[250,110],6:[420,55],7:[240,220],8:[420,305],9:[305,175],10:[295,130]}),
   frame({1:[420,-12],2:[275,205],3:[470,355],4:[300,290],5:[235,100],6:[420,60],7:[250,205],8:[445,330],9:[280,245],10:[270,125]}),
   frame({1:[450,65],2:[255,180],3:[470,355],4:[300,310],5:[235,100],6:[415,85],7:[245,205],8:[445,330],9:[280,270],10:[265,120]},4,[1,4]),
  ],
  steps:steps([
   ['Start from the same box','1 has the ball outside the baseline. 3 prepares to lift high on the right as a safety; 2 is the second screener.','Use the same alignment as the cross-screen play to hide the second action.'],
   ['Threaten the rim first','4 screens for 5 crossing the lane. 1 looks at 5 while 2 moves toward x4’s recovery route.','The first cut must be a real scoring threat.'],
   ['Screen for the screener','2 gets stationary for 4 to release up the lane. 3 stays high and wide so the two outlets do not converge.','Screen the recovery path; do not chase the defender.'],
   ['Find the release','The example finds 4 in the open middle, ready to shoot or flow into offense. 1 enters after releasing the throw-in.','A clean catch starts the next advantage even if the shot is covered.'],
  ]),
  reads:[['Rim cut opens immediately','Take 5 before the help closes. The second screen is a counter, not a reason to pass up a layup.'],['Defenders switch both screens','Read the seals after each exchange. A small defender on a big may be more valuable than the planned release.'],['Release is top-locked','4 can cut behind the denial if the lane is open. Otherwise use 3 as the safety rather than waiting for the play to repair itself.']],
  mistake:'The second screener arrives late or moves into the defender, so the release is covered or the action produces an offensive foul.',
  practice:'Walk the two screens at half speed, then play live with a count. Let the defense switch either screen so the inbounder must read the outcome.',
  related:['box-cross','inbound-return','pick-pop'],source:'inbounds',
 },
 {
  id:'stack-release',side:'inbounds',name:'Baseline stack releases',group:'Baseline (BLOB)',tag:'Separate three passing windows',inbound:baseline,
  description:'Put the four receivers in a vertical stack, then release them to different depths. The stack hides the routes; the spacing at the catch creates the advantage.',
  focus:'Watch whether the defenders follow cutters or exchange them. The release is useful only if the receivers finish in separate windows.',
  frames:[
   frame({1:[420,-12],2:[350,130],3:[350,280],4:[350,230],5:[350,180],6:[420,55],7:[325,125],8:[325,280],9:[325,230],10:[325,180]}),
   frame({1:[420,-12],2:[505,120],3:[350,300],4:[350,225],5:[350,165],6:[420,55],7:[470,145],8:[325,285],9:[325,230],10:[325,180]}),
   frame({1:[420,-12],2:[550,120],3:[305,365],4:[390,235],5:[300,110],6:[415,60],7:[510,145],8:[305,335],9:[365,215],10:[320,140]}),
   frame({1:[465,65],2:[550,140],3:[305,365],4:[400,240],5:[300,115],6:[435,85],7:[520,160],8:[305,335],9:[370,220],10:[325,140]},2,[1,2]),
  ],
  steps:steps([
   ['Agree on the release order','1 throws in beside the lane. 2 starts closest to the baseline, with 5, 4, and safety 3 stacked behind.','Know the routes before the official hands over the ball.'],
   ['Clear the first window','2 releases hard to the right short corner. The other receivers wait just long enough to keep their cuts from colliding.','A staggered release is timing, not standing still until the count is nearly gone.'],
   ['Split the rim and the safety','5 dives to the rim, 4 shows in the middle, and 3 lifts high. Each presents a different passing angle.','Do not let a single defender cover two release points.'],
   ['Catch and spread','The example enters to 2. 1 steps in after the release while the other receivers keep the lane from becoming crowded.','The stack is a starting alignment; do not remain stacked after the entry.'],
  ]),
  reads:[['Defenders chase through the stack','A sharp change of pace can free the short-corner or rim receiver. Make the pass to the actual gap.'],['Defenders switch the releases','A cutter can seal after the exchange. Receivers must recognize the switch rather than continuing into the same traffic.'],['Defense sits in a zone','The stack does not force a man-to-man response. Show receivers in gaps and use the high release if the rim stays protected.']],
  mistake:'Everyone breaks at the same time into the same side of the floor, letting one help defender disrupt several routes.',
  practice:'Run the release against both matching defenders and a compact zone. Use a live count and require the high safety to stay available through the entry.',
  related:['box-cross','sideline-slip','drive-kick'],source:'inbounds',
 },
 {
  id:'inbound-return',side:'inbounds',name:'Inbounder give-and-go',group:'Baseline (BLOB)',tag:'The passer becomes the cutter',inbound:baseline,screens:{1:[5],2:[5]},
  description:'Secure a wing entry, then bring the inbounder back into the play with a screen and a cut to the rim. The second pass exploits a defender who relaxes once the ball is inbounded.',
  focus:'Watch x1 after the entry. The inbounder is a live cutter as soon as the throw-in pass is released.',
  frames:[
   frame({1:[420,-12],2:[380,245],3:[260,350],4:[220,145],5:[380,145],6:[420,55],7:[360,220],8:[260,320],9:[240,145],10:[355,165]}),
   frame({1:[420,-12],2:[450,260],3:[260,350],4:[220,145],5:[390,205],6:[420,55],7:[405,235],8:[260,320],9:[240,145],10:[365,190]}),
   frame({1:[420,-12],2:[500,270],3:[260,365],4:[220,180],5:[390,115],6:[420,65],7:[475,245],8:[260,335],9:[240,180],10:[365,135]},2,[1,2]),
   frame({1:[355,105],2:[500,270],3:[260,365],4:[175,240],5:[400,140],6:[390,95],7:[475,245],8:[260,335],9:[195,220],10:[395,160]},1,[2,1]),
  ],
  steps:steps([
   ['Plan the entry and the return','1 throws in from the baseline. 5 prepares a down-screen for 2, while 3 remains high as the safety.','Get the first pass in before looking for the second one.'],
   ['Release the wing receiver','2 uses 5’s screen to separate toward the right wing. 1 waits outside the boundary with a clear angle to the catch.','A clean entry lets the receiver see the return action.'],
   ['Enter, then change the angle','1 passes to 2. After the release, 1 enters as 5 moves into a stationary back screen on x1’s recovery route.','The inbounder cannot step onto the court while still holding the throw-in.'],
   ['Read the return cut','1 cuts off the screen toward the rim and 2 delivers the return in this example. If covered, 2 reads 5 or safety 3.','Do not force the give-and-go just because it is the name of the play.'],
  ]),
  reads:[['Inbounder’s defender watches the ball','Use the cut behind their attention. The receiver must see the cutter before committing the pass.'],['Defense switches the back screen','5 can seal or slip into the vacated space. 2 reads the new rim defender before passing.'],['Return window is closed','Keep the wing catch, use 3 to reverse the ball, and flow into normal offense. The successful inbound is already useful.']],
  mistake:'The inbounder enters with the ball still in their hands, or the wing receiver precommits to a return pass through a covered lane.',
  practice:'Play the first entry against pressure, then keep the possession live for the return. Let x1 deny the cut so 2 must read the screener and the reversal.',
  related:['box-sts','sideline-zipper','forty-five-cut'],source:'inbounds',
 },
 {
  id:'sideline-zipper',side:'inbounds',name:'Sideline zipper entry',group:'Sideline (SLOB)',tag:'Get a guard open toward the ball',inbound:sideline,screens:{1:[5]},
  description:'Lift a guard from the block off a down-screen into a visible sideline entry. The screener can open to the rim, while a far-side guard stays available as the safety.',
  focus:'Watch x2’s route around the down-screen. A trail favors the lift; an early denial can open the cut behind it.',
  frames:[
   frame({1:[-15,280],2:[235,140],3:[430,370],4:[550,130],5:[235,250],6:[55,280],7:[210,165],8:[430,340],9:[520,145],10:[260,230]}),
   frame({1:[-15,280],2:[235,170],3:[430,370],4:[550,130],5:[235,235],6:[55,280],7:[210,195],8:[430,340],9:[520,145],10:[265,235]}),
   frame({1:[-15,280],2:[180,350],3:[430,370],4:[550,130],5:[290,170],6:[55,280],7:[215,310],8:[430,340],9:[520,145],10:[275,200]}),
   frame({1:[80,280],2:[170,350],3:[430,370],4:[550,130],5:[300,150],6:[105,260],7:[200,320],8:[430,340],9:[520,145],10:[275,175]},2,[1,2]),
  ],
  steps:steps([
   ['Start with two different outlets','1 has a frontcourt sideline throw-in. 2 begins low, 5 is above them, and 3 holds the far-side high safety.','The safety stays separate from the receiver’s lift.'],
   ['Set the down-screen','5 gets stationary in x2’s route as 2 sets up the cut. Leave the defender legal space to react.','The screen opens the catch only if the cutter uses it tightly.'],
   ['Lift into a visible window','2 cuts up off the screen toward the left slot. 5 opens toward the rim as the defense reacts.','Show hands in a lane the inbounder can actually see.'],
   ['Enter and flow','1 finds 2 and steps onto the floor after the pass. 2 can now use 5 in the next action or reverse through 3.','The entry is the beginning of the possession, not a mandatory shot.'],
  ]),
  reads:[['Defender trails the cut','Lead 2 into the open catch without pulling them back into the trailing defender.'],['Defender top-locks the lift','2 can cut toward the rim behind the denial if the lane is clear. 5 must not roll into the same space.'],['Defense switches the down-screen','Read 5 sealing the smaller defender or use the far-side safety. Do not throw to the route the defense has already taken away.']],
  mistake:'The receiver lifts directly into the inbounder’s defender or the safety cuts into the same passing lane.',
  practice:'Play 4-on-4 with an inbounder, cutter, screener, and high safety, all guarded live. Mix trail, top-lock, and switch coverage with a throw-in count.',
  related:['inbound-return','handoff','switch-coverage'],source:'sideline',
 },
 {
  id:'sideline-slip',side:'inbounds',name:'Sideline screen & slip',group:'Sideline (SLOB)',tag:'Punish the early exchange',inbound:sideline,screens:{1:[5]},
  description:'Screen to free a perimeter entry, then slip the screener toward the rim if both defenders lean into the exchange. Keep a short release and a high safety behind that scoring look.',
  focus:'Watch x5 when 2 lifts. The slip opens only if that defender leaves the screener to take the perimeter receiver.',
  frames:[
   frame({1:[-15,280],2:[150,310],3:[430,380],4:[550,130],5:[185,245],6:[55,280],7:[175,285],8:[430,350],9:[520,145],10:[210,225]}),
   frame({1:[-15,280],2:[165,315],3:[430,380],4:[550,130],5:[170,280],6:[55,280],7:[190,295],8:[430,350],9:[520,145],10:[200,255]}),
   frame({1:[-15,280],2:[220,350],3:[430,380],4:[550,130],5:[265,155],6:[55,280],7:[220,295],8:[430,350],9:[520,145],10:[220,320]}),
   frame({1:[80,280],2:[220,350],3:[430,380],4:[550,130],5:[300,125],6:[110,260],7:[245,225],8:[430,350],9:[520,145],10:[235,315]},5,[1,5]),
  ],
  steps:steps([
   ['Show the perimeter entry','1 throws in from the sideline. 2 prepares to lift off 5 while 3 stays high on the far side as the safety.','The perimeter entry must look real to make the switch commit.'],
   ['Make the defenders declare','5 arrives to screen as 2 changes pace toward the slot. The inbounder watches the defenders’ exchange.','If contact happens, the screener must be stationary and legal.'],
   ['Slip behind the exchange','As x5 takes the lift, 5 leaves toward the rim before x2 can recover inside. 2 continues to show a short outlet.','A slip is an option against commitment, not a reason to abandon every screen.'],
   ['Pass to the available catch','This example finds 5 at the rim. If the lane is covered, use 2’s release or safety 3 before the count expires.','A protected entry beats a forced lob into help.'],
  ]),
  reads:[['Both defenders follow the lift','The slip may open. Put the pass where only the cutter can catch and keep the rim protector in view.'],['Defenders stay with their matchups','Finish the screening action and use the perimeter entry. No switch means there may be no slip advantage.'],['Help takes the slip','Find 2 or the high safety. The screener clears the lane after an unthrown cut so the next action has space.']],
  mistake:'The screener slips before the defenders commit, so the perimeter receiver stays covered and the lane is already protected.',
  practice:'Run 4-on-4 with a live low helper and a count. Let the screen defenders choose whether to switch; score the offense on the correct entry decision.',
  related:['stack-release','ghost-screen','switch-coverage'],source:'sideline',
 },
];
