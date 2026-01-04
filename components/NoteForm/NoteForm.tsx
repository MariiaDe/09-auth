"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/lib/api/notes";
import { useNoteStore, initialDraft, type NoteTag } from "@/lib/store/noteStore";

import styles from "./NoteForm.module.css";

const ALLOWED_TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

type Errors = Partial<Record<keyof typeof initialDraft, string>>;

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  // якщо draft з persist ще не піднявся — буде initialDraft, це ок
  const values = useMemo(() => draft ?? initialDraft, [draft]);

  const [errors, setErrors] = useState<Errors>({});

  const mutation = useMutation({
    mutationFn: () =>
      createNote({
        title: values.title.trim(),
        content: values.content.trim(),
        tag: values.tag,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back(); // важливо: повернення на попередній маршрут
    },
  });

  const validate = (): Errors => {
    const e: Errors = {};
    const title = values.title.trim();

    if (!title) e.title = "Title is required";
    else if (title.length < 3) e.title = "Title must be at least 3 characters";
    else if (title.length > 50) e.title = "Title must not exceed 50 characters";

    const content = values.content.trim();
    if (content.length > 500) e.content = "Content must not exceed 500 characters";

    if (!ALLOWED_TAGS.includes(values.tag)) e.tag = "Please select a valid tag";

    return e;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const e2 = validate();
    setErrors(e2);

    if (Object.keys(e2).length > 0) return;

    mutation.mutate();
  };

  const onCancel = () => {
    // draft НЕ очищаємо по ТЗ
    router.back();
  };

  const handleChange =
    (field: "title" | "content" | "tag") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;

      if (field === "tag") {
        setDraft({ tag: value as NoteTag });
        return;
      }

      setDraft({ [field]: value } as Partial<typeof initialDraft>);
    };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={styles.input}
          autoFocus
          value={values.title}
          onChange={handleChange("title")}
        />
        {errors.title && <span className={styles.error}>{errors.title}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={styles.textarea}
          value={values.content}
          onChange={handleChange("content")}
        />
        {errors.content && <span className={styles.error}>{errors.content}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={styles.select}
          value={values.tag}
          onChange={handleChange("tag")}
        >
          {ALLOWED_TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.tag && <span className={styles.error}>{errors.tag}</span>}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>

        <button type="submit" className={styles.submitButton} disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>

      {mutation.isError && <p className={styles.error}>Не вдалося створити нотатку.</p>}
    </form>
  );
}
