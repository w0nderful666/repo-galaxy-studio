(function () {
  const results = document.getElementById("self-test-results");
  const frame = document.getElementById("app-frame");

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function report(name, passed, detail) {
    const row = document.createElement("div");
    row.className = `result ${passed ? "pass" : "fail"}`;
    row.innerHTML = `<span>${name}${detail ? ` - ${detail}` : ""}</span><span class="badge">${passed ? "PASS" : "FAIL"}</span>`;
    results.appendChild(row);
  }

  async function runCheck(name, check) {
    try {
      const detail = await check();
      report(name, true, detail);
    } catch (error) {
      report(name, false, error instanceof Error ? error.message : String(error));
    }
  }

  function getAppDocument() {
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc) {
      throw new Error("Cannot access app iframe.");
    }
    return doc;
  }

  function query(doc, selector) {
    const element = doc.querySelector(selector);
    if (!element) {
      throw new Error(`Missing selector: ${selector}`);
    }
    return element;
  }

  async function run() {
    const doc = getAppDocument();
    const win = frame.contentWindow;

    await runCheck("Page can load", () => {
      query(doc, "[data-testid='app-shell']");
      return "app shell found";
    });

    await runCheck("localStorage is available", () => {
      const key = "open-tools-starter.self-test";
      win.localStorage.setItem(key, "ok");
      const value = win.localStorage.getItem(key);
      win.localStorage.removeItem(key);
      if (value !== "ok") {
        throw new Error("localStorage did not persist the probe value.");
      }
      return "probe value persisted";
    });

    await runCheck("Theme toggle works", async () => {
      const before = doc.documentElement.dataset.theme;
      const button = query(doc, "[data-testid='theme-toggle']");
      button.click();
      await wait(80);
      const after = doc.documentElement.dataset.theme;
      if (!after || before === after) {
        throw new Error("Theme did not change.");
      }
      return `${before || "unset"} -> ${after}`;
    });

    await runCheck("Language toggle works", async () => {
      const before = doc.documentElement.dataset.lang;
      const button = query(doc, "[data-testid='language-toggle']");
      button.click();
      await wait(80);
      const after = doc.documentElement.dataset.lang;
      if (!after || before === after) {
        throw new Error("Language did not change.");
      }
      return `${before || "unset"} -> ${after}`;
    });

    await runCheck("A/B/C level cards exist", () => {
      ["A", "B", "C"].forEach((level) => {
        query(doc, `[data-testid='level-card-${level}']`);
      });
      return "all level cards found";
    });

    await runCheck("Module matrix region exists", () => {
      query(doc, "[data-testid='module-matrix']");
      query(doc, "[data-testid='module-matrix-preview']");
      query(doc, "[data-testid='status-legend']");
      return "matrix preview and legend found";
    });

    await runCheck("Theme and language buttons exist", () => {
      query(doc, "[data-testid='theme-toggle']");
      query(doc, "[data-testid='language-toggle']");
      return "topbar controls found";
    });

    await runCheck("Configuration data is readable", () => {
      const matrix = query(doc, "[data-testid='module-matrix']");
      const source = matrix.getAttribute("data-config-source") || "";
      query(doc, "[data-testid='selected-profile']");
      query(doc, "[data-testid='profile-required']");
      query(doc, "[data-testid='profile-recommended']");
      if (!source.includes("projectProfiles") || !source.includes("moduleRegistry")) {
        throw new Error("Config source marker is missing.");
      }
      return source;
    });

    await runCheck("Copy button works", async () => {
      const button = query(doc, "[data-testid='copy-button']");
      frame.focus();
      button.focus();
      button.click();
      await wait(160);
      const state = button.getAttribute("data-copy-state");
      if (state === "error") {
        throw new Error("Copy button reported an error.");
      }
      return `state: ${state || "idle"}`;
    });

    await runCheck("Download button works", async () => {
      const button = query(doc, "[data-testid='download-button']");
      button.click();
      await wait(80);
      const state = button.getAttribute("data-download-state");
      if (state !== "success") {
        throw new Error("Download button did not report success.");
      }
      return "download action triggered";
    });

    await runCheck("Critical DOM regions exist", () => {
      [
        "[data-testid='top-nav']",
        "[data-testid='hero']",
        "[data-testid='levels-section']",
        "[data-testid='module-matrix']",
        "[data-testid='module-matrix-preview']",
        "[data-testid='selected-profile']",
        "[data-testid='example-tools']",
        "[data-testid='settings-section']",
        "[data-testid='empty-state']",
        "[data-testid='error-state']",
      ].forEach((selector) => query(doc, selector));
      return "all key regions found";
    });
  }

  function start() {
    results.textContent = "";
    run();
  }

  frame.addEventListener("load", start);

  if (frame.contentDocument?.readyState === "complete") {
    start();
  }
})();
