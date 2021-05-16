import type { ScenarioResult } from "./scenario";

function resultToTableRow(result: ScenarioResult): string {
  return `| ${[
    `${result.name} (${result.version})`,
    `\`${result.notVisitedColor}\``,
    `\`${result.visitedColor}\``,
    result.notVisitedColor === result.visitedColor ? "⭕" : "❌",
  ].join(" | ")} |`;
}

export function generateREADME(results: ScenarioResult[]): string {
  return `# \`:visited\` pseudo History Leaking

## Description

\`:visited\` pseudo class was limited getting part of style property for privacy reasons.

> For privacy reasons, browsers strictly limit which styles you can apply using this pseudo-class, and how they can be used:
>
> - Allowable CSS properties are \`color\`, ...
>
> From [:visited - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:visited#privacy_restrictions)

This repository was research result of implementation each browsers.

## Result

| Browser (version) | \`color\` of \`:link\` | \`color\` of \`:visited\` | Valid? |
| :--- | :---: | :---: | :---: |
${results.map(resultToTableRow).join("\n")}
`;
}
