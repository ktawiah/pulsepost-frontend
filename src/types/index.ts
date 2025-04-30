export interface Post {
  id: string;
  url: string;
  user: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  status: "draft" | "published" | "archived";
  likes: string[];
  comments_count: number;
  likes_count: number;
  is_liked: boolean;
  tags: Tag[];
}

export interface Tag {
  id: string;
  url: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  posts_count: number;
}

export interface Comment {
  id: string;
  url: string;
  user: string;
  user_email: string;
  post: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent: string | null;
  replies_count: number;
}

export interface Like {
  id: string;
  url: string;
  user: string;
  post: string;
  created_at: string;
  updated_at: string;
} 