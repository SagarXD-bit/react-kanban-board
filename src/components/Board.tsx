import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Search, SlidersHorizontal, RotateCcw, Plus, X } from 'lucide-react'
import { useBoard } from '../context'
import { Column } from './Column'
import { TaskCard } from './TaskCard'
import { TaskModal } from './TaskModal'
import type { Task, Priority } from '../types'
import { v4 as uuidv4 } from 'uuid'

export function Board() {
  const { tasks, columns, moveTask, reorderTasks, resetBoard } = useBoard()
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [defaultColumnId, setDefaultColumnId] = useState<string>('todo')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    tasks.forEach(t => t.tags?.forEach(tag => tagSet.add(tag)))
    return Array.from(tagSet)
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !task.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
      if (tagFilter !== 'all' && !task.tags?.includes(tagFilter)) return false
      return true
    })
  }, [tasks, searchQuery, priorityFilter, tagFilter])

  const columnsWithTasks = useMemo(() => {
    return columns.map(col => ({
      ...col,
      tasks: filteredTasks.filter(t => t.columnId === col.id),
    }))
  }, [columns, filteredTasks])

  const handleAddTask = (columnId: string) => {
    setEditingTask(undefined)
    setDefaultColumnId(columnId)
    setModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDefaultColumnId(task.columnId)
    setModalOpen(true)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTaskData = tasks.find(t => t.id === activeId)
    if (!activeTaskData) return

    const overTask = tasks.find(t => t.id === overId)
    const overColumnId = overTask ? overTask.columnId : overId

    if (activeTaskData.columnId !== overColumnId) {
      const overIndex = tasks.filter(t => t.columnId === overColumnId).length
      moveTask(activeId, overColumnId, overIndex)
    } else {
      const columnTasks = tasks.filter(t => t.columnId === activeTaskData.columnId)
      const fromIndex = columnTasks.findIndex(t => t.id === activeId)
      const toIndex = overTask ? columnTasks.findIndex(t => t.id === overId) : columnTasks.length - 1
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        reorderTasks(activeTaskData.columnId, fromIndex, toIndex)
      }
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    const activeId = active.id as string
    const overId = over.id as string
    const activeTaskData = tasks.find(t => t.id === activeId)
    if (!activeTaskData) return

    const overTask = tasks.find(t => t.id === overId)
    const overColumnId = overTask ? overTask.columnId : overId

    if (activeTaskData.columnId !== overColumnId) {
      moveTask(activeId, overColumnId, 0)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                showFilters
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={() => handleAddTask('todo')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
            <button
              onClick={resetBoard}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              title="Reset Board"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-slideDown">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</span>
              <div className="flex gap-1">
                {(['all', 'low', 'medium', 'high'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      priorityFilter === p
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {allTags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tags</span>
                <div className="flex gap-1 flex-wrap">
                  <button
                    onClick={() => setTagFilter('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      tagFilter === 'all'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    All
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setTagFilter(tag)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        tagFilter === tag
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="flex gap-4 sm:gap-5 h-full min-h-[500px]">
            {columnsWithTasks.map(col => (
              <Column
                key={col.id}
                column={col}
                tasks={col.tasks}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="rotate-2 scale-105 opacity-90">
                <TaskCard task={activeTask} onEdit={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(undefined) }}
        editTask={editingTask}
        defaultColumnId={defaultColumnId}
      />
    </div>
  )
}
