import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { AxiosResponse } from "axios";

/* =======================
   Types
======================= */

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export type AuthCredentials = {
  email: string;
  password: string;
};

/* =======================
   Notes
======================= */

export async function fetchNotes(
  page = 1,
  perPage = 12,
  search = "",
  tag?: Note["tag"]
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage };

  if (search) params.search = search;
  if (tag) params.tag = tag;

  const res: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params,
  });

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return res.data;
}

export async function createNote(data: {
  title: string;
  content: string;
  tag: Note["tag"];
}): Promise<Note> {
  const res: AxiosResponse<Note> = await api.post("/notes", data);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return res.data;
}

/* =======================
   Auth
======================= */

export async function register(
  data: AuthCredentials
): Promise<User> {
  const res: AxiosResponse<User> = await api.post("/auth/register", data);
  return res.data;
}

export async function login(
  data: AuthCredentials
): Promise<User> {
  const res: AxiosResponse<User> = await api.post("/auth/login", data);
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  try {
    const res: AxiosResponse<User | null> = await api.get("/auth/session");
    return res.data ?? null;
  } catch {
    return null;
  }
}

/* =======================
   User
======================= */

export async function getMe(): Promise<User> {
  const res: AxiosResponse<User> = await api.get("/users/me");
  return res.data;
}

export async function updateMe(
  data: Partial<Pick<User, "username">>
): Promise<User> {
  const res: AxiosResponse<User> = await api.patch("/users/me", data);
  return res.data;
}
