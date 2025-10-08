// src/admin/custom-status-colors.js

function applyBadgeColors() {
  document.querySelectorAll(".adminjs_Badge").forEach((badge) => {
    const text = badge.textContent.trim().toLowerCase(); // normalize to lowercase

    switch (text) {
      case "new fresh lead":
      case "fresh lead":
        badge.style.setProperty("background-color", "#28A745", "important"); // Green
        badge.style.setProperty("color", "#fff", "important");
        break;

      case "not interested":
        badge.style.setProperty("background-color", "#DC3545", "important"); // Red
        badge.style.setProperty("color", "#fff", "important");
        break;

      case "follow scheduled":
      case "follow through":
      case "follow back":
      case "call scheduled":
      case "follow-up scheduled":
        badge.style.setProperty("background-color", "#FD7E14", "important"); // Orange
        badge.style.setProperty("color", "#fff", "important");
        break;

      case "site visit scheduled done":
      case "negotiation booking in progress":
        badge.style.setProperty("background-color", "#FFC107", "important"); // Yellow
        badge.style.setProperty("color", "#000", "important");
        break;

      case "interested warm lead":
        badge.style.setProperty("background-color", "#FFD600", "important"); // Yellow
        badge.style.setProperty("color", "#000", "important");
        break;

      case "no response":
        badge.style.setProperty("background-color", "#A3BE8C", "important"); // Light Green
        badge.style.setProperty("color", "#000", "important");
        break;

      case "closed won":
        badge.style.setProperty("background-color", "#218838", "important"); // Dark Green
        badge.style.setProperty("color", "#fff", "important");
        break;

      case "closed lost":
        badge.style.setProperty("background-color", "#C82333", "important"); // Dark Red
        badge.style.setProperty("color", "#fff", "important");
        break;

      default:
        badge.style.setProperty("background-color", "#6C757D", "important"); // Gray
        badge.style.setProperty("color", "#fff", "important");
    }
  });
}

// Observe AdminJS DOM changes
const targetNode = document.querySelector("body");
const config = { childList: true, subtree: true };
const observer = new MutationObserver(() => applyBadgeColors());
observer.observe(targetNode, config);

// Apply immediately
applyBadgeColors();
