import React from 'react';

type Variant = 'zigzag' | 'bigwave' | 'scallops' | 'peaks';

interface SectionDividerProps {
  variant?: Variant;
  fill?: string;
  flip?: boolean;
}

const HEIGHT: Record<Variant, number> = {
  zigzag: 100,
  bigwave: 120,
  scallops: 80,
  peaks: 90,
};

function getPath(variant: Variant, h: number, mobile = false): string {
  switch (variant) {
    case 'zigzag': {
      const count = mobile ? 5 : 12;
      const step = 1440 / count;
      let d = `M0,${h}`;
      for (let i = 0; i < count; i++) {
        const x = i * step;
        d += ` L${x + step / 2},0 L${x + step},${h}`;
      }
      return d + ' Z';
    }
    case 'bigwave':
      if (mobile) {
        return `M0,${h / 2} C480,0 960,${h} 1440,${h / 2} L1440,${h} L0,${h} Z`;
      }
      return (
        `M0,${h / 2} ` +
        `C240,0 480,${h} 720,${h / 2} ` +
        `C960,0 1200,${h} 1440,${h / 2} ` +
        `L1440,${h} L0,${h} Z`
      );
    case 'scallops': {
      const count = mobile ? 8 : 12;
      const step = 1440 / count;
      const cpY = mobile ? -h : 6;
      let d = `M0,${h}`;
      for (let i = 0; i < count; i++) {
        const x = i * step;
        d += ` Q${x + step / 2},${cpY} ${x + step},${h}`;
      }
      return d + ' Z';
    }
    case 'peaks':
      if (mobile) {
        return (
          `M0,${h} ` +
          `C180,${h} 360,0 540,0 ` +
          `C720,0 900,${h} 1080,${h} ` +
          `C1260,${h} 1440,0 1440,${h} Z`
        );
      }
      return (
        `M0,${h} ` +
        `C80,${h} 160,0 240,0 ` +
        `C320,0 400,${h} 480,${h} ` +
        `C560,${h} 640,0 720,0 ` +
        `C800,0 880,${h} 960,${h} ` +
        `C1040,${h} 1120,0 1200,0 ` +
        `C1280,0 1360,${h} 1440,${h} Z`
      );
  }
}

export default function SectionDivider({
  variant = 'bigwave',
  fill = 'var(--color-white)',
  flip = false,
}: SectionDividerProps) {
  const h = HEIGHT[variant];

  const svgStyle: React.CSSProperties = {
    display: 'block',
    transform: flip ? 'scaleX(-1)' : undefined,
  };

  return (
    <div
     className="block md:block"
      style={{
        marginTop: `calc(-${((h / 1440) * 100).toFixed(4)}vw + 1px)`,
        lineHeight: 0,
        position: 'relative',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      <div>
        <svg viewBox={`0 0 1440 ${h}`} width="100%" height="auto" style={svgStyle}>
          <path d={getPath(variant, h, false)} style={{ fill }} />
        </svg>
      </div>
    </div>
  );
}
