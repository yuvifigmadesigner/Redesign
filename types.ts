export interface RedesignCase {
  id: string;
  title: string;
  description: string;
  category: 'Mobile App' | 'Web Dashboard' | 'Landing Page' | 'E-commerce' | 'Portfolio';
  beforeImage: string;
  afterImage: string;
  gridArea: 'small' | 'wide' | 'tall' | 'large'; // Controls bento grid span
  designThinking: {
    problem: string;
    solution: string;
    keyDecision: string;
  };
  tags: string[];
  externalLink?: string; // Optional URL for redirect items
  backgroundColor?: string; // Optional custom background color for image container
  imageFit?: 'cover' | 'contain'; // Optional control for object-fit
}
