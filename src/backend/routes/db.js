import express from 'express'
import supabase from '../utlis/supabaseConfig.js';

const router = express.Router();

router.get('/query_courses/:user_id', async (req , res ) => {

    const { user_id } = req.params;
    console.log('user',user_id)

     try{

      const {data,error} = await supabase
      .from("courses")
      .select("*")
      .eq("user_id",user_id)
      .order("created_at", { ascending: false })

      if(error){
        return res.status(404).json({ message: error.message });
      }

      if(!data || data.length === 0){
        return res.json({message:'NO COURSES CREATED :('})
      }

      return res.json(data)

     }catch(error){
        console.error(error)
        return res.status(500).json({ message: 'Server error' })
     }

})

router.get('/query_lessons/:course_id', async (req , res ) => {

    const { course_id } = req.params;

     try{

      const {data,error} = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id",course_id)
      .order("lesson_order", { ascending: true })

      if(error){
        return res.status(404).json({ message: error.message });
      }

      if(!data || data.length === 0){
        return res.json({message:'NO LESSONS FOUND :('})
      }

      return res.json(data)

     }catch(error){
        console.error(error)
        return res.status(500).json({ message: 'Server error' })
     }

})

router.post('/create_lesson', async (req , res ) => {

    const { course_id, lessons } = req.body;

    if(!course_id){
      return res.status(400).json({ message: 'course_id is required' })
    }

    if(!lessons || !Array.isArray(lessons) || lessons.length === 0){
      return res.status(400).json({ message: 'lessons must be a non-empty array' })
    }

     try{

      const rows = lessons.map((lesson, idx) => ({
        course_id,
        title: lesson.title,
        content: lesson.content,
        lesson_order: idx
      }))

      const {data,error} = await supabase
      .from("lessons")
      .insert(rows)
      .select()

      if(error){
        return res.status(400).json({ message: error.message });
      }

      return res.json(data)

     }catch(error){
        console.error(error)
        return res.status(500).json({ message: 'Server error' })
     }

})

export default router