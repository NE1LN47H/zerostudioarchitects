export interface AboutContent {
  heading: string;
  paragraph1: string;
  paragraph2: string;
  leadArchitects?: string;
  stats?: { label: string; value: string }[];
  updatedAt?: string;
}
