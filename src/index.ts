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

const ping = (ip: string, name: string): Promise<any> => {
  return new Promise((resolve, reject) => pingus
    .icmp({
      host: ip,
    })
    .then((res: any) => {
      if (res?.reply?.typestr === "ECHO_REPLY")
        resolve(chalk.greenBright(ip + " [" + name + "]: UP"));
      else resolve(chalk.redBright(ip + " [" + name + "]: DOWN"));
    }))
};

let result: any[] = [];
let resultTimestamp: number = 0;
let resultInflight = false;
const run = () => {
  resultInflight = true
  Promise.all([
    // Artnet
    ping("2.0.0.21", "ARTNET: Video"),
    ping("2.0.0.50", "ARTNET: AJA FS HDR"),
    ping("2.0.0.51", "ARTNET: XLIT Mac"),
    ping("2.0.0.101", "ARTNET: GrandMA 2"),
    // Dante
    ping("192.168.1.237", "DANTE: Imag IO1"),
    ping("192.168.1.238", "DANTE: Imag IO2"),
    ping("192.168.1.239", "DANTE: XLIT Mac"),
    ping("192.168.1.196", "DANTE: Tracks"),
  ]).then((results: any[]) => {
    resultInflight = false;
    result = results;
    resultTimestamp = Date.now()
    print()
  })
}

const print = () => {
  console.clear()
  if (resultInflight) console.log(chalk.blueBright('Running...'))
  else console.log(chalk.blueBright(Math.round((Date.now() - resultTimestamp) / 1000) + ' seconds ago...'))
  result.forEach(res => console.log(res))
}

// init
run()
setInterval(run, 10000)
setInterval(print, 1000)