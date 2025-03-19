export interface User {
  id?: string;
  avatar: string;
  displayName: string;
  email: string;
}

export interface AvatarCarouselProps {
  onSelectAvatar?: (id: string) => void;
  selectedAvatarId?: string;
}

export interface Story {
  id: string;
  title: string;
  genre: string;
  summary: string;
  content?: string;
  image?: string;
  createdAt: string;
}
