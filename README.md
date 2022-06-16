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

Every megabyte of data transferred is logged:

```
[2022-06-16T17:20:58.463Z] Server is listening on port 5901
[2022-06-16T17:21:13.367Z] Handling connection #1 from 100.xx.xx.xx
[2022-06-16T17:21:33.266Z] Connection #1: 1.04 MB <=> 0.00 MB
[2022-06-16T17:24:33.599Z] Connection #1: 2.00 MB <=> 0.00 MB
[2022-06-16T17:24:34.296Z] Connection #1: 3.03 MB <=> 0.00 MB
[2022-06-16T17:25:16.794Z] Connection #1: 3.99 MB <=> 0.01 MB
[2022-06-16T17:25:20.425Z] Connection #1: 5.02 MB <=> 0.02 MB
```

## Modern Node.js APIs used

- [ECMAScript modules (.mjs)](https://nodejs.org/api/esm.html)
- [Streams with async generators](https://2ality.com/2019/11/nodejs-streams-async-iteration.html)
- [`stream/promises`](https://nodejs.org/api/stream.html#streams-promises-api)’s [`pipeline()`](https://nodejs.org/api/stream.html#streampipelinestreams-callback)
- [`util.parseArgs`](https://nodejs.org/api/util.html#utilparseargsconfig)
