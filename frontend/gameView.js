import { displayArkhamHorrorCampaigns } from "./Games/Arkhamhorrorlcg";

const allGame = ["Arkham Horror: LCG", "Lord of the Rings: LCG", "Lost Ruins of Arnak", "Final Girl", "Mage Knight"];

const allGames = [
  {
    Name: "Arkham Horror: LCG",
    Func: displayArkhamHorrorCampaigns,
    BG: "bg-green-200",
  },
];
function createGameDisplay() {
  // Creates container object to store all games within
  const newContainer = document.createElement("div");
  const bodyElement = document.body;
  newContainer.classList = "grid grid-cols-4 gap-4  bg-sky-100";
  bodyElement.append(newContainer);
  // Loops through all games and creates a object to visalize of them
  allGames.forEach((game) => {
    const newDiv = document.createElement("div");
    newDiv.classList = `${game.BG} hover:bg-green-400 text-center`;
    newDiv.addEventListener("click", game.Func);

    const newH1 = document.createElement("h1");
    const newContent = document.createTextNode(`${game.Name}`);
    newH1.appendChild(newContent);

    newDiv.appendChild(newH1);
    newContainer.appendChild(newDiv);
  });
}

//createGameDisplay();

displayArkhamHorrorCampaigns();
