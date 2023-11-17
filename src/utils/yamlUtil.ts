import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import moji from "moji";
import { VoiceCategory, VoiceInfo } from "../pages";

export function loadYaml<T>(yamlPath: string) {
  return yaml.load(
    fs.readFileSync(path.join(process.cwd(), yamlPath), "utf-8")
  ) as T;
}

export function loadAllVoice() {
  const load = (file: string, category: VoiceCategory) =>
    loadYaml<VoiceInfo[]>(file).map((x) => ({
      ...x,
      text: x.text + "",
      kana: x.kana + "",
      category,
    }));

  const greetings = load("assets/voice_greeting.yaml", "greetings");
  const reactions = load("assets/voice_reaction.yaml", "reactions");
  const se = load("assets/voice_se.yaml", "se");
  const dirties = load("assets/voice_dirty.yaml", "dirties");
  const sayings = load("assets/voice_saying.yaml", "sayings");
  const memes = load("assets/voice_meme.yaml", "memes");
  const sensitive = load("assets/voice_sensitive.yaml", "sensitive");
  const common = load("assets/voice_common.yaml", "common");
  const all = [
    ...greetings,
    ...reactions,
    ...se,
    ...dirties,
    ...sayings,
    ...memes,
    ...sensitive,
    ...common,
  ];
  return all.map((x) => ({
    ...x,
    kana: moji(x.kana).convert("HG", "KK").toString().toLowerCase(),
  }));
}
