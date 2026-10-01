import express from 'express';
import { GoogleGenAI } from '@google/genai';
import supabase from '../utlis/supabaseConfig.js';
import crypto from 'crypto';
import { PDFParse } from 'pdf-parse';
import { getEmbedding } from '../utlis/embeddings.js';

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GOAL_TYPE_HINTS = {
  job_prep: 'Frame examples and challenges like real interview questions or on-the-job tasks. Prioritize the concepts most likely to be tested or used at work. Keep pace brisk — this learner has a deadline.',
  project: 'Frame examples around building something real. Prefer practical, applied challenges over theory. Skip history/trivia unless it directly helps the build.',
  academic: 'Match the structure and depth an exam or coursework would expect. Include precise definitions and terminology, not just casual explanations.',
  conversation_practice: 'Lean heavily into practical, spoken usage. Prioritize simulator steps over quizzes where the category allows it.',
  curiosity: 'Keep pace relaxed and framing light. Prioritize the "why this is interesting" angle over rigor or speed.',
};

const LEVEL_HINTS = {
  beginner: 'Assume zero prior knowledge. Define every term the first time it appears. Keep challenges gentle.',
  intermediate: 'Assume the learner knows the basics. Skip introductory definitions. Raise example and challenge complexity.',
  advanced: 'Assume strong prior knowledge. Move quickly past fundamentals, go straight to nuanced/edge cases, and make challenges genuinely hard.',
};

function chunkText(text, chunkSize = 1000, overlap = 150) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push(words.slice(start, end).join(' '));
    if (end === words.length) break;
    start += chunkSize - overlap;
  }

  return chunks;
}

async function processCoursePdf(pdf_path, course_id) {
  const { data: fileData, error: downloadErr } = await supabase.storage
    .from('pdf')
    .download(pdf_path);

  if (downloadErr) throw downloadErr;

  const buffer = Buffer.from(await fileData.arrayBuffer());

  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();

  const chunks = chunkText(result.text);

  const rows = [];
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await getEmbedding(chunks[i]);
    rows.push({
      course_id,
      content: chunks[i],
      embedding,
      chunk_index: i
    });
  }

  const { error: insertErr } = await supabase.from('course_chunks').insert(rows);
  if (insertErr) throw insertErr;

  return rows.length;
}

async function getRelevantChunks(query, course_id, matchCount = 8) {
  const queryEmbedding = await getEmbedding(query);

  const { data, error } = await supabase.rpc('match_course_chunks', {
    query_embedding: queryEmbedding,
    match_course_id: course_id,
    match_count: matchCount
  });

  if (error) throw error;
  return data || [];
}

async function cleanupCourse(course_id) {
  await supabase.from('lessons').delete().eq('course_id', course_id);
  await supabase.from('course_chunks').delete().eq('course_id', course_id);
  await supabase.from('courses').delete().eq('id', course_id);
}

router.post('/create_lessons', async (req, res) => {
  const { message, user_id, goal_type, goal, current_level, pdf_path } = req.body;

  if (!message || !user_id) {
    return res.status(400).json({ error: 'message and user_id are required' });
  }

  const random = crypto.randomUUID();

  let pdf_chunks_created = 0;
  let pdfContextBlock = '';
  let placeholderCreated = false;

  if (pdf_path) {
    try {
      const { error: placeholderErr } = await supabase
        .from('courses')
        .insert({
          id: random,
          user_id,
          title: message.slice(0, 60),
          description: '',
          category: 'skill',
          total_lessons: 0,
          estimated_total_minutes: 0,
          prompt: message,
          goal_type: goal_type || null,
          goal: goal || null,
          current_level: current_level || null
        });

      if (placeholderErr) throw placeholderErr;
      placeholderCreated = true;

      pdf_chunks_created = await processCoursePdf(pdf_path, random);
      const relevantChunks = await getRelevantChunks(message, random, 8);

      if (relevantChunks.length > 0) {
        pdfContextBlock = `
SOURCE MATERIAL (extracted from the learner's uploaded PDF — base the course content on this material, don't invent facts that contradict it):
${relevantChunks.map(c => c.content).join('\n\n---\n\n')}
`;
      }
    } catch (pdfErr) {
      console.error('PDF processing failed:', pdfErr);
    }
  }

  const personalizationBlock = (goal_type || goal || current_level)
    ? `
LEARNER CONTEXT (use this to shape module count, pacing, difficulty, and example framing — do not ignore it):
- Goal type: ${goal_type || 'not specified'}${goal_type && GOAL_TYPE_HINTS[goal_type] ? ` — ${GOAL_TYPE_HINTS[goal_type]}` : ''}
- Specifics: ${goal || 'not specified'}
- Current level: ${current_level || 'not specified, assume beginner'}${current_level && LEVEL_HINTS[current_level] ? ` — ${LEVEL_HINTS[current_level]}` : ''}

PERSONALIZATION RULES:
- If "Specifics" names a narrow goal (e.g. a specific interview, project, or exam), generate FEWER, more targeted modules (as few as 3-4) and skip anything outside that goal.
- If no specifics are given, or the goal is broad, use the normal 6-9 module range.
- Reference the stated goal/specifics naturally in example and simulator scenarios where it fits (e.g. goal_type "job_prep" → frame a challenge as an interview question).
- total_items and estimated_total_minutes must reflect the actual module count you chose, not a fixed default.
`
    : '';

  const prompt = `You are an expert course designer for Lunaar, a platform that teaches any skill through short, byte-sized lessons.
${personalizationBlock}
${pdfContextBlock}
TASK:
Given a topic requested by the user, generate a complete course broken into 6-9 MODULES. Each module teaches ONE clear concept or sub-topic through a 3-step flow: "learn" -> "example" -> "challenge".
${pdfContextBlock ? '\nIMPORTANT: The learner uploaded source material above. Ground the course content in that material — use its terminology, structure, and specific facts/examples rather than generating generic content on the topic.\n' : ''}
MODULE FLOW:
- "learn": explains the concept. content is 80-150 words, simple and conversational. Bold 2-4 key phrases with **double asterisks**.
- "example": shows the concept in action with a concrete, specific example. content is 60-120 words. Bold the parts that map back to the concept.
- "challenge": a short active-recall prompt or mini exercise applying the concept just learned. content is 40-100 words framing the task. If it has a clear right answer, make it a quiz_type "mcq" with options and correct_index; otherwise it can be an open-ended prompt with no options (options: null, correct_index: null).

SCENARIO FRAMING:
- Whenever an example, challenge, or quiz question can be dressed up as a vivid, fun scenario without distorting the concept — a bank heist, a space mission, a monster attack, a sports final, a heist getaway car, a disaster movie, a treasure hunt — do that instead of a dry textbook question. This matters most for "study" category topics like math and physics, where the same problem in a wild scenario is far more memorable than "calculate the following."
- Don't force this onto every single item. Skip it for pure definitions, vocabulary, or historical facts where a scenario would just add noise.
- Vary the scenarios across the course — don't reuse the same one twice.

SIMULATORS:
- If the course category is "code": in at least 2-3 modules, replace the "challenge" step with a "simulator" step of simulator_type "terminal" instead. Give it a realistic scenario (one sentence) and 3-5 sequential steps. Each step has a "prompt" (what the learner needs to do), an "expected_command" (the exact command that solves it), optional "accepted_variants" (other valid ways to type the same command), and "output" (the fake terminal output shown after the learner enters it correctly).
- If the course category is "language": in at least 2-3 modules, replace the "challenge" step with a "simulator" step of simulator_type "conversation" instead. Give it a scenario (one sentence, e.g. ordering coffee, asking for directions) and a "turns" array of 4-8 turns alternating between speaker "npc" and speaker "user". An "npc" turn has "text" (in the target language) and "translation" (English). A "user" turn has "prompt" (English instruction of what the learner should say), "expected_response" (the target-language answer), "accepted_variants" (array of other acceptable phrasings/spellings), and "translation" (English meaning of the expected response).
- If the course category is "study": use the following two simulator types ONLY where a concept genuinely fits them, at most 2-3 total across the whole course. Never force one onto a concept with nothing to classify, sequence, or tune — leave those as normal "challenge" steps instead.
  - simulator_type "drag_drop" with "mode": "categorize" — use when a concept is about classifying things into groups (types of rocks, kinds of triangles, parts of a cell, acids vs bases). Give "items": array of {"id","label"} to be sorted, "zones": array of {"id","label"} representing the categories, and "correct_map": an object mapping each item id to its correct zone id.
  - simulator_type "drag_drop" with "mode": "order" — use when a concept is about sequence (steps of a process, order of operations, a historical timeline, stages of mitosis). Give "items": array of {"id","label"} (list them in a SCRAMBLED, non-obvious order in the JSON itself), and "correct_order": an array of item ids in the correct sequence.
  - simulator_type "slider" — use ONLY when a concept has one clearly tunable numeric variable with a visually observable effect on a falling/dropping object (e.g. gravity strength, air resistance, mass, drop height). Give "variable_label" (name of the variable), "min", "max", "step", "default" (numbers), and "steps": an array of 2-4 prediction checkpoints, each with a "prompt" (a specific predictive question), 4 "options", a "correct_index", and an "explanation" tying the outcome back to the concept. Do NOT use "slider" for a variable that has no falling/dropping-object interpretation — pick "drag_drop" or a normal challenge instead.
  - VARIETY RULE: if the course uses 2 or more simulators total, they must NOT all be the same simulator_type (and for drag_drop, not all the same "mode"). Deliberately mix across "slider", "drag_drop" categorize, and "drag_drop" order so the course feels varied — do not default to "slider" just because it fits every physics concept loosely. Before finalizing, check that at least two distinct simulator_type/mode combinations appear if 2+ simulators exist, and swap one for a better-fitting alternative type if they are all the same.
  - Do not use "conversation" or "terminal" simulator types for the "study" category.
- For "skill" category, do not use simulator steps — keep the normal "challenge" step.

DIAGRAMS:
- Diagrams are a core, frequently-used part of this course format, not a rare extra. Whenever a concept has any spatial, structural, comparative, or process-based shape to it — labeled anatomy, force/vector diagrams, a process flowchart, a comparison chart, a map, an orbit path, a labeled cross-section, a timeline, a system diagram — insert a "diagram" item type in place of a "learn" or "example" step.
- Aim for roughly 1 diagram per 2-3 modules (so a 6-9 module course should typically have 3-5 diagrams, sometimes more). Only skip a diagram where the concept is purely verbal (definitions, vocabulary, historical dates) and a visual would add nothing.
- QUALITY BAR — a diagram must be information-dense, not decorative. A single shape with one label is NOT acceptable. Every diagram must include ALL of the following:
  - At least 4-6 distinct visual elements (shapes, arrows, or lines) that together show real structure or relationships, not just one blob.
  - A text label on every element that plays a role in the concept (React.createElement('text', ...)) — every part the learner needs to identify must be named in the diagram itself, not left for the caption to explain.
  - At least one connecting element — an arrow (a path or line with a triangular arrowhead built from a small polygon), a dashed line, or a bracket — showing how two or more parts relate, flow, or compare. A diagram with only isolated, unconnected shapes is incomplete.
  - A short title as a text element inside the SVG itself (near the top), in addition to the outer "title"/"caption" fields.
  - If the concept has a sequence, comparison, or before/after (e.g. two orbit shapes, two energy states, three process stages), show ALL the stages/sides side by side in the same diagram rather than just one snapshot.
- A diagram item has a "code" field: a single self-contained JavaScript function named exactly "Diagram", written using ONLY "React.createElement(...)" calls — NEVER JSX syntax (no angle brackets), NEVER import/require statements, NEVER external assets or network calls. React and its hooks are available as "React.useState", "React.useEffect", etc. — do not assume any other globals.
  - The function takes no props and returns a single root element, ideally an <svg> built via "React.createElement('svg', { viewBox: '0 0 400 300', width: '100%', height: '100%' }, ...children)" with shapes, lines, arrows, text, and labels as nested React.createElement calls. Use the full viewBox — spread elements across the whole canvas, don't cluster everything in one corner.
  - All styling must be inline via a "style" object or SVG attributes (fill, stroke, etc.) — never reference external CSS classes.
  - COLOR RULE: the diagram renders on a dark background. NEVER use white ("#fff", "#ffffff", "white", or any near-white like "#f0f0f0") for any fill, stroke, or text color — it either disappears or looks wrong against the dark stage. Use vivid, saturated colors instead: purples/violets (e.g. "#7c5cff", "#a78bfa"), greens (e.g. "#3cc878"), oranges/yellows (e.g. "#ffb84d", "#ffd166"), pinks/reds (e.g. "#ff6b81", "#ff8a8a"), and blues/cyans (e.g. "#5ec8ff", "#4dd4ff"). Text labels must use one of these bright colors (never white or black) so they stay readable. Use DIFFERENT colors for different elements so the parts are visually distinguishable from each other, not the same single color repeated everywhere.
  - Keep it correct, minimal JavaScript — no syntax errors, no undefined variables, no infinite loops or timers that never clear.
  - Richer example shape showing the density bar expects (do not copy verbatim, adapt structure and part-count to the real concept): "function Diagram() { return React.createElement('svg', { viewBox: '0 0 400 260', width: '100%' }, React.createElement('text', { x: 200, y: 24, fill: '#ffd166', fontSize: 15, textAnchor: 'middle', fontWeight: 'bold' }, 'Earth-Moon System'), React.createElement('circle', { cx: 90, cy: 140, r: 45, fill: '#5ec8ff' }), React.createElement('text', { x: 90, y: 200, fill: '#5ec8ff', fontSize: 13, textAnchor: 'middle' }, 'Earth'), React.createElement('circle', { cx: 300, cy: 140, r: 18, fill: '#a78bfa' }), React.createElement('text', { x: 300, y: 175, fill: '#a78bfa', fontSize: 13, textAnchor: 'middle' }, 'Moon'), React.createElement('line', { x1: 135, y1: 140, x2: 278, y2: 140, stroke: '#ffb84d', strokeWidth: 2, strokeDasharray: '6,4' }), React.createElement('text', { x: 205, y: 128, fill: '#ffb84d', fontSize: 11, textAnchor: 'middle' }, 'gravitational pull'), React.createElement('polygon', { points: '278,140 268,135 268,145', fill: '#ffb84d' })); }"
- Also give a short "caption" (one sentence) describing what the diagram shows.

CHECKPOINTS:
- After every 2-3 modules, insert ONE "quiz" item that tests what was just covered.
- Rotate quiz_type across checkpoints so it is not always the same: "mcq" (4 options), "true_false" (options exactly ["True","False"]), or "fill_blank" (content contains a blank written as "____", options are 4 possible fill-ins, correct_index points to the right one).
- Never use the same quiz_type twice in a row.

BOSS CHALLENGE:
- The FINAL item in the course must be type "boss_challenge".
- It contains 5-8 questions that together cover the full breadth of the course, mixing "mcq", "true_false", and"fill_blank" quiz_types.
- Frame its title and intro like a real final test/boss fight moment, not just "Final Quiz".

GENERAL RULES:
- Writing style: simple, direct, conversational — avoid academic or dense language. Assume the learner is a curious beginner, unless LEARNER CONTEXT above says otherwise.
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
          "translation": "string (English meaning of the expected response)"
        }
      ],
      "estimated_minutes": number
    },
    {
      "id": number,
      "type": "simulator",
      "simulator_type": "drag_drop",
      "mode": "categorize",
      "title": "string",
      "scenario": "string (one sentence setup)",
      "items": [{ "id": "string", "label": "string" }],
      "zones": [{ "id": "string", "label": "string" }],
      "correct_map": { "item_id": "zone_id" },
      "estimated_minutes": number
    },
    {
      "id": number,
      "type": "simulator",
      "simulator_type": "drag_drop",
      "mode": "order",
      "title": "string",
      "scenario": "string (one sentence setup)",
      "items": [{ "id": "string", "label": "string" }],
      "correct_order": ["item_id","item_id"],
      "estimated_minutes": number
    },
    {
      "id": number,
      "type": "simulator",
      "simulator_type": "slider",
      "title": "string",
      "scenario": "string (one sentence hook naming the changed variable)",
      "variable_label": "string",
      "min": number,
      "max": number,
      "step": number,
      "default": number,
      "steps": [
        {
          "prompt": "string (a specific predictive question)",
          "options": ["string","string","string","string"],
          "correct_index": number,
          "explanation": "string (why this outcome follows)"
        }
      ],
      "estimated_minutes": number
    },
    {
      "id": number,
      "type": "diagram",
      "title": "string",
      "caption": "string (one sentence describing what the diagram shows)",
      "code": "string (a single 'function Diagram() { ... }' using only React.createElement calls, no JSX, no imports, meeting the QUALITY BAR above)",
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

    const courseFields = {
      user_id: user_id,
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      total_lessons: courseData.total_items,
      estimated_total_minutes: courseData.estimated_total_minutes,
      prompt: message,
      goal_type: goal_type || null,
      goal: goal || null,
      current_level: current_level || null
    };

    const courseQuery = placeholderCreated
      ? supabase.from('courses').update(courseFields).eq('id', random)
      : supabase.from('courses').insert({ ...courseFields, id: random });

    const { data: course, error: courseError } = await courseQuery
      .select()
      .single();

    if (courseError) throw courseError;

    if (goal_type || goal || current_level) {
      await supabase.from('user_profiles').upsert({
        user_id,
        goal_type: goal_type || undefined,
        goal: goal || undefined,
        current_level: current_level || undefined,
      }, { onConflict: 'user_id' });
    }

    const itemsToInsert = courseData.items.map((item, index) => ({
      course_id: random,
      order_index: index,
      type: item.type,
      quiz_type: item.quiz_type || null,
      title: item.title || item.question || (item.content ? item.content.slice(0, 60) : null) || item.scenario || item.intro || item.type,
      content: item.content || null,
      intro: item.intro || null,
      question: item.question || null,
      options: item.options || null,
      correct_index: item.correct_index ?? null,
      questions: item.questions || null,
      simulator_type: item.simulator_type || null,
      mode: item.mode || null,
      scenario: item.scenario || null,
      steps: item.steps || null,
      turns: item.turns || null,
      items: item.items || null,
      zones: item.zones || null,
      correct_map: item.correct_map || null,
      correct_order: item.correct_order || null,
      variable_label: item.variable_label || null,
      min: item.min ?? null,
      max: item.max ?? null,
      step: item.step ?? null,
      default: item.default ?? null,
      code: item.code || null,
      caption: item.caption || null,
      estimated_minutes: item.estimated_minutes || null
    }));

    const { error: itemsError } = await supabase
      .from('lessons')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    res.json({ course, lessons: courseData.items, pdf_chunks_created });
  } catch (err) {
    console.error(err);
    if (placeholderCreated) {
      await cleanupCourse(random).catch((cleanupErr) => console.error('Cleanup failed:', cleanupErr));
    }
    res.status(500).json({ error: 'Failed to generate course' });
  }
});

router.post("/chat", async (req, res) => {
  const { user_message, history } = req.body;

  try {
    const contents = [
      ...(history || []).map(h => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }]
      })),
      { role: "user", parts: [{ text: user_message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error('No content returned from Gemini');
    }

    res.json({ message: responseText });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Chat failed' });
  }
});

export default router;