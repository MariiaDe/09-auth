import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

function getCookieHeader(): string {
  
  return cookies().toString();
}

export async function fetchNotes(params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: Note["tag"];
}): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = "", tag } = params;

  const res = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
    headers: {
      Cookie: getCookieHeader(),
    },
  });

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: getCookieHeader(),
    },
  });

  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/users/me", {
    headers: {
      Cookie: getCookieHeader(),
    },
  });

  return res.data;
}

export async function checkSession(): Promise<User | null> {
  try {
    const res = await api.get<User>("/auth/session", {
      headers: {
        Cookie: getCookieHeader(),
      },
    });

   
    return res.data ?? null;
  } catch {
    return null;
  }
}
