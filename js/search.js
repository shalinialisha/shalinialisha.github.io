/**
 * SHALIpedia Search Module
 * Provides typeahead search with dropdown results.
 * Loads after registry.js and engine.js.
 */
(function () {
    "use strict";
  
    document.addEventListener("DOMContentLoaded", function () {
      var searchInput = document.getElementById("search-input");
      if (!searchInput) return;
  
      var searchContainer = searchInput.closest(".search-container");
  
      // Create the results dropdown
      var dropdown = document.createElement("div");
      dropdown.className = "search-results";
      dropdown.style.display = "none";
      searchContainer.appendChild(dropdown);
  
      function getBasePath() {
        var pageId = document.body.dataset.pageId;
        if (!pageId) return "";
        var page = SHALIpedia.pages[pageId];
        if (!page) return "";
        var parts = page.path.split("/");
        var depth = parts.length - 1;
        var base = "";
        for (var i = 0; i < depth; i++) {
          base += "../";
        }
        return base;
      }
  
      function renderResults(results, query) {
        dropdown.innerHTML = "";
  
        if (!query) {
          dropdown.style.display = "none";
          return;
        }
  
        if (results.length === 0) {
          dropdown.style.display = "";
          var noResult = document.createElement("div");
          noResult.className = "search-result-item";
          noResult.textContent = "No results found";
          dropdown.appendChild(noResult);
          return;
        }
  
        dropdown.style.display = "";
        var basePath = getBasePath();
  
        for (var i = 0; i < results.length; i++) {
          var result = results[i];
          var item = document.createElement("div");
          item.className = "search-result-item";
          item.setAttribute("data-path", basePath + result.path);
  
          var titleEl = document.createElement("span");
          titleEl.className = "search-result-title";
          titleEl.textContent = result.title;
  
          var categoryEl = document.createElement("span");
          categoryEl.className = "search-result-category";
          categoryEl.textContent = result.category;
  
          item.appendChild(titleEl);
          item.appendChild(categoryEl);
  
          item.addEventListener("click", (function (path) {
            return function () {
              window.location.href = path;
            };
          })(basePath + result.path));
  
          dropdown.appendChild(item);
        }
      }
  
      searchInput.addEventListener("input", function () {
        var query = searchInput.value.trim();
        var results = SHALIpedia.search(query);
        renderResults(results, query);
      });
  
      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          dropdown.style.display = "none";
          searchInput.blur();
        } else if (e.key === "Enter") {
          var query = searchInput.value.trim();
          var results = SHALIpedia.search(query);
          if (results.length > 0) {
            var basePath = getBasePath();
            window.location.href = basePath + results[0].path;
          }
        }
      });
  
      document.addEventListener("click", function (e) {
        if (!searchContainer.contains(e.target)) {
          dropdown.style.display = "none";
        }
      });
    });
  })();
  
  
  