// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById(
    "display-predictions-overview-container"
  );
  if (!container) {
    console.error("Predictions container not found!");
    return;
  }

  // Temporary loading message while fetching data
  container.innerHTML = "<p>Loading predictions...</p>";

  // Fetch all predictions from the server
  fetch("/get-all-nba-regular-season-predictions")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch predictions!");
      return response.json();
    })
    .then((data) => {
      renderPredictions(data, container); // Inject fetched data into the DOM
    })
    .catch((error) => {
      console.error(error);
      container.innerHTML =
        "<p>Failed to load predictions! Please try again later.</p>";
    });

  /**
   * Renders all prediction sections into the container
   * @param {Object} data - object containing all prediction data
   * @param {HTMLElement} container - target DOM element for rendering
   */
  function renderPredictions(data, container) {
    container.innerHTML = ""; // Clear loading message

    createSection(
      "Eastern Conference Predictions",
      data.easternConference,
      container
    );
    createSection(
      "Western Conference Predictions",
      data.westernConference,
      container
    );
    createSection("Player Awards Predictions", data.playerAwards, container);
  }

  /**
   * Creates a section with a title and table of records
   * @param {string} title - the section heading
   * @param {Array<Object>} dataset - array of records
   * @param {HTMLElement} container - where to append the section
   */
  function createSection(title, dataset, container) {
    const section = document.createElement("section");
    section.innerHTML = `<h2>${title}</h2>`;
    section.appendChild(createPredictionsTable(title, dataset));
    container.appendChild(section);
  }

  /**
   * Creates a table from an array of record objects
   * @param {string} title - optional context
   * @param {Array<Object>} records - the predictions data
   * @returns {HTMLTableElement} - the rendered table
   */
  function createPredictionsTable(title, records) {
    const table = document.createElement("table");

    // Handle empty or invalid data
    if (!Array.isArray(records) || records.length === 0) {
      table.innerHTML = "<tr><td>No data available</td></tr>";
      return table;
    }

    // Table headers based on keys from first record
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    Object.keys(records[0]).forEach((key) => {
      const th = document.createElement("th");
      th.textContent = formatColumnName(key); // Format snake_case → Title Case
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body with values
    const tbody = document.createElement("tbody");
    records.forEach((record) => {
      const row = document.createElement("tr");

      Object.values(record).forEach((value) => {
        const td = document.createElement("td");
        td.textContent = value;
        row.appendChild(td);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);

    return table;
  }

  /**
   * Converts a snake_case string into Title Case
   * @param {string} snakeCase - key name
   * @returns {string} - formatted column title
   */
  function formatColumnName(snakeCase) {
    return snakeCase
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
});
