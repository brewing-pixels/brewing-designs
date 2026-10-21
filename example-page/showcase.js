/* ============================================================
   Design showcase — behavior
   No framework, no build step. Everything is progressive:
   the markup is complete before this file runs.
   ============================================================ */
(() => {
  "use strict";

  const API = window.SHOWCASE;
  if (!API) return;

  const { STYLES, ORDER, read, apply, save } = API;
  const state = window.__showcaseState || read();
  const root = document.documentElement;
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SECTION_IDS = ["overview", "typography", "components", "forms", "data", "media", "tokens"];

  try {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  } catch (error) {
    /* ignore */
  }

  /* ----------------------------------------------------------
     Colour helpers
     ---------------------------------------------------------- */
  const probe = document.createElement("span");
  probe.className = "ds-probe";
  probe.setAttribute("aria-hidden", "true");
  document.body.appendChild(probe);

  const colourCanvas = document.createElement("canvas");
  colourCanvas.width = 1;
  colourCanvas.height = 1;
  const colourContext = colourCanvas.getContext("2d", { willReadFrequently: true });

  function readToken(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  function resolveToken(name) {
    const raw = readToken(name);
    if (!raw) return null;

    probe.style.color = "rgb(1, 2, 3)";
    probe.style.color = raw;
    const computed = getComputedStyle(probe).color;
    if (computed === "rgb(1, 2, 3)" && !/#010203|rgb\(\s*1,\s*2,\s*3\s*\)/i.test(raw)) {
      return null;
    }

    const colour = parseColour(computed) || parseColour(raw);
    if (!colour) return null;
    return { ...colour, raw, computed };
  }

  function parseColour(input) {
    if (!input) return null;
    const value = String(input).trim();

    let match = value.match(
      /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i
    );
    if (match) {
      const alpha =
        match[4] === undefined
          ? 1
          : match[4].endsWith("%")
            ? parseFloat(match[4]) / 100
            : parseFloat(match[4]);
      return {
        r: Math.round(Number(match[1])),
        g: Math.round(Number(match[2])),
        b: Math.round(Number(match[3])),
        a: Math.max(0, Math.min(1, alpha)),
      };
    }

    match = value.match(
      /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/i
    );
    if (match) {
      return {
        r: Math.round(Number(match[1]) * 255),
        g: Math.round(Number(match[2]) * 255),
        b: Math.round(Number(match[3]) * 255),
        a: match[4] === undefined ? 1 : Math.max(0, Math.min(1, Number(match[4]))),
      };
    }

    match = value.match(/^#([0-9a-f]{3,8})$/i);
    if (match) {
      let hex = match[1];
      if (hex.length === 3 || hex.length === 4) {
        hex = hex.split("").map((character) => character + character).join("");
      }
      if (hex.length === 6 || hex.length === 8) {
        return {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
        };
      }
    }

    try {
      colourContext.clearRect(0, 0, 1, 1);
      colourContext.fillStyle = "rgb(1, 2, 3)";
      colourContext.fillStyle = value;
      colourContext.fillRect(0, 0, 1, 1);
      const data = colourContext.getImageData(0, 0, 1, 1).data;
      if (data[0] === 1 && data[1] === 2 && data[2] === 3) return null;
      return { r: data[0], g: data[1], b: data[2], a: data[3] / 255 };
    } catch (error) {
      return null;
    }
  }

  function rgbaString(colour) {
    if (colour.a >= 0.999) return `rgb(${colour.r}, ${colour.g}, ${colour.b})`;
    return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${Number(colour.a.toFixed(3))})`;
  }

  function hexString(colour) {
    const part = (value) => value.toString(16).padStart(2, "0");
    return `#${part(colour.r)}${part(colour.g)}${part(colour.b)}`;
  }

  function composite(foreground, background) {
    const alpha = foreground.a;
    return {
      r: Math.round(foreground.r * alpha + background.r * (1 - alpha)),
      g: Math.round(foreground.g * alpha + background.g * (1 - alpha)),
      b: Math.round(foreground.b * alpha + background.b * (1 - alpha)),
      a: 1,
    };
  }

  function luminance(colour) {
    const channel = (value) => {
      const normalised = value / 255;
      return normalised <= 0.03928
        ? normalised / 12.92
        : Math.pow((normalised + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(colour.r) + 0.7152 * channel(colour.g) + 0.0722 * channel(colour.b);
  }

  function contrastRatio(foreground, background) {
    const lighter = Math.max(luminance(foreground), luminance(background));
    const darker = Math.min(luminance(foreground), luminance(background));
    return (lighter + 0.05) / (darker + 0.05);
  }

  function resolveFont(name) {
    const raw = readToken(name);
    if (!raw) return "";
    probe.style.fontFamily = "serif";
    probe.style.fontFamily = raw;
    return getComputedStyle(probe).fontFamily;
  }

  /* ----------------------------------------------------------
     State / URL / controls
     ---------------------------------------------------------- */
  function writeUrl() {
    const config = STYLES[state.style];
    const parameters = new URLSearchParams();
    parameters.set("style", state.style);
    parameters.set("mode", state.mode);
    for (const choice of config.choices || []) {
      parameters.set(choice.attr, state.choices[state.style][choice.attr]);
    }
    if (config.ornaments) parameters.set("orn", state.orn);
    try {
      history.replaceState(
        null,
        "",
        `${location.pathname}?${parameters.toString()}${location.hash || ""}`
      );
    } catch (error) {
      /* file:// in some browsers disallows replacing the query string. */
    }
  }

  function commit(options = {}) {
    apply(state);
    if (options.persist !== false) save(state);
    syncControls();
    syncStyleCard();
    if (options.url !== false) writeUrl();
    requestAnimationFrame(() => {
      refreshTokens();
      drawCanvas();
    });
  }

  function setStyle(id) {
    if (!STYLES[id] || state.style === id) return;
    state.style = id;
    const config = STYLES[id];
    if (!config.modes.includes(state.mode)) state.mode = config.defaultMode;
    commit();
    showToast(`${config.name} · ${state.mode}`);
  }

  function syncControls() {
    const config = STYLES[state.style];

    $$("[data-style-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.styleChoice === state.style));
    });

    $$("[data-mode-choice]").forEach((button) => {
      const mode = button.dataset.modeChoice;
      const available = config.modes.includes(mode);
      button.setAttribute("aria-pressed", String(mode === state.mode));
      button.disabled = !available;
      button.title = available ? "" : `${config.name} supports ${config.modes.join(" / ")} only`;
    });

    const ornamentOption = $('[data-opt="orn"]');
    if (ornamentOption) ornamentOption.hidden = !config.ornaments;
    $$("[data-orn-choice]").forEach((button) => {
      button.disabled = !config.ornaments;
      button.setAttribute(
        "aria-pressed",
        String(Boolean(config.ornaments) && button.dataset.ornChoice === state.orn)
      );
    });

    const choiceGroups = $("#choice-groups");
    if (choiceGroups) {
      const choices = config.choices || [];
      choiceGroups.hidden = choices.length === 0;
      if (choiceGroups.dataset.for !== config.id) {
        choiceGroups.textContent = "";
        choices.forEach((choice) => {
          const group = document.createElement("div");
          group.className = "ds-opt";

          const label = document.createElement("span");
          label.className = "ds-opt-label";
          label.id = `choice-label-${config.id}-${choice.attr}`;
          label.textContent = choice.label;
          group.appendChild(label);

          const control = document.createElement("div");
          control.className =
            choice.type === "text" ? "ds-seg" : choice.type === "roles" ? "ds-roles" : "ds-swatches";
          control.setAttribute("role", "group");
          control.setAttribute("aria-labelledby", label.id);

          choice.options.forEach((option) => {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.choiceAttr = choice.attr;
            button.dataset.choiceValue = option.id;
            button.setAttribute("aria-pressed", "false");

            if (choice.type === "roles") {
              button.className = "ds-rolebtn";
              button.setAttribute("aria-label", option.label);
              button.title = option.label;
              (option.colors || []).forEach((color) => {
                const dot = document.createElement("span");
                dot.setAttribute("aria-hidden", "true");
                dot.style.setProperty("--dot", color);
                button.appendChild(dot);
              });
            } else if (choice.type === "text") {
              button.textContent = option.label;
            } else {
              button.className = "ds-swatchbtn";
              button.style.setProperty("--dot", option.hex);
              button.setAttribute("aria-label", option.label);
              button.title = option.label;
              const swatch = document.createElement("span");
              swatch.setAttribute("aria-hidden", "true");
              button.appendChild(swatch);
            }

            control.appendChild(button);
          });

          group.appendChild(control);
          choiceGroups.appendChild(group);
        });
        choiceGroups.dataset.for = config.id;
      }

      $$("[data-choice-attr]", choiceGroups).forEach((button) => {
        const current = state.choices[state.style] && state.choices[state.style][button.dataset.choiceAttr];
        button.setAttribute("aria-pressed", String(current === button.dataset.choiceValue));
      });
    }

    const note = $("#style-note");
    if (note) {
      const modes = config.modes.length === 1 ? `${config.modes[0]} only` : config.modes.join(" + ");
      note.textContent = `${modes} · ${config.extras}`;
    }
  }

  function syncStyleCard() {
    const config = STYLES[state.style];
    const preview = $("#style-preview");
    if (preview) {
      preview.src = config.preview;
      preview.alt = `Preview of ${config.name}`;
    }
    setText("#style-tagline", config.tagline);
    setText("#style-name", config.name);
    setText("#style-desc", config.description);
    setText("#style-modes", config.modes.join(" · "));
    setText("#style-extras", config.extras);
    setText("#hero-style", config.name);
    setText("#hero-mode", state.mode);
    setText("#hero-choice", config.extras);
    setText("#tokens-style-name", config.name);
    setText("#tokens-style-desc", config.description);
    setText("#tokens-theme", config.id);
    setText("#tokens-mode", state.mode);
    const choiceText = (config.choices || [])
      .map((choice) => `${choice.attr}: ${state.choices[config.id][choice.attr]}`)
      .join(" · ");
    setText("#tokens-choice", choiceText || "—");
    setText("#tokens-orn", config.ornaments ? state.orn : "—");

    const design = $("#style-design");
    if (design) design.href = config.design;
    const demo = $("#style-demo");
    if (demo) demo.href = config.demo;
  }

  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
  }

  /* ----------------------------------------------------------
     Toast + copy
     ---------------------------------------------------------- */
  let toastTimer = 0;

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-on");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-on"), 3200);
  }

  async function copyText(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage);
      return;
    } catch (error) {
      /* fall through to the legacy path */
    }
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.top = "-1000px";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    helper.remove();
    showToast(copied ? successMessage : "Copy failed — select the text manually.");
  }

  /* ----------------------------------------------------------
     Tabs
     ---------------------------------------------------------- */
  function setupTablist(list, onSelect) {
    const tabs = $$('[role="tab"]', list);
    if (!tabs.length) return null;
    const panels = tabs
      .map((tab) => document.getElementById(tab.getAttribute("aria-controls")))
      .filter(Boolean);

    const activate = (tab, options = {}) => {
      if (!tabs.includes(tab)) return;
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.id !== tab.getAttribute("aria-controls");
      });
      if (options.focus) tab.focus();
      if (!options.silent && onSelect) onSelect(tab);
    };

    list.addEventListener("click", (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab && tabs.includes(tab)) activate(tab);
    });

    list.addEventListener("keydown", (event) => {
      const index = tabs.indexOf(document.activeElement);
      if (index < 0) return;
      let next = null;
      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      else if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
      else if (event.key === "Home") next = tabs[0];
      else if (event.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        event.preventDefault();
        activate(next, { focus: true });
      }
    });

    const selected = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
    activate(selected, { silent: true });
    return { activate, tabs, panels };
  }

  let sectionTabs = null;

  function onSectionChange(tab) {
    const id = tab.getAttribute("aria-controls");
    try {
      history.replaceState(null, "", `${location.pathname}${location.search}#${id}`);
    } catch (error) {
      /* file:// — the tab still works, the hash just does not update */
    }
    if (window.scrollY > 240) {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
    if (id === "data") requestAnimationFrame(drawCanvas);
    if (id === "tokens") requestAnimationFrame(refreshTokens);
  }

  function activateSection(id) {
    if (!sectionTabs) return;
    const tab = document.getElementById(`tab-${id}`);
    if (tab) sectionTabs.activate(tab);
  }

  function setupTabs() {
    const sectionList = document.querySelector('[data-tabgroup="sections"]');
    if (sectionList) {
      sectionTabs = setupTablist(sectionList, onSectionChange);
      const hash = window.__initialSection || location.hash.replace(/^#/, "");
      if (SECTION_IDS.includes(hash)) {
        const target = document.getElementById(`tab-${hash}`);
        if (target && sectionTabs) sectionTabs.activate(target, { silent: true });
        if (hash === "data") requestAnimationFrame(drawCanvas);
        if (hash === "tokens") requestAnimationFrame(refreshTokens);
        if (window.__initialSection) {
          try {
            history.replaceState(
              null,
              "",
              `${location.pathname}${location.search}#${hash}`
            );
          } catch (error) {
            /* file:// */
          }
        }
        requestAnimationFrame(() => window.scrollTo(0, 0));
      }
    }

    $$("[data-tabs]").forEach((wrap) => {
      const list = wrap.querySelector('[role="tablist"]');
      if (list) setupTablist(list, null);
    });

    window.addEventListener("hashchange", () => {
      const id = location.hash.replace(/^#/, "");
      if (!sectionTabs || !SECTION_IDS.includes(id)) return;
      const tab = document.getElementById(`tab-${id}`);
      if (!tab || tab.getAttribute("aria-selected") === "true") return;
      sectionTabs.activate(tab, { silent: true });
      if (window.scrollY > 240) {
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      }
      if (id === "data") requestAnimationFrame(drawCanvas);
      if (id === "tokens") requestAnimationFrame(refreshTokens);
    });
  }

  /* ----------------------------------------------------------
     Global click behavior
     ---------------------------------------------------------- */
  function bindClicks() {
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const styleButton = target.closest("[data-style-choice]");
      if (styleButton) {
        setStyle(styleButton.dataset.styleChoice);
        return;
      }

      const modeButton = target.closest("[data-mode-choice]");
      if (modeButton && !modeButton.disabled) {
        state.mode = modeButton.dataset.modeChoice;
        commit();
        return;
      }

      const ornamentButton = target.closest("[data-orn-choice]");
      if (ornamentButton && !ornamentButton.disabled) {
        state.orn = ornamentButton.dataset.ornChoice;
        commit();
        return;
      }

      const choiceButton = target.closest("[data-choice-value]");
      if (choiceButton) {
        state.choices[state.style][choiceButton.dataset.choiceAttr] = choiceButton.dataset.choiceValue;
        commit();
        return;
      }

      const chip = target.closest("[data-chip]");
      if (chip) {
        const pressed = chip.getAttribute("aria-pressed") === "true";
        chip.setAttribute("aria-pressed", String(!pressed));
        chip.classList.toggle("active", !pressed);
        return;
      }

      const tabTarget = target.closest("[data-tab-target]");
      if (tabTarget) {
        activateSection(tabTarget.dataset.tabTarget);
        return;
      }

      const dialogOpen = target.closest("[data-dialog-open]");
      if (dialogOpen) {
        openDialog(dialogOpen.dataset.dialogOpen);
        return;
      }

      const dialogClose = target.closest("[data-dialog-close]");
      if (dialogClose) {
        const dialog = dialogClose.closest("dialog");
        if (dialog) dialog.close();
      }

      const toastTrigger = target.closest("[data-demo-toast]");
      if (toastTrigger) showToast(toastTrigger.dataset.demoToast);
    });

    $$("dialog").forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    });

    const copyLink = $("#copy-link");
    if (copyLink) copyLink.addEventListener("click", () => copyText(location.href, "Link copied."));

    const copySnippet = $("#copy-snippet");
    if (copySnippet) {
      copySnippet.addEventListener("click", () => {
        const snippet = $("#snippet");
        copyText(snippet ? snippet.textContent : "", "Snippet copied.");
      });
    }
  }

  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  /* ----------------------------------------------------------
     Forms
     ---------------------------------------------------------- */
  function bindForms() {
    const form = $("#demo-form");
    if (form) {
      const status = $("#form-status");
      const output = $("#form-out");
      const controls = $$("input, select, textarea", form).filter(
        (element) => !["submit", "reset", "button", "image", "hidden"].includes(element.type)
      );

      const setError = (element, message) => {
        const field = element.closest(".ds-field");
        const error = field ? field.querySelector(".ds-error") : null;
        if (field) field.classList.toggle("is-invalid", Boolean(message));
        element.setAttribute("aria-invalid", message ? "true" : "false");
        if (error) {
          error.hidden = !message;
          error.textContent = message || "";
        }
        if (element.name === "terms") {
          const termsError = $("#terms-error");
          if (termsError) {
            termsError.hidden = !message;
            termsError.textContent = message || "";
          }
        }
      };

      const clearErrors = () => {
        controls.forEach((element) => setError(element, ""));
        if (status) status.hidden = true;
      };

      const validate = () => {
        let firstInvalid = null;
        let invalidCount = 0;
        controls.forEach((element) => {
          if (!element.willValidate) return;
          if (element.checkValidity()) {
            setError(element, "");
          } else {
            invalidCount += 1;
            setError(element, element.validationMessage);
            if (!firstInvalid) firstInvalid = element;
          }
        });

        if (firstInvalid) {
          if (status) {
            status.replaceChildren();
            const wrap = document.createElement("div");
            const heading = document.createElement("strong");
            heading.textContent = "Lorem ipsum needs attention";
            const detail = document.createElement("span");
            detail.textContent = `${invalidCount} field${invalidCount === 1 ? "" : "s"} did not pass validation.`;
            wrap.append(heading, detail);
            status.appendChild(wrap);
            status.hidden = false;
          }
          firstInvalid.focus();
          showToast("Check the highlighted fields.");
          return false;
        }
        if (status) status.hidden = true;
        return true;
      };

      form.addEventListener("input", (event) => {
        if (event.target.matches("input, select, textarea")) setError(event.target, "");
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!validate()) return;

        const lines = [];
        Array.from(form.elements).forEach((element) => {
          if (!element.name) return;
          if (["submit", "reset", "button", "image", "file", "password"].includes(element.type)) return;
          if (element.type === "checkbox" || element.type === "radio") {
            if (element.checked) lines.push(`${element.name}: ${element.value}`);
            return;
          }
          lines.push(`${element.name}: ${element.value}`);
        });

        const fileInput = $("#f-file");
        if (fileInput && fileInput.files && fileInput.files.length) {
          lines.push(
            `file: ${Array.from(fileInput.files)
              .map((file) => file.name)
              .join(", ")}`
          );
        }

        if (output) output.textContent = lines.length ? lines.join("\n") : "No values.";
        showToast("Form submitted — specimen only.");
      });

      form.addEventListener("reset", () => {
        window.setTimeout(() => {
          clearErrors();
          if (output) output.textContent = "No submission yet.";
          updateRange();
          updateColour();
          updateCount();
          updateFile();
        }, 0);
      });

      const range = $("#f-range");
      const rangeOutput = $("#range-out");
      const updateRange = () => {
        if (!range || !rangeOutput) return;
        const minimum = Number(range.min || 0);
        const maximum = Number(range.max || 100);
        const percentage = maximum === minimum ? 0 : ((Number(range.value) - minimum) / (maximum - minimum)) * 100;
        range.style.setProperty("--pct", `${percentage}%`);
        rangeOutput.textContent = range.value;
      };

      const colour = $("#f-color");
      const colourOutput = $("#color-out");
      const updateColour = () => {
        if (!colour || !colourOutput) return;
        colourOutput.textContent = colour.value;
        colour.style.setProperty("--picked", colour.value);
      };

      const message = $("#f-message");
      const count = $("#msg-count");
      const updateCount = () => {
        if (message && count) count.textContent = String(message.value.length);
      };

      const fileInput = $("#f-file");
      const fileOutput = $("#file-out");
      const updateFile = () => {
        if (!fileInput || !fileOutput) return;
        if (!fileInput.files || !fileInput.files.length) {
          fileOutput.textContent = "No files selected.";
          return;
        }
        const names = Array.from(fileInput.files).map((file) => file.name);
        const totalBytes = Array.from(fileInput.files).reduce((sum, file) => sum + file.size, 0);
        fileOutput.textContent = `${fileInput.files.length} file${fileInput.files.length === 1 ? "" : "s"} — ${names.join(", ")} (${Math.round(totalBytes / 1024)} KB)`;
      };

      if (range) {
        range.addEventListener("input", updateRange);
        updateRange();
      }
      if (colour) {
        colour.addEventListener("input", updateColour);
        updateColour();
      }
      if (message) {
        message.addEventListener("input", updateCount);
        updateCount();
      }
      if (fileInput) {
        fileInput.addEventListener("change", updateFile);
        updateFile();
      }

      const password = $("#f-pass");
      const passwordToggle = $("#toggle-pass");
      if (password && passwordToggle) {
        passwordToggle.addEventListener("click", () => {
          const show = password.type === "password";
          password.type = show ? "text" : "password";
          passwordToggle.textContent = show ? "Hide" : "Show";
          passwordToggle.setAttribute("aria-pressed", String(show));
        });
      }
    }

    const miniForm = $("#mini-form");
    if (miniForm) {
      miniForm.addEventListener("submit", (event) => {
        event.preventDefault();
        showToast("Input submit — specimen only.");
      });
    }

    const searchForm = $("#search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = $("#search-input");
        const query = input ? input.value.trim() : "";
        showToast(query ? `Search demo — no results for “${query}”.` : "Search demo — type something first.");
      });
    }
  }

  /* ----------------------------------------------------------
     Sortable table
     ---------------------------------------------------------- */
  function bindTable() {
    const table = $("#specimen-table");
    if (!table || !table.tBodies.length) return;
    const body = table.tBodies[0];
    const headers = $$("thead th", table);
    const status = $("#table-status");
    let sortIndex = 0;
    let direction = 1;

    const cellValue = (row, index) => {
      const cell = row.cells[index];
      if (!cell) return { numeric: false, text: "", number: 0 };
      const raw = (cell.dataset.sortValue !== undefined ? cell.dataset.sortValue : cell.textContent).trim();
      const numeric = /^-?[\d.,%\s]+$/.test(raw) && raw !== "";
      return {
        numeric,
        text: raw.toLowerCase(),
        number: numeric ? Number(raw.replace(/[%,]/g, "")) : 0,
      };
    };

    const updateIndicators = () => {
      headers.forEach((header, index) => {
        header.setAttribute(
          "aria-sort",
          index === sortIndex ? (direction === 1 ? "ascending" : "descending") : "none"
        );
        const indicator = header.querySelector(".ds-sort-ind");
        if (indicator) {
          indicator.textContent = index === sortIndex ? (direction === 1 ? "▲" : "▼") : "↕";
        }
      });
    };

    const sortBy = (index) => {
      if (index === sortIndex) direction *= -1;
      else {
        sortIndex = index;
        direction = 1;
      }
      const rows = Array.from(body.rows);
      rows.sort((a, b) => {
        const left = cellValue(a, index);
        const right = cellValue(b, index);
        if (left.numeric && right.numeric) return (left.number - right.number) * direction;
        return left.text.localeCompare(right.text) * direction;
      });
      rows.forEach((row) => body.appendChild(row));
      updateIndicators();
      const button = headers[index] ? headers[index].querySelector(".ds-sort") : null;
      const label = button ? button.textContent.replace(/[▲▼↕]/g, "").trim() : `column ${index + 1}`;
      if (status) {
        status.textContent = `Sorted by ${label}, ${direction === 1 ? "ascending" : "descending"}.`;
      }
    };

    headers.forEach((header, index) => {
      const button = header.querySelector(".ds-sort");
      if (button) button.addEventListener("click", () => sortBy(index));
    });
    updateIndicators();
  }

  /* ----------------------------------------------------------
     Canvas sparkline
     ---------------------------------------------------------- */
  function drawCanvas() {
    const canvas = $("#spark");
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const width = Math.floor(bounds.width);
    const height = Math.floor(bounds.height);
    if (width < 8 || height < 8) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
    }

    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const accent = resolveToken("--ds-accent-fill");
    const line = resolveToken("--line");
    const muted = resolveToken("--mut");
    if (!accent) return;

    if (line) {
      context.strokeStyle = rgbaString(line);
      context.lineWidth = 1;
      context.setLineDash([3, 4]);
      for (let index = 1; index <= 3; index += 1) {
        const y = (height / 4) * index;
        context.beginPath();
        context.moveTo(8, y);
        context.lineTo(width - 8, y);
        context.stroke();
      }
      context.setLineDash([]);
    }

    const values = [22, 38, 30, 52, 44, 66, 58, 78, 71, 88];
    const padding = 12;
    const step = (width - padding * 2) / (values.length - 1);
    const points = values.map((value, index) => ({
      x: padding + index * step,
      y: height - padding - (value / 100) * (height - padding * 2),
    }));

    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.lineTo(points[points.length - 1].x, height - padding);
    context.lineTo(points[0].x, height - padding);
    context.closePath();
    context.fillStyle = rgbaString({ ...accent, a: 0.14 });
    context.fill();

    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.strokeStyle = rgbaString(accent);
    context.lineWidth = 2;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.stroke();

    context.fillStyle = rgbaString(accent);
    points.forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 2.4, 0, Math.PI * 2);
      context.fill();
    });

    if (muted) {
      context.fillStyle = rgbaString(muted);
      context.font = "9px monospace";
      context.fillText("100", 4, 12);
      context.fillText("0", 4, height - 4);
    }
  }

  /* ----------------------------------------------------------
     Tokens panel
     ---------------------------------------------------------- */
  const PALETTE = [
    ["--bg", "page"],
    ["--bg-2", "page 2"],
    ["--surface", "surface"],
    ["--surface-2", "surface 2"],
    ["--surface-3", "surface 3"],
    ["--line", "line"],
    ["--line-2", "line 2"],
    ["--ink", "ink"],
    ["--ink-2", "ink 2"],
    ["--mut", "muted"],
    ["--surface-card", "card"],
    ["--acc", "accent"],
    ["--acc-tone", "accent tone"],
    ["--acc-soft", "accent soft"],
    ["--acc-line", "accent line"],
    ["--acc-ink", "on accent"],
    ["--good", "good"],
    ["--warn", "warn"],
    ["--bad", "bad"],
    ["--info", "info"],
  ];

  const CONTRAST_PAIRS = [
    ["--ink", "--bg", "Ink / page"],
    ["--ink-2", "--bg", "Secondary / page"],
    ["--mut", "--bg", "Muted / page"],
    ["--ink", "--ds-card-surface", "Ink / card"],
    ["--ink-2", "--ds-card-surface", "Secondary / card"],
    ["--ds-accent-text", "--bg", "Accent / page"],
    ["--ds-accent-text", "--ds-card-surface", "Accent / card"],
    ["--ds-on-accent", "--ds-accent-fill", "On accent"],
  ];

  function refreshTokens() {
    buildSwatches();
    buildContrast();
    buildScales();
    updateSnippet();
    updateTypeSizes();
    updateMetaTheme();
  }

  function buildSwatches() {
    const wrap = $("#swatches");
    if (!wrap) return;
    const fragment = document.createDocumentFragment();
    PALETTE.forEach(([name, label]) => {
      const colour = resolveToken(name);
      if (!colour) return;

      const item = document.createElement("div");
      item.className = "ds-swatch";
      item.title = `${name} — ${label}`;

      const chip = document.createElement("span");
      chip.className = "ds-chipcolor";
      const fill = document.createElement("span");
      fill.style.background = colour.computed || rgbaString(colour);
      chip.appendChild(fill);

      const info = document.createElement("div");
      info.className = "ds-swatchinfo";
      const tokenName = document.createElement("span");
      tokenName.className = "ds-swatchname";
      tokenName.textContent = name;
      const value = document.createElement("span");
      value.className = "ds-swatchval";
      value.textContent = colour.a < 0.999 ? rgbaString(colour) : hexString(colour);
      info.append(tokenName, value);

      item.append(chip, info);
      fragment.appendChild(item);
    });
    wrap.replaceChildren(fragment);
  }

  function buildContrast() {
    const wrap = $("#contrast");
    if (!wrap) return;
    const page = resolveToken("--bg");
    const fragment = document.createDocumentFragment();

    CONTRAST_PAIRS.forEach(([foregroundName, backgroundName, label]) => {
      const foreground = resolveToken(foregroundName);
      let background = resolveToken(backgroundName);
      if (!foreground || !background) return;

      if (background.a < 0.999 && page) {
        background = composite(background, page);
      }
      const solidForeground =
        foreground.a < 0.999 ? composite(foreground, background) : foreground;
      const ratio = contrastRatio(solidForeground, background);
      if (!Number.isFinite(ratio)) return;

      const grade =
        ratio >= 7
          ? ["AAA", "is-aaa"]
          : ratio >= 4.5
            ? ["AA", "is-aa"]
            : ratio >= 3
              ? ["AA large", "is-large"]
              : ["Fail", "is-fail"];

      const row = document.createElement("div");
      row.className = "ds-contrastrow";

      const pair = document.createElement("span");
      pair.className = "ds-pair";
      pair.textContent = `${label} `;
      const code = document.createElement("code");
      code.textContent = foregroundName;
      pair.appendChild(code);

      const value = document.createElement("span");
      value.className = "ds-ratio";
      value.textContent = `${ratio.toFixed(2)}:1`;

      const badge = document.createElement("span");
      badge.className = `ds-ratio-badge ${grade[1]}`;
      badge.textContent = grade[0];

      row.append(pair, value, badge);
      fragment.appendChild(row);
    });

    wrap.replaceChildren(fragment);
  }

  function buildScales() {
    const wrap = $("#scales");
    if (!wrap) return;
    const fragment = document.createDocumentFragment();

    const typeGroup = document.createElement("div");
    typeGroup.className = "ds-scalegroup";
    const typeTitle = document.createElement("h3");
    typeTitle.textContent = "Type scale";
    typeGroup.appendChild(typeTitle);

    ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tag) => {
      const element = document.querySelector(`.ds-hrow ${tag}`);
      if (!element) return;
      const computed = getComputedStyle(element);
      const family = computed.fontFamily.split(",")[0].replace(/["']/g, "").trim();
      const row = document.createElement("div");
      row.className = "ds-type-row";
      const label = document.createElement("code");
      label.textContent = tag;
      const name = document.createElement("span");
      name.textContent = family;
      name.title = computed.fontFamily;
      const size = document.createElement("span");
      size.textContent = `${Math.round(parseFloat(computed.fontSize))}px · ${computed.fontWeight}`;
      row.append(label, name, size);
      typeGroup.appendChild(row);
    });

    const fontNote = document.createElement("p");
    fontNote.className = "ds-note";
    const displayFont = resolveFont("--f-display");
    const monoFont = resolveFont("--f-mono");
    fontNote.textContent = `display: ${displayFont.split(",")[0].replace(/["']/g, "")} · mono: ${monoFont.split(",")[0].replace(/["']/g, "")}`;
    fontNote.title = `display: ${displayFont}\nmono: ${monoFont}`;
    typeGroup.appendChild(fontNote);
    fragment.appendChild(typeGroup);

    const radiiGroup = document.createElement("div");
    radiiGroup.className = "ds-scalegroup";
    const radiiTitle = document.createElement("h3");
    radiiTitle.textContent = "Radii";
    radiiGroup.appendChild(radiiTitle);
    [
      ["--r-sm", "sm"],
      ["--r-md", "md"],
      ["--r-lg", "lg"],
      ["--r-full", "full"],
    ].forEach(([name, label]) => {
      const value = readToken(name);
      if (!value) return;
      const row = document.createElement("div");
      row.className = "ds-scalerow";
      const token = document.createElement("code");
      token.textContent = `--r-${label}`;
      const box = document.createElement("span");
      box.className = "ds-radiusbox";
      box.style.borderRadius = `var(${name})`;
      const raw = document.createElement("span");
      raw.textContent = value;
      row.append(token, box, raw);
      radiiGroup.appendChild(row);
    });
    fragment.appendChild(radiiGroup);

    const spaceGroup = document.createElement("div");
    spaceGroup.className = "ds-scalegroup";
    const spaceTitle = document.createElement("h3");
    spaceTitle.textContent = "Spacing";
    spaceGroup.appendChild(spaceTitle);
    ["--s1", "--s2", "--s3", "--s4", "--s5", "--s6"].forEach((name) => {
      const value = readToken(name);
      if (!value) return;
      const row = document.createElement("div");
      row.className = "ds-scalerow";
      const token = document.createElement("code");
      token.textContent = name;
      const bar = document.createElement("span");
      bar.className = "ds-spacebar";
      bar.style.width = `var(${name})`;
      const raw = document.createElement("span");
      raw.textContent = value;
      row.append(token, bar, raw);
      spaceGroup.appendChild(row);
    });
    fragment.appendChild(spaceGroup);

    wrap.replaceChildren(fragment);
  }

  function updateSnippet() {
    const snippet = $("#snippet");
    if (!snippet) return;
    const config = STYLES[state.style];
    const attributes = [`data-theme="${config.id}"`, `data-mode="${state.mode}"`];
    for (const choice of config.choices || []) {
      attributes.push(`data-${choice.attr}="${state.choices[config.id][choice.attr]}"`);
    }
    if (config.ornaments) attributes.push(`data-orn="${state.orn}"`);
    snippet.textContent = `<html ${attributes.join(" ")}>\n<link rel="stylesheet" href="../styles/${config.id}/theme.css">`;
  }

  function updateTypeSizes() {
    $$(".ds-size[data-size-for]").forEach((label) => {
      const tag = label.dataset.sizeFor;
      const element = document.querySelector(`.ds-hrow ${tag}`);
      if (!element) return;
      const computed = getComputedStyle(element);
      const size = Math.round(parseFloat(computed.fontSize));
      label.textContent = `${size}px / ${computed.lineHeight}`;
    });
  }

  function updateMetaTheme() {
    const meta = $("#meta-theme");
    if (!meta) return;
    const background = resolveToken("--bg");
    if (background) meta.setAttribute("content", hexString(background));
  }

  function watchThemeLoading() {
    $$("link[data-theme-css]").forEach((link) => {
      link.addEventListener("load", () => {
        if (link.media !== "not all") requestAnimationFrame(refreshTokens);
      });
      /* The active sheet may already be loaded before this script runs. */
      if (link.media !== "not all" && link.sheet) {
        requestAnimationFrame(refreshTokens);
      }
    });
    window.addEventListener("load", () => requestAnimationFrame(refreshTokens));
  }

  /* ----------------------------------------------------------
     Element coverage audit
     ---------------------------------------------------------- */
  const COVERAGE = [
    ["Document", ["html", "head", "title", "meta", "link", "script", "style", "body", "noscript"]],
    ["Sectioning", ["header", "nav", "main", "section", "article", "aside", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "hgroup", "address", "search"]],
    ["Grouping", ["p", "hr", "pre", "blockquote", "ol", "ul", "menu", "li", "dl", "dt", "dd", "figure", "figcaption", "div"]],
    ["Text", ["a", "em", "strong", "small", "s", "cite", "q", "dfn", "abbr", "ruby", "rt", "rp", "data", "time", "code", "var", "samp", "kbd", "sub", "sup", "i", "b", "u", "mark", "bdi", "bdo", "span", "br", "wbr", "del", "ins"]],
    ["Embedded", ["picture", "source", "img", "iframe", "embed", "object", "video", "audio", "track", "map", "area", "svg", "math", "canvas"]],
    ["Tabular", ["table", "caption", "colgroup", "col", "thead", "tbody", "tfoot", "tr", "th", "td"]],
    ["Forms", ["form", "label", "input", "button", "select", "datalist", "optgroup", "option", "textarea", "output", "progress", "meter", "fieldset", "legend"]],
    ["Interactive", ["details", "summary", "dialog"]],
    ["Web components", ["template", "slot"]],
  ];

  const SPECIAL_ELEMENTS = {
    html: () => document.documentElement,
    head: () => document.head,
    body: () => document.body,
    title: () => document.querySelector("title"),
    meta: () => document.querySelector("meta"),
    link: () => document.querySelector('link[rel="stylesheet"]'),
    script: () => document.querySelector("script"),
    style: () => {
      const template = document.querySelector("template");
      return template ? template.content.querySelector("style") : document.querySelector("style");
    },
    slot: () => {
      const specimen = document.querySelector("x-specimen");
      return specimen && specimen.shadowRoot ? specimen.shadowRoot.querySelector("slot") : null;
    },
  };

  function elementPresent(tag) {
    if (SPECIAL_ELEMENTS[tag]) return Boolean(SPECIAL_ELEMENTS[tag]());
    try {
      return Boolean(document.querySelector(tag));
    } catch (error) {
      return false;
    }
  }

  function renderCoverage() {
    const wrap = $("#coverage");
    if (!wrap) return;
    const fragment = document.createDocumentFragment();
    let total = 0;
    let present = 0;

    COVERAGE.forEach(([group, tags]) => {
      const section = document.createElement("section");
      section.className = "ds-covgroup";
      const title = document.createElement("h3");
      title.textContent = group;
      section.appendChild(title);
      const grid = document.createElement("div");
      grid.className = "ds-covgrid";

      tags.forEach((tag) => {
        total += 1;
        const found = elementPresent(tag);
        if (found) present += 1;
        const chip = document.createElement("span");
        chip.className = `ds-el${found ? "" : " is-missing"}`;
        chip.dataset.el = tag;
        chip.title = `${tag}: ${found ? "present" : "missing"}`;
        const code = document.createElement("code");
        code.textContent = `<${tag}>`;
        chip.appendChild(code);
        grid.appendChild(chip);
      });

      section.appendChild(grid);
      fragment.appendChild(section);
    });

    wrap.replaceChildren(fragment);
    const count = $("#coverage-count");
    if (count) count.textContent = `${present} / ${total} present`;
    const kpi = $("#kpi-elements");
    if (kpi) kpi.textContent = String(total);
  }

  function updateKpis() {
    const styles = ORDER.length;
    const modes = ORDER.reduce((total, id) => total + STYLES[id].modes.length, 0);
    const presets = ORDER.reduce(
      (total, id) =>
        total +
        (STYLES[id].choices || []).reduce((sum, choice) => sum + choice.options.length, 0),
      0
    );
    setText("#kpi-styles", String(styles));
    setText("#kpi-modes", String(modes));
    setText("#kpi-presets", String(presets));
  }

  function registerSpecimen() {
    if (customElements.get("x-specimen")) return;
    const template = $("#specimen-template");
    if (!template) return;
    class XSpecimen extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
      }
    }
    customElements.define("x-specimen", XSpecimen);
  }

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */
  function init() {
    registerSpecimen();
    apply(state);
    syncControls();
    syncStyleCard();
    bindClicks();
    bindForms();
    bindTable();
    setupTabs();
    renderCoverage();
    updateKpis();
    watchThemeLoading();

    requestAnimationFrame(() => {
      refreshTokens();
      drawCanvas();
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => refreshTokens()).catch(() => {});
    }

    const canvas = $("#spark");
    if (canvas && "ResizeObserver" in window) {
      const observer = new ResizeObserver(() => drawCanvas());
      observer.observe(canvas);
    }
  }

  init();
})();
