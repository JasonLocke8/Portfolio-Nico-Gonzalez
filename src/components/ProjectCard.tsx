import { motion } from 'framer-motion'
import { Github, ExternalLink, MessageCircle } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  githubUrl: string
  deployedUrl?: string
  discordInviteUrl?: string
  status?: 'deployed' | 'coming-soon' | 'in-development'
}

export function ProjectCard({
  title,
  description,
  tags,
  githubUrl,
  deployedUrl,
  discordInviteUrl,
  status = 'deployed'
}: ProjectCardProps) {
  const statusColors = {
    deployed: 'bg-green-500/20 text-green-300 border-green-500/30',
    'coming-soon': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'in-development': 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  }

  const statusLabels = {
    deployed: 'Deployeado',
    'coming-soon': 'Próximamente',
    'in-development': 'En desarrollo'
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="relative bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 sm:p-6 hover:border-gray-600/50 transition-all duration-300 flex flex-col h-full">
        {/* Status Badge */}
        <div className="flex justify-between items-start gap-2 mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white leading-snug flex-1">
            {title}
          </h3>
          <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${statusColors[status]} whitespace-nowrap flex-shrink-0`}>
            {statusLabels[status]}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 flex-grow">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-md border border-gray-600/30 hover:bg-gray-600/50 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-4 border-t border-gray-700/30">
          <motion.a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 bg-gray-700/30 rounded-md hover:bg-gray-700/50 hover:text-white transition-colors flex-1 justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`GitHub de ${title}`}
          >
            <Github size={16} />
            <span>GitHub</span>
          </motion.a>

          {deployedUrl && (
            <motion.a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-blue-600/50 rounded-md hover:bg-blue-600 transition-colors flex-1 justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Ver ${title} en vivo`}
            >
              <ExternalLink size={16} />
              <span>Ver en vivo</span>
            </motion.a>
          )}

          {discordInviteUrl && (
            <motion.a
              href={discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-purple-600/50 rounded-md hover:bg-purple-600 transition-colors flex-1 justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Invitar ${title} a Discord`}
            >
              <MessageCircle size={16} />
              <span>Discord</span>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
