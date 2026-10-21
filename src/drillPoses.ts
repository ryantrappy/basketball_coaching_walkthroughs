import type { Four, Point } from './types';
import type { Joint, Movement, Pose } from './drillTypes';

const stance: Pose={head:[315,134],neck:[315,169],leftShoulder:[277,190],rightShoulder:[349,190],leftElbow:[243,250],rightElbow:[385,251],leftHand:[233,297],rightHand:[389,315],leftHip:[289,296],rightHip:[337,296],leftKnee:[261,365],rightKnee:[362,365],leftAnkle:[244,435],rightAnkle:[379,435],ball:[390,335]};
const pose=(changes:Partial<Pose>={}):Pose=>({...stance,...changes});
const sink=(changes:Partial<Pose>={}):Pose=>pose({head:[315,152],neck:[315,186],leftShoulder:[276,206],rightShoulder:[349,206],leftHip:[288,315],rightHip:[338,315],leftKnee:[257,373],rightKnee:[367,373],...changes});
const exit=():Pose=>pose({head:[342,129],neck:[334,165],leftShoulder:[304,187],rightShoulder:[368,192],leftHip:[306,290],rightHip:[350,287],leftKnee:[282,367],rightKnee:[390,353],leftAnkle:[259,433],rightAnkle:[421,426],leftElbow:[280,248],leftHand:[289,296],rightElbow:[393,244],rightHand:[421,300],ball:[430,331]});
const leftExit=():Pose=>{
 const right=exit();return Object.fromEntries(Object.entries(right).map(([key,p])=>[key.startsWith('left')?key.replace('left','right'):key.startsWith('right')?key.replace('right','left'):key,[640-p[0],p[1]]])) as Pose;
};
const dribbling:Partial<Record<Movement,Four<Pose>>>={
 pound:[pose(),sink({rightElbow:[383,280],rightHand:[391,363],ball:[394,423]}),sink({rightElbow:[386,262],rightHand:[391,313],ball:[393,335]}),pose({rightElbow:[383,229],rightHand:[390,262],ball:[391,285]})],
 pocket:[pose(),sink({leftShoulder:[283,208],rightShoulder:[334,201],rightElbow:[375,265],rightHand:[395,310],ball:[402,332],rightHip:[330,317]}),sink({rightElbow:[381,284],rightHand:[407,345],ball:[412,379]}),exit()],
 cross:[sink({head:[331,148],leftHip:[299,315],rightHip:[347,315],rightKnee:[384,374],rightAnkle:[399,435]}),sink({rightElbow:[352,274],rightHand:[317,355],leftHand:[240,350],ball:[291,409]}),sink({head:[287,146],leftShoulder:[252,201],rightShoulder:[325,204],leftHip:[267,313],rightHip:[314,313],leftHand:[223,328],leftElbow:[233,266],rightHand:[297,310],ball:[215,350],leftAnkle:[220,435]}),pose({head:[265,130],neck:[268,165],leftShoulder:[236,187],rightShoulder:[302,192],leftHip:[256,290],rightHip:[300,288],leftKnee:[218,355],rightKnee:[331,366],leftAnkle:[194,432],rightAnkle:[358,429],leftElbow:[213,246],leftHand:[191,294],rightHand:[305,290],ball:[180,327]})],
 between:[sink({leftAnkle:[274,416],rightAnkle:[380,441],leftKnee:[265,358],rightKnee:[368,380]}),sink({leftAnkle:[274,416],rightAnkle:[380,441],leftKnee:[265,358],rightKnee:[368,380],rightHand:[336,352],leftHand:[275,355],ball:[312,414]}),sink({leftHand:[250,341],leftElbow:[245,281],ball:[245,367],leftAnkle:[274,416],rightAnkle:[380,441]}),leftExit()],
 hesitation:[pose(),pose({head:[315,106],neck:[315,142],leftShoulder:[278,161],rightShoulder:[349,161],leftHip:[289,280],rightHip:[337,280],rightElbow:[387,221],rightHand:[392,268],ball:[393,292],leftKnee:[270,353],rightKnee:[352,353]}),sink({rightHand:[396,347],ball:[404,407]}),exit()],
 retreat:[pose(),sink({head:[293,156],neck:[295,188],leftShoulder:[266,210],rightShoulder:[326,207],leftHip:[273,317],rightHip:[319,317],leftKnee:[261,373],rightKnee:[350,373],rightHand:[386,344],ball:[395,388],leftAnkle:[231,435],rightAnkle:[371,435]}),sink({rightHand:[320,350],leftHand:[241,342],ball:[286,414]}),leftExit()],
};
const shotLoad:Pose=pose({head:[311,148],neck:[307,182],leftShoulder:[295,199],rightShoulder:[322,198],leftHip:[278,302],rightHip:[306,305],leftKnee:[325,370],rightKnee:[358,369],leftAnkle:[283,436],rightAnkle:[337,436],leftElbow:[332,252],rightElbow:[368,255],leftHand:[363,214],rightHand:[387,227],ball:[385,207]});
const shotSet:Pose={...shotLoad,head:[315,123],neck:[310,157],leftShoulder:[298,178],rightShoulder:[326,177],leftHip:[289,283],rightHip:[315,284],leftKnee:[318,355],rightKnee:[349,354],leftElbow:[352,191],rightElbow:[366,188],leftHand:[374,128],rightHand:[349,137],ball:[350,115]};
const shotRelease:Pose={...shotSet,head:[315,112],neck:[311,146],leftShoulder:[297,168],rightShoulder:[326,167],leftHip:[294,270],rightHip:[320,270],leftKnee:[297,346],rightKnee:[333,345],leftAnkle:[286,421],rightAnkle:[336,421],leftElbow:[371,170],rightElbow:[344,108],leftHand:[392,109],rightHand:[351,62],ball:[364,39]};
const shotFinish:Pose={...shotLoad,leftElbow:[367,185],rightElbow:[344,117],leftHand:[389,133],rightHand:[352,67],ball:[558,87]};
export function drillPoses(movement:Movement,camera:'front'|'side'):Four<Pose>{
 if(dribbling[movement]){
  const poses=structuredClone(dribbling[movement]!);
  if(camera==='side')return poses.map(p=>({...p,leftShoulder:[p.neck[0]-15,p.leftShoulder[1]],leftHip:[p.leftHip[0]+15,p.leftHip[1]],leftKnee:[p.leftKnee[0]+24,p.leftKnee[1]],leftAnkle:[p.leftAnkle[0]+20,p.leftAnkle[1]]})) as Four<Pose>;
  return poses;
 }
 const poses:Four<Pose>=structuredClone([shotLoad,shotSet,shotRelease,shotFinish]);
 if(movement==='touch')poses.forEach(p=>{p.leftElbow=[258,245];p.leftHand=[247,305];});
 if(movement==='one-two'){
  poses[1]=structuredClone(shotLoad);
  poses[0].leftAnkle=[274,436];poses[0].rightAnkle=[388,411];poses[0].rightKnee=[367,359];
 }
 if(movement==='hop'){
  poses[0].leftAnkle=[267,415];poses[0].rightAnkle=[322,415];poses[0].leftKnee=[308,354];poses[0].rightKnee=[348,352];
  poses[1]={...shotLoad,leftAnkle:[277,436],rightAnkle:[341,436]};
 }
 if(movement==='pull-up'){
  poses[0]={...shotLoad,rightHand:[405,330],leftHand:[320,285],rightElbow:[366,270],ball:[413,394],leftAnkle:[261,430],rightAnkle:[384,420]};
  poses[1]={...shotLoad,leftAnkle:[274,438],rightAnkle:[343,438]};
 }
 if(movement==='relocate'){
  poses[1]={...shotLoad,leftAnkle:[250,435],rightAnkle:[367,435],leftKnee:[294,364],rightKnee:[349,368],rightHand:[410,332],leftHand:[350,280],ball:[421,400]};
  poses[2]=structuredClone(shotSet);poses[3]={...shotRelease,ball:[465,65]};
 }
 if(camera==='front')return poses.map(p=>({...p,leftShoulder:[p.neck[0]-37,p.leftShoulder[1]],rightShoulder:[p.neck[0]+37,p.rightShoulder[1]],leftHip:[p.leftHip[0]-15,p.leftHip[1]],rightHip:[p.rightHip[0]+15,p.rightHip[1]],leftKnee:[p.leftKnee[0]-36,p.leftKnee[1]],rightKnee:[p.rightKnee[0]+15,p.rightKnee[1]],leftAnkle:[p.leftAnkle[0]-30,p.leftAnkle[1]],rightAnkle:[p.rightAnkle[0]+21,p.rightAnkle[1]]})) as Four<Pose>;
 return poses;
}
export function interpolatePose(a:Pose,b:Pose,t:number,left:boolean):Pose{
 return Object.fromEntries((Object.keys(a) as Joint[]).map(key=>{
  const p:Point=[a[key][0]+(b[key][0]-a[key][0])*t,a[key][1]+(b[key][1]-a[key][1])*t];
  return [key,left?[640-p[0],p[1]]:p];
 })) as Pose;
}
