import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { lenis } from "../utils/smooth-scroll";

const max = 5;
const distance = 1000;
const triggerVelocity = 50;

gsap.defaults({ overwrite: true });

const theme = [
  {
    background: "#fff",
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
    color: "#9d8aff",
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
        ".title"
      )! as HTMLDivElement;
      const titleNext = wraps[isNext ? getNext() : getPre()].querySelector(
        ".title"
      )! as HTMLDivElement;

      gsap.set(titleNow, {
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
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          delay: 0.5,
        }
      );
    }
  });
}

setupScrollTrigger();
