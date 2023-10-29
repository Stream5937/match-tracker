//app.js
// create constants for the form and the form controls
const newMatchFormEl = document.getElementsByTagName("form")[0];
const startDateInputEl = document.getElementById("start-date");
const endDateInputEl = document.getElementById("end-date");
const pastMatchContainer = document.getElementById("past-matches");
// Add the storage key as an app-wide constant
const STORAGE_KEY = "match-tracker";

// Listen to form submissions.
newMatchFormEl.addEventListener("submit", (event) => {
  // Prevent the form from submitting to the server
  // since everything is client-side.
  event.preventDefault();

  // Get the start and end dates from the form.
  const startDate = startDateInputEl.value;
  const endDate = endDateInputEl.value;

  // Check if the dates are invalid
  if (checkDatesInvalid(startDate, endDate)) {
    // If the dates are invalid, exit.
    return;
  }

  // Store the new match in our client-side storage.
  storeNewMatch(startDate, endDate);

  // Refresh the UI.
  renderPastMatches();

  // Reset the form.
  newMatchFormEl.reset();
});

function checkDatesInvalid(startDate, endDate) {
  // Check that end date is after start date and neither is null.
  if (!startDate || !endDate || startDate > endDate) {
    // To make the validation robust we could:
    // 1. add error messaging based on error type
    // 2. Alert assistive technology users about the error
    // 3. move focus to the error location
    // instead, for now, we clear the dates if either
    // or both are invalid
    newMatchFormEl.reset();
    // as dates are invalid, we return true
    return true;
  }
  // else
  return false;
}

function storeNewMatch(startDate, endDate) {
  // Get data from storage.
  const matches = getAllStoredMatches();

  // Add the new match object to the end of the array of match objects.
  matches.push({ startDate, endDate });

  // Sort the array so that periods are ordered by start date, from newest
  // to oldest.
  matches.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });

  // Store the updated array back in the storage.
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
}

function getAllStoredMatches() {
  // Get the string of match data from localStorage
  const data = window.localStorage.getItem(STORAGE_KEY);

  // If no matchess were stored, default to an empty array
  // otherwise, return the stored data as parsed JSON
  const matches = data ? JSON.parse(data) : [];

  return matches;
}

function renderPastMatches() {
  // get the parsed string of matches, or an empty array.
  const matches = getAllStoredMatches();

  // exit if there are no matches
  if (matches.length === 0) {
    return;
  }

  // Clear list of past matches, since we're going to re-render it.
  pastMatchContainer.innerHTML = "";

  const pastMatchHeader = document.createElement("h2");
  pastMatchHeader.textContent = "Past matches";

  const pastMatchList = document.createElement("ul");

  // Loop over all matches and render them.
  matches.forEach((match) => {
    const matchEl = document.createElement("li");
    matchEl.textContent = `From ${formatDate(
      match.startDate,
    )} to ${formatDate(match.endDate)}`;
    pastMatchList.appendChild(matchEl);
  });

  pastMatchContainer.appendChild(pastMatchHeader);
  pastMatchContainer.appendChild(pastMatchList);
}

function formatDate(dateString) {
  // Convert the date string to a Date object.
  const date = new Date(dateString);

  // Format the date into a locale-specific string.
  // include your locale for better user experience
  return date.toLocaleDateString("en-GB", { timeZone: "GMT" });
}

// Start the app by rendering the past matches.
renderPastMatches();

