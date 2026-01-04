"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api/notes";
import type { Note } from "@/types/note";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

import css from "./page.module.css";

const PER_PAGE = 12;

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const TAGS: Note["tag"][] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];
type TagFilter = Note["tag"] | "all";

function isNoteTag(value: string): value is Note["tag"] {
  return (TAGS as string[]).includes(value);
}

export default function NotesClient({ initialTag }: { initialTag: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const queryClient = useQueryClient();

  const normalized: TagFilter = useMemo(() => {
    if (initialTag === "all") return "all";
    if (isNoteTag(initialTag)) return initialTag;
    return "all";
  }, [initialTag]);

  // ✅ В API тег "all" НЕ передаємо
  const tagForApi: Note["tag"] | undefined = normalized === "all" ? undefined : normalized;

  const queryKey = ["notes", page, debouncedSearch, normalized];

  const { data, isLoading, error } = useQuery<FetchNotesResponse, Error>({
    queryKey,
    queryFn: () => fetchNotes(page, PER_PAGE, debouncedSearch, tagForApi),
    placeholderData: queryClient.getQueryData<FetchNotesResponse>([
      "notes",
      page - 1,
      debouncedSearch,
      normalized,
    ]),
    staleTime: 5000,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Could not fetch the list of notes. {error.message}</p>;

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.wrapper}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            forcePage={page - 1}
            onPageChange={({ selected }) => setPage(selected + 1)}
          />
        )}

        {/* ✅ замість кнопки+модалки */}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {notes.length ? <NoteList notes={notes} /> : <p>No notes found.</p>}
    </div>
  );
}
