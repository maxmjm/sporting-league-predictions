document.addEventListener("DOMContentLoaded", () => {
  // Reveal body once DOM is fully loaded (originally hidden via CSS)
  document.body.style.display = "block";

  // Get references to DOM elements
  const usernameValidationForm = document.getElementById(
    "username-validation-form"
  );
  const usernameInputField = document.getElementById(
    "username-validation-field"
  );
  const usernameInputContainer = document.getElementById(
    "username-input-container"
  );
  const sportingLeagueSelectionMenuContainer = document.getElementById(
    "sporting-league-selection-menu-container"
  );

  // Check if a username is already stored in localStorage
  const storedUsername = localStorage.getItem("username");
  if (storedUsername) {
    usernameInputContainer.style.display = "none"; // Hide input if username exists
    sportingLeagueSelectionMenuContainer.style.display = "flex"; // Show sporting league selection menu
  }

  // Handle form submission for username validation
  usernameValidationForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent page reload on form submission

    const username = usernameInputField.value.trim();

    // Validate entered username
    if (username.length > 0) {
      // Store username in localStorage for persistence
      localStorage.setItem("username", username);

      // Transition to sporting league selection menu
      usernameInputContainer.style.display = "none";
      sportingLeagueSelectionMenuContainer.style.display = "flex";
    } else {
      alert("Please enter a valid username!");
    }
  });
});
