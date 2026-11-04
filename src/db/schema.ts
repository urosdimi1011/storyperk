import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const subscriptionStatus = pgEnum("subscription_status", [
  "trial",
  "active",
  "expired",
  "suspended",
]);

export const userRole = pgEnum("user_role", ["owner", "admin"]);

/** Lokal. Pretplatu vodi StoryPerk ručno, po ugovoru. */
export const venues = pgTable("venues", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  igUsername: text("ig_username").notNull(),
  /** ID profesionalnog IG naloga (entry.id u webhook-u). */
  igUserId: text("ig_user_id").unique(),
  igAccessToken: text("ig_access_token"),
  subscriptionStatus: subscriptionStatus("subscription_status").notNull().default("trial"),
  subscriptionUntil: date("subscription_until"),
  contractNote: text("contract_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  role: userRole("role").notNull().default("owner"),
  venueId: uuid("venue_id").references(() => venues.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const loginCodes = pgTable("login_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  codeHash: text("code_hash").notNull(),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** MVP: jedna ponuda po lokalu. */
export const offers = pgTable("offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  venueId: uuid("venue_id")
    .notNull()
    .unique()
    .references(() => venues.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  terms: text("terms").notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  activeMinutes: integer("active_minutes").notNull().default(10),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Sirovi webhook događaji — Meta nema istoriju, pa sve čuvamo. */
export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  payload: jsonb("payload").notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  error: text("error"),
});

export const storyMentions = pgTable("story_mentions", {
  id: uuid("id").primaryKey().defaultRandom(),
  venueId: uuid("venue_id")
    .notNull()
    .references(() => venues.id, { onDelete: "cascade" }),
  /** Instagram-scoped ID gosta (sender.id). */
  guestIgId: text("guest_ig_id").notNull(),
  /** message.mid — štiti od duple obrade istog događaja. */
  messageId: text("message_id").notNull().unique(),
  /** CDN link story-ja. Sam sadržaj ne smemo da čuvamo (Meta pravila). */
  storyUrl: text("story_url"),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
});

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    venueId: uuid("venue_id")
      .notNull()
      .references(() => venues.id, { onDelete: "cascade" }),
    offerId: uuid("offer_id")
      .notNull()
      .references(() => offers.id, { onDelete: "cascade" }),
    guestIgId: text("guest_ig_id").notNull(),
    token: text("token").notNull().unique(),
    code: text("code").notNull(),
    /** Kopija nagrade u trenutku izdavanja — izmena ponude ne menja izdate kupone. */
    rewardTitle: text("reward_title").notNull(),
    rewardTerms: text("reward_terms").notNull().default(""),
    activeMinutes: integer("active_minutes").notNull(),
    /** Dan izdavanja po beogradskom vremenu (YYYY-MM-DD) — za dnevni limit. */
    dayKey: text("day_key").notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
    activateBy: timestamp("activate_by", { withTimezone: true }).notNull(),
    activatedAt: timestamp("activated_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("coupons_daily_limit").on(t.venueId, t.guestIgId, t.dayKey)],
);

export type Venue = typeof venues.$inferSelect;
export type Offer = typeof offers.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type User = typeof users.$inferSelect;
