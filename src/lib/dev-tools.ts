/** Alati za lokalni razvoj (simulacija story-ja, kod za prijavu na ekranu). Na produkciji nikad. */
export const devToolsEnabled = () =>
  process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_TOOLS === "true";
