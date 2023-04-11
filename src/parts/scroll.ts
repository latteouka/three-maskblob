import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { Func } from "../core/func";
import { lenis } from "../utils/smooth-scroll";

const max = 5;
const distance = 1000;
const triggerVelocity = Func.instance.sw() > 600 ? 50 : 20;

const theme = [
  {
    background: "#a0a0a0",
    color: "#f8cfcf",
  },
  {
    background: "#f8cfcf",
    color: "#E30A08",
  },
  {
    background: "#e0e7ff",
    color: "#d56cfe",
  },
  {
    background: "#ecf69a",
    color: "#3BE366",
  },
  {
    background: "#abb1fd",
    color: "#d56cfe",
  },
];

function setupScrollTrigger() {
  let activeIndex = 0;
  let moving = false;
  // const container = document.querySelector(".container")! as HTMLDivElement;
  function getNext() {
    return activeIndex + 1 < max ? activeIndex + 1 : 0;
  }
  function getPre() {
    return activeIndex - 1 >= 0 ? activeIndex - 1 : max - 1;
  }
  // const wraps = document.querySelectorAll(".wrap");
  const images = document.querySelectorAll(
    ".image"
  )! as NodeListOf<HTMLDivElement>;
  const wraps = document.querySelectorAll(
    ".wrap"
  )! as NodeListOf<HTMLDivElement>;

  // Don't want to see other images
  images.forEach((image, index) => {
    if (index === 0) return;
    gsap.set(image, {
      x: -distance,
      y: distance,
    });
  });

  lenis.on("scroll", ({ velocity }: Lenis) => {
    if (velocity < triggerVelocity && velocity > -triggerVelocity) {
      if (moving) return;
      gsap.to(images[activeIndex], {
        x: velocity * 3,
        y: -velocity * 3,
      });
    } else {
      if (moving) return;

      gsap.defaults({ overwrite: true });
      const isNext = velocity > 0;
      // container.style.backgroundColor = theme[getNext()].background;
      document.documentElement.style.setProperty(
        "--backgroundColor",
        theme[isNext ? getNext() : getPre()].background
      );
      document.documentElement.style.setProperty(
        "--fontColor",
        theme[isNext ? getNext() : getPre()].color
      );

      const titleNow = wraps[activeIndex].querySelector(
        ".mainTitle"
      )! as HTMLDivElement;
      const titleNext = wraps[isNext ? getNext() : getPre()].querySelector(
        ".mainTitle"
      )! as HTMLDivElement;

      const subtitleNow = wraps[activeIndex].querySelector(
        ".subtitle"
      )! as HTMLDivElement;
      const subtitleNext = wraps[isNext ? getNext() : getPre()].querySelector(
        ".subtitle"
      )! as HTMLDivElement;

      gsap.set(titleNow, {
        opacity: 0,
      });
      gsap.set(subtitleNow, {
        opacity: 0,
      });

      gsap.to(images[activeIndex], {
        x: isNext ? distance : -distance,
        y: isNext ? -distance : distance,
      });
      gsap.fromTo(
        images[isNext ? getNext() : getPre()],
        {
          x: isNext ? -distance : distance,
          y: isNext ? distance : -distance,
        },
        {
          x: 0,
          y: 0,
          ease: "back",
          onStart: () => {
            moving = true;
            activeIndex = isNext ? getNext() : getPre();
          },
          onComplete: () => {
            moving = false;
          },
        }
      );
      gsap.fromTo(
        titleNext,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          delay: 0.5,
        }
      );
      gsap.fromTo(
        subtitleNext,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          delay: 0.8,
        }
      );
    }
  });
}

setupScrollTrigger();
