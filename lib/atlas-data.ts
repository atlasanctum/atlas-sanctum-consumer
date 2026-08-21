export type ActionItem = { id: string; title: string; detail: string; category: "Health" | "Money" | "Career" | "Home" | "Food"; completed: boolean };

export const starterActions: ActionItem[] = [
  { id: "walk", title: "Take a 25-minute momentum walk", detail: "Health · before 11:00", category: "Health", completed: false },
  { id: "food", title: "Plan three low-waste dinners", detail: "Food · saves time and spending later", category: "Food", completed: false },
  { id: "career", title: "Review the AI systems learning path", detail: "Career · 45 minute focus block", category: "Career", completed: false },
];

export const opportunities = [
  { id: "opportunity-1", eyebrow: "CAREER · 92% FIT", title: "Applied AI systems cohort", description: "A practical peer learning circle that matches your AI-engineering goal.", action: "Add learning cohort to my plan" },
  { id: "opportunity-2", eyebrow: "COMMUNITY · 88% FIT", title: "Neighborhood repair exchange", description: "Share tools, repair household goods, and meet nearby collaborators.", action: "Explore the repair exchange" },
  { id: "opportunity-3", eyebrow: "IMPACT · 84% FIT", title: "Local food resilience project", description: "Contribute skills to an open food-sharing network in your area.", action: "Save the food resilience project" },
] as const;

export const productScores = [
  { label: "Value", value: "88" }, { label: "Quality", value: "91" }, { label: "Health", value: "76" }, { label: "Environment", value: "71" }, { label: "Trust", value: "84" }, { label: "Long-term", value: "90" },
] as const;
