import { RedesignCase } from './types';

export const REDESIGN_CASES: RedesignCase[] = [
  // 1. MOBILE: Travel
  {
    id: 'mob-1',
    title: 'Screener AI',
    description: 'It is a great source for getting financial data reported by companies along with transcripts, quarter results and more.',
    category: 'Mobile App',
    beforeImage: '/screener_problem.png',
    afterImage: '/Screener.svg',
    gridArea: 'tall',
    designThinking: {
      problem: 'Improve the interface of this AI chat window so as to improve readability and usability and also add dynamism, especially when compared to market leaders such as ChatGPT and Perplexity.',
      solution: 'The redesign converts a flat Q&A into a structured financial tool by adding data headers, chunking text, and suggesting follow-up queries.',
      keyDecision: 'Prioritizing structured value over static text to prove the AI worth immediately before presenting the "Buy Credits" upgrade path.',
    },
    tags: ['CRO', 'Monetization UX', 'Content Chunking'],
  },
  // 2. MOBILE: Music
  {
    id: 'mob-2',
    title: 'Music Streaming',
    description: 'Modernizing player controls for gesture navigation.',
    category: 'Mobile App',
    beforeImage: '/amazon%20music.png',
    afterImage: '/Amazon%20Music%20Redesigned.svg',
    gridArea: 'tall',
    designThinking: {
      problem: 'Improve the design of this Now Playing screen, so as to add more energy and vibrancy to it. The goal is to make the design more expressive to match the emotive nature of music listening.',
      solution: 'The redesign swaps static square art for a dynamic "vinyl" disk, adds a vibrant glow, and consolidates playback controls into a clean bottom dock.',
      keyDecision: 'Using a spinning vinyl motif and immersive lighting to bridge the gap between digital convenience and the tactile, emotive feel of music.',
    },
    tags: ['Emotional Design', 'Visual Hierarchy', 'Aesthetic-Usability Effect'],
  },
  // 3. WEB: Fintech (Large anchor) -> Moved here
  {
    id: 'web-1',
    title: 'Ulaa Browser',
    description: 'Ulaa is a Web browser from Zoho. While it was launched a couple of years back, it has recently been in the news. The Indian government is trying to promote homegrown software and apps and Ulaa is one of them.',
    category: 'Web Browser',
    beforeImage: '/Weekend_Hackathon_85_banner.png',
    afterImage: '/Ulaa.svg',
    gridArea: 'large',
    designThinking: {
      problem: 'Improve this screen to make it interesting for a user who is used to other popular browsers.',
      solution: 'The redesign shifts from a fragmented dashboard to a sleek, centralized hub by adding a sidebar for mode switching and a prominent clock/search focus.',
      keyDecision: 'Consolidating navigation into a persistent sidebar to reduce cognitive load and create a familiar, "productivity-first" layout seen in modern browsers.',
    },
    tags: ['Information Architecture', 'Dashboard Design', 'Minimalist UI'],
    backgroundColor: '#18181B', // Dark zinc for correct dark mode vibe
  },
  // 4. MOBILE: Banking
  {
    id: 'mob-3',
    title: 'HDFC PayZapp',
    description: 'PayZapp is a fintech product from HDFC Bank to help you make Credit card payments, UPI Payments, Shop, and other such activities.',
    category: 'Mobile App',
    beforeImage: '/hdfc.png',
    afterImage: '/hdfc.svg',
    gridArea: 'tall',
    designThinking: {
      problem: 'Improve this screen to make it easy for a user to understand the savings they will get and make the buying process easier like easy selection of card and voucher denomination.',
      solution: 'The redesign uses a clear gift card motif and a 3-step guide to simplify redemption while highlighting the dual reward options for better clarity.',
      keyDecision: 'Replacing cluttered stock imagery with a structured "rewards-first" layout to reduce cognitive load and accelerate the path to purchase.',
    },
    tags: ['Incentive Salience', 'Process Transparency', 'UX'],
  },
  // 5. MOBILE: Services
  {
    id: 'mob-5',
    title: 'Urban Company',
    description: 'Urban Company is a popular service provider for home maintenance needs, offering services such as plumbing, electrical, and cleaning.',
    category: 'Mobile App',
    beforeImage: '/UC.png',
    afterImage: '/Urban%20Comp..svg',
    gridArea: 'tall',
    designThinking: {
      problem: 'Redesign this screen to make it easier for users to determine the number of hours they want the maid to work. Also consider other factors that one needs to consider besides time.',
      solution: 'The redesign replaces generic service cards with a customizable booking engine that allows users to toggle home size, crew size, and specific tasks.',
      keyDecision: 'Shifting from a "package-based" model to a "parameter-based" flow to give users granular control over their time and service expectations.',
    },
    tags: ['Service Personalization', 'Dynamic Pricing', 'Customization UX'],
  },
  // 6. WEB: Development
  {
    id: 'web-3',
    title: 'HTML to design',
    description: 'html.to.design is a popular Chrome extension, that can convert any website into Figma frames.',
    category: 'Web Dashboard',
    beforeImage: '/html.png',
    afterImage: '/html.svg',
    gridArea: 'large',
    designThinking: {
      problem: 'Redesign this screen to make it intuitive for first-time users. You may add, remove or edit the features shown here. Also, improve the overall design quality of this screen.',
      solution: 'The redesign simplifies complex checkbox lists into clean segmented controls and a single primary CTA, reducing choice paralysis.',
      keyDecision: 'Replacing dual-action buttons and multiple checklists with a unified "Capture" flow to guide new users through a linear setup.',
    },
    tags: ['Hick’s Law', 'Information Architecture', 'Visual Hierarchy'],
  },
];

export const WEBSITE_CONTENT = {
  hero: {
    badge: "From Friction to Flow",
    titleLine1: "The Art of",
    titleLine2: "Better Decisions.",
    description: "Explore a collection of pivotal interface redesigns. Move the slider to compare evolution, and dive deep into the strategic thinking that drove the change.",
    scrollText: "Scroll to Explore"
  },
  footer: {
    status: "Open for work",
    headline: "Let's have a word?",
    email: "yuvrajkumar0221@gmail.com",
    socialLinks: {
      pinterest: "https://pin.it/4W3xB3bD4",
      instagram: "https://instagram.com/yu_veeee",
      linkedin: "https://www.linkedin.com/in/yuvrajgupta0221"
    }
  },
  metadata: {
    title: "Interface Gallery | Curated Redesigns",
    description: "A curated collection of interface redesigns comprising mobile apps and web dashboards. Explore the art of better decisions."
  }
};