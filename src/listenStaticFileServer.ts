import express from "express";
import type { Server } from "http";

export function listenStaticFileServer(root: string, port: number): Server {
  const app = express();
  app.use(express.static(root));
  return app.listen(port);
}
