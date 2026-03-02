import { useTranslation } from "react-i18next"
import { motion } from "motion/react"
import { Map, MapControls } from "@/components/ui/map";

export default function ChapterMapBox({data}: {data: any}) {

    const {i18n} = useTranslation()

    return (
        <section className="relative  w-full flex flex-col items-center justify-center">
            <div className="container mx-auto md:px-0 px-5">
                <motion.div 
                    initial={{ opacity: 0, y: 70, scaleY: 1.1 }}
                    whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: 70, scaleY: 1.1 }}
                    transition={{ duration: 1, delay: 0.7}}
                    viewport={{ once: true, amount: 0.1 }}
                    className="block w-full text-lg font-regular mb-8 text-center" >
                        <p className="relative w-full text-center text-2xl font-secondary max-w-4xl mx-auto" >
                            {i18n.language === 'en' ? <span>The following section presents an overview of selected countries and their national initiatives in this domain. <strong>Examples of Global Intelligent Lawmaking Practices</strong></span> : <span>نظرة عامة إلى مجموعة مختارة من الدول ومبادراتها الوطنية في هذا المجال</span>}
                        </p>
                </motion.div>
            </div>
            <div className="w-full block w-full h-150 max-w-[90%] mx-auto">
                <Map theme="dark" zoom={0}>
                    <MapControls showCompass={false} showZoom={false} showLocate={false} showFullscreen={false} className="w-full h-full"/>
                </Map>
            </div>
        </section>  
    )
}
