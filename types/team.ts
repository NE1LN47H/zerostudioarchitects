export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  imagePublicId?: string;
  bio?: string;
  order: number;
  visible: boolean;
  width?: number;
  height?: number;
  updatedAt?: string;
}
