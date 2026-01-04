import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import css from "./page.module.css";
import { getMe } from "@/lib/api/serverApi";

const SITE_URL = "https://notehub.app";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page in NoteHub application",
  openGraph: {
    title: "Profile | NoteHub",
    description: "User profile page in NoteHub application",
    url: `${SITE_URL}/profile`,
    images: [{ url: OG_IMAGE }],
  },
};

export default async function ProfilePage() {
  const user = await getMe();

  const avatarSrc = user.avatar || "https://ac.goit.global/fullstack/react/avatar.png";
  const username = user.username || "User";
  const email = user.email;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={avatarSrc}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {username}</p>
          <p>Email: {email}</p>
        </div>
      </div>
    </main>
  );
}
