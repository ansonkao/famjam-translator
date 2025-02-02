import { NextRequest } from "next/server";
import * as deepl from "deepl-node";
import OpenAI from "openai";
import { env } from "~/env";

const translator = new deepl.Translator(env.DEEPL_API_KEY);
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  // Translate text to Chinese
  const result = await translator.translateText(text, "en", "zh");

  // Generate speech from translated text
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "coral",
    input: Array.isArray(result) ? result[0]!.text : result.text,
    response_format: "mp3",
  });

  // Return with proper headers for audio streaming
  return new Response(response.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Transfer-Encoding": "chunked",
    },
  });
}
