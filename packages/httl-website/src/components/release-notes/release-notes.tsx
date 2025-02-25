import React from 'react'
import styles from './release-notes.module.css';
import { MdxRenderer } from '../mdx-renderer';

interface Change {
  title: string;
  description?: string;
  type: 'feature' | 'fix';
}

interface Package {
  version: string;
  changes?: Change[];
}

type PackageName = 'httl' | 'cli' | 'vscode';

interface Release {
  date: string;
  packages: Record<PackageName, Package>;
}

interface ReleaseNoteItemProps {
  release: Release;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });

  const formattedDate = formatter.format(date);
  console.log(formattedDate); // Output: Feb 23, 2025

  // Return formatted date
  return { formattedDate };
}


export const ReleaseDate = ({
  date
}: { date: string }) => {
  const { formattedDate } = formatDate(date);
  return (
    <div className={styles.date}>
      <div className={styles.dash}></div>
      <h3 id={date}>
        <a href={`#${date}`} className={styles.dateLink}>
          {formattedDate}
        </a>
      </h3>
    </div>
  );
}

export const ChangesTypeSection = async ({
  changes,
  type
}: { changes?: Change[], type: 'feature' | 'fix' }) => {

  const changeRecords = changes?.filter((change) => change.type === type)

  if (!changeRecords?.length)
    return null;

  return (
    <div >
      <h5 style={{ fontWeight: 'bold' }}>
        {
          type === 'feature' ? 'New Features' : 'Fixes'
        }
      </h5>
      <ul>
        {
          changeRecords.map((change: Change, index: number) => (
            <li key={index}>
              <strong>{change.title}</strong>
              {
                change.description && <MdxRenderer content={change.description} />
              }
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export const ReleaseNoteItem = ({
  release
}: ReleaseNoteItemProps) => {

  return (
    <div className={styles.releaseNoteItem}>
      <div className={styles.header}>
        <ReleaseDate date={release.date} />
      </div>
      {Object.entries(release.packages).map(([packageName, data]) => (
        <div key={packageName} className={styles.item}>
          <a href={`#${packageName.toUpperCase()}-${data.version}`} className={styles.packageTitles}>
            <h3 id={`${packageName.toUpperCase()}-${data.version}`}>
              {packageName.toUpperCase()} {data.version}
            </h3>
          </a>

          <div className={styles.changes}>
            <ChangesTypeSection changes={data.changes} type="feature" />
            <ChangesTypeSection changes={data.changes} type="fix" />

            {
              !data.changes?.length && (
                <div>
                  <h5>Adding support for HTTL {release.packages.httl.version}</h5>
                </div>
              )
            }
          </div>
        </div>
      ))}
    </div>
  )
}

export const Scale = () => (
  <div className={styles.scale}>
    <svg>
      <defs>
        <pattern id="dash" width="6" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 0H6M0 8H6" fill="none"></path>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dash)"></rect>
    </svg>
  </div>
)

export const ReleaseNotes = ({
  releases
}: { releases: Release[] }) => {
  return (
    <div className={styles.conatiner}>
      <div>
        <Scale />
      </div>
      <div className={styles.items}>
        {
          releases.map((release) => {
            return <ReleaseNoteItem release={release} key={release.date} />;
          })
        }
      </div>
    </div>
  )
}
