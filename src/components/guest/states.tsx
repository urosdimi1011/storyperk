import { GuestFrame, StatusBlock } from "./ui";

/** C2 — lokal je pauzirao nagradu (ili mu je istekla pretplata). */
export function OfferInactive({ venueName }: { venueName: string }) {
  return (
    <GuestFrame venueName={venueName} step={1}>
      <StatusBlock icon="pause" title="Ponuda trenutno nije aktivna">
        {venueName} je pauzirao nagradu. Pitaj osoblje kada ponovo počinje.
      </StatusBlock>
    </GuestFrame>
  );
}

/** Posle validUntil (npr. 22:00) nove nagrade se ne izdaju do sutra. */
export function ClosedToday({ venueName, until }: { venueName: string; until: string }) {
  return (
    <GuestFrame venueName={venueName} step={1}>
      <StatusBlock icon="pause" title="Za danas je kraj">
        Nagrade se dele do {until}. Dođi sutra i objavi Story.
      </StatusBlock>
    </GuestFrame>
  );
}

/** K2 — lokal je dostigao dnevni broj nagrada. */
export function SoldOut({ venueName }: { venueName: string }) {
  return (
    <GuestFrame venueName={venueName} step={1}>
      <StatusBlock icon="pause" title="Nagrade za danas su podeljene">
        Dođi sutra ili pitaj osoblje kada ponovo počinje.
      </StatusBlock>
    </GuestFrame>
  );
}
