export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MINISTRY_LEADER: 'MINISTRY_LEADER',
} as const;

export const MEMBERSHIP_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  VISITOR: 'VISITOR',
  DECEASED: 'DECEASED',
  TRANSFERRED: 'TRANSFERRED',
} as const;

export const MINISTRY_ROLES = {
  LEADER: 'LEADER',
  ASSISTANT_LEADER: 'ASSISTANT_LEADER',
  SECRETARY: 'SECRETARY',
  TREASURER: 'TREASURER',
  MEMBER: 'MEMBER',
} as const;

export const CONTRIBUTION_TYPES = {
  TITHE: 'TITHE',
  OFFERING: 'OFFERING',
  SPECIAL_OFFERING: 'SPECIAL_OFFERING',
  DONATION: 'DONATION',
  PLEDGE_PAYMENT: 'PLEDGE_PAYMENT',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CHECK: 'CHECK',
  BANK_TRANSFER: 'BANK_TRANSFER',
  MOBILE_MONEY: 'MOBILE_MONEY',
  CARD: 'CARD',
} as const;

export const EVENT_CATEGORIES = {
  SERVICE: 'SERVICE',
  MEETING: 'MEETING',
  FELLOWSHIP: 'FELLOWSHIP',
  OUTREACH: 'OUTREACH',
  CONFERENCE: 'CONFERENCE',
  CELEBRATION: 'CELEBRATION',
  OTHER: 'OTHER',
} as const;

export const DEFAULT_MINISTRIES = [
  { name: 'Youth Ministry', description: 'Ministry for young people' },
  { name: 'Choir', description: 'Church choir and praise team' },
  { name: 'Band', description: 'Music ministry and instrumentalists' },
  { name: 'Pastors', description: 'Pastoral leadership' },
  { name: 'Prophets', description: 'Spiritual leads and prophetic ministry' },
  { name: "Men's Fellowship", description: 'Ministry for men' },
  { name: "Women's Fellowship", description: 'Ministry for women' },
] as const;
