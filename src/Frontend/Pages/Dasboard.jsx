import React, { useState, useEffect } from 'react'
import { NavBar } from '../Components/NavBar'
import styles from '../Styles/Dashboard.module.css'
import { supabase } from '../config/supabaseClient.js'
import { auth } from '../config/Firebase.js'
import { Trash2, SendHorizontal, Search, Ellipsis, RefreshCw, Share, Plus, LayoutDashboard, Mail, StickyNote, SquareUser } from "lucide-react"
import { User, FileTerminal, LogOut, Menu, X, Wallet, CircleQuestionMark, Circle, PiggyBank,Compass } from 'lucide-react';
import { Link } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import No_agent from "../assets/No_agent.png"
import { useRazorpay } from '../Components/useRazorpay.jsx'


function Dashboard_sidebar({ active, setActive, setSide_bar_open, currentUser, handleUpgrade,plan}) {

   const navigate = useNavigate();

  return (
    <div
      tabIndex={0}
      className={active ? styles.activeStyle : styles.Dashboard_sidebar_wrapper}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className={styles.Links_wrapper}>
        <button className={active ? styles.btn_active : styles.btn_dashboard_sidebar} onClick={() => navigate('/Dashboard')}>
          <LayoutDashboard color="#3b3b3b" size={20} strokeWidth={1.50} />
          {active && <span>Dashboard</span>}
        </button>

        <button className={active ? styles.btn_active : styles.btn_dashboard_sidebar} onClick={() => navigate('/Guide')}>
          <StickyNote color="#3b3b3b" size={20} strokeWidth={1.50} />
          {active && <span>Documents</span>}
        </button>

        <button className={active ? styles.btn_active : styles.btn_dashboard_sidebar} onClick={() => navigate('/Contact')}>
          <Mail color="#3b3b3b" size={20} strokeWidth={1.50} />
          {active && <span>Contact Us</span>}
        </button>

           <button className={active ? styles.btn_active : styles.btn_dashboard_sidebar} onClick={() => navigate('/Terms')}>
<FileTerminal  color="#3b3b3b" size={20} strokeWidth={1.50}/>
              {active && <span>Terms & refund</span>}
        </button>

        <button
          className={active ? styles.btn_active : styles.btn_dashboard_sidebar}
          onClick={() => setSide_bar_open(true)}
        >
          <SquareUser color="#3b3b3b" size={20} strokeWidth={1.50} />
          {active && <span>User Profile</span>}
        </button>
      </div>

      <div className={styles.links_wrapper}>
        <button className={styles.link_btn}>
          <a href="/Terms"><FileTerminal size={18} color="#444441" /></a>
        </button>
        <button className={styles.link_btn}>
          <a href="/Contact"><CircleQuestionMark size={18} color="#444441" /></a>
        </button>
        <button className={styles.link_btn}>
          <a href="/About"><Search size={18} color="#444441" /></a>
        </button>
        <button className={styles.link_btn} onClick={() => handleUpgrade()}>
          <a href="#"><PiggyBank size={18} color="#444441" /></a>
        </button>

                <button className={styles.link_btn}>
          <a href="/Guide"><Compass size={18} color="#444441" /></a>
        </button>
        <button className={styles.link_btn}>
          <a href="/Privacy"><StickyNote size={18} color="#444441" /></a>
        </button>
        
      </div>

      <div className={active ? styles.footer_active : styles.sidebar_footer}>
        <div
          className={styles.user_img_wrapper}
          style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img src={currentUser?.photoURL} alt="user" style={{ minWidth: '38px', minHeight: '38px' }} />
        </div>

        {active && (
          <>
            <div className={styles.user_details}>
              <span>{currentUser?.displayName}</span>
              <small>{plan}</small>
            </div>
            <button
              className={styles.upgrade_btn1}
              style={{ justifySelf: 'flex-end' }}
              onClick={handleUpgrade}
             disabled = {plan === "Pro"}
            >
              Upgrade
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Projects({
  search, setSearch, projects, styles, setBuilder,
  delete_project, CopyLink, credits, plan, message_count,
  limit, upgrade_hidden, user,
  form, setForm, chatbot, formData, setDelete, project_delete
}) {
  const [usage, setUsage] = useState(false)
  const [projectDetails, setProjectDetails] = useState(false)
  const [confirmation, setConfirm] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)

 function getTextColor(bgColor) {
 let r, g, b;
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16);
        g = parseInt(cleanHex[1] + cleanHex[1], 16);
        b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else {
        r = parseInt(cleanHex.substring(0, 2), 16);
        g = parseInt(cleanHex.substring(2, 4), 16);
        b = parseInt(cleanHex.substring(4, 6), 16);
    }

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
if (brightness < 216) {
        return '#000';
    }

    else{
return '#fff'
    }
}

  const delete_confirm = confirmation !== 'delete project'

  const userMessageStyle = {
    padding: '.6rem .9rem',
    borderRadius: '20px',
    maxWidth: '60%',
    wordWrap: 'break-word',
    display: 'flex',
    alignSelf: 'flex-end',
    marginRight: '10px',
    backgroundColor: '#ebe5e5',
    marginTop: '12px',
    width: '60%',
    boxShadow: `rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px`,
  }

  return (
    <div className={styles.Projects_container}>
      <div className={styles.New_Project_section}>
        <div className={styles.Project_search_wrapper}>
          <h2 style={{ fontWeight: '600' }}>Projects</h2>
          <div className={styles.main_search_wrapper}>
            <div className={styles.search_box}>
              <Search size={18} style={{ color: "#000000", marginLeft: "10px" }} />
              <input
                type='text'
                placeholder='Search for chatbot....'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className={styles.create_btn} onClick={() => setBuilder(true)}>New Project +</button>
          </div>
        </div>
      </div>

      <div className={styles.Main_content_wrapper}>
        <div className={`${styles.Left_side_section} ${usage ? styles.usage_active : ''}`}>
          <div className={styles.left_side_section_head}>
            <h3>Usage</h3> <button onClick={() => setUsage(true)}>X</button>
          </div>
          <div className={styles.left_side_head_main}>
            <ul>
              <li><span>Credits</span> <h4>{credits}</h4></li>
              <li><span>Messages</span> <h4>{message_count}</h4></li>
              <li><span>Plan</span> <h4>{plan}</h4></li>
              {plan === "premium" && (
                <li className={styles.upgrade_hidden}><span>Limit</span> <h4>{limit}</h4></li>
              )}
            </ul>
            <div className={styles.main_content_btn_wrapper}>
              <button className={styles.pricing_btn}>Pricing</button>
            </div>
          </div>
        </div>

        <div className={`${styles.existing_projects_section} ${projects.length === 0 ? styles.empty_state : ''}`}>
          {projects.length === 0 ? (
            <div className={styles.no_project_wrapp}>
              <img src={No_agent} alt="no agent" className={styles.No_agent} />
              <h3>No project yet</h3>
              <span>Get started by creating your own custom AI chatbot for free and share it to anybody you want</span>
            </div>
          ) : (
            projects.map((project) => (
              <div className={styles.project_card} key={project.id}>
                <div
                  className={styles.project_branding}
                  style={{
                    backgroundColor: `${project.color}90`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: `0 4px 24px ${project.color}10`,
                  }}
                >
                  <div className={styles.chatbot_demo_wrapper}>
                    <div
                      className={styles.chatbot_demo_head}
                      style={{
                        backgroundColor: `${project.color || '#000'}80`,
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px ${project.color || '#000'}30`,
                        color: getTextColor(project.color)
                      }}
                    >
                      <img
                        src={project.logo_url}
                        alt="no logo"
                        style={{ width: '24px', height: '24px', display: 'flex', borderRadius: '50%', marginLeft: '10px' }}
                      />
                      <small>{project.name}</small>
                      <div className={styles.icon_demo}>
                        <RefreshCw size={12} /><Share size={12} style={{ marginRight: '8px' }} />
                      </div>
                    </div>

                    <div style={{ ...userMessageStyle }}></div>
                    <div style={{ ...userMessageStyle, alignSelf: 'flex-start', marginLeft: '10px', backgroundColor: project.color, color: '#ffffff' }}></div>
                  </div>
                </div>

                <div className={styles.project_card_right}>
                  <div className={styles.project_card_top}></div>
                  <div className={styles.project_card_content}>
                    <div className={styles.project_card_name_wrapper}>
                      <span>{project.name}</span>
                      {project.agent_type === 'assistant' && (
                        <button onClick={() => {
                          window.location.href = `https://ruturaj-2.onrender.com/auth/google?shareToken=${project.share_token}`
                        }}>Connect calendar</button>
                      )}
                    </div>
                    <small className={styles.agent}>{project.agent_type} agent</small>

                    <div className={styles.project_card_btn_wrapp}>
                      <div className={styles.agent_type}></div>
                      <div className={styles.btns}>
                        <button className={styles.send_btn} onClick={() => CopyLink(project.share_token)}>
                          <SendHorizontal size={16} /> Share
                        </button>
                        <button className={styles.delete_btn1} onClick={() => {
                          setDelete(true)
                          setSelectedProject(project)
                        }}>
                          <Trash2 color='#fff' size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {project_delete && (
            <div className={styles.project_delete_wrapper}>
              <div className={styles.project_delete_card}>
                <h3>Delete project</h3>
                <span>This will permanently delete the project and the link related to the project will also be deleted.</span>
                <label>To confirm, type "delete project"</label>
                <input type="text" onChange={(e) => setConfirm(e.target.value)} />
                <div className={styles.project_delete_btns}>
                  <button
                    className={styles.cancel_btn1}
                    disabled={delete_confirm}
                    onClick={() => {
                      delete_project(selectedProject.id);
                      setDelete(false);
                      setConfirm('');
                    }}
                  >
                    Delete
                  </button>
                  <button className={styles.confirm_btn} onClick={() => setDelete(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function Dashboard() {

  const navigate = useNavigate();
  const [builder, setBuilder] = useState(false)
  const [link, setLink] = useState(null)
  const [search, setSearch] = useState("")
  const [credits, setCredits] = useState(null)
  const [paywall, setPayWall] = useState(false)
  const [userId, setUserId] = useState(null)
  const [plan, setPlan] = useState(null)
  const [message_count, setMessageCount] = useState(null)
  const [MessageLimit, setMessageLimit] = useState(null)
  const [upgrade_hidden, setUpgradeHidden] = useState(false)
  const [form, setForm] = useState(false)
  const [preview, setPreview] = useState(null)
  const [chatbot, setChatbot] = useState(null)
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [project_delete, setDelete] = useState(false)
  const [active, setActive] = useState(false)
  const [Side_bar_open, setSide_bar_open] = useState(false)

  const currentUser = auth.currentUser;

  const { subscribe, loading: upgradeLoading } = useRazorpay();

  const handleUpgrade = () => {
    subscribe({
      user: { name: currentUser?.displayName, email: currentUser?.email },
      onSuccess: () => {
        Plan_call();
      },
      onError: (msg) => {
        console.error("Payment error:", msg);
      },
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('calendar') === 'connected') {
      setCalendarConnected(true)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/Login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

  const Plan_call = async () => {
    if (!userId) return
    try {
      const response = await fetch(`${BACKEND_URL}/api/credits/${userId}`);
      const data = await response.json();
      if (data.plan !== undefined) setPlan(data.plan)
    } catch (err) {
      console.log('error in finding plan')
    }
  }

  useEffect(() => {
    if (!userId) return;
    Plan_call();
  }, [userId]);

  const [formData, setFormData] = useState({
    name: '',
    systemPrompt: '',
    website: '',
    logo: null,
    pdfs: [],
    color: "#1a1a1a",
    agentType: '',
    notificationEmail: null,
    whatsappNumber: null
  })

  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    if (!userId) return;
    async function ChatBots() {
      const { data, error } = await supabase
        .from("chatbots")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle()

      if (!error) {
        setChatbot(data)
      }

      if (chatbot) {
        setCalendarConnected(!!chatbot.google_access_token)
      }
    }
    ChatBots()
  }, [userId, chatbot])

  const fetchProjects = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("chatbots")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .ilike("name", `%${search}%`);

    if (error) { console.error("Supabase error:", error); return; }
    setProjects(data || []);
  };

  useEffect(() => {
    if (!userId) return;
    fetchProjects();
  }, [userId, search]);

  useEffect(() => {
    if (!userId) return;
    const fetchCredits = async () => {
      const response = await fetch(`${BACKEND_URL}/api/credits/${userId}`);
      const data = await response.json();
      if (data.credits !== undefined) setCredits(data.credits);
      if (data.plan !== undefined) setPlan(data.plan)
      if (data.message_count !== undefined) setMessageCount(data.message_count)
      if (data.limit !== undefined) setMessageLimit(data.limit)
      if (data.plan === "premium") setUpgradeHidden(true)
    };
    fetchCredits();
  }, [userId]);

  function generateShareToken() {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
  }

  const uploadFile = async (file, bucket, folder = '') => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)
      return publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const handleCreateChatbot = async (e) => {
    e.preventDefault()
    if (credits === null) { alert('Loading credits, please wait...'); return }
    setLoading(true)
    try {
      const currentUser = auth.currentUser
      if (!currentUser) { alert("Please login first"); setLoading(false); return }

      if (!formData.logo) {
        alert('Logo is required')
        setLoading(false)
        return
      }

      const formPayload = new FormData()
      formPayload.append('agentType', formData.agentType)
      formPayload.append('notificationEmail', formData.notificationEmail || '')
      formPayload.append('color', formData.color)
      formPayload.append("userId", currentUser.uid)
      formPayload.append("name", formData.name)
      formPayload.append("systemPrompt", formData.systemPrompt)
      formPayload.append("website", formData.website)
      if (formData.logo) formPayload.append("logo", formData.logo)
      formData.pdfs.forEach((pdf) => formPayload.append("pdfs", pdf))

      const response = await fetch(`${BACKEND_URL}/api/create`, { method: "POST", body: formPayload })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || "Failed to create chatbot")

      alert("Chatbot created successfully!")
      await fetchProjects()
      setBuilder(false)
      setFormData({ name: "", systemPrompt: "", website: "", logo: null, pdfs: [], color: "#000" })
      document.getElementById("logo").value = ""
      document.getElementById("pdfs").value = ""
    } catch (error) {
      console.error("Error:", error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) { alert('Please upload an image file'); e.target.value = ''; return }
      if (file.size > 4 * 1024 * 1024) { alert('Logo must be less than 4MB'); e.target.value = ''; return }
      setFormData({ ...formData, logo: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  const handlePDFChange = (e) => {
    const files = Array.from(e.target.files)
    const invalidFiles = files.filter(file => file.type !== 'application/pdf')
    if (invalidFiles.length > 0) { alert('Please upload only PDF files'); e.target.value = ''; return }
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > 50 * 1024 * 1024) { alert('Total PDF size must be less than 50MB'); e.target.value = ''; return }
    setFormData({ ...formData, pdfs: files })
  }

  const delete_project = async (id) => {
    try {
      const currentUser = auth.currentUser;
      const res = await fetch(`${BACKEND_URL}/api/chat/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.uid })
      })
      if (!res.ok) throw new Error("Delete failed")
      await fetchProjects()
    } catch (error) {
      alert('error in deleting')
    }
  }

  const CopyLink = async (share_token) => {
    try {
      const fullLink = `https://lunaar.online/chat/${share_token}`
      await navigator.clipboard.writeText(fullLink);
      alert('link copied')
    } catch (error) {
      console.log(error)
    }
  }

  const data_limit = () => {
    if (formData.website) {
      document.getElementById("pdfs").disabled = true;
    }
    if (formData.pdfs.length > 0) {
      document.getElementById("web").disabled = true;
    }
  }

  return (
    <>
      <div className={styles.Dashboard_container}>
        <NavBar credits={credits} Side_bar_open={Side_bar_open} setSide_bar_open={setSide_bar_open} setActive={setActive} active={active}/>

        <Dashboard_sidebar
          active={active}
          setActive={setActive}
          setSide_bar_open={setSide_bar_open}
          currentUser={currentUser}
          handleUpgrade={handleUpgrade}
         plan={plan}
        />

        <Projects
          search={search}
          setSearch={setSearch}
          projects={projects}
          styles={styles}
          setBuilder={setBuilder}
          delete_project={delete_project}
          CopyLink={CopyLink}
          credits={credits}
          plan={plan}
          message_count={message_count}
          limit={MessageLimit}
          upgrade_hidden={upgrade_hidden}
          user={currentUser}
          form={form}
          setForm={setForm}
          preview={preview}
          chatbot={chatbot}
          formData={formData}
          setDelete={setDelete}
          project_delete={project_delete}
        />
      </div>

      {builder && (
        <div className={styles.chat_bot_builder_wrapper} onClick={() => setBuilder(false)}>
          <div className={styles.chat_bot_builder_card} onClick={e => e.stopPropagation()}>
            <div className={styles.chat_bot_builder_appearance}>

              <div className={styles.builder_header_text}>
                <h3>Let's start building</h3>
                <span>Set up your AI agent — train it on your content and share it anywhere.</span>
              </div>

              <form onSubmit={handleCreateChatbot}>
                <div className={styles.appearance_inputs}>

                  <div className={styles.builder_identity_row}>
                    <div
                      className={styles.Chatbot_logo}
                      onClick={() => document.getElementById('logo').click()}
                      title="Upload logo"
                    >
                      {preview
                        ? <img src={preview} alt="Logo preview" className={styles.preview} />
                        : <span>+</span>
                      }
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={{ display: 'none' }}
                      />
                    </div>

                    <div className={styles.builder_name_field}>
                      <label htmlFor="name">Agent name</label>
                      <input
                        type="text"
                        id="name"
                        placeholder="e.g. Support Bot"
                        value={formData.name}
                        maxLength={32}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

         <div className={styles.field_group}>
                    <label>Website URL</label>
                    <div className={styles.url_input_row}>
                      <input
                        disabled={formData.pdfs.length > 0 && plan === "free"}
                        id="web"
                        type="text"
                        className={styles.url_domain_input}
                        placeholder="yourdomain.com"
                        value={formData.website.replace(/^https?:\/\//, '')}
                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                      />
                    </div>
                  </div>

                  

                  <div className={styles.field_row}>
                    <div className={styles.field_group} style={{ marginBottom: 0 }}>
                      <label htmlFor="usecase">Use-case</label>
                      <select
                        id="usecase"
                        value={formData.agentType}
                        className={styles.usecase_select}
                        onChange={e => setFormData({ ...formData, agentType: e.target.value })}
                      >
                        <option value='Info'>Info AI agent</option>
                        <option value='sales'>Sales assistant</option>
                        <option value='assistant'>Personal assistant</option>
                      </select>
                    </div>

                    {formData.agentType === 'sales' && (
                      <div className={styles.field_group}>
                        <label>Your email for order alerts</label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={formData.notificationEmail || ''}
                          onChange={e => setFormData({ ...formData, notificationEmail: e.target.value })}
                        />
                      </div>
                    )}

                    {formData.agentType === "assistant" && (
                      <div className={styles.field_group}>
                        <label>Your email for confirmation</label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={formData.notificationEmail || ''}
                          onChange={e => setFormData({ ...formData, notificationEmail: e.target.value })}
                        />
                      </div>
                    )}

                    <div className={styles.field_group} style={{ marginBottom: 0 }}>
                      <label>Brand colour</label>
                      <div className={styles.color_row}>
                        <input
                          type="color"
                          id="color"
                          className={styles.color_swatch_input}
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                        <span className={styles.color_label_display} id="colorLabel">{formData.color}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 20 }} />

                  <div className={styles.builder_section_label}>Knowledge</div>

                  <div className={styles.field_group}>
                    <label htmlFor="pdfs">Upload PDFs</label>
                    <input
                      type="file"
                      id="pdfs"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={handlePDFChange}
                      disabled={formData.website.length > 0 && plan === "free"}
                    />
                  </div>

                  <div className={styles.field_group}>
                    <label htmlFor="systemPrompt">System prompt</label>
                    <textarea
                      id="systemPrompt"
                      placeholder="You are a helpful assistant for… Describe what the agent should do, how it should respond, and any rules it must follow."
                      value={formData.systemPrompt}
                      onChange={e => setFormData({ ...formData, systemPrompt: e.target.value })}
                      required
                      rows={4}
                    />
                  </div>

                  <small className={styles.small}>
                    The agent will email you about new orders or requests. Ensure the prompt instructs them
                  </small>

                </div>

                <div className={styles.chat_bot_builder_btn_wrapper}>
                  <button className={styles.createe_btn} type="submit" disabled={loading}>
                    {loading ? 'Creating agent…' : 'Create agent →'}
                  </button>
                  <div className={styles.or_divider}>or</div>
                  <button
                    className={styles.cancel_btn}
                    type="button"
                    onClick={() => setBuilder(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
