import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}


export type AuthCredentials = {
  email: string;
  password: string;
};

export async function login(data: AuthCredentials): Promise<User> {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function register(data: AuthCredentials): Promise<User> {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
}

export async function checkSession(): Promise<User | null> {
  try {
    const res = await api.get<User>("/auth/session");
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/users/me");
  return res.data;
}

export async function updateMe(data: Partial<Pick<User, "username">>): Promise<User> {
  const res = await api.patch<User>("/users/me", data);
  return res.data;
}
