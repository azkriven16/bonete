import {
  ScrollProgressProvider,
  ScrollProgress,
} from "./animate-ui/scroll-progress";

export default function ZigzagScrollProgress() {
  return (
    <ScrollProgressProvider global>
      <div className="fixed top-0 left-0 right-0 z-60 pointer-events-none">
        <ScrollProgress className="h-1 bg-zinc-800 dark:bg-zinc-200" />
      </div>
    </ScrollProgressProvider>
  );
}
