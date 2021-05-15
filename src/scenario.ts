import path from "path";
import type { BrowserContext } from "playwright";

export interface ScenarioResult {
  name: string;
  version: string;
  screenshotPath: string;
  visitedColor: string;
  notVisitedColor: string;
}

export async function runScenario(
  name: string,
  browserContext: BrowserContext,
  url: string
): Promise<ScenarioResult> {
  const page = await browserContext.newPage();

  await page.goto(url, { waitUntil: "load" });
  await page.click(`a#visited`);
  await page.waitForLoadState("load");
  await page.goBack({ waitUntil: "load" });

  const screenshotPath = path.join(
    "./screenshots",
    path.normalize(`${name}.png`)
  );
  await page.screenshot({
    path: path.resolve(screenshotPath),
    clip: {
      x: 0,
      y: 0,
      width: 150,
      height: 60,
    },
  });

  const result: ScenarioResult = {
    name,
    version: browserContext.browser()?.version() ?? "unknown",
    screenshotPath,
    visitedColor: await page.$eval(
      `a#visited`,
      (e) => getComputedStyle(e).color
    ),
    notVisitedColor: await page.$eval(
      `a#not-visited`,
      (e) => getComputedStyle(e).color
    ),
  };

  await page.close();

  return result;
}
