export type Shot = { src: string; alt: string; caption: string; w: number; h: number; mobile?: boolean };

/** Real screenshots captured from each project. Filled in from public/projects/<slug>/. */
export const shots: Record<'hublii' | 'mashoorcake' | 'bethesda', Shot[]> = {
  hublii: [],
  mashoorcake: [
    { src: '/projects/mashoorcake/cake-maker.webp', alt: 'The MasHoorCake Cake Maker with a three-tier pistachio cake in blush pink.', caption: 'The Cake Maker: tiers, flavours, colours and decorations, previewed live.', w: 1440, h: 900 },
    { src: '/projects/mashoorcake/cake-request-summary.webp', alt: 'The cake request summary, ready to send to the baker.', caption: 'One tap sends the baker an exact request.', w: 1440, h: 900 },
    { src: '/projects/mashoorcake/hero-persian-rtl.webp', alt: 'The MasHoorCake home page in Persian, laid out right to left.', caption: 'فارسی: the whole site, right to left.', w: 1440, h: 900 },
    { src: '/projects/mashoorcake/hero-mobile.webp', alt: 'MasHoorCake on a phone.', caption: 'Built for the phone first.', w: 390, h: 844, mobile: true },
    { src: '/projects/mashoorcake/hero-evening-mint.webp', alt: 'MasHoorCake in its Evening Mint dark theme.', caption: 'Evening Mint, the dark theme.', w: 1440, h: 900 },
  ],
  bethesda: [],
};
