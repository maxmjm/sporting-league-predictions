document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");

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

  const easternConferenceTeamsContainer = document.getElementById(
    "eastern-conference-teams-container"
  );
  const westernConferenceTeamsContainer = document.getElementById(
    "western-conference-teams-container"
  );
  const playerAwardsContainer = document.getElementById(
    "player-awards-container"
  );
  const saveAllPredictionsButton = document.getElementById(
    "save-all-predictions-button"
  );

  function createTeamPredictionsForm(teamName) {
    const teamKey = teamName.replace(/\s+/g, "-").toLowerCase();
    const teamPredictionsForm = document.createElement("form");
    teamPredictionsForm.innerHTML = `
      <h6>${teamName}</h6>
      <label for="seed-${teamKey}">Seed:</label>
      <input type="number" id="seed-${teamKey}" name="seed" min="1" max="15" required />
      <label for="win-total-${teamKey}">Win Total:</label>
      <input type="number" id="win-total-${teamKey}" name="win-total" min="0" max="82" required />
      <label for="big-call-${teamKey}">Big Call:</label>
      <textarea id="big-call-${teamKey}" name="big-call" rows="3"></textarea>
    `;
    const teamPredictionsFormWrapper = document.createElement("div");
    teamPredictionsFormWrapper.classList.add("team-predictions-form");
    teamPredictionsFormWrapper.appendChild(teamPredictionsForm);
    return teamPredictionsFormWrapper;
  }

  easternConferenceTeams.forEach((teamName) => {
    easternConferenceTeamsContainer.appendChild(
      createTeamPredictionsForm(teamName)
    );
  });

  westernConferenceTeams.forEach((teamName) => {
    westernConferenceTeamsContainer.appendChild(
      createTeamPredictionsForm(teamName)
    );
  });

  function createPlayerAwardsPredictionsForm() {
    const playerAwardsForm = document.createElement("form");
    playerAwardsForm.innerHTML = `
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
    const playerAwardsFormWrapper = document.createElement("div");
    playerAwardsFormWrapper.classList.add("player-awards-predictions-form");
    playerAwardsFormWrapper.appendChild(playerAwardsForm);
    return playerAwardsFormWrapper;
  }

  playerAwardsContainer.appendChild(createPlayerAwardsPredictionsForm());

  saveAllPredictionsButton.addEventListener("click", () => {
    const easternConferenceTeamsPredictions = [];
    const westernConferenceTeamsPredictions = [];

    easternConferenceTeams.forEach((teamName) => {
      const easternConferenceTeamKey = teamName
        .replace(/\s+/g, "-")
        .toLowerCase();
      easternConferenceTeamsPredictions.push({
        team_name: teamName,
        seed: document.getElementById(`seed-${easternConferenceTeamKey}`).value,
        win_total: document.getElementById(
          `win-total-${easternConferenceTeamKey}`
        ).value,
        big_call: document.getElementById(
          `big-call-${easternConferenceTeamKey}`
        ).value,
      });
    });

    westernConferenceTeams.forEach((teamName) => {
      const westernConferenceTeamKey = teamName
        .replace(/\s+/g, "-")
        .toLowerCase();
      westernConferenceTeamsPredictions.push({
        team_name: teamName,
        seed: document.getElementById(`seed-${westernConferenceTeamKey}`).value,
        win_total: document.getElementById(
          `win-total-${westernConferenceTeamKey}`
        ).value,
        big_call: document.getElementById(
          `big-call-${westernConferenceTeamKey}`
        ).value,
      });
    });

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

    fetch("/save-all-nba-regular-season-predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        easternConference: easternConferenceTeamsPredictions,
        westernConference: westernConferenceTeamsPredictions,
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
        alert("Failed to save predictions. Please try again.");
      });
  });
});
