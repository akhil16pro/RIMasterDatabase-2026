import { motion } from "motion/react"
import parse from "html-react-parser"
import { useMemo } from "react"

export default function SectionSubtitle({ title, description, topDescription }: { title?: string, description?: string[], topDescription?: string }) {

    const convertPTagsToDiv = (html: string): string[] => {
        if (!html) return []
        // Convert opening <p> tags (with or without attributes) to <div>
        let converted = html.replace(/<p\s*([^>]*)>/gi, '<div$1>')
        // Convert closing </p> tags to </div>
        converted = converted.replace(/<\/p>/gi, '</div>')
        // Convert self-closing <p /> tags to <div />
        converted = converted.replace(/<p\s*([^>]*)\s*\/>/gi, '<div$1 />')
        
        // Parse HTML and extract individual div elements
        const parser = new DOMParser()
        const doc = parser.parseFromString(converted, 'text/html')
        const divs = Array.from(doc.body.children)
        
        // Return array of HTML strings for each div element
        return divs.map(div => div.outerHTML)
    }
    
    const titleContent = useMemo(()=> {
        const html = title
        if (!html) return []
        return convertPTagsToDiv(html)
    }, [title])

    const descriptionContent = useMemo(()=> {
        const html = description
        if (!html) return []
        return convertPTagsToDiv(html)
    }, [description])

    const topDescriptionContent = useMemo(()=> {
        const html = topDescription
        if (!html) return []
        return convertPTagsToDiv(html)
    }, [topDescription])

  return (
    <section className="relative block w-full max-w-4xl mx-auto text-center">

        {
            topDescriptionContent ? 
            <div className="w-full text-center mt-8 block relative text-content-area">
                {topDescriptionContent.map((html, index) => (
                <motion.div 
                initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                transition={{ duration: 1, delay: 0.7}}
                viewport={{ once: true, amount: 0.1 }}
                className="block w-full text-lg font-regular mb-8 text-text/80 text-center" key={index}>
                    <div className="relative w-full text-center text-2xl opacity-90" dangerouslySetInnerHTML={{ __html: html }} />
                </motion.div>
                ))}
            </div>
            :
            null
        }

        {
            title ? 
            <motion.h2 
            initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
            whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
            transition={{ duration: 1, delay: 0.6}}
            viewport={{ once: true, amount: 0.1 }}
            className="text-4xl leading-[130%] font-bold bg-linear-to-r from-[#FFFFFF] to-[#03CBFF] bg-clip-text text-transparent inline-block relative text-center">
                {parse(title)}
            </motion.h2>
            :
            null
        }
        {
            description ? 
            <div className="w-full text-center mt-8 block relative text-content-area">
                {descriptionContent.map((html, index) => (
                <motion.div 
                initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                transition={{ duration: 1, delay: 0.7}}
                viewport={{ once: true, amount: 0.1 }}
                className="block w-full text-lg font-regular mb-8 text-text/80" key={index}>
                    <div className="relative w-full text-center text-xl opacity-90" dangerouslySetInnerHTML={{ __html: html }} />
                </motion.div>
                ))}
            </div>
            :
            null
        }
    </section>
  )
}
 