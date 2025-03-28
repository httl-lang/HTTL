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
        <ReleaseLabel className="mb-8 flex justify-center" />

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
              className={`${styles.button} hover:bg-gray-700`}
            >
              <img src="/vscode-logo.png" alt="VS Code" className="h-6 w-6 mr-1" />
              Install From VS Code Marketplace
            </a>
            <a href="/docs/httl-project" className="text-base font-semibold text-gray-400 hover:text-gray-100">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

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
