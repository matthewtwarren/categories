import { z } from "zod";

const GroupColorSchema = z.enum(["yellow", "green", "blue", "purple"]);

const PuzzleGroupSchema = z.object({
  name: z.string().optional(),
  color: GroupColorSchema,
  words: z.tuple([z.string(), z.string(), z.string(), z.string()]),
});

const PuzzleSettingsSchema = z.object({
  shuffleOnLoad: z.boolean(),
  maxMistakes: z.number().int().min(1).max(10),
});

export const PuzzleV1Schema = z.object({
  v: z.literal(1),
  title: z.string().optional(),
  groups: z.tuple([
    PuzzleGroupSchema,
    PuzzleGroupSchema,
    PuzzleGroupSchema,
    PuzzleGroupSchema,
  ]),
  settings: PuzzleSettingsSchema,
});

export type ParsedPuzzle = z.infer<typeof PuzzleV1Schema>;

export function parsePuzzle(data: unknown): ParsedPuzzle | null {
  const result = PuzzleV1Schema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  return null;
}
