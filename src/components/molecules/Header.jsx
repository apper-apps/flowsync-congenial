import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onMenuToggle, isMenuOpen }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-medium">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-gray-900">FlowSync</h1>
              <p className="text-xs text-gray-500 font-medium">Smart Wellness</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavItem href="/" icon="Home" label="Dashboard" />
            <NavItem href="/goals" icon="Target" label="Goals" />
            <NavItem href="/journal" icon="BookOpen" label="Journal" />
            <NavItem href="/insights" icon="BarChart3" label="Insights" />
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon 
              name={isMenuOpen ? "X" : "Menu"} 
              size={24} 
              className="text-gray-600" 
            />
          </motion.button>
        </div>
      </div>
    </header>
  )
}

const NavItem = ({ href, icon, label }) => {
  return (
    <motion.a
      href={href}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/10 transition-all duration-200 font-medium"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ApperIcon name={icon} size={18} />
      <span className="text-sm">{label}</span>
    </motion.a>
  )
}

export default Header