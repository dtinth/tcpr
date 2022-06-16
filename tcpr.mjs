#!/usr/bin/env node
import { createServer, connect } from 'net'
import { parseArgs } from 'util'
import { pipeline } from 'stream/promises'

const options = {
  listen: {
    type: 'string',
  },
  connect: {
    type: 'string',
  },
}
const { values } = parseArgs({
  args: process.argv.slice(2),
  options,
  allowPositionals: false,
})

const printUsage = () => {
  console.error(`Usage: tcpr --listen [HOST]:PORT --connect HOST:PORT`)
}

if (!values.listen) {
  console.error('--listen is required')
  printUsage()
  process.exit(1)
}

if (!values.connect) {
  console.error('--connect is required')
  printUsage()
  process.exit(1)
}

const parseHostPort = (hostPort) => {
  const match = hostPort.match(/^(.*):(\d+)$/)
  const output = {}
  if (match) {
    if (match[1]) {
      output.host = match[1]
    }
    output.port = parseInt(match[2], 10)
  }
  return output
}

const listenOptions = parseHostPort(values.listen)
const connectOptions = parseHostPort(values.connect)

if (listenOptions.port === undefined) {
  console.error('Must specify --listen port')
  process.exit(1)
}

if (!connectOptions.host) {
  console.error('Must specify --connect host')
  process.exit(1)
}

if (!connectOptions.port) {
  console.error('Must specify --connect port')
  process.exit(1)
}

const log = (message) => console.log(`[${new Date().toJSON()}] ${message}`)
let nextId = 1

const server = createServer((socket) => {
  const id = nextId++
  log(`Handling connection #${id} from ${socket.remoteAddress}`)

  socket.on('error', (e) => {
    log(`Inbound connection #${id} error`)
    console.error(e)
  })

  const targetConnection = connect(connectOptions)
  targetConnection.on('error', (e) => {
    log(`Outbound connection #${id} error`)
    console.error(e)
  })

  let toDestBytes = 0
  let toSourceBytes = 0
  let lastMbs = 0
  const meter = (toDest, toSource) => {
    toDestBytes += toDest
    toSourceBytes += toSource
    const mbs = Math.floor((toDestBytes + toSourceBytes) / 1024 / 1024)
    if (mbs > lastMbs) {
      lastMbs = mbs
      const f = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB'
      log(`Connection #${id}: ${f(toSourceBytes)} <=> ${f(toDestBytes)}`)
    }
  }

  pipe(socket, targetConnection, `Forward stream #${id}`, (size) =>
    meter(size, 0),
  )
  pipe(targetConnection, socket, `Reverse stream #${id}`, (size) =>
    meter(0, size),
  )
})

async function pipe(source, dest, name, meter) {
  try {
    await pipeline(
      source,
      async function* (source) {
        for await (const chunk of source) {
          meter(chunk.length)
          yield chunk
        }
      },
      dest,
    )
  } catch (e) {
    log(`${name} pipeling error`)
    console.error(e)
  } finally {
    log(`${name} closed`)
  }
}

server.listen(listenOptions, () => {
  log(`Server is listening on port ${server.address().port}`)
})
