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
        <div className="mb-8 flex justify-center">
          <a href="https://www.producthunt.com/posts/httl-project?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-httl&#0045;project" target="_blank">
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=949212&theme=light&t=1744077126105"
              alt="HTTL&#0032;Project - HTTL&#0032;&#0043;&#0032;GitHub&#0032;Copilot&#0032;&#0061;&#0032;Instant&#0032;OpenAPI&#0032;Specs | Product Hunt"
              style={{ width: 250, height: 54 }} width="250" height="54" />
          </a>
        </div>
        <ReleaseLabel className="mb-8 flex justify-center" />
        <div className="text-center">
          <ColoredText>
            <h1 className="font-display text-5xl text-white">
              Reimagine Your API Projects with HTTL & Copilot
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
              Install From <strong>VS Code Marketplace</strong>
            </a>
            <a href="/docs/httl-project" className="text-base font-semibold text-gray-400 hover:text-gray-100">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className={`${styles.videoContainer} mt-14`}>
          <div className={styles.ambientVerlay} />
          <video className={styles.video}
            autoPlay muted loop playsInline
            poster="/videos/httl-demo.jpg">
            <source src="/videos/httl-demo.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
