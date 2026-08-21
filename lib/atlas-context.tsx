import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { atlasPriorityOptions, atlasValueOptions } from "@/constants/atlas";
import { starterActions, type ActionItem } from "@/lib/atlas-data";
import { getRecommendationForPrompt, type DecisionRecommendation } from "@/lib/decision-engine";
import { haptic } from "@/lib/haptics";

type AtlasProfile = { name: string; priorities: string[]; values: string[] };
type AtlasContextValue = {
  ready: boolean; onboarded: boolean; profile: AtlasProfile; actions: ActionItem[];
  aiOpen: boolean; lensOpen: boolean; scannerOpen: boolean; aiQuery: string; aiAnswer: DecisionRecommendation | null; lensResult: boolean; lensBarcode: string | null;
  updateName: (name: string) => void; togglePriority: (priority: (typeof atlasPriorityOptions)[number]) => void; toggleValue: (value: (typeof atlasValueOptions)[number]) => void; completeOnboarding: () => void; reopenOnboarding: () => void;
  toggleAction: (id: string) => void; addAction: (title: string, detail?: string) => void; openAI: (seed?: string) => void; closeAI: () => void; setAIQuery: (value: string) => void; submitAI: () => void;
  openLens: () => void; closeLens: () => void; showLensResult: () => void; resetLens: () => void; openScanner: () => void; closeScanner: () => void; setLensBarcode: (barcode: string | null) => void;
};
const STORAGE_KEY = "atlas-sanctum-local-state-v1";
const defaultProfile: AtlasProfile = { name: "Eugene", priorities: ["Health", "Financial security", "Career"], values: ["Health", "Security", "Learning"] };
const AtlasContext = createContext<AtlasContextValue | undefined>(undefined);

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false); const [onboarded, setOnboarded] = useState(false); const [profile, setProfile] = useState<AtlasProfile>(defaultProfile); const [actions, setActions] = useState<ActionItem[]>(starterActions);
  const [aiOpen, setAiOpen] = useState(false); const [lensOpen, setLensOpen] = useState(false); const [scannerOpen, setScannerOpen] = useState(false); const [aiQuery, setAiQuery] = useState(""); const [aiAnswer, setAiAnswer] = useState<DecisionRecommendation | null>(null); const [lensResult, setLensResult] = useState(false); const [lensBarcode, setLensBarcode] = useState<string | null>(null);
  useEffect(() => { AsyncStorage.getItem(STORAGE_KEY).then((saved) => { if (!saved) return; const parsed = JSON.parse(saved) as Pick<AtlasContextValue, "onboarded" | "profile" | "actions">; if (typeof parsed.onboarded === "boolean") setOnboarded(parsed.onboarded); if (parsed.profile) setProfile(parsed.profile); if (parsed.actions) setActions(parsed.actions); }).finally(() => setReady(true)); }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ onboarded, profile, actions })); }, [actions, onboarded, profile, ready]);
  const updateName = useCallback((name: string) => setProfile((previous) => ({ ...previous, name })), []);
  const togglePriority = useCallback((priority: string) => { haptic.selection(); setProfile((previous) => ({ ...previous, priorities: previous.priorities.includes(priority) ? previous.priorities.filter((item) => item !== priority) : [...previous.priorities, priority] })); }, []);
  const toggleValue = useCallback((value: string) => { haptic.selection(); setProfile((previous) => ({ ...previous, values: previous.values.includes(value) ? previous.values.filter((item) => item !== value) : [...previous.values, value] })); }, []);
  const completeOnboarding = useCallback(() => { haptic.success(); setOnboarded(true); }, []); const reopenOnboarding = useCallback(() => setOnboarded(false), []);
  const toggleAction = useCallback((id: string) => { haptic.medium(); setActions((previous) => previous.map((item) => item.id === id ? { ...item, completed: !item.completed } : item)); }, []);
  const addAction = useCallback((title: string, detail = "Atlas AI · saved to your plan") => { haptic.success(); setActions((previous) => [{ id: `${Date.now()}`, title, detail, category: "Career", completed: false }, ...previous]); }, []);
  const openAI = useCallback((seed = "") => { haptic.light(); setAiQuery(seed); setAiAnswer(seed ? getRecommendationForPrompt(seed) : null); setAiOpen(true); }, []); const closeAI = useCallback(() => setAiOpen(false), []);
  const submitAI = useCallback(() => { const question = aiQuery.trim() || "What should I prioritize today?"; haptic.light(); setAiQuery(question); setAiAnswer(getRecommendationForPrompt(question)); }, [aiQuery]);
  const openLens = useCallback(() => { haptic.light(); setLensResult(false); setLensBarcode(null); setLensOpen(true); }, []); const closeLens = useCallback(() => setLensOpen(false), []); const showLensResult = useCallback(() => { haptic.success(); setLensResult(true); }, []); const resetLens = useCallback(() => { setLensResult(false); setLensBarcode(null); }, []);
  const openScanner = useCallback(() => { haptic.light(); setScannerOpen(true); }, []); const closeScanner = useCallback(() => setScannerOpen(false), []);
  const value = useMemo<AtlasContextValue>(() => ({ ready, onboarded, profile, actions, aiOpen, lensOpen, scannerOpen, aiQuery, aiAnswer, lensResult, lensBarcode, updateName, togglePriority, toggleValue, completeOnboarding, reopenOnboarding, toggleAction, addAction, openAI, closeAI, setAIQuery: setAiQuery, submitAI, openLens, closeLens, showLensResult, resetLens, openScanner, closeScanner, setLensBarcode }), [actions, aiAnswer, aiOpen, aiQuery, closeAI, closeLens, closeScanner, completeOnboarding, lensBarcode, lensOpen, lensResult, onboarded, openAI, openLens, openScanner, profile, ready, reopenOnboarding, resetLens, scannerOpen, showLensResult, submitAI, toggleAction, togglePriority, toggleValue, updateName, addAction]);
  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>;
}
export function useAtlas() { const context = useContext(AtlasContext); if (!context) throw new Error("useAtlas must be used within AtlasProvider"); return context; }
