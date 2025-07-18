document.addEventListener("DOMContentLoaded", function () {
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

  const easternConferenceContainer = document.getElementById(
    "eastern-conference-teams"
  );
  const westernConferenceContainer = document.getElementById(
    "western-conference-teams"
  );

  function createTeamPredictionForm(teamName) {
    const teamFormContainer = document.createElement("div");
    teamFormContainer.classList.add("team-prediction-form");
    teamFormContainer.innerHTML = `
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
    return teamFormContainer;
  }

  easternConferenceTeams.forEach((team) => {
    easternConferenceContainer.appendChild(createTeamPredictionForm(team));
  });

  westernConferenceTeams.forEach((team) => {
    westernConferenceContainer.appendChild(createTeamPredictionForm(team));
  });
});
