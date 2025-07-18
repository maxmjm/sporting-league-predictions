document.addEventListener("DOMContentLoaded", function () {
  // List of Eastern Conference teams
  const easternConferenceTeams = [
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

  // List of Western Conference teams
  const westernConferenceTeams = [
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

  // DOM containers for team forms and player awards
  const easternConferenceTeamsContainer = document.getElementById(
    "eastern-conference-teams"
  );
  const westernConferenceTeamsContainer = document.getElementById(
    "western-conference-teams"
  );
  const playerAwardsContainer = document.getElementById("player-awards");

  // Function to create prediction forms for teams
  function createTeamPredictionForm(teamName) {
    const teamFormContainer = document.createElement("div");
    teamFormContainer.classList.add("team-prediction-form");
    teamFormContainer.innerHTML = `
      <h6>${teamName}</h6>
      <form>
        <label for="seed-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}">Seed:</label>
        <input type="number" id="seed-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}" name="seed" min="1" max="15" required />
        <br />
        <label for="win-total-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}">Win Total:</label>
        <input type="number" id="win-total-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}" name="win-total" min="0" max="82" required />
        <br />
        <label for="bold-prediction-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}">Bold Prediction:</label>
        <textarea id="bold-prediction-${teamName
          .replace(/\s+/g, "-")
          .toLowerCase()}" name="bold-prediction" rows="3" placeholder="e.g., Cooper Flagg all-star rookie season."></textarea>
        <br />
        <button type="submit">Save</button>
      </form>
    `;
    return teamFormContainer;
  }

  // Render prediction forms for Eastern Conference teams
  easternConferenceTeams.forEach((team) => {
    easternConferenceTeamsContainer.appendChild(createTeamPredictionForm(team));
  });

  // Render prediction forms for Western Conference teams
  westernConferenceTeams.forEach((team) => {
    westernConferenceTeamsContainer.appendChild(createTeamPredictionForm(team));
  });

  // Function to create player awards prediction form
  function createPlayerAwardsPredictionForm() {
    const playerAwardsFormContainer = document.createElement("div");
    playerAwardsFormContainer.classList.add("player-awards-prediction-form");
    playerAwardsFormContainer.innerHTML = `
      <form>
        <label for="clutch-player">Clutch Player of the Year:</label>
        <input type="text" id="clutch-player" name="clutch-player" placeholder="Enter player name" required />
        <br />
        <label for="defensive-player">Defensive Player of the Year:</label>
        <input type="text" id="defensive-player" name="defensive-player" placeholder="Enter player name" required />
        <br />
        <label for="most-valuable-player">Most Valuable Player:</label>
        <input type="text" id="most-valuable-player" name="most-valuable-player" placeholder="Enter player name" required />
        <br />
        <label for="most-improved-player">Most Improved Player:</label>
        <input type="text" id="most-improved-player" name="most-improved-player" placeholder="Enter player name" required />
        <br />
        <label for="rookie-player">Rookie of the Year:</label>
        <input type="text" id="rookie-player" name="rookie-player" placeholder="Enter player name" required />
        <br />
        <label for="sixth-man-player">Sixth Man of the Year:</label>
        <input type="text" id="sixth-man-player" name="sixth-man-player" placeholder="Enter player name" required />
        <br />
        <button type="submit">Save</button>
      </form>
    `;
    return playerAwardsFormContainer;
  }

  // Append the player awards prediction form to the container
  playerAwardsContainer.appendChild(createPlayerAwardsPredictionForm());
});
