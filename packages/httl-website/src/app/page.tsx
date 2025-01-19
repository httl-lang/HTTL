import QuickRun from "@/components/quick-run";
import Image from "next/image";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <header className={styles.header}>
        <Image src="/logo.svg" alt="HTTL Logo" width={100} height={100} />
      </header>
      <main className={styles.main}>
        <QuickRun />
      </main>
    </div>
  );
}
