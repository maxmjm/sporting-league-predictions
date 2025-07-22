/**
 * Navigates user to a specific relative page
 * @param {string} pageName - the target page (e.g., 'nba-regular-season.html')
 */
function navigateToPage(pageName) {
  if (!pageName || typeof pageName !== "string") {
    console.warn("Invalid page name provided!");
    return;
  }
  // Sanitise leading/trailing spaces
  const safePage = pageName.trim();
  window.location.href = `./${safePage}`;
}

/**
 * Shows an alert to inform users a feature is not yet available
 */
function showInDevelopmentAlert() {
  alert(`This feature is currently in development. Check back later!`);
}
