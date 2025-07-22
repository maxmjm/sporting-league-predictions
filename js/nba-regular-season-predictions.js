document.addEventListener("DOMContentLoaded", () => {
  const displayNBARegularSeasonPredictionsOverviewContainer =
    document.getElementById(
      "display-nba-regular-season-predictions-overview-container"
    );

  fetch("/get-all-nba-regular-season-predictions")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch predictions!");
      return response.json();
    })
    .then((nbaRegularSeasonPredictionsData) => {
      displayAllNBARegularSeasonPredictions(
        nbaRegularSeasonPredictionsData,
        displayNBARegularSeasonPredictionsOverviewContainer
      );
    })
    .catch((error) => {
      console.error(error);
      displayNBARegularSeasonPredictionsOverviewContainer.innerHTML =
        "<p>Failed to load predictions. Please try again later.</p>";
    });

  function displayAllNBARegularSeasonPredictions(
    predictionsData,
    containerElement
  ) {
    containerElement.innerHTML = "";

    // Eastern Conference
    const easternConferencePredictionsSection =
      document.createElement("section");
    easternConferencePredictionsSection.innerHTML = `<h2>Eastern Conference Predictions</h2>`;
    easternConferencePredictionsSection.appendChild(
      createPredictionsTable(predictionsData.easternConference)
    );
    containerElement.appendChild(easternConferencePredictionsSection);

    // Western Conference
    const westernConferencePredictionsSection =
      document.createElement("section");
    westernConferencePredictionsSection.innerHTML = `<h2>Western Conference Predictions</h2>`;
    westernConferencePredictionsSection.appendChild(
      createPredictionsTable(predictionsData.westernConference)
    );
    containerElement.appendChild(westernConferencePredictionsSection);

    // Player Awards
    const playerAwardsPredictionsSection = document.createElement("section");
    playerAwardsPredictionsSection.innerHTML = `<h2>Player Awards Predictions</h2>`;
    playerAwardsPredictionsSection.appendChild(
      createPredictionsTable(predictionsData.playerAwards)
    );
    containerElement.appendChild(playerAwardsPredictionsSection);
  }

  function createPredictionsTable(predictionRecordsArray) {
    const predictionsTable = document.createElement("table");

    if (
      !Array.isArray(predictionRecordsArray) ||
      predictionRecordsArray.length === 0
    ) {
      predictionsTable.innerHTML = "<tr><td>No data</td></tr>";
      return predictionsTable;
    }

    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");

    Object.keys(predictionRecordsArray[0]).forEach((columnKey) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = convertSnakeCaseToReadableLabel(columnKey);
      headerRow.appendChild(headerCell);
    });

    tableHeader.appendChild(headerRow);
    predictionsTable.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");
    predictionRecordsArray.forEach((predictionRecord) => {
      const predictionRow = document.createElement("tr");
      Object.values(predictionRecord).forEach((fieldValue) => {
        const dataCell = document.createElement("td");
        dataCell.textContent = fieldValue;
        predictionRow.appendChild(dataCell);
      });
      tableBody.appendChild(predictionRow);
    });
    predictionsTable.appendChild(tableBody);

    return predictionsTable;
  }

  function convertSnakeCaseToReadableLabel(snakeCaseText) {
    return snakeCaseText
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
});
