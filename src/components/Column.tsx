import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, MoreHorizontal } from 'lucide-react'
import type { Task, Column as ColumnType } from '../types'
import { TaskCard } from './TaskCard'

interface ColumnProps {
  column: ColumnType
  tasks: Task[]
  onAddTask: (columnId: string) => void
  onEditTask: (task: Task) => void
}

const columnColors: Record<string, string> = {
  'todo': 'border-t-blue-500',
  'in-progress': 'border-t-amber-500',
  'review': 'border-t-teal-500',
  'done': 'border-t-emerald-500',
}

const columnHeaders: Record<string, string> = {
  'todo': 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  'in-progress': 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
  'review': 'bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400',
  'done': 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
}

export function Column({ column, tasks, onAddTask, onEditTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', column },
  })

  return (
    <div
      className={`flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] flex flex-col rounded-2xl border border-t-4 ${
        columnColors[column.id] || 'border-t-gray-500'
      } bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-800 transition-all duration-200 ${
        isOver ? 'ring-2 ring-emerald-500/30 shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-2 h-2 rounded-full ${columnHeaders[column.id]?.split(' ')[0] || 'bg-gray-400'}`} />
          <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{column.title}</h2>
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddTask(column.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
            aria-label={`Add task to ${column.title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 px-3 pb-3 overflow-y-auto min-h-[200px] max-h-[calc(100vh-280px)]"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 pt-1">
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">No tasks yet</p>
                <button
                  onClick={() => onAddTask(column.id)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Add a task
                </button>
              </div>
            )}
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
