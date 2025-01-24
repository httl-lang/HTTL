// 'use client'

import QuickRun from "@/components/quick-run";
import Image from "next/image";

import styles from "./page.module.css";
import { Nav } from "@/components/nav";
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from "react";
import { Metadata } from "next";

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Docs', href: '/docs', current: false },
  { name: 'Tutorials', href: '#', current: false },
]

export const metadata: Metadata = {
  title: "Home",
  description: "HTTL programming language - Official website",
};

export default function Home() {

  return (
    <div>
      <Nav navigation={navigation} />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
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
              v0.1
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
