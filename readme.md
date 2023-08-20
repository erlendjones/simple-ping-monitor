<h2>A simple monitoring tool, for your local network setup. </h2>

Easily monitor that all machines are connected and reachable in your setup.

<img width="478" alt="readme-image" src="https://github.com/erlendjones/simple-ping-monitor/assets/9471063/3ded6fa4-bd1d-4358-85e7-25a1e71b95cd">

<h2>Install</h2>

You need <a href="https://nodejs.org/en/download">node.js</a> and npm or <a href="https://www.hostinger.com/tutorials/how-to-install-yarn">yarn</a> already installed on your system.
Tested with Node v18.16.0 and Yarn v1.22.19

```
$ git clone git@github.com:erlendjones/simple-ping-monitor.git
$ cd simple-ping-monitor
```

```$ yarn``` or ```$ npm install```

<h2>Setup</h2>
Edit index.ts with your setup

```
new SimplePingMonitor(
  [
    // Artnet
    ["2.0.0.21", "FOH: Resolume-Mac", "Artnet"],
    ["2.0.0.101", "FOH: GrandMA2", "Artnet"],
    ["2.0.0.50", "OB: AJA FS HDR", "Artnet"],
    ["2.0.0.51", "OB: Mac Mini", "Artnet"],

    // Dante
    ["192.168.1.237", "OB: Imag IO1", "Dante"],
    ["192.168.1.238", "OB: Imag IO2", "Dante"],
    ["192.168.1.239", "OB: Mac Mini", "Dante"],
    ["192.168.1.196", "STAGE: Tracks", "Dante"],

    // Services
    ["http://127.0.0.1:3345", "Voice-server", "Services"],
    // when requesting a http-endpoint, it looks for a 200-response
  ],
  {
    interval: 10000,
    httpTimeout: 3000,
  }
);
```

The monitor accepts an array of machines or endpoints to watch.

They can be either pinged with icmp, or request an HTTP/HTTPS GET-endpoint and wait for a 200-response.

<h2>Run</h2>

```
$ yarn dev
```

you can also use

```
$ yarn dev-watch
```
for frequent changes, or
```
$ yarn build
$ yarn start
```
for permanent setups
