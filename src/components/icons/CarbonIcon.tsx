"use client";

import { memo, type CSSProperties } from "react";

const PATHS: Record<string, string> = {
  menu: "M4 6h24v2H4zm0 9h24v2H4zm0 9h24v2H4z",
  close: "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16z",
  notification: "M28.7 20.3L26 17.6V13a10 10 0 00-20 0v4.6l-2.7 2.7A1 1 0 004 22h7a5 5 0 0010 0h7a1 1 0 00.7-1.7zM16 25a3 3 0 01-3-3h6a3 3 0 01-3 3z",
  user: "M16 4a12 12 0 1012 12A12 12 0 0016 4zm0 2a10 10 0 017.4 3.3A8.9 8.9 0 0016 8a8.9 8.9 0 00-7.4 1.3A10 10 0 0116 6zM8.4 25.2A7 7 0 0116 20a7 7 0 017.6 5.2 10 10 0 01-15.2 0zM16 18a4 4 0 114-4 4 4 0 01-4 4z",
  add: "M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z",
  chevronDown: "M16 22L6 12l1.4-1.4L16 19.2l8.6-8.6L26 12z",
  chevronRight: "M12 8L22 18l-1.4 1.4L12 10.8 3.4 19.4 2 18z",
  trash: "M12 12h2v12h-2zm6 0h2v12h-2z M4 6v2h2v20a2 2 0 002 2h16a2 2 0 002-2V8h2V6zm4 22V8h16v20zM12 2h8v2h-8z",
  download: "M26 24v4H6v-4H4v4a2 2 0 002 2h20a2 2 0 002-2v-4zm0-10l-1.4-1.4L17 20.2V2h-2v18.2l-7.6-7.6L6 14l10 10z",
  upload: "M6 18l1.4 1.4L15 11.8V30h2V11.8l7.6 7.6L26 18 16 8zM6 8V4h20v4h2V4a2 2 0 00-2-2H6a2 2 0 00-2 2v4z",
  share: "M23 20a4.95 4.95 0 00-3.7 1.7l-7.3-4.2a5.5 5.5 0 000-3L19.3 10.3A5 5 0 1018 8a5 5 0 00.1 1l-7.4 4.3a5 5 0 100 5.5l7.4 4.3A5 5 0 1023 20zm0-16a3 3 0 11-3 3 3 3 0 013-3zM7 19a3 3 0 113-3 3 3 0 01-3 3zm16 9a3 3 0 113-3 3 3 0 01-3 3z",
  dragVertical: "M10 6h3v3h-3zm9 0h3v3h-3zm-9 7h3v3h-3zm9 0h3v3h-3zm-9 7h3v3h-3zm9 0h3v3h-3z",
  file: "M25.7 9.3l-7-7a1 1 0 00-.7-.3H8a2 2 0 00-2 2v24a2 2 0 002 2h16a2 2 0 002-2V10a1 1 0 00-.3-.7zM18 4.4l5.6 5.6H18zM24 28H8V4h8v7a1 1 0 001 1h7z",
  code: "M31 16L24 23 22.6 21.6 28.2 16 22.6 10.4 24 9zm-30 0l7-7 1.4 1.4L3.8 16l5.6 5.6L8 23z",
  package: "M26 4H6a2 2 0 00-2 2v4a2 2 0 002 2v14a2 2 0 002 2h16a2 2 0 002-2V12a2 2 0 002-2V6a2 2 0 00-2-2zM6 6h20v4H6zm18 20H8V12h16zm-4-10h-8v-2h8z",
  workflow: "M10 2v4H4v4h6v4H4v4h6v4H4v4h12v-4h-2v-4h12v-4H14v-4h12V6H14V2zm4 24H6v-2h8zm12-8v2h-8v-2zM14 8h12v2H14z",
  maximize: "M4 18h2v8h8v2H4zm22-14h2v10h-2zm-4 0v2h-8V4zM26 28h-8v-2h8v-8h2v8a2 2 0 01-2 2z",
  zoomIn: "M30 28.6L20.4 19a10 10 0 10-1.4 1.4L28.6 30zM5 13a8 8 0 118 8 8 8 0 01-8-8zm9 1v4h-2v-4H8v-2h4V8h2v4h4v2z",
  zoomOut: "M30 28.6L20.4 19a10 10 0 10-1.4 1.4L28.6 30zM5 13a8 8 0 118 8 8 8 0 01-8-8zm3-1h10v2H8z",
  template: "M28 4H4a2 2 0 00-2 2v20a2 2 0 002 2h24a2 2 0 002-2V6a2 2 0 00-2-2zM4 6h24v6H4zm0 20v-12h10v12zm12 0v-12h12v12z",
  asleep: "M13.5 29a13.5 13.5 0 0113.5-13.5A13.5 13.5 0 0013.5 2 13.5 13.5 0 000 15.5 13.5 13.5 0 0013.5 29zM2 15.5A11.5 11.5 0 0112.1 4.1a13.5 13.5 0 000 22.8A11.5 11.5 0 012 15.5z",
  light: "M16 12a4 4 0 11-4 4 4 4 0 014-4m0-2a6 6 0 106 6 6 6 0 00-6-6zM14 1h4v6h-4zm0 24h4v6h-4zM3.5 4.9l2.8-2.8L10.6 6.4 7.8 9.2zM21.4 22.8l2.8-2.8 4.2 4.2-2.8 2.8zM1 14h6v4H1zm24 0h6v4h-6zM3.5 27l4.2-4.2 2.8 2.8L6.3 29.9zM21.4 9.2L25.6 5l2.8 2.8-4.2 4.2z",
  eye: "M16 6C6 6 2 16 2 16s4 10 14 10 14-10 14-10S26 6 16 6zm0 18a8 8 0 118-8 8 8 0 01-8 8zm0-12a4 4 0 104 4 4 4 0 00-4-4z",
  warning: "M16 2L1 29h30zm0 5l11.5 20h-23zM15 12h2v8h-2zm0 10h2v2h-2z",
  checkmark: "M13 24L4 15l1.4-1.4L13 21.2 26.6 7.6 28 9z",
};

export type CarbonIconName = keyof typeof PATHS;

interface CarbonIconProps {
  readonly name: CarbonIconName;
  readonly size?: number;
  readonly color?: string;
  readonly style?: CSSProperties;
}

function CarbonIconComponent({ name, size = 16, color = "currentColor", style }: CarbonIconProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" fill={color}>
        <path d={PATHS[name] ?? ""} />
      </svg>
    </span>
  );
}

export const CarbonIcon = memo(CarbonIconComponent);
