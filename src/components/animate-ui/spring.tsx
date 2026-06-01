import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  motion,
  useMotionValue,
  useSpring as useMotionSpring,
  type SpringOptions,
  type HTMLMotionProps,
  type MotionValue,
} from "motion/react";

function getStrictContext<T>(name?: string): readonly [
  ({ value, children }: { value: T; children?: React.ReactNode }) => React.JSX.Element,
  () => T,
] {
  const Context = React.createContext<T | undefined>(undefined);

  const Provider = ({ value, children }: { value: T; children?: React.ReactNode }) => (
    <Context.Provider value={value}>{children}</Context.Provider>
  );

  const useSafeContext = () => {
    const ctx = React.useContext(Context);
    if (ctx === undefined) {
      throw new Error(`useContext must be used within ${name ?? "a Provider"}`);
    }
    return ctx;
  };

  return [Provider, useSafeContext] as const;
}

type SpringPathConfig = {
  coilCount?: number;
  amplitudeMin?: number;
  amplitudeMax?: number;
  curveRatioMin?: number;
  curveRatioMax?: number;
  bezierOffset?: number;
};

function generateSpringPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  pathConfig: SpringPathConfig = {},
) {
  const {
    coilCount = 8,
    amplitudeMin = 8,
    amplitudeMax = 20,
    curveRatioMin = 0.5,
    curveRatioMax = 1,
    bezierOffset = 8,
  } = pathConfig;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 2) return `M${x1},${y1}`;
  const d = dist / coilCount;
  const h = Math.max(0.8, 1 - (dist - 40) / 200);
  const amplitude = Math.max(amplitudeMin, Math.min(amplitudeMax, amplitudeMax * h));
  const curveRatio =
    dist <= 40
      ? curveRatioMax
      : dist <= 120
        ? curveRatioMax - ((dist - 40) / 80) * (curveRatioMax - curveRatioMin)
        : curveRatioMin;
  const ux = dx / dist, uy = dy / dist;
  const perpX = -uy, perpY = ux;

  const path: string[] = [];
  for (let i = 0; i < coilCount; i++) {
    const sx = x1 + ux * (i * d);
    const sy = y1 + uy * (i * d);
    const ex = x1 + ux * ((i + 1) * d);
    const ey = y1 + uy * ((i + 1) * d);
    const mx = x1 + ux * ((i + 0.5) * d) + perpX * amplitude;
    const my = y1 + uy * ((i + 0.5) * d) + perpY * amplitude;
    const c1x = sx + d * curveRatio * ux;
    const c1y = sy + d * curveRatio * uy;
    const c2x = mx + ux * bezierOffset;
    const c2y = my + uy * bezierOffset;
    const c3x = mx - ux * bezierOffset;
    const c3y = my - uy * bezierOffset;
    const c4x = ex - d * curveRatio * ux;
    const c4y = ey - d * curveRatio * uy;

    if (i === 0) path.push(`M${sx},${sy}`);
    else path.push(`L${sx},${sy}`);
    path.push(`C${c1x},${c1y} ${c2x},${c2y} ${mx},${my}`);
    path.push(`C${c3x},${c3y} ${c4x},${c4y} ${ex},${ey}`);
  }
  return path.join(" ");
}

type SpringContextType = {
  dragElastic?: number;
  childRef: React.RefObject<HTMLDivElement | null>;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  center: { x: number; y: number };
  pathConfig: SpringPathConfig;
};

const [LocalSpringProvider, useSpring] =
  getStrictContext<SpringContextType>("SpringContext");

type SpringProviderProps = {
  children: React.ReactNode;
  dragElastic?: number;
  pathConfig?: SpringPathConfig;
  transition?: SpringOptions;
};

function SpringProvider({
  dragElastic = 0.2,
  transition = { stiffness: 200, damping: 16 },
  pathConfig = {},
  ...props
}: SpringProviderProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useMotionSpring(x, transition);
  const springY = useMotionSpring(y, transition);

  const childRef = React.useRef<HTMLDivElement>(null);
  const [center, setCenter] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);

  React.useLayoutEffect(() => {
    function update() {
      if (childRef.current) {
        const rect = childRef.current.getBoundingClientRect();
        setCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    }
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, []);

  React.useEffect(() => {
    document.body.style.cursor = isDragging ? "grabbing" : "default";
  }, [isDragging]);

  return (
    <LocalSpringProvider
      value={{ springX, springY, x, y, isDragging, setIsDragging, dragElastic, childRef, center, pathConfig }}
      {...props}
    />
  );
}

type SpringProps = React.SVGProps<SVGSVGElement>;

function Spring({ style, className, ...props }: SpringProps) {
  const { springX, springY, center, pathConfig } = useSpring();
  const pathRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    const update = () => {
      if (!pathRef.current) return;
      const d = generateSpringPath(
        center.x,
        center.y,
        center.x + springX.get(),
        center.y + springY.get(),
        pathConfig,
      );
      pathRef.current.setAttribute("d", d);
    };
    const unsubX = springX.on("change", update);
    const unsubY = springY.on("change", update);
    return () => { unsubX(); unsubY(); };
  }, [center, pathConfig, springX, springY]);

  return ReactDOM.createPortal(
    <svg
      width="100vw"
      height="100vh"
      className={className}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, ...style }}
      {...props}
    >
      <path
        ref={pathRef}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />
    </svg>,
    document.body,
  );
}

type SpringElementProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: React.ReactElement;
};

function SpringElement({ style, ...props }: SpringElementProps) {
  const { childRef, dragElastic, isDragging, setIsDragging, springX, springY, x, y } =
    useSpring();

  return (
    <motion.div
      ref={childRef}
      style={{ cursor: isDragging ? "grabbing" : "grab", x: springX, y: springY, ...style }}
      drag
      dragElastic={dragElastic}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDrag={(_, info) => { x.set(info.offset.x); y.set(info.offset.y); }}
      onDragEnd={() => { x.set(0); y.set(0); setIsDragging(false); }}
      {...props}
    />
  );
}

export {
  SpringProvider,
  Spring,
  SpringElement,
  useSpring,
  type SpringProviderProps,
  type SpringProps,
  type SpringElementProps,
  type SpringPathConfig,
  type SpringContextType,
};
