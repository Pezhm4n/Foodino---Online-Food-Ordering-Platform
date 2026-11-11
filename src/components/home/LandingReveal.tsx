"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import { motionTokens, sectionArrival } from "@/styles/motion";

const cardEnter = keyframes`
  from { opacity: 0.86; translate: 0 14px; }
  to { opacity: 1; translate: 0 0; }
`;

const Sections = styled.div`
  @media (prefers-reduced-motion: no-preference) {
    [data-landing-reveal][data-entered] {
      animation: ${sectionArrival} ${motionTokens.duration.slow} ${motionTokens.easing.subtleSpring};
    }
    [data-landing-card][data-card-entered] {
      animation: ${cardEnter} ${motionTokens.duration.slow} ${motionTokens.easing.subtleSpring} var(--landing-delay, 0ms) backwards;
    }
  }

  [data-landing-card] .foodino-dish-hero,
  [data-landing-card] .foodino-dish-hero *,
  [data-landing-card] .dot,
  [data-landing-card] .pulse {
    animation-play-state: paused;
  }

  [data-landing-card][data-card-visible] .foodino-dish-hero,
  [data-landing-card][data-card-visible] .foodino-dish-hero *,
  [data-landing-card][data-card-visible] .dot,
  [data-landing-card][data-card-visible] .pulse {
    animation-play-state: running;
  }
`;

export default function SectionReveal({ children, className }: { children: ReactNode; className?: string }) {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = sectionsRef.current;
    if (!root?.querySelector('[data-action-feedback]')) return;
    let pressed: { element: Element; pointerId: number } | undefined;

    const clear = () => {
      pressed?.element.removeAttribute('data-touch-pressed');
      pressed = undefined;
    };
    const press = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || !event.isPrimary || !(event.target instanceof Element)) return;
      const element = event.target.closest('[data-action-feedback]:not(:disabled)');
      if (!element) return;
      clear();
      pressed = { element, pointerId: event.pointerId };
      element.setAttribute('data-touch-pressed', '');
    };
    const release = (event: PointerEvent) => {
      if (pressed?.pointerId === event.pointerId) clear();
    };

    root.addEventListener('pointerdown', press, { passive: true });
    window.addEventListener('pointerup', release, true);
    window.addEventListener('pointercancel', release, true);
    window.addEventListener('blur', clear);
    return () => {
      root.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release, true);
      window.removeEventListener('pointercancel', release, true);
      window.removeEventListener('blur', clear);
      clear();
    };
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const root = sectionsRef.current;
    if (!root) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = root.querySelectorAll<HTMLElement>("[data-landing-reveal], [data-landing-card]");
    const revealObserver = new IntersectionObserver((entries) => {
      const groupDelays = new Map<Element | null, number>();
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting || motion.matches) continue;
        if (target instanceof HTMLElement && target.hasAttribute("data-landing-card")) {
          const group = target.parentElement;
          const stagger = groupDelays.get(group) ?? 0;
          groupDelays.set(group, stagger + 1);
          target.style.setProperty("--landing-delay", `${Math.min(stagger, 3) * 35}ms`);
          target.setAttribute("data-card-entered", "");
        } else {
          target.setAttribute("data-entered", "");
        }
        revealObserver.unobserve(target);
      }
    }, { rootMargin: "0px 0px -24px", threshold: 0.08 });

    const visibilityObserver = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        target.toggleAttribute("data-card-visible", isIntersecting && !motion.matches);
      }
    });

    const syncMotion = () => {
      revealObserver.disconnect();
      visibilityObserver.disconnect();
      for (const target of targets) {
        if (motion.matches) {
          target.removeAttribute("data-entered");
          target.removeAttribute("data-card-entered");
          target.removeAttribute("data-card-visible");
          target.style.removeProperty("--landing-delay");
        } else {
          if (!target.hasAttribute("data-entered") && !target.hasAttribute("data-card-entered")) revealObserver.observe(target);
          if (target.hasAttribute("data-landing-card")) visibilityObserver.observe(target);
        }
      }
    };
    syncMotion();
    motion.addEventListener("change", syncMotion);
    return () => {
      revealObserver.disconnect();
      visibilityObserver.disconnect();
      motion.removeEventListener("change", syncMotion);
    };
  }, []);

  return <Sections ref={sectionsRef} className={className}>{children}</Sections>;
}
