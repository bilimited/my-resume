import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Resume, ResumeItem } from '@/types/resume'
import MarkdownParser from '@/markdownparser'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useResumeStore = defineStore('resume', ()=>{

  const resume = ref<Resume>({
    header:{
      author:"",
      avatar:"...",
      custom:{
        "姓名":"aaa",
      }
    },
    context:[
    ],
    meta:{
      theme:"...",

    }
  });

  const resume_src = computed(()=> MarkdownParser.unparse(resume.value));

  function change_src(src:string) {
    resume.value.context = MarkdownParser.parse(src)
  }

  return {resume,resume_src,change_src}

})

export const useResumeSrcStore = defineStore('resumesrc', ()=>{

  const resumesrc = ref("")

  const resume_context = computed(()=>MarkdownParser.parse(resumesrc.value))

  function alter_context(altered_item:ResumeItem){
    console.log(altered_item);

  }

  return {resumesrc,resume_context,alter_context}

})
