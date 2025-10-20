const http = require("http");
const fs = require("fs");
const { Transform, pipeline } = require("stream");
const eventEmitter = require("events");

const PORT = 3000;

class UpperCaseStream extends Transform {
  _transform(chunk, _encoding, cb) {
    cb(null, chunk.toString().toUpperCase());
  }
}

class Logger extends eventEmitter {
  log(msg) {
    console.log(`[INFO]: ${msg}`);
    this.emit("info", msg);
  }
  error(msg) {
    console.log(`[ERROR]: ${msg}`);
    this.emit("error", msg);
  }
  warn(msg) {
    console.log(`[WARN]: ${msg}`);
    this.emit("warn", msg);
  }
}

const logger = new Logger();

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    logger.log("Request received");
    res.writeHead(200, { "content-type": "text/plain, charset=utf-8" });

    const src = fs.createReadStream("data.txt");
    const upper = new UpperCaseStream();

    pipeline(src, upper, res, (err) => {
      if (err) {
        logger.error(err.message);
        if (!res.headersSent) {
          res.writeHead(500, { "content-type": "text/plain, charset=utf-8" });
          logger.error("No headers");
        }
        if (!res.writableEnded) {
          res.end("Ошибка обработки файла");
          logger.error("File processing error");
        }
      }
    });
  } else {
    res.writeHead(404, { "content-type": "text/plain, charset=utf-8" });
    res.end("Not found");
    logger.error("Incorrect path or method");
  }
});

server.listen(PORT, () => {
  console.log("server start");
});
