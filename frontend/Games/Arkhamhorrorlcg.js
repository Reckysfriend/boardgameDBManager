// ------------------------------------------------------------ Global Variabls ------------------------------------------------------------ //
// Holds the current campaign ID for navigation
let currentSelectedCampaignID = null;
// Fetches all Arkham Horror Campaigns from my backend
let allCampaigns = await LoadAllCampaigns();
// Fetches all listed players in DB
const allPlayers = await FetchAllPlayers();
console.log(allPlayers);
// Default for dropdown to check against to make sure there are valid values
const dropdownDefault = { Name: "-", Value: "" };
// Creates a container that holds all the new elements we need.
const newContainer = document.createElement("div");
newContainer.classList = "flex-1 h-screen";
async function LoadAllCampaigns() {
  const url = "http://localhost:3000/arkhamlcg/campaigns";
  const response = await fetch(url);
  const result = await response.json();
  return result;
}
async function FetchAllPlayers() {
  const url = "http://localhost:3000/players";
  const response = await fetch(url);
  const result = await response.json();
  return result;
}
// Gets a reference to the body element to be able to place our other elements
const bodyElement = document.body;

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
  return selectedCampaign;
}
async function DisplaySelectedCampaignByID(id, name) {
  // Fetches all scenarios by the given ID
  const selectedCampaign = await LoadSelectedCampaignByID(id);
  // Clears the screen
  updateDisplay();
  // Create the Title object and allow it 20% of the screen
  const title = document.createElement("h1");
  const titelText = document.createTextNode(`${name}`);
  title.classList = "text-center bg-red-100 h-1/5";
  title.appendChild(titelText);
  newContainer.append(title);
  // Grid for area below title
  const gridDiv = document.createElement("div");
  gridDiv.classList = "grid grid-cols-8 h-4/5";
  // Player Area
  const playerArea = document.createElement("div");
  playerArea.classList = "bg-green-200 col-span-2";
  gridDiv.append(playerArea);

  const playerAreaGrid = document.createElement("div");
  playerArea.append(playerAreaGrid);
  playerAreaGrid.classList = "grid grid-cols-2 grid-rows-2 gap-2 h-full";
  for (let i = 0; i < 4; i++) {
    const playerElement = document.createElement("div");
    playerElement.classList = "bg-gray-200 m-2";
    playerElement.id = `player${i + 1}`;
    const playerH1 = document.createElement("h1");
    const playerH1Text = document.createTextNode(`Player ${i + 1}`);
    playerH1.append(playerH1Text);
    playerElement.append(playerH1);
    playerAreaGrid.append(playerElement);
  }
  // Scenario Area
  const scenarioArea = document.createElement("div");
  scenarioArea.classList = "bg-blue-200 col-span-6";
  gridDiv.append(scenarioArea);
  // Create the list container and loop through all fetched scenarios
  const scenarioList = document.createElement("ul");
  selectedCampaign.forEach((scenario) => {
    const liElement = document.createElement("li");
    liElement.classList = "odd:bg-gray-300 even:bg-gray-200 hover:bg-green-100";
    const scenarioName = document.createElement("h1");
    const scenarioNameText = document.createTextNode(`${scenario.name}`);
    scenarioName.appendChild(scenarioNameText);

    scenarioList.append(liElement);
  });
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
    AddScenario(scenarioAddDropdown.value, name);
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
    allPlayers.forEach((player) => {
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
// ------------------------------------------------------------ Add & Remove Players ------------------------------------------------------------ //
// Dropdown for all investigators
// Dropdown for all players
// Textbox for deck ID (Full length and just ID)

// ------------------------------------------------------------ Add & Remove Scenario ------------------------------------------------------------ //
function AddScenarioToCampaign() {}
let entityAttributeValueObject = [];
async function AddScenario(scenario, campaign) {
  // Pop up that shows all that campaigns scenarios, each standalone, each challange scenario.
  // When you click on one it takes you to a form based on that scenario.
  // -- Info needed --
  // Player info
  // Invest info
  // Victory Display
  // Campaign Log choices
  BuildAddScenarioVictoryDisplayScreen(scenario, campaign);
}
async function BuildAddScenarioVictoryDisplayScreen(scenario, campaign) {
  const victoryDisplay = allScenarioResolutions[campaign][scenario].victoryDisplay;
  updateDisplay();
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
    });
    img.src = `/img/arkham_horror_lcg/Victory Display/${victory.img}`;
    victoryDisplayArea.append(img);
  });
  newContainer.append(victoryDisplayArea);
  const test = document.Elementby;
}
// ------------------------------------------------------------ Utility Functions ------------------------------------------------------------ //
async function updateDisplay() {
  allCampaigns = await LoadAllCampaigns();
  newContainer.replaceChildren();
  displayArkhamHorrorCampaigns();
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
}
// ------------------------------------------------------------ Non-boss Victory Point ------------------------------------------------------------ //
const victoryDisplayWizardofYogSothoth = generateVictoryPoint("Wizard of Yog-Sothoth", "enemy", null, "default", 1, "02087");
const victoryDisplayYithianObserver = generateVictoryPoint("Yithian Observer", "enemy", null, "default", 1, "01177");
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
const extracurricularActivityFailedStudents = generateCampaignLogEntry("resolution", "2", "the investigators failed to save the students");
const dunwichLegacyResolution = {
  "Extracurricular Activity": {
    victoryDisplay: [
      victoryDisplayYithianObserver,
      victoryDisplayYithianObserver,
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
        generateCampaignLogEntry("resolution", 1, "the investigators rescued Professor Warren Rice"),
        generateStoryAssetOwnership("Professor Warren Rice", "Professor of Languages", "resolution", "02061"),
        extracurricularActivityFailedStudents,
        addOneTabletTokenResolution,
      ],
      2: [extracurricularActivityProfessorWarrenKidnapped, generateCampaignLogEntry("resolution", 1, "the students were rescued")],
      3: [extracurricularActivityProfessorWarrenKidnapped, generateCampaignLogEntry("resolution", 1, "the Experiment was defeated")],
      4: [
        generateCampaignLogEntry("resolution", 1, "the investigators were unconscious for several hours"),
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

// ------------------------------------------------------------ Exports ------------------------------------------------------------ //
export { displayArkhamHorrorCampaigns };
