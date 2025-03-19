export default interface Story {
    _id: string;
    title: string;
    genre: string;
    summary: string;
    content?: string;
    thumbnailUrl: string;
    imageUrl: string;
    likes?: number;
}
  