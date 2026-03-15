import React, { useState, useEffect } from 'react'
import { NavBar } from '../Components/NavBar'
import styles from '../Styles/Dashboard.module.css'
import { supabase } from '../config/supabaseClient.js'
import { auth } from '../config/Firebase.js'
import { Trash2, SendHorizontal, Search,Ellipsis } from "lucide-react"
import { Link } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import No_agent from "../assets/No_agent.png"


function Projects({
  search, setSearch, projects, styles, setBuilder,
  delete_project, CopyLink, credits, plan, message_count,
  limit, upgrade_hidden, user,
  form, setForm,chatbot,formData
}) 
{

 const [usage,setUsage] = useState(false)

  return (
    <div className={styles.Projects_container}>
      <div className={styles.New_Project_section}>



        <div className={styles.Project_search_wrapper}>

 <h2>Projects</h2>

          <div className={styles.main_search_wrapper}>
          <input
            type='text'
            placeholder='Search for chatbot'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={styles.create_btn} onClick={() => setBuilder(true)}>Create +</button>
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

<div className={`${styles.existing_projects_section} ${projects.length === 0 ? styles.empty_state : ''}`}>          {projects.length === 0 ? (
                        <div className={styles.no_project_wrapp}>
 <img src={No_agent} alt="no agent" className={styles.No_agent}/>
              <h3>No project yet</h3>
              <span>Get started by creating your own custom AI chatbot for free and share it to anybody you want</span>
              </div>
          ) : (
            projects.map((project) => (
              <div className={styles.project_card} key={project.id} 
><div className={styles.project_branding} style={{
    backgroundColor: `${project.color}90`,  
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(255,255,255,0.2)',
  boxShadow: `0 4px 24px ${project.color}40`,
  }}>

 <img src={project.logo_url} alt={project.name} style={{ minWidth: '80px', minHeight: '80px',borderRadius:"50%" }} />
                </div>
                <div className={styles.project_card_right}>
              <div className={styles.project_card_top}>

                </div>
                <div className={styles.project_card_content}>
                  <span>{project.name}</span>   
                  <div className={styles.project_card_btn_wrapp}>
                                     <div className={styles.date}>
                           <small>created {new Date(project.created_at).toLocaleString()}</small></div>
<div className={styles.btns}>
           <button  className={styles.send_btn} onClick={() => CopyLink(project.share_token)}> <SendHorizontal size={16} /></button>
                  <button className={styles.delete_btn1} onClick={() => delete_project(project.id)}> <Trash2 color='#fff' size={14} />
                   </button>
                   </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export function Dashboard({ onclose }) {
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
  const [preview,setPreview] = useState(null)
  const [chatbot,setChatbot] = useState(null)
  const [dimensions,setdDimension] = useState({width:0,height:0})

  const currentUser = auth.currentUser;

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
  const FRONTEND_URL = "https://ruturaj-gito.vercel.app"

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
    color:"#1a1a1a",
    agentType:'',
    notificationEmail:null
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
        }
        ChatBots()
    }, [userId])

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
    /* if (credits === 0) { alert('No credits left! Please upgrade.'); return }*/

    setLoading(true)
    try {
      const currentUser = auth.currentUser
      if (!currentUser) { alert("Please login first"); setLoading(false); return }

      if(!formData.logo){
alert('Logo is required')
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
      setFormData({ name: "", systemPrompt: "", website: "", logo: null, pdfs: [],color:"#000"})
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
      if(file.naturalWidth > 50 && file.naturalHeight > 50) {alert('The uploaded images heigher than 50px width and height'); e.target.value=""; return}
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
      const fullLink = `${FRONTEND_URL}/chat/${share_token}`
      await navigator.clipboard.writeText(fullLink);
      alert('link copied')
    } catch (error) {
      console.log(error)
    }
  }

  const data_limit = () => {

 const pdf_content = document.getElementById("pdfs")

    if(website){
      document.getElementById("pdfs").disabled = true;
    }

    if(pdf_content){
      document.getElementById("web").disabled = true;
    }

   
  }


  return (
    <>
      <div className={styles.Dashboard_container}>
        <NavBar Credit={credits} />
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
        />
      </div>


    {builder && (
  <div className={styles.chat_bot_builder_wrapper} onClick={() => setBuilder(false)}>
    <div className={styles.chat_bot_builder_card} onClick={e => e.stopPropagation()}>
      <div className={styles.chat_bot_builder_appearance}>

        {/* Header */}
        <div className={styles.builder_header_text}>
          <h3>Let's start building</h3>
          <span>Set up your AI agent — train it on your content and share it anywhere.</span>
        </div>

        <form onSubmit={handleCreateChatbot}>
          <div className={styles.appearance_inputs}>

            {/* Logo + Name side by side */}
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

            {/* Website URL */}
            <div className={styles.field_group}>
              <label>Website URL</label>
              <div className={styles.url_input_row}>
              
                <input
                                disabled={formData.pdfs.length > 0}
                id="web"
                  type="text"
                  className={styles.url_domain_input}
                  placeholder="yourdomain.com"
                  value={formData.website.replace(/^https?:\/\//, '')}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            {/* Use-case + Colour in a row */}
            <div className={styles.field_row}>
              <div className={styles.field_group} style={{ marginBottom: 0 }}>
                <label htmlFor="usecase">Use-case</label>
                <select id="usecase" value={formData.agentType} className={styles.usecase_select} onChange={e => setFormData({...formData,agentType : e.target.value})}>
                  <option value='Info'>Info AI agent</option>
                  <option value='sales'>Sales assistant</option>
                </select>
              </div>

              {/* Notification email - show only for sales agents */}
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

              <div className={styles.field_group} style={{ marginBottom: 0 }}>
                <label>Brand colour</label>
                <div className={styles.color_row}>
                  <input
                    type="color"
                    id="color"
                    className={styles.color_swatch_input}
                    defaultValue="#1111"
                     value={formData.color}
  onChange={(e) => {
    setFormData({ ...formData, color: e.target.value })
  }}
                  />
                  <span className={styles.color_label_display} id="colorLabel">{formData.color}</span>
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div style={{ height: 20 }} />

            <div className={styles.builder_section_label}>Knowledge</div>

            {/* PDFs */}
            <div className={styles.field_group}>
              <label htmlFor="pdfs">Upload PDFs</label>
              <input
                type="file"
                id="pdfs"
                accept=".pdf,application/pdf"
                multiple
                onChange={handlePDFChange}
                disabled={formData.website}
              />
            </div>

            {/* System prompt */}
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
 The agent will email you about new orders or requests. Ensure the prompt instructs them</small>

          </div>{/* /appearance_inputs */}

         
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
