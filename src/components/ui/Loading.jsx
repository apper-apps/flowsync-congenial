import { motion } from 'framer-motion'

const Loading = ({ type = 'dashboard' }) => {
  const shimmer = {
    animate: {
      x: ['-100%', '100%'],
    },
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear',
    },
  }

  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Energy Status Card Skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                {...shimmer}
              />
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                {...shimmer}
              />
            </div>
          </div>
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              {...shimmer}
            />
          </div>
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              {...shimmer}
            />
          </div>
          <div className="h-3 bg-gray-200 rounded w-32 mx-auto relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              {...shimmer}
            />
          </div>
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 bg-gray-200 rounded w-24 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    {...shimmer}
                  />
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    {...shimmer}
                  />
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  {...shimmer}
                />
              </div>
              <div className="h-3 bg-gray-200 rounded w-20 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  {...shimmer}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-soft">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  {...shimmer}
                />
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    {...shimmer}
                  />
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    {...shimmer}
                  />
                </div>
              </div>
              <div className="w-16 h-8 bg-gray-200 rounded relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  {...shimmer}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-primary rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Loading