#!/usr/bin/env node

import { program } from "commander";
import Httl from "httl-core";

program
  .version("1.0.0")
  .description("A simple CLI tool")
  .option("-n, --name <type>", "Your name")
  .action(async (options) => {
    const httl = new Httl({
      workdir: process.cwd()
    });

    const res = await httl
      .createDocument(`get ${options.name}`)
      .run();

    console.log(JSON.stringify(res, null, 2));
  });

program.parse(process.argv);