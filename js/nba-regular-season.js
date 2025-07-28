// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve username from localStorage (set on previous page)
  const username = localStorage.getItem("username");

  const eastTeams = [
    "Atlanta Hawks",
    "Boston Celtics",
    "Brooklyn Nets",
    "Charlotte Hornets",
    "Chicago Bulls",
    "Cleveland Cavaliers",
    "Detroit Pistons",
    "Indiana Pacers",
    "Miami Heat",
    "Milwaukee Bucks",
    "New York Knicks",
    "Orlando Magic",
    "Philadelphia 76ers",
    "Toronto Raptors",
    "Washington Wizards",
  ];

  const westTeams = [
    "Dallas Mavericks",
    "Denver Nuggets",
    "Golden State Warriors",
    "Houston Rockets",
    "Los Angeles Clippers",
    "Los Angeles Lakers",
    "Memphis Grizzlies",
    "Minnesota Timberwolves",
    "New Orleans Pelicans",
    "Oklahoma City Thunder",
    "Phoenix Suns",
    "Portland Trail Blazers",
    "Sacramento Kings",
    "San Antonio Spurs",
    "Utah Jazz",
  ];

  // Get DOM elements
  const eastContainer = document.getElementById(
    "eastern-conference-teams-container"
  );
  const westContainer = document.getElementById(
    "western-conference-teams-container"
  );
  const playerAwardsContainer = document.getElementById(
    "player-awards-container"
  );
  const submitPredictionsButton = document.getElementById(
    "submit-all-predictions-button"
  );

  /**
   * Create a form block for a team's predictions
   * @param {string} team - the team name
   * @returns {HTMLElement} - the team prediction form wrapper
   */
  function renderTeamPredictionsForm(team) {
    // Convert team name to key (e.g., "Boston Celtics" -> "boston-celtics")
    const key = team.replace(/\s+/g, "-").toLowerCase();
    const form = document.createElement("form");

    // Form HTML components
    form.innerHTML = `
      <h6>${team}</h6>
      <label for="seed-${key}">Seed:</label>
      <input type="number" id="seed-${key}" name="seed" min="1" max="15" required />
      <label for="win-total-${key}">Win Total:</label>
      <input type="number" id="win-total-${key}" name="win-total" min="0" max="82" required />
      <label for="big-call-${key}">Big Call:</label>
      <textarea id="big-call-${key}" name="big-call" rows="3"></textarea>
    `;

    // Wrap each team's form in a container for styling
    const wrapper = document.createElement("div");
    wrapper.classList.add("team-predictions-form");
    wrapper.appendChild(form);

    return wrapper;
  }

  // Render Easter and Western Conference forms
  eastTeams.forEach((team) => {
    eastContainer.appendChild(renderTeamPredictionsForm(team));
  });
  westTeams.forEach((team) => {
    westContainer.appendChild(renderTeamPredictionsForm(team));
  });

  /**
   * Create a form block for player awards predictions
   */
  function renderPlayerAwardsPredictionsForm() {
    const form = document.createElement("form");

    // Form HTML components
    form.innerHTML = `
      <label for="clutch-player-of-the-year">Clutch Player of the Year:</label>
      <input type="text" id="clutch-player-of-the-year" name="clutch-player-of-the-year" required />
      <label for="defensive-player-of-the-year">Defensive Player of the Year:</label>
      <input type="text" id="defensive-player-of-the-year" name="defensive-player-of-the-year" required />
      <label for="most-valuable-player">Most Valuable Player:</label>
      <input type="text" id="most-valuable-player" name="most-valuable-player" required />
      <label for="most-improved-player">Most Improved Player:</label>
      <input type="text" id="most-improved-player" name="most-improved-player" required />
      <label for="rookie-of-the-year">Rookie of the Year:</label>
      <input type="text" id="rookie-of-the-year" name="rookie-of-the-year" required />
      <label for="sixth-man-of-the-year">Sixth Man of the Year:</label>
      <input type="text" id="sixth-man-of-the-year" name="sixth-man-of-the-year" required />
    `;

    // Wrap the awards form form in a container for styling
    const wrapper = document.createElement("div");
    wrapper.classList.add("player-awards-predictions-form");
    wrapper.appendChild(form);

    return wrapper;
  }

  // Render player awards form
  playerAwardsContainer.appendChild(renderPlayerAwardsPredictionsForm());

  /**
   * Handle "Save All Predictions" button click
   * Collect all form data and send it to the server
   */
  submitPredictionsButton.addEventListener("click", () => {
    // Confirm entered predictions
    const confirmPredictions = confirm(
      "Are you sure you want to submit all your predictions?"
    );
    if (!confirmPredictions) return;

    // Collect data for each Eastern Conference team
    const eastPredictions = [];
    const westPredictions = [];

    eastTeams.forEach((team) => {
      const key = team.replace(/\s+/g, "-").toLowerCase();
      eastPredictions.push({
        team_name: team,
        seed: document.getElementById(`seed-${key}`).value,
        win_total: document.getElementById(`win-total-${key}`).value,
        big_call: document.getElementById(`big-call-${key}`).value,
      });
    });

    // Collect data for each Western Conference team
    westTeams.forEach((team) => {
      const key = team.replace(/\s+/g, "-").toLowerCase();
      westPredictions.push({
        team_name: team,
        seed: document.getElementById(`seed-${key}`).value,
        win_total: document.getElementById(`win-total-${key}`).value,
        big_call: document.getElementById(`big-call-${key}`).value,
      });
    });

    // Extract player awards predictions
    const playerAwardsPredictionsForm = document.querySelector(
      ".player-awards-predictions-form form"
    );
    const playerAwards = {
      clutch_player_of_the_year:
        playerAwardsPredictionsForm["clutch-player-of-the-year"].value,
      defensive_player_of_the_year:
        playerAwardsPredictionsForm["defensive-player-of-the-year"].value,
      most_valuable_player:
        playerAwardsPredictionsForm["most-valuable-player"].value,
      most_improved_player:
        playerAwardsPredictionsForm["most-improved-player"].value,
      rookie_of_the_year:
        playerAwardsPredictionsForm["rookie-of-the-year"].value,
      sixth_man_of_the_year:
        playerAwardsPredictionsForm["sixth-man-of-the-year"].value,
    };

    // Send all data to backend (db)
    fetch("/save-all-nba-regular-season-predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        easternConference: eastPredictions,
        westernConference: westPredictions,
        playerAwards: playerAwards,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Save failed!");
        return res.json();
      })
      .then(() => {
        alert("All predictions saved!");
        localStorage.setItem("nbaRegularSeasonPredictionsSaved", "true");
        window.location.href = "nba-regular-season-predictions.html";
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to save predictions! Please try again.");
      });
  });
});
