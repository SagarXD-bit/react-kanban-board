import { ExternalLink, KanbanSquare, Palette, TabletSmartphone, Zap, Layers, Shield } from 'lucide-react'

const technologies = [
  'React 19', 'TypeScript', 'Vite', 'Tailwind CSS 4', '@dnd-kit', 'Lucide React', 'UUID'
]

const features = [
  { icon: Layers, text: 'Drag-and-drop cards between columns' },
  { icon: Zap, text: 'Create, edit, and delete tasks' },
  { icon: Palette, text: 'Dark and light mode with persistence' },
  { icon: TabletSmartphone, text: 'Fully responsive design' },
  { icon: Shield, text: 'Local storage data persistence' },
]

export function About() {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-4">
            <KanbanSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            KanbanFlow
          </h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            A modern, production-quality Kanban board built with React, TypeScript, and Tailwind CSS.
            Manage your tasks efficiently with drag-and-drop, filtering, and real-time statistics.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {technologies.map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Credits</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Built with passion by Sagar Rawat
            </p>
            <button
              onClick={() => window.open("https://sagar-rawat.vercel.app/", "_blank", "noopener,noreferrer")}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <ExternalLink className="w-5 h-5" />
              Visit My Portfolio
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
