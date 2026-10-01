import { useParams, useNavigate } from "react-router";
import React, { useState, useEffect } from "react";
import { supabase } from "../compoents/supabaseConfig";
import styles from "../styles/lesson.module.css"
import { useAuth } from "../compoents/authcontext";
import { useRef } from "react";
import { House, X, ArrowLeft, Trophy, Volume2, VolumeX, CornerDownLeft, Eye, Book, MessageCircle, Sparkles } from "lucide-react";
import comet_normal from "../assets/comet_normal.png"
import Lua from "../assets/Lua.png"

function normalizeCommand(str) {
  return (str || "").trim().replace(/\s+/g, " ");
}

function normalizePhrase(str) {
  return (str || "").trim().toLowerCase().replace(/[.,!?¿¡'"]/g, "").replace(/\s+/g, " ");
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function TerminalSimulator({ lesson, onComplete }) {
  const steps = lesson.steps || [];
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);

  const currentStep = steps[stepIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const candidates = [currentStep.expected_command, ...(currentStep.accepted_variants || [])];
    const isMatch = candidates.some(c => normalizeCommand(c) === normalizeCommand(input));

    if (isMatch) {
      setHistory(h => [...h, { command: input, output: currentStep.output }]);
      setInput("");
      setError(null);
      setShowHint(false);

      if (stepIndex === steps.length - 1) {
        setDone(true);
        onComplete();
      } else {
        setStepIndex(stepIndex + 1);
      }
    } else {
      setError("command not found — try again");
    }
  }

  return (
    <div className={styles.sim_wrapper}>
      <p className={styles.sim_scenario}>{lesson.scenario}</p>

      <div className={styles.terminal_box}>
        <div className={styles.terminal_titlebar}>
          <span className={styles.dot_red}></span>
          <span className={styles.dot_yellow}></span>
          <span className={styles.dot_green}></span>
        </div>
        <div className={styles.terminal_body}>
          {history.map((h, i) => (
            <div key={i} className={styles.terminal_line}>
              <div><span className={styles.terminal_prompt}>$</span> {h.command}</div>
              {h.output && <div className={styles.terminal_output}>{h.output}</div>}
            </div>
          ))}

          {!done && (
            <>
              <div className={styles.terminal_task}>{currentStep.prompt}</div>
              <form onSubmit={handleSubmit} className={styles.terminal_input_row}>
                <span className={styles.terminal_prompt}>$</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoFocus
                  spellCheck={false}
                  className={styles.terminal_input}
                />
              </form>
              {error && <div className={styles.terminal_error}>{error}</div>}
            </>
          )}
        </div>
      </div>

      {!done && (
        <button type="button" className={styles.hint_toggle} onClick={() => setShowHint(s => !s)}>
          <Eye size={12} /> {showHint ? "Hide hint" : "Show hint"}
        </button>
      )}
      {showHint && !done && (
        <div className={styles.hint_box}>{currentStep.expected_command}</div>
      )}
    </div>
  )
}

function ConversationSimulator({ lesson, onComplete }) {
  const turns = lesson.turns || [];
  const [turnIndex, setTurnIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (turnIndex >= turns.length) {
      if (!done) {
        setDone(true);
        onComplete();
      }
      return;
    }

    const turn = turns[turnIndex];
    if (turn.speaker === "npc") {
      const timer = setTimeout(() => {
        setMessages(m => [...m, { speaker: "npc", text: turn.text, translation: turn.translation }]);
        setTurnIndex(turnIndex + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [turnIndex])

  const currentTurn = turns[turnIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || !currentTurn) return;

    const candidates = [currentTurn.expected_response, ...(currentTurn.accepted_variants || [])];
    const isMatch = candidates.some(c => normalizePhrase(c) === normalizePhrase(input));

    if (isMatch) {
      setMessages(m => [...m, { speaker: "user", text: input }]);
      setInput("");
      setError(null);
      setShowTranslation(false);
      setTurnIndex(turnIndex + 1);
    } else {
      setError("Not quite — try again");
    }
  }

  return (
    <div className={styles.sim_wrapper}>
      <p className={styles.sim_scenario}>{lesson.scenario}</p>
      <div className={styles.chat_box}>
        {messages.map((m, i) => (
          <div key={i} className={`${styles.chat_bubble_row} ${m.speaker === "user" ? styles.chat_row_user : ""}`}>
            <div className={`${styles.chat_bubble} ${m.speaker === "user" ? styles.chat_bubble_user : styles.chat_bubble_npc}`}>
              {m.text}
              {m.translation && <div className={styles.chat_translation}>{m.translation}</div>}
            </div>
          </div>
        ))}

        {!done && currentTurn && currentTurn.speaker === "user" && (
          <div className={styles.chat_input_area}>
            <div className={styles.chat_task}>{currentTurn.prompt}</div>
            <form onSubmit={handleSubmit} className={styles.chat_input_row}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                className={styles.chat_input}
              />
              <button type="submit" className={styles.chat_send_btn}>
                <CornerDownLeft size={16} />
              </button>
            </form>
            {error && <div className={styles.terminal_error}>{error}</div>}
            <button type="button" className={styles.hint_toggle} onClick={() => setShowTranslation(s => !s)}>
              <Eye size={12} /> {showTranslation ? "Hide meaning" : "Show meaning"}
            </button>
            {showTranslation && <div className={styles.hint_box}>{currentTurn.translation}</div>}
          </div>
        )}
      </div>
    </div>
  )
}

function DragCategorizeSimulator({ lesson, onComplete }) {
  const items = lesson.items || [];
  const zones = lesson.zones || [];
  const correctMap = lesson.correct_map || {};
  const itemsById = Object.fromEntries(items.map(it => [it.id, it]));

  const [pool, setPool] = useState(() => shuffle(items.map(it => it.id)));
  const [placements, setPlacements] = useState({});
  const [shakeId, setShakeId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverZone, setDragOverZone] = useState(null);
  const [done, setDone] = useState(false);

  const handleDrop = (zoneId) => {
    setDragOverZone(null);
    if (draggedId === null) return;

    if (correctMap[draggedId] === zoneId) {
      setPlacements(p => ({ ...p, [zoneId]: [...(p[zoneId] || []), draggedId] }));
      setPool(p => {
        const next = p.filter(id => id !== draggedId);
        if (next.length === 0) {
          setDone(true);
          onComplete();
        }
        return next;
      });
    } else {
      setShakeId(draggedId);
      setTimeout(() => setShakeId(null), 400);
    }
    setDraggedId(null);
  }

  return (
    <div className={styles.sim_wrapper}>
      <p className={styles.sim_scenario}>{lesson.scenario}</p>

      <div className={styles.dnd_zones}>
        {zones.map(zone => (
          <div
            key={zone.id}
            className={`${styles.dnd_zone} ${dragOverZone === zone.id ? styles.dnd_zone_active : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOverZone(zone.id); }}
            onDragLeave={() => setDragOverZone(null)}
            onDrop={() => handleDrop(zone.id)}
          >
            <span className={styles.dnd_zone_label}>{zone.label}</span>
            <div className={styles.dnd_zone_items}>
              {(placements[zone.id] || []).map(id => (
                <div key={id} className={styles.dnd_chip_locked}>
                  {itemsById[id].label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dnd_pool}>
        {pool.map(id => (
          <div
            key={id}
            draggable
            onDragStart={() => setDraggedId(id)}
            className={`${styles.dnd_chip} ${shakeId === id ? styles.dnd_chip_shake : ""}`}
          >
            {itemsById[id].label}
          </div>
        ))}
        {pool.length === 0 && !done && (
          <span className={styles.dnd_pool_empty}>Nice — check the zones above.</span>
        )}
      </div>
    </div>
  )
}

function DragOrderSimulator({ lesson, onComplete }) {
  const items = lesson.items || [];
  const correctOrder = lesson.correct_order || [];
  const itemsById = Object.fromEntries(items.map(it => [it.id, it]));

  const [order, setOrder] = useState(() => shuffle(items.map(it => it.id)));
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [done, setDone] = useState(false);

  const handleDrop = (index) => {
    setDragOverIndex(null);
    if (draggedIndex === null || draggedIndex === index) return;
    setOrder(o => {
      const next = [...o];
      const [moved] = next.splice(draggedIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDraggedIndex(null);
    setResult(null);
  }

  const handleCheck = () => {
    const isCorrect = order.every((id, i) => id === correctOrder[i]);
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setDone(true);
      onComplete();
    }
  }

  return (
    <div className={styles.sim_wrapper}>
      <p className={styles.sim_scenario}>{lesson.scenario}</p>

      <div className={styles.dnd_order_list}>
        {order.map((id, index) => (
          <div
            key={id}
            draggable={!done}
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index); }}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={() => handleDrop(index)}
            className={`${styles.dnd_order_item} ${result === "wrong" ? styles.dnd_chip_shake : ""} ${done ? styles.dnd_chip_locked : ""} ${dragOverIndex === index ? styles.dnd_order_item_over : ""}`}
          >
            <span className={styles.dnd_order_index}>{index + 1}</span>
            {itemsById[id].label}
          </div>
        ))}
      </div>

      {!done && (
        <button type="button" className={styles.btn_continue} onClick={handleCheck}>
          Check order
        </button>
      )}
      {result === "wrong" && (
        <div className={`${styles.quiz_feedback} ${styles.wrong}`}>Not quite the right order — drag to rearrange and try again.</div>
      )}
    </div>
  )
}

function DragDropSimulator({ lesson, onComplete }) {
  return lesson.mode === "order"
    ? <DragOrderSimulator lesson={lesson} onComplete={onComplete} />
    : <DragCategorizeSimulator lesson={lesson} onComplete={onComplete} />
}

function SliderPlayground({ lesson }) {
  const [value, setValue] = useState(lesson.default ?? lesson.min ?? 1);
  const [dropping, setDropping] = useState(false);
  const [landed, setLanded] = useState(false);

  const baseDuration = 1.6;
  const safeValue = value > 0 ? value : 0.1;
  const duration = (baseDuration / safeValue).toFixed(2);

  const handleDrop = () => {
    setLanded(false);
    setDropping(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setDropping(true)));
  }

  return (
    <div className={styles.slider_playground}>
      <div className={styles.slider_stage}>
        <div
          key={dropping ? "falling" : "idle"}
          className={`${styles.slider_ball} ${dropping ? styles.slider_ball_falling : ""}`}
          style={{ animationDuration: `${duration}s` }}
          onAnimationEnd={() => setLanded(true)}
        />
        <div className={`${styles.slider_ground} ${landed ? styles.slider_ground_hit : ""}`} />
      </div>
      <div className={styles.slider_controls}>
        <span className={styles.slider_value_label}>{lesson.variable_label}: {value}x</span>
        <input
          type="range"
          min={lesson.min}
          max={lesson.max}
          step={lesson.step}
          value={value}
          onChange={(e) => { setValue(parseFloat(e.target.value)); setLanded(false); }}
          className={styles.slider_input}
        />
        <button type="button" className={styles.btn_continue} onClick={handleDrop}>
          Drop it
        </button>
      </div>
    </div>
  )
}

function SliderSimulator({ lesson, onComplete }) {
  const steps = lesson.steps || [];
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
  }

  const handleNext = () => {
    if (isLastStep) {
      setDone(true);
      onComplete();
    } else {
      setStepIndex(stepIndex + 1);
      setSelected(null);
    }
  }

  return (
    <div className={styles.sim_wrapper}>
      <p className={styles.sim_scenario}>{lesson.scenario}</p>

      <SliderPlayground lesson={lesson} />

      {!done && currentStep && (
        <>
          <p className={styles.quiz_question}>{currentStep.prompt}</p>
          <QuizOptions
            quiz_type="mcq"
            options={currentStep.options}
            correct_index={currentStep.correct_index}
            selected={selected}
            onSelect={handleSelect}
          />
          {selected !== null && (
            <>
              <div className={`${styles.quiz_feedback} ${selected === currentStep.correct_index ? styles.correct : styles.wrong}`}>
                {currentStep.explanation}
              </div>
              <button type="button" className={styles.btn_continue} onClick={handleNext}>
                {isLastStep ? "Finish" : "Next"}
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}

class DiagramBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.log(error);
  }

  render() {
    if (this.state.hasError) {
      return <div className={styles.diagram_error}>This diagram couldn't be displayed.</div>;
    }
    return this.props.children;
  }
}

function DiagramRenderer({ lesson }) {
  const [DiagramComponent, setDiagramComponent] = useState(null);
  const [buildError, setBuildError] = useState(null);

  useEffect(() => {
    try {
      const factory = new Function("React", `${lesson.code}\nreturn Diagram;`);
      const Comp = factory(React);
      setDiagramComponent(() => Comp);
      setBuildError(null);
    } catch (e) {
      setBuildError(e.message);
      setDiagramComponent(null);
    }
  }, [lesson.code]);

  return (
    <div className={styles.diagram_wrapper}>
      {lesson.caption && <p className={styles.sim_scenario}>{lesson.caption}</p>}
      {buildError || !DiagramComponent ? (
        <div className={styles.diagram_error}>This diagram couldn't be displayed.</div>
      ) : (
        <div className={styles.diagram_stage}>
          <DiagramBoundary>
            <DiagramComponent />
          </DiagramBoundary>
        </div>
      )}
    </div>
  )
}

function renderBoldText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

const BADGES = {
  learn: { label: "Lesson", className: "lesson" },
  example: { label: "Example", className: "Lesson" },
  challenge: { label: "Challenge", className: "challenge" },
  quiz: { label: "Quick Check", className: "quiz" },
  boss_challenge: { label: "Boss Challenge", className: "boss" },
  diagram: { label: "Diagram", className: "lesson" },
  simulator_terminal: { label: "Terminal", className: "simulator" },
  simulator_conversation: { label: "Conversation", className: "simulator" },
  simulator_drag_drop: { label: "Drag & Drop", className: "simulator" },
  simulator_slider: { label: "Playground", className: "simulator" },
}

function QuizOptions({ quiz_type, options, correct_index, selected, onSelect }) {
  const rowLayout = quiz_type === "true_false";

  return (
    <div className={`${styles.quiz_options} ${rowLayout ? styles.quiz_options_row : ""}`}>
      {options.map((opt, i) => {
        let optionClass = styles.quiz_option;
        if (selected !== null) {
          if (i === correct_index) {
            optionClass = styles.quiz_option_correct;
          } else if (i === selected) {
            optionClass = styles.quiz_option_wrong;
          }
        }
        return (
          <button
            type="button"
            key={i}
            className={optionClass}
            onClick={() => onSelect(i)}
            disabled={selected !== null}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export function Lesson(){

  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [lessons, setLessons] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsSupported, setTtsSupported] = useState(true)

  const [message_content,setMessage_content] = useState("")
  const [bossStarted, setBossStarted] = useState(false)
  const [bossIndex, setBossIndex] = useState(0)
  const [bossSelected, setBossSelected] = useState(null)
  const [bossAnswers, setBossAnswers] = useState([])
  const [bossFinished, setBossFinished] = useState(false)
  const [chat_active,setChat_active] = useState(false)
  const [simDone, setSimDone] = useState(false)
  const historyRef = useRef([]);
  const [messages,setMessages] = useState([])

  const Send_msg = async () => {

    if(!message_content.trim()) return

    const originalMessage = message_content;
    setMessage_content("")

      const userMessage = { 
      role: "user" , 
      content: originalMessage 
    };

    historyRef.current.push(userMessage);
    setMessages(prev => [...prev, userMessage]);

    try{
      const res = await fetch(`${import.meta.env.VITE_BACKEND_KEY}/llm/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({user_message: originalMessage, history: historyRef.current})
      });

      const data = await res.json();

      const aiResponse = data.message

       const botMessage = { 
        role: "assistant", 
        content: aiResponse,
      };

      historyRef.current.push(botMessage);
      setMessages(prev => [...prev, botMessage]);
    }catch(error){
      console.log(error)
    }

  }

  useEffect(() => {

    const fetchLessons = async () => {

      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", id)
        .order("order_index", { ascending: true });

      if (error) {
        console.error(error)
        return;
      }

      if (!data || data.length === 0) {
        return;
      }

      setLessons(data)
    }

    fetchLessons()

  }, [id])

  useEffect(() => {
    setTtsSupported('speechSynthesis' in window);
  }, [])

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSelectedAnswer(null);
    setBossStarted(false);
    setBossIndex(0);
    setBossSelected(null);
    setBossAnswers([]);
    setBossFinished(false);
    setSimDone(false);
  }, [currentIndex])

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    }
  }, [])

  if (lessons.length === 0) {
    return <div className={styles.lesson_wrapper}>Loading...</div>;
  }

  const currentLesson = lessons[currentIndex];
  const isLast = currentIndex === lessons.length - 1;
  const progressPercent = ((currentIndex + 1) / lessons.length) * 100;

  const isQuiz = currentLesson.type === "quiz";
  const isChallengeMCQ = currentLesson.type === "challenge" && !!currentLesson.options;
  const isChallengeOpen = currentLesson.type === "challenge" && !currentLesson.options;
  const isBoss = currentLesson.type === "boss_challenge";
  const isSimulator = currentLesson.type === "simulator";
  const isDiagram = currentLesson.type === "diagram";
  const isAnswerable = isQuiz || isChallengeMCQ;

  const badge = isSimulator
    ? BADGES[`simulator_${currentLesson.simulator_type}`] || BADGES.challenge
    : BADGES[currentLesson.type] || BADGES.learn;

  const bossQuestions = currentLesson.questions || [];
  const currentBossQuestion = bossQuestions[bossIndex];
  const isBossLastQuestion = bossIndex === bossQuestions.length - 1;

  const getSpeakableText = () => {
    if (isBoss) {
      if (!bossStarted) return currentLesson.intro || currentLesson.title;
      if (bossFinished) return "Boss challenge complete";
      return currentBossQuestion?.question || currentBossQuestion?.content || "";
    }
    if (isAnswerable) return currentLesson.question || currentLesson.content;
    if (isSimulator) return currentLesson.scenario;
    if (isDiagram) return currentLesson.caption || currentLesson.title;
    return currentLesson.content;
  }

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const rawText = getSpeakableText();
    if (!rawText) return;
    const cleanText = rawText.replace(/\*\*/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  const Progress = async () => {

   const {data,error} = await supabase
   .from("user_progress")
   .upsert(
        {
          user_id: user.id,
          course_id: id,
          lesson_id: currentLesson.id,
        },
        { onConflict: 'user_id,lesson_id' })

        if(error){
          console.log(error)
        }
  }

  const goNext = async () => {
    Progress()
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    await update_streak(user.id)
    setSelectedAnswer(null);
    if (!isLast) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/courses");
    }
  }

  const goBack = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSelectedAnswer(null);
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  const handleBossSelect = (i) => {
    if (bossSelected !== null) return;
    setBossSelected(i);
  }

  const handleBossNext = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    const updatedAnswers = [...bossAnswers, bossSelected];
    setBossAnswers(updatedAnswers);

    if (isBossLastQuestion) {
      setBossFinished(true);
    } else {
      setBossIndex(bossIndex + 1);
      setBossSelected(null);
    }
  }

const update_streak = async (user_id) => {
  const today = new Date().toISOString().split('T')[0];

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('current_streak, longest_streak, last_active_date')
    .eq('id', user_id)
    .single();

  if (error || !profile) return;

  if (profile.last_active_date === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterday_str = yesterday.toISOString().split('T')[0];

  let new_streak = 1;
  if (profile.last_active_date === yesterday_str) {
    new_streak = profile.current_streak + 1;
  }

  const new_longest = Math.max(new_streak, profile.longest_streak || 0);

  await supabase
    .from('profiles')
    .update({
      current_streak: new_streak,
      longest_streak: new_longest,
      last_active_date: today
    })
    .eq('id', user_id);
};

  const bossScore = bossAnswers.filter((a, i) => a === bossQuestions[i]?.correct_index).length;

  const isCorrect = selectedAnswer !== null && selectedAnswer === currentLesson.correct_index;

  const avatarInitial = (user?.email?.[0] || "U").toUpperCase();

  return(
    <div className={styles.lesson_wrapper}>

      <div className={styles.top_nav}>
        <div className={styles.brand}>
          <span className={styles.brand_mark}><img src={comet_normal} width={40} height={40}/></span>
          Lunaar
        </div>
        <div className={styles.nav_links}>
          <button className={styles.nav_link}><House size={16} /> Home</button>
          <button className={styles.nav_link}><Book size={16} /> Courses</button>
          <div className={styles.nav_avatar}>{avatarInitial}</div>
        </div>
      </div>

      <div className={styles.progress_header}>
        <button type="button" className={styles.progress_back_btn} onClick={goBack}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.progress_track}>
          <div className={styles.progress_fill} style={{ width: `${progressPercent}%` }} />
        </div>
        <span className={styles.progress_count}>{currentIndex + 1}/{lessons.length}</span>
      </div>

      <div className={styles.lesson_card}>
        <div className={styles.lesson_card_content}>

          <div className={styles.lesson_header}>
            <div className={styles.lesson_header_row}>
              <div className={`${styles.lesson_type_badge} ${styles[badge.className]}`}>
                <span className={styles.badge_dot}></span>
              </div>
              {ttsSupported && (
                <button type="button" className={styles.listen_btn} onClick={toggleSpeech}>
                  {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  {isSpeaking ? "Stop" : "Listen"}
                </button>
              )}
            </div>
            <h2>{currentLesson.title}</h2>
          </div>

          {isBoss ? (
            !bossStarted ? (
              <div className={styles.boss_intro}>
                <div className={styles.boss_intro_icon}><Trophy size={32} /></div>
                <p>{currentLesson.intro}</p>
                <span className={styles.boss_meta}>{bossQuestions.length} questions stand between you and victory</span>
              </div>
            ) : bossFinished ? (
              <div className={styles.boss_result}>
                <div className={styles.boss_intro_icon}><Trophy size={32} /></div>
                <h3>{bossScore}/{bossQuestions.length} correct</h3>
                <p>
                  {bossScore === bossQuestions.length
                    ? "Flawless victory. You've mastered this course."
                    : bossScore >= Math.ceil(bossQuestions.length / 2)
                    ? "Solid work. You beat the boss."
                    : "You made it through — consider a quick review."}
                </p>
              </div>
            ) : (
              <>
                <span className={styles.boss_progress}>Question {bossIndex + 1}/{bossQuestions.length}</span>
                {currentBossQuestion.quiz_type === "fill_blank" ? (
                  <p className={styles.quiz_question}>{renderBoldText(currentBossQuestion.content)}</p>
                ) : (
                  <p className={styles.quiz_question}>{currentBossQuestion.question || currentBossQuestion.content}</p>
                )}
                <QuizOptions
                  quiz_type={currentBossQuestion.quiz_type}
                  options={currentBossQuestion.options}
                  correct_index={currentBossQuestion.correct_index}
                  selected={bossSelected}
                  onSelect={handleBossSelect}
                />
                {bossSelected !== null && (
                  <div className={`${styles.quiz_feedback} ${bossSelected === currentBossQuestion.correct_index ? styles.correct : styles.wrong}`}>
                    {bossSelected === currentBossQuestion.correct_index ? "Nice work! That's correct." : "Not quite — check the highlighted answer."}
                  </div>
                )}
              </>
            )
          ) : isSimulator ? (
            currentLesson.simulator_type === "terminal" ? (
              <TerminalSimulator key={currentIndex} lesson={currentLesson} onComplete={() => setSimDone(true)} />
            ) : currentLesson.simulator_type === "conversation" ? (
              <ConversationSimulator key={currentIndex} lesson={currentLesson} onComplete={() => setSimDone(true)} />
            ) : currentLesson.simulator_type === "drag_drop" ? (
              <DragDropSimulator key={currentIndex} lesson={currentLesson} onComplete={() => setSimDone(true)} />
            ) : (
              <SliderSimulator key={currentIndex} lesson={currentLesson} onComplete={() => setSimDone(true)} />
            )
          ) : isDiagram ? (
            <DiagramRenderer key={currentIndex} lesson={currentLesson} />
          ) : isAnswerable ? (
            <>
              {currentLesson.type === "quiz" && currentLesson.quiz_type === "fill_blank" ? (
                <p className={styles.quiz_question}>{renderBoldText(currentLesson.content)}</p>
              ) : (
                <p className={styles.quiz_question}>{currentLesson.question || currentLesson.content}</p>
              )}
              <QuizOptions
                quiz_type={currentLesson.quiz_type}
                options={currentLesson.options}
                correct_index={currentLesson.correct_index}
                selected={selectedAnswer}
                onSelect={setSelectedAnswer}
              />
              {selectedAnswer !== null && (
                <div className={`${styles.quiz_feedback} ${isCorrect ? styles.correct : styles.wrong}`}>
                  {isCorrect ? "Nice work! That's correct." : "Not quite — check the highlighted answer."}
                </div>
              )}
            </>
          ) : (
            <p>{renderBoldText(currentLesson.content)}</p>
          )}

          <div className={styles.btn_wrapper_content}>
            {isBoss && !bossStarted ? (
              <button type="button" className={styles.btn_continue} onClick={() => setBossStarted(true)}>
                Start Boss Challenge
              </button>
            ) : isBoss && !bossFinished ? (
              <button
                type="button"
                className={styles.btn_continue}
                onClick={handleBossNext}
                disabled={bossSelected === null}
              >
                {isBossLastQuestion ? "See Results" : "Next Question"}
              </button>
            ) : (
              <button
                type="button"
                className={styles.btn_continue}
                onClick={goNext}
                disabled={(isAnswerable && selectedAnswer === null) || (isSimulator && !simDone)}
              >
                {isLast ? "Finish course" : "Continue"}
              </button>
            )}
          </div>

        </div>
      </div>

      <button type="button" className={styles.chat_launcher} onClick={() => setChat_active(true)}>
        <MessageCircle size={22} />
      </button>

      {chat_active && (
        <>
          <div className={styles.chatbox_backdrop} onClick={() => setChat_active(false)} />
          <div className={styles.chatbox}>
            <div className={styles.chatbox_header}>
              <div className={styles.c_header_left}>
                <img src={Lua} alt="Lua" />
                <div>
                  <h3>Lua</h3>
                  <span>● Online</span>
                </div>
              </div>
              <div className={styles.c_header_right}>
                <button onClick={() => setChat_active(false)}><X size={16} /></button>
              </div>
            </div>
            <div className={styles.chat_main}>
              <div className={styles.welcome_msg}>
                Sup. What can I help with?
              </div>

              {messages.map((m, index) => (
                <div
                  key={index}
                  className={`${styles.message_bubble} ${m.role === 'user' ? styles.user : styles.assistant}`}
                >
                  <p>{m.content}</p>
                </div>
              ))}
            </div>

            <div className={styles.input_wrapper}>
              <input
                value={message_content}
                onChange={(e) => setMessage_content(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && Send_msg()}
                placeholder="Ask Lua something"
              />
              <button onClick={Send_msg}><CornerDownLeft size={16} /></button>
            </div>
          </div>
        </>
      )}

    </div>
  )

}