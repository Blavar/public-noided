import {db} from '../platform/index.js';
import RepoBuilder from './RepoBuilder.js';

import { eq, lt, gte, ne } from 'drizzle-orm';

import {Users} from '../drizzle/schema.js';

const builder = new RepoBuilder( Users );
builder.buildCRUD();

const UsersRepo = builder.build();

export default UsersRepo;