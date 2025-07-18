document.addEventListener("DOMContentLoaded", function () {
  const usernameForm = document.getElementById("username-form");
  const usernameInput = document.getElementById("username");
  const errorMessage = document.getElementById("error-message");
  const usernameContainer = document.getElementById("username-container");
  const menuContainer = document.getElementById("menu-container");

  usernameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = usernameInput.value.trim();

    if (username.length > 0) {
      usernameContainer.style.display = "none";
      menuContainer.style.display = "block";
    } else {
      errorMessage.style.display = "block";
    }
  });
});

function navigateToPage(pageName) {
  window.location.href = `./${pageName}`;
}

function showInDevelopment(pageName) {
  alert(`Currently in development. Check back later!`);
}
