export const activeCampaigns = [
  {
    id: 1,
    game: "Arkham Horror LCG",
    name: "Sample campaign A",
    completed: 3,
    total: 8,
    next: "Scenario 4",
    lastPlayed: "2 days ago",
  },
  {
    id: 2,
    game: "Marvel Champions",
    name: "Sample campaign B",
    completed: 2,
    total: 5,
    next: "Scenario 3",
    lastPlayed: "1 week ago",
  },
];

export const games = [
  {
    id: 1,
    slug: "arkham",
    name: "Arkham Horror LCG",
    plays: 32,
    lastPlayed: "2 days ago",
    activeCampaigns: 1,
  },
  {
    id: 2,
    slug: "marvel",
    name: "Marvel Champions",
    plays: 19,
    lastPlayed: "1 week ago",
    activeCampaigns: 1,
  },
  {
    id: 3,
    slug: "arnak",
    name: "Lost Ruins of Arnak",
    plays: 1,
    lastPlayed: "3 weeks ago",
    activeCampaigns: 0,
  },
  {
    id: 4,
    slug: "lotr",
    name: "Lord of the Rings LCG",
    plays: 12,
    lastPlayed: "2 months ago",
    activeCampaigns: 0,
  },
];

export const recentSessions = [
  { id: 1, slug: "arkham", game: "Arkham Horror LCG", label: "Scenario 4", result: "Win", date: "2 days ago" },
  { id: 2, slug: "marvel", game: "Marvel Champions", label: "Scenario 3", result: "Loss", date: "5 days ago" },
  { id: 3, slug: "marvel", game: "Marvel Champions", label: "Scenario 3", result: "Win", date: "1 week ago" },
  { id: 4, slug: "lotr", game: "Lord of the Rings LCG", label: "Standalone", result: "Win", date: "2 weeks ago" },
  { id: 5, slug: "arnak", game: "Lost Ruins of Arnak", label: "Solo", result: "Loss", date: "3 weeks ago" },
];
