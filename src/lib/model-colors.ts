export const MC = {
  haiku: { color: "var(--model-haiku)", bg: "var(--model-haiku-bg)", border: "var(--model-haiku-border)" },
  sonnet: { color: "var(--model-sonnet)", bg: "var(--model-sonnet-bg)", border: "var(--model-sonnet-border)" },
  opus: { color: "var(--model-opus)", bg: "var(--model-opus-bg)", border: "var(--model-opus-border)" },
} as const;

export type ModelColorKey = keyof typeof MC;
