import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = join(process.cwd(), "dist");
const abortedSuspense = "<!--$!--><template></template><!--/$-->";
const failures = [];

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(path);
    } else if (entry.name.endsWith(".html")) {
      const html = await readFile(path, "utf8");
      if (html.includes(abortedSuspense)) failures.push(relative(root, path));
    }
  }
}

await visit(root);

if (failures.length > 0) {
  console.error("静的SSRが中断されたルートを検出しました:");
  failures.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log("静的SSR検査: 全HTMLルート合格");
