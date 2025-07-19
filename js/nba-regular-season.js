document.addEventListener("DOMContentLoaded", () => {
  // Redirect if username is not set
  const username = localStorage.getItem("username");
  if (!username) {
    alert("Please set your username before continuing!");
    window.location.href = "index.html";
    return;
  }

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

  // DOM container references
  const easternConferenceTeamsContainer = document.getElementById(
    "eastern-conference-teams-container"
  );
  const westernConferenceTeamsContainer = document.getElementById(
    "western-conference-teams-container"
  );
  const playerAwardsFormContainer = document.getElementById(
    "player-awards-container"
  );

  // Function to create prediction forms for teams
  function createTeamPredictionsForm(teamName, conference) {
    const teamKey = teamName.replace(/\s+/g, "-").toLowerCase();
    const predictionForm = document.createElement("form");

    predictionForm.innerHTML = `
    <h6>${teamName}</h6>
    <label for="seed-${teamKey}">Seed:</label>
    <input type="number" id="seed-${teamKey}" name="seed" min="1" max="15" required />
    <br />
    <label for="win-total-${teamKey}">Win Total:</label>
    <input type="number" id="win-total-${teamKey}" name="win-total" min="0" max="82" required />
    <br />
    <label for="big-call-${teamKey}">Big Call:</label>
    <textarea id="big-call-${teamKey}" name="big-call" rows="3"></textarea>
    <br />
    <button type="submit">Save</button>
  `;

    // Handle form submission
    predictionForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const seed = predictionForm.querySelector("input[name='seed']").value;
      const win_total = predictionForm.querySelector(
        "input[name='win-total']"
      ).value;
      const big_call = predictionForm.querySelector(
        "textarea[name='big-call']"
      ).value;

      const endpoint =
        conference === "east"
          ? "/save-eastern-conference-predictions"
          : "/save-western-conference-predictions";

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          team_name: teamName,
          seed,
          win_total,
          big_call,
        }),
      })
        .then((res) => res.json())
        .then(() => alert(`Saved ${conference} prediction for ${teamName}!`))
        .catch(() => alert(`Failed to save prediction for ${teamName}!`));
    });

    const formWrapper = document.createElement("div");
    formWrapper.classList.add("team-predictions-form");
    formWrapper.appendChild(predictionForm);
    return formWrapper;
  }

  // Render prediction forms for all teams
  easternConferenceTeams.forEach((team) => {
    easternConferenceTeamsContainer.appendChild(
      createTeamPredictionsForm(team, "east")
    );
  });
  westernConferenceTeams.forEach((team) => {
    westernConferenceTeamsContainer.appendChild(
      createTeamPredictionsForm(team, "west")
    );
  });

  // Function to create player awards prediction form
  function createPlayerAwardsPredictionsForm() {
    const awardsForm = document.createElement("form");

    awardsForm.innerHTML = `
    <label for="clutch-player-of-the-year">Clutch Player of the Year:</label>
    <input type="text" id="clutch-player-of-the-year" name="clutch-player-of-the-year" required /><br />
    <label for="defensive-player-of-the-year">Defensive Player of the Year:</label>
    <input type="text" id="defensive-player-of-the-year" name="defensive-player-of-the-year" required /><br />
    <label for="most-valuable-player">Most Valuable Player:</label>
    <input type="text" id="most-valuable-player" name="most-valuable-player" required /><br />
    <label for="most-improved-player">Most Improved Player:</label>
    <input type="text" id="most-improved-player" name="most-improved-player" required /><br />
    <label for="rookie-of-the-year">Rookie of the Year:</label>
    <input type="text" id="rookie-of-the-year" name="rookie-of-the-year" required /><br />
    <label for="sixth-man-of-the-year">Sixth Man of the Year:</label>
    <input type="text" id="sixth-man-of-the-year" name="sixth-man-of-the-year" required /><br />
    <button type="submit">Save</button>
  `;

    awardsForm.addEventListener("submit", (e) => {
      e.preventDefault();

      fetch("/save-player-awards-predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          clutch_player_of_the_year:
            awardsForm["clutch-player-of-the-year"].value,
          defensive_player_of_the_year:
            awardsForm["defensive-player-of-the-year"].value,
          most_valuable_player: awardsForm["most-valuable-player"].value,
          most_improved_player: awardsForm["most-improved-player"].value,
          rookie_of_the_year: awardsForm["rookie-of-the-year"].value,
          sixth_man_of_the_year: awardsForm["sixth-man-of-the-year"].value,
        }),
      })
        .then((res) => res.json())
        .then(() => alert("Player Awards saved!"))
        .catch(() => alert("Failed to save Player Awards!"));
    });

    const awardsFormWrapper = document.createElement("div");
    awardsFormWrapper.classList.add("player-awards-predictions-form");
    awardsFormWrapper.appendChild(awardsForm);
    return awardsFormWrapper;
  }

  // Add the awards form to the DOM
  playerAwardsFormContainer.appendChild(createPlayerAwardsPredictionsForm());

  // Render predictions in table format for all users
  function renderPredictionsTable(userPredictions) {
    const predictionsDisplayTableContainer = document.getElementById(
      "display-user-predictions-container"
    );
    predictionsDisplayTableContainer.innerHTML = ""; // Clear any existing content

    for (const username in userPredictions) {
      const userPredictionData = userPredictions[username];
      const userPredictionSection = document.createElement("section");
      userPredictionSection.classList.add("display-user-predictions-section");

      // Username title
      const sectionTitle = document.createElement("h3");
      sectionTitle.textContent = `Predictions by ${username}`;
      userPredictionSection.appendChild(sectionTitle);

      // Eastern Conference Table
      const easternConferencePredictionsTable = document.createElement("table");
      easternConferencePredictionsTable.innerHTML = `<caption>Eastern Conference</caption>
      <thead><tr><th>Team</th><th>Seed</th><th>Wins</th><th>Big Call</th></tr></thead>
      <tbody>
        ${userPredictionData.east
          .map(
            (team) => `
            <tr>
              <td>${team.team_name}</td>
              <td>${team.seed}</td>
              <td>${team.win_total}</td>
              <td>${team.big_call || ""}</td>
            </tr>
          `
          )
          .join("")}
      </tbody>`;
      userPredictionSection.appendChild(easternConferencePredictionsTable);

      // Western Conference Table
      const westernConferencePredictionsTable = document.createElement("table");
      westernConferencePredictionsTable.innerHTML = `<caption>Western Conference</caption>
      <thead><tr><th>Team</th><th>Seed</th><th>Wins</th><th>Big Call</th></tr></thead>
      <tbody>
        ${userPredictionData.west
          .map(
            (team) => `
            <tr>
              <td>${team.team_name}</td>
              <td>${team.seed}</td>
              <td>${team.win_total}</td>
              <td>${team.big_call || ""}</td>
            </tr>
          `
          )
          .join("")}
      </tbody>`;
      userPredictionSection.appendChild(westernConferencePredictionsTable);

      // Player Awards Table
      const awards = userPredictionData.playerAwards;
      const awardsPredictionsTable = document.createElement("table");
      awardsPredictionsTable.innerHTML = `
      <caption>Player Awards</caption>
      <thead><tr><th>Award</th><th>Prediction</th></tr></thead>
      <tbody>
        <tr><td>MVP</td><td>${awards.most_valuable_player}</td></tr>
        <tr><td>Rookie</td><td>${awards.rookie_of_the_year}</td></tr>
        <tr><td>Defensive</td><td>${awards.defensive_player_of_the_year}</td></tr>
        <tr><td>Most Improved</td><td>${awards.most_improved_player}</td></tr>
        <tr><td>Sixth Man</td><td>${awards.sixth_man_of_the_year}</td></tr>
        <tr><td>Clutch</td><td>${awards.clutch_player_of_the_year}</td></tr>
      </tbody>`;
      userPredictionSection.appendChild(awardsPredictionsTable);

      predictionsDisplayTableContainer.appendChild(userPredictionSection);
    }
  }

  // Fetch and render all user predictions from the server
  fetch("/all-nba-regular-season-predictions")
    .then((res) => {
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const users = {};

      // Organise data into user based structure
      data.playerAwards.forEach((row) => {
        users[row.username] = users[row.username] || {
          playerAwards: {},
          east: [],
          west: [],
        };
        users[row.username].playerAwards = row;
      });

      data.easternConference.forEach((row) => {
        users[row.username] = users[row.username] || {
          playerAwards: {},
          east: [],
          west: [],
        };
        users[row.username].east.push(row);
      });

      data.westernConference.forEach((row) => {
        users[row.username] = users[row.username] || {
          playerAwards: {},
          east: [],
          west: [],
        };
        users[row.username].west.push(row);
      });

      renderPredictionsTable(users);
    })
    .catch((err) => {
      console.error("Failed to fetch user predictions:", err);
      alert("Failed to load user predictions from the server!");
    });
});
