import { GuestFrame, StatusBlock } from "@/components/guest/ui";

export default function InvalidRewardLink() {
  return (
    <GuestFrame venueName="StoryPerk">
      <StatusBlock icon="cross" title="Ovaj link nije ispravan">
        Nagrada ne može da se otvori preko ovog linka. Skeniraj ponovo QR kod na stolu.
      </StatusBlock>
    </GuestFrame>
  );
}
