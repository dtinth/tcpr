# tcpr

A simple TCP proxy using modern Node.js APIs and zero dependencies.

**Requires Node.js v18.4.0 or higher.**

## Usage

```sh
tcpr --listen [HOST]:PORT --connect HOST:PORT
```

For example, to forward a VNC port from Tailscale to a virtual machine:

```sh
tcpr --listen 100.xx.xx.xx:5901 --connect 192.168.64.xx:5900
```

## Modern Node.js APIs used

- [Streams with async generators](https://2ality.com/2019/11/nodejs-streams-async-iteration.html)
- [`stream/promises`](https://nodejs.org/api/stream.html#streams-promises-api)’s [`pipeline()`](https://nodejs.org/api/stream.html#streampipelinestreams-callback)
- [`util.parseArgs`](https://nodejs.org/api/util.html#utilparseargsconfig)
