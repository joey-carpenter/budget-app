import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const BudgetScalarFieldEnumSchema = z.enum(['id','name','description','totalAmount','ownerId','createdAt','updatedAt']);

export const ExpenseScalarFieldEnumSchema = z.enum(['id','description','amount','budgetId','date','notes','createdAt','updatedAt']);

export const TagScalarFieldEnumSchema = z.enum(['id','name']);

export const BudgetManagerScalarFieldEnumSchema = z.enum(['id','budgetId','userId','permissions']);

export const PostScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt','createdById']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state','refresh_token_expires_in']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// BUDGET SCHEMA
/////////////////////////////////////////

export const BudgetSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  totalAmount: z.number(),
  ownerId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Budget = z.infer<typeof BudgetSchema>

// BUDGET OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const BudgetOptionalDefaultsSchema = BudgetSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type BudgetOptionalDefaults = z.infer<typeof BudgetOptionalDefaultsSchema>

/////////////////////////////////////////
// EXPENSE SCHEMA
/////////////////////////////////////////

export const ExpenseSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  amount: z.number(),
  budgetId: z.string(),
  date: z.coerce.date(),
  notes: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Expense = z.infer<typeof ExpenseSchema>

// EXPENSE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ExpenseOptionalDefaultsSchema = ExpenseSchema.merge(z.object({
  id: z.string().uuid().optional(),
  date: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type ExpenseOptionalDefaults = z.infer<typeof ExpenseOptionalDefaultsSchema>

/////////////////////////////////////////
// TAG SCHEMA
/////////////////////////////////////////

export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export type Tag = z.infer<typeof TagSchema>

// TAG OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const TagOptionalDefaultsSchema = TagSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type TagOptionalDefaults = z.infer<typeof TagOptionalDefaultsSchema>

/////////////////////////////////////////
// BUDGET MANAGER SCHEMA
/////////////////////////////////////////

export const BudgetManagerSchema = z.object({
  id: z.string().uuid(),
  budgetId: z.string(),
  userId: z.string(),
  permissions: JsonValueSchema,
})

export type BudgetManager = z.infer<typeof BudgetManagerSchema>

// BUDGET MANAGER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const BudgetManagerOptionalDefaultsSchema = BudgetManagerSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type BudgetManagerOptionalDefaults = z.infer<typeof BudgetManagerOptionalDefaultsSchema>

/////////////////////////////////////////
// POST SCHEMA
/////////////////////////////////////////

export const PostSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdById: z.string(),
})

export type Post = z.infer<typeof PostSchema>

// POST OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const PostOptionalDefaultsSchema = PostSchema.merge(z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type PostOptionalDefaults = z.infer<typeof PostOptionalDefaultsSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
  refresh_token_expires_in: z.number().int().nullable(),
})

export type Account = z.infer<typeof AccountSchema>

// ACCOUNT OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const AccountOptionalDefaultsSchema = AccountSchema.merge(z.object({
  id: z.string().cuid().optional(),
}))

export type AccountOptionalDefaults = z.infer<typeof AccountOptionalDefaultsSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().cuid(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

// SESSION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const SessionOptionalDefaultsSchema = SessionSchema.merge(z.object({
  id: z.string().cuid().optional(),
}))

export type SessionOptionalDefaults = z.infer<typeof SessionOptionalDefaultsSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

// USER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  id: z.string().cuid().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

// VERIFICATION TOKEN OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const VerificationTokenOptionalDefaultsSchema = VerificationTokenSchema.merge(z.object({
}))

export type VerificationTokenOptionalDefaults = z.infer<typeof VerificationTokenOptionalDefaultsSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// BUDGET
//------------------------------------------------------

export const BudgetIncludeSchema: z.ZodType<Prisma.BudgetInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  expenses: z.union([z.boolean(),z.lazy(() => ExpenseFindManyArgsSchema)]).optional(),
  managers: z.union([z.boolean(),z.lazy(() => BudgetManagerFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BudgetCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const BudgetArgsSchema: z.ZodType<Prisma.BudgetDefaultArgs> = z.object({
  select: z.lazy(() => BudgetSelectSchema).optional(),
  include: z.lazy(() => BudgetIncludeSchema).optional(),
}).strict();

export const BudgetCountOutputTypeArgsSchema: z.ZodType<Prisma.BudgetCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => BudgetCountOutputTypeSelectSchema).nullish(),
}).strict();

export const BudgetCountOutputTypeSelectSchema: z.ZodType<Prisma.BudgetCountOutputTypeSelect> = z.object({
  expenses: z.boolean().optional(),
  managers: z.boolean().optional(),
}).strict();

export const BudgetSelectSchema: z.ZodType<Prisma.BudgetSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  totalAmount: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  expenses: z.union([z.boolean(),z.lazy(() => ExpenseFindManyArgsSchema)]).optional(),
  managers: z.union([z.boolean(),z.lazy(() => BudgetManagerFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BudgetCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EXPENSE
//------------------------------------------------------

export const ExpenseIncludeSchema: z.ZodType<Prisma.ExpenseInclude> = z.object({
  budget: z.union([z.boolean(),z.lazy(() => BudgetArgsSchema)]).optional(),
  tags: z.union([z.boolean(),z.lazy(() => TagFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ExpenseCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ExpenseArgsSchema: z.ZodType<Prisma.ExpenseDefaultArgs> = z.object({
  select: z.lazy(() => ExpenseSelectSchema).optional(),
  include: z.lazy(() => ExpenseIncludeSchema).optional(),
}).strict();

export const ExpenseCountOutputTypeArgsSchema: z.ZodType<Prisma.ExpenseCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ExpenseCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ExpenseCountOutputTypeSelectSchema: z.ZodType<Prisma.ExpenseCountOutputTypeSelect> = z.object({
  tags: z.boolean().optional(),
}).strict();

export const ExpenseSelectSchema: z.ZodType<Prisma.ExpenseSelect> = z.object({
  id: z.boolean().optional(),
  description: z.boolean().optional(),
  amount: z.boolean().optional(),
  budgetId: z.boolean().optional(),
  date: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  budget: z.union([z.boolean(),z.lazy(() => BudgetArgsSchema)]).optional(),
  tags: z.union([z.boolean(),z.lazy(() => TagFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ExpenseCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TAG
//------------------------------------------------------

export const TagIncludeSchema: z.ZodType<Prisma.TagInclude> = z.object({
  expenses: z.union([z.boolean(),z.lazy(() => ExpenseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TagCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TagArgsSchema: z.ZodType<Prisma.TagDefaultArgs> = z.object({
  select: z.lazy(() => TagSelectSchema).optional(),
  include: z.lazy(() => TagIncludeSchema).optional(),
}).strict();

export const TagCountOutputTypeArgsSchema: z.ZodType<Prisma.TagCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TagCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TagCountOutputTypeSelectSchema: z.ZodType<Prisma.TagCountOutputTypeSelect> = z.object({
  expenses: z.boolean().optional(),
}).strict();

export const TagSelectSchema: z.ZodType<Prisma.TagSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  expenses: z.union([z.boolean(),z.lazy(() => ExpenseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TagCountOutputTypeArgsSchema)]).optional(),
}).strict()

// BUDGET MANAGER
//------------------------------------------------------

export const BudgetManagerIncludeSchema: z.ZodType<Prisma.BudgetManagerInclude> = z.object({
  budget: z.union([z.boolean(),z.lazy(() => BudgetArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const BudgetManagerArgsSchema: z.ZodType<Prisma.BudgetManagerDefaultArgs> = z.object({
  select: z.lazy(() => BudgetManagerSelectSchema).optional(),
  include: z.lazy(() => BudgetManagerIncludeSchema).optional(),
}).strict();

export const BudgetManagerSelectSchema: z.ZodType<Prisma.BudgetManagerSelect> = z.object({
  id: z.boolean().optional(),
  budgetId: z.boolean().optional(),
  userId: z.boolean().optional(),
  permissions: z.boolean().optional(),
  budget: z.union([z.boolean(),z.lazy(() => BudgetArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// POST
//------------------------------------------------------

export const PostIncludeSchema: z.ZodType<Prisma.PostInclude> = z.object({
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const PostArgsSchema: z.ZodType<Prisma.PostDefaultArgs> = z.object({
  select: z.lazy(() => PostSelectSchema).optional(),
  include: z.lazy(() => PostIncludeSchema).optional(),
}).strict();

export const PostSelectSchema: z.ZodType<Prisma.PostSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  createdById: z.boolean().optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  type: z.boolean().optional(),
  provider: z.boolean().optional(),
  providerAccountId: z.boolean().optional(),
  refresh_token: z.boolean().optional(),
  access_token: z.boolean().optional(),
  expires_at: z.boolean().optional(),
  token_type: z.boolean().optional(),
  scope: z.boolean().optional(),
  id_token: z.boolean().optional(),
  session_state: z.boolean().optional(),
  refresh_token_expires_in: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  sessionToken: z.boolean().optional(),
  userId: z.boolean().optional(),
  expires: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  posts: z.union([z.boolean(),z.lazy(() => PostFindManyArgsSchema)]).optional(),
  ownedBudgets: z.union([z.boolean(),z.lazy(() => BudgetFindManyArgsSchema)]).optional(),
  managedBudgets: z.union([z.boolean(),z.lazy(() => BudgetManagerFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  accounts: z.boolean().optional(),
  sessions: z.boolean().optional(),
  posts: z.boolean().optional(),
  ownedBudgets: z.boolean().optional(),
  managedBudgets: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  posts: z.union([z.boolean(),z.lazy(() => PostFindManyArgsSchema)]).optional(),
  ownedBudgets: z.union([z.boolean(),z.lazy(() => BudgetFindManyArgsSchema)]).optional(),
  managedBudgets: z.union([z.boolean(),z.lazy(() => BudgetManagerFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSelectSchema: z.ZodType<Prisma.VerificationTokenSelect> = z.object({
  identifier: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const BudgetWhereInputSchema: z.ZodType<Prisma.BudgetWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BudgetWhereInputSchema),z.lazy(() => BudgetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BudgetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BudgetWhereInputSchema),z.lazy(() => BudgetWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  totalAmount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  expenses: z.lazy(() => ExpenseListRelationFilterSchema).optional(),
  managers: z.lazy(() => BudgetManagerListRelationFilterSchema).optional()
}).strict();

export const BudgetOrderByWithRelationInputSchema: z.ZodType<Prisma.BudgetOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  expenses: z.lazy(() => ExpenseOrderByRelationAggregateInputSchema).optional(),
  managers: z.lazy(() => BudgetManagerOrderByRelationAggregateInputSchema).optional()
}).strict();

export const BudgetWhereUniqueInputSchema: z.ZodType<Prisma.BudgetWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => BudgetWhereInputSchema),z.lazy(() => BudgetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BudgetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BudgetWhereInputSchema),z.lazy(() => BudgetWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  totalAmount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  expenses: z.lazy(() => ExpenseListRelationFilterSchema).optional(),
  managers: z.lazy(() => BudgetManagerListRelationFilterSchema).optional()
}).strict());

export const BudgetOrderByWithAggregationInputSchema: z.ZodType<Prisma.BudgetOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BudgetCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => BudgetAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BudgetMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BudgetMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => BudgetSumOrderByAggregateInputSchema).optional()
}).strict();

export const BudgetScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BudgetScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BudgetScalarWhereWithAggregatesInputSchema),z.lazy(() => BudgetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BudgetScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BudgetScalarWhereWithAggregatesInputSchema),z.lazy(() => BudgetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  totalAmount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ExpenseWhereInputSchema: z.ZodType<Prisma.ExpenseWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ExpenseWhereInputSchema),z.lazy(() => ExpenseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseWhereInputSchema),z.lazy(() => ExpenseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  budgetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  budget: z.union([ z.lazy(() => BudgetScalarRelationFilterSchema),z.lazy(() => BudgetWhereInputSchema) ]).optional(),
  tags: z.lazy(() => TagListRelationFilterSchema).optional()
}).strict();

export const ExpenseOrderByWithRelationInputSchema: z.ZodType<Prisma.ExpenseOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  budgetId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  budget: z.lazy(() => BudgetOrderByWithRelationInputSchema).optional(),
  tags: z.lazy(() => TagOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ExpenseWhereUniqueInputSchema: z.ZodType<Prisma.ExpenseWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => ExpenseWhereInputSchema),z.lazy(() => ExpenseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseWhereInputSchema),z.lazy(() => ExpenseWhereInputSchema).array() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  budgetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  budget: z.union([ z.lazy(() => BudgetScalarRelationFilterSchema),z.lazy(() => BudgetWhereInputSchema) ]).optional(),
  tags: z.lazy(() => TagListRelationFilterSchema).optional()
}).strict());

export const ExpenseOrderByWithAggregationInputSchema: z.ZodType<Prisma.ExpenseOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  budgetId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ExpenseCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ExpenseAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ExpenseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ExpenseMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ExpenseSumOrderByAggregateInputSchema).optional()
}).strict();

export const ExpenseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ExpenseScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ExpenseScalarWhereWithAggregatesInputSchema),z.lazy(() => ExpenseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseScalarWhereWithAggregatesInputSchema),z.lazy(() => ExpenseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  budgetId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TagWhereInputSchema: z.ZodType<Prisma.TagWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expenses: z.lazy(() => ExpenseListRelationFilterSchema).optional()
}).strict();

export const TagOrderByWithRelationInputSchema: z.ZodType<Prisma.TagOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  expenses: z.lazy(() => ExpenseOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TagWhereUniqueInputSchema: z.ZodType<Prisma.TagWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    name: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  expenses: z.lazy(() => ExpenseListRelationFilterSchema).optional()
}).strict());

export const TagOrderByWithAggregationInputSchema: z.ZodType<Prisma.TagOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TagCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TagMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TagMinOrderByAggregateInputSchema).optional()
}).strict();

export const TagScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TagScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TagScalarWhereWithAggregatesInputSchema),z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagScalarWhereWithAggregatesInputSchema),z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const BudgetManagerWhereInputSchema: z.ZodType<Prisma.BudgetManagerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BudgetManagerWhereInputSchema),z.lazy(() => BudgetManagerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BudgetManagerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BudgetManagerWhereInputSchema),z.lazy(() => BudgetManagerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  budgetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  permissions: z.lazy(() => JsonFilterSchema).optional(),
  budget: z.union([ z.lazy(() => BudgetScalarRelationFilterSchema),z.lazy(() => BudgetWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const BudgetManagerOrderByWithRelationInputSchema: z.ZodType<Prisma.BudgetManagerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  budgetId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  permissions: z.lazy(() => SortOrderSchema).optional(),
  budget: z.lazy(() => BudgetOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const BudgetManagerWhereUniqueInputSchema: z.ZodType<Prisma.BudgetManagerWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    budgetId_userId: z.lazy(() => BudgetManagerBudgetIdUserIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    budgetId_userId: z.lazy(() => BudgetManagerBudgetIdUserIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  budgetId_userId: z.lazy(() => BudgetManagerBudgetIdUserIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => BudgetManagerWhereInputSchema),z.lazy(() => BudgetManagerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BudgetManagerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BudgetManagerWhereInputSchema),z.lazy(() => BudgetManagerWhereInputSchema).array() ]).optional(),
  budgetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  permissions: z.lazy(() => JsonFilterSchema).optional(),
  budget: z.union([ z.lazy(() => BudgetScalarRelationFilterSchema),z.lazy(() => BudgetWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const BudgetManagerOrderByWithAggregationInputSchema: z.ZodType<Prisma.BudgetManagerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  budgetId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  permissions: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BudgetManagerCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BudgetManagerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BudgetManagerMinOrderByAggregateInputSchema).optional()
}).strict();

export const BudgetManagerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BudgetManagerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BudgetManagerScalarWhereWithAggregatesInputSchema),z.lazy(() => BudgetManagerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BudgetManagerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BudgetManagerScalarWhereWithAggregatesInputSchema),z.lazy(() => BudgetManagerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  budgetId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  permissions: z.lazy(() => JsonWithAggregatesFilterSchema).optional()
}).strict();

export const PostWhereInputSchema: z.ZodType<Prisma.PostWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PostWhereInputSchema),z.lazy(() => PostWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PostWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PostWhereInputSchema),z.lazy(() => PostWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdBy: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const PostOrderByWithRelationInputSchema: z.ZodType<Prisma.PostOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const PostWhereUniqueInputSchema: z.ZodType<Prisma.PostWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PostWhereInputSchema),z.lazy(() => PostWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PostWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PostWhereInputSchema),z.lazy(() => PostWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdBy: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const PostOrderByWithAggregationInputSchema: z.ZodType<Prisma.PostOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PostCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PostAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PostMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PostMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PostSumOrderByAggregateInputSchema).optional()
}).strict();

export const PostScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PostScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PostScalarWhereWithAggregatesInputSchema),z.lazy(() => PostScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PostScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PostScalarWhereWithAggregatesInputSchema),z.lazy(() => PostScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdById: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refresh_token_expires_in: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refresh_token_expires_in: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AccountAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AccountSumOrderByAggregateInputSchema).optional()
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    sessionToken: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    sessionToken: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  posts: z.lazy(() => PostListRelationFilterSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetListRelationFilterSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  posts: z.lazy(() => PostOrderByRelationAggregateInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetOrderByRelationAggregateInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    email: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  posts: z.lazy(() => PostListRelationFilterSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetListRelationFilterSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const VerificationTokenWhereInputSchema: z.ZodType<Prisma.VerificationTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VerificationTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithRelationInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenWhereUniqueInputSchema: z.ZodType<Prisma.VerificationTokenWhereUniqueInput> = z.union([
  z.object({
    token: z.string(),
    identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema)
  }),
  z.object({
    token: z.string(),
  }),
  z.object({
    identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  token: z.string().optional(),
  identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const VerificationTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithAggregationInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VerificationTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VerificationTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VerificationTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const VerificationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const BudgetCreateInputSchema: z.ZodType<Prisma.BudgetCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOwnedBudgetsInputSchema),
  expenses: z.lazy(() => ExpenseCreateNestedManyWithoutBudgetInputSchema).optional(),
  managers: z.lazy(() => BudgetManagerCreateNestedManyWithoutBudgetInputSchema).optional()
}).strict();

export const BudgetUncheckedCreateInputSchema: z.ZodType<Prisma.BudgetUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  expenses: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutBudgetInputSchema).optional(),
  managers: z.lazy(() => BudgetManagerUncheckedCreateNestedManyWithoutBudgetInputSchema).optional()
}).strict();

export const BudgetUpdateInputSchema: z.ZodType<Prisma.BudgetUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOwnedBudgetsNestedInputSchema).optional(),
  expenses: z.lazy(() => ExpenseUpdateManyWithoutBudgetNestedInputSchema).optional(),
  managers: z.lazy(() => BudgetManagerUpdateManyWithoutBudgetNestedInputSchema).optional()
}).strict();

export const BudgetUncheckedUpdateInputSchema: z.ZodType<Prisma.BudgetUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expenses: z.lazy(() => ExpenseUncheckedUpdateManyWithoutBudgetNestedInputSchema).optional(),
  managers: z.lazy(() => BudgetManagerUncheckedUpdateManyWithoutBudgetNestedInputSchema).optional()
}).strict();

export const BudgetCreateManyInputSchema: z.ZodType<Prisma.BudgetCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const BudgetUpdateManyMutationInputSchema: z.ZodType<Prisma.BudgetUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BudgetUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BudgetUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseCreateInputSchema: z.ZodType<Prisma.ExpenseCreateInput> = z.object({
  id: z.string().uuid().optional(),
  description: z.string(),
  amount: z.number(),
  date: z.coerce.date().optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  budget: z.lazy(() => BudgetCreateNestedOneWithoutExpensesInputSchema),
  tags: z.lazy(() => TagCreateNestedManyWithoutExpensesInputSchema).optional()
}).strict();

export const ExpenseUncheckedCreateInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  description: z.string(),
  amount: z.number(),
  budgetId: z.string(),
  date: z.coerce.date().optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutExpensesInputSchema).optional()
}).strict();

export const ExpenseUpdateInputSchema: z.ZodType<Prisma.ExpenseUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  budget: z.lazy(() => BudgetUpdateOneRequiredWithoutExpensesNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutExpensesNestedInputSchema).optional()
}).strict();

export const ExpenseUncheckedUpdateInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  budgetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutExpensesNestedInputSchema).optional()
}).strict();

export const ExpenseCreateManyInputSchema: z.ZodType<Prisma.ExpenseCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  description: z.string(),
  amount: z.number(),
  budgetId: z.string(),
  date: z.coerce.date().optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ExpenseUpdateManyMutationInputSchema: z.ZodType<Prisma.ExpenseUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  budgetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagCreateInputSchema: z.ZodType<Prisma.TagCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  expenses: z.lazy(() => ExpenseCreateNestedManyWithoutTagsInputSchema).optional()
}).strict();

export const TagUncheckedCreateInputSchema: z.ZodType<Prisma.TagUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  expenses: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutTagsInputSchema).optional()
}).strict();

export const TagUpdateInputSchema: z.ZodType<Prisma.TagUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expenses: z.lazy(() => ExpenseUpdateManyWithoutTagsNestedInputSchema).optional()
}).strict();

export const TagUncheckedUpdateInputSchema: z.ZodType<Prisma.TagUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expenses: z.lazy(() => ExpenseUncheckedUpdateManyWithoutTagsNestedInputSchema).optional()
}).strict();

export const TagCreateManyInputSchema: z.ZodType<Prisma.TagCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
}).strict();

export const TagUpdateManyMutationInputSchema: z.ZodType<Prisma.TagUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BudgetManagerCreateInputSchema: z.ZodType<Prisma.BudgetManagerCreateInput> = z.object({
  id: z.string().uuid().optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  budget: z.lazy(() => BudgetCreateNestedOneWithoutManagersInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutManagedBudgetsInputSchema)
}).strict();

export const BudgetManagerUncheckedCreateInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  budgetId: z.string(),
  userId: z.string(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const BudgetManagerUpdateInputSchema: z.ZodType<Prisma.BudgetManagerUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  budget: z.lazy(() => BudgetUpdateOneRequiredWithoutManagersNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutManagedBudgetsNestedInputSchema).optional()
}).strict();

export const BudgetManagerUncheckedUpdateInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  budgetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const BudgetManagerCreateManyInputSchema: z.ZodType<Prisma.BudgetManagerCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  budgetId: z.string(),
  userId: z.string(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const BudgetManagerUpdateManyMutationInputSchema: z.ZodType<Prisma.BudgetManagerUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const BudgetManagerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  budgetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const PostCreateInputSchema: z.ZodType<Prisma.PostCreateInput> = z.object({
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutPostsInputSchema)
}).strict();

export const PostUncheckedCreateInputSchema: z.ZodType<Prisma.PostUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdById: z.string()
}).strict();

export const PostUpdateInputSchema: z.ZodType<Prisma.PostUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutPostsNestedInputSchema).optional()
}).strict();

export const PostUncheckedUpdateInputSchema: z.ZodType<Prisma.PostUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PostCreateManyInputSchema: z.ZodType<Prisma.PostCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdById: z.string()
}).strict();

export const PostUpdateManyMutationInputSchema: z.ZodType<Prisma.PostUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PostUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PostUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema)
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema)
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  posts: z.lazy(() => PostCreateNestedManyWithoutCreatedByInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetCreateNestedManyWithoutOwnerInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  posts: z.lazy(() => PostUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  posts: z.lazy(() => PostUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUpdateManyWithoutOwnerNestedInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  posts: z.lazy(() => PostUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const VerificationTokenCreateInputSchema: z.ZodType<Prisma.VerificationTokenCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUpdateInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenCreateManyInputSchema: z.ZodType<Prisma.VerificationTokenCreateManyInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationTokenUpdateManyMutationInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateManyInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ExpenseListRelationFilterSchema: z.ZodType<Prisma.ExpenseListRelationFilter> = z.object({
  every: z.lazy(() => ExpenseWhereInputSchema).optional(),
  some: z.lazy(() => ExpenseWhereInputSchema).optional(),
  none: z.lazy(() => ExpenseWhereInputSchema).optional()
}).strict();

export const BudgetManagerListRelationFilterSchema: z.ZodType<Prisma.BudgetManagerListRelationFilter> = z.object({
  every: z.lazy(() => BudgetManagerWhereInputSchema).optional(),
  some: z.lazy(() => BudgetManagerWhereInputSchema).optional(),
  none: z.lazy(() => BudgetManagerWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ExpenseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ExpenseOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BudgetManagerOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BudgetManagerOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BudgetCountOrderByAggregateInputSchema: z.ZodType<Prisma.BudgetCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BudgetAvgOrderByAggregateInputSchema: z.ZodType<Prisma.BudgetAvgOrderByAggregateInput> = z.object({
  totalAmount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BudgetMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BudgetMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BudgetMinOrderByAggregateInputSchema: z.ZodType<Prisma.BudgetMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BudgetSumOrderByAggregateInputSchema: z.ZodType<Prisma.BudgetSumOrderByAggregateInput> = z.object({
  totalAmount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const BudgetScalarRelationFilterSchema: z.ZodType<Prisma.BudgetScalarRelationFilter> = z.object({
  is: z.lazy(() => BudgetWhereInputSchema).optional(),
  isNot: z.lazy(() => BudgetWhereInputSchema).optional()
}).strict();

export const TagListRelationFilterSchema: z.ZodType<Prisma.TagListRelationFilter> = z.object({
  every: z.lazy(() => TagWhereInputSchema).optional(),
  some: z.lazy(() => TagWhereInputSchema).optional(),
  none: z.lazy(() => TagWhereInputSchema).optional()
}).strict();

export const TagOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TagOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseCountOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  budgetId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseAvgOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  budgetId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseMinOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  budgetId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseSumOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseSumOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagCountOrderByAggregateInputSchema: z.ZodType<Prisma.TagCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TagMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagMinOrderByAggregateInputSchema: z.ZodType<Prisma.TagMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const BudgetManagerBudgetIdUserIdCompoundUniqueInputSchema: z.ZodType<Prisma.BudgetManagerBudgetIdUserIdCompoundUniqueInput> = z.object({
  budgetId: z.string(),
  userId: z.string()
}).strict();

export const BudgetManagerCountOrderByAggregateInputSchema: z.ZodType<Prisma.BudgetManagerCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  budgetId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  permissions: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BudgetManagerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BudgetManagerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  budgetId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BudgetManagerMinOrderByAggregateInputSchema: z.ZodType<Prisma.BudgetManagerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  budgetId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const PostCountOrderByAggregateInputSchema: z.ZodType<Prisma.PostCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PostAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PostAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PostMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PostMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PostMinOrderByAggregateInputSchema: z.ZodType<Prisma.PostMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PostSumOrderByAggregateInputSchema: z.ZodType<Prisma.PostSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const AccountProviderProviderAccountIdCompoundUniqueInputSchema: z.ZodType<Prisma.AccountProviderProviderAccountIdCompoundUniqueInput> = z.object({
  provider: z.string(),
  providerAccountId: z.string()
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  refresh_token_expires_in: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  refresh_token_expires_in: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  refresh_token_expires_in: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  refresh_token_expires_in: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  refresh_token_expires_in: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.object({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.object({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional()
}).strict();

export const PostListRelationFilterSchema: z.ZodType<Prisma.PostListRelationFilter> = z.object({
  every: z.lazy(() => PostWhereInputSchema).optional(),
  some: z.lazy(() => PostWhereInputSchema).optional(),
  none: z.lazy(() => PostWhereInputSchema).optional()
}).strict();

export const BudgetListRelationFilterSchema: z.ZodType<Prisma.BudgetListRelationFilter> = z.object({
  every: z.lazy(() => BudgetWhereInputSchema).optional(),
  some: z.lazy(() => BudgetWhereInputSchema).optional(),
  none: z.lazy(() => BudgetWhereInputSchema).optional()
}).strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PostOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PostOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BudgetOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BudgetOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const VerificationTokenIdentifierTokenCompoundUniqueInputSchema: z.ZodType<Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput> = z.object({
  identifier: z.string(),
  token: z.string()
}).strict();

export const VerificationTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenCountOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMaxOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMinOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutOwnedBudgetsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOwnedBudgetsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedBudgetsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOwnedBudgetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOwnedBudgetsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ExpenseCreateNestedManyWithoutBudgetInputSchema: z.ZodType<Prisma.ExpenseCreateNestedManyWithoutBudgetInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutBudgetInputSchema),z.lazy(() => ExpenseCreateWithoutBudgetInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutBudgetInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutBudgetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutBudgetInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutBudgetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyBudgetInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BudgetManagerCreateNestedManyWithoutBudgetInputSchema: z.ZodType<Prisma.BudgetManagerCreateNestedManyWithoutBudgetInput> = z.object({
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerCreateWithoutBudgetInputSchema).array(),z.lazy(() => BudgetManagerUncheckedCreateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutBudgetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetManagerCreateOrConnectWithoutBudgetInputSchema),z.lazy(() => BudgetManagerCreateOrConnectWithoutBudgetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetManagerCreateManyBudgetInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExpenseUncheckedCreateNestedManyWithoutBudgetInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateNestedManyWithoutBudgetInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutBudgetInputSchema),z.lazy(() => ExpenseCreateWithoutBudgetInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutBudgetInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutBudgetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutBudgetInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutBudgetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyBudgetInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BudgetManagerUncheckedCreateNestedManyWithoutBudgetInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedCreateNestedManyWithoutBudgetInput> = z.object({
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerCreateWithoutBudgetInputSchema).array(),z.lazy(() => BudgetManagerUncheckedCreateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutBudgetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetManagerCreateOrConnectWithoutBudgetInputSchema),z.lazy(() => BudgetManagerCreateOrConnectWithoutBudgetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetManagerCreateManyBudgetInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const UserUpdateOneRequiredWithoutOwnedBudgetsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOwnedBudgetsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedBudgetsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOwnedBudgetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOwnedBudgetsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOwnedBudgetsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOwnedBudgetsInputSchema),z.lazy(() => UserUpdateWithoutOwnedBudgetsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOwnedBudgetsInputSchema) ]).optional(),
}).strict();

export const ExpenseUpdateManyWithoutBudgetNestedInputSchema: z.ZodType<Prisma.ExpenseUpdateManyWithoutBudgetNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutBudgetInputSchema),z.lazy(() => ExpenseCreateWithoutBudgetInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutBudgetInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutBudgetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutBudgetInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutBudgetInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutBudgetInputSchema),z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutBudgetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyBudgetInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutBudgetInputSchema),z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutBudgetInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseUpdateManyWithWhereWithoutBudgetInputSchema),z.lazy(() => ExpenseUpdateManyWithWhereWithoutBudgetInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BudgetManagerUpdateManyWithoutBudgetNestedInputSchema: z.ZodType<Prisma.BudgetManagerUpdateManyWithoutBudgetNestedInput> = z.object({
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerCreateWithoutBudgetInputSchema).array(),z.lazy(() => BudgetManagerUncheckedCreateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutBudgetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetManagerCreateOrConnectWithoutBudgetInputSchema),z.lazy(() => BudgetManagerCreateOrConnectWithoutBudgetInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BudgetManagerUpsertWithWhereUniqueWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUpsertWithWhereUniqueWithoutBudgetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetManagerCreateManyBudgetInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BudgetManagerUpdateWithWhereUniqueWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUpdateWithWhereUniqueWithoutBudgetInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BudgetManagerUpdateManyWithWhereWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUpdateManyWithWhereWithoutBudgetInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BudgetManagerScalarWhereInputSchema),z.lazy(() => BudgetManagerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ExpenseUncheckedUpdateManyWithoutBudgetNestedInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyWithoutBudgetNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutBudgetInputSchema),z.lazy(() => ExpenseCreateWithoutBudgetInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutBudgetInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutBudgetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutBudgetInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutBudgetInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutBudgetInputSchema),z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutBudgetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyBudgetInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutBudgetInputSchema),z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutBudgetInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseUpdateManyWithWhereWithoutBudgetInputSchema),z.lazy(() => ExpenseUpdateManyWithWhereWithoutBudgetInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BudgetManagerUncheckedUpdateManyWithoutBudgetNestedInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedUpdateManyWithoutBudgetNestedInput> = z.object({
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerCreateWithoutBudgetInputSchema).array(),z.lazy(() => BudgetManagerUncheckedCreateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutBudgetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetManagerCreateOrConnectWithoutBudgetInputSchema),z.lazy(() => BudgetManagerCreateOrConnectWithoutBudgetInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BudgetManagerUpsertWithWhereUniqueWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUpsertWithWhereUniqueWithoutBudgetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetManagerCreateManyBudgetInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BudgetManagerUpdateWithWhereUniqueWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUpdateWithWhereUniqueWithoutBudgetInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BudgetManagerUpdateManyWithWhereWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUpdateManyWithWhereWithoutBudgetInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BudgetManagerScalarWhereInputSchema),z.lazy(() => BudgetManagerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BudgetCreateNestedOneWithoutExpensesInputSchema: z.ZodType<Prisma.BudgetCreateNestedOneWithoutExpensesInput> = z.object({
  create: z.union([ z.lazy(() => BudgetCreateWithoutExpensesInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutExpensesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BudgetCreateOrConnectWithoutExpensesInputSchema).optional(),
  connect: z.lazy(() => BudgetWhereUniqueInputSchema).optional()
}).strict();

export const TagCreateNestedManyWithoutExpensesInputSchema: z.ZodType<Prisma.TagCreateNestedManyWithoutExpensesInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutExpensesInputSchema),z.lazy(() => TagCreateWithoutExpensesInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutExpensesInputSchema),z.lazy(() => TagUncheckedCreateWithoutExpensesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutExpensesInputSchema),z.lazy(() => TagCreateOrConnectWithoutExpensesInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TagUncheckedCreateNestedManyWithoutExpensesInputSchema: z.ZodType<Prisma.TagUncheckedCreateNestedManyWithoutExpensesInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutExpensesInputSchema),z.lazy(() => TagCreateWithoutExpensesInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutExpensesInputSchema),z.lazy(() => TagUncheckedCreateWithoutExpensesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutExpensesInputSchema),z.lazy(() => TagCreateOrConnectWithoutExpensesInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BudgetUpdateOneRequiredWithoutExpensesNestedInputSchema: z.ZodType<Prisma.BudgetUpdateOneRequiredWithoutExpensesNestedInput> = z.object({
  create: z.union([ z.lazy(() => BudgetCreateWithoutExpensesInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutExpensesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BudgetCreateOrConnectWithoutExpensesInputSchema).optional(),
  upsert: z.lazy(() => BudgetUpsertWithoutExpensesInputSchema).optional(),
  connect: z.lazy(() => BudgetWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BudgetUpdateToOneWithWhereWithoutExpensesInputSchema),z.lazy(() => BudgetUpdateWithoutExpensesInputSchema),z.lazy(() => BudgetUncheckedUpdateWithoutExpensesInputSchema) ]).optional(),
}).strict();

export const TagUpdateManyWithoutExpensesNestedInputSchema: z.ZodType<Prisma.TagUpdateManyWithoutExpensesNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutExpensesInputSchema),z.lazy(() => TagCreateWithoutExpensesInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutExpensesInputSchema),z.lazy(() => TagUncheckedCreateWithoutExpensesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutExpensesInputSchema),z.lazy(() => TagCreateOrConnectWithoutExpensesInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagUpsertWithWhereUniqueWithoutExpensesInputSchema),z.lazy(() => TagUpsertWithWhereUniqueWithoutExpensesInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagUpdateWithWhereUniqueWithoutExpensesInputSchema),z.lazy(() => TagUpdateWithWhereUniqueWithoutExpensesInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagUpdateManyWithWhereWithoutExpensesInputSchema),z.lazy(() => TagUpdateManyWithWhereWithoutExpensesInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TagUncheckedUpdateManyWithoutExpensesNestedInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyWithoutExpensesNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutExpensesInputSchema),z.lazy(() => TagCreateWithoutExpensesInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutExpensesInputSchema),z.lazy(() => TagUncheckedCreateWithoutExpensesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutExpensesInputSchema),z.lazy(() => TagCreateOrConnectWithoutExpensesInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagUpsertWithWhereUniqueWithoutExpensesInputSchema),z.lazy(() => TagUpsertWithWhereUniqueWithoutExpensesInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagUpdateWithWhereUniqueWithoutExpensesInputSchema),z.lazy(() => TagUpdateWithWhereUniqueWithoutExpensesInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagUpdateManyWithWhereWithoutExpensesInputSchema),z.lazy(() => TagUpdateManyWithWhereWithoutExpensesInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ExpenseCreateNestedManyWithoutTagsInputSchema: z.ZodType<Prisma.ExpenseCreateNestedManyWithoutTagsInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutTagsInputSchema),z.lazy(() => ExpenseCreateWithoutTagsInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutTagsInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutTagsInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExpenseUncheckedCreateNestedManyWithoutTagsInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateNestedManyWithoutTagsInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutTagsInputSchema),z.lazy(() => ExpenseCreateWithoutTagsInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutTagsInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutTagsInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExpenseUpdateManyWithoutTagsNestedInputSchema: z.ZodType<Prisma.ExpenseUpdateManyWithoutTagsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutTagsInputSchema),z.lazy(() => ExpenseCreateWithoutTagsInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutTagsInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutTagsInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseUpdateManyWithWhereWithoutTagsInputSchema),z.lazy(() => ExpenseUpdateManyWithWhereWithoutTagsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ExpenseUncheckedUpdateManyWithoutTagsNestedInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyWithoutTagsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutTagsInputSchema),z.lazy(() => ExpenseCreateWithoutTagsInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutTagsInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutTagsInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseUpdateManyWithWhereWithoutTagsInputSchema),z.lazy(() => ExpenseUpdateManyWithWhereWithoutTagsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BudgetCreateNestedOneWithoutManagersInputSchema: z.ZodType<Prisma.BudgetCreateNestedOneWithoutManagersInput> = z.object({
  create: z.union([ z.lazy(() => BudgetCreateWithoutManagersInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutManagersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BudgetCreateOrConnectWithoutManagersInputSchema).optional(),
  connect: z.lazy(() => BudgetWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutManagedBudgetsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutManagedBudgetsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutManagedBudgetsInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedBudgetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutManagedBudgetsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const BudgetUpdateOneRequiredWithoutManagersNestedInputSchema: z.ZodType<Prisma.BudgetUpdateOneRequiredWithoutManagersNestedInput> = z.object({
  create: z.union([ z.lazy(() => BudgetCreateWithoutManagersInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutManagersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BudgetCreateOrConnectWithoutManagersInputSchema).optional(),
  upsert: z.lazy(() => BudgetUpsertWithoutManagersInputSchema).optional(),
  connect: z.lazy(() => BudgetWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BudgetUpdateToOneWithWhereWithoutManagersInputSchema),z.lazy(() => BudgetUpdateWithoutManagersInputSchema),z.lazy(() => BudgetUncheckedUpdateWithoutManagersInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutManagedBudgetsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutManagedBudgetsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutManagedBudgetsInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedBudgetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutManagedBudgetsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutManagedBudgetsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutManagedBudgetsInputSchema),z.lazy(() => UserUpdateWithoutManagedBudgetsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutManagedBudgetsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutPostsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPostsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPostsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPostsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPostsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutPostsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPostsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPostsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPostsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPostsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPostsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPostsInputSchema),z.lazy(() => UserUpdateWithoutPostsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPostsInputSchema) ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
}).strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PostCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.PostCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => PostCreateWithoutCreatedByInputSchema),z.lazy(() => PostCreateWithoutCreatedByInputSchema).array(),z.lazy(() => PostUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => PostUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PostCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => PostCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PostCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PostWhereUniqueInputSchema),z.lazy(() => PostWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BudgetCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.BudgetCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => BudgetCreateWithoutOwnerInputSchema),z.lazy(() => BudgetCreateWithoutOwnerInputSchema).array(),z.lazy(() => BudgetUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => BudgetCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BudgetWhereUniqueInputSchema),z.lazy(() => BudgetWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BudgetManagerCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.BudgetManagerCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutUserInputSchema),z.lazy(() => BudgetManagerCreateWithoutUserInputSchema).array(),z.lazy(() => BudgetManagerUncheckedCreateWithoutUserInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetManagerCreateOrConnectWithoutUserInputSchema),z.lazy(() => BudgetManagerCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetManagerCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PostUncheckedCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.PostUncheckedCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => PostCreateWithoutCreatedByInputSchema),z.lazy(() => PostCreateWithoutCreatedByInputSchema).array(),z.lazy(() => PostUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => PostUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PostCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => PostCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PostCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PostWhereUniqueInputSchema),z.lazy(() => PostWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BudgetUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.BudgetUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => BudgetCreateWithoutOwnerInputSchema),z.lazy(() => BudgetCreateWithoutOwnerInputSchema).array(),z.lazy(() => BudgetUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => BudgetCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BudgetWhereUniqueInputSchema),z.lazy(() => BudgetWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BudgetManagerUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutUserInputSchema),z.lazy(() => BudgetManagerCreateWithoutUserInputSchema).array(),z.lazy(() => BudgetManagerUncheckedCreateWithoutUserInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetManagerCreateOrConnectWithoutUserInputSchema),z.lazy(() => BudgetManagerCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetManagerCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PostUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.PostUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => PostCreateWithoutCreatedByInputSchema),z.lazy(() => PostCreateWithoutCreatedByInputSchema).array(),z.lazy(() => PostUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => PostUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PostCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => PostCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PostUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => PostUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PostCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PostWhereUniqueInputSchema),z.lazy(() => PostWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PostWhereUniqueInputSchema),z.lazy(() => PostWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PostWhereUniqueInputSchema),z.lazy(() => PostWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PostWhereUniqueInputSchema),z.lazy(() => PostWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PostUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => PostUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PostUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => PostUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PostScalarWhereInputSchema),z.lazy(() => PostScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BudgetUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.BudgetUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => BudgetCreateWithoutOwnerInputSchema),z.lazy(() => BudgetCreateWithoutOwnerInputSchema).array(),z.lazy(() => BudgetUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => BudgetCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BudgetUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => BudgetUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BudgetWhereUniqueInputSchema),z.lazy(() => BudgetWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BudgetWhereUniqueInputSchema),z.lazy(() => BudgetWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BudgetWhereUniqueInputSchema),z.lazy(() => BudgetWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BudgetWhereUniqueInputSchema),z.lazy(() => BudgetWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BudgetUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => BudgetUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BudgetUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => BudgetUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BudgetScalarWhereInputSchema),z.lazy(() => BudgetScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BudgetManagerUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.BudgetManagerUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutUserInputSchema),z.lazy(() => BudgetManagerCreateWithoutUserInputSchema).array(),z.lazy(() => BudgetManagerUncheckedCreateWithoutUserInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetManagerCreateOrConnectWithoutUserInputSchema),z.lazy(() => BudgetManagerCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BudgetManagerUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => BudgetManagerUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetManagerCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BudgetManagerUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => BudgetManagerUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BudgetManagerUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => BudgetManagerUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BudgetManagerScalarWhereInputSchema),z.lazy(() => BudgetManagerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PostUncheckedUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.PostUncheckedUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => PostCreateWithoutCreatedByInputSchema),z.lazy(() => PostCreateWithoutCreatedByInputSchema).array(),z.lazy(() => PostUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => PostUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PostCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => PostCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PostUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => PostUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PostCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PostWhereUniqueInputSchema),z.lazy(() => PostWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PostWhereUniqueInputSchema),z.lazy(() => PostWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PostWhereUniqueInputSchema),z.lazy(() => PostWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PostWhereUniqueInputSchema),z.lazy(() => PostWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PostUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => PostUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PostUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => PostUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PostScalarWhereInputSchema),z.lazy(() => PostScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BudgetUncheckedUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.BudgetUncheckedUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => BudgetCreateWithoutOwnerInputSchema),z.lazy(() => BudgetCreateWithoutOwnerInputSchema).array(),z.lazy(() => BudgetUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => BudgetCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BudgetUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => BudgetUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BudgetWhereUniqueInputSchema),z.lazy(() => BudgetWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BudgetWhereUniqueInputSchema),z.lazy(() => BudgetWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BudgetWhereUniqueInputSchema),z.lazy(() => BudgetWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BudgetWhereUniqueInputSchema),z.lazy(() => BudgetWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BudgetUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => BudgetUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BudgetUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => BudgetUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BudgetScalarWhereInputSchema),z.lazy(() => BudgetScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BudgetManagerUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutUserInputSchema),z.lazy(() => BudgetManagerCreateWithoutUserInputSchema).array(),z.lazy(() => BudgetManagerUncheckedCreateWithoutUserInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BudgetManagerCreateOrConnectWithoutUserInputSchema),z.lazy(() => BudgetManagerCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BudgetManagerUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => BudgetManagerUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BudgetManagerCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BudgetManagerWhereUniqueInputSchema),z.lazy(() => BudgetManagerWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BudgetManagerUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => BudgetManagerUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BudgetManagerUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => BudgetManagerUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BudgetManagerScalarWhereInputSchema),z.lazy(() => BudgetManagerScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const UserCreateWithoutOwnedBudgetsInputSchema: z.ZodType<Prisma.UserCreateWithoutOwnedBudgetsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  posts: z.lazy(() => PostCreateNestedManyWithoutCreatedByInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOwnedBudgetsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOwnedBudgetsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  posts: z.lazy(() => PostUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOwnedBudgetsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOwnedBudgetsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedBudgetsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOwnedBudgetsInputSchema) ]),
}).strict();

export const ExpenseCreateWithoutBudgetInputSchema: z.ZodType<Prisma.ExpenseCreateWithoutBudgetInput> = z.object({
  id: z.string().uuid().optional(),
  description: z.string(),
  amount: z.number(),
  date: z.coerce.date().optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutExpensesInputSchema).optional()
}).strict();

export const ExpenseUncheckedCreateWithoutBudgetInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateWithoutBudgetInput> = z.object({
  id: z.string().uuid().optional(),
  description: z.string(),
  amount: z.number(),
  date: z.coerce.date().optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutExpensesInputSchema).optional()
}).strict();

export const ExpenseCreateOrConnectWithoutBudgetInputSchema: z.ZodType<Prisma.ExpenseCreateOrConnectWithoutBudgetInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExpenseCreateWithoutBudgetInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutBudgetInputSchema) ]),
}).strict();

export const ExpenseCreateManyBudgetInputEnvelopeSchema: z.ZodType<Prisma.ExpenseCreateManyBudgetInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ExpenseCreateManyBudgetInputSchema),z.lazy(() => ExpenseCreateManyBudgetInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const BudgetManagerCreateWithoutBudgetInputSchema: z.ZodType<Prisma.BudgetManagerCreateWithoutBudgetInput> = z.object({
  id: z.string().uuid().optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  user: z.lazy(() => UserCreateNestedOneWithoutManagedBudgetsInputSchema)
}).strict();

export const BudgetManagerUncheckedCreateWithoutBudgetInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedCreateWithoutBudgetInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const BudgetManagerCreateOrConnectWithoutBudgetInputSchema: z.ZodType<Prisma.BudgetManagerCreateOrConnectWithoutBudgetInput> = z.object({
  where: z.lazy(() => BudgetManagerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutBudgetInputSchema) ]),
}).strict();

export const BudgetManagerCreateManyBudgetInputEnvelopeSchema: z.ZodType<Prisma.BudgetManagerCreateManyBudgetInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BudgetManagerCreateManyBudgetInputSchema),z.lazy(() => BudgetManagerCreateManyBudgetInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutOwnedBudgetsInputSchema: z.ZodType<Prisma.UserUpsertWithoutOwnedBudgetsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOwnedBudgetsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOwnedBudgetsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedBudgetsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOwnedBudgetsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOwnedBudgetsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOwnedBudgetsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOwnedBudgetsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOwnedBudgetsInputSchema) ]),
}).strict();

export const UserUpdateWithoutOwnedBudgetsInputSchema: z.ZodType<Prisma.UserUpdateWithoutOwnedBudgetsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  posts: z.lazy(() => PostUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOwnedBudgetsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOwnedBudgetsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  posts: z.lazy(() => PostUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ExpenseUpsertWithWhereUniqueWithoutBudgetInputSchema: z.ZodType<Prisma.ExpenseUpsertWithWhereUniqueWithoutBudgetInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ExpenseUpdateWithoutBudgetInputSchema),z.lazy(() => ExpenseUncheckedUpdateWithoutBudgetInputSchema) ]),
  create: z.union([ z.lazy(() => ExpenseCreateWithoutBudgetInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutBudgetInputSchema) ]),
}).strict();

export const ExpenseUpdateWithWhereUniqueWithoutBudgetInputSchema: z.ZodType<Prisma.ExpenseUpdateWithWhereUniqueWithoutBudgetInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ExpenseUpdateWithoutBudgetInputSchema),z.lazy(() => ExpenseUncheckedUpdateWithoutBudgetInputSchema) ]),
}).strict();

export const ExpenseUpdateManyWithWhereWithoutBudgetInputSchema: z.ZodType<Prisma.ExpenseUpdateManyWithWhereWithoutBudgetInput> = z.object({
  where: z.lazy(() => ExpenseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ExpenseUpdateManyMutationInputSchema),z.lazy(() => ExpenseUncheckedUpdateManyWithoutBudgetInputSchema) ]),
}).strict();

export const ExpenseScalarWhereInputSchema: z.ZodType<Prisma.ExpenseScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  budgetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const BudgetManagerUpsertWithWhereUniqueWithoutBudgetInputSchema: z.ZodType<Prisma.BudgetManagerUpsertWithWhereUniqueWithoutBudgetInput> = z.object({
  where: z.lazy(() => BudgetManagerWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BudgetManagerUpdateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUncheckedUpdateWithoutBudgetInputSchema) ]),
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutBudgetInputSchema) ]),
}).strict();

export const BudgetManagerUpdateWithWhereUniqueWithoutBudgetInputSchema: z.ZodType<Prisma.BudgetManagerUpdateWithWhereUniqueWithoutBudgetInput> = z.object({
  where: z.lazy(() => BudgetManagerWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BudgetManagerUpdateWithoutBudgetInputSchema),z.lazy(() => BudgetManagerUncheckedUpdateWithoutBudgetInputSchema) ]),
}).strict();

export const BudgetManagerUpdateManyWithWhereWithoutBudgetInputSchema: z.ZodType<Prisma.BudgetManagerUpdateManyWithWhereWithoutBudgetInput> = z.object({
  where: z.lazy(() => BudgetManagerScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BudgetManagerUpdateManyMutationInputSchema),z.lazy(() => BudgetManagerUncheckedUpdateManyWithoutBudgetInputSchema) ]),
}).strict();

export const BudgetManagerScalarWhereInputSchema: z.ZodType<Prisma.BudgetManagerScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BudgetManagerScalarWhereInputSchema),z.lazy(() => BudgetManagerScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BudgetManagerScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BudgetManagerScalarWhereInputSchema),z.lazy(() => BudgetManagerScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  budgetId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  permissions: z.lazy(() => JsonFilterSchema).optional()
}).strict();

export const BudgetCreateWithoutExpensesInputSchema: z.ZodType<Prisma.BudgetCreateWithoutExpensesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOwnedBudgetsInputSchema),
  managers: z.lazy(() => BudgetManagerCreateNestedManyWithoutBudgetInputSchema).optional()
}).strict();

export const BudgetUncheckedCreateWithoutExpensesInputSchema: z.ZodType<Prisma.BudgetUncheckedCreateWithoutExpensesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  managers: z.lazy(() => BudgetManagerUncheckedCreateNestedManyWithoutBudgetInputSchema).optional()
}).strict();

export const BudgetCreateOrConnectWithoutExpensesInputSchema: z.ZodType<Prisma.BudgetCreateOrConnectWithoutExpensesInput> = z.object({
  where: z.lazy(() => BudgetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BudgetCreateWithoutExpensesInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutExpensesInputSchema) ]),
}).strict();

export const TagCreateWithoutExpensesInputSchema: z.ZodType<Prisma.TagCreateWithoutExpensesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
}).strict();

export const TagUncheckedCreateWithoutExpensesInputSchema: z.ZodType<Prisma.TagUncheckedCreateWithoutExpensesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
}).strict();

export const TagCreateOrConnectWithoutExpensesInputSchema: z.ZodType<Prisma.TagCreateOrConnectWithoutExpensesInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TagCreateWithoutExpensesInputSchema),z.lazy(() => TagUncheckedCreateWithoutExpensesInputSchema) ]),
}).strict();

export const BudgetUpsertWithoutExpensesInputSchema: z.ZodType<Prisma.BudgetUpsertWithoutExpensesInput> = z.object({
  update: z.union([ z.lazy(() => BudgetUpdateWithoutExpensesInputSchema),z.lazy(() => BudgetUncheckedUpdateWithoutExpensesInputSchema) ]),
  create: z.union([ z.lazy(() => BudgetCreateWithoutExpensesInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutExpensesInputSchema) ]),
  where: z.lazy(() => BudgetWhereInputSchema).optional()
}).strict();

export const BudgetUpdateToOneWithWhereWithoutExpensesInputSchema: z.ZodType<Prisma.BudgetUpdateToOneWithWhereWithoutExpensesInput> = z.object({
  where: z.lazy(() => BudgetWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BudgetUpdateWithoutExpensesInputSchema),z.lazy(() => BudgetUncheckedUpdateWithoutExpensesInputSchema) ]),
}).strict();

export const BudgetUpdateWithoutExpensesInputSchema: z.ZodType<Prisma.BudgetUpdateWithoutExpensesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOwnedBudgetsNestedInputSchema).optional(),
  managers: z.lazy(() => BudgetManagerUpdateManyWithoutBudgetNestedInputSchema).optional()
}).strict();

export const BudgetUncheckedUpdateWithoutExpensesInputSchema: z.ZodType<Prisma.BudgetUncheckedUpdateWithoutExpensesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  managers: z.lazy(() => BudgetManagerUncheckedUpdateManyWithoutBudgetNestedInputSchema).optional()
}).strict();

export const TagUpsertWithWhereUniqueWithoutExpensesInputSchema: z.ZodType<Prisma.TagUpsertWithWhereUniqueWithoutExpensesInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TagUpdateWithoutExpensesInputSchema),z.lazy(() => TagUncheckedUpdateWithoutExpensesInputSchema) ]),
  create: z.union([ z.lazy(() => TagCreateWithoutExpensesInputSchema),z.lazy(() => TagUncheckedCreateWithoutExpensesInputSchema) ]),
}).strict();

export const TagUpdateWithWhereUniqueWithoutExpensesInputSchema: z.ZodType<Prisma.TagUpdateWithWhereUniqueWithoutExpensesInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TagUpdateWithoutExpensesInputSchema),z.lazy(() => TagUncheckedUpdateWithoutExpensesInputSchema) ]),
}).strict();

export const TagUpdateManyWithWhereWithoutExpensesInputSchema: z.ZodType<Prisma.TagUpdateManyWithWhereWithoutExpensesInput> = z.object({
  where: z.lazy(() => TagScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TagUpdateManyMutationInputSchema),z.lazy(() => TagUncheckedUpdateManyWithoutExpensesInputSchema) ]),
}).strict();

export const TagScalarWhereInputSchema: z.ZodType<Prisma.TagScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ExpenseCreateWithoutTagsInputSchema: z.ZodType<Prisma.ExpenseCreateWithoutTagsInput> = z.object({
  id: z.string().uuid().optional(),
  description: z.string(),
  amount: z.number(),
  date: z.coerce.date().optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  budget: z.lazy(() => BudgetCreateNestedOneWithoutExpensesInputSchema)
}).strict();

export const ExpenseUncheckedCreateWithoutTagsInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateWithoutTagsInput> = z.object({
  id: z.string().uuid().optional(),
  description: z.string(),
  amount: z.number(),
  budgetId: z.string(),
  date: z.coerce.date().optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ExpenseCreateOrConnectWithoutTagsInputSchema: z.ZodType<Prisma.ExpenseCreateOrConnectWithoutTagsInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExpenseCreateWithoutTagsInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutTagsInputSchema) ]),
}).strict();

export const ExpenseUpsertWithWhereUniqueWithoutTagsInputSchema: z.ZodType<Prisma.ExpenseUpsertWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ExpenseUpdateWithoutTagsInputSchema),z.lazy(() => ExpenseUncheckedUpdateWithoutTagsInputSchema) ]),
  create: z.union([ z.lazy(() => ExpenseCreateWithoutTagsInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutTagsInputSchema) ]),
}).strict();

export const ExpenseUpdateWithWhereUniqueWithoutTagsInputSchema: z.ZodType<Prisma.ExpenseUpdateWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ExpenseUpdateWithoutTagsInputSchema),z.lazy(() => ExpenseUncheckedUpdateWithoutTagsInputSchema) ]),
}).strict();

export const ExpenseUpdateManyWithWhereWithoutTagsInputSchema: z.ZodType<Prisma.ExpenseUpdateManyWithWhereWithoutTagsInput> = z.object({
  where: z.lazy(() => ExpenseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ExpenseUpdateManyMutationInputSchema),z.lazy(() => ExpenseUncheckedUpdateManyWithoutTagsInputSchema) ]),
}).strict();

export const BudgetCreateWithoutManagersInputSchema: z.ZodType<Prisma.BudgetCreateWithoutManagersInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOwnedBudgetsInputSchema),
  expenses: z.lazy(() => ExpenseCreateNestedManyWithoutBudgetInputSchema).optional()
}).strict();

export const BudgetUncheckedCreateWithoutManagersInputSchema: z.ZodType<Prisma.BudgetUncheckedCreateWithoutManagersInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  ownerId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  expenses: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutBudgetInputSchema).optional()
}).strict();

export const BudgetCreateOrConnectWithoutManagersInputSchema: z.ZodType<Prisma.BudgetCreateOrConnectWithoutManagersInput> = z.object({
  where: z.lazy(() => BudgetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BudgetCreateWithoutManagersInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutManagersInputSchema) ]),
}).strict();

export const UserCreateWithoutManagedBudgetsInputSchema: z.ZodType<Prisma.UserCreateWithoutManagedBudgetsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  posts: z.lazy(() => PostCreateNestedManyWithoutCreatedByInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutManagedBudgetsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutManagedBudgetsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  posts: z.lazy(() => PostUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutManagedBudgetsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutManagedBudgetsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutManagedBudgetsInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedBudgetsInputSchema) ]),
}).strict();

export const BudgetUpsertWithoutManagersInputSchema: z.ZodType<Prisma.BudgetUpsertWithoutManagersInput> = z.object({
  update: z.union([ z.lazy(() => BudgetUpdateWithoutManagersInputSchema),z.lazy(() => BudgetUncheckedUpdateWithoutManagersInputSchema) ]),
  create: z.union([ z.lazy(() => BudgetCreateWithoutManagersInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutManagersInputSchema) ]),
  where: z.lazy(() => BudgetWhereInputSchema).optional()
}).strict();

export const BudgetUpdateToOneWithWhereWithoutManagersInputSchema: z.ZodType<Prisma.BudgetUpdateToOneWithWhereWithoutManagersInput> = z.object({
  where: z.lazy(() => BudgetWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BudgetUpdateWithoutManagersInputSchema),z.lazy(() => BudgetUncheckedUpdateWithoutManagersInputSchema) ]),
}).strict();

export const BudgetUpdateWithoutManagersInputSchema: z.ZodType<Prisma.BudgetUpdateWithoutManagersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOwnedBudgetsNestedInputSchema).optional(),
  expenses: z.lazy(() => ExpenseUpdateManyWithoutBudgetNestedInputSchema).optional()
}).strict();

export const BudgetUncheckedUpdateWithoutManagersInputSchema: z.ZodType<Prisma.BudgetUncheckedUpdateWithoutManagersInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expenses: z.lazy(() => ExpenseUncheckedUpdateManyWithoutBudgetNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutManagedBudgetsInputSchema: z.ZodType<Prisma.UserUpsertWithoutManagedBudgetsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutManagedBudgetsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutManagedBudgetsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutManagedBudgetsInputSchema),z.lazy(() => UserUncheckedCreateWithoutManagedBudgetsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutManagedBudgetsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutManagedBudgetsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutManagedBudgetsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutManagedBudgetsInputSchema) ]),
}).strict();

export const UserUpdateWithoutManagedBudgetsInputSchema: z.ZodType<Prisma.UserUpdateWithoutManagedBudgetsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  posts: z.lazy(() => PostUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutManagedBudgetsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutManagedBudgetsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  posts: z.lazy(() => PostUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutPostsInputSchema: z.ZodType<Prisma.UserCreateWithoutPostsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetCreateNestedManyWithoutOwnerInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPostsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPostsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPostsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPostsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPostsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPostsInputSchema) ]),
}).strict();

export const UserUpsertWithoutPostsInputSchema: z.ZodType<Prisma.UserUpsertWithoutPostsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPostsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPostsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPostsInputSchema),z.lazy(() => UserUncheckedCreateWithoutPostsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPostsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPostsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPostsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPostsInputSchema) ]),
}).strict();

export const UserUpdateWithoutPostsInputSchema: z.ZodType<Prisma.UserUpdateWithoutPostsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUpdateManyWithoutOwnerNestedInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPostsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPostsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  posts: z.lazy(() => PostCreateNestedManyWithoutCreatedByInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetCreateNestedManyWithoutOwnerInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  posts: z.lazy(() => PostUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  posts: z.lazy(() => PostUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUpdateManyWithoutOwnerNestedInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  posts: z.lazy(() => PostUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  posts: z.lazy(() => PostCreateNestedManyWithoutCreatedByInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetCreateNestedManyWithoutOwnerInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  posts: z.lazy(() => PostUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  posts: z.lazy(() => PostUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUpdateManyWithoutOwnerNestedInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  posts: z.lazy(() => PostUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  ownedBudgets: z.lazy(() => BudgetUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  managedBudgets: z.lazy(() => BudgetManagerUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable()
}).strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable()
}).strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AccountCreateManyUserInputSchema),z.lazy(() => AccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema),z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PostCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.PostCreateWithoutCreatedByInput> = z.object({
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PostUncheckedCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.PostUncheckedCreateWithoutCreatedByInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PostCreateOrConnectWithoutCreatedByInputSchema: z.ZodType<Prisma.PostCreateOrConnectWithoutCreatedByInput> = z.object({
  where: z.lazy(() => PostWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PostCreateWithoutCreatedByInputSchema),z.lazy(() => PostUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const PostCreateManyCreatedByInputEnvelopeSchema: z.ZodType<Prisma.PostCreateManyCreatedByInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PostCreateManyCreatedByInputSchema),z.lazy(() => PostCreateManyCreatedByInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const BudgetCreateWithoutOwnerInputSchema: z.ZodType<Prisma.BudgetCreateWithoutOwnerInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  expenses: z.lazy(() => ExpenseCreateNestedManyWithoutBudgetInputSchema).optional(),
  managers: z.lazy(() => BudgetManagerCreateNestedManyWithoutBudgetInputSchema).optional()
}).strict();

export const BudgetUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.BudgetUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  expenses: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutBudgetInputSchema).optional(),
  managers: z.lazy(() => BudgetManagerUncheckedCreateNestedManyWithoutBudgetInputSchema).optional()
}).strict();

export const BudgetCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.BudgetCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => BudgetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BudgetCreateWithoutOwnerInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const BudgetCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.BudgetCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BudgetCreateManyOwnerInputSchema),z.lazy(() => BudgetCreateManyOwnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const BudgetManagerCreateWithoutUserInputSchema: z.ZodType<Prisma.BudgetManagerCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  budget: z.lazy(() => BudgetCreateNestedOneWithoutManagersInputSchema)
}).strict();

export const BudgetManagerUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  budgetId: z.string(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const BudgetManagerCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.BudgetManagerCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => BudgetManagerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutUserInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const BudgetManagerCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.BudgetManagerCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BudgetManagerCreateManyUserInputSchema),z.lazy(() => BudgetManagerCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema),z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema),z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PostUpsertWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.PostUpsertWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => PostWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PostUpdateWithoutCreatedByInputSchema),z.lazy(() => PostUncheckedUpdateWithoutCreatedByInputSchema) ]),
  create: z.union([ z.lazy(() => PostCreateWithoutCreatedByInputSchema),z.lazy(() => PostUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const PostUpdateWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.PostUpdateWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => PostWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PostUpdateWithoutCreatedByInputSchema),z.lazy(() => PostUncheckedUpdateWithoutCreatedByInputSchema) ]),
}).strict();

export const PostUpdateManyWithWhereWithoutCreatedByInputSchema: z.ZodType<Prisma.PostUpdateManyWithWhereWithoutCreatedByInput> = z.object({
  where: z.lazy(() => PostScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PostUpdateManyMutationInputSchema),z.lazy(() => PostUncheckedUpdateManyWithoutCreatedByInputSchema) ]),
}).strict();

export const PostScalarWhereInputSchema: z.ZodType<Prisma.PostScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PostScalarWhereInputSchema),z.lazy(() => PostScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PostScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PostScalarWhereInputSchema),z.lazy(() => PostScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const BudgetUpsertWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.BudgetUpsertWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => BudgetWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BudgetUpdateWithoutOwnerInputSchema),z.lazy(() => BudgetUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => BudgetCreateWithoutOwnerInputSchema),z.lazy(() => BudgetUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const BudgetUpdateWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.BudgetUpdateWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => BudgetWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BudgetUpdateWithoutOwnerInputSchema),z.lazy(() => BudgetUncheckedUpdateWithoutOwnerInputSchema) ]),
}).strict();

export const BudgetUpdateManyWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.BudgetUpdateManyWithWhereWithoutOwnerInput> = z.object({
  where: z.lazy(() => BudgetScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BudgetUpdateManyMutationInputSchema),z.lazy(() => BudgetUncheckedUpdateManyWithoutOwnerInputSchema) ]),
}).strict();

export const BudgetScalarWhereInputSchema: z.ZodType<Prisma.BudgetScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BudgetScalarWhereInputSchema),z.lazy(() => BudgetScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BudgetScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BudgetScalarWhereInputSchema),z.lazy(() => BudgetScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  totalAmount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const BudgetManagerUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.BudgetManagerUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => BudgetManagerWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BudgetManagerUpdateWithoutUserInputSchema),z.lazy(() => BudgetManagerUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => BudgetManagerCreateWithoutUserInputSchema),z.lazy(() => BudgetManagerUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const BudgetManagerUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.BudgetManagerUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => BudgetManagerWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BudgetManagerUpdateWithoutUserInputSchema),z.lazy(() => BudgetManagerUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const BudgetManagerUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.BudgetManagerUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => BudgetManagerScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BudgetManagerUpdateManyMutationInputSchema),z.lazy(() => BudgetManagerUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ExpenseCreateManyBudgetInputSchema: z.ZodType<Prisma.ExpenseCreateManyBudgetInput> = z.object({
  id: z.string().uuid().optional(),
  description: z.string(),
  amount: z.number(),
  date: z.coerce.date().optional(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const BudgetManagerCreateManyBudgetInputSchema: z.ZodType<Prisma.BudgetManagerCreateManyBudgetInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const ExpenseUpdateWithoutBudgetInputSchema: z.ZodType<Prisma.ExpenseUpdateWithoutBudgetInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutExpensesNestedInputSchema).optional()
}).strict();

export const ExpenseUncheckedUpdateWithoutBudgetInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateWithoutBudgetInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutExpensesNestedInputSchema).optional()
}).strict();

export const ExpenseUncheckedUpdateManyWithoutBudgetInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyWithoutBudgetInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BudgetManagerUpdateWithoutBudgetInputSchema: z.ZodType<Prisma.BudgetManagerUpdateWithoutBudgetInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutManagedBudgetsNestedInputSchema).optional()
}).strict();

export const BudgetManagerUncheckedUpdateWithoutBudgetInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedUpdateWithoutBudgetInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const BudgetManagerUncheckedUpdateManyWithoutBudgetInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedUpdateManyWithoutBudgetInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const TagUpdateWithoutExpensesInputSchema: z.ZodType<Prisma.TagUpdateWithoutExpensesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagUncheckedUpdateWithoutExpensesInputSchema: z.ZodType<Prisma.TagUncheckedUpdateWithoutExpensesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagUncheckedUpdateManyWithoutExpensesInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyWithoutExpensesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseUpdateWithoutTagsInputSchema: z.ZodType<Prisma.ExpenseUpdateWithoutTagsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  budget: z.lazy(() => BudgetUpdateOneRequiredWithoutExpensesNestedInputSchema).optional()
}).strict();

export const ExpenseUncheckedUpdateWithoutTagsInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateWithoutTagsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  budgetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseUncheckedUpdateManyWithoutTagsInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyWithoutTagsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  budgetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  refresh_token_expires_in: z.number().int().optional().nullable()
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  sessionToken: z.string(),
  expires: z.coerce.date()
}).strict();

export const PostCreateManyCreatedByInputSchema: z.ZodType<Prisma.PostCreateManyCreatedByInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const BudgetCreateManyOwnerInputSchema: z.ZodType<Prisma.BudgetCreateManyOwnerInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  totalAmount: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const BudgetManagerCreateManyUserInputSchema: z.ZodType<Prisma.BudgetManagerCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  budgetId: z.string(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refresh_token_expires_in: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PostUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.PostUpdateWithoutCreatedByInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PostUncheckedUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.PostUncheckedUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PostUncheckedUpdateManyWithoutCreatedByInputSchema: z.ZodType<Prisma.PostUncheckedUpdateManyWithoutCreatedByInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BudgetUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.BudgetUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expenses: z.lazy(() => ExpenseUpdateManyWithoutBudgetNestedInputSchema).optional(),
  managers: z.lazy(() => BudgetManagerUpdateManyWithoutBudgetNestedInputSchema).optional()
}).strict();

export const BudgetUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.BudgetUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expenses: z.lazy(() => ExpenseUncheckedUpdateManyWithoutBudgetNestedInputSchema).optional(),
  managers: z.lazy(() => BudgetManagerUncheckedUpdateManyWithoutBudgetNestedInputSchema).optional()
}).strict();

export const BudgetUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.BudgetUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BudgetManagerUpdateWithoutUserInputSchema: z.ZodType<Prisma.BudgetManagerUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  budget: z.lazy(() => BudgetUpdateOneRequiredWithoutManagersNestedInputSchema).optional()
}).strict();

export const BudgetManagerUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  budgetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const BudgetManagerUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.BudgetManagerUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  budgetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  permissions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const BudgetFindFirstArgsSchema: z.ZodType<Prisma.BudgetFindFirstArgs> = z.object({
  select: BudgetSelectSchema.optional(),
  include: BudgetIncludeSchema.optional(),
  where: BudgetWhereInputSchema.optional(),
  orderBy: z.union([ BudgetOrderByWithRelationInputSchema.array(),BudgetOrderByWithRelationInputSchema ]).optional(),
  cursor: BudgetWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BudgetScalarFieldEnumSchema,BudgetScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BudgetFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BudgetFindFirstOrThrowArgs> = z.object({
  select: BudgetSelectSchema.optional(),
  include: BudgetIncludeSchema.optional(),
  where: BudgetWhereInputSchema.optional(),
  orderBy: z.union([ BudgetOrderByWithRelationInputSchema.array(),BudgetOrderByWithRelationInputSchema ]).optional(),
  cursor: BudgetWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BudgetScalarFieldEnumSchema,BudgetScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BudgetFindManyArgsSchema: z.ZodType<Prisma.BudgetFindManyArgs> = z.object({
  select: BudgetSelectSchema.optional(),
  include: BudgetIncludeSchema.optional(),
  where: BudgetWhereInputSchema.optional(),
  orderBy: z.union([ BudgetOrderByWithRelationInputSchema.array(),BudgetOrderByWithRelationInputSchema ]).optional(),
  cursor: BudgetWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BudgetScalarFieldEnumSchema,BudgetScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BudgetAggregateArgsSchema: z.ZodType<Prisma.BudgetAggregateArgs> = z.object({
  where: BudgetWhereInputSchema.optional(),
  orderBy: z.union([ BudgetOrderByWithRelationInputSchema.array(),BudgetOrderByWithRelationInputSchema ]).optional(),
  cursor: BudgetWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BudgetGroupByArgsSchema: z.ZodType<Prisma.BudgetGroupByArgs> = z.object({
  where: BudgetWhereInputSchema.optional(),
  orderBy: z.union([ BudgetOrderByWithAggregationInputSchema.array(),BudgetOrderByWithAggregationInputSchema ]).optional(),
  by: BudgetScalarFieldEnumSchema.array(),
  having: BudgetScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BudgetFindUniqueArgsSchema: z.ZodType<Prisma.BudgetFindUniqueArgs> = z.object({
  select: BudgetSelectSchema.optional(),
  include: BudgetIncludeSchema.optional(),
  where: BudgetWhereUniqueInputSchema,
}).strict() ;

export const BudgetFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BudgetFindUniqueOrThrowArgs> = z.object({
  select: BudgetSelectSchema.optional(),
  include: BudgetIncludeSchema.optional(),
  where: BudgetWhereUniqueInputSchema,
}).strict() ;

export const ExpenseFindFirstArgsSchema: z.ZodType<Prisma.ExpenseFindFirstArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseOrderByWithRelationInputSchema.array(),ExpenseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExpenseScalarFieldEnumSchema,ExpenseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExpenseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ExpenseFindFirstOrThrowArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseOrderByWithRelationInputSchema.array(),ExpenseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExpenseScalarFieldEnumSchema,ExpenseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExpenseFindManyArgsSchema: z.ZodType<Prisma.ExpenseFindManyArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseOrderByWithRelationInputSchema.array(),ExpenseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExpenseScalarFieldEnumSchema,ExpenseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExpenseAggregateArgsSchema: z.ZodType<Prisma.ExpenseAggregateArgs> = z.object({
  where: ExpenseWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseOrderByWithRelationInputSchema.array(),ExpenseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ExpenseGroupByArgsSchema: z.ZodType<Prisma.ExpenseGroupByArgs> = z.object({
  where: ExpenseWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseOrderByWithAggregationInputSchema.array(),ExpenseOrderByWithAggregationInputSchema ]).optional(),
  by: ExpenseScalarFieldEnumSchema.array(),
  having: ExpenseScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ExpenseFindUniqueArgsSchema: z.ZodType<Prisma.ExpenseFindUniqueArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereUniqueInputSchema,
}).strict() ;

export const ExpenseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ExpenseFindUniqueOrThrowArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereUniqueInputSchema,
}).strict() ;

export const TagFindFirstArgsSchema: z.ZodType<Prisma.TagFindFirstArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TagFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TagFindFirstOrThrowArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TagFindManyArgsSchema: z.ZodType<Prisma.TagFindManyArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TagAggregateArgsSchema: z.ZodType<Prisma.TagAggregateArgs> = z.object({
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TagGroupByArgsSchema: z.ZodType<Prisma.TagGroupByArgs> = z.object({
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithAggregationInputSchema.array(),TagOrderByWithAggregationInputSchema ]).optional(),
  by: TagScalarFieldEnumSchema.array(),
  having: TagScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TagFindUniqueArgsSchema: z.ZodType<Prisma.TagFindUniqueArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const TagFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TagFindUniqueOrThrowArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const BudgetManagerFindFirstArgsSchema: z.ZodType<Prisma.BudgetManagerFindFirstArgs> = z.object({
  select: BudgetManagerSelectSchema.optional(),
  include: BudgetManagerIncludeSchema.optional(),
  where: BudgetManagerWhereInputSchema.optional(),
  orderBy: z.union([ BudgetManagerOrderByWithRelationInputSchema.array(),BudgetManagerOrderByWithRelationInputSchema ]).optional(),
  cursor: BudgetManagerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BudgetManagerScalarFieldEnumSchema,BudgetManagerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BudgetManagerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BudgetManagerFindFirstOrThrowArgs> = z.object({
  select: BudgetManagerSelectSchema.optional(),
  include: BudgetManagerIncludeSchema.optional(),
  where: BudgetManagerWhereInputSchema.optional(),
  orderBy: z.union([ BudgetManagerOrderByWithRelationInputSchema.array(),BudgetManagerOrderByWithRelationInputSchema ]).optional(),
  cursor: BudgetManagerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BudgetManagerScalarFieldEnumSchema,BudgetManagerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BudgetManagerFindManyArgsSchema: z.ZodType<Prisma.BudgetManagerFindManyArgs> = z.object({
  select: BudgetManagerSelectSchema.optional(),
  include: BudgetManagerIncludeSchema.optional(),
  where: BudgetManagerWhereInputSchema.optional(),
  orderBy: z.union([ BudgetManagerOrderByWithRelationInputSchema.array(),BudgetManagerOrderByWithRelationInputSchema ]).optional(),
  cursor: BudgetManagerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BudgetManagerScalarFieldEnumSchema,BudgetManagerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BudgetManagerAggregateArgsSchema: z.ZodType<Prisma.BudgetManagerAggregateArgs> = z.object({
  where: BudgetManagerWhereInputSchema.optional(),
  orderBy: z.union([ BudgetManagerOrderByWithRelationInputSchema.array(),BudgetManagerOrderByWithRelationInputSchema ]).optional(),
  cursor: BudgetManagerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BudgetManagerGroupByArgsSchema: z.ZodType<Prisma.BudgetManagerGroupByArgs> = z.object({
  where: BudgetManagerWhereInputSchema.optional(),
  orderBy: z.union([ BudgetManagerOrderByWithAggregationInputSchema.array(),BudgetManagerOrderByWithAggregationInputSchema ]).optional(),
  by: BudgetManagerScalarFieldEnumSchema.array(),
  having: BudgetManagerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BudgetManagerFindUniqueArgsSchema: z.ZodType<Prisma.BudgetManagerFindUniqueArgs> = z.object({
  select: BudgetManagerSelectSchema.optional(),
  include: BudgetManagerIncludeSchema.optional(),
  where: BudgetManagerWhereUniqueInputSchema,
}).strict() ;

export const BudgetManagerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BudgetManagerFindUniqueOrThrowArgs> = z.object({
  select: BudgetManagerSelectSchema.optional(),
  include: BudgetManagerIncludeSchema.optional(),
  where: BudgetManagerWhereUniqueInputSchema,
}).strict() ;

export const PostFindFirstArgsSchema: z.ZodType<Prisma.PostFindFirstArgs> = z.object({
  select: PostSelectSchema.optional(),
  include: PostIncludeSchema.optional(),
  where: PostWhereInputSchema.optional(),
  orderBy: z.union([ PostOrderByWithRelationInputSchema.array(),PostOrderByWithRelationInputSchema ]).optional(),
  cursor: PostWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PostScalarFieldEnumSchema,PostScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PostFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PostFindFirstOrThrowArgs> = z.object({
  select: PostSelectSchema.optional(),
  include: PostIncludeSchema.optional(),
  where: PostWhereInputSchema.optional(),
  orderBy: z.union([ PostOrderByWithRelationInputSchema.array(),PostOrderByWithRelationInputSchema ]).optional(),
  cursor: PostWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PostScalarFieldEnumSchema,PostScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PostFindManyArgsSchema: z.ZodType<Prisma.PostFindManyArgs> = z.object({
  select: PostSelectSchema.optional(),
  include: PostIncludeSchema.optional(),
  where: PostWhereInputSchema.optional(),
  orderBy: z.union([ PostOrderByWithRelationInputSchema.array(),PostOrderByWithRelationInputSchema ]).optional(),
  cursor: PostWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PostScalarFieldEnumSchema,PostScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PostAggregateArgsSchema: z.ZodType<Prisma.PostAggregateArgs> = z.object({
  where: PostWhereInputSchema.optional(),
  orderBy: z.union([ PostOrderByWithRelationInputSchema.array(),PostOrderByWithRelationInputSchema ]).optional(),
  cursor: PostWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PostGroupByArgsSchema: z.ZodType<Prisma.PostGroupByArgs> = z.object({
  where: PostWhereInputSchema.optional(),
  orderBy: z.union([ PostOrderByWithAggregationInputSchema.array(),PostOrderByWithAggregationInputSchema ]).optional(),
  by: PostScalarFieldEnumSchema.array(),
  having: PostScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PostFindUniqueArgsSchema: z.ZodType<Prisma.PostFindUniqueArgs> = z.object({
  select: PostSelectSchema.optional(),
  include: PostIncludeSchema.optional(),
  where: PostWhereUniqueInputSchema,
}).strict() ;

export const PostFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PostFindUniqueOrThrowArgs> = z.object({
  select: PostSelectSchema.optional(),
  include: PostIncludeSchema.optional(),
  where: PostWhereUniqueInputSchema,
}).strict() ;

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(),AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(),SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenFindFirstArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenFindManyArgsSchema: z.ZodType<Prisma.VerificationTokenFindManyArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenAggregateArgsSchema: z.ZodType<Prisma.VerificationTokenAggregateArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationTokenGroupByArgsSchema: z.ZodType<Prisma.VerificationTokenGroupByArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithAggregationInputSchema.array(),VerificationTokenOrderByWithAggregationInputSchema ]).optional(),
  by: VerificationTokenScalarFieldEnumSchema.array(),
  having: VerificationTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationTokenFindUniqueArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const BudgetCreateArgsSchema: z.ZodType<Prisma.BudgetCreateArgs> = z.object({
  select: BudgetSelectSchema.optional(),
  include: BudgetIncludeSchema.optional(),
  data: z.union([ BudgetCreateInputSchema,BudgetUncheckedCreateInputSchema ]),
}).strict() ;

export const BudgetUpsertArgsSchema: z.ZodType<Prisma.BudgetUpsertArgs> = z.object({
  select: BudgetSelectSchema.optional(),
  include: BudgetIncludeSchema.optional(),
  where: BudgetWhereUniqueInputSchema,
  create: z.union([ BudgetCreateInputSchema,BudgetUncheckedCreateInputSchema ]),
  update: z.union([ BudgetUpdateInputSchema,BudgetUncheckedUpdateInputSchema ]),
}).strict() ;

export const BudgetCreateManyArgsSchema: z.ZodType<Prisma.BudgetCreateManyArgs> = z.object({
  data: z.union([ BudgetCreateManyInputSchema,BudgetCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BudgetCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BudgetCreateManyAndReturnArgs> = z.object({
  data: z.union([ BudgetCreateManyInputSchema,BudgetCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BudgetDeleteArgsSchema: z.ZodType<Prisma.BudgetDeleteArgs> = z.object({
  select: BudgetSelectSchema.optional(),
  include: BudgetIncludeSchema.optional(),
  where: BudgetWhereUniqueInputSchema,
}).strict() ;

export const BudgetUpdateArgsSchema: z.ZodType<Prisma.BudgetUpdateArgs> = z.object({
  select: BudgetSelectSchema.optional(),
  include: BudgetIncludeSchema.optional(),
  data: z.union([ BudgetUpdateInputSchema,BudgetUncheckedUpdateInputSchema ]),
  where: BudgetWhereUniqueInputSchema,
}).strict() ;

export const BudgetUpdateManyArgsSchema: z.ZodType<Prisma.BudgetUpdateManyArgs> = z.object({
  data: z.union([ BudgetUpdateManyMutationInputSchema,BudgetUncheckedUpdateManyInputSchema ]),
  where: BudgetWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BudgetUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BudgetUpdateManyAndReturnArgs> = z.object({
  data: z.union([ BudgetUpdateManyMutationInputSchema,BudgetUncheckedUpdateManyInputSchema ]),
  where: BudgetWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BudgetDeleteManyArgsSchema: z.ZodType<Prisma.BudgetDeleteManyArgs> = z.object({
  where: BudgetWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ExpenseCreateArgsSchema: z.ZodType<Prisma.ExpenseCreateArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  data: z.union([ ExpenseCreateInputSchema,ExpenseUncheckedCreateInputSchema ]),
}).strict() ;

export const ExpenseUpsertArgsSchema: z.ZodType<Prisma.ExpenseUpsertArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereUniqueInputSchema,
  create: z.union([ ExpenseCreateInputSchema,ExpenseUncheckedCreateInputSchema ]),
  update: z.union([ ExpenseUpdateInputSchema,ExpenseUncheckedUpdateInputSchema ]),
}).strict() ;

export const ExpenseCreateManyArgsSchema: z.ZodType<Prisma.ExpenseCreateManyArgs> = z.object({
  data: z.union([ ExpenseCreateManyInputSchema,ExpenseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ExpenseCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ExpenseCreateManyAndReturnArgs> = z.object({
  data: z.union([ ExpenseCreateManyInputSchema,ExpenseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ExpenseDeleteArgsSchema: z.ZodType<Prisma.ExpenseDeleteArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereUniqueInputSchema,
}).strict() ;

export const ExpenseUpdateArgsSchema: z.ZodType<Prisma.ExpenseUpdateArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  data: z.union([ ExpenseUpdateInputSchema,ExpenseUncheckedUpdateInputSchema ]),
  where: ExpenseWhereUniqueInputSchema,
}).strict() ;

export const ExpenseUpdateManyArgsSchema: z.ZodType<Prisma.ExpenseUpdateManyArgs> = z.object({
  data: z.union([ ExpenseUpdateManyMutationInputSchema,ExpenseUncheckedUpdateManyInputSchema ]),
  where: ExpenseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ExpenseUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ExpenseUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ExpenseUpdateManyMutationInputSchema,ExpenseUncheckedUpdateManyInputSchema ]),
  where: ExpenseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ExpenseDeleteManyArgsSchema: z.ZodType<Prisma.ExpenseDeleteManyArgs> = z.object({
  where: ExpenseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TagCreateArgsSchema: z.ZodType<Prisma.TagCreateArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  data: z.union([ TagCreateInputSchema,TagUncheckedCreateInputSchema ]),
}).strict() ;

export const TagUpsertArgsSchema: z.ZodType<Prisma.TagUpsertArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
  create: z.union([ TagCreateInputSchema,TagUncheckedCreateInputSchema ]),
  update: z.union([ TagUpdateInputSchema,TagUncheckedUpdateInputSchema ]),
}).strict() ;

export const TagCreateManyArgsSchema: z.ZodType<Prisma.TagCreateManyArgs> = z.object({
  data: z.union([ TagCreateManyInputSchema,TagCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TagCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TagCreateManyAndReturnArgs> = z.object({
  data: z.union([ TagCreateManyInputSchema,TagCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TagDeleteArgsSchema: z.ZodType<Prisma.TagDeleteArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const TagUpdateArgsSchema: z.ZodType<Prisma.TagUpdateArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  data: z.union([ TagUpdateInputSchema,TagUncheckedUpdateInputSchema ]),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const TagUpdateManyArgsSchema: z.ZodType<Prisma.TagUpdateManyArgs> = z.object({
  data: z.union([ TagUpdateManyMutationInputSchema,TagUncheckedUpdateManyInputSchema ]),
  where: TagWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TagUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TagUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TagUpdateManyMutationInputSchema,TagUncheckedUpdateManyInputSchema ]),
  where: TagWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TagDeleteManyArgsSchema: z.ZodType<Prisma.TagDeleteManyArgs> = z.object({
  where: TagWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BudgetManagerCreateArgsSchema: z.ZodType<Prisma.BudgetManagerCreateArgs> = z.object({
  select: BudgetManagerSelectSchema.optional(),
  include: BudgetManagerIncludeSchema.optional(),
  data: z.union([ BudgetManagerCreateInputSchema,BudgetManagerUncheckedCreateInputSchema ]),
}).strict() ;

export const BudgetManagerUpsertArgsSchema: z.ZodType<Prisma.BudgetManagerUpsertArgs> = z.object({
  select: BudgetManagerSelectSchema.optional(),
  include: BudgetManagerIncludeSchema.optional(),
  where: BudgetManagerWhereUniqueInputSchema,
  create: z.union([ BudgetManagerCreateInputSchema,BudgetManagerUncheckedCreateInputSchema ]),
  update: z.union([ BudgetManagerUpdateInputSchema,BudgetManagerUncheckedUpdateInputSchema ]),
}).strict() ;

export const BudgetManagerCreateManyArgsSchema: z.ZodType<Prisma.BudgetManagerCreateManyArgs> = z.object({
  data: z.union([ BudgetManagerCreateManyInputSchema,BudgetManagerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BudgetManagerCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BudgetManagerCreateManyAndReturnArgs> = z.object({
  data: z.union([ BudgetManagerCreateManyInputSchema,BudgetManagerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BudgetManagerDeleteArgsSchema: z.ZodType<Prisma.BudgetManagerDeleteArgs> = z.object({
  select: BudgetManagerSelectSchema.optional(),
  include: BudgetManagerIncludeSchema.optional(),
  where: BudgetManagerWhereUniqueInputSchema,
}).strict() ;

export const BudgetManagerUpdateArgsSchema: z.ZodType<Prisma.BudgetManagerUpdateArgs> = z.object({
  select: BudgetManagerSelectSchema.optional(),
  include: BudgetManagerIncludeSchema.optional(),
  data: z.union([ BudgetManagerUpdateInputSchema,BudgetManagerUncheckedUpdateInputSchema ]),
  where: BudgetManagerWhereUniqueInputSchema,
}).strict() ;

export const BudgetManagerUpdateManyArgsSchema: z.ZodType<Prisma.BudgetManagerUpdateManyArgs> = z.object({
  data: z.union([ BudgetManagerUpdateManyMutationInputSchema,BudgetManagerUncheckedUpdateManyInputSchema ]),
  where: BudgetManagerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BudgetManagerUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BudgetManagerUpdateManyAndReturnArgs> = z.object({
  data: z.union([ BudgetManagerUpdateManyMutationInputSchema,BudgetManagerUncheckedUpdateManyInputSchema ]),
  where: BudgetManagerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BudgetManagerDeleteManyArgsSchema: z.ZodType<Prisma.BudgetManagerDeleteManyArgs> = z.object({
  where: BudgetManagerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PostCreateArgsSchema: z.ZodType<Prisma.PostCreateArgs> = z.object({
  select: PostSelectSchema.optional(),
  include: PostIncludeSchema.optional(),
  data: z.union([ PostCreateInputSchema,PostUncheckedCreateInputSchema ]),
}).strict() ;

export const PostUpsertArgsSchema: z.ZodType<Prisma.PostUpsertArgs> = z.object({
  select: PostSelectSchema.optional(),
  include: PostIncludeSchema.optional(),
  where: PostWhereUniqueInputSchema,
  create: z.union([ PostCreateInputSchema,PostUncheckedCreateInputSchema ]),
  update: z.union([ PostUpdateInputSchema,PostUncheckedUpdateInputSchema ]),
}).strict() ;

export const PostCreateManyArgsSchema: z.ZodType<Prisma.PostCreateManyArgs> = z.object({
  data: z.union([ PostCreateManyInputSchema,PostCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PostCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PostCreateManyAndReturnArgs> = z.object({
  data: z.union([ PostCreateManyInputSchema,PostCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PostDeleteArgsSchema: z.ZodType<Prisma.PostDeleteArgs> = z.object({
  select: PostSelectSchema.optional(),
  include: PostIncludeSchema.optional(),
  where: PostWhereUniqueInputSchema,
}).strict() ;

export const PostUpdateArgsSchema: z.ZodType<Prisma.PostUpdateArgs> = z.object({
  select: PostSelectSchema.optional(),
  include: PostIncludeSchema.optional(),
  data: z.union([ PostUpdateInputSchema,PostUncheckedUpdateInputSchema ]),
  where: PostWhereUniqueInputSchema,
}).strict() ;

export const PostUpdateManyArgsSchema: z.ZodType<Prisma.PostUpdateManyArgs> = z.object({
  data: z.union([ PostUpdateManyMutationInputSchema,PostUncheckedUpdateManyInputSchema ]),
  where: PostWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PostUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.PostUpdateManyAndReturnArgs> = z.object({
  data: z.union([ PostUpdateManyMutationInputSchema,PostUncheckedUpdateManyInputSchema ]),
  where: PostWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PostDeleteManyArgsSchema: z.ZodType<Prisma.PostDeleteManyArgs> = z.object({
  where: PostWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
}).strict() ;

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
}).strict() ;

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AccountUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
}).strict() ;

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
}).strict() ;

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]).optional(),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VerificationTokenCreateArgsSchema: z.ZodType<Prisma.VerificationTokenCreateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const VerificationTokenUpsertArgsSchema: z.ZodType<Prisma.VerificationTokenUpsertArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
  create: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
  update: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const VerificationTokenCreateManyArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyArgs> = z.object({
  data: z.union([ VerificationTokenCreateManyInputSchema,VerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VerificationTokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyAndReturnArgs> = z.object({
  data: z.union([ VerificationTokenCreateManyInputSchema,VerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VerificationTokenDeleteArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenUpdateArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenUpdateManyArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyArgs> = z.object({
  data: z.union([ VerificationTokenUpdateManyMutationInputSchema,VerificationTokenUncheckedUpdateManyInputSchema ]),
  where: VerificationTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VerificationTokenUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyAndReturnArgs> = z.object({
  data: z.union([ VerificationTokenUpdateManyMutationInputSchema,VerificationTokenUncheckedUpdateManyInputSchema ]),
  where: VerificationTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VerificationTokenDeleteManyArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteManyArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;