import { Metadata } from "next";

import QuickRun from "@/components/quick-run";
import { Nav } from "@/components/nav";

import releases from '../../../../../releases.json';

import styles from './page.module.css';


const navigation = [
  { name: 'Docs', href: '/docs', current: false },
  { name: 'VS Code Extension', href: 'https://marketplace.visualstudio.com/items?itemName=HTTL.httl-vscode', current: false },
  { name: 'CLI', href: 'https://www.npmjs.com/package/httl-cli', current: false },
]

export const metadata: Metadata = {
  title: "HTTL",
  description: "HTTP programming language, simplify HTTP calls, lightweight HTTP tools, HTTL language, REST client, HTTP client, HTTP request, HTTP response, HTTP headers, HTTP status code, HTTP methods, HTTP status codes, HTTP headers, HTTP request headers, HTTP response headers, HTTP request methods, HTTP response status codes",
};

export default function Home() {
  return (
    <div>
      <Nav navigation={navigation} />
      <div className={`${styles.pageBG} mx-auto max-w-6xl absolute -z-10 transform-gpu overflow-hidden blur-3xl`}>
        <div />
      </div>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-8">
          <div className="flex items-center sm:mb-8 justify-center ">
            <img
              alt="HTTL"
              src="./logo-full.svg"
              className="h-12 w-auto"
            />
          </div>
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <a href={`/docs/release-notes#${releases[0].date}`} className="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-gray-200/10">
              <span className="text-gray-500">Release</span> #{releases[0].date}
            </a>
          </div>
          <div className="text-center">
            <h1 className="mt-14 font-display text-5xl font-semibold text-white">
              First HTTP programming language
            </h1>
            <p className="mt-8 text-3xl text-sky-300">
              Designed to simplify and streamline HTTP calls
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/docs"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a href="/docs/guide" className="text-sm/6 font-semibold text-gray-400">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl py-8">
          <QuickRun />
        </div>
      </div>
    </div>
  );
}
