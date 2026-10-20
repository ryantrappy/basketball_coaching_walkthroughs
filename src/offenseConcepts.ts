import type { OffenseConcept } from './types';
import { frame, steps } from './lessonHelpers';

export const extraOffense: OffenseConcept[] = [
 {
  id:'empty-corner',screens:{1:[5]},name:'Empty-corner pick & roll',group:'Ball screens',tag:'Take away the easy tag',
  description:'Clear the ball-side corner before a side pick-and-roll. The roller attacks an empty baseline, forcing help to travel from the other side of the floor.',
  focus:'Watch the weak-side low defender. Clearing the near corner makes their help decision longer and more visible.',
  frames:[
   frame({1:[475,285],2:[370,365],4:[155,325],5:[400,230],6:[447,269],7:[355,335],9:[180,300],10:[365,213]}),
   frame({1:[475,285],2:[325,365],4:[145,310],5:[445,250],6:[447,269],7:[325,335],9:[175,280],10:[400,213]}),
   frame({1:[400,205],2:[320,365],4:[135,280],5:[470,145],6:[435,235],7:[320,330],8:[135,140],9:[180,240],10:[360,155]}),
   frame({1:[385,175],2:[320,365],4:[135,280],5:[345,105],6:[415,205],7:[320,330],8:[190,130],9:[180,240],10:[355,145]},5,[1,5]),
  ],
  steps:steps([
   ['Clear the near corner','2 lifts out before the screen arrives. 3 and 4 stay on the weak side, leaving the right baseline empty.','Clear first. Screening into an occupied corner keeps the help nearby.'],
   ['Set the side screen','5 gets stationary on x1’s inside hip. 1 comes off tightly toward the middle.','Make the big defend a real downhill threat.'],
   ['Roll into the vacancy','5 dives through the empty side. The weak-side low defender must cross the lane to tag.','Read the far-side help before committing to the roll pass.'],
   ['Deliver or skip','This possession finds 5 at the rim. If x3 crosses early, the weak-side corner becomes the next pass.','An empty corner changes where help comes from; it does not remove help.'],
  ]),
  reads:[['Weak side stays home','Keep x5 engaged and deliver to the roller when the passing window opens.'],['Low defender crosses','Skip to the weak-side corner behind the tag. Read the next defender rotating down.'],['Defense calls ICE','The defender may deny the middle. Reject toward the empty baseline or have the screener change the angle.']],
  mistake:'Running the screen before the corner clears. That defender can tag the roller and recover with a short closeout.',
  practice:'Play 3-on-3 with a ball handler, screener, and weak-side corner. Let the low defender choose between tagging and staying home.',
  related:['pick-roll','ice-coverage','tag-xout'],source:'fiba',
 },
 {
  id:'ghost-screen',name:'Ghost screen',group:'Two-player actions',tag:'Make an early switch costly',
  description:'A shooter approaches as if to set a ball screen, then slips away before contact. The fake can expose a defense that switches too early or hesitates between assignments.',
  focus:'Watch the two screen defenders. A ghost works when their communication or positioning creates a gap.',
  frames:[
   frame({4:[365,345],5:[75,265],9:[355,315],10:[100,240]}),
   frame({4:[290,335],5:[75,265],9:[305,300],10:[100,240]}),
   frame({1:[365,260],4:[210,350],5:[75,265],6:[320,290],9:[360,235],10:[100,240]}),
   frame({1:[390,235],4:[210,350],5:[75,265],6:[335,275],9:[370,210],10:[100,240]},4,[1,4]),
  ],
  steps:steps([
   ['Sell the approach','4 comes toward the ball like a screener. The corners stay deep and 5 clears the middle.','Use a credible screening angle, not a casual fly-by.'],
   ['Leave before contact','4 ghosts away to the open left slot. No screen is set; there is no need to manufacture contact.','Leave as the defenders begin their exchange.'],
   ['Attack the hesitation','1 drives the gap as x4 steps toward the ball. 4 separates behind that defensive commitment.','The handler must punish the gap or both defenders can recover.'],
   ['Find the shooter','The example returns the ball to 4. If both defenders stay with the shooter, keep the downhill advantage.','A ghost is a read against a reaction, not an automatic open three.'],
  ]),
  reads:[['Both defenders take the ball','Pass back to the ghosting shooter before the switch can be repaired.'],['Both stay with the shooter','The handler attacks the open lane. Do not pass away the advantage just to complete the action.'],['Defense stays attached','Flow into a real screen, handoff, or second action. A disciplined defense may give up nothing.']],
  mistake:'Ghosting without a shooting threat or a convincing approach. The defenders have no reason to exchange assignments.',
  practice:'Play 2-on-2 with a shooter as the ghost screener. Let the defense switch or stay; allow a real re-screen if the fake creates nothing.',
  related:['switch-coverage','pick-pop','handoff'],source:'ghost',
 },
 {
  id:'forty-five-cut',name:'45 cut',group:'Off-ball spacing',tag:'Cut behind the helper’s head',
  description:'When a wing defender turns toward a teammate’s drive, cut from the 45-degree wing behind their vision. Coordinate it with the corner so two players do not arrive in the same lane.',
  focus:'Watch x4’s head and chest. The cut starts when they commit to the ball and lose sight of 4.',
  frames:[
   frame({1:[460,300],4:[150,310],5:[300,365],6:[430,280],9:[185,280],10:[300,330]}),
   frame({1:[400,215],4:[150,310],5:[300,365],6:[425,245],8:[110,140],9:[235,235],10:[300,320]}),
   frame({1:[375,170],4:[235,190],5:[300,365],6:[405,200],8:[130,140],9:[270,225],10:[300,320]}),
   frame({1:[375,155],4:[285,115],5:[300,365],6:[400,185],8:[150,140],9:[265,165],10:[300,320]},4,[1,4]),
  ],
  steps:steps([
   ['Hold the weak-side width','4 starts on the left wing with 3 in the corner. The middle remains open for 1’s drive.','Do not cut just because the ball moves.'],
   ['See the helper turn','1 penetrates from the right. x4 pinches into the lane and turns toward the ball.','Read the defender’s attention, not a predetermined count.'],
   ['Cut behind the help','4 cuts behind x4 toward the rim. 3 stays deep in the corner to keep a separate passing window.','One cutter uses the lane; the corner preserves width.'],
   ['Finish or keep flowing','1 hits 4 on the cut. If the pass is closed, 4 clears through and teammates refill the vacated wing.','An unthrown cut still works if it moves help and restores spacing.'],
  ]),
  reads:[['Wing defender commits','Cut behind them while the passer can still see a direct window.'],['Low defender takes the cut','The corner may open behind that help. The passer should keep both windows in view.'],['Defender stays connected','Hold your spacing or relocate. Cutting into an occupied lane can make the drive harder.']],
  mistake:'Cutting while the defender can see both you and the ball, or cutting into a teammate already occupying the dunker spot.',
  practice:'Play 3-on-3 with a driver, weak-side wing, and corner. Give the wing defender freedom to help or stay, and reward the correct spacing decision.',
  related:['drive-kick','closeout-contain','hammer'],source:'cuts',
 },
 {
  id:'hammer',screens:{1:[4],2:[4]},name:'Hammer action',group:'Three-player actions',tag:'A baseline drive with a weak-side screen',
  description:'Pair a baseline drive with a weak-side back screen that frees a shooter drifting into the opposite corner. The ball travels behind the help, often along the baseline.',
  focus:'Watch x3 on the weak side. The drive turns their attention while the back screen delays their recovery to the corner.',
  frames:[
   frame({2:[470,350],7:[455,315],1:[490,250],3:[130,280],4:[120,160],5:[310,350],6:[465,230],8:[160,250],9:[150,170],10:[310,315]}),
   frame({2:[470,350],7:[455,315],1:[525,160],3:[125,235],4:[130,200],5:[310,350],6:[495,190],8:[165,205],9:[155,165],10:[310,315]}),
   frame({2:[470,350],7:[455,315],1:[455,85],3:[50,125],4:[150,195],5:[310,350],6:[485,125],8:[175,175],9:[190,155],10:[310,290]}),
   frame({2:[470,350],7:[455,315],1:[410,85],3:[50,110],4:[160,200],5:[310,350],6:[450,115],8:[115,155],9:[190,155],10:[310,290]},3,[1,3]),
  ],
  steps:steps([
   ['Keep the far corner empty','3 starts on the weak-side wing. 4 is positioned to screen x3 as 1 prepares to drive baseline.','The shooter needs an empty corner to drift into.'],
   ['Start the baseline drive','1 wins the outside shoulder. 4 gets stationary in x3’s recovery path with legal space for a blind screen.','The screen arrives with the drive, not after the ball is trapped.'],
   ['Drift behind the screen','3 moves into the opposite corner as 4 delays x3. 1 stays inbounds and looks through the baseline window.','See the receiver before leaving your feet.'],
   ['Fire the corner pass','1 passes to 3 before x3 can recover. If help blocks the baseline window, finish or find the safety outlet.','A spectacular pass is optional; a visible passing lane is not.'],
  ]),
  reads:[['Screen catches the recovery','Find the corner shooter before the defense can switch out.'],['Defense switches the back screen','The screener may slip into space, or the drive may already have a finish. Avoid throwing into the new matchup.'],['Baseline pass is taken away','Keep a live dribble and use the slot outlet. Do not jump out of bounds hoping the corner will open.']],
  mistake:'Driving under the backboard without seeing the corner, or having the screener move into the recovering defender.',
  practice:'Walk through 3-on-3 on the weak side plus the driver. Add a live baseline helper and require the passer to identify the corner before releasing.',
  related:['drive-kick','forty-five-cut','tag-xout'],source:'terminology',
 },
];
