import { Metadata } from "next";

import styles from './page.module.css';
import { ColoredText } from "@/components/colored-text";
import { ReleaseLabel } from "@/components/release-label";

export const metadata: Metadata = {
  title: "HTTL",
  description: "HTTP programming language, simplify HTTP calls, lightweight HTTP tools, HTTL language, REST client, HTTP client, HTTP request, HTTP response, HTTP headers, HTTP status code, HTTP methods, HTTP status codes, HTTP headers, HTTP request headers, HTTP response headers, HTTP request methods, HTTP response status codes",
};

export default function HttlProject() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <ReleaseLabel  className="mb-8 flex justify-center" />

        <div className="text-center">
          <ColoredText>
            <h1 className=" font-display text-5xl text-white">
              Transform Your API Project with Ease
            </h1>
          </ColoredText>

          <p className="mt-8 text-2xl" style={{ color: "#dbe7fd" }}>
            Automatically Generate OpenAPI Specs and Call APIs in a Snap!
          </p>

          <div className="mt-10 flex items-center justify-center flex-wrap gap-x-8 gap-y-6">
            <a
              href="https://marketplace.visualstudio.com/items?itemName=HTTL.httl-vscode"
              className={`${styles.button} `}
            >
              <img src="/vscode-logo.png" alt="VS Code" className="h-6 w-6 mr-1" />
              Install From VS Code Marketplace
            </a>
            <a href="/docs/httl-project" className="text-base font-semibold text-gray-400">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>


        {/* <svg className="absolute -bottom-48 left-[-40%] h-[80rem] w-[180%] lg:top-[-40%] lg:-right-40 lg:bottom-auto lg:left-auto lg:h-[180%] lg:w-[80rem]"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id=":S1:-desktop" cx="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 3)"></stop>
              <stop offset="53.95%" stopColor="rgba(0, 71, 255, 0.09)"></stop>
              <stop offset="100%" stopColor="rgba(10, 14, 23, 0)"></stop>
            </radialGradient>
            <radialGradient id=":S1:-mobile" cy="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)"></stop>
              <stop offset="53.95%" stopColor="rgba(0, 71, 255, 0.09)"></stop>
              <stop offset="100%" stopColor="rgba(10, 14, 23, 0)"></stop>
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#:S1:-desktop)" className="hidden lg:block"></rect>
          <rect width="100%" height="100%" fill="url(#:S1:-mobile)" className="lg:hidden"></rect>
        </svg> */}

        {/* <div className={`${styles.videoContainer} mt-14`}>
          <svg className={styles.ambientVerlay} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="turbulence">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.05"
                  numOctaves="2"
                  result="turbulence"
                />
                <feDisplacementMap
                  in2="turbulence"
                  in="SourceGraphic"
                  scale="10"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>

              <radialGradient id="dynamicAmbientLight"
                cx="50%" cy="50%"
                r="50%"
                fx="50%"
                fy="50%"
              >
                <stop offset="0%" stopColor="#4ecdc4" stopOpacity="0.6">
                  <animate
                    attributeName="stop-color"
                    values="#4ecdc4;#ff6b6b;#45b7d1;#4ecdc4"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stop-opacity"
                    values="0.6;0.8;0.4;0.6"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.4">
                  <animate
                    attributeName="stop-color"
                    values="#ff6b6b;#45b7d1;#4ecdc4;#ff6b6b"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stop-opacity"
                    values="0.4;0.6;0.2;0.4"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </stop>
              </radialGradient>
            </defs>

            <rect
              x="0" y="0"
              width="100" height="100"
              fill="url(#dynamicAmbientLight)"
              filter="url(#turbulence)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="20s"
                repeatCount="indefinite"
              />
            </rect>
          </svg>
          <video className={styles.video}
            autoPlay muted loop controls
            poster="https://assets.apidog.com/static/fast-request-www/videos/poster.png">
            <source src="https://assets.apidog.com/static/fast-request-www/videos/actions.mp4" type="video/mp4" />
          </video>
        </div> */}

        <div className={`${styles.videoContainer} mt-14`}>
          <div className={styles.ambientVerlay} />
          <video className={styles.video}
            autoPlay muted loop controls
            poster="https://assets.apidog.com/static/fast-request-www/videos/poster.png">
            <source src="https://assets.apidog.com/static/fast-request-www/videos/actions.mp4" type="video/mp4" />
          </video>
          
        </div>

      </div>

    </div>
  );
}
