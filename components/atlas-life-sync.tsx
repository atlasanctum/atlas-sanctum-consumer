import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { useAtlasLife } from "@/lib/atlas-life-context";

export function AtlasLifeSync() { const { isAuthenticated } = useAuth(); const life = useAtlasLife(); const hydrated = useRef(false); const lastSaved = useRef(""); const remote = trpc.atlas.life.snapshot.useQuery(undefined, { enabled: isAuthenticated && life.ready, retry: false }); const save = trpc.atlas.life.saveSnapshot.useMutation(); const snapshot = life.exportSnapshot();
  useEffect(() => { if (!hydrated.current && remote.data?.payloadJson) { try { life.hydrateSnapshot(JSON.parse(remote.data.payloadJson)); hydrated.current = true; } catch { hydrated.current = true; } } else if (!remote.isLoading) hydrated.current = true; }, [life, remote.data?.payloadJson, remote.isLoading]);
  useEffect(() => { if (!isAuthenticated || !life.ready || !hydrated.current || save.isPending || snapshot === lastSaved.current) return; lastSaved.current = snapshot; save.mutate({ payloadJson: snapshot }); }, [isAuthenticated, life.ready, save, snapshot]);
  return null;
}
