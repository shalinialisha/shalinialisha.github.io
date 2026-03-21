/**
 * SHALIpedia Page Engine
 * Reads the registry and current page's data-page-id, then renders
 * all dynamic sections: sidebar, TOC, see-also, backlinks, categories, and link styling.
 * Must be loaded after registry.js and before search.js.
 */
(function () {
    "use strict";
  
    document.addEventListener("DOMContentLoaded", function () {
      var pageId = document.body.getAttribute("data-page-id") || null;
      var page = pageId ? SHALIpedia.getPage(pageId) : null;
  
      // Compute base path from current page to site root
      var basePath = getBasePath(pageId);
  
      renderSidebar(pageId, page, basePath);
      if (pageId && page) {
        renderBreadcrumb(pageId, page, basePath);
        renderTOC();
        renderSeeAlso(pageId, page, basePath);
        renderWhatLinksHere(pageId, basePath);
        renderCategories(page);
        renderEndNode(pageId, basePath);
      }
      styleInternalLinks(pageId, basePath);
    });
  
    /**
     * Computes the relative path prefix from the current page to the site root.
     * Uses the page's path from the registry to determine directory depth.
     */
    function getBasePath(pageId) {
      if (!pageId) return "";
      var page = SHALIpedia.getPage(pageId);
      if (!page) return "";
  
      var parts = page.path.split("/");
      // Remove the filename; remaining parts are directory segments
      var dirDepth = parts.length - 1;
      var prefix = "";
      for (var i = 0; i < dirDepth; i++) {
        prefix += "../";
      }
      return prefix;
    }
  
    /**
     * Renders the left sidebar into #mw-panel.sidebar.
     */
    function renderSidebar(pageId, page, basePath) {
      var sidebar = document.getElementById("mw-panel");
      if (!sidebar) return;
  
      var html = "";
  
      // Logo
      html += '<a class="sidebar-logo" href="' + basePath + 'index.html">';
      html += '<img src="' + basePath + 'images/logo.svg" alt="SHALIpedia">';
      html += '<span class="logo-text">SHALIpedia</span>';
      html += '<span class="logo-tagline">The Free Portfolio</span>';
      html += "</a>";
  
      // Navigation section
      html += '<nav class="sidebar-nav">';
  
      // Main navigation portal
      html += '<div class="portal">';
      html += "<h3>Navigation</h3>";
      html += '<div class="body"><ul>';
      html += '<li><a href="' + basePath + 'index.html">Main page</a></li>';
      html += '<li><a href="' + basePath + 'index.html#contents">Contents</a></li>';
      html += '<li><a href="#" id="random-page-link">Random page</a></li>';
      html += "</ul></div></div>";
  
      // Search bar container (search.js handles logic)
      html += '<div class="search-container">';
      html += '<input type="text" class="search-input" id="search-input" placeholder="Search SHALIpedia" autocomplete="off">';
      html += '<div class="search-results" id="search-results"></div>';
      html += "</div>";
  
      // Tools section (only on specific pages)
      if (pageId && page) {
        var backlinks = SHALIpedia.getBacklinks(pageId);
        html += '<div class="portal">';
        html += "<h3>Tools</h3>";
        html += '<div class="body"><ul>';
        html += '<li style="padding: 4px 8px 4px 16px;">What links here (' + backlinks.length + ')</li>';
        html += "</ul></div></div>";
      }
  
      html += "</nav>";
  
      sidebar.innerHTML = html;
  
      // Random page handler
      var randomLink = document.getElementById("random-page-link");
      if (randomLink) {
        randomLink.addEventListener("click", function (e) {
          e.preventDefault();
          var allIds = SHALIpedia.getAllPageIds();
          if (allIds.length === 0) return;
          var randomId = allIds[Math.floor(Math.random() * allIds.length)];
          var randomPage = SHALIpedia.getPage(randomId);
          if (randomPage) {
            window.location.href = basePath + randomPage.path;
          }
        });
      }
  
      // Portal collapse/expand toggle
      var portalHeadings = sidebar.querySelectorAll(".portal h3");
      for (var i = 0; i < portalHeadings.length; i++) {
        portalHeadings[i].addEventListener("click", function () {
          this.parentElement.classList.toggle("collapsed");
        });
      }
    }
  
    /**
     * Generates Table of Contents into #toc.toc.
     * Scans h2 and h3 elements with .mw-headline spans.
     */
    function renderTOC() {
      var tocContainer = document.getElementById("toc");
      if (!tocContainer) return;
  
      var headings = document.querySelectorAll("h2 .mw-headline, h3 .mw-headline");
      if (headings.length < 3) return;
  
      var tocHTML = '<div class="toctitle">';
      tocHTML += "<h2>Contents</h2>";
      tocHTML += ' <span class="toctoggle">[<a href="#" id="toc-toggle">hide</a>]</span>';
      tocHTML += "</div>";
      tocHTML += '<ul id="toc-list">';
  
      var h2Count = 0;
      var h3Count = 0;
  
      for (var i = 0; i < headings.length; i++) {
        var headline = headings[i];
        var parentTag = headline.parentElement.tagName.toUpperCase();
        var id = headline.parentElement.id || headline.id || "";
  
        // Ensure the heading has an id for anchor linking
        if (!id) {
          id = "heading-" + i;
          headline.parentElement.id = id;
        }
  
        var text = headline.textContent;
  
        if (parentTag === "H2") {
          // Close any open sub-list
          if (h3Count > 0) {
            tocHTML += "</ul></li>";
          }
          h2Count++;
          h3Count = 0;
          tocHTML += '<li><span class="tocnumber">' + h2Count + "</span> ";
          tocHTML += '<a href="#' + id + '"><span class="toctext">' + text + "</span></a>";
          // Don't close li yet — there may be sub-items
        } else if (parentTag === "H3") {
          if (h3Count === 0) {
            tocHTML += "<ul>";
          }
          h3Count++;
          tocHTML += '<li><span class="tocnumber">' + h2Count + "." + h3Count + "</span> ";
          tocHTML += '<a href="#' + id + '"><span class="toctext">' + text + "</span></a></li>";
        }
      }
      // Close last open sub-list if any
      if (h3Count > 0) {
        tocHTML += "</ul>";
      }
      // Close last h2 li
      if (h2Count > 0) {
        tocHTML += "</li>";
      }
      tocHTML += "</ul>";
  
      tocContainer.innerHTML = tocHTML;
  
      // Toggle functionality
      var toggleLink = document.getElementById("toc-toggle");
      var tocList = document.getElementById("toc-list");
      if (toggleLink && tocList) {
        toggleLink.addEventListener("click", function (e) {
          e.preventDefault();
          if (tocList.style.display === "none") {
            tocList.style.display = "";
            toggleLink.textContent = "hide";
          } else {
            tocList.style.display = "none";
            toggleLink.textContent = "show";
          }
        });
      }
    }
  
    /**
     * Renders "See also" section into #see-also.
     */
    function renderSeeAlso(pageId, page, basePath) {
      var container = document.getElementById("see-also");
      if (!container) return;
      if (!page.linksTo || page.linksTo.length === 0) return;
  
      var html = '<h2><span class="mw-headline" id="See_also">See also</span></h2>';
      html += "<ul>";
  
      for (var i = 0; i < page.linksTo.length; i++) {
        var targetId = page.linksTo[i];
        var targetPage = SHALIpedia.getPage(targetId);
        var title = targetPage ? targetPage.title : targetId;
        var href = targetPage ? basePath + targetPage.path : "#";
        var cls = SHALIpedia.pageExists(targetId) ? "" : ' class="red-link"';
        html += '<li><a data-page="' + targetId + '" href="' + href + '"' + cls + ">" + title + "</a></li>";
      }
  
      html += "</ul>";
      container.innerHTML = html;
    }
  
    /**
     * Renders "What links here" section into #what-links-here.
     */
    function renderWhatLinksHere(pageId, basePath) {
      var container = document.getElementById("what-links-here");
      if (!container) return;
  
      var backlinks = SHALIpedia.getBacklinks(pageId);
      if (backlinks.length === 0) return;
  
      var html = '<h2><span class="mw-headline" id="What_links_here">What links here</span></h2>';
      html += "<ul>";
  
      for (var i = 0; i < backlinks.length; i++) {
        var linkId = backlinks[i];
        var linkPage = SHALIpedia.getPage(linkId);
        var title = linkPage ? linkPage.title : linkId;
        var href = linkPage ? basePath + linkPage.path : "#";
        html += '<li><a data-page="' + linkId + '" href="' + href + '">' + title + "</a></li>";
      }
  
      html += "</ul>";
      container.innerHTML = html;
    }
  
    /**
     * Renders "Categories" bar into #catlinks.catlinks.
     */
    function renderCategories(page) {
      var container = document.getElementById("catlinks");
      if (!container) return;
      if (!page.category) return;
  
      var html = '<div class="mw-normal-catlinks">';
      html += "<a>Categories</a>";
      html += "<ul><li>" + page.category + "</li></ul>";
      html += "</div>";
  
      container.innerHTML = html;
    }
  
    /**
     * Styles all internal links on the page.
     * Sets href using basePath and marks missing pages with red-link class.
     */
    function styleInternalLinks(pageId, basePath) {
      var links = document.querySelectorAll("a[data-page]");
  
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var targetId = link.getAttribute("data-page");
  
        if (SHALIpedia.pageExists(targetId)) {
          var targetPage = SHALIpedia.getPage(targetId);
          // Use resolveRelativePath if we have a source page, otherwise use basePath
          if (pageId && SHALIpedia.getPage(pageId)) {
            var resolved = SHALIpedia.resolveRelativePath(pageId, targetId);
            if (resolved) {
              link.href = resolved;
            } else {
              link.href = basePath + targetPage.path;
            }
          } else {
            link.href = targetPage.path;
          }
        } else {
          link.classList.add("red-link");
          link.href = "#";
        }
      }
    }
  
    /**
     * Renders breadcrumb navigation above the page title.
     * Shows: Main page > Category > Current page
     */
    function renderBreadcrumb(pageId, page, basePath) {
      var content = document.getElementById("content");
      var firstHeading = document.getElementById("firstHeading");
      if (!content || !firstHeading) return;
  
      var nav = document.createElement("div");
      nav.id = "breadcrumb";
  
      // Main page link
      var homeLink = document.createElement("a");
      homeLink.href = basePath + "index.html";
      homeLink.textContent = "Main page";
      nav.appendChild(homeLink);
  
      // Separator
      var sep1 = document.createElement("span");
      sep1.className = "breadcrumb-sep";
      sep1.textContent = ">";
      nav.appendChild(sep1);
  
      // Category (plain text)
      var catSpan = document.createElement("span");
      catSpan.textContent = page.category;
      nav.appendChild(catSpan);
  
      // Separator
      var sep2 = document.createElement("span");
      sep2.className = "breadcrumb-sep";
      sep2.textContent = ">";
      nav.appendChild(sep2);
  
      // Current page (bold, no link)
      var current = document.createElement("strong");
      current.textContent = page.title;
      nav.appendChild(current);
  
      content.insertBefore(nav, firstHeading);
    }
  
    /**
     * End-node handling: renders a "Return to main page" button into #return-home.
     */
    function renderEndNode(pageId, basePath) {
      if (!SHALIpedia.isEndNode(pageId)) return;
  
      var container = document.getElementById("return-home");
      if (!container) return;
  
      var link = document.createElement("a");
      link.href = basePath + "index.html";
      link.textContent = "\u2190 Return to main page";
      container.appendChild(link);
    }
  })();