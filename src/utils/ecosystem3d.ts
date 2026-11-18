import { SAAS_VENTURES } from '../data/portfolio';

export interface EcosystemNodeSpec {
  id: string;
  index: string;
  name: string;
  categoryLabel: string;
  url: string;
  domainLabel: string;
  accentHex: number;
  basePosition: [number, number, number];
  explodeOffset: [number, number, number];
  cameraOffset: [number, number, number];
  shapeKind: 'dispatch' | 'agent' | 'sync' | 'shield' | 'warranty' | 'calendar';
}

const ACCENT_BY_ID: Record<string, { hex: number; shapeKind: EcosystemNodeSpec['shapeKind'] }> = {
  tidyflow: { hex: 0x7c3aed, shapeKind: 'dispatch' },
  tidyagent: { hex: 0xa855f7, shapeKind: 'agent' },
  tidysync: { hex: 0x10b981, shapeKind: 'sync' },
  stocksentry: { hex: 0xf59e0b, shapeKind: 'shield' },
  aftersale: { hex: 0x6366f1, shapeKind: 'warranty' },
  slotwise: { hex: 0xec4899, shapeKind: 'calendar' },
};

const ORBIT_RADIUS = 3.25;

export const ECOSYSTEM_NODES: EcosystemNodeSpec[] = SAAS_VENTURES.map((venture, idx) => {
  const angle = (idx / SAAS_VENTURES.length) * Math.PI * 2 - Math.PI * 0.35;
  const x = Number((Math.cos(angle) * ORBIT_RADIUS).toFixed(4));
  const z = Number((Math.sin(angle) * ORBIT_RADIUS).toFixed(4));
  const y = idx % 2 === 0 ? 0.55 : 0.78;
  const style = ACCENT_BY_ID[venture.id] ?? { hex: 0x7c3aed, shapeKind: 'dispatch' };

  return {
    id: venture.id,
    index: venture.index,
    name: venture.name,
    categoryLabel: venture.categoryLabel,
    url: venture.url,
    domainLabel: venture.url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    accentHex: style.hex,
    basePosition: [x, y, z],
    explodeOffset: [Number((x * 0.28).toFixed(4)), 0.75, Number((z * 0.28).toFixed(4))],
    cameraOffset: [
      Number((x * 1.85 + Math.cos(angle + 0.45) * 1.4).toFixed(4)),
      2.35,
      Number((z * 1.85 + Math.sin(angle + 0.45) * 1.4).toFixed(4)),
    ],
    shapeKind: style.shapeKind,
  };
});

export function computeExplodedPosition(
  basePosition: readonly [number, number, number],
  explodeOffset: readonly [number, number, number],
  explodeFactor: number
): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, explodeFactor));
  return [
    basePosition[0] + explodeOffset[0] * clamped,
    basePosition[1] + explodeOffset[1] * clamped,
    basePosition[2] + explodeOffset[2] * clamped,
  ];
}

export function getVentureCameraPose(nodeId: string | null): {
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
  node: EcosystemNodeSpec | null;
} {
  if (!nodeId) {
    return {
      cameraPos: [5.2, 4.85, 6.55],
      targetPos: [0, 0.25, 0],
      node: null,
    };
  }
  const node = ECOSYSTEM_NODES.find((item) => item.id === nodeId) ?? null;
  if (!node) {
    return {
      cameraPos: [5.2, 4.85, 6.55],
      targetPos: [0, 0.25, 0],
      node: null,
    };
  }
  return {
    cameraPos: node.cameraOffset,
    targetPos: [node.basePosition[0] * 0.65, node.basePosition[1] + 0.25, node.basePosition[2] * 0.65],
    node,
  };
}
