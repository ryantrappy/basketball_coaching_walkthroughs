import type { EntityId, Four, Frame, PlayerId, PlayerPositions, Point, Step } from './types';
// Players 1–5, then the defenders who started matched to them (x1–x5).
// Defensive numbers remain identities after a switch.
const base: PlayerPositions = [[255,355],[550,130],[50,130],[470,295],[355,285],[258,326],[523,140],[77,140],[445,276],[340,250]];
export const frame = (changes: Partial<Record<EntityId, Point>> = {}, ball: EntityId = 1, pass: [PlayerId, PlayerId] | null = null): Frame => ({
 players: base.map((p,i) => changes[(i+1) as EntityId] || p) as PlayerPositions, ball, pass,
});
export const steps = (items: Four<[string, string, string]>): Four<Step> => items.map(([title,text,cue]) => ({title,text,cue})) as Four<Step>;
