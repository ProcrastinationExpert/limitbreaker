const JAVA_API_URL = "https://api.mcsrvstat.us/3/mc.libre.my.id";
const BEDROCK_API_URL =
  "https://api.mcsrvstat.us/bedrock/3/servermc.libre.my.id";
const refreshButtonText = document.getElementById("refreshBtnText");
const rootElement = document.documentElement;
let refreshButtonCanBePressed = true;

async function fetchData(API_URL) {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error: " + error);
  }
}

async function getStatus(type) {
  refreshButtonText.textContent = "Wait...";
  refreshButtonCanBePressed = false;
  const cardParentElement = document.querySelector(`.server-stat-card.${type}`);
  const loadingElementOrigin = document.querySelector(".loading-display-card");
  const connElement = document.querySelector(`.mc-server-status.${type}`);
  const playerCountElement = document.querySelector(`.player-count.${type}`);
  const versionElement = document.querySelector(`.version.${type}`);
  const portElement = document.querySelector(`.port.${type}`);
  let gamemodeElement = null;
  if (type == "bedrock") {
    gamemodeElement = document.querySelector(`.gamemode.${type}`);
  }
  let loadingElement = document.getElementById(`loading-display-card-${type}`);

  if (loadingElement == null) {
    loadingElement = loadingElementOrigin.cloneNode(true);
    loadingElement.id = `loading-display-card-${type}`;
    cardParentElement.appendChild(loadingElement);
  }

  loadingElement.style.display = "flex";

  const data =
    type == "java"
      ? await fetchData(JAVA_API_URL)
      : await fetchData(BEDROCK_API_URL);

  if (data["debug"]["ping"] == true) {
    connElement.textContent = "Online";
    connElement.style.color = window
      .getComputedStyle(rootElement)
      .getPropertyValue("--validserverstatuscolor");
    playerCountElement.textContent = `${data["players"]["online"]}/${data["players"]["max"]}`;
    versionElement.textContent = data["version"];
    portElement.textContent = data["port"];
  } else {
    connElement.style.color = window
      .getComputedStyle(rootElement)
      .getPropertyValue("--invalidserverstatuscolor");
    connElement.textContent = "Offline";
    playerCountElement.textContent = "?/?";
    versionElement.textContent = "?";
    if (gamemodeElement) {
      gamemodeElement.textContent = "Unknown";
      gamemodeElement.style.color = window
        .getComputedStyle(rootElement)
        .getPropertyValue("--unknownserverstatuscolor");
    }
    portElement.textContent = "?";
  }

  loadingElement.style.display = "none";
  refreshButtonText.textContent = "Refresh";
  refreshButtonCanBePressed = true;
}

function refreshStatus() {
  if (!refreshButtonCanBePressed) return;
  getStatus("java");
  getStatus("bedrock");
}

refreshStatus();
