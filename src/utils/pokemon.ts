import fs from "fs";
import path from "path";
import { VoiceBase } from "../pages";

export type PokemonMaster = {
  id: number;
  name: string;
  mode: number;
  icon: string;
};

export type PokemonVoice = VoiceBase & {
  mode: number;
};

export function loadPokemonVoice() {
  const files = fs.readdirSync(
    path.join(process.cwd(), "public/static/voice/pokemon")
  );
  const master = loadPokemonMaster();
  const voices: PokemonVoice[] = [];

  files.forEach((file) => {
    const [voiceId] = file.split(",");
    const data = master.find((x) => x.id === Number(voiceId));
    if (data !== undefined) {
      voices.push({
        url: "/static/voice/pokemon/" + file,
        id: data.id + "",
        text: data.name,
        mode: data.mode,
      });
    }
  });
  return voices;
}

export function loadPokemonMaster() {
  const json = fs.readFileSync(
    path.join(process.cwd(), "assets/pokemon_master.json"),
    "utf-8"
  );
  const master = JSON.parse(json) as PokemonMaster[];
  return master;
}
