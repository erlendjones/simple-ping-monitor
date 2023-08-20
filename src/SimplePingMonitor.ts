import chalk from "chalk";
import logSymbols from "log-symbols";
import pingus from "pingus";
import fetch from "node-fetch";
const figlet = require("figlet");

type Machine = [ip: string, name: string, category?: string];
type Result = { machine: Machine; result: any };
export class SimplePingMonitor {
  runInterval: NodeJS.Timer;
  printInterval: NodeJS.Timer;
  result: Result[];
  resultTimestamp: any;
  resultInflight: boolean;
  machines: Machine[];
  lenIP: number;
  lenName: number;
  httpTimeout: any;
  watchInterval: number;

  constructor(
    machines: Machine[],
    options?: {
      interval?: number; // ms
      httpTimeout?: number; // ms
    }
  ) {
    this.machines = machines;
    this.httpTimeout = options?.httpTimeout || 3000;
    this.watchInterval = options?.interval || 10000;

    // get max lengths for printing
    this.lenIP = Math.max(...this.machines.map((m) => m[0].length));
    this.lenName = Math.max(...this.machines.map((m) => m[1].length));

    // reset
    this.result = [];
    this.resultTimestamp = 0;
    this.resultInflight = false;

    // init
    this.runInterval = setInterval(this.run, this.watchInterval);
    this.printInterval = setInterval(this.print, 1000);

    // pre-run
    this.run();
    this.print();
  }

  run = async () => {
    this.resultInflight = true;

    // run all machines
    let complete = 0;
    for (let i = 0; i < this.machines.length; i++) {
      // init result
      if (this.result[i] === undefined)
        this.result[i] = {
          machine: this.machines[i],
          result: this.line(
            null,
            this.machines[i][0],
            this.machines[i][1],
            "Running..."
          ),
        };

      // run
      this.process(...this.machines[i]).then((result: Result) => {
        // save result
        this.result[i] = result;

        // count complete
        complete++;

        // when all machines are complete, reset
        if (complete === this.machines.length) {
          this.resultInflight = false;
          this.resultTimestamp = Date.now();
        }

        // do print
        this.print();
      });
    }
  };

  pad = (str: string, len: number): string => {
    if (str.length < len) {
      str = str + " ".repeat(len - str.length);
    }
    return str;
  };

  print = () => {
    // reset console
    console.clear();
    console.log(figlet.textSync("PingMonitor"));
    console.log();

    // sort by category
    let lastCategory = "";

    // print results
    this.result.forEach((res: Result) => {
      // print category
      if (res.machine[2] !== lastCategory) {
        console.log();
        console.log("   " + chalk.gray(res.machine[2]));
        lastCategory = res.machine[2] || "";
      }

      // print result
      console.log(res.result);
    });

    // print footer
    console.log();

    // print time since last run
    if (this.resultInflight || this.resultTimestamp === 0)
      console.log("   " + chalk.blueBright("Running..."));
    else
      console.log(
        "   " +
          chalk.blueBright(
            Math.round((Date.now() - this.resultTimestamp) / 1000) +
              " seconds ago..."
          )
      );
  };

  ping = (ip: string, name: string, category?: string): Promise<any> => {
    return new Promise((resolve, reject) =>
      pingus
        .icmp({
          host: ip,
        })
        .then((res: any) => {
          if (res?.reply?.typestr === "ECHO_REPLY")
            resolve({
              machine: [ip, name, category],
              result: this.line(true, ip, name),
            });
          else
            resolve({
              machine: [ip, name, category],
              result: this.line(false, ip, name),
            });
        })
    );
  };

  http = (ip: string, name: string, category?: string): Promise<any> => {
    return new Promise((resolve, reject) =>
      fetch(ip, {
        type: "GET",
        timeout: this.httpTimeout,
      })
        .then((res: any) => {
          if (res?.status === 200)
            resolve({
              machine: [ip, name, category],
              result: this.line(
                true,
                ip,
                name,
                res.status + " " + res.statusText
              ),
            });
          else
            resolve({
              machine: [ip, name, category],
              result: chalk.red(
                this.line(false, ip, name, res.status + " " + res.statusText)
              ),
            });
        })
        .catch((err: Error & { code: string }) => {
          resolve({
            machine: [ip, name, category],
            result: this.line(false, ip, name, err.code),
          });
        })
    );
  };

  line = (
    succes: boolean | null,
    ip: string,
    name: string,
    extra?: string
  ): any => {
    if (succes === null)
      return (
        " " +
        logSymbols.warning +
        " " +
        chalk.white(this.pad(name, this.lenName)) +
        " " +
        chalk.gray(
          this.pad("(" + ip + ")", this.lenIP + 2) + " " + (extra || "")
        )
      );
    if (succes)
      return (
        " " +
        logSymbols.success +
        " " +
        chalk.white(this.pad(name, this.lenName)) +
        " " +
        chalk.gray(
          this.pad("(" + ip + ")", this.lenIP + 2) + " " + (extra || "")
        )
      );
    else
      return chalk.red(
        " " +
          logSymbols.error +
          " " +
          this.pad(name, this.lenName) +
          " " +
          this.pad("(" + ip + ")", this.lenIP + 2) +
          " " +
          (extra || "")
      );
  };

  process = (ip: string, name: string, category?: string): Promise<any> => {
    if (ip.includes("http")) {
      return this.http(ip, name, category);
    } else {
      return this.ping(ip, name, category);
    }
  };
}
