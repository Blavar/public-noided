import { pgTable, varchar, serial, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const Users = pgTable('Users', {
    username: varchar('username').primaryKey().notNull(),
    password: varchar('password').notNull(),
    role: varchar('role').default('user')
});

export const Threads = pgTable( 'Threads', {
    id: serial('id').primaryKey(),
    title: varchar('title').notNull(),
    user: varchar('user').references( () => Users.username, {onDelete: 'set default'} ).default('None'),
    created: timestamp('created').defaultNow(),
    lastPosted: timestamp('lastPosted').defaultNow()
});

export const Posts = pgTable('Posts', {

    id: uuid('id').primaryKey().defaultRandom(),
    content: text('content').notNull(),
    created: timestamp('created').defaultNow().notNull(),
    edited: timestamp('edited'),
    user: varchar('user').references( () => Users.username, {onDelete: 'set default'} ).default('None'),
    thread: integer('thread').references( () => Threads.id, {onDelete: 'cascade'} ).notNull()
});