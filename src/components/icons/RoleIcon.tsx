"use client";

import { memo, type ReactElement } from "react";

const icons: Record<string, (size: number, color: string) => ReactElement> = {
  planner: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 2L3 7v6l7 5 7-5V7l-7-5z" stroke={c} strokeWidth="1.5" fill="none"/>
      <circle cx="10" cy="10" r="2" fill={c}/>
    </svg>
  ),
  architect: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke={c} strokeWidth="1.5" fill="none"/>
      <path d="M3 8h14M8 8v9" stroke={c} strokeWidth="1.5"/>
    </svg>
  ),
  executor: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="12" rx="2" stroke={c} strokeWidth="1.5" fill="none"/>
      <path d="M7 9l2 2 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  reviewer: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="5" stroke={c} strokeWidth="1.5" fill="none"/>
      <path d="M13 13l4 4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  tester: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M7 3v4l-3 6a2 2 0 002 2h8a2 2 0 002-2l-3-6V3" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M6 3h8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  designer: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M4 16l1.4-3.2L14 4.2a1.4 1.4 0 012 0l.8.8a1.4 1.4 0 010 2L8.2 15.6 4 16z" stroke={c} strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  writer: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M4 4h12M4 8h10M4 12h8M4 16h6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  debugger: (s, c) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="11" r="5" stroke={c} strokeWidth="1.5" fill="none"/>
      <path d="M10 6V3M5.5 7.5L3 5.5M14.5 7.5L17 5.5M5 11H2M15 11h3M5.5 14.5L3 16.5M14.5 14.5L17 16.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

interface RoleIconProps {
  role: string;
  size?: number;
  color?: string;
}

function RoleIconComponent({ role, size = 18, color = "currentColor" }: RoleIconProps) {
  const render = icons[role] ?? icons.executor;
  return render(size, color);
}

export const RoleIcon = memo(RoleIconComponent);
