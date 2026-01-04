"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/notes";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";
import type { Note } from "@/types/note";

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data: note, isLoading, error } = useQuery<Note, Error>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id!),
    enabled: !!id,
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading, please wait...</p>}
      {(error || !note) && !isLoading && <p>Something went wrong.</p>}
      {note && <NotePreview note={note} />}
    </Modal>
  );
}
