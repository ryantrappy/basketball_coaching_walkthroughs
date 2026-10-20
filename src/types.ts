export type Section = 'offense' | 'defense' | 'inbounds';
export type Point = [number, number];
export type PlayerId = 1 | 2 | 3 | 4 | 5;
export type DefenderId = 6 | 7 | 8 | 9 | 10;
export type EntityId = PlayerId | DefenderId;
export type StepIndex = 0 | 1 | 2 | 3;
export type Four<T> = [T, T, T, T];
export type Three<T> = [T, T, T];
export type PlayerPositions = [Point, Point, Point, Point, Point, Point, Point, Point, Point, Point];

export type OffenseId = 'pick-pop' | 'pick-roll' | 'short-roll' | 'spain' | 'drive-kick' | 'handoff'
 | 'empty-corner' | 'ghost-screen' | 'forty-five-cut' | 'hammer';
export type DefenseId = 'drop-coverage' | 'switch-coverage' | 'blitz-coverage' | 'ice-coverage' | 'tag-xout' | 'closeout-contain';
export type InboundsId = 'box-cross' | 'box-sts' | 'stack-release' | 'inbound-return' | 'sideline-zipper' | 'sideline-slip';
export type ConceptId = OffenseId | DefenseId | InboundsId;
export type SourceId = 'fiba' | 'spain' | 'ghost' | 'terminology' | 'cuts' | 'defense' | 'inbounds' | 'sideline';
export type ConceptGroup = 'Ball screens' | 'Two-player actions' | 'Three-player actions' | 'Off-ball spacing'
 | 'Ball-screen defense' | 'Help & rotations' | 'Baseline (BLOB)' | 'Sideline (SLOB)';

export interface Frame {
 players: PlayerPositions;
 ball: PlayerId;
 pass: [PlayerId, PlayerId] | null;
}
export interface Step { title: string; text: string; cue: string }
export interface InboundSetup { edge: 'baseline' | 'sideline'; player: PlayerId; spot: Point; safety: PlayerId }
interface LessonContent {
 name: string;
 group: ConceptGroup;
 tag: string;
 description: string;
 focus: string;
 frames: Four<Frame>;
 steps: Four<Step>;
 screens?: Partial<Record<StepIndex, PlayerId[]>>;
 reads: [title: string, explanation: string][];
 mistake: string;
 practice: string;
 related: ConceptId[];
 source: SourceId;
}
export type OffenseConcept = LessonContent & { id: OffenseId; side?: 'offense'; inbound?: never };
export type DefenseConcept = LessonContent & { id: DefenseId; side: 'defense'; inbound?: never };
export type InboundsConcept = LessonContent & { id: InboundsId; side: 'inbounds'; inbound: InboundSetup };
export type Concept = OffenseConcept | DefenseConcept | InboundsConcept;
export interface CoachingSource { label: string; url: string }

interface ReadContent {
 title: string;
 condition: string;
 example?: boolean;
 safety?: boolean;
 bend?: number;
 kind?: 'drive';
}
export type PassingOption = ReadContent & { from?: PlayerId } & (
 {to: PlayerId; point?: never} | {point: Point; to?: never}
);
export type DefensiveOption = ReadContent & { from: DefenderId; to: DefenderId; point?: never };
export interface PassingDecision { from: PlayerId; start: StepIndex; context?: string; options: Three<PassingOption> }
export interface DefensiveDecision { from: DefenderId; start: StepIndex; context?: string; options: Three<DefensiveOption> }
