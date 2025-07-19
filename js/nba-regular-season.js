document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("Please set your username before making predictions.");
    window.location.href = "index.html";
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

  // DOM containers for team forms and player awards
  const easternConferenceTeamsContainer = document.getElementById(
    "eastern-conference-teams"
  );
  const westernConferenceTeamsContainer = document.getElementById(
    "western-conference-teams"
  );
  const playerAwardsContainer = document.getElementById("player-awards");

  // Function to create prediction forms for teams
  function createTeamPredictionForm(teamName, conference) {
    const username = localStorage.getItem("username");
    const teamKey = teamName.replace(/\s+/g, "-").toLowerCase();

    const form = document.createElement("form");
    form.innerHTML = `
    <h6>${teamName}</h6>
    <label for="seed-${teamKey}">Seed:</label>
    <input type="number" id="seed-${teamKey}" name="seed" min="1" max="15" required />
    <br />
    <label for="win-total-${teamKey}">Win Total:</label>
    <input type="number" id="win-total-${teamKey}" name="win-total" min="0" max="82" required />
    <br />
    <label for="bold-prediction-${teamKey}">Bold Prediction:</label>
    <textarea id="bold-prediction-${teamKey}" name="bold-prediction" rows="3"></textarea>
    <br />
    <button type="submit">Save</button>
  `;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const seed = form.querySelector("input[name='seed']").value;
      const win_total = form.querySelector("input[name='win-total']").value;
      const big_call = form.querySelector(
        "textarea[name='bold-prediction']"
      ).value;

      const endpoint =
        conference === "east"
          ? "/save-eastern-conference"
          : "/save-western-conference";

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
        .catch(() => alert(`Failed to save prediction for ${teamName}`));
    });

    const wrapper = document.createElement("div");
    wrapper.classList.add("team-prediction-form");
    wrapper.appendChild(form);
    return wrapper;
  }

  // Render prediction forms for Eastern Conference teams
  easternConferenceTeams.forEach((team) => {
    easternConferenceTeamsContainer.appendChild(
      createTeamPredictionForm(team, "east")
    );
  });

  // Render prediction forms for Western Conference teams
  westernConferenceTeams.forEach((team) => {
    westernConferenceTeamsContainer.appendChild(
      createTeamPredictionForm(team, "west")
    );
  });

  // Function to create player awards prediction form
  function createPlayerAwardsPredictionForm() {
    const username = localStorage.getItem("username");

    const form = document.createElement("form");
    form.innerHTML = `
    <label for="clutch-player">Clutch Player of the Year:</label>
    <input type="text" id="clutch-player" name="clutch-player" required /><br />
    <label for="defensive-player">Defensive Player of the Year:</label>
    <input type="text" id="defensive-player" name="defensive-player" required /><br />
    <label for="most-valuable-player">Most Valuable Player:</label>
    <input type="text" id="most-valuable-player" name="most-valuable-player" required /><br />
    <label for="most-improved-player">Most Improved Player:</label>
    <input type="text" id="most-improved-player" name="most-improved-player" required /><br />
    <label for="rookie-player">Rookie of the Year:</label>
    <input type="text" id="rookie-player" name="rookie-player" required /><br />
    <label for="sixth-man-player">Sixth Man of the Year:</label>
    <input type="text" id="sixth-man-player" name="sixth-man-player" required /><br />
    <button type="submit">Save</button>
  `;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      fetch("/save-player-awards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          clutch_player_of_the_year: form["clutch-player"].value,
          defensive_player_of_the_year: form["defensive-player"].value,
          most_valuable_player: form["most-valuable-player"].value,
          most_improved_player: form["most-improved-player"].value,
          rookie_of_the_year: form["rookie-player"].value,
          sixth_man_of_the_year: form["sixth-man-player"].value,
        }),
      })
        .then((res) => res.json())
        .then(() => alert("Player Awards saved!"))
        .catch(() => alert("Failed to save Player Awards"));
    });

    const container = document.createElement("div");
    container.classList.add("player-awards-prediction-form");
    container.appendChild(form);
    return container;
  }

  // Append the player awards prediction form to the container
  playerAwardsContainer.appendChild(createPlayerAwardsPredictionForm());

  function renderPredictionsTable(userPredictions) {
    const tableContainer = document.getElementById(
      "all-nba-regular-season-predictions-table-container"
    );
    tableContainer.innerHTML = ""; // Clear any existing content

    for (const username in userPredictions) {
      const userPredictionData = userPredictions[username];
      const userSection = document.createElement("section");
      userSection.classList.add("user-prediction-section");

      const title = document.createElement("h3");
      title.textContent = `Predictions by ${username}`;
      userSection.appendChild(title);

      // Eastern Conference Table
      const easternConferenceTable = document.createElement("table");
      easternConferenceTable.innerHTML = `<caption>Eastern Conference</caption>
      <thead><tr><th>Team</th><th>Seed</th><th>Wins</th><th>Bold Prediction</th></tr></thead>
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
      userSection.appendChild(easternConferenceTable);

      // Western Conference Table
      const westernConferenceTable = document.createElement("table");
      westernConferenceTable.innerHTML = `<caption>Western Conference</caption>
      <thead><tr><th>Team</th><th>Seed</th><th>Wins</th><th>Bold Prediction</th></tr></thead>
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
      userSection.appendChild(westernConferenceTable);

      // Player Awards Table
      const awards = userPredictionData.playerAwards;
      const awardsTable = document.createElement("table");
      awardsTable.innerHTML = `
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
      userSection.appendChild(awardsTable);

      tableContainer.appendChild(userSection);
    }
  }

  fetch("/all-nba-regular-season-predictions")
    .then((res) => {
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log("Predictions loaded:", data);
      // render logic here...
    })
    .catch((err) => {
      console.error("Failed to load predictions:", err);
      alert("Could not load predictions from the server.");
    })
    .then((data) => {
      const users = {};

      data.playerAwards.forEach((row) => {
        if (!users[row.username])
          users[row.username] = { playerAwards: {}, east: [], west: [] };
        users[row.username].playerAwards = row;
      });

      data.easternConference.forEach((row) => {
        if (!users[row.username])
          users[row.username] = { playerAwards: {}, east: [], west: [] };
        users[row.username].east.push(row);
      });

      data.westernConference.forEach((row) => {
        if (!users[row.username])
          users[row.username] = { playerAwards: {}, east: [], west: [] };
        users[row.username].west.push(row);
      });

      renderPredictionsTable(users);
    });
});
