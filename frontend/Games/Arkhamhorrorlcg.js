async function displayArkhamHorror() {
  // Fetches all Arkham Horror Campaigns from my backend
  const allCampaigns = await LoadAllCampaigns();
  // Gets a reference to the body element to be able to place our other elements
  const bodyElement = document.body;
  // Creates a container that holds all the new elements we need.
  const newContainer = document.createElement("div");
  newContainer.classList = "flex-1 h-screen";
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
  //Create modal for adding campaigns
  const addCampaignDialog = document.createElement("dialog");
  // Title elements
  const addCampaignDialogTitle = document.createElement("h1");
  const addCampaignDialogTitleText = document.createTextNode("Add Campaign!");
  addCampaignDialogTitle.append(addCampaignDialogTitleText);
  addCampaignDialog.append(addCampaignDialogTitle);
  // Campaign Dropdown
  const campaignNameDropDown = document.createElement("select");

  // Start & End Date
  // Status
  // Legacy Statuts
  // Close button elements
  const closeCampaignDialog = document.createElement("button");
  const closeCampaignDialogText = document.createTextNode("Close");
  closeCampaignDialog.addEventListener("click", () => {
    addCampaignDialog.close();
  });

  closeCampaignDialog.append(closeCampaignDialogText);
  addCampaignDialog.append(closeCampaignDialog);
  bodyElement.append(addCampaignDialog);
  // Create button for adding campaign and adding the modal from above to it
  const addButton = document.createElement("button");
  const addText = document.createTextNode("+");
  addButton.classList = "bg-green-200 hover:bg-green-300";
  addButton.addEventListener("click", () => {
    addCampaignDialog.showModal();
  });

  addButton.append(addText);
  searchbarDiv.append(searchbarText);
  searchbarDiv.append(addButton);
  newContainer.append(searchbarDiv);

  //Create a list element and fill it with each campaign from DB
  const campaignList = document.createElement("ul");
  allCampaigns.forEach((campaign) => {
    const liElement = document.createElement("li");
    liElement.classList =
      "grid grid-cols-5 grid-rows-2 odd:bg-gray-300 even:bg-gray-200";

    const titleDiv = document.createElement("div");
    const liTitle = document.createElement("h1");
    const liTitleText = document.createTextNode(`${campaign.name}`);
    liTitle.classList = "row-span-full content-center";
    liTitle.append(liTitleText);

    const removeButton = document.createElement("div");
    const removeText = document.createTextNode("-");
    removeButton.classList = "bg-red-500 hover:bg-red-700 content-center";
    removeButton.append(removeText);

    liElement.append(liTitle);
    liElement.append(removeButton);
    campaignList.append(liElement);
  });
  newContainer.append(campaignList);
  bodyElement.append(newContainer);
}

async function LoadAllCampaigns() {
  const url = "http://localhost:3000/arkhamlcg/campaigns";
  const response = await fetch(url);
  const result = await response.json();
  return result;
}

async function LoadSelectedCampaignByID(id) {
  container.innerHTML = "";
  const selected_campaign = all_Loaded_Campaigns.find(
    (campaigns) => campaigns.id == id,
  );
  // Loop all scenarios and find all with a campaing ID matching our campaign ID
  const selected_scenarios = all_Loaded_Scenarios.filter(
    (scenarios) => scenarios.campaign_id == id,
  );
  // Fetches the relevant scenarios from our dictionary
  const select_Campaigns_Scenarios =
    campaign_Scenario_Dictonary[selected_campaign.name];

  // Loops through all scenarios in the campaign
  select_Campaigns_Scenarios.forEach((scenario) => {
    //Creates a div element to store the title of each scenario
    const newDiv = document.createElement("div");
    const newH1 = document.createElement("h1");
    let newContent = "";
    const played_Scenario = selected_scenarios.find(
      (scenario_played) => scenario_played.name == scenario,
    );
    if (played_Scenario == undefined) {
      newContent = document.createTextNode(scenario);
      newH1.appendChild(newContent);
      newDiv.classList = "bg-gray-200";
    } else {
      newContent = document.createTextNode(
        `${scenario} (Resolution ${played_Scenario.resolution})`,
      );
      newH1.appendChild(newContent);
      newDiv.classList = "bg-green-200";
      newDiv.addEventListener("click", (e) => {
        LoadSelectedScenarioByID(played_Scenario.id);
      });
    }

    newDiv.appendChild(newH1);
    container.appendChild(newDiv);
  });

  title.innerHTML = selected_campaign.name;
}
async function AddCampaign() {
  console.log("Added campaign!");
}

export { displayArkhamHorror };

// Arrays of  information from the game //

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
