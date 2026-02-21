import axios from "axios";
import fs from "fs-extra";
import path from "path";

export async function downloadImage(url: string, filepath: string) {
  if (await fs.pathExists(filepath)) return;

  await fs.ensureDir(path.dirname(filepath));

  const res = await axios({
    url,
    responseType: "stream",
  });

  return new Promise<void>((resolve, reject) => {
    res.data
      .pipe(fs.createWriteStream(filepath))
      .on("finish", resolve)
      .on("error", reject);
  });
}
