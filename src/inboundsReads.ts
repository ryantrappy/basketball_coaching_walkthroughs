import type { InboundsId, PassingDecision } from './types';
export const inboundsReads: Record<InboundsId, PassingDecision> = {
 'box-cross': {from:1,start:2,options:[
  {to:5,title:'Hit the rim cut',condition:'If x5 trails the cross-screen and the rim window is visible, lead 5 into a catch away from the help.',example:true,bend:-15},
  {to:2,title:'Find the corner',condition:'If the corner defender sinks toward the rim, find 2 separating on the right side.',bend:-25},
  {to:3,title:'Use the high safety',condition:'When both scoring windows are covered, enter to 3 lifting high. Make the release before the throw-in count expires.',safety:true,bend:35},
 ]},
 'box-sts': {from:1,start:2,options:[
  {to:4,title:'Find the second release',condition:'When x4 gets caught watching the rim cut, find 4 releasing off 2’s screen into the middle.',example:true,bend:-25},
  {to:5,title:'Take the first rim cut',condition:'If 5 wins the cross-screen, deliver the first scoring look instead of waiting for the second action.',bend:-15},
  {to:3,title:'Use the high safety',condition:'If the rim and middle are denied, use 3 lifting high on the right. Their job is to preserve possession.',safety:true,bend:30},
 ]},
 'stack-release': {from:1,start:1,options:[
  {to:2,title:'Find the short corner',condition:'If x2 trails the first release, hit 2 outside the lane before the recovery closes the window.',example:true,bend:-20},
  {to:5,title:'Hit the rim release',condition:'If the defenders follow the perimeter releases and lose 5, find the cut toward the rim.',bend:15},
  {to:3,title:'Use the high safety',condition:'If the defense protects both low windows, enter to 3 lifting above the action rather than forcing a pass through traffic.',safety:true,bend:25},
 ]},
 'inbound-return': {from:2,start:2,context:'After the entry catch',options:[
  {to:1,title:'Return to the inbounder',condition:'After the initial entry, 1 cuts off 5’s back screen. Find the return only if x1 loses the route to the rim.',example:true,bend:20},
  {to:5,title:'Find the screener',condition:'If the defense switches to cover the inbounder, read 5 sealing or opening behind the exchange.',bend:-20},
  {to:3,title:'Reverse through the safety',condition:'If the give-and-go is covered, keep the wing catch and reverse to 3. The throw-in is complete; flow into normal offense.',safety:true,bend:-30},
 ]},
 'sideline-zipper': {from:1,start:1,options:[
  {to:2,title:'Find the zipper lift',condition:'If x2 trails the down-screen, pass ahead of 2 into the visible lift toward the left slot.',example:true,bend:-20},
  {to:5,title:'Find the seal',condition:'If the defenders switch the down-screen, read 5 opening or sealing inside against the smaller defender.',bend:-15},
  {to:3,title:'Use the far-side safety',condition:'If the near entry is denied, use 3 staying high and separate on the far side. Check the pass over the help before releasing.',safety:true,bend:30},
 ]},
 'sideline-slip': {from:1,start:2,options:[
  {to:5,title:'Hit the slip',condition:'If both defenders lean into the perimeter exchange, find 5 slipping into the lane before the low defender closes it.',example:true,bend:-15},
  {to:2,title:'Use the short release',condition:'If help takes the slip, find 2 holding the perimeter release. Keep the catch away from the inbounder’s defender.',bend:20},
  {to:3,title:'Use the far-side safety',condition:'If both nearby windows are closed, release to 3 high on the far side before the count expires.',safety:true,bend:30},
 ]},
};
