import express from 'express';
import { GoogleGenAI } from '@google/genai';
import supabase from '../utlis/supabaseConfig.js';
import crypto from 'crypto';

const router = express.Router();

// Initialize the Google GenAI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/create_lessons', async (req, res) => {
  const { message, user_id } = req.body;

  if (!message || !user_id) {
    return res.status(400).json({ error: 'message and user_id are required' });
  }

  const prompt = `You are an expert course designer for Lunaar, a platform that teaches any skill through short, byte-sized lessons.

TASK:
Given a topic requested by the user, generate a complete course broken into 6-9 MODULES. Each module teaches ONE clear concept or sub-topic through a 3-step flow: "learn" -> "example" -> "challenge".

MODULE FLOW:
- "learn": explains the concept. content is 80-150 words, simple and conversational. Bold 2-4 key phrases with **double asterisks**.
- "example": shows the concept in action with a concrete, specific example. content is 60-120 words. Bold the parts that map back to the concept.
- "challenge": a short active-recall prompt or mini exercise applying the concept just learned. content is 40-100 words framing the task. If it has a clear right answer, make it a quiz_type "mcq" with options and correct_index; otherwise it can be an open-ended prompt with no options (options: null, correct_index: null).

SIMULATORS (only for category "code" or category "language"):
- If the course category is "code": in at least 2-3 modules, replace the "challenge" step with a "simulator" step of simulator_type "terminal" instead. Give it a realistic scenario (one sentence) and 3-5 sequential steps. Each step has a "prompt" (what the learner needs to do), an "expected_command" (the exact command that solves it), optional "accepted_variants" (other valid ways to type the same command), and "output" (the fake terminal output shown after the learner enters it correctly).
- If the course category is "language": in at least 2-3 modules, replace the "challenge" step with a "simulator" step of simulator_type "conversation" instead. Give it a scenario (one sentence, e.g. ordering coffee, asking for directions) and a "turns" array of 4-8 turns alternating between speaker "npc" and speaker "user". An "npc" turn has "text" (in the target language) and "translation" (English). A "user" turn has "prompt" (English instruction of what the learner should say), "expected_response" (the target-language answer), "accepted_variants" (array of other acceptable phrasings/spellings), and "translation" (English meaning of the expected response).
- For "study" and "skill" categories, do not use simulator steps — keep the normal "challenge" step.

CHECKPOINTS:
- After every 2-3 modules, insert ONE "quiz" item that tests what was just covered.
- Rotate quiz_type across checkpoints so it is not always the same: "mcq" (4 options), "true_false" (options exactly ["True","False"]), or "fill_blank" (content contains a blank written as "____", options are 4 possible fill-ins, correct_index points to the right one).
- Never use the same quiz_type twice in a row.

BOSS CHALLENGE:
- The FINAL item in the course must be type "boss_challenge".
- It contains 5-8 questions that together cover the full breadth of the course, mixing "mcq", "true_false", and"fill_blank" quiz_types.
- Frame its title and intro like a real final test/boss fight moment, not just "Final Quiz".

GENERAL RULES:
- Writing style: simple, direct, conversational — avoid academic or dense language. Assume the learner is a curious beginner.
- Do NOT include images, links, or external references — text only.
- Classify the course into exactly ONE category: "study" (academic/historical/scientific), "code" (programming/tech), "language" (spoken/written language learning), or "skill" (practical/hobby/life skills).

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact schema. No markdown fences, no preamble, no explanation — JSON only.

{
  "title": "string",
  "description": "string (1 sentence)",
  "category": "study" | "code" | "language" | "skill",
  "total_items": number,
  "estimated_total_minutes": number,
  "items": [
    {
      "id": number,
      "type": "learn" | "example" | "challenge",
      "title": "string",
      "content": "string (with **bold** key phrases)",
      "quiz_type": "mcq" | null,
      "options": ["string","string","string","string"] | null,
      "correct_index": number | null,
      "estimated_minutes": number
    },
    {
      "id": number,
      "type": "simulator",
      "simulator_type": "terminal",
      "title": "string",
      "scenario": "string (one sentence setup)",
      "steps": [
        {
          "prompt": "string",
          "expected_command": "string",
          "accepted_variants": ["string"] | null,
          "output": "string (simulated terminal output)"
        }
      ],
      "estimated_minutes": number
    },
    {
      "id": number,
      "type": "simulator",
      "simulator_type": "conversation",
      "title": "string",
      "scenario": "string (one sentence setup)",
      "turns": [
        {
          "speaker": "npc",
          "text": "string (target language)",
          "translation": "string (English)"
        },
        {
          "speaker": "user",
          "prompt": "string (English instruction)",
          "expected_response": "string (target language)",
          "accepted_variants": ["string"] | null,
          "translation": "string (English)"
        }
      ],
      "estimated_minutes": number
    },
    {
      "id": number,
      "type": "quiz",
      "quiz_type": "mcq" | "true_false" | "fill_blank",
      "title": "string",
      "content": "string | null (used for fill_blank sentence with ____)",
      "question": "string",
      "options": ["string","string","string","string"],
      "correct_index": number,
      "estimated_minutes": number
    },
    {
      "id": number,
      "type": "boss_challenge",
      "title": "string",
      "intro": "string (hype up the final test)",
      "questions": [
        {
          "quiz_type": "mcq" | "true_false" | "fill_blank",
          "content": "string | null",
          "question": "string",
          "options": ["string","string","string","string"],
          "correct_index": number
        }
      ],
      "estimated_minutes": number
    }
  ]
}

USER TOPIC: ${message}`;

  try {
    // 1. Generate content using @google/genai SDK
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error('No content returned from Gemini');
    }

    const sanitizeJSON = (str) =>
      str
        .replace(/```json|```/g, '')
        .trim()
        .replace(/\\(?!["\\/bfnrtu])/g, '\\\\');

    let courseData;
    try {
      courseData = JSON.parse(responseText);
    } catch (parseErr) {
      courseData = JSON.parse(sanitizeJSON(responseText));
    }

    const random = crypto.randomUUID();

    // 2. Insert into Supabase
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        user_id: user_id,
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        total_lessons: courseData.total_items,
        estimated_total_minutes: courseData.estimated_total_minutes,
        prompt: message,
        id: random
      })
      .select()
      .single();

    if (courseError) throw courseError;

    const itemsToInsert = courseData.items.map((item, index) => ({
      course_id: random,
      order_index: index,
      type: item.type,
      quiz_type: item.quiz_type || null,
      title: item.title,
      content: item.content || null,
      intro: item.intro || null,
      question: item.question || null,
      options: item.options || null,
      correct_index: item.correct_index ?? null,
      questions: item.questions || null,
      simulator_type: item.simulator_type || null,
      scenario: item.scenario || null,
      steps: item.steps || null,
      turns: item.turns || null,
      estimated_minutes: item.estimated_minutes || null
    }));

    const { error: itemsError } = await supabase
      .from('lessons')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    res.json({ course, lessons: courseData.items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate course' });
  }
});

export default router;
