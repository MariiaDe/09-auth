import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css";

const SITE_URL = "https://notehub.app";

export const metadata: Metadata = {
  title: "Create note | NoteHub",
  description: "Create a new note in NoteHub",
  openGraph: {
    title: "Create note | NoteHub",
    description: "Create a new note in NoteHub",
    url: `${SITE_URL}/notes/action/create`,
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>

        {/* Note form */}
        <NoteForm />
      </div>
    </main>
  );
}
