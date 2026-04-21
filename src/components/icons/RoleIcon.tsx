"use client";

import { memo } from "react";

const ROLE_PATHS: Record<string, string> = {
  planner: "M6 4h20v2H6zm0 6h20v2H6zm0 6h14v2H6zm0 6h20v2H6z",
  architect: "M4 4v24h24V4zm22 22H6V6h20zm-4-4v-2h-4V8h-2v12h-4v2z",
  executor: "M10 8v4L2 16l8 4v4l10-6v-4zm2 8l-6 3v-6z",
  reviewer: "M30 28.6L20.4 19a10 10 0 10-1.4 1.4L28.6 30zM5 13a8 8 0 118 8 8 8 0 01-8-8z",
  tester: "M22 28H10a2 2 0 01-2-2V14h16v12a2 2 0 01-2 2zm-12-12v10h12V16zm-4-8h20v2H6zm2-4h16v2H8z",
  designer: "M27.86 9.86l-4.32-4.32a2 2 0 00-2.83 0L4 22.25V28h5.75L25.86 11.86a2 2 0 000-2.83zM9.42 26H6v-3.42L18 10.58 21.42 14zM22.59 12.59L19.41 9.41l2-2 3.18 3.18z",
  writer: "M25.4 9l-6.4-6.4a2 2 0 00-2.83 0L4 14.75V24h9.25l14-14a2 2 0 000-2.83zm-13 13L6 15.41 17.58 3.83 24 10.42z",
  debugger: "M30 6h-2v2a10 10 0 00-20 0v2H6v4h2v2a10 10 0 0010 10v2h-2v4h4v-2a10 10 0 0010-10v-2h2v-4h-2v-2a10 10 0 00-10-10V0z",
};

interface RoleIconProps {
  readonly role: string;
  readonly size?: number;
  readonly color?: string;
}

function RoleIconComponent({ role, size = 16, color = "currentColor" }: RoleIconProps) {
  return (
    <span style={{ display: "inline-flex", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill={color}>
        <path d={ROLE_PATHS[role] ?? ROLE_PATHS.executor} />
      </svg>
    </span>
  );
}

export const RoleIcon = memo(RoleIconComponent);
