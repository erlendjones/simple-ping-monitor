import { SimplePingMonitor } from "./SimplePingMonitor";

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
