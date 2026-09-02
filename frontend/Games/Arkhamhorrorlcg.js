// ------------------------------------------------------------ Global Variabls ------------------------------------------------------------ //
// Gets a reference to the body element to be able to place our other elements
const bodyElement = document.body;
// Holds the current campaign ID for navigation
let currentSelectedCampaignID = null;
let currentSelectedCampaignScenarioOrder = null;
// Holds the current active players of selected campaign
let activePlayers = [];
// Fetches all Arkham Horror Campaigns from my backend
let allCampaigns = await LoadAllCampaigns();
// Fetches all listed players in DB
const allPlayersDict = await FetchAllPlayers();
const allPlayersArray = Object.entries(allPlayersDict).map(([id, name]) => ({ id, name }));
// Default for dropdown to check against to make sure there are valid values
const dropdownDefault = { Name: "-", Value: "" };
// Creates a container that holds all the new elements we need.
const newContainer = document.createElement("div");
newContainer.classList = "flex-1 h-screen";
bodyElement.append(newContainer);
async function LoadAllCampaigns() {
  const url = "http://localhost:3000/arkhamlcg/campaigns";
  const response = await fetch(url);
  const result = await response.json();
  return result;
}
async function FetchAllPlayers() {
  const url = "http://localhost:3000/players";
  const response = await fetch(url);
  const responseJson = await response.json();
  // AI Solution
  const result = Object.fromEntries(responseJson.map((player) => [player.id, player.name]));
  //
  return result;
}

// ------------------------------------------------------------ Display All Campaigns ------------------------------------------------------------ //
async function displayArkhamHorrorCampaigns() {
  // Create the Title object and allow it 20% of the screen
  const title = document.createElement("h1");
  const titelText = document.createTextNode(`${"Arkham Horror: LCG"}`);
  title.classList = "text-center bg-red-100 h-1/5";
  title.appendChild(titelText);
  newContainer.append(title);

  //Create a container for the search bar, add and remove
  const searchbarDiv = document.createElement("div");
  searchbarDiv.classList = "grid grid-cols-10";
  const searchbarText = document.createElement("h1");
  const text = document.createTextNode("Searchbar");
  searchbarText.classList = "text-left text-white bg-slate-950";

  searchbarText.append(text);
  //Adds modal to body
  const modal = createAddCampaignModal();
  bodyElement.append(modal);
  // Create button for adding campaign
  const addButtonClassList = "bg-green-200 hover:bg-green-300";
  createAppendableButtonObject("+", "", searchbarDiv, () => showModal(modal), addButtonClassList);

  // Appends objects to div
  searchbarDiv.append(searchbarText);
  newContainer.append(searchbarDiv);

  //Create a list element and fill it with each campaign from DB
  const campaignList = document.createElement("ul");
  allCampaigns.forEach((campaign) => {
    const liElement = document.createElement("li");
    liElement.classList = "grid grid-cols-5 grid-rows-2 odd:bg-gray-300 even:bg-gray-200 hover:bg-green-100";

    const titleDiv = document.createElement("div");

    const liTitle = document.createElement("h1");
    liTitle.addEventListener("click", () => {
      DisplaySelectedCampaignByID(campaign.id, campaign.name);
    });
    const liTitleText = document.createTextNode(`${campaign.name}`);
    liTitle.classList = "row-span-full content-center";
    liTitle.append(liTitleText);

    const removeButton = document.createElement("div");
    const removeText = document.createTextNode("-");
    removeButton.addEventListener("click", async () => {
      const url = `http://localhost:3000/arkhamlcg/campaigns/${campaign.id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await updateDisplay();
    });
    removeButton.classList = "bg-red-500 hover:bg-red-700 content-center";
    removeButton.append(removeText);

    liElement.append(liTitle);
    liElement.append(removeButton);
    campaignList.append(liElement);
  });
  newContainer.append(campaignList);
  bodyElement.append(newContainer);
}
// ------------------------------------------------------------ Display Selected Campaign by ID ------------------------------------------------------------ //
async function LoadSelectedCampaignByID(id) {
  const selectedCampaign = [];
  const url = `http://localhost:3000/arkhamlcg/scenarios/${id}`;
  const response = await fetch(url);
  const result = await response.json();
  selectedCampaign.push(result);
  return selectedCampaign;
}
async function LoadPlayersByCampaignId(id) {
  const url = `http://localhost:3000/arkhamlcg/players/${id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const players = await response.text();
  console.log(players);
}
async function DisplaySelectedCampaignByID(id, name) {
  // Sets the state value to current campaign
  currentSelectedCampaignID = id;

  // Fetches all active players for campaign
  activePlayers = await FetchActivePlayers(id);
  // Fetches all scenarios by the given ID
  const allPlayersInCampaign = await LoadPlayersByCampaignId(id);
  const selectedCampaign = await LoadSelectedCampaignByID(id);
  console.log("Selected Campaign: ", selectedCampaign);
  // Sets the current scenario order number
  currentSelectedCampaignScenarioOrder = selectedCampaign.length;
  // Clears the screen
  clearScreen(newContainer);
  // Create the Title object and allow it 20% of the screen
  const title = document.createElement("h1");
  const titelText = document.createTextNode(`${name}`);
  title.classList = "text-center bg-red-100 h-1/5";
  title.appendChild(titelText);
  newContainer.append(title);
  // Grid for area below title
  const gridDiv = createAppendableDivObject("grid", "grid grid-cols-8 h-4/5", bodyElement);
  // Player Area
  const playerArea = createAppendableDivObject("playerArea", "bg-green-200 col-span-2", gridDiv);

  const playerAreaGrid = createAppendableDivObject("playerAreaGrid", "grid grid-cols-2 grid-rows-2 gap-2 h-full", playerArea);
  for (let i = 0; i < activePlayers.length; i++) {
    const playerElement = createAppendableDivObject(`${i + 1}`, "bg-gray-200 m-2", playerAreaGrid);
    const playerH1 = document.createElement("h1");
    playerH1.append(document.createTextNode(activePlayers[i].playerName));
    playerElement.append(playerH1);

    const playerPElement = document.createElement("p");
    playerPElement.append(document.createTextNode(activePlayers[i].investigatorName));
    playerElement.append(playerPElement);
  }
  // Scenario Area
  const scenarioArea = document.createElement("div");
  scenarioArea.classList = "bg-blue-200 col-span-6";
  gridDiv.append(scenarioArea);
  // Create the list container and loop through all fetched scenarios
  const scenarioList = document.createElement("ul");
  if (selectedCampaign.length > 1) {
    let i = 0;
    selectedCampaign.forEach((scenario) => {
      const liElement = document.createElement("li");
      liElement.classList = "odd:bg-gray-300 even:bg-gray-200 hover:bg-green-100";
      const scenarioName = document.createElement("h1");
      const scenarioNameText = document.createTextNode(`${scenario[i].name}`);
      scenarioName.appendChild(scenarioNameText);
      liElement.append(scenarioName);

      scenarioList.append(liElement);
      i++;
    });
    scenarioArea.append(scenarioList);
  }

  // Button to add new scenarios
  const addButton = document.createElement("li");
  addButton.classList = "bg-gray-200 text-center hover:bg-green-100";
  addButton.addEventListener("click", () => {
    addScenarioDialog.showModal();
  });
  const addScenarioButtonTitle = document.createElement("h1");
  const addScenarioButtonTitleText = document.createTextNode(" [ + ]");
  addScenarioButtonTitle.appendChild(addScenarioButtonTitleText);
  addButton.append(addScenarioButtonTitle);
  scenarioList.append(addButton);

  scenarioArea.append(scenarioList);
  // Modal for new scenario
  const addScenarioDialog = document.createElement("dialog");
  const addScenarioH1 = document.createElement("h1");
  const addScenarioH1Text = document.createTextNode("Choose the next scenario:");
  addScenarioH1.append(addScenarioH1Text);
  addScenarioDialog.append(addScenarioH1);

  const scenarioAddDropdown = document.createElement("select");

  addDropdownWithOptGroups(allCampaignScenarios[name], scenarioAddDropdown, name);
  addDropdownWithOptGroups(standaloneScenarios, scenarioAddDropdown, "Standalone");
  addDropdownWithOptGroups(challengeScenarios, scenarioAddDropdown, "Challange Scenarios");
  addScenarioDialog.append(scenarioAddDropdown);
  //Confirm Button
  const confirmButton = document.createElement("button");
  confirmButton.classList = "bg-green-200 hover:bg-green-300 text-center";
  confirmButton.append(document.createTextNode("Confirm"));
  confirmButton.addEventListener("click", () => {
    AddScenario(scenarioAddDropdown.value, name, activePlayers);
  });
  addScenarioDialog.append(confirmButton);
  // Close Button
  const closeDialogButton = document.createElement("button");
  closeDialogButton.classList = "bg-red-100";
  closeDialogButton.append(document.createTextNode("X"));
  closeDialogButton.addEventListener("click", () => {
    addScenarioDialog.close();
  });
  addScenarioDialog.append(closeDialogButton);

  scenarioArea.append(addScenarioDialog);
  //Appends all to container
  newContainer.append(gridDiv);
}
async function FetchActivePlayers(id) {
  const url = `http://localhost:3000/arkhamlcg/campaigns/players/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const players = await response.json();

  // Coverts from numerical ID to name for use in object creation
  let activePlayers = [];
  players.forEach((p) => {
    const player = { playerName: allPlayersDict[p.player_id], investigatorName: p.investigator_name };
    activePlayers.push(player);
  });
  return activePlayers;
}
// ------------------------------------------------------------ Add & Remove Campaigns ------------------------------------------------------------ //
async function AddCampaign() {
  const validCheck = formValidilityCheck();
  if (validCheck) {
    const campaignForm = document.getElementById("addcampaignform");
    const campaignData = new FormData(campaignForm);
    const campaignObject = Object.fromEntries(campaignData);

    const playerForm = document.getElementById("addplayerform");
    const playerData = new FormData(playerForm);
    const playerObject = Object.fromEntries(playerData);

    console.log(playerObject);
    const url = "http://localhost:3000/arkhamlcg/campaigns";

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(campaignObject),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const campaignid = await response.text();
    addCampaignPlayerToDB(campaignid, playerObject);
    updateDisplay();
  } else {
    invalidFormMessage();
  }
}
async function addCampaignPlayerToDB(campaignID, playerObject) {
  const url = "http://localhost:3000/arkhamlcg/players";
  let dbObject = [];

  for (let i = 1; i < 5; i++) {
    if (playerObject["investigator_" + i] !== "" && playerObject["player_" + i] !== "") {
      const playerInvest = { player_name: playerObject["player_" + i], campaign_id: campaignID, investigator: playerObject["investigator_" + i] };
      dbObject.push(playerInvest);
    }
  }

  console.log("After ", dbObject);

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(dbObject),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
function createAddCampaignModal() {
  //Create modal for adding campaigns
  const modal = document.createElement("dialog");
  // Title elements
  const modalTitle = document.createElement("h1");
  modalTitle.append(document.createTextNode("Campaign"));
  modal.append(modalTitle);

  let campaignDiv = document.createElement("div");
  let playerDiv = document.createElement("div");
  playerDiv.classList = "hidden";

  createCampaignDiv(modal, campaignDiv, playerDiv);
  modal.append(campaignDiv);

  createPlayerDiv(modal, campaignDiv, playerDiv);
  modal.append(playerDiv);

  return modal;
}
function swapModal(campaign, player) {
  const campaignClassList = campaign.classList;
  const playerClassList = player.classList;

  campaignClassList.toggle("hidden");
  playerClassList.toggle("hidden");
}
function createCampaignDiv(modal, campaignDiv, playerDiv) {
  const form = createFormObject("addcampaignform");
  // Campaign Dropdown
  const allCampaingsCovertedArray = [];
  allCampaignsName.forEach((campaign) => {
    const campaignObject = { Name: campaign, Value: campaign };
    allCampaingsCovertedArray.push(campaignObject);
  });
  const campaignDropdown = createAppendableDropdownObject("campaign", allCampaingsCovertedArray);
  form.append(campaignDropdown);
  // Start & End Date
  createAppendableDateObject("start_date", "Start Date:", "start_date", form);
  createAppendableDateObject("end_date", "End Date:", "end_date", form);
  // Playing Status
  const campaignPlayingStatusArray = [
    { Name: "Playing", Value: "playing" },
    { Name: "Finished", Value: "finished" },
    { Name: "Abandoned", Value: "abandoned" },
  ];
  const playingStatusDropdown = createAppendableDropdownObject("playing_status", campaignPlayingStatusArray);
  form.append(playingStatusDropdown);
  // Legacy Status
  const campaignStatusArray = [
    { Name: "False", Value: false },
    { Name: "True", Value: true },
  ];
  const isLegacyStatusDropdown = createAppendableDropdownObject("is_legacy_status", campaignStatusArray);
  form.append(isLegacyStatusDropdown);
  // Append form to modal
  campaignDiv.append(form);
  // Close button elements
  createAppendableButtonObject("Close", "", campaignDiv, () => closeModal(modal), "");
  // Next page button for form
  createAppendableButtonObject("->", "", campaignDiv, () => swapModal(campaignDiv, playerDiv), "");
}
function createPlayerDiv(modal, campaignDiv, playerDiv) {
  const addPlayerForm = createFormObject("addplayerform");
  for (let i = 0; i < 4; i++) {
    const newDiv = document.createElement("div");
    newDiv.classList = "flex-box";
    // Take the investigator Array and reformat it for function
    const allInvestigatorsCoverted = [];
    allInvestigatorsCoverted.push(dropdownDefault);
    arkhamInvestigators.forEach((investigator) => {
      const invest = { Name: investigator, Value: investigator };
      allInvestigatorsCoverted.push(invest);
    });
    // Take the player Array and reformat it for function
    const allPlayersCoverted = [];
    allPlayersCoverted.push(dropdownDefault);
    allPlayersArray.forEach((player) => {
      const players = { Name: player.name, Value: player.id };
      allPlayersCoverted.push(players);
    });

    const investigatorDropdown = createAppendableDropdownObject(`investigator_${i + 1}`, allInvestigatorsCoverted);
    newDiv.append(investigatorDropdown);
    const allPlayerDropdown = createAppendableDropdownObject(`player_${i + 1}`, allPlayersCoverted);
    newDiv.append(allPlayerDropdown);
    addPlayerForm.append(newDiv);

    const allSelectElements = addPlayerForm.querySelectorAll("select");
    allSelectElements.forEach((element) => {
      element.addEventListener("change", updateFormIfValid);
    });
  }
  playerDiv.append(addPlayerForm);
  // Next page button for form
  createAppendableButtonObject("<-", "", playerDiv, () => swapModal(campaignDiv, playerDiv), "");
  // Close button elements
  createAppendableButtonObject("Close", "", playerDiv, () => closeModal(modal), "");
  // Submit button elements
  createAppendableButtonObject("Submit", "submitbutton", playerDiv, AddCampaign, "text-red-500");
}
function invalidFormMessage() {
  console.log("You have not filled in every value");
}
function updateFormIfValid() {
  const submitButton = document.getElementById("submitbutton");
  const classList = submitButton.classList;
  const validCheck = formValidilityCheck();
  console.log(`Valid Check: ${validCheck}`);
  if (validCheck) {
    classList.remove("text-red-500");
    classList.add("text-green-500");
  } else {
    classList.add("text-red-500");
    classList.remove("text-green-500");
  }
}
function formValidilityCheck() {
  const form = document.getElementById("addplayerform");
  const formData = new FormData(form);
  if (formData.get("investigator_1") !== "" && formData.get("player_1") !== "") {
    return true;
  } else {
    return false;
  }
}
function createAppendableDivObject(id, classList, parentObject) {
  const div = document.createElement("div");
  div.classList = classList;
  div.id = id;
  parentObject.append(div);

  return div;
}
// ------------------------------------------------------------ Add & Remove Players ------------------------------------------------------------ //
// Dropdown for all investigators
// Dropdown for all players
// Textbox for deck ID (Full length and just ID)

// ------------------------------------------------------------ Add & Remove Scenario ------------------------------------------------------------ //
function AddScenarioToCampaign() {}
let entityAttributeValueObject = [];
async function AddScenario(scenario, campaign, activePlayers) {
  // Pop up that shows all that campaigns scenarios, each standalone, each challange scenario.
  // When you click on one it takes you to a form based on that scenario.
  // -- Info needed --
  // Player info
  // Invest info
  // Victory Display
  // Campaign Log choices
  clearScreen(newContainer);

  //BuildAddScenarioTitleArea(scenario, campaign);
  tempTitlearea(scenario, campaign);
  //BuildAddScenarioVictoryDisplayScreen(scenario, campaign);

  //const miscArea = createAppendableDivObject("miscArea", "flex pad-1 bg-100-purple", newContainer);
  //BuildAddScenarioCampaignLogArea(miscArea);
  //buildAddScenarioOwnershipArea(miscArea);
  //buildAddScenarioPlayerArea(miscArea);
}
async function BuildAddScenarioVictoryDisplayScreen(scenario, campaign) {
  const victoryDisplay = allScenarioResolutions[campaign][scenario].victoryDisplay;
  const victoryDisplayArea = document.createElement("div");
  victoryDisplayArea.classList = "flex h-1/3 overflow-x-auto gap-2";
  victoryDisplay.forEach((victory) => {
    const img = document.createElement("img");
    img.classList = "max-w max-h flex-shrink-0 grayscale";
    img.addEventListener("click", () => {
      const classes = img.classList;
      classes.toggle("grayscale");
      const victoryDisplayID = entityAttributeValueObject.find((entity) => entity.UUID == victory.UUID);
      if (victoryDisplayID == undefined) {
        entityAttributeValueObject.push(victory);
      } else {
        entityAttributeValueObject = entityAttributeValueObject.filter((entity) => entity.UUID !== victory.UUID);
      }
      ScenarioHandler(entityAttributeValueObject);
    });

    img.src = `/img/arkham_horror_lcg/Victory Display/${victory.img}`;
    victoryDisplayArea.append(img);
  });
  newContainer.append(victoryDisplayArea);
  const test = document.Elementby;
}
function tempTitlearea(scenario, campaign) {
  console.log(campaign);
  const div = createAppendableDivObject("titleAreaScenarioDiv", "flex h-1/6", newContainer);
  const titleArea = createAppendableDivObject("titleAreaScenario", `bg-[(/img/background/${campaign}BG.jpg)]`, div);
  const title = document.createElement("h1");
  title.classList = "text-center";
  title.appendChild(document.createTextNode(`${scenario}`));
  titleArea.append(title);
}
function BuildAddScenarioTitleArea(scenario, campaign) {
  let oldResolution = null;
  const resolutionNumbers = Object.keys(allScenarioResolutions[campaign][scenario].resolution);

  const resolutionArea = createAppendableDivObject("resolutionAreaScenario", "bg-green-100 w-1/2", div);
  let resolutionArray = [];
  resolutionNumbers.forEach((res) => {
    if (res === "0") {
      const res0 = { Name: "No resolution was reached", Value: res };
      resolutionArray.push(res0);
    } else {
      const resolution = { Name: `Resolution ${res}`, Value: res };
      resolutionArray.push(resolution);
    }
  });
  const resolutionDropdown = createAppendableDropdownObject("scenarioResolution", resolutionArray);
  resolutionArea.append(resolutionDropdown);
  const playedAt = createAppendableDateObject("playedAt", "", "playedAt", resolutionArea);
  const playLocations = [
    { Name: "Table", Value: "Table" },
    { Name: "Tabletop Simulator", Value: "Tabletop Simulator" },
  ];
  const playedLocation = createAppendableDropdownObject("playedLocation", playLocations);
  resolutionArea.append(playedLocation);
  const dbButton = createAppendableButtonObject(
    "Test DB",
    "dbButton",
    resolutionArea,
    () => LogScenario(GenerateDatabaseObject(scenario)),
    "bg-red-200",
  );

  const allSelectElements = document.getElementsByName(resolutionDropdown.name);
  allSelectElements.forEach((element) => {
    element.addEventListener("change", (event) => {
      const currentResolution = allScenarioResolutions[campaign][scenario].resolution[event.target.value];

      // Removes any EAV entires from the old resolution
      if (oldResolution !== null) {
        oldResolution.forEach((res) => {
          const uniqueID = entityAttributeValueObject.find((entity) => entity.UUID == res.UUID);
          if (uniqueID !== undefined) {
            entityAttributeValueObject = entityAttributeValueObject.filter((entity) => entity.UUID !== res.UUID);
          }
        });
      }
      // Adds the correct EAV entires for the newly selected resolution
      currentResolution.forEach((res) => {
        const uniqueID = entityAttributeValueObject.find((entity) => entity.UUID == res.UUID);
        if (uniqueID == undefined) {
          entityAttributeValueObject.push(res);
        }
      });
      oldResolution = currentResolution;
      ScenarioHandler(entityAttributeValueObject);
    });
  });
}
function BuildAddScenarioCampaignLogArea(miscDiv) {
  const div = createAppendableDivObject("campaignLogArea", "w-1/3 h-1/4 bg-blue-200 flex flex-col", miscDiv);
  const title = createAppendableH1Object("campaignLogTitle", "Campaign Log", "text-center", div);

  const campaignLogList = document.createElement("ul");
  campaignLogList.id = "campaignLogList";
  div.append(campaignLogList);

  const tokenxpDiv = createAppendableDivObject("campaignLogExtra", "flex mt-auto p-1", div);
  const xpDiv = createAppendableDivObject("campaignLogExperiance", "bg-yellow-100 w-1/2", tokenxpDiv);
  createAppendablePElement("campaignLogXp", "XP: ", "text-center", xpDiv);
  const tokenDiv = createAppendableDivObject("campaignLogChaosToken", "bg-red-100 w-1/2", tokenxpDiv);
  createAppendablePElement("campaignLogToken", "Chaos Token", "text-center", tokenDiv);
}
function buildAddScenarioOwnershipArea(miscDiv) {
  const div = createAppendableDivObject("ownershipDiv", "bg-green-100 w-1/3", miscDiv);
  const title = createAppendableH1Object("ownershipTitle", "Ownership", "text-center", div);

  createAppendablePElement("ownershipCardName", "", "text-center", div);
}
function buildAddScenarioPlayerArea(miscDiv) {
  const div = createAppendableDivObject("scenarioPlayerArea", "w-1/3 h-1/4 bg-pink-200 flex flex-col", miscDiv);
  const title = createAppendableH1Object("scenarioPlayerAreaTitle", "Player Area", "text-center", div);
  const investigatorStatus = [
    { Name: "Alive", Value: "Alive" },
    { Name: "Resigned", Value: "Resigned" },
    { Name: "Defeated", Value: "Defeated" },
    { Name: "Defeated (Trauma)", Value: "Defeated (Trauma)" },
    { Name: "Defeated (Physical)", Value: "Defeated (Physical)" },
    { Name: "Driven Insane", Value: "Driven Insane" },
    { Name: "Killed", Value: "Killed" },
    { Name: "Pre Game", Value: "Pre Game" },
  ];

  const playerDiv = createAppendableDivObject("players", "", div);
  let i = 1;
  activePlayers.forEach((player) => {
    const groupDiv = createAppendableDivObject(`group${i}Div `, "flex", playerDiv);
    const players = createAppendablePElement(`player${i}Name `, `${player.playerName} `, "", groupDiv);
    players.textContent = players.textContent + " -     ";
    const invests = createAppendablePElement(`player${i}Investigator`, ` ${player.investigatorName}`, "", groupDiv);
    const dropdown = createAppendableDropdownObject(`player${i}InvestigatorStatus`, investigatorStatus);
    groupDiv.append(dropdown);
    const mentalDropdown = [
      { Name: "Mental Trauma", Value: 0 },
      { Name: 0, Value: 0 },
      { Name: 1, Value: 1 },
      { Name: 2, Value: 2 },
      { Name: 3, Value: 3 },
      { Name: 4, Value: 4 },
      { Name: 5, Value: 5 },
    ];
    const physicalDropdown = [
      { Name: "Physical Trauma", Value: 0 },
      { Name: 0, Value: 0 },
      { Name: 1, Value: 1 },
      { Name: 2, Value: 2 },
      { Name: 3, Value: 3 },
      { Name: 4, Value: 4 },
      { Name: 5, Value: 5 },
    ];
    const experianceDropdown = [
      { Name: "Experiance", Value: 0 },
      { Name: 0, Value: 0 },
      { Name: 1, Value: 1 },
      { Name: 2, Value: 2 },
      { Name: 3, Value: 3 },
      { Name: 4, Value: 4 },
      { Name: 5, Value: 5 },
    ];

    const traumaXPDiv = createAppendableDivObject("traumaXPDiv", "", groupDiv);
    const traumaMental = createAppendableDropdownObject(`player${i}MentalTrauma`, mentalDropdown);
    const traumaPhysical = createAppendableDropdownObject(`player${i}PhysicalTrauma`, physicalDropdown);
    const experiance = createAppendableDropdownObject(`player${i}Experiance`, experianceDropdown);

    traumaXPDiv.append(traumaMental);
    traumaXPDiv.append(traumaPhysical);
    traumaXPDiv.append(experiance);
    i++;
  });
}
function UpdateCampaignLog(eav) {
  const listElement = document.getElementById("campaignLogList");
  listElement.replaceChildren();
  eav.forEach((entity) => {
    if (entity.entity === "campaign_log") {
      const liElement = document.createElement("li");
      const p = document.createElement("p");
      p.textContent = entity.value;
      liElement.append(p);

      listElement.append(liElement);
    }
  });
}
function UpdateExperianceEarnt(eav) {
  const xpElement = document.getElementById("campaignLogExperiance");
  let totalXP = 0;
  eav.forEach((entity) => {
    if (entity.key === "xp_gained") {
      totalXP += entity.value;
    }
  });
  xpElement.textContent = `XP: ${totalXP}`;
}
function UpdateChaosTokens(eav) {
  const tokenElement = document.getElementById("campaignLogToken");
  let tokenText = "";
  eav.forEach((entity) => {
    if (entity.entity === "chaos_token") {
      if (entity.key.includes("added")) {
        tokenText += `+${entity.value} ${entity.name}`;
      } else if (entity.key.includes("removed")) {
      }
    }
  });
  tokenElement.textContent = tokenText;
}
function UpdateOwnership(eav) {
  const ownershipElement = document.getElementById("ownershipCardName");
  ownershipElement.replaceChildren();
  let activeInvestigators = [];

  activePlayers.forEach((player) => {
    const invest = { Name: player.investigatorName, Value: player.investigatorName };
    activeInvestigators.push(invest);
  });
  eav.forEach((entity) => {
    if (entity.key === "ownership") {
      const label = document.createElement("label");
      label.for = `${entity.name}Ownership`;
      label.append(document.createTextNode(`${entity.name}:  `));

      const activePlayersDropdown = createAppendableDropdownObject(`${entity.name}Ownership`, activeInvestigators);

      activePlayersDropdown.addEventListener("change", () => {
        entity.value = activePlayersDropdown.value;
      });

      ownershipElement.append(label);
      ownershipElement.append(activePlayersDropdown);
    }
  });
}
function ScenarioHandler(eav) {
  UpdateCampaignLog(eav);
  UpdateExperianceEarnt(eav);
  UpdateChaosTokens(eav);
  UpdateOwnership(eav);
}
async function GenerateDatabaseObject(scenario) {
  // Player Entry

  const playerID = activePlayers.map((player) =>
    allPlayersArray.find((p) => {
      return player.playerName === p.name;
    }),
  );
  console.log(playerID);
  const playerEntries = [];
  let i = 1;
  playerID.forEach((player) => {
    const mental = document.getElementsByName(`player${i}MentalTrauma`)[0].value;
    const physical = document.getElementsByName(`player${i}PhysicalTrauma`)[0].value;
    const experiance = document.getElementsByName(`player${i}Experiance`)[0].value;
    const status = document.getElementsByName(`player${i}InvestigatorStatus`)[0].value;

    const playerEntry = {
      player: player.id,
      scenario_id: "",
      xp_gained: experiance,
      mental_trauma_gained: mental,
      physical_trauma_gained: physical,
      investigator_status: status,
    };
    playerEntries.push(playerEntry);
    i++;
  });
  // Session Players

  const sessionPlayersDB = [];
  // Adds player ID for Session
  playerID.forEach((player) => {
    sessionPlayersDB.push(player.id);
  });
  // Scenario

  const location = document.getElementsByName("playedLocation");
  const resolution = document.getElementsByName("scenarioResolution");
  // Match the scenario with its type and give different order values depending on type
  const type = arkhamScenariosTypes.find((s) => {
    return s.Name === scenario;
  });
  let scenarioOrderNumber = null;
  if (type.Type === "Scenario" || type.Type === "Challange Scenario" || type.Type === "Standalone") {
    scenarioOrderNumber = currentSelectedCampaignScenarioOrder + 1;
  } else if (type.Type === "Interlude" || type.Type === "Prelude") {
    scenarioOrderNumber = currentSelectedCampaignScenarioOrder + 0.1;
  }

  const scenarioDB = {
    campaign_id: currentSelectedCampaignID,
    session_id: "",
    name: scenario,
    scenario_order: scenarioOrderNumber,
    resolution: resolution[0].value,
    is_legacy_status: false,
  };
  // Session
  const playedAt = document.getElementById("playedAt");
  const sessionDB = {
    played_at: playedAt.value,
    game: "Arkham Horror: The Card Game",
    play_location: location[0].value,
  };
  // DB Object to send to DB
  const dbObject = {
    Session: sessionDB,
    SessionPlayers: sessionPlayersDB,
    Scenario: scenarioDB,
    PlayerEntry: playerEntries,
    EAV: entityAttributeValueObject,
  };

  return dbObject;
}
async function LogScenario(data) {
  const url = "http://localhost:3000/arkhamlcg/sessions/create";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(await data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
// ------------------------------------------------------------ Utility Functions ------------------------------------------------------------ //
async function updateDisplay() {
  allCampaigns = await LoadAllCampaigns();
  newContainer.replaceChildren();
  displayArkhamHorrorCampaigns();
}
function clearScreen(constainer) {
  constainer.replaceChildren();
}
function addDropdownWithOptGroups(array, selectElement, optName) {
  const optgroup = document.createElement("optgroup");
  const optgroupH1 = document.createElement("h1");
  const optgroupH1Text = document.createTextNode(optName);
  optgroupH1.append(optgroupH1Text);
  optgroup.append(optgroupH1);

  array.forEach((element) => {
    const option = document.createElement("option");
    const optionH1 = document.createElement("h1");
    const optionH1Text = document.createTextNode(element);
    optionH1.append(optionH1Text);
    option.append(optionH1);
    optgroup.append(option);
  });
  selectElement.append(optgroup);
}
function createAppendableButtonObject(text, id, parentObject, func, classList) {
  const button = document.createElement("button");
  button.append(document.createTextNode(text));
  button.classList = classList;
  button.id = id;
  button.addEventListener("click", () => {
    func();
  });
  parentObject.append(button);
}
function closeModal(modal) {
  modal.close();
}
function showModal(modal) {
  modal.showModal();
}
function createAppendableDropdownObject(name, optionsArray) {
  const dropdown = document.createElement("select");
  dropdown.name = name;
  optionsArray.forEach((option) => {
    const newOption = document.createElement("option");
    newOption.value = option.Value;
    newOption.append(document.createTextNode(option.Name));

    dropdown.append(newOption);
  });
  return dropdown;
}
function createAppendableDateObject(id, dateText, name, parentObject) {
  // Creates a default value which is always todays date
  const rawTodayDate = new Date();
  let todayDate = rawTodayDate.toISOString();
  todayDate = todayDate.slice(0, 10);

  const label = document.createElement("label");
  label.for = id;
  label.append(document.createTextNode(dateText));
  const input = document.createElement("input");
  input.name = name;
  if (id == "start_date") {
    input.value = todayDate;
  }
  input.type = "date";
  input.id = id;

  parentObject.append(label);
  parentObject.append(input);
}
function createFormObject(id) {
  // Form
  const form = document.createElement("form");
  form.id = id;

  return form;
}
function createAppendableH1Object(id, text, classList, parentObject) {
  const title = document.createElement("h1");
  title.classList = classList;
  title.id = id;
  title.appendChild(document.createTextNode(text));
  parentObject.append(title);

  return title;
}
function createAppendablePElement(id, text, classList, parentObject) {
  const p = document.createElement("p");
  p.classList = classList;
  p.id = id;
  p.textContent = `${text} `;
  parentObject.append(p);

  return p;
}
const emptyEAVObject = {
  name: "",
  entity: "",
  version: "",
  triggerType: "",
  key: "",
  valueType: "",
  value: "",

  img: ".jpg",
};
// ------------------------------------------------------------ All Campaigns ------------------------------------------------------------ //
function generateCampaignLogEntry(trigger, entryPos, entryValue) {
  const log = {
    name: "Campaign Log",
    entity: "campaign_log",
    version: null,
    triggerType: `${trigger}`,
    key: `${entryPos}`,
    valueType: "string",
    value: `${entryValue}`,
    UUID: self.crypto.randomUUID(),
  };
  return log;
}
function generateChaosTokenEntry(tokenName, trigger, amount) {
  const token = {
    name: `${tokenName.charAt(0).toUpperCase() + tokenName.slice(1)}`,
    entity: "chaos_token",
    version: null,
    triggerType: `${trigger}`,
    key: `${tokenName}_token_added`,
    valueType: "int",
    value: amount,
    UUID: self.crypto.randomUUID(),
  };
  return token;
}
function generateBonusExperianceEntry(trigger, amount) {
  const bxp = {
    name: "Bonus Experiance",
    entity: "bonus_xp",
    version: null,
    triggerType: `${trigger}`,
    key: "xp_gained",
    valueType: "int",
    value: amount,
    UUID: self.crypto.randomUUID(),
  };
  return bxp;
}
function generateVictoryPoint(name, entity, version, trigger, amount, img) {
  const vp = {
    name: `${name}`,
    entity: `${entity}`,
    version: `${version}`,
    triggerType: `${trigger}`,
    key: "xp_gained",
    valueType: "int",
    value: amount,

    img: `${img}.jpg`,
    UUID: self.crypto.randomUUID(),
  };
  return vp;
}
function generateStoryAssetOwnership(name, version, trigger, img) {
  const card = {
    name: `${name}`,
    entity: "story_asset",
    version: `${version}`,
    triggerType: `${trigger}`,
    key: "ownership",
    valueType: "string",
    value: "",

    img: `${img}.jpg`,
    UUID: self.crypto.randomUUID(),
  };
  return card;
}
// ------------------------------------------------------------ Non-boss Victory Point ------------------------------------------------------------ //
const victoryDisplayWizardofYogSothoth = generateVictoryPoint("Wizard of Yog-Sothoth", "enemy", null, "default", 1, "02087");
// ------------------------------------------------------------ Common Entries ------------------------------------------------------------ //
const addOneSkullTokenResolution = generateChaosTokenEntry("skull", "resolution", 1);
const addOneCultistTokenResolution = generateChaosTokenEntry("cultist", "resolution", 1);
const addOneTabletTokenResolution = generateChaosTokenEntry("tablet", "resolution", 1);
const addOneElderThingTokenResolution = generateChaosTokenEntry("elderthing", "resolution", 1);

const earnOneBonusExperianceResolution = generateBonusExperianceEntry("resolution", 1);
// ------------------------------------------------------------ Nights of the Zealot ------------------------------------------------------------ //
// ------------------------------------------------------------ Dunwich Legacy ------------------------------------------------------------ //
const dunwichLegacyCampaign = [
  "Extracurricular Activity",
  "The House Always Wins",
  "Interlude I: Armitage's Fate",
  "The Miskatonic Museum",
  "The Essex County Express",
  "Blood on the Altar",
  "Interlude II: The Survivors",
  "Undimensioned and Unseen",
  "Where Doom Awaits",
  "Lost in Time and Space",
];

// >>>>> Extracurricular Activity <<<<< \\

const extracurricularActivityProfessorWarrenKidnapped = generateCampaignLogEntry("resolution", "1", "Professor Warren Rice was kidnapped");
const extracurricularActivityFailedStudents = generateCampaignLogEntry("resolution", "2", "The investigators failed to save the students");
const dunwichLegacyResolution = {
  "Extracurricular Activity": {
    victoryDisplay: [
      generateVictoryPoint("Yithian Observer", "enemy", null, "default", 1, "01177"),
      generateVictoryPoint("Yithian Observer", "enemy", null, "default", 1, "01177"),
      generateVictoryPoint("Orne Library", "location", null, "default", 1, "02050"),
      generateVictoryPoint("Dormitories", "location", null, "default", 1, "02052"),
      generateVictoryPoint("Faculty Offices", "location", "The Night is Still Young", "choice", 1, "02054"),
      generateVictoryPoint("The Experiment", "boss", null, "default", 2, "02058"),
      victoryDisplayWizardofYogSothoth,
    ],
    resolution: {
      0: [
        extracurricularActivityProfessorWarrenKidnapped,
        extracurricularActivityFailedStudents,
        addOneTabletTokenResolution,
        earnOneBonusExperianceResolution,
      ],
      1: [
        generateCampaignLogEntry("resolution", 1, "The investigators rescued Professor Warren Rice"),
        generateStoryAssetOwnership("Professor Warren Rice", "Professor of Languages", "resolution", "02061"),
        extracurricularActivityFailedStudents,
        addOneTabletTokenResolution,
      ],
      2: [extracurricularActivityProfessorWarrenKidnapped, generateCampaignLogEntry("resolution", 1, "The students were rescued")],
      3: [extracurricularActivityProfessorWarrenKidnapped, generateCampaignLogEntry("resolution", 1, "The Experiment was defeated")],
      4: [
        generateCampaignLogEntry("resolution", 1, "The investigators were unconscious for several hours"),
        extracurricularActivityProfessorWarrenKidnapped,
        earnOneBonusExperianceResolution,
        extracurricularActivityFailedStudents,
        addOneTabletTokenResolution,
      ],
    },
  },
  "The House Always Wins": {
    victoryDisplayLocations: [],
    resolution: [],
  },
};
// ------------------------------------------------------------ Arkham Horror Information ------------------------------------------------------------ //

const allCampaignsName = [
  "The Night of the Zealot",
  "Return to the Night of the Zealot",
  "The Dunwich Legacy",
  "Return to the Dunwich Legacy",
  "The Path to Carcosa",
  "Return to the Path to Carcosa",
  "The Forgotten Age",
  "Return to the Forgotten Age",
  "The Circle Undone",
  "Return to the Circle Undone",
  "The Dream-Eaters",
  "The Innsmouth Conspiracy",
  "Edge of the Earth",
  "The Scarlet Keys",
  "The Feast of Hemlock Vale",
  "The Drowned City",
  "Brethren of Ash",
  "Children of Blood",
];
const allCampaignScenarios = {
  "The Night of the Zealot": [],
  "The Dunwich Legacy": dunwichLegacyCampaign,
  "The Path to Carcosa": [],
};
const allScenarioResolutions = {
  "The Dunwich Legacy": dunwichLegacyResolution,
};
const arkhamInvestigators = [
  // Core Set (2016 / Revised 2021)
  "Roland Banks: The Fed",
  "Daisy Walker: The Librarian",
  '"Skids" O\'Toole: The Ex-Con',
  "Agnes Baker: The Waitress",
  "Wendy Adams: The Urchin",

  // The Dunwich Legacy
  "Zoey Samaras: The Chef",
  "Rex Murphy: The Reporter",
  "Jenny Barnes: The Dilettante",
  "Jim Culver: The Musician",
  '"Ashcan" Pete: The Drifter',

  // The Path to Carcosa
  "Mark Harrigan: The Soldier",
  "Minh Thi Phan: The Secretary",
  "Sefina Rousseau: The Painter",
  "Akachi Onyele: The Shaman",
  "William Yorick: The Gravedigger",
  "Lola Hayes: The Actress",

  // The Forgotten Age
  "Leo Anderson: The Expedition Leader",
  "Ursula Downs: The Explorer",
  "Finn Edwards: The Bootlegger",
  "Father Mateo: The Priest",
  "Calvin Wright: The Haunted",

  // The Circle Undone
  "Carolyn Fern: The Psychologist",
  "Joe Diamond: The Private Investigator",
  "Preston Fairmont: The Millionaire",
  "Diana Stanley: The Redeemed Cultist",
  "Rita Young: The Athlete",
  "Marie Lambeau: The Entertainer",

  // The Dream-Eaters
  "Tommy Muldoon: The Rookie Cop",
  "Mandy Thompson: The Researcher",
  "Tony Morgan: The Bounty Hunter",
  "Luke Robinson: The Dreamer",
  "Patrice Hathaway: The Violinist",

  // The Innsmouth Conspiracy
  "Sister Mary: The Nun",
  "Amanda Sharpe: The Student",
  "Trish Scarborough: The Spy",
  "Dexter Drake: The Magician",
  "Silas Marsh: The Sailor",

  // Edge of the Earth
  "Daniela Reyes: The Mechanic",
  "Norman Withers: The Astronomer",
  "Monterey Jack: The Archaeologist",
  "Lily Chen: The Martial Artist",
  "Bob Jenkins: The Salesman",

  // Investigator Starter Decks
  "Nathaniel Cho: The Boxer",
  "Harvey Walters: The Professor",
  "Winifred Habbamock: The Aviatrix",
  "Jacqueline Fine: The Psychic",
  "Stella Clark: The Letter Carrier",

  // Promotional
  "Gloria Goldberg: The Writer",

  // The Scarlet Keys
  "Carson Sinclair: The Butler",
  "Vincent Lee: The Doctor",
  "Kymani Jones: The Security Consultant",
  "Amina Zidane: The Operator",
  "Darrell Simmons: The Photographer",
  "Charlie Kane: The Politician",

  // The Feast of Hemlock Vale
  "Wilson Richards: The Handyman",
  "Kate Winthrop: The Scientist",
  "Alessandra Zorzi: The Countess",
  "Kōhaku Narukami: The Folklorist",
  "Hank Samson: The Farmhand",

  // The Drowned City
  "Marion Tavares: The Trawler",
  "Lucius Galloway: The Poet",
  "Michael McGlen: The Gangster",
  "Agatha Crane: The Parapsychologist",
  "George Barnaby: The Lawyer",

  // Chapter Two Core Set (2026 / Season 2)
  "Isabelle Barnes: The Returned",
  "Joe Diamond: The Private Investigator (Season 2)",
  "Daniela Reyes: The Mechanic (Season 2)",
  "Trish Scarborough: The Spy (Season 2)",
  "Dexter Drake: The Magician (Season 2)",

  // Chapter Two Investigator Decks (2026 / Season 2)
  "Tommy Muldoon: The Officer",
  "Carolyn Fern: The Psychologist (Season 2)",
  "André Patel: The Film Star",
  "Marie Lambeau: The Entertainer (Season 2)",
  "Miguel de la Cruz: The Rancher",

  // Parallel Investigators (full parallel, or front/back used independently)
  "Daisy Walker: The Librarian (Parallel)",
  "Daisy Walker: The Librarian (Parallel F)",
  "Daisy Walker: The Librarian (Parallel B)",

  '"Skids" O\'Toole: The Ex-Con (Parallel)',
  '"Skids" O\'Toole: The Ex-Con (Parallel F)',
  '"Skids" O\'Toole: The Ex-Con (Parallel B)',

  "Agnes Baker: The Waitress (Parallel)",
  "Agnes Baker: The Waitress (Parallel F)",
  "Agnes Baker: The Waitress (Parallel B)",

  "Roland Banks: The Fed (Parallel)",
  "Roland Banks: The Fed (Parallel F)",
  "Roland Banks: The Fed (Parallel B)",

  "Wendy Adams: The Urchin (Parallel)",
  "Wendy Adams: The Urchin (Parallel F)",
  "Wendy Adams: The Urchin (Parallel B)",

  '"Ashcan" Pete: The Drifter (Parallel)',
  '"Ashcan" Pete: The Drifter (Parallel F)',
  '"Ashcan" Pete: The Drifter (Parallel B)',

  "Jim Culver: The Musician (Parallel)",
  "Jim Culver: The Musician (Parallel F)",
  "Jim Culver: The Musician (Parallel B)",

  "Zoey Samaras: The Chef (Parallel)",
  "Zoey Samaras: The Chef (Parallel F)",
  "Zoey Samaras: The Chef (Parallel B)",

  "Monterey Jack: The Archaeologist (Parallel)",
  "Monterey Jack: The Archaeologist (Parallel F)",
  "Monterey Jack: The Archaeologist (Parallel B)",

  "Rex Murphy: The Reporter (Parallel)",
  "Rex Murphy: The Reporter (Parallel F)",
  "Rex Murphy: The Reporter (Parallel B)",

  "Jenny Barnes: The Dilettante (Parallel)",
  "Jenny Barnes: The Dilettante (Parallel F)",
  "Jenny Barnes: The Dilettante (Parallel B)",

  "Father Mateo: The Priest (Parallel)",
  "Father Mateo: The Priest (Parallel F)",
  "Father Mateo: The Priest (Parallel B)",

  "Lola Hayes: The Actress (Parallel)",
  "Lola Hayes: The Actress (Parallel F)",
  "Lola Hayes: The Actress (Parallel B)",
];
const standaloneScenarios = [
  "Curse of the Rougarou",
  "Carnevale of Horrors",
  "The Labyrinths of Lunacy",
  "Guardians of the Abyss",
  "Murder at the Excelsior Hotel",
  "Barkham Horror: The Meddling of Meowlathotep",
  "The Blob That Ate Everything",
  "War of the Outer Gods",
  "Machinations Through Time",
  "Fortune and Folly",
  "The Blob That Ate Everything Else!",
  "The Midwinter Gala",
  "Film Fatale",
];
const challengeScenarios = [
  "Read or Die",
  "All or Nothing",
  "Bad Blood",
  "By the Book",
  "Red Tide Rising",
  "On the Road Again",
  "Laid to Rest",
  "Path of the Righteous",
  "Relics of the Past",
  "Hunting for Answers",
  "Pistols and Pearls",
  "Aura of Faith",
  "Enthralling Encore",
];
const arkhamScenariosTypes = [
  // Night of the Zealot (no interludes)
  { Name: "The Gathering", Type: "Scenario" },
  { Name: "The Midnight Masks", Type: "Scenario" },
  { Name: "The Devourer Below", Type: "Scenario" },

  // The Dunwich Legacy
  { Name: "Extracurricular Activity", Type: "Scenario" },
  { Name: "The House Always Wins", Type: "Scenario" },
  { Name: "Armitage's Fate", Type: "Interlude" },
  { Name: "The Miskatonic Museum", Type: "Scenario" },
  { Name: "The Essex County Express", Type: "Scenario" },
  { Name: "Blood on the Altar", Type: "Scenario" },
  { Name: "The Survivors", Type: "Interlude" },
  { Name: "Undimensioned and Unseen", Type: "Scenario" },
  { Name: "Where Doom Awaits", Type: "Scenario" },
  { Name: "Lost in Time and Space", Type: "Scenario" },

  // The Path to Carcosa
  { Name: "Curtain Call", Type: "Scenario" },
  { Name: "The Last King", Type: "Scenario" },
  { Name: "Lunacy's Reward", Type: "Interlude" },
  { Name: "Echoes of the Past", Type: "Scenario" },
  { Name: "The Unspeakable Oath", Type: "Scenario" },
  { Name: "Lost Soul", Type: "Interlude" },
  { Name: "A Phantom of Truth", Type: "Scenario" },
  { Name: "The Pallid Mask", Type: "Scenario" },
  { Name: "Black Stars Rise", Type: "Scenario" },
  { Name: "Dim Carcosa", Type: "Scenario" },

  // The Forgotten Age
  { Name: "Prologue", Type: "Prelude" },
  { Name: "The Untamed Wilds", Type: "Scenario" },
  { Name: "Restless Nights", Type: "Interlude" },
  { Name: "The Doom of Eztli", Type: "Scenario" },
  { Name: "Expedition's End", Type: "Interlude" },
  { Name: "Threads of Fate", Type: "Scenario" },
  { Name: "The Boundary Beyond", Type: "Scenario" },
  { Name: "The Jungle Beckons", Type: "Interlude" },
  { Name: "Heart of the Elders", Type: "Scenario" },
  { Name: "The City of Archives", Type: "Scenario" },
  { Name: "Those Held Captive", Type: "Interlude" },
  { Name: "The Depths of Yoth", Type: "Scenario" },
  { Name: "The Darkness", Type: "Interlude" },
  { Name: "Shattered Aeons", Type: "Scenario" },
  { Name: "Turn Back Time", Type: "Scenario" },

  // The Circle Undone (interlude titles unverified — see note)
  { Name: "Disappearance at the Twilight Estate", Type: "Scenario" },
  { Name: "The Witching Hour", Type: "Scenario" },
  { Name: "At Death's Doorstep", Type: "Scenario" },
  { Name: "The Secret Name", Type: "Scenario" },
  { Name: "The Wages of Sin", Type: "Scenario" },
  { Name: "For the Greater Good", Type: "Scenario" },
  { Name: "Union and Disillusion", Type: "Scenario" },
  { Name: "In the Clutches of Chaos", Type: "Scenario" },
  { Name: "Before the Black Throne", Type: "Scenario" },

  // The Dream-Eaters (interlude titles unverified)
  { Name: "Beyond the Gates of Sleep", Type: "Scenario" },
  { Name: "Waking Nightmare", Type: "Scenario" },
  { Name: "The Search for Kadath", Type: "Scenario" },
  { Name: "A Thousand Shapes of Horror", Type: "Scenario" },
  { Name: "Dark Side of the Moon", Type: "Scenario" },
  { Name: "Point of No Return", Type: "Scenario" },
  { Name: "Where the Gods Dwell", Type: "Scenario" },
  { Name: "Weaver of the Cosmos", Type: "Scenario" },

  // The Innsmouth Conspiracy (interlude titles unverified)
  { Name: "The Pit of Despair", Type: "Scenario" },
  { Name: "The Vanishing of Elina Harper", Type: "Scenario" },
  { Name: "In Too Deep", Type: "Scenario" },
  { Name: "Devil Reef", Type: "Scenario" },
  { Name: "Horror in High Gear", Type: "Scenario" },
  { Name: "A Light in the Fog", Type: "Scenario" },
  { Name: "The Lair of Dagon", Type: "Scenario" },
  { Name: "Into the Maelstrom", Type: "Scenario" },

  // Standalone Scenarios
  { Name: "Curse of the Rougarou", Type: "Standalone" },
  { Name: "Carnevale of Horrors", Type: "Standalone" },
  { Name: "The Labyrinths of Lunacy", Type: "Standalone" },
  { Name: "Guardians of the Abyss", Type: "Standalone" },
  { Name: "Murder at the Excelsior Hotel", Type: "Standalone" },
  { Name: "Barkham Horror: The Meddling of Meowlathotep", Type: "Standalone" },
  { Name: "The Blob That Ate Everything", Type: "Standalone" },
  { Name: "War of the Outer Gods", Type: "Standalone" },
  { Name: "Machinations Through Time", Type: "Standalone" },
  { Name: "Fortune and Folly", Type: "Standalone" },
  { Name: "The Blob That Ate Everything Else!", Type: "Standalone" },
  { Name: "The Midwinter Gala", Type: "Standalone" },
  { Name: "Film Fatale", Type: "Standalone" },

  // Challenge Scenarios (Parallel Investigator packs)
  { Name: "Read or Die", Type: "Challenge Scenario" },
  { Name: "All or Nothing", Type: "Challenge Scenario" },
  { Name: "Bad Blood", Type: "Challenge Scenario" },
  { Name: "By the Book", Type: "Challenge Scenario" },
  { Name: "Red Tide Rising", Type: "Challenge Scenario" },
  { Name: "On the Road Again", Type: "Challenge Scenario" },
  { Name: "Laid to Rest", Type: "Challenge Scenario" },
  { Name: "Path of the Righteous", Type: "Challenge Scenario" },
  { Name: "Relics of the Past", Type: "Challenge Scenario" },
  { Name: "Hunting for Answers", Type: "Challenge Scenario" },
  { Name: "Pistols and Pearls", Type: "Challenge Scenario" },
  { Name: "Aura of Faith", Type: "Challenge Scenario" },
  { Name: "Enthralling Encore", Type: "Challenge Scenario" },
];
// ------------------------------------------------------------ Exports ------------------------------------------------------------ //
export { displayArkhamHorrorCampaigns };
