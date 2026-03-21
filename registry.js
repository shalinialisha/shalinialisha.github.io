/**
 * SHALIpedia Link Registry
 * Central data structure powering all page connections and navigation.
 * Must be loaded before engine.js and search.js.
 */
const SHALIpedia = {
    pages: {
      "ultimate-consequences": {
        title: "Ultimate Consequences Project",
        path: "pages/research-experience/ultimate-consequences.html",
        category: "Research Experience",
        showOnHomepage: true,
        description: "",
        linksTo: ["political-science", "technical-skills"],
        infobox: { type: "project", fields: {} }
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
        linksTo: [],
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
        showOnHomepage: false,
        description: "",
        linksTo: [],
        infobox: { type: "topic", fields: {} }
      },
      "literature": {
        title: "Literature",
        path: "pages/literature.html",
        category: "Topics",
        showOnHomepage: false,
        description: "",
        linksTo: [],
        infobox: { type: "topic", fields: {} }
      }
    },
  
    /**
     * Returns array of page IDs that link to the given pageId.
     * Powers the "What links here" sidebar feature.
     */
    getBacklinks: function (pageId) {
      var results = [];
      var ids = Object.keys(this.pages);
      for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        if (this.pages[id].linksTo.indexOf(pageId) !== -1) {
          results.push(id);
        }
      }
      return results;
    },
  
    /**
     * Returns array of {id, ...pageData} for all pages in the given category.
     */
    getByCategory: function (category) {
      var results = [];
      var ids = Object.keys(this.pages);
      for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        var page = this.pages[id];
        if (page.category === category) {
          var entry = { id: id };
          var keys = Object.keys(page);
          for (var j = 0; j < keys.length; j++) {
            entry[keys[j]] = page[keys[j]];
          }
          results.push(entry);
        }
      }
      return results;
    },
  
    /**
     * Returns pages grouped by category, filtered to showOnHomepage: true.
     * Result shape: { "Category Name": [{id, ...pageData}, ...], ... }
     */
    getHomepagePages: function () {
      var grouped = {};
      var ids = Object.keys(this.pages);
      for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        var page = this.pages[id];
        if (!page.showOnHomepage) continue;
        var cat = page.category;
        if (!grouped[cat]) grouped[cat] = [];
        var entry = { id: id };
        var keys = Object.keys(page);
        for (var j = 0; j < keys.length; j++) {
          entry[keys[j]] = page[keys[j]];
        }
        grouped[cat].push(entry);
      }
      return grouped;
    },
  
    /**
     * Returns true if a page with the given ID exists in the registry.
     * Used for blue vs red link styling.
     */
    pageExists: function (pageId) {
      return this.pages.hasOwnProperty(pageId);
    },
  
    /**
     * Returns array of unique category strings.
     */
    getCategories: function () {
      var seen = {};
      var categories = [];
      var ids = Object.keys(this.pages);
      for (var i = 0; i < ids.length; i++) {
        var cat = this.pages[ids[i]].category;
        if (!seen[cat]) {
          seen[cat] = true;
          categories.push(cat);
        }
      }
      return categories;
    },
  
    /**
     * Case-insensitive substring search on title and description.
     * Returns up to 8 results as {id, title, category, path},
     * sorted with title matches first, then description matches.
     */
    search: function (query) {
      if (!query) return [];
      var q = query.toLowerCase();
      var titleMatches = [];
      var descMatches = [];
      var ids = Object.keys(this.pages);
  
      for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        var page = this.pages[id];
        var result = { id: id, title: page.title, category: page.category, path: page.path };
        var titleLower = page.title.toLowerCase();
        var descLower = (page.description || "").toLowerCase();
  
        if (titleLower.indexOf(q) !== -1) {
          titleMatches.push(result);
        } else if (descLower.indexOf(q) !== -1) {
          descMatches.push(result);
        }
      }
  
      return titleMatches.concat(descMatches).slice(0, 8);
    },
  
    /**
     * Returns the page object for a given ID, or null if not found.
     */
    getPage: function (pageId) {
      return this.pages[pageId] || null;
    },
  
    /**
     * Returns array of all page IDs.
     */
    getAllPageIds: function () {
      return Object.keys(this.pages);
    },
  
    /**
     * Returns true if the page has an empty linksTo array.
     * Used to determine whether to show a "return to home" button.
     */
    isEndNode: function (pageId) {
      var page = this.pages[pageId];
      if (!page) return false;
      return page.linksTo.length === 0;
    },
  
    /**
     * Computes the correct relative path from one page to another
     * based on their directory depths. Critical for cross-directory navigation.
     *
     * Example: from "pages/research-experience/foo.html" to "pages/technical-skills.html"
     *          yields "../../pages/technical-skills.html" (go up 2 levels from the file's dir)
     */
    resolveRelativePath: function (fromPageId, toPageId) {
      var fromPage = this.pages[fromPageId];
      var toPage = this.pages[toPageId];
      if (!fromPage || !toPage) return null;
  
      var fromParts = fromPage.path.split("/");
      var toParts = toPage.path.split("/");
  
      // Remove the filename to get the directory segments
      var fromDir = fromParts.slice(0, fromParts.length - 1);
      var toDir = toParts.slice(0, toParts.length - 1);
  
      // Find common prefix length
      var common = 0;
      while (common < fromDir.length && common < toDir.length && fromDir[common] === toDir[common]) {
        common++;
      }
  
      // Go up from fromDir to common ancestor
      var ups = fromDir.length - common;
      var prefix = "";
      for (var i = 0; i < ups; i++) {
        prefix += "../";
      }
  
      // Then go down to the target
      var remainingPath = toParts.slice(common).join("/");
      return prefix + remainingPath;
    }
  };