import type { Note } from "@/types/note";
import css from "./NotePreview.module.css";

type NotePreviewProps = {
  note: Note;
};

export default function NotePreview({ note }: NotePreviewProps) {
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>

        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </div>
    </div>
  );
}
