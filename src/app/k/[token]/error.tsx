"use client";

import { GButton, GuestFrame, StatusBlock } from "@/components/guest/ui";

export default function RewardLoadError({ retry }: { error: Error; retry: () => void }) {
  return (
    <GuestFrame venueName="StoryPerk" footer={<GButton onClick={() => retry()}>Pokušaj ponovo</GButton>}>
      <StatusBlock icon="cross" title="Nagrada nije učitana">
        Proveri internet i pokušaj ponovo. Ako problem ostane, skeniraj ponovo QR kod.
      </StatusBlock>
    </GuestFrame>
  );
}
