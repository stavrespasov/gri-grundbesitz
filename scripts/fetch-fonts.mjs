import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";

// Fontshare permits self-hosting on this website but not font redistribution
// through public repositories. Fetch the original, unmodified files directly.
const FONTS = [
  [
    "500",
    "https://cdn.fontshare.com/wf/CNIAHX5RKVK53N3YCRZR5R3L3S4OTBSU/DBNFGKYNM3IIQU3Q4SC6XOOFS6UMAW7D/DCZMHDUIIND3BTWZGHAVWGQPO6EB5M4I.woff2",
  ],
  [
    "700",
    "https://cdn.fontshare.com/wf/XDSHNQOL6DH55YEQWSNM525DMPYUB5JR/GECNAC4UXYMIXSSO3FJ2FMV4QQ7E45P4/HKX3FF46MBT76S26FX57MMHX52HVGDK5.woff2",
  ],
];
const directory = new URL("../public/fonts/", import.meta.url);
await mkdir(directory, { recursive: true });

await Promise.all(
  FONTS.map(async ([weight, source]) => {
    const destination = new URL(`boska-${weight}.woff2`, directory);
    try {
      const cached = await readFile(destination);
      if (cached.subarray(0, 4).toString() === "wOF2" && cached.length >= 1_000)
        return;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    const response = await fetch(source, {
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok)
      throw new Error(`Boska ${weight} download failed (${response.status}).`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.subarray(0, 4).toString() !== "wOF2" || bytes.length < 1_000)
      throw new Error(`Boska ${weight} response is not a WOFF2 font.`);
    const temporary = new URL(`boska-${weight}.${randomUUID()}.tmp`, directory);
    try {
      await writeFile(temporary, bytes);
      await rename(temporary, destination);
    } finally {
      await rm(temporary, { force: true });
    }
  }),
);
