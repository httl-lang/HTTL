
import styles from './styles.module.css';

interface ColoredTextProps {
  children: React.ReactNode;
}

export function ColoredText(props: ColoredTextProps) {
  const { children } = props;
  return (
    <div className={styles.container}>
      <div className={styles.title}
      //  style={{ clipPath: "url(#clipText)" }}
      >
        {children}
        <div className={styles.aurora}>
          <div className={styles.aurora__item}></div>
          <div className={styles.aurora__item}></div>
          <div className={styles.aurora__item}></div>
          <div className={styles.aurora__item}></div>
        </div>
      </div>
      {/* <svg width="0" height="0">
            <defs>
              <clipPath id="clipText" >
                <text x="345" y="52" font-weight="800" letter-spacing="-2" font-size="44" font-family="sans-serif" fill="white">HTTL Project</text>
                
              </clipPath>
            </defs>
          </svg> */}
    </div>
  );
}
