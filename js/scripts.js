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

document.addEventListener("DOMContentLoaded", function () {
  const easternTeams = [
    "Atlanta Hawks",
    "Boston Celtics",
    "Brooklyn Nets",
    "New York Knicks",
    "Philadelphia 76ers",
    "Toronto Raptors",
    // Add other Eastern Conference teams here
  ];

  const westernTeams = [
    "Golden State Warriors",
    "Los Angeles Lakers",
    "Phoenix Suns",
    "Denver Nuggets",
    "Dallas Mavericks",
    // Add other Western Conference teams here
  ];

  const easternContainer = document.getElementById("eastern-teams");
  const westernContainer = document.getElementById("western-teams");

  function createTeamForm(teamName) {
    const form = document.createElement("div");
    form.classList.add("team-prediction");
    form.innerHTML = `
      <h6>${teamName}</h6>
      <form>
        <label for="seed-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}">Seed (1-15):</label>
        <input type="number" id="seed-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}" name="seed" min="1" max="15" required />
        <br />
        <label for="wins-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}">Win Total (0-82):</label>
        <input type="number" id="wins-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}" name="wins" min="0" max="82" required />
        <br />
        <label for="big-call-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}">Big Call:</label>
        <textarea id="big-call-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}" name="big-call" rows="3" placeholder="Write your bold prediction here..."></textarea>
        <br />
        <button type="submit">Submit Prediction</button>
      </form>
    `;
    return form;
  }

  easternTeams.forEach((team) => {
    easternContainer.appendChild(createTeamForm(team));
  });

  westernTeams.forEach((team) => {
    westernContainer.appendChild(createTeamForm(team));
  });
});
