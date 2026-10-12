export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  imagePublicId?: string;
  bio?: string;
  order: number;
  visible: boolean;
  updatedAt?: string;
}
