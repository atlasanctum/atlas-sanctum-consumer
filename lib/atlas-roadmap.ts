export type AtlasRoadmapDomain = "wallet" | "food" | "health" | "lens" | "wardrobe" | "mobility" | "learning" | "opportunities" | "projects" | "community" | "marketplace" | "impact";

export type AtlasDomainBlueprint = {
  id: AtlasRoadmapDomain;
  title: string;
  eyebrow: string;
  icon: string;
  agent: string;
  prompt: string;
  prepareAction: string;
  safety: string;
  connection: string;
};

export const roadmapDomains: AtlasDomainBlueprint[] = [
  { id: "wallet", title: "Wallet", eyebrow: "FINANCIAL CLARITY", icon: "account-balance-wallet", agent: "Finance Agent", prompt: "Help me make a cautious weekly spending plan using only information I have chosen to share. Explain trade-offs and do not recommend transfers or investments.", prepareAction: "Review my weekly spending plan", safety: "Planning guidance only. Atlas never moves money, opens accounts, or places investments.", connection: "Financial connection optional" },
  { id: "food", title: "Food", eyebrow: "MEAL AND PANTRY", icon: "restaurant", agent: "Food Agent", prompt: "Help me prepare a budget-aware meal and pantry plan. Ask about dietary needs rather than assuming them.", prepareAction: "Prepare a grocery and meal plan", safety: "Nutrition context is educational and should be adjusted for personal dietary needs.", connection: "Pantry and food context optional" },
  { id: "health", title: "Health", eyebrow: "WELLNESS PLANNING", icon: "favorite", agent: "Wellness Agent", prompt: "Help me organise a wellness check-in, activity, recovery, and appointment-preparation plan without diagnosing or treating a condition.", prepareAction: "Prepare my wellness check-in", safety: "Atlas supports organisation and planning, not medical diagnosis or treatment.", connection: "Health records require explicit consent" },
  { id: "lens", title: "Atlas Lens", eyebrow: "PRODUCT INTELLIGENCE", icon: "center-focus-strong", agent: "Commerce Agent", prompt: "Help me compare a product with repair, used, and long-term-value alternatives. Cite available evidence and identify uncertainty.", prepareAction: "Compare a repair-first product option", safety: "Verify product claims, price, and availability before purchasing.", connection: "Camera and product evidence optional" },
  { id: "wardrobe", title: "Wardrobe", eyebrow: "OWNED FIRST", icon: "checkroom", agent: "Home Agent", prompt: "Help me inventory an item, find an existing alternative, and decide between repair, reuse, resale, donation, or purchase.", prepareAction: "Review my wardrobe before buying", safety: "Atlas prepares options; it never lists, sells, or donates an item without confirmation.", connection: "Wardrobe inventory optional" },
  { id: "mobility", title: "Mobility", eyebrow: "CHOICE COMPARISON", icon: "directions-bike", agent: "Mobility Agent", prompt: "Compare walk, bike, transit, and car for my trip using the priorities I choose: time, cost, health, and impact.", prepareAction: "Compare my mobility options", safety: "Travel estimates require user-provided route context and are not live navigation directions.", connection: "Location context optional" },
  { id: "learning", title: "Learning", eyebrow: "CAPABILITY PASSPORT", icon: "school", agent: "Capability Agent", prompt: "Turn a goal into a skills, evidence, project, and learning plan. Separate verified evidence from inferred potential.", prepareAction: "Create a capability learning path", safety: "Atlas suggests learning paths; completion and portfolio claims remain user-controlled.", connection: "Learning history optional" },
  { id: "opportunities", title: "Opportunities", eyebrow: "FIT AND MOMENTUM", icon: "explore", agent: "Opportunity Agent", prompt: "Help me evaluate an opportunity for fit, learning, likely effort, and impact. Do not submit anything for me.", prepareAction: "Review a matched opportunity", safety: "Atlas can prepare application tasks but never submits an application without confirmation.", connection: "Skills and goals optional" },
  { id: "projects", title: "Projects", eyebrow: "FROM INTENT TO OUTCOME", icon: "assignment", agent: "Project Agent", prompt: "Turn my idea into a project with objectives, milestones, risks, and a realistic first action.", prepareAction: "Create a project milestone", safety: "Plans are adjustable; external commitments remain user-confirmed.", connection: "Project context optional" },
  { id: "community", title: "Community", eyebrow: "PARTICIPATE WELL", icon: "groups", agent: "Community Agent", prompt: "Help me find a meaningful way to contribute to a community initiative while respecting my capacity and commitments.", prepareAction: "Prepare a community contribution", safety: "Atlas never joins, donates to, or contacts a community on your behalf.", connection: "Community interests optional" },
  { id: "marketplace", title: "Circular Marketplace", eyebrow: "USE LONGER", icon: "recycling", agent: "Commerce Agent", prompt: "Find the repair, used, refurbished, share, resale, donation, and recycling paths before recommending a new purchase.", prepareAction: "Evaluate a circular product pathway", safety: "Marketplace results are informational; every transaction needs explicit confirmation.", connection: "Retail evidence optional" },
  { id: "impact", title: "Impact", eyebrow: "CONTRIBUTION ACCOUNTING", icon: "volunteer-activism", agent: "Impact Agent", prompt: "Help me record a contribution with an appropriate verified, supported, estimated, reported, or unknown evidence status.", prepareAction: "Record a reported contribution", safety: "Atlas never turns a report or estimate into a verified impact claim.", connection: "Impact evidence optional" },
];

export const domainById = (id: AtlasRoadmapDomain) => roadmapDomains.find((domain) => domain.id === id)!;
