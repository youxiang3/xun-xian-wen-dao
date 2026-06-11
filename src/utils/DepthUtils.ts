export const SceneDepth = {
  Background: 0,
  Ground: 1,
  Effects: 2,
  Hud: 100,
  Overlay: 200,
} as const;

export function actorDepth(y: number): number {
  return Math.round(y);
}
