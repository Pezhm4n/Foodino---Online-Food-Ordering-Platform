"use client";

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { resolveValue, toast, useToaster, type Toast } from "react-hot-toast";
import styled from "styled-components";
import { AlertCircleIcon, CheckCircleIcon, CloseIcon, InfoIcon } from "@/components/ui/FoodVisuals";

const Viewport = styled.div`
  position: fixed;
  inset-inline: 0;
  inset-block-start: calc(max(var(--toast-anchor-bottom, 0px), env(safe-area-inset-top, 0px)) + 0.5rem);
  display: grid;
  justify-items: center;
  padding-inline: 1rem;
  overflow-x: clip;
  z-index: 310;
  pointer-events: none;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    justify-items: start;
    padding-inline: 1.5rem;
  }
`;

const LiveMessage = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  max-width: min(100%, 24rem);
  padding: 0.125rem 0.625rem 0.125rem 0.25rem;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: white;
  color: ${props => props.theme.colors.neutral[900]};
  box-shadow: ${props => props.theme.shadows.md};
  pointer-events: auto;
  touch-action: pan-y;
`;

const Message = styled.span`
  min-width: 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.45;
  overflow-wrap: anywhere;
`;

const StatusIcon = styled.span<{ $type: Toast["type"] }>`
  display: inline-flex;
  flex: none;
  color: ${({ $type, theme }) =>
    $type === "success" ? theme.colors.success[700]
      : $type === "error" ? theme.colors.error[600]
        : theme.colors.neutral[600]};
`;

const CloseButton = styled.button`
  display: grid;
  place-items: center;
  flex: none;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: ${props => props.theme.borderRadius.md};
  background: transparent;
  color: ${props => props.theme.colors.neutral[700]};
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background: ${props => props.theme.colors.neutral[100]};
    }
  }
`;

function ToastNotice({ entry, onClose }: { entry: Toast; onClose: () => void }) {
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);
  const Icon = entry.type === "success" ? CheckCircleIcon : entry.type === "error" ? AlertCircleIcon : InfoIcon;

  function startSwipe(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest("button")) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function swipeDistance(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return 0;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    return Math.abs(x) > Math.abs(y) ? x : 0;
  }

  function resetSwipe() {
    gesture.current = null;
    setOffset(0);
  }

  function closeFromKeyboard() {
    returnFocus.current?.focus({ preventScroll: true });
    onClose();
  }

  return (
    <Notice
      role="group"
      aria-label="پیام موقت"
      dir="rtl"
      style={offset ? { transform: `translateX(${offset}px)` } : undefined}
      onPointerDown={startSwipe}
      onPointerMove={event => {
        if (gesture.current) setOffset(swipeDistance(event));
      }}
      onPointerUp={event => {
        const distance = swipeDistance(event);
        resetSwipe();
        // Let the browser finish dispatching touchend before removing its target.
        if (Math.abs(distance) >= 48) requestAnimationFrame(onClose);
      }}
      onPointerCancel={resetSwipe}
      onLostPointerCapture={resetSwipe}
    >
      <StatusIcon $type={entry.type} aria-hidden="true"><Icon size={18} /></StatusIcon>
      <Message aria-hidden="true">{resolveValue(entry.message, entry)}</Message>
      <CloseButton
        type="button"
        aria-label="بستن پیام موقت"
        onFocus={event => {
          returnFocus.current = event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null;
        }}
        onClick={event => {
          if (event.detail === 0) closeFromKeyboard();
          else onClose();
        }}
        onKeyDown={event => {
          if (event.key === "Escape" && !event.nativeEvent.isComposing) {
            event.preventDefault();
            closeFromKeyboard();
          }
        }}
      >
        <CloseIcon size={16} />
      </CloseButton>
    </Notice>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, handlers } = useToaster({
    duration: 2500,
    error: { duration: 4000 },
  });
  const active = toasts.find(entry => entry.visible);
  const activeId = active?.id;
  const hasNotice = !!active;
  const viewport = useRef<HTMLDivElement>(null);
  const pausedNotice = useRef<string | undefined>(undefined);
  const { endPause, startPause } = handlers;

  useLayoutEffect(() => {
    const layer = viewport.current;
    const anchor = document.querySelector("[data-toast-anchor]");
    if (!hasNotice || !layer || !anchor) return;

    const position = () => {
      const value = `${anchor.getBoundingClientRect().bottom}px`;
      if (layer.style.getPropertyValue("--toast-anchor-bottom") !== value) {
        layer.style.setProperty("--toast-anchor-bottom", value);
      }
    };
    const observer = new ResizeObserver(position);
    observer.observe(anchor);
    observer.observe(document.body);
    window.addEventListener("scroll", position, { passive: true });
    position();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", position);
    };
  }, [hasNotice]);

  useEffect(() => {
    if (!active) return;
    for (const entry of toasts) {
      if (entry.id !== active.id && entry.visible) toast.remove(entry.id);
    }
  }, [active, toasts]);

  useEffect(() => {
    if (pausedNotice.current && pausedNotice.current !== activeId) {
      pausedNotice.current = undefined;
      endPause();
    }
  }, [activeId, endPause]);

  useEffect(() => {
    if (!activeId) return;
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented && !event.isComposing) {
        toast.remove(activeId);
      }
    };
    window.addEventListener("keydown", dismissOnEscape);
    return () => window.removeEventListener("keydown", dismissOnEscape);
  }, [activeId]);

  return (
    <>
      <LiveMessage role="status" aria-live="polite" aria-atomic="true">
        {active && resolveValue(active.message, active)}
      </LiveMessage>
      <Viewport
        ref={viewport}
        onFocus={() => {
          pausedNotice.current = activeId;
          startPause();
        }}
        onBlur={() => {
          pausedNotice.current = undefined;
          endPause();
        }}
      >
        {active && <ToastNotice key={active.id} entry={active} onClose={() => toast.remove(active.id)} />}
      </Viewport>
      {children}
    </>
  );
}
