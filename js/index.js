// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Ensure the body is visible once DOM is ready (if hidden by CSS)
  document.body.style.display = "block";

  // Get DOM elements
  const form = document.getElementById("username-form");
  const input = document.getElementById("username-validation-field");
  const inputContainer = document.getElementById("username-input-container");
  const leagueMenu = document.getElementById("league-menu-container");

  // Check for missing DOM elements
  if (!form || !input || !inputContainer || !leagueMenu) {
    console.error("Required DOM elements are missing. Please check the HTML.");
    return;
  }

  // Check if username exists in localStorage
  const existingUsername = localStorage.getItem("username");
  if (existingUsername) {
    // Skip username entry and show the league menu
    inputContainer.style.display = "none";
    leagueMenu.style.display = "flex";
  }

  // Handle username form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent full page reload

    const username = input.value.trim();

    // Validate entered username
    if (username.length === 0) {
      alert("Please enter a valid username!");
      return;
    }

    // Store username in localStorage for persistence
    localStorage.setItem("username", username);

    // Hide the input and reveal the league menu
    inputContainer.style.display = "none";
    leagueMenu.style.display = "flex";
  });
});
