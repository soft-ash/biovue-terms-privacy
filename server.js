const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const API_URL =
  process.env.POLICY_API_URL ||
  "https://api.biovuedigitalwellness.com/api/v1/privacy-policy";

app.use(express.static("public"));

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatContent(value = "") {
  return escapeHtml(value)
    .replace(/ - /g, "\n- ")
    .replace(/: - /g, ":\n- ");
}

function renderPage({ pageTitle, subtitle, policy }) {
  const sections = Array.isArray(policy.content) ? policy.content : [];

  const sectionHtml = sections
    .map((section) => {
      return `
        <section class="policy-section">
          <h2>${escapeHtml(section.heading || "")}</h2>
          <p>${formatContent(section.content || "")}</p>
        </section>
      `;
    })
    .join("");

  const lastUpdated = policy.updated_at
    ? new Date(policy.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${escapeHtml(pageTitle)} | BioVue Digital Wellness</title>
  <meta name="description" content="${escapeHtml(pageTitle)} for BioVue Digital Wellness" />

  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <header class="hero">
    <div class="hero-content">
      <p class="eyebrow">BioVue Digital Wellness</p>
      <h1>${escapeHtml(pageTitle)}</h1>
      <p class="subtitle">${escapeHtml(subtitle)}</p>
    </div>
  </header>

  <main class="container">
    <article class="card">
      <div class="top-row">
        <div>
          <h2 class="document-title">${escapeHtml(policy.title || pageTitle)}</h2>
          <p class="updated">Last updated: ${escapeHtml(lastUpdated)}</p>
        </div>
        <nav class="nav-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </div>

      ${sectionHtml}
    </article>
  </main>

  <footer class="footer">
    © ${new Date().getFullYear()} BioVue Digital Wellness. All rights reserved.
  </footer>
</body>
</html>`;
}

async function getPolicy() {
  const response = await fetch(API_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Policy API failed with status ${response.status}`);
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error("Invalid policy API response");
  }

  return result.data;
}

async function policyRoute(req, res, pageType) {
  try {
    const policy = await getPolicy();
    const isTerms = pageType === "terms";

    res.send(
      renderPage({
        pageTitle: isTerms ? "Terms of Service" : "Privacy Policy",
        subtitle: isTerms
          ? "Terms and conditions for using BioVue services."
          : "How BioVue collects, uses, stores, and protects your information.",
        policy,
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BioVue Policy</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <main class="container">
    <article class="card error-card">
      <h1>Unable to load this page</h1>
      <p>Please try again later or contact <a href="mailto:BioVueSupport@gmail.com">BioVueSupport@gmail.com</a>.</p>
    </article>
  </main>
</body>
</html>`);
  }
}

app.get("/", (req, res) => {
  res.redirect("/privacy");
});

app.get("/privacy", (req, res) => {
  policyRoute(req, res, "privacy");
});

app.get("/privacy-policy", (req, res) => {
  policyRoute(req, res, "privacy");
});

app.get("/terms", (req, res) => {
  policyRoute(req, res, "terms");
});

app.get("/terms-of-service", (req, res) => {
  policyRoute(req, res, "terms");
});

app.listen(PORT, () => {
  console.log(`BioVue policy app running on port ${PORT}`);
});
