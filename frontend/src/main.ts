import { defineCustomElements } from "../generated/index.js";
import { opticsStage } from "./stage";
import { motionToggle } from "./client";
const scene = opticsStage(
  document.querySelector("#glass")!,
  document.querySelector("#beams")!,
);
window.addEventListener("caustica:result", (e) =>
  scene.set((e as CustomEvent).detail),
);
defineCustomElements();
document
  .querySelector("#console-root")!
  .replaceChildren(document.createElement("caustica-console"));
motionToggle((v) => scene.pause(v));
const observer = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("revealed");
    }),
  { threshold: 0.15 },
);
document.querySelectorAll("[data-reveal]").forEach((e) => observer.observe(e));
window.addEventListener(
  "scroll",
  () => {
    document.documentElement.style.setProperty(
      "--scroll",
      String(Math.min(1, scrollY / innerHeight)),
    );
  },
  { passive: true },
);
if (new URL(location.href).searchParams.has("record"))
  document.querySelector("#studio")?.scrollIntoView();
