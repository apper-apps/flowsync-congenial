import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const MobileNavigation = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/', icon: 'Home', label: 'Dashboard' },
    { path: '/goals', icon: 'Target', label: 'Goals' },
    { path: '/journal', icon: 'BookOpen', label: 'Journal' },
    { path: '/insights', icon: 'BarChart3', label: 'Insights' }
  ]

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={16} className="text-white" />
                </div>
                <span className="text-lg font-display font-bold text-gray-900">FlowSync</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-600" />
              </button>
            </div>

            <nav className="p-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-medium' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                      }`
                    }
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 px-4 py-2 md:hidden z-30">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-gray-500 hover:text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isActive ? 'bg-primary/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ApperIcon name={item.icon} size={18} />
                  </motion.div>
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}

export default MobileNavigation