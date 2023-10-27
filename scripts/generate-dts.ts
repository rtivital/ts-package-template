import path from "path";
import fs from "fs-extra";
import { execa } from "execa";

console.log(process.cwd());

export default async function generateDts() {
  await execa("yarn", ["tsc"]);
  // await fs.copy(
  //   path.join(packagePath, "lib/index.d.ts"),
  //   path.join(packagePath, "lib/index.d.mts")
  // );
}

generateDts();
