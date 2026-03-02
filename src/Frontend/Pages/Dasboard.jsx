import React, { useState,useEffect } from 'react'
import { NavBar } from '../Components/NavBar'
import styles from '../Styles/Dashboard.module.css'
import { supabase } from '../config/supabaseClient.js'
import { auth } from '../config/Firebase.js'
import {Trash2,SendHorizontal,Search} from "lucide-react"
import { Link } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import No_projects from "../assets/No_projects.png"

export function Dashboard({ onclose }) {

  const navigate = useNavigate();
  const [builder, setBuilder] = useState(false)
  const [link,setLink] = useState(null)
  const [search,setSearch] = useState("")
  const [credits,setCredits] = useState(null)
  const [paywall,setPayWall] = useState(false)
  const [userId, setUserId] = useState(null)
  const [plan,setPlan] = useState(null)
  const [message_count,setMessageCount] = useState(null)
  const [MessageLimit,setMessageLimit] = useState(null)
  const [upgrade_hidden,setUpgradeHidden] = useState(false)

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


const Plan_call = async() => {
    const user = auth.currentUser;

  if(!userId) return

try{
    const response = await fetch(`${BACKEND_URL}/api/credits/${userId}`);
    const data = await response.json();

    if (data.plan !== undefined) {
  setPlan(data.plan)
    }
  }

  catch(err){
console.log('error in finding plan')
  }}



useEffect(() => {
  if (!userId) return;
  Plan_call();
}, [userId]);

  
  const [formData, setFormData] = useState({
    name: '',
    systemPrompt: '',
    website: '',
    logo: null,
    pdfs: []
  })

  const [loading, setLoading] = useState(false)
  const [projects,setProjects] = useState([])

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://localhost:5000"
    const FRONTEND_URL = "https://alexa-mighty.vercel.app"

const fetchProjects = async () => {

  if (!userId) return;

  const { data, error } = await supabase
    .from("chatbots")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .ilike("name", `%${search}%`);

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

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

    if (data.credits !== undefined) {
      setCredits(data.credits);
    }

    if(data.plan !== undefined){
      setPlan(data.plan)
    }

    if(data.message_count !== undefined){
      setMessageCount(data.message_count)
    }

    if(data.limit !== undefined){
      setMessageLimit(data.limit)
    }

    if(data.plan ==="premium"){
      setUpgradeHidden(true)
    }

  };

  fetchCredits();
}, [userId]);


  function generateShareToken() {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
  }

  // Upload file to Supabase Storage
  const uploadFile = async (file, bucket, folder = '') => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      console.log(`Uploading ${file.name} to ${bucket}/${filePath}`)

      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      console.log(`File uploaded successfully: ${publicUrl}`)
      return publicUrl

    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

const handleCreateChatbot = async (e) => {
  e.preventDefault()

   if (credits === null) {
    alert('Loading credits, please wait...')
    return
  }

  if (credits === 0) {
    alert('No credits left! Please upgrade.')
    return
  }


  setLoading(true)

   
  try {
    const currentUser = auth.currentUser

  
    if (!currentUser) {
      alert("Please login first")
      setLoading(false)
      return
    }

    // Prepare form data (IMPORTANT: use FormData for files)
    const formPayload = new FormData()

    formPayload.append("userId", currentUser.uid)
    formPayload.append("name", formData.name)
    formPayload.append("systemPrompt", formData.systemPrompt)
    formPayload.append("website", formData.website)

    if (formData.logo) {
      formPayload.append("logo", formData.logo)
    }

    formData.pdfs.forEach((pdf) => {
      formPayload.append("pdfs", pdf)
    })

    const response = await fetch(
      `${BACKEND_URL}/api/create`,
      {
        method: "POST",
        body: formPayload
      }
    )

    

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Failed to create chatbot")
    }

    alert("Chatbot created successfully!")
    await fetchProjects()  
    setBuilder(false)
    // Reset form
    setFormData({
      name: "",
      systemPrompt: "",
      website: "",
      logo: null,
      pdfs: []
    })

    document.getElementById("logo").value = ""
    document.getElementById("pdfs").value = ""

    setBuilder(false)

  } catch (error) {
    console.error("Error:", error)
    alert(error.message)
  } finally {
    setLoading(false)
  }
}

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        e.target.value = ''
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo must be less than 5MB')
        e.target.value = ''
        return
      }
      console.log('Logo selected:', file.name)
      setFormData({ ...formData, logo: file })
    }
  }

  // Handle PDF files selection
  const handlePDFChange = (e) => {
    const files = Array.from(e.target.files)
    
    // Validate all files are PDFs
    const invalidFiles = files.filter(file => file.type !== 'application/pdf')
    if (invalidFiles.length > 0) {
      alert('Please upload only PDF files')
      e.target.value = ''
      return
    }

    // Validate total size (max 50MB)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > 50 * 1024 * 1024) {
      alert('Total PDF size must be less than 50MB')
      e.target.value = ''
      return
    }

    console.log(`${files.length} PDF(s) selected`)
    setFormData({ ...formData, pdfs: files })
  }





const delete_project = async (id) => {

   try{
  const currentUser = auth.currentUser;

 const res = await fetch(`${BACKEND_URL}/api/chat/${id}`, {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId: currentUser.uid })
})

   if (!res.ok) {
      throw new Error("Delete failed")
    }

await fetchProjects()
    
  }catch(error){
    alert('error in deleting')
  }

 }

  const CopyLink = async (share_token) => {
try{
    const fullLink = `${FRONTEND_URL}/chat/${share_token}`
        await navigator.clipboard.writeText(fullLink);
alert('link copied')

} catch(error){
  console.log(error)
}
  }


useEffect(() => {
  if (window.Paddle) {
    window.Paddle.Environment.set("sandbox");
    window.Paddle.Initialize({
      token: import.meta.env.VITE_PADDLE_VENDOR_ID,
    });
  }
}, []);

  const handleUpgrade = () => {
    window.Paddle.Checkout.open({
      items: [
        {
          priceId: "pri_01kjj24vjf35673q2xg6324eag", 
          quantity: 1,
        },
      ],
           customer: {
    email: auth.currentUser?.email,
  },
    });
  };


  return (
    <>
      <div className={styles.Dashboard_container}>
        <NavBar Credit={credits}/>
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
  handleUpgrade={handleUpgrade}
  limit={MessageLimit}
  upgrade_hidden={upgrade_hidden}
  No_projects={No_projects}
  user={currentUser}
/> </div>




  {paywall && (

  <div className={styles.paywall_wrapper}>


  </div>


  )}















      {builder && (

        <div className={styles.chat_bot_builder_wrapper} onClick={onclose}>
          <div
            className={styles.chat_bot_builder_card}
            onClick={(e) => e.stopPropagation()}
          >

            <div className={styles.chat_bot_builder_appearance}>
              <h3>Let's Start</h3>
              <span>
                Start building your chatbot without any coding
              </span>

              <form onSubmit={handleCreateChatbot}>

             <div className={styles.appearance_inputs}>

                <label htmlFor='logo'>Logo</label>
                <input
                  type='file'
                  id='logo'
                  accept='image/*'
                  onChange={handleLogoChange}
                  required
                />
                {formData.logo && (
                  <small style={{ color: 'green' }}>✓ {formData.logo.name}</small>
                )}
                <br />

               
 <label htmlFor='name'>Name*</label>
                <input
                  type='text'
                  id='name'
                  placeholder='Enter a name for chatbot'
                  value={formData.name}
                  maxLength={12}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <br />


                <label htmlFor='systemPrompt'>System prompt*</label>
                <textarea
                  id='systemPrompt'
                  placeholder='Enter the prompt which the AI will follow'
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  required
                  rows={4}
                  style={{ width: '100%', resize: 'vertical', padding: '10px' }}
                />
                <br />

    

              <label htmlFor='pdfs'>PDFs*</label>
                <input
                  type='file'
                  id='pdfs'
                  accept='.pdf,application/pdf'
                  multiple
                  onChange={handlePDFChange}
                />
                </div>
                {formData.pdfs.length > 0 && (
                  <small style={{ color: 'green' }}>
                    ✓ {formData.pdfs.length} file(s) selected
                  </small>
                )}
                <br />

                <div className={styles.chat_bot_builder_btn_wrapper}>
                  <button
                    className={styles.createe_btn}
                    type='submit'
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    className={styles.cancel_btn}
                    type='button'
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


  function Projects({
     search,
  setSearch,
  projects,
  styles,
  setBuilder,
  delete_project,
  CopyLink,
 credits,
 plan,
 message_count,
 handleUpgrade,
 limit,
 upgrade_hidden,
 No_projects,
 user
  })

  {
  
    
    return (
      <div className={styles.Projects_container}>
        <div className={styles.New_Project_section}>

        <div className={styles.User_greeting}>
          <h2>Howdy,{user?.displayName}</h2>
          </div>
          <div className={styles.Project_search_wrapper}>
          <input
            type='text'
            placeholder='Search for chatbot'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
                    <button className={styles.how_btnn}>?</button>

          <button className={styles.create_btn} onClick={() => setBuilder(true)}>+</button>
        </div>

        </div>



<div className={styles.Main_content_wrapper}>

 <div className={styles.Left_side_section}>

 <div className={styles.left_side_section_head}>

 <h3>Usage</h3>

 </div>

 <div className={styles.left_side_head_main}>

 <ul>
 <li><span>Credits</span> <h4>{credits}</h4></li>
    <li><span>Messages</span> <h4>{message_count}</h4></li>
      <li><span>Plan</span> <h4>{plan}</h4></li>
    <li className={styles.upgrade_hidden}><span>Limit</span> <h4>{limit}</h4></li>
</ul>
 <div className={styles.main_content_btn_wrapper}>

 <button className={styles.pricing_btn}>Pricing</button>

 </div>


 </div>


 </div>

<div className={styles.existing_projects_section}>

{projects.length === 0 ? (
  <div className={styles.no_project_wrapper}>
  <p>No project yet</p>
  </div>
) : (

 projects.map((project) => (
  <div className={styles.project_card} key={project.id}>
      <div className={styles.project_card_head}>
<div className={styles.left_side_head}>
      <img src={project.logo_url} alt={project.name} style={{width: '50px', height: '50px'}} />
    <div className={styles.chat_link_div}>
     <h3>{project.name || 'Unnamed Project'}</h3> 
<Link to={`/chat/${project.share_token}`}>
  Open Chat
</Link>
</div>
</div>
     <div className={styles.head_right_side}><button><SendHorizontal
  size={16}
  onClick={() => CopyLink(project.share_token)}
/>
</button></div>
     
     </div>
    <div className={styles.project_card_context}>
    <p>{project.system_prompt?.substring(0, 100)}...</p>
    <small>Created: {new Date(project.created_at).toLocaleDateString()}</small>
    <div className={styles.delete_btn}><button onClick={() => delete_project(project.id)}><Trash2 color='#fff' size={14}/></button></div>
  </div></div>
))


)}


</div>
        
  </div>
      </div>
    )
  }

}
