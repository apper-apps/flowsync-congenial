import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  gradient = false,
  padding = 'p-6',
  ...props 
}) => {
  const baseClasses = `bg-white rounded-2xl shadow-soft transition-all duration-200 ${padding}`
  const hoverClasses = hover ? 'hover:shadow-medium hover:scale-[1.02] cursor-pointer' : ''
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''
  
  const classes = `${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`

  return (
    <motion.div
      className={classes}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card