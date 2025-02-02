import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import * as deepl from "deepl-node";
import OpenAI from "openai";
import { env } from "~/env";

const translator = new deepl.Translator(env.DEEPL_API_KEY);
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const translationRouter = createTRPCRouter({
  translateAndSpeak: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      // Track translation time
      const translationStart = performance.now();
      const result = await translator.translateText(input.text, "en", "zh");
      const translationTime = performance.now() - translationStart;

      // Track speech generation time
      const speechStart = performance.now();
      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "coral",
        input: result.text,
        response_format: "mp3",
      });

      // Get the audio as a ReadableStream
      const stream = response.body;
      const speechTime = performance.now() - speechStart;

      return {
        stream,
        metrics: {
          translationMs: Math.round(translationTime),
          speechMs: Math.round(speechTime),
        },
      };
    }),
});
