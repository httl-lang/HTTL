'use client';

import React from "react";
import styles from './loader.module.css';

export default function Loader() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384" className={styles.loader}>
      <circle
        r="176"
        cy="192"
        cx="192"
        strokeWidth="32"
        fill="transparent"
        pathLength="360"
        className={styles.active}
      ></circle>
      <circle
        r="176"
        cy="192"
        cx="192"
        strokeWidth="32"
        fill="transparent"
        pathLength="360"
        className={styles.track}
      ></circle>
    </svg>
  );
}
