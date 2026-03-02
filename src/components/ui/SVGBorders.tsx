import { motion } from "motion/react";

export default function SVGBorders({ delay }: { delay?: number }){
    return (
      <motion.div 
      initial={{ scaleX: 0.85}}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0.85 }}
      transition={{ duration: 0.8, delay: delay ? delay : 0.4}}
      className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
            initial={{ strokeDasharray: '80px', strokeDashoffset: '80px' }}
            whileInView={{ strokeDasharray: '80px', strokeDashoffset: '0px' }}
            exit={{ strokeDasharray: '80px', strokeDashoffset: '80px' }}
            transition={{ duration: 1, type: 'tween', delay: delay ? delay : 0.5}}
            viewport={{ once: true, amount: 0.1 }}
            d="M41.5 1.5H8.5C4.63401 1.5 1.5 4.63401 1.5 8.5V41.5" stroke="url(#paint0_linear_2467_1111)" strokeWidth="3"/>
            <defs>
            <linearGradient id="paint0_linear_2467_1111" x1="40.1448" y1="26.1809" x2="1.5" y2="26.1809" gradientUnits="userSpaceOnUse">
            <stop stopColor="#03CBFF"/>
            <stop offset="1" stopColor="white"/>
            </linearGradient>
            </defs>
          </svg>
  
        </div>
  
        <div className="absolute top-0 right-0">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
          initial={{ strokeDasharray: '80px', strokeDashoffset: '80px' }}
          whileInView={{ strokeDasharray: '80px', strokeDashoffset: '0px' }}
          exit={{ strokeDasharray: '80px', strokeDashoffset: '80px' }}
          transition={{ duration: 1, type: 'tween', delay: delay ? (delay + 0.2) : 0.7}}
          viewport={{ once: true, amount: 0.1 }}
          d="M40 41.5L40 8.5C40 4.63401 36.866 1.5 33 1.5L1.43051e-06 1.5" stroke="url(#paint0_linear_2467_1114)" strokeWidth="3"/>
          <defs>
          <linearGradient id="paint0_linear_2467_1114" x1="15.3191" y1="40.1448" x2="15.3191" y2="1.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#03CBFF"/>
          <stop offset="1" stopColor="white"/>
          </linearGradient>
          </defs>
          </svg>
        </div>
  
        <div className="absolute bottom-0 left-0">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
          initial={{ strokeDasharray: '80px', strokeDashoffset: '80px' }}
          whileInView={{ strokeDasharray: '80px', strokeDashoffset: '0px' }}
          exit={{ strokeDasharray: '80px', strokeDashoffset: '80px' }}
          transition={{ duration: 1, type: 'tween', delay: delay ? (delay + 0.4) : 0.5}}
          viewport={{ once: true, amount: 0.1 }}
          d="M1.5 1.43051e-06L1.5 33C1.5 36.866 4.63401 40 8.5 40L41.5 40" stroke="url(#paint0_linear_2467_1115)" strokeWidth="3"/>
          <defs>
          <linearGradient id="paint0_linear_2467_1115" x1="26.1809" y1="1.35524" x2="26.1809" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#03CBFF"/>
          <stop offset="1" stopColor="white"/>
          </linearGradient>
          </defs>
          </svg>
  
        </div>
  
        <div className="absolute bottom-0 right-0">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
          initial={{ strokeDasharray: '80px', strokeDashoffset: '80px' }}
          whileInView={{ strokeDasharray: '80px', strokeDashoffset: '0px' }}
          exit={{ strokeDasharray: '80px', strokeDashoffset: '80px' }}
          transition={{ duration: 1, type: 'tween', delay: delay ? (delay + 0.6) : 0.7}}
          viewport={{ once: true, amount: 0.1 }}
          d="M1.43051e-06 40L33 40C36.866 40 40 36.866 40 33L40 1.43051e-06" stroke="url(#paint0_linear_2467_1113)" strokeWidth="3"/>
          <defs>
          <linearGradient id="paint0_linear_2467_1113" x1="1.35524" y1="15.3191" x2="40" y2="15.3191" gradientUnits="userSpaceOnUse">
          <stop stopColor="#03CBFF"/>
          <stop offset="1" stopColor="white"/>
          </linearGradient>
          </defs>
          </svg>
        </div>
      </motion.div>
    )
  }