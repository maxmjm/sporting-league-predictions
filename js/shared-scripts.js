// Wait for the DOM to fully load before executing scripts
document.addEventListener("DOMContentLoaded", function () {
  // DOM elements for username validation and league selection
  const usernameForm = document.getElementById("username-validation-form");
  const usernameInputField = document.getElementById(
    "username-validation-field"
  );
  const usernameErrorMessage = document.getElementById(
    "username-validation-error-message"
  );
  const usernameInputSection = document.getElementById(
    "username-input-container"
  );
  const leagueSelectionMenu = document.getElementById("league-selection-menu");

  // Handle username form submission
  usernameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const enteredUsername = usernameInputField.value.trim();

    // Validate username input
    if (enteredUsername.length > 0) {
      usernameInputSection.style.display = "none"; // Hide username input section
      leagueSelectionMenu.style.display = "block"; // Show league selection menu
    } else {
      usernameErrorMessage.style.display = "block"; // Display error message
    }
  });
});

// Navigate to a specific page
function navigateToPage(pageName) {
  window.location.href = `./${pageName}`;
}

// Show an alert for pages under development
function showInDevelopment() {
  alert(`Currently in development. Check back later!`);
}
