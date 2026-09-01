import { useState, useEffect } from "react";
import styles from "../styles/nav.module.css";
import { Telescope, PanelLeftClose, House, BookMarked, Settings, CircleUser, TextAlignStart } from "lucide-react";
import { useAuth } from "./authcontext";
import {useNavigate} from "react-router-dom"
import { supabase } from "./supabaseConfig";
import comet_normal from "../assets/comet_normal.png"

export function Top_nav({ sidebar_active, setSidebar_active }) {
  const { user } = useAuth();

  const get_initals = (name) => {
    return name?.[0]?.toUpperCase() || "";
  };

  const navigate = useNavigate()

  return (
    <div className={styles.top_nav_wrapper}>
      <div className={styles.left_side}>
        <button type="button" onClick={() => setSidebar_active(true)}><TextAlignStart size={20} /></button>
        <div className={styles.User_overview}>
          <h3><img src={comet_normal} width={40} height={40}/> {user?.displayName || user?.email}</h3>
        </div>
      </div>
      <div className={styles.right_side}>
        <div className={styles.user_icon} onClick={() => navigate('/user')}>
          {get_initals(user?.email)}
        </div>
      </div>
    </div>
  );
}

export function Nav({ sidebar_active, setSidebar_active }) {

    const navigate = useNavigate()

  const sidebarClassName = sidebar_active
    ? styles.sidebar_active
    : styles.sidebar_disabled;

  const { user, loading } = useAuth();
  const [history, setHistory] = useState([]);
  const [lessons,setLessons] = useState([])
  const [lessons_loading, setLessons_loading] = useState(false)

  useEffect(() => {
    if (!user) return;

    const check = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          setHistory([]);
          return;
        }

        setHistory(data || []);
      } catch (e) {
        setHistory([]);
      }
    };

    check();
  }, [user]);

const open_course = async (course_id) => {
    if (lessons_loading) return;

    try {
      setLessons_loading(true)

      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", course_id)
        .order("order_index", { ascending: true });

      if (error) {
        console.error(error)
        setLessons_loading(false)
        return;
      }

      if (!data || data.length === 0) {
        setLessons_loading(false)
        return;
      }

      setLessons(data)
      setLessons_loading(false)
      navigate(`/lesson/${course_id}`)

    } catch (e) {
      setLessons_loading(false)
    }
  }

  if (loading) return null;

  return (
    <div className={sidebarClassName} onMouseEnter={() => setSidebar_active(true)} onMouseLeave={() => setSidebar_active(false)}>
      <div className={sidebar_active ? styles.logo_active : styles.logo_disabled}>
        {sidebar_active && <h3>Lunaar</h3>}
        {sidebar_active && <button type="button" onClick={() => setSidebar_active(false)}><PanelLeftClose size={18} /></button>}
      </div>

      <ul className={sidebar_active ? styles.link_full : styles.link_icon}>
        <li className={sidebar_active ? styles.link_full_li : styles.link_icon_li} onClick={() => navigate('/Dashboard')}><House size={22} strokeWidth={1.8} color="#313030"/>{sidebar_active && <h4>Home</h4>}</li>
        <li className={sidebar_active ? styles.link_full_li : styles.link_icon_li} onClick={() => navigate('/user')}><CircleUser size={22} strokeWidth={1.8} color="#313030"/>{sidebar_active && <h4>User profile</h4>}</li>
        <li className={sidebar_active ? styles.link_full_li : styles.link_icon_li} onClick={() => navigate('/courses')}><BookMarked size={22} strokeWidth={1.8} color="#313030"/>{sidebar_active && <h4>Saved Courses</h4>}</li>
      </ul>

        <h4 className={styles.history_title}>History</h4>

      <div className={styles.history}>
        {history.map((item, idx) => (
          <div key={item.id ?? idx} className={styles.history_card} onClick={() => open_course(item.id)}>
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}