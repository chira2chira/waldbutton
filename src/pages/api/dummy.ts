import fs from "fs";
import path from "path";

/**
 * VercelでYarnを利用しているとEdge Functionに必要な静的ファイルの解析に失敗する
 * 単純なダミーファイルを用意し回避する
 * https://stackoverflow.com/questions/74529208/file-path-in-nextjs-api-route-not-resolving/74998489#74998489
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  commonYaml: fs.readFileSync(path.join(process.cwd(), "assets/voice_common.yaml")),
  dirtyYaml: fs.readFileSync(path.join(process.cwd(), "assets/voice_dirty.yaml")),
  greetingYaml: fs.readFileSync(path.join(process.cwd(), "assets/voice_greeting.yaml")),
  memeYaml: fs.readFileSync(path.join(process.cwd(), "assets/voice_meme.yaml")),
  reactionYaml: fs.readFileSync(path.join(process.cwd(), "assets/voice_reaction.yaml")),
  sayingYaml: fs.readFileSync(path.join(process.cwd(), "assets/voice_saying.yaml")),
  seYaml: fs.readFileSync(path.join(process.cwd(), "assets/voice_se.yaml")),
  sensitiveYaml: fs.readFileSync(path.join(process.cwd(), "assets/voice_sensitive.yaml")),
};