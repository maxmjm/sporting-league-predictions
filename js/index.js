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
  const leagueSelectionMenu = document.getElementById(
    "league-selection-container"
  );

  // Handle form submission for username validation
  usernameValidationForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent page reload on form submission

    const username = usernameInputField.value.trim();

    // Validate entered username
    if (username.length > 0) {
      // Store username in localStorage for persistence
      localStorage.setItem("username", username);

      // Transition to main menu
      usernameInputContainer.style.display = "none";
      mainMenu.style.display = "block";
      leagueSelectionMenu.style.display = "block";
    } else {
      alert("Please enter a valid username!");
    }
  });
});
