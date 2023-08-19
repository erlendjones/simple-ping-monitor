import chalk from "chalk";
import { Command } from "commander";

import Debug from "./utils/debug";
import { msToTc } from "./utils/msToTc";
const figlet = require("figlet");
const debug = Debug("CORE");

const program = new Command();

type SongTitle = string;

const queue: SongTitle[] = [];
const inFlight: SongTitle[] = [];

console.log(figlet.textSync("NetMon"));

const options = program.opts();

import pingus from "pingus"; // ESM, Typescript

// http Get

const ping = (ip: string, name: string) => {
  pingus
    .icmp({
      host: ip,
    })
    .then((res: any) => {
      if (res?.reply?.typestr === "ECHO_REPLY")
        console.log(chalk.green("[" + name + "]: UP"));
      else console.log(chalk.red("[" + name + "]: DOWN"));
    });
};

ping("2.0.0.21", "ARTNET: Video");
ping("2.0.0.50", "ARTNET: AJA FS HDR");
ping("2.0.0.51", "ARTNET: XLIT Mac");
ping("2.0.0.100", "ARTNET: GrandMA 2");
ping("192.168.1.237", "DANTE: Imag IO-boks 1");
ping("192.168.1.238", "DANTE: Imag IO-boks 2");
ping("192.168.1.239", "DANTE: XLIT Mac");
ping("192.168.1.196", "DANTE: Tracksbox");
