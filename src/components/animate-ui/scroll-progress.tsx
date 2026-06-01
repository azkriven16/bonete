import * as React from "react";
import {
  motion,
  useScroll,
  useSpring,
  type MotionValue,
  type HTMLMotionProps,
  type SpringOptions,
} from "motion/react";

// Inline: useMotionValueState
function useMotionValueState(motionValue: MotionValue): number {
  return React.useSyncExternalStore(
    (callback) => motionValue.on("change", callback),
    () => motionValue.get(),
    () => motionValue.get(),
  );
}

// Inline: getStrictContext
function getStrictContext<T>(
  name?: string,
): readonly [
  ({
    value,
    children,
  }: {
    value: T;
    children?: React.ReactNode;
  }) => React.JSX.Element,
  () => T,
] {
  const Context = React.createContext<T | undefined>(undefined);

  const Provider = ({
    value,
    children,
  }: {
    value: T;
    children?: React.ReactNode;
  }) => <Context.Provider value={value}>{children}</Context.Provider>;

  const useSafeContext = () => {
    const ctx = React.useContext(Context);
    if (ctx === undefined) {
      throw new Error(`useContext must be used within ${name ?? "a Provider"}`);
    }
    return ctx;
  };

  return [Provider, useSafeContext] as const;
}

type ScrollProgressDirection = "horizontal" | "vertical";
type ScrollProgressMode = "width" | "height" | "scaleY" | "scaleX";

type ScrollProgressContextType = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
  scale: MotionValue<number>;
  direction: ScrollProgressDirection;
  global: boolean;
};

const [LocalScrollProgressProvider, useScrollProgress] =
  getStrictContext<ScrollProgressContextType>("ScrollProgressContext");

type ScrollProgressProviderProps = {
  children: React.ReactNode;
  global?: boolean;
  transition?: SpringOptions;
  direction?: ScrollProgressDirection;
};

function ScrollProgressProvider({
  global = false,
  transition = { stiffness: 250, damping: 40, bounce: 0 },
  direction = "vertical",
  ...props
}: ScrollProgressProviderProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const { scrollYProgress, scrollXProgress } = useScroll(
    global ? undefined : { container: containerRef },
  );

  const progress = direction === "vertical" ? scrollYProgress : scrollXProgress;
  const scale = useSpring(progress, transition);

  return (
    <LocalScrollProgressProvider
      value={{ containerRef, progress, scale, direction, global }}
      {...props}
    />
  );
}

type ScrollProgressProps = HTMLMotionProps<"div"> & {
  mode?: ScrollProgressMode;
};

function ScrollProgress({
  style,
  mode = "width",
  ...props
}: ScrollProgressProps) {
  const { scale, direction, global } = useScrollProgress();
  const scaleValue = useMotionValueState(scale);

  return (
    <motion.div
      data-slot="scroll-progress"
      data-direction={direction}
      data-mode={mode}
      data-global={global}
      style={{
        ...(mode === "width" || mode === "height"
          ? { [mode]: scaleValue * 100 + "%" }
          : { [mode]: scale }),
        ...style,
      }}
      {...props}
    />
  );
}

type ScrollProgressContainerProps = HTMLMotionProps<"div"> & {
  ref?: React.Ref<HTMLDivElement>;
};

function ScrollProgressContainer({
  ref,
  ...props
}: ScrollProgressContainerProps) {
  const { containerRef, direction, global } = useScrollProgress();

  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  return (
    <motion.div
      ref={containerRef}
      data-slot="scroll-progress-container"
      data-direction={direction}
      data-global={global}
      {...props}
    />
  );
}

export {
  ScrollProgressProvider,
  ScrollProgress,
  ScrollProgressContainer,
  useScrollProgress,
  type ScrollProgressProviderProps,
  type ScrollProgressProps,
  type ScrollProgressContainerProps,
  type ScrollProgressDirection,
  type ScrollProgressMode,
  type ScrollProgressContextType,
};
