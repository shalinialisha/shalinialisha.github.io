# Shali Pedia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Wikipedia-clone portfolio site ("Shali Pedia") with interconnected pages, backlinks, search, and faithful Wikipedia styling.

**Architecture:** Static HTML/CSS/JS site. A central link registry (`js/registry.js`) defines all pages and their connections. At page load, `js/engine.js` reads the registry to render the sidebar, search, TOC, "See also", "What links here", and backlinks. Each page is a standalone HTML file with placeholder sections for the user to fill in.

**Tech Stack:** Vanilla HTML, CSS, JavaScript. No build tools. Hosted on GitHub Pages.

---

## File Structure

```
shali-pedia/
├── index.html                              # Main portal page (Wikipedia-style front page)
├── css/
│   └── wikipedia.css                       # Wikipedia-faithful stylesheet
├── js/
│   ├── registry.js                         # Central link registry: all pages, connections, metadata
│   ├── engine.js                           # Sidebar, TOC, search, "See also", "What links here" logic
│   └── search.js                           # Search bar dropdown with fuzzy matching
├── pages/
│   ├── research-experience/
│   │   ├── ultimate-consequences.html
│   │   ├── prism-lab.html
│   │   ├── future-of-free-speech.html
│   │   └── abc-musicians.html
│   ├── personal-projects/
│   │   ├── executive-orders-simplified.html
│   │   ├── ai-for-all.html
│   │   └── twitter-hate-speech-detector.html
│   ├── professional-experience/
│   │   ├── adobe-employee.html
│   │   ├── adobe-intern.html
│   │   └── grader-for-python.html
│   ├── technical-skills.html
│   ├── fellowships-and-awards.html
│   ├── leadership-and-affiliations.html
│   ├── research-interests.html
│   ├── community-involvement.html
│   ├── political-science.html              # Hidden from homepage, linked from other pages
│   └── literature.html                     # Hidden from homepage, linked from other pages
└── images/                                 # Placeholder for future images
    └── logo.png                            # Shali Pedia logo
```

---

### Task 1: Project Scaffolding and CSS

**Files:**
- Create: `css/wikipedia.css`
- Create: `images/` directory

- [ ] **Step 1: Create directory structure**

```bash
cd /Users/sthinakaran/Desktop/projects/shali-pedia
mkdir -p css js pages/research-experience pages/personal-projects pages/professional-experience images
```

- [ ] **Step 2: Write Wikipedia-faithful CSS**

Create `css/wikipedia.css` — a faithful replica of Wikipedia's visual style:

- Body: `font-family: 'Linux Libertine', 'Georgia', 'Times', serif` for headings, sans-serif (`sans-serif, Helvetica, Arial`) for body
- Color scheme: `#f6f6f6` background for sidebar, `#ffffff` content area, `#a7d7f9` for logo area, `#0645ad` for links, `#ba0000` for red links (missing pages)
- Left sidebar: 160px fixed width, with collapsible nav sections
- Content area: fluid, left margin for sidebar
- Infobox: right-floated table, 22em width, border `#a2a9b1`, header bg `#ccccff`
- TOC: bordered box, bg `#f8f9fa`, auto-numbered
- Headings: h1 has bottom border `#a2a9b1`, h2 has bottom border, h3-h6 no border
- Search bar: in sidebar, with magnifying glass icon (CSS-only)
- References: superscript `[1]` style links, footnote section at bottom
- Categories bar: bottom of page, gray background
- "See also" and "What links here" sections styled as standard Wikipedia sections
- Responsive: sidebar collapses to hamburger menu below 768px
- Print styles: hide sidebar and nav

- [ ] **Step 3: Create a simple SVG logo placeholder**

Create a text-based SVG at `images/logo.svg` with "SHALI PEDIA" in Wikipedia's globe style (simplified).

- [ ] **Step 4: Commit**

```bash
git init
git add css/ images/
git commit -m "feat: add Wikipedia-faithful CSS and project structure"
```

---

### Task 2: Link Registry (`js/registry.js`)

**Files:**
- Create: `js/registry.js`

This is the core data structure that powers all connections. Every page is registered here with its metadata and links.

- [ ] **Step 1: Write the registry**

`js/registry.js` exports a `PAGES` object and helper functions. Structure:

```javascript
const SHALIpedia = {
  pages: {
    "ultimate-consequences": {
      title: "Ultimate Consequences Project",
      path: "pages/research-experience/ultimate-consequences.html",
      category: "Research Experience",
      showOnHomepage: true,
      description: "", // User fills this in
      linksTo: ["political-science", "technical-skills"],
      // backlinksFrom is auto-computed, not manually set
      infobox: {
        type: "project", // project | experience | skills | topic
        fields: {} // user fills in
      }
    },
    "prism-lab": {
      title: "PRISM Lab",
      path: "pages/research-experience/prism-lab.html",
      category: "Research Experience",
      showOnHomepage: true,
      description: "",
      linksTo: ["community-involvement", "technical-skills"],
      infobox: { type: "project", fields: {} }
    },
    "future-of-free-speech": {
      title: "Future of Free Speech Project",
      path: "pages/research-experience/future-of-free-speech.html",
      category: "Research Experience",
      showOnHomepage: true,
      description: "",
      linksTo: ["technical-skills"],
      infobox: { type: "project", fields: {} }
    },
    "abc-musicians": {
      title: "ABC Musicians Project",
      path: "pages/research-experience/abc-musicians.html",
      category: "Research Experience",
      showOnHomepage: true,
      description: "",
      linksTo: [],
      infobox: { type: "project", fields: {} }
    },
    "executive-orders-simplified": {
      title: "Executive Orders Simplified",
      path: "pages/personal-projects/executive-orders-simplified.html",
      category: "Personal Projects",
      showOnHomepage: true,
      description: "",
      linksTo: ["political-science", "technical-skills"],
      infobox: { type: "project", fields: {} }
    },
    "ai-for-all": {
      title: "AI for All",
      path: "pages/personal-projects/ai-for-all.html",
      category: "Personal Projects",
      showOnHomepage: true,
      description: "",
      linksTo: ["literature", "political-science", "technical-skills"],
      infobox: { type: "project", fields: {} }
    },
    "twitter-hate-speech-detector": {
      title: "Twitter Hate Speech Detector",
      path: "pages/personal-projects/twitter-hate-speech-detector.html",
      category: "Personal Projects",
      showOnHomepage: true,
      description: "",
      linksTo: [],
      infobox: { type: "project", fields: {} }
    },
    "adobe-employee": {
      title: "Adobe Employee",
      path: "pages/professional-experience/adobe-employee.html",
      category: "Professional Experience",
      showOnHomepage: true,
      description: "",
      linksTo: ["community-involvement", "technical-skills"],
      infobox: { type: "experience", fields: {} }
    },
    "adobe-intern": {
      title: "Adobe Intern",
      path: "pages/professional-experience/adobe-intern.html",
      category: "Professional Experience",
      showOnHomepage: true,
      description: "",
      linksTo: ["technical-skills"],
      infobox: { type: "experience", fields: {} }
    },
    "grader-for-python": {
      title: "Grader for Python",
      path: "pages/professional-experience/grader-for-python.html",
      category: "Professional Experience",
      showOnHomepage: true,
      description: "",
      linksTo: ["technical-skills"],
      infobox: { type: "experience", fields: {} }
    },
    "technical-skills": {
      title: "Technical Skills",
      path: "pages/technical-skills.html",
      category: "Skills & Qualifications",
      showOnHomepage: true,
      description: "",
      linksTo: [], // External Wikipedia links handled in page HTML
      infobox: { type: "skills", fields: {} }
    },
    "fellowships-and-awards": {
      title: "Fellowships and Awards",
      path: "pages/fellowships-and-awards.html",
      category: "Skills & Qualifications",
      showOnHomepage: true,
      description: "",
      linksTo: ["technical-skills"],
      infobox: { type: "skills", fields: {} }
    },
    "leadership-and-affiliations": {
      title: "Leadership & Professional Affiliations",
      path: "pages/leadership-and-affiliations.html",
      category: "Skills & Qualifications",
      showOnHomepage: true,
      description: "",
      linksTo: ["technical-skills"],
      infobox: { type: "skills", fields: {} }
    },
    "research-interests": {
      title: "Research Interests",
      path: "pages/research-interests.html",
      category: "Skills & Qualifications",
      showOnHomepage: true,
      description: "",
      linksTo: ["technical-skills"],
      infobox: { type: "topic", fields: {} }
    },
    "community-involvement": {
      title: "Community Involvement",
      path: "pages/community-involvement.html",
      category: "Community",
      showOnHomepage: true,
      description: "",
      linksTo: [],
      infobox: { type: "topic", fields: {} }
    },
    "political-science": {
      title: "Political Science",
      path: "pages/political-science.html",
      category: "Topics",
      showOnHomepage: false,  // Hidden — only reachable from links
      description: "",
      linksTo: [],
      infobox: { type: "topic", fields: {} }
    },
    "literature": {
      title: "Literature",
      path: "pages/literature.html",
      category: "Topics",
      showOnHomepage: false,  // Hidden — only reachable from links
      description: "",
      linksTo: [],
      infobox: { type: "topic", fields: {} }
    }
  },

  // --- Algorithm functions ---

  // Compute backlinks: which pages link TO a given page
  getBacklinks(pageId) { ... },

  // Get all pages in a category
  getByCategory(category) { ... },

  // Get homepage-visible pages grouped by category
  getHomepagePages() { ... },

  // Check if a page exists (for blue vs red link styling)
  pageExists(pageId) { ... },

  // Get all categories
  getCategories() { ... },

  // Search pages by title/description (used by search bar)
  search(query) { ... }
};
```

- [ ] **Step 2: Verify the link graph is correct**

Manually trace each connection from the user's spec:
- Ultimate Consequences → political-science, technical-skills ✓
- PRISM Lab → community-involvement, technical-skills ✓
- Future of Free Speech → technical-skills ✓
- ABC Musicians → (end node) ✓
- Executive Orders → political-science, technical-skills ✓
- AI for All → literature, political-science, technical-skills ✓
- Twitter Hate Speech → (end node) ✓
- Adobe Employee → community-involvement, technical-skills ✓
- Adobe Intern → technical-skills ✓
- Grader for Python → technical-skills ✓
- Technical Skills → external Wikipedia links (in HTML, not registry) ✓
- Fellowships → technical-skills ✓
- Leadership → technical-skills ✓
- Research Interests → technical-skills ✓
- Community Involvement → (end node) ✓
- Political Science → (end node, hidden) ✓
- Literature → (end node, hidden) ✓

- [ ] **Step 3: Commit**

```bash
git add js/registry.js
git commit -m "feat: add central link registry with all pages and connections"
```

---

### Task 3: Page Engine (`js/engine.js`)

**Files:**
- Create: `js/engine.js`

This is the "Wikipedia algorithm" — it reads the registry and the current page's `data-page-id` attribute, then renders all dynamic sections.

- [ ] **Step 1: Write engine.js**

The engine runs on every page load (`DOMContentLoaded`). It:

1. **Reads `data-page-id`** from `<body>` to identify the current page
2. **Renders the left sidebar:**
   - Logo linking to index.html
   - "Main page" link
   - "Contents" link (all pages grouped by category)
   - "Random page" link (picks random from registry)
   - Search bar (delegates to search.js)
   - "What links here" for current page (computed backlinks)
3. **Generates Table of Contents** from all `<h2>` and `<h3>` on the page, auto-numbered
4. **Renders "See also" section** from `linksTo` in registry — internal links styled as blue Wikipedia links
5. **Renders "What links here" section** using `getBacklinks()` — shows all pages that link to this page
6. **Renders "Categories" bar** at the bottom from the page's category
7. **Styles internal links:** scans all `<a data-page="...">` links in the content, makes them blue if page exists, red if not
8. **End-node detection:** if a page has no outgoing `linksTo` AND no backlinks besides the homepage, show a "Return to main page" button
9. **Relative path resolution:** since pages are at different directory depths, compute correct relative paths for all links

- [ ] **Step 2: Commit**

```bash
git add js/engine.js
git commit -m "feat: add page engine for sidebar, TOC, backlinks, and link styling"
```

---

### Task 4: Search (`js/search.js`)

**Files:**
- Create: `js/search.js`

- [ ] **Step 1: Write search.js**

Search functionality:
- Listens to input on the search bar in the sidebar
- On each keystroke, calls `SHALIpedia.search(query)` which does case-insensitive substring matching on title and description
- Renders a dropdown below the search bar with matching results (max 8)
- Each result shows page title and category
- Clicking a result navigates to that page
- Enter key navigates to the top result
- Escape key closes the dropdown
- If no results, shows "No results found"

- [ ] **Step 2: Commit**

```bash
git add js/search.js
git commit -m "feat: add search with typeahead dropdown"
```

---

### Task 5: Page Template and All Pages

**Files:**
- Create: all 17 HTML files in `pages/`

- [ ] **Step 1: Create the base page template**

Every page follows this HTML structure (Wikipedia-faithful):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAGE TITLE - Shali Pedia</title>
  <link rel="stylesheet" href="RELATIVE_PATH/css/wikipedia.css">
</head>
<body data-page-id="PAGE_ID">

  <!-- LEFT SIDEBAR (rendered by engine.js) -->
  <div id="mw-panel" class="sidebar"></div>

  <!-- MAIN CONTENT AREA -->
  <div id="content" class="mw-body">

    <!-- PAGE HEADER -->
    <h1 id="firstHeading" class="firstHeading">PAGE TITLE</h1>
    <div id="siteSub">From Shali Pedia, the personal encyclopedia</div>

    <!-- INFOBOX: Edit your project details here -->
    <table class="infobox">
      <caption class="infobox-title">PAGE TITLE</caption>
      <tbody>
        <!-- <tr><td class="infobox-image" colspan="2"><img src="" alt=""></td></tr> -->
        <tr><th>Field</th><td>Value</td></tr>
        <!-- Add more rows as needed -->
      </tbody>
    </table>

    <!-- OVERVIEW: Write your introduction paragraph here -->
    <p class="overview">
      <!-- Your introduction goes here. This appears before the TOC. -->
    </p>

    <!-- TABLE OF CONTENTS (auto-generated by engine.js) -->
    <div id="toc" class="toc"></div>

    <!-- SECTION: Background -->
    <h2><span class="mw-headline" id="Background">Background</span></h2>
    <p><!-- Write background here --></p>

    <!-- SECTION: Details -->
    <h2><span class="mw-headline" id="Details">Details</span></h2>
    <p><!-- Write details here --></p>

    <!-- SECTION: Results / Impact -->
    <h2><span class="mw-headline" id="Results">Results</span></h2>
    <p><!-- Write results here --></p>

    <!-- SEE ALSO (auto-generated by engine.js) -->
    <div id="see-also"></div>

    <!-- WHAT LINKS HERE (auto-generated by engine.js) -->
    <div id="what-links-here"></div>

    <!-- REFERENCES -->
    <h2><span class="mw-headline" id="References">References</span></h2>
    <ol class="references">
      <!--
        Add references like this:
        <li id="ref-1"><a href="URL">Source Title</a>. Description. Retrieved DATE.</li>
      -->
    </ol>

    <!-- CATEGORIES (auto-generated by engine.js) -->
    <div id="catlinks" class="catlinks"></div>
  </div>

  <script src="RELATIVE_PATH/js/registry.js"></script>
  <script src="RELATIVE_PATH/js/engine.js"></script>
  <script src="RELATIVE_PATH/js/search.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create all page HTML files**

Create each page from the template, customizing:
- `data-page-id` matches the registry key
- `<title>` and `<h1>` match the page title
- Relative paths adjusted for directory depth (`../../` for pages in subdirectories, `../` for pages directly in `pages/`)
- Infobox fields tailored to page type:
  - **Project pages** (research/personal): Type, Duration, Affiliation, Skills Used, Status
  - **Experience pages**: Role, Organization, Duration, Location, Skills Used
  - **Skills/Awards pages**: no infobox (content is the list itself)
  - **Topic pages** (political-science, literature): brief infobox with Field, Relevance
- Section headings tailored to page type:
  - **Projects**: Background, Methodology, Results, Impact
  - **Experience**: Role, Responsibilities, Projects, Impact
  - **Skills**: (no sections — rendered as a categorized list with external Wikipedia links)
  - **Topics**: Overview, Relevance to Portfolio
- Internal links in body text use `<a data-page="page-id">` syntax so engine.js can style them
- End-node pages (ABC Musicians, Twitter Hate Speech, Community Involvement, Political Science, Literature) get a `<div id="return-home"></div>` placeholder

Pages to create (17 total):
1. `pages/research-experience/ultimate-consequences.html`
2. `pages/research-experience/prism-lab.html`
3. `pages/research-experience/future-of-free-speech.html`
4. `pages/research-experience/abc-musicians.html`
5. `pages/personal-projects/executive-orders-simplified.html`
6. `pages/personal-projects/ai-for-all.html`
7. `pages/personal-projects/twitter-hate-speech-detector.html`
8. `pages/professional-experience/adobe-employee.html`
9. `pages/professional-experience/adobe-intern.html`
10. `pages/professional-experience/grader-for-python.html`
11. `pages/technical-skills.html`
12. `pages/fellowships-and-awards.html`
13. `pages/leadership-and-affiliations.html`
14. `pages/research-interests.html`
15. `pages/community-involvement.html`
16. `pages/political-science.html`
17. `pages/literature.html`

- [ ] **Step 3: Commit**

```bash
git add pages/
git commit -m "feat: add all 17 portfolio pages with placeholder content"
```

---

### Task 6: Main Page (`index.html`)

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the Wikipedia-style main page**

The main page mimics Wikipedia's portal layout:

- **Header:** "Welcome to Shali Pedia" in large text, subtitle "The personal encyclopedia"
- **Left sidebar:** same as all pages (rendered by engine.js), with search
- **Featured content area:** grouped by category, each category is a bordered box:
  - **Research Experience** — lists all research pages with title + short description
  - **Personal Projects** — lists all personal project pages
  - **Professional Experience** — lists all professional experience pages
  - **Skills & Qualifications** — Technical Skills, Fellowships, Leadership, Research Interests
  - **Community** — Community Involvement
- Each entry links to its page
- "Did you know?" box (optional fun facts placeholder)
- Statistics bar at bottom: "Shali Pedia has X articles"
- Political Science and Literature are NOT listed (showOnHomepage: false)

The homepage reads from the registry to auto-generate these sections, so adding a new page to the registry automatically adds it to the homepage.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add Wikipedia-style main portal page"
```

---

### Task 7: Integration Testing and Polish

- [ ] **Step 1: Open index.html in browser and verify**

Check:
- Homepage loads with all categories and pages listed
- Political Science and Literature are NOT on homepage
- Clicking a page navigates correctly
- Sidebar renders on every page with working navigation
- Search bar finds pages by title
- TOC generates correctly from headings
- "See also" shows correct outgoing links
- "What links here" shows correct backlinks
- Internal links are blue, any missing pages are red
- End-node pages show "Return to main page"
- Responsive: sidebar collapses on mobile

- [ ] **Step 2: Fix any path issues**

Relative paths are the most common issue with static sites. Verify all CSS/JS loads at every directory depth.

- [ ] **Step 3: Add .nojekyll file for GitHub Pages**

```bash
touch .nojekyll
```

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete Shali Pedia — Wikipedia-style portfolio site"
```

---

### Task 8: GitHub Pages Setup

- [ ] **Step 1: Create GitHub repository**

```bash
cd /Users/sthinakaran/Desktop/projects/shali-pedia
gh repo create shali-pedia --public --source=. --push
```

- [ ] **Step 2: Enable GitHub Pages**

```bash
gh api repos/{owner}/shali-pedia/pages -X POST -f source.branch=main -f source.path=/
```

- [ ] **Step 3: Verify deployment**

Check the GitHub Pages URL is live and all pages work.
