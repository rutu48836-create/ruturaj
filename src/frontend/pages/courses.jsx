import { useAuth } from "../compoents/authcontext";
import { supabase } from "../compoents/supabaseConfig";
import styles from "../styles/courses.module.css"
import { Nav, Top_nav } from "../compoents/nav";
import { useState, useEffect } from "react";
import { GraduationCap, MoveRight,CodeXml,Languages,LibraryBig } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Courses(){

    const { user, loading } = useAuth()

    const [sidebar_active, setSidebar_active] = useState(false)
    const [courses, setCourses] = useState([])
    const [progressMap, setProgressMap] = useState({})
    const navigate = useNavigate()

    useEffect(() => {

        if (!user) return;

        const check_lessons = async () => {

            const res = await fetch(`${import.meta.env.VITE_BACKEND_KEY}/db/query_courses/${user.id}`, {
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

    return (
        <div className={styles.home_container}>
            <Nav sidebar_active={sidebar_active} setSidebar_active={setSidebar_active} />

            <div className={styles.main_content}>
                <Top_nav sidebar_active={sidebar_active} setSidebar_active={setSidebar_active} />

                <div className={styles.courses_header}>
                    <h2>Your Courses</h2> <button type="button">New Course</button>
                </div>

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

                <div className={styles.new_lesson_btn}>
                    <button type="button" onClick={() => navigate('/dashboard')}>New Course</button>
                </div>
            </div>

        </div>
    )

}