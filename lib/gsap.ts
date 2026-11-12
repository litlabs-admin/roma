"use client";

// Single place that registers GSAP plugins (DESIGN.md §I.5). All free since GSAP 3.13.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

let registered = false;
if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
  registered = true;
}

export { gsap, ScrollTrigger };
