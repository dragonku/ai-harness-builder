export const MODEL_META = {
  haiku: { label: "Haiku", tagBg: "var(--cds-green-20)", tagFg: "var(--cds-green-70)", dotColor: "var(--cds-green-50)" },
  sonnet: { label: "Sonnet", tagBg: "var(--cds-blue-20)", tagFg: "var(--cds-blue-80)", dotColor: "var(--cds-blue-60)" },
  opus: { label: "Opus", tagBg: "var(--cds-purple-30)", tagFg: "var(--cds-purple-70)", dotColor: "var(--cds-purple-60)" },
} as const;

export type ModelColorKey = keyof typeof MODEL_META;
