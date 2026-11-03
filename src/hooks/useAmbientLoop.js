export function ambientLoop(fn, minDelay = 4000, maxDelay = 10000) {
  let timer;
  const loop = () => {
    timer = window.setTimeout(() => {
      if (!document.hidden) {
        fn();
      }
      loop();
    }, minDelay + Math.random() * (maxDelay - minDelay));
  };
  loop();
  return () => clearTimeout(timer);
}

export function jitter(min, max) {
  return (min + Math.random() * (max - min)) * (Math.random() < 0.5 ? 1 : -1);
}
