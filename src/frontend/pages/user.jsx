
import {useState,useEffect} from "react"
import styles from "../styles/user.module.css"
import { Top_nav,} from "../compoents/nav"
import { Nav } from "../compoents/nav"
import { useAuth } from "../compoents/authcontext"
import { GraduationCap, MoveRight,CodeXml,Languages,LibraryBig } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../compoents/supabaseConfig"

function Main_content(){

const {user,loading} = useAuth()
    const [courses, setCourses] = useState([])
    const [progressMap, setProgressMap] = useState({})
    const [sidebar_active,setSidebar_active] = useState(false)
    const navigate = useNavigate()
    const [user_detail,setUser_detail] = useState(null)

    useEffect(() => {

        if(!user) return

        const check = async() => {

            const {data,error} = await supabase
            .from("profiles")
            .select("*")
            .eq("id",user?.id)

            if(error) console.log(error);
            if(data && data.length > 0) {
                setUser_detail(data[0])
            }


        }

       check()

    },[user])

    useEffect(() => {

        if (!user) return;

        const check_lessons = async () => {

            const res = await fetch(`http://localhost:5000/db/query_courses/${user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            const data = await res.json()
            setCourses(data.courses || data)
        }

        check_lessons()

    }, [user])

    useEffect(() => {

        if (!user || courses.length === 0) return;

        const fetchProgress = async () => {

            const { data, error } = await supabase
                .from("user_progress")
                .select('lesson_id, course_id')
                .eq('user_id', user.id);

            if (error) {
                console.error(error);
                return;
            }

            const counts = {};
            data.forEach(row => {
                counts[row.course_id] = (counts[row.course_id] || 0) + 1;
            });

            setProgressMap(counts);
        }

        fetchProgress()

    }, [user, courses])

    function getCategoryColor(category) {
        const colors = {
            study: "#f5981e",
            code: "#8b5cf6",
            skill: "#22c55e",
            language: "#ef4444",
        };
        return colors[category] || "#141414";
    }

    function getIcon(category) {
        const Icons = {
            study: <GraduationCap size={18} color="#1b1a1a"/>,
            code:<CodeXml size={18} color="#1b1a1a"/>,
            language:<Languages size={18} color="#1b1a1a"/>,
            skills:<LibraryBig size={18} color="#1b1a1a"/>
        };
        return Icons[category] || < LibraryBig size={18} color="#1b1a1a" />
    }
  const get_initals = (name) => {
    return name?.[0]?.toUpperCase() || "";
  };

   const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error);
    return;
  }
  navigate('/auth');
};


return(
    <div className={styles.Main_content_wrapper}>
    <Top_nav sidebar_active={sidebar_active} setSidebar_active={setSidebar_active}/>
    <div className={styles.User_content}>
    
    <div className={styles.User_icon}>
<div className={styles.User_img}> <h3>{get_initals(user?.email)}</h3>
    </div>
     <div className={styles.greetings}><h2>Hello,{user?.email}</h2><span>wanna log out? <button onClick={logout} style={{background:'transparent',border:'none',cursor:'pointer'}}>CLICK ME</button></span></div>
    </div>

        <h2 className={styles.Insights_h2}>Insights</h2>

    <div className={styles.Insights}>
        <div className={styles.stats_card}>
            <div className={styles.card}>
                <span>Total Lessons</span>
                <h3>{courses.length}</h3>
            </div>
            <div className={styles.card}>
                <span>Current Streak</span>
                <h3>{user_detail?.current_streak}</h3>
            </div>
            <div className={styles.card}>
                <span>Longest Streak</span>
                <h3>{user_detail?.longest_streak}</h3>
            </div>
            <div className={styles.card}>
                <span>Remark</span>
               {user_detail?.current_streak > user_detail?.longest_streak ? <h3>New record!!</h3> : <h3>Keep going!!</h3>}
            </div>
        </div>

        <div className={styles.lessons}>
            <h2>Courses</h2>
             <div className={styles.courses_cards}>
                                {courses.map((c, i) => {
            
                                    const completedCount = progressMap[c.id] || 0;
            
                                    return (
                                        <div
                                            key={i}
                                            className={styles.course_card}
                                            style={{
                                                background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 50%), ${getCategoryColor(c.category)}`
                                            }}
                                        >
                                            <div className={styles.course_head}>
                                                <div className={styles.course_icon}>
                                                    <div className={styles.icon_wrapper}>
                                                        {getIcon(c.category)}
                                                    </div>
                                                    <button type="button" onClick={() => navigate(`/lesson/${c.id}`)}>
                                                        <MoveRight size={18} />
                                                    </button>
                                                </div>
                                               <div className={styles.progress}>
                <h3>{c.title}</h3>
                <div className={styles.progress_bar_track}>
                    <div 
                        className={styles.progress_bar_fill} 
                        style={{ width: `${c.total_lessons ? (completedCount / c.total_lessons) * 100 : 0}%` }}
                    />
                </div>
                <div className={styles.stats}>
                <h3>Progress</h3><span>{completedCount}/{c.total_lessons}</span>
                </div>
            </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
        </div>
    </div>

    </div>
    </div>
)

}

export function User(){

    const [sidebar_active,setSidebar_active] = useState(false)

return(
    <div className={styles.user_wrapper}>
    <Nav sidebar_active={sidebar_active} setSidebar_active={setSidebar_active}/><Main_content/>
    </div>
)

}