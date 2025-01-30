import { Metadata } from "next";

import QuickRun from "@/components/quick-run";
import { Nav } from "@/components/nav";

import packageJson from '../../../package.json';

import styles from './page.module.css';


const navigation = [
  { name: 'Docs', href: '/docs', current: false },
]

export const metadata: Metadata = {
  title: "Home",
  description: "HTTL programming language - Official website",
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
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-500 ring-1 ring-gray-200/10">
              v{packageJson.version}
            </div>
          </div>
          <div className="text-center">
            <h1 className="mt-14 font-display text-5xl font-semibold text-white">
              Lightweight programming language
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
