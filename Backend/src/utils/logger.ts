import pino from "pino";

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      options: {
        destination: "./logs/output.log",
        mkdir: true,
        translateTime: "SYS:dd-mm-yyyy hh-mm-ss",
        ignore: "pid,hostname",
        colorize: false,
      },
    },
    // {
    //   target: "pino-pretty",
    //   options: {
    //     destination: process.stdout.fd,
    //   },
    // },
  ],
});

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || "info",
    redact: {
      paths: ["email", "password", "address"],
      remove: true,
    },
  },
  transport,
);

export default logger;
