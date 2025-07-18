document.addEventListener("DOMContentLoaded", function () {
  // Show the body (was hidden by default in CSS)
  document.body.style.display = "block";

  const usernameValidationForm = document.getElementById(
    "username-validation-form"
  );
  const usernameInputField = document.getElementById(
    "username-validation-field"
  );
  const usernameErrorMessage = document.getElementById(
    "username-validation-error-message"
  );
  const usernameInputContainer = document.getElementById(
    "username-input-container"
  );
  const mainMenu = document.getElementById("main-menu");
  const leagueSelectionMenu = document.getElementById("league-selection-menu");

  usernameValidationForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const enteredUsername = usernameInputField.value.trim();

    if (enteredUsername.length > 0) {
      usernameInputContainer.style.display = "none";
      mainMenu.style.display = "block";
      leagueSelectionMenu.style.display = "block";
    } else {
      alert("Please enter a valid username!");
    }
  });
});
