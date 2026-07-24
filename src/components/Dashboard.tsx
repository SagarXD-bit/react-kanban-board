import { useMemo } from 'react'
import { CheckCircle2, Clock, AlertCircle, ListTodo, TrendingUp, Flag } from 'lucide-react'
import { useBoard } from '../context'

export function Dashboard() {
  const { tasks } = useBoard()

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.columnId === 'done').length
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const overdue = tasks.filter(t => {
      if (!t.dueDate || t.columnId === 'done') return false
      return new Date(t.dueDate) < today
    }).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const priorityCounts = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    }
    return { total, completed, overdue, completionRate, priorityCounts }
  }, [tasks])

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-800',
    },
    {
      label: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/30',
      border: 'border-teal-200 dark:border-teal-800',
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Overview of your board activity</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(card => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className={`rounded-2xl border ${card.border} ${card.bg} p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {card.label}
                  </span>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className={`text-2xl sm:text-3xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Tasks by Priority</h2>
            <div className="space-y-4">
              {([
                { label: 'High', key: 'high', color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', count: stats.priorityCounts.high },
                { label: 'Medium', key: 'medium', color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950/30', count: stats.priorityCounts.medium },
                { label: 'Low', key: 'low', color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30', count: stats.priorityCounts.low },
              ] as const).map(p => {
                const maxCount = Math.max(...Object.values(stats.priorityCounts), 1)
                const percentage = maxCount > 0 ? (p.count / maxCount) * 100 : 0
                return (
                  <div key={p.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Flag className={`w-4 h-4 ${p.textColor}`} />
                        {p.label}
                      </span>
                      <span className={`text-sm font-bold ${p.textColor}`}>{p.count}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.color} transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Task Distribution</h2>
            <div className="flex items-center justify-center h-48">
              {stats.total > 0 ? (
                <div className="flex items-end gap-3 h-40 w-full max-w-xs">
                  {['todo', 'in-progress', 'review', 'done'].map((colId, i) => {
                    const count = tasks.filter(t => t.columnId === colId).length
                    const maxCnt = Math.max(...['todo', 'in-progress', 'review', 'done'].map(c => tasks.filter(t => t.columnId === c).length), 1)
                    const height = (count / maxCnt) * 100
                    const colors = ['bg-blue-500', 'bg-amber-500', 'bg-teal-500', 'bg-emerald-500']
                    const labels = ['To Do', 'In Progress', 'Review', 'Done']
                    return (
                      <div key={colId} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{count}</span>
                        <div
                          className={`w-full rounded-lg ${colors[i]} transition-all duration-500 ease-out min-h-[4px]`}
                          style={{ height: `${Math.max(height, 2)}%` }}
                        />
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-tight">{labels[i]}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center">
                  <ListTodo className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">No tasks to display</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {stats.total > 0 && (
          <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Tasks</h2>
            <div className="space-y-2">
              {[...tasks]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{task.title}</span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
                      {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
