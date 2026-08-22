/**
 * Skill templates and command templates are two projections of one workflow
 * contract. Every place the two texts differ must be an explicit `pick`, so
 * that divergence is a deliberate, reviewable act rather than something that
 * accumulates silently in two hand-maintained copies.
 */
export type Projection = 'skill' | 'command';

export function pick(projection: Projection, skill: string, command: string): string {
  return projection === 'skill' ? skill : command;
}
