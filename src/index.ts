import { writeFile } from "fs/promises";
import path from "path";
import { chromium, firefox, webkit } from "playwright";
import { generateREADME } from "./generateREADME";
import { listenStaticFileServer } from "./listenStaticFileServer";
import { runScenario } from "./scenario";

const PORT = 3000;

async function main(): Promise<void> {
  const server = await listenStaticFileServer(path.resolve("./public"), PORT);

  const results = await Promise.all(
    [chromium, firefox, webkit].map(async (browserType) => {
      const browser = await browserType.launch();
      return await runScenario(
        browserType.name(),
        await browser.newContext(),
        `http://localhost:${PORT}`
      );
    })
  );

  await writeFile(path.resolve("./README.md"), generateREADME(results));

  server.close();
  process.exit(0);
}

main();
