export const person = {
  name: 'Hamid Javaheri',
  role: 'Software Engineer, Application Developer',
  team: 'Integration Team at CIBC',
  school: 'Toronto Metropolitan University',
  schoolNote: 'formerly Ryerson',
  degree: 'Computer Engineering',
  classOf: 2025,
  city: 'Toronto',
  email: 'seyedhamidjavaheri@gmail.com',
  linkedin: 'https://www.linkedin.com/in/hamidjavaheri/',
  github: 'https://github.com/SHJavaheri',
  site: 'https://hamidjavaheri.com',
} as const;

export const description =
  'Hamid Javaheri is a software engineer and inventor in Toronto who designs, architects and ships products: hublii, FirstLine, MasHoorCake and more, presented as a launch keynote.';

export type Chapter = { id: string; name: string; gel: string };

/** The run of show. Order is the order on stage. */
export const chapters: Chapter[] = [
  { id: 'opening', name: 'Opening', gel: 'house' },
  { id: 'mashoorcake', name: 'MasHoorCake', gel: 'mashoor' },
  { id: 'firstline', name: 'FirstLine', gel: 'firstline' },
  { id: 'podium', name: 'The podium', gel: 'podium' },
  { id: 'hublii', name: 'One more thing', gel: 'hublii' },
  { id: 'in-development', name: 'In development', gel: 'dev' },
  { id: 'encore', name: 'Encore', gel: 'bethesda' },
  { id: 'backstage', name: 'Backstage', gel: 'backstage' },
  { id: 'curtain-call', name: 'Curtain call', gel: 'house' },
];

export const hublii = {
  url: 'https://hublii.com',
  tagline: "One calm place for you and your clients: what's happening, what's next, and where everything is.",
  what:
    'A client portal and project hub for service businesses. Clients join by invitation, and both sides get one calm, branded place for projects, milestones, updates, files, approvals, messages and invoices.',
  questions: ["What's happening?", 'What do I need to do?', 'Where are my things?', 'What happens next?'],
  features: [
    { title: 'A workspace for the business', body: 'Clients, projects, milestones, next actions and updates, in one place.' },
    { title: 'A portal clients want to open', body: 'Branded for each business. One client can work with several businesses and switch between them.' },
    { title: 'Files, handled properly', body: 'Secure uploads with malware scanning, Google Drive import, folders and an in-app PDF viewer.' },
    { title: 'Messages that stay on topic', body: 'Conversations live next to the work, with a notification centre you control.' },
    { title: 'Invoices without the chase', body: 'Invoice records and payment history for both sides, with CSV and PDF export.' },
    { title: 'Secure by default', body: 'Email or Google sign-in, optional authenticator-app 2FA, and strict workspace isolation.' },
  ],
  stats: [
    { value: 162, suffix: 'K', label: 'lines of TypeScript' },
    { value: 228, suffix: '', label: 'test files, from unit to end-to-end and accessibility' },
    { value: 1199, suffix: '', label: 'commits in sixteen days' },
  ],
  stack: ['Next.js 16', 'React 19', 'TypeScript', 'AWS Aurora Serverless', 'Cognito', 'S3 + GuardDuty', 'AWS CDK', 'Drizzle', 'Resend', 'Vercel'],
  roadmap: [
    { label: 'Waitlist', state: 'done', note: 'Live now' },
    { label: 'Billing', state: 'next', note: 'On the bench' },
    { label: 'Launch', state: 'ahead', note: 'Coming up' },
  ],
} as const;

export const firstline = {
  tagline: 'Find the right professional. The first time.',
  what:
    'A directory and social network for lawyers, accountants, real estate agents, therapists and contractors. People search, compare and message professionals, and choose based on reviews and trust from people they know.',
  features: [
    'Search, filter and ranking built for professional services',
    'Star reviews with professional replies and helpful votes',
    'Real-time messaging with presence, replies and edits',
    'A social feed: posts, follows, mentions, recommendations',
    'Push notifications on the web and on mobile',
    'A native iOS and Android app with the same features as the web app',
  ],
  specs: [
    ['Web', 'Next.js 16 · React 19'],
    ['Native', 'Expo · React Native'],
    ['Backend', 'Supabase · Postgres · Realtime'],
    ['Size', '~56K lines of code'],
  ],
} as const;

export const mashoorcake = {
  tagline: 'Design the cake. Send it to the baker.',
  what:
    'A bilingual custom-cake bakery site in English and Persian, with a full right-to-left layout. The interactive Cake Maker lets you design a cake and send the baker an exact request by WhatsApp, email or PDF.',
  specs: [
    ['Languages', 'English · فارسی (RTL)'],
    ['Signature', 'Live SVG Cake Maker'],
    ['Requests', 'WhatsApp · email · PDF'],
    ['Built with', 'Next.js, static export'],
  ],
} as const;

export const bethesda = {
  name: 'Bethesda Labradors',
  tagline: 'A warm home on the web for a family Labrador breeder.',
  what:
    'A marketing site for a family Labrador breeder. Families meet the parent dogs, follow each litter week by week, learn how to care for a new puppy, and apply.',
  features: [
    { title: 'A warm welcome', body: 'A home page that feels like the family it belongs to.' },
    { title: 'Litters, week by week', body: 'Each litter and puppy gets weekly updates.' },
    { title: 'Say hi to the puppies', body: "Every puppy, with who's reserved and who's still looking for a home." },
    { title: 'Meet the parents', body: 'Parent profiles with their health results.' },
    { title: 'A gentle application', body: 'A multi-step form that saves a draft as you go.' },
  ],
  stack: ['Next.js 16', 'TypeScript', 'Tailwind v4', 'GSAP', 'Vitest'],
} as const;

export const pawmetric = {
  name: 'Pawmetric',
  tagline: 'A baby tracker for your new puppy.',
  what:
    'Log every walk, nap, meal and potty break, then see the patterns: a daily wellness score, trends, and predictions for what your puppy needs next.',
  features: ['11 kinds of activity', 'Daily wellness score', 'Next-event predictions', 'Multiple pets', 'On-device, no account'],
  stack: ['Expo', 'React Native', 'SQLite', 'Reanimated'],
} as const;

export const goals = [
  'Launch hublii.',
  'Build my own products.',
  'Keep growing as an engineer.',
  'Be known for design and engineering, together.',
];

export const longGoal = 'Grow into someone who can build anything, for anyone in need.';
