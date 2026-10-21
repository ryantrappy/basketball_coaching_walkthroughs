import type { ConceptId, Four, Point } from './types';

export type DrillSkill = 'Dribbling' | 'Shooting';
export type DrillGoal = 'Ball control' | 'Change direction' | 'Change pace' | 'Shooting touch' | 'Catch & shoot' | 'Pull-up shooting';
export type Movement = 'pound' | 'pocket' | 'cross' | 'between' | 'hesitation' | 'retreat' | 'touch' | 'guide' | 'one-two' | 'hop' | 'pull-up' | 'relocate';
export type BodyFocus = 'all' | 'base' | 'hands';
export type Joint = 'head' | 'neck' | 'leftShoulder' | 'rightShoulder' | 'leftElbow' | 'rightElbow' | 'leftHand' | 'rightHand' | 'leftHip' | 'rightHip' | 'leftKnee' | 'rightKnee' | 'leftAnkle' | 'rightAnkle' | 'ball';
export type Pose = Record<Joint, Point>;
export interface DrillPhase {
 title: string;
 action: string;
 base: string;
 hands: string;
 upper: string;
 labels: [string,string,string,string];
}
export interface Drill {
 id: Movement;
 name: string;
 skill: DrillSkill;
 goal: DrillGoal;
 outcome: string;
 equipment: string;
 dosage: string;
 setup: string;
 phases: Four<DrillPhase>;
 check: string;
 fault: string;
 progress: string;
 transfer: string;
 related: ConceptId[];
 source: {label: string; url: string};
 route: Point[];
 cones: Point[];
}
