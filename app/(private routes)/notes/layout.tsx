import type { ReactNode } from "react";
import css from "./layout.module.css";

export default function NotesLayout({ children }: { children: ReactNode }) {
  return <div className={css.layout}>{children}</div>;
}
