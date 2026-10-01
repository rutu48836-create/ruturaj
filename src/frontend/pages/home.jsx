import { useState, useEffect, useRef } from "react";
import styles from "../styles/home.module.css"
import { ArrowUp, Sofa, X, Settings, Paperclip, FileText, Upload } from 'lucide-react';
import { Nav } from "../compoents/nav";
import { useAuth } from "../compoents/authcontext";
import { Top_nav } from "../compoents/nav";
import { useNavigate } from "react-router-dom"
import comet_normal from "../assets/comet_normal.png"
import { supabase } from "../compoents/supabaseConfig.js"
import fire from "../assets/fire.png"

const GOAL_TYPES = [
  { value: "job_prep", label: "Job / interview prep" },
  { value: "project", label: "Building a specific project" },
  { value: "academic", label: "Exam / coursework" },
  { value: "conversation_practice", label: "Conversation practice" },
  { value: "curiosity", label: "Just curious, no deadline" },
];

const DIFFICULTY_LEVELS = [
  { value: "beginner", label: "Beginner", hint: "Assume no prior knowledge." },
  { value: "intermediate", label: "Intermediate", hint: "I know the basics." },
  { value: "advanced", label: "Advanced", hint: "Push me with harder material." },
];

const MAX_PDF_MB = 20;

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function Home() {
  const [message, setMessage] = useState('')
  const [waiting, setWaiting] = useState(false)
  const { user, loading } = useAuth()
  const [sidebar_active, setSidebar_active] = useState(false)
  const [select_pdf, setSelect_pdf] = useState(false)
  const [setting_panel, setSetting_panel] = useState(false)
  const [pdf, setPdf] = useState(null)
  const [pdf_url, setPdf_url] = useState(null)
  const [pdf_name, setPdf_name] = useState("")
  const [pdf_size, setPdf_size] = useState(0)
  const [pdf_error, setPdf_error] = useState("")
  const [pdf_uploading, setPdf_uploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const file_input = useRef(null)
  const navigate = useNavigate()

  const [goal_type, setGoal_type] = useState('')
  const [goal_detail, setGoal_detail] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [user_details, setUser_details] = useState([])

  const selected_level = DIFFICULTY_LEVELS.find(d => d.value === difficulty)

  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth')
    }
  }, [user, loading])

  const send_message = async () => {
    if (!message.trim()) return;
    if (waiting) return alert('pls wait');
    const learning_keywords = ['teach', 'explain', 'learn', 'how to', 'what is', 'course on', 'guide to'];
    const looks_like_request = learning_keywords.some(k => message.toLowerCase().includes(k));
    if (!looks_like_request) {
      return alert('Try phrasing it like "Teach me about..." or "Explain..."');
    }
    try {
      setWaiting(true)
      const request = await fetch(`${import.meta.env.VITE_BACKEND_KEY}/llm/create_lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message,
          user_id: user.id,
          goal_type: goal_type || null,
          goal: goal_detail || null,
          current_level: difficulty || null,
          pdf_path: pdf_url || null
        })
      })
      await request.json()
      setWaiting(false)
      navigate('/courses')
    } catch (err) {
      console.error('Failed to generate course:', err)
      setWaiting(false)
    }
  }

  useEffect(() => {
    if (!user) return

    const check = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)

      if (error) console.log(error);
      if (data && data.length > 0) {
        setUser_details(data[0])
      }
    }

    check()
  }, [user])

  const stageFile = (file) => {
    setPdf_error("")
    if (!file) return
    if (file.type !== 'application/pdf') {
      setPdf(null)
      setPdf_error("Only PDF files are supported.")
      return
    }
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      setPdf(null)
      setPdf_error(`File is too large. Max size is ${MAX_PDF_MB} MB.`)
      return
    }
    setPdf(file)
  }

  const handleFileChange = (e) => {
    stageFile(e.target.files[0])
    e.target.value = ""
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    stageFile(e.dataTransfer.files[0])
  }

  const closePdfModal = () => {
    if (pdf_uploading) return
    setSelect_pdf(false)
    setPdf(null)
    setPdf_error("")
    setDragging(false)
  }

  const removeAttachment = () => {
    setPdf_url(null)
    setPdf_name("")
    setPdf_size(0)
  }

  const resetPersonalization = () => {
    setGoal_type('')
    setGoal_detail('')
    setDifficulty('')
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdf || pdf_uploading) return

    try {
      setPdf_uploading(true)
      setPdf_error("")

      const unique = `${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`
      const filePath = `pdfs/${unique}`

      const { error } = await supabase.storage
        .from("pdf")
        .upload(filePath, pdf, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      setPdf_url(filePath)
      setPdf_name(pdf.name)
      setPdf_size(pdf.size)
      setPdf(null)
      setSelect_pdf(false)
    } catch (err) {
      console.log(err)
      setPdf_error("Upload failed. Please try again.")
    } finally {
      setPdf_uploading(false)
    }
  }

  return (
    <div className={styles.home_container}>
      <Nav sidebar_active={sidebar_active} setSidebar_active={setSidebar_active} />
      
      <div className={styles.hero_wrapper}>
        <Top_nav setSidebar_active={setSidebar_active} sidebar_active={sidebar_active} />
        <img src={comet_normal} width={100} height={100} className={styles.comet_img} />
        <h1>
          What should we learn?
        </h1>
        <div className={styles.hero_wrapper_textarea}>
          {pdf_url && (
            <div className={styles.pdf_display}>
              <div className={styles.pdf_chip}>
                <div className={styles.pdf_chip_icon}>
                  <FileText size={16} />
                </div>
                <div className={styles.pdf_chip_meta}>
                  <span className={styles.pdf_chip_name}>{pdf_name}</span>
                  <span className={styles.pdf_chip_size}>PDF · {formatSize(pdf_size)}</span>
                </div>
                <button
                  type="button"
                  className={styles.pdf_chip_remove}
                  onClick={removeAttachment}
                  aria-label="Remove attachment"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
          <textarea
            placeholder="Teach me about french revolution"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className={styles.textarea_btns}>
            <button onClick={() => setSetting_panel(true)} style={{ background: "transparent" }}>
              {goal_type || difficulty ? 'Personalized ✓' : <Settings />}
            </button>
            <div className={styles.txt_area_right_btns}>
              <button type="button" onClick={() => setSelect_pdf(true)} aria-label="Attach PDF">
                <Paperclip size={20} />
              </button>
              <button type="button" onClick={() => send_message()} disabled={waiting}><ArrowUp color="white" /></button>
            </div>
          </div>
        </div>
        <div className={styles.btns}>
          <button onClick={() => setMessage("teach me python")}>Code</button>
          <button onClick={() => setMessage("teach me Spanish")}>Spanish</button>
          <button onClick={() => setMessage("teach me about the french revolution")}>French Revolution</button>
          <button onClick={() => setMessage("teach me about India")}>India</button>
        </div>
      </div>
      {waiting &&

        <div className={styles.waiting_wrapper}>
          <h2>Please Wait... while we generate your course</h2>
          <p>you will be redirected once the course is generated.it may take upto 2 mins</p>
          <Sofa size={100} />
        </div>

      }

      {select_pdf && (
        <div className={styles.panel_wrapper} onClick={closePdfModal}>
          <div className={styles.pdf_modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.pdf_modal_header}>
              <div>
                <h3>Attach a PDF</h3>
                <p>We'll use it as source material for your course.</p>
              </div>
              <button type="button" onClick={closePdfModal} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className={styles.pdf_modal_body}>
              <input
                ref={file_input}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className={styles.pdf_hidden_input}
              />

              {!pdf ? (
                <div
                  className={dragging ? styles.pdf_dropzone_active : styles.pdf_dropzone}
                  onClick={() => file_input.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      file_input.current?.click()
                    }
                  }}
                >
                  <div className={styles.pdf_dropzone_icon}>
                    <Upload size={18} />
                  </div>
                  <p className={styles.pdf_dropzone_title}>
                    <span>Click to upload</span> or drag and drop
                  </p>
                  <p className={styles.pdf_dropzone_hint}>PDF up to {MAX_PDF_MB} MB</p>
                </div>
              ) : (
                <div className={styles.pdf_selected}>
                  <div className={styles.pdf_selected_icon}>
                    <FileText size={18} />
                  </div>
                  <div className={styles.pdf_selected_meta}>
                    <span className={styles.pdf_selected_name}>{pdf.name}</span>
                    <span className={styles.pdf_selected_size}>{formatSize(pdf.size)}</span>
                  </div>
                  <button
                    type="button"
                    className={styles.pdf_selected_remove}
                    onClick={() => { setPdf(null); setPdf_error("") }}
                    disabled={pdf_uploading}
                    aria-label="Remove file"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {pdf_error && <p className={styles.pdf_error}>{pdf_error}</p>}
            </div>

            <div className={styles.pdf_modal_footer}>
              <button
                type="button"
                className={styles.pdf_btn_ghost}
                onClick={closePdfModal}
                disabled={pdf_uploading}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.pdf_btn_primary}
                onClick={handleUpload}
                disabled={!pdf || pdf_uploading}
              >
                {pdf_uploading ? (
                  <>
                    <span className={styles.pdf_spinner} />
                    Uploading
                  </>
                ) : (
                  "Attach"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {setting_panel && (
        <div className={styles.panel_wrapper} onClick={() => setSetting_panel(false)}>
          <div className={styles.panel_card} onClick={(e) => e.stopPropagation()}>

            <div className={styles.panel_header}>
              <div>
                <h2>Personalize this course</h2>
                <p>Optional. We'll infer from your prompt if you skip it.</p>
              </div>
              <button type="button" onClick={() => setSetting_panel(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className={styles.Main_content_panel}>

              <div className={styles.field_group}>
                <label>What's this for?</label>
                <div className={styles.chip_group}>
                  {GOAL_TYPES.map(g => (
                    <button
                      key={g.value}
                      type="button"
                      className={goal_type === g.value ? styles.chip_active : styles.chip}
                      onClick={() => setGoal_type(goal_type === g.value ? '' : g.value)}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field_group}>
                <label>Any specifics? <span className={styles.optional_tag}>optional</span></label>
                <input
                  type="text"
                  placeholder="e.g. React Native interview next week"
                  value={goal_detail}
                  onChange={(e) => setGoal_detail(e.target.value)}
                />
              </div>

              <div className={styles.field_group}>
                <label>Your current level</label>
                <div className={styles.segmented}>
                  {DIFFICULTY_LEVELS.map(d => (
                    <button
                      key={d.value}
                      type="button"
                      className={difficulty === d.value ? styles.segment_active : styles.segment}
                      onClick={() => setDifficulty(difficulty === d.value ? '' : d.value)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                {selected_level && <p className={styles.segment_hint}>{selected_level.hint}</p>}
              </div>

            </div>

            <div className={styles.panel_footer}>
              <button
                type="button"
                className={`${styles.pdf_btn_ghost} ${styles.panel_reset}`}
                onClick={resetPersonalization}
                disabled={!goal_type && !goal_detail && !difficulty}
              >
                Reset
              </button>
              <button
                type="button"
                className={styles.pdf_btn_primary}
                onClick={() => setSetting_panel(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}