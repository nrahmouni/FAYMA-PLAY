import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Child Profiles for personalized multi-kid learning
export const childProfiles = pgTable('child_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  name: text('name').notNull(),
  avatar: text('avatar').notNull().default('🦁'),
  nativeLanguage: text('native_language').notNull().default('es'),
  targetLanguage: text('target_language').notNull().default('en'),
  totalStars: integer('total_stars').notNull().default(0),
  level: integer('level').notNull().default(1),
  streak: integer('streak').notNull().default(0),
  lastActive: timestamp('last_active').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Game Sessions history and scores
export const gameSessions = pgTable('game_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  childId: integer('child_id').references(() => childProfiles.id),
  gameType: text('game_type').notNull(),
  targetLanguage: text('target_language').notNull(),
  score: integer('score').notNull().default(0),
  starsEarned: integer('stars_earned').notNull().default(0),
  accuracy: integer('accuracy').notNull().default(100),
  completedAt: timestamp('completed_at').defaultNow(),
});

// Learned vocabulary tracker
export const learnedWords = pgTable('learned_words', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  childId: integer('child_id').references(() => childProfiles.id),
  word: text('word').notNull(),
  translation: text('translation').notNull(),
  targetLanguage: text('target_language').notNull(),
  nativeLanguage: text('native_language').notNull(),
  masteryLevel: integer('mastery_level').notNull().default(1),
  timesPracticed: integer('times_practiced').notNull().default(1),
  lastPracticed: timestamp('last_practiced').defaultNow(),
});

// Table relations
export const usersRelations = relations(users, ({ many }) => ({
  childProfiles: many(childProfiles),
  gameSessions: many(gameSessions),
  learnedWords: many(learnedWords),
}));

export const childProfilesRelations = relations(childProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [childProfiles.userId],
    references: [users.id],
  }),
  gameSessions: many(gameSessions),
  learnedWords: many(learnedWords),
}));

export const gameSessionsRelations = relations(gameSessions, ({ one }) => ({
  user: one(users, {
    fields: [gameSessions.userId],
    references: [users.id],
  }),
  child: one(childProfiles, {
    fields: [gameSessions.childId],
    references: [childProfiles.id],
  }),
}));

export const learnedWordsRelations = relations(learnedWords, ({ one }) => ({
  user: one(users, {
    fields: [learnedWords.userId],
    references: [users.id],
  }),
  child: one(childProfiles, {
    fields: [learnedWords.childId],
    references: [childProfiles.id],
  }),
}));
