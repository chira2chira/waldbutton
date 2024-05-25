import fs from "fs";
import path from "path";

export function loadSneeze() {
  const files = fs.readdirSync(
    path.join(process.cwd(), "public/static/voice/sneeze")
  );

  return files.map((x) => "/static/voice/sneeze/" + x);
}
