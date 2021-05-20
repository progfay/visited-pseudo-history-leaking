import path from "path";
import { performance } from "perf_hooks";
import type { BrowserContext } from "playwright";
import { chromium, firefox, webkit } from "playwright";
import { listenStaticFileServer } from "./listenStaticFileServer";

export interface ScenarioResult {
  name: string;
  time: number;
}

export async function measurePerformance(
  browserContext: BrowserContext,
  color: string
): Promise<number> {
  const page = await browserContext.newPage();

  const load1 = page.waitForLoadState("domcontentloaded");
  await page.goto("http://localhost:3000/canvas.html");
  await load1;
  const before = performance.now();
  await page.$eval(
    "canvas",
    (canvas, color) => {
      const context = canvas.getContext("2d");
      if (context === null) return NaN;
      context.fillStyle = color;
      context.rect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 1000000; i++) {
        context.fill();
      }
    },
    color
  );
  const after = performance.now();

  await page.close();
  return after - before;
}

const PORT = 3000;
const COLORS = [
  "rgba(128, 128, 128, 1)",
  "rgba(128, 128, 128, 0.01)",
  "rgba(128, 128, 128, 0)",
];

async function main(): Promise<void> {
  const server = await listenStaticFileServer(path.resolve("./public"), PORT);

  for (const browserType of [chromium, firefox, webkit]) {
    const browser = await browserType.launch();
    const context = await browser.newContext();
    for (const color of COLORS) {
      const time = await measurePerformance(context, color);
      console.log(
        browserType.name().padEnd(10),
        color.padEnd(28),
        time.toFixed(10).padStart(18),
        "ms"
      );
    }

    for (const color of COLORS) {
      const time = await measurePerformance(context, color);
      console.log(
        browserType.name().padEnd(10),
        color.padEnd(28),
        time.toFixed(10).padStart(18),
        "ms"
      );
    }
  }

  server.close();
  process.exit(0);
}

main();
