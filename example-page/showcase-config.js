/* ============================================================
   Design showcase — style registry + early state bootstrap
   Loaded synchronously in <head> so the chosen theme is applied
   before first paint (no flash of the default style).
   ============================================================ */
(() => {
  "use strict";

  const STYLES = {
    "neon-hud": {
      id: "neon-hud",
      name: "neon-hud",
      tagline: "Sci-fi tactical HUD",
      description:
        "Deep space-blue neutrals, one cyan chrome, clipped 45° corners, scanline texture and reticle ornaments. Dark-first, with a light variant and three ornament modes.",
      modes: ["dark", "light"],
      defaultMode: "dark",
      choice: null,
      ornaments: ["css", "art", "minimal"],
      defaultOrn: "css",
      extras: "3 ornament modes",
      preview: "../styles/neon-hud/preview.png",
      design: "../styles/neon-hud/DESIGN.md",
      demo: "../styles/neon-hud/demo.html",
      theme: "../styles/neon-hud/theme.css",
    },
    "construct-poster": {
      id: "construct-poster",
      name: "construct-poster",
      tagline: "Flat constructivist poster",
      description:
        "Warm paper neutrals, heavy black borders, sharp unblurred offset shadows, constructivist decoration and display type. Light only, with orange and violet accents.",
      modes: ["light"],
      defaultMode: "light",
      choice: {
        attr: "accent",
        label: "Accent",
        default: "orange",
        options: [
          { id: "orange", label: "Orange", hex: "#e8600a" },
          { id: "violet", label: "Violet", hex: "#8578a8" },
        ],
      },
      ornaments: null,
      extras: "2 accents",
      preview: "../styles/construct-poster/preview.png",
      design: "../styles/construct-poster/DESIGN.md",
      demo: "../styles/construct-poster/demo.html",
      theme: "../styles/construct-poster/theme.css",
    },
    "moderncraft-hud": {
      id: "moderncraft-hud",
      name: "moderncraft-hud",
      tagline: "Industrial metallic HUD",
      description:
        "A graphite ground, near-black cards, one accent held in reserve, a 45° accent hatch and tabular numbers. Six accent presets, dark and light.",
      modes: ["dark", "light"],
      defaultMode: "dark",
      choice: {
        attr: "accent",
        label: "Accent",
        default: "horde",
        options: [
          { id: "terran", label: "Terran cyan", hex: "#6fe3f2" },
          { id: "horde", label: "Horde lime", hex: "#b6f34a" },
          { id: "zerg", label: "Zerg purple", hex: "#c084fc" },
          { id: "protoss", label: "Protoss gold", hex: "#f0cf78" },
          { id: "night-elf", label: "Night elf emerald", hex: "#7ef0bd" },
          { id: "human", label: "Human blue", hex: "#9db9ff" },
        ],
      },
      ornaments: null,
      extras: "6 accents",
      preview: "../styles/moderncraft-hud/preview.png",
      design: "../styles/moderncraft-hud/DESIGN.md",
      demo: "../styles/moderncraft-hud/demo.html",
      theme: "../styles/moderncraft-hud/theme.css",
    },
    "mechcraft-hud": {
      id: "mechcraft-hud",
      name: "mechcraft-hud",
      tagline: "Command-console HUD",
      description:
        "Layered metal, recessed black screens, an amber/cyan command accent and a cold cyan secondary. Bezels, technical grid and condensed display type. Dark and light.",
      modes: ["dark", "light"],
      defaultMode: "dark",
      choice: null,
      ornaments: null,
      extras: "amber/cyan",
      preview: "../styles/mechcraft-hud/preview.png",
      design: "../styles/mechcraft-hud/DESIGN.md",
      demo: "../styles/mechcraft-hud/demo.html",
      theme: "../styles/mechcraft-hud/theme.css",
    },
  };

  const ORDER = ["neon-hud", "construct-poster", "moderncraft-hud", "mechcraft-hud"];
  const STORAGE_KEY = "designs.showcase.v2";
  const ORN_VALUES = ["css", "art", "minimal"];

  function defaults() {
    const choices = {};
    for (const id of ORDER) {
      const cfg = STYLES[id];
      if (cfg.choice) choices[id] = cfg.choice.default;
    }
    return { style: "neon-hud", mode: "dark", choices, orn: "css" };
  }

  function pick(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  function read() {
    const state = defaults();
    let saved = {};
    let params;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {};
    } catch (e) {
      saved = {};
    }
    try {
      params = new URLSearchParams(location.search);
    } catch (e) {
      params = new URLSearchParams("");
    }

    state.style = pick(params.get("style"), ORDER, pick(saved.style, ORDER, state.style));

    const cfg = STYLES[state.style];
    state.mode = pick(params.get("mode"), cfg.modes, pick(saved.mode, cfg.modes, cfg.defaultMode));

    for (const id of ORDER) {
      const style = STYLES[id];
      if (!style.choice) continue;
      const values = style.choice.options.map((option) => option.id);
      const fromUrl =
        id === state.style
          ? params.get(style.choice.attr) || params.get("accent")
          : null;
      const fromSave = saved.choices && saved.choices[id];
      state.choices[id] = pick(fromUrl, values, pick(fromSave, values, style.choice.default));
    }

    state.orn = pick(params.get("orn"), ORN_VALUES, pick(saved.orn, ORN_VALUES, "css"));
    return state;
  }

  function apply(state) {
    const root = document.documentElement;
    const cfg = STYLES[state.style] || STYLES["neon-hud"];

    state.style = cfg.id;
    state.mode = cfg.modes.includes(state.mode) ? state.mode : cfg.defaultMode;
    root.dataset.theme = cfg.id;
    root.dataset.mode = state.mode;

    root.removeAttribute("data-accent");
    if (cfg.choice) {
      const values = cfg.choice.options.map((option) => option.id);
      const value = pick(state.choices[cfg.id], values, cfg.choice.default);
      state.choices[cfg.id] = value;
      root.dataset[cfg.choice.attr] = value;
    }

    if (cfg.ornaments) {
      state.orn = pick(state.orn, cfg.ornaments, cfg.defaultOrn);
      root.dataset.orn = state.orn;
    } else {
      root.removeAttribute("data-orn");
    }

    document.querySelectorAll("link[data-theme-css]").forEach((link) => {
      link.media = link.dataset.themeCss === cfg.id ? "all" : "not all";
    });
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* private mode / file:// — the page still works */
    }
  }

  window.SHOWCASE = {
    STYLES,
    ORDER,
    STORAGE_KEY,
    ORN_VALUES,
    defaults,
    read,
    apply,
    save,
  };

  /* Runs after the stylesheet <link> elements, before first paint. */
  window.showcaseBootstrap = function () {
    try {
      const state = read();
      apply(state);
      window.__showcaseState = state;
    } catch (e) {
      /* Markup defaults remain: neon-hud, dark, css ornaments. */
    }
  };
})();
