import Lenis from "@studio-freight/lenis";

export const lenis = new Lenis({
  duration: 1,
  easing: (t) => {
    const c4 = (2 * Math.PI) / 3;

    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 12 - 0.75) * c4) + 1;
  },
  infinite: true,
  // smoothTouch: true,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
