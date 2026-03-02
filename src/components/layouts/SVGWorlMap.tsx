
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SVGWorlMap({ data }: { data: any }) {

    const [hovered, setHovered] = useState(null)
    const {i18n} = useTranslation()

    return (
        <section className="relative w-full pb-24 hidden md:flex items-center justify-center flex-col gap-8">
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
            <div className="w-full relative px-15">
                <div className="relative w-full h-full">
                    <img src="/svg-map.svg" alt="World Map" className={`w-full h-full object-cover ${hovered !== null && "blur-[3px]"}`} />

                    <div className="svg_markers ">
                        {Array.isArray(data.countries) && data.countries.map((country: any, idx: number) => {

                            return (
                                <>
                                    <motion.div
                                        onHoverStart={() => setHovered(idx)}
                                        onTap={() => setHovered((prev) => prev === idx ? null : idx)}
                                        // onBlur={() => setHovered(null)}
                                        onHoverEnd={() => setHovered(null)}
                                        className={`svg_marker`}
                                        key={idx}
                                    >
                                        <button type="button" className="marker-btn">
                                            <span className="marker">
                                                <svg width="34" height="14" viewBox="0 0 42 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M40.9016 16.3805L1.08136 16.4531C0.121074 16.4549 -0.361327 15.5635 0.316871 15.0405L18.9992 0.626147C20.0773 -0.205868 21.8444 -0.20909 22.9256 0.618987L41.6609 14.9651C42.341 15.4857 41.8619 16.3788 40.9016 16.3805Z" fill={`url(#paint0_linear_984_1215_${idx})`} />
                                                    <defs>
                                                        <linearGradient id={`paint0_linear_984_1215_${idx}`} x1="25.8751" y1="0.54729" x2="25.904" y2="16.4078" gradientUnits="userSpaceOnUse">
                                                            {hovered === idx ?
                                                                <>
                                                                    <stop offset="0%" stopColor="#7EC9FF" />
                                                                    <stop offset="50%" stopColor="#03CBFF" />
                                                                    <stop offset="100%" stopColor="#03CBFF" />
                                                                </>
                                                                :
                                                                <>
                                                                    <stop stopColor="#F07067" />
                                                                    <stop offset="1" stopColor="white" />
                                                                </>
                                                            }
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </span>
                                        </button>
                                        <span className="text-center text-xl font-semibold bg-gradient-to-r from-[#FFFFFF] to-[#F07067] bg-clip-text text-transparent">{country?.title}</span>
                                        <AnimatePresence>
                                            {hovered === idx && (
                                                <motion.div
                                                    className="ms-4 text-left content absolute p-4 leading-relaxed top-1/2 left-0 right-0 -translate-x-1/4 rtl:translate-x-1/4 lg:-translate-x-1/2 bg-primary shadow-2xl border border-border/10 rounded-xl"
                                                    initial={{
                                                        height: 0,
                                                        opacity: 0,
                                                        y: -30
                                                    }}
                                                    animate={{
                                                        height: "auto",
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                        opacity: 0,
                                                        y: -20
                                                    }}
                                                    transition={{
                                                        height: {
                                                            duration: 0.35,
                                                            ease: "easeInOut"
                                                        },
                                                        y: {
                                                            type: "spring",
                                                            stiffness: 260,
                                                            damping: 22
                                                        },
                                                        opacity: {
                                                            duration: 0.2
                                                        }
                                                    }}

                                                >
                                                    <div className="flex w-full items-center gap-2 justify-start mb-3">
                                                        <img src={country?.country_image} alt={country?.title} className="w-10" />
                                                        <h2 className="text-2xl font-bold">{country?.title}</h2>
                                                    </div>

                                                    <span
                                                        className="text-base font-secondary text-start"
                                                        dangerouslySetInnerHTML={{ __html: country?.description }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </>
                            )
                        })}


                    </div>

                    {/* <div className="svg_markers" style={{ zIndex: 1 }}>
                        {Array.isArray(data.countries) && data.countries.map((item, index) => (
                            <div className="country text-right text-3xl font-semibold text-secondary" key={index + '-country'}>
                                {item.title}
                            </div>
                        ))}
                    </div> */}
                </div>

            </div>
        </section >
    )
}
