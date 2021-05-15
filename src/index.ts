import path from "path";
import { chromium, firefox, webkit } from "playwright";
import { listenStaticFileServer } from "./listenStaticFileServer";
import { runScenario } from "./scenario";

const PORT = 3000;

async function main(): Promise<void> {
  const server = await listenStaticFileServer(path.resolve("./public"), PORT);

  for (const browserType of [chromium, firefox, webkit]) {
    const browser = await browserType.launch();
    await runScenario(
      browserType.name(),
      await browser.newContext(),
      `http://localhost:${PORT}`
    );
  }

  server.close();
  process.exit(0);
}

main();
