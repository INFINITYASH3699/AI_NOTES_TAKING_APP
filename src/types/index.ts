export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AIResponse {
  result: string;
  success: boolean;
  error?: string;
}

export interface Session {
  user: User;
  token: string;
}