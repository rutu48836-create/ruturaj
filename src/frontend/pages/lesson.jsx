import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../compoents/supabaseConfig";
import styles from "../styles/lesson.module.css"
import { useAuth } from "../compoents/authcontext";
import { ArrowLeft, BookOpen, Lightbulb, Target, HelpCircle, Trophy, Volume2, VolumeX, Terminal, MessagesSquare, CornerDownLeft, Eye } from "lucide-react";

function normalizeCommand(str) {
  return (str || "").trim().replace(/\s+/g, " ");
}

function normalizePhrase(str) {
  return (str || "").trim().toLowerCase().replace(/[.,!?¿¡'"]/g, "").replace(/\s+/g, " ");
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
  learn: { label: "Lesson", icon: BookOpen, className: "lesson" },
  example: { label: "Example", icon: Lightbulb, className: "example" },
  challenge: { label: "Challenge", icon: Target, className: "challenge" },
  quiz: { label: "Quick Check", icon: HelpCircle, className: "quiz" },
  boss_challenge: { label: "Boss Challenge", icon: Trophy, className: "boss" },
  simulator_terminal: { label: "Terminal", icon: Terminal, className: "simulator" },
  simulator_conversation: { label: "Conversation", icon: MessagesSquare, className: "simulator" },
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

  const [bossStarted, setBossStarted] = useState(false)
  const [bossIndex, setBossIndex] = useState(0)
  const [bossSelected, setBossSelected] = useState(null)
  const [bossAnswers, setBossAnswers] = useState([])
  const [bossFinished, setBossFinished] = useState(false)

  const [simDone, setSimDone] = useState(false)

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
        console.log("no data")
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
  const isAnswerable = isQuiz || isChallengeMCQ;

  const badge = isSimulator
    ? BADGES[`simulator_${currentLesson.simulator_type}`] || BADGES.challenge
    : BADGES[currentLesson.type] || BADGES.learn;
  const BadgeIcon = badge.icon;

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

        console.log('progress upsert:', { data, error })

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

  console.log('streak fetch:', { profile, error });

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

  return(
    <div className={styles.lesson_wrapper}>

      <div className={styles.progress_header}>
        <button type="button" className={styles.progress_back_btn} onClick={goBack}>
          <ArrowLeft size={22} />
        </button>
        <div className={styles.progress_track}>
          <div className={styles.progress_fill} style={{ width: `${progressPercent}%` }} />
        </div>
        <span className={styles.progress_count}>{currentIndex + 1}/{lessons.length}</span>
      </div>

      <div className={styles.lesson_card}>

        <div className={styles.lesson_card_img}>
          <div className={styles.badge_row}>
            <div className={`${styles.lesson_type_badge} ${styles[badge.className]}`}>
              <BadgeIcon size={13} />
              {badge.label}
            </div>

            {ttsSupported && (
              <button type="button" className={styles.listen_btn} onClick={toggleSpeech}>
                {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                {isSpeaking ? "Stop" : "Listen"}
              </button>
            )}
          </div>
          <h2>{currentLesson.title}</h2>
        </div>

        <div className={styles.lesson_card_content}>

          {isBoss ? (
            !bossStarted ? (
              <div className={styles.boss_intro}>
                <Trophy size={40} className={styles.boss_intro_icon} />
                <p>{currentLesson.intro}</p>
                <span className={styles.boss_meta}>{bossQuestions.length} questions stand between you and victory</span>
              </div>
            ) : bossFinished ? (
              <div className={styles.boss_result}>
                <Trophy size={40} className={styles.boss_intro_icon} />
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
                  <p className={styles.quiz_question}>{currentBossQuestion.question}</p>
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
            ) : (
              <ConversationSimulator key={currentIndex} lesson={currentLesson} onComplete={() => setSimDone(true)} />
            )
          ) : isAnswerable ? (
            <>
              {currentLesson.type === "quiz" && currentLesson.quiz_type === "fill_blank" ? (
                <p className={styles.quiz_question}>{renderBoldText(currentLesson.content)}</p>
              ) : (
                <p className={styles.quiz_question}>{currentLesson.question}</p>
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

    </div>
  )

}