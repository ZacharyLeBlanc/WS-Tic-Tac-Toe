import debugPackage from "debug";
import http from "http";
import app from "./app";
import { initialize } from "./socket";
import { AddressInfo } from "net";

const debug: debugPackage.Debugger = debugPackage("server:server");

interface ServerError extends Error {
  code?: string;
  syscall?: string;
}

const normalizePort = (val: string): string | number | false => {
  const portNumber: number = parseInt(val, 10);

  if (isNaN(portNumber)) {
    // named pipe
    return val;
  }

  if (portNumber >= 0) {
    // port number
    return portNumber;
  }

  return false;
};

const port: string | number | false = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server: http.Server = http.createServer(app);

const onError = (error: ServerError): void => {
  const { code, syscall }: ServerError = error;
  if (syscall !== "listen") {
    throw error;
  }

  const bind: string =
    typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  if (code === "EACCES") {
    throw new Error(`${bind} requires elevated privleges.`);
  } else if (code === "EADDRINUSE") {
    throw new Error(`${bind} is alread in use.`);
  } else {
    throw error;
  }
};

const onListening = (): void => {
  const addr: string | AddressInfo = server.address();
  const bind: string =
    typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
};

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

initialize(server);
