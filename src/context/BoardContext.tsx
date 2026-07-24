import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Task, Column, BoardData, Priority, Toast } from '../types'

const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
]

const STORAGE_KEY = 'kanban-board-data'

function loadBoard(): BoardData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && parsed.tasks && parsed.columns) return parsed
    }
  } catch {}
  return { tasks: [], columns: DEFAULT_COLUMNS }
}

function saveBoard(data: BoardData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

interface BoardContextType {
  tasks: Task[]
  columns: Column[]
  toasts: Toast[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, targetColumnId: string, targetIndex: number) => void
  reorderTasks: (columnId: string, fromIndex: number, toIndex: number) => void
  resetBoard: () => void
  showToast: (message: string, type: Toast['type']) => void
  dismissToast: (id: string) => void
}

const BoardContext = createContext<BoardContextType | undefined>(undefined)

export function BoardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BoardData>(loadBoard)
  const [toasts, setToasts] = useState<Toast[]>([])

  const persist = useCallback((newData: BoardData) => {
    setData(newData)
    saveBoard(newData)
  }, [])

  const showToast = useCallback((message: string, type: Toast['type']) => {
    const id = uuidv4()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }
    setData(prev => {
      const newData = { ...prev, tasks: [...prev.tasks, newTask] }
      saveBoard(newData)
      return newData
    })
    showToast('Task created successfully', 'success')
  }, [showToast])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setData(prev => {
      const newData = {
        ...prev,
        tasks: prev.tasks.map(t => (t.id === id ? { ...t, ...updates } : t)),
      }
      saveBoard(newData)
      return newData
    })
    showToast('Task updated successfully', 'success')
  }, [showToast])

  const deleteTask = useCallback((id: string) => {
    setData(prev => {
      const newData = { ...prev, tasks: prev.tasks.filter(t => t.id !== id) }
      saveBoard(newData)
      return newData
    })
    showToast('Task deleted', 'info')
  }, [showToast])

  const moveTask = useCallback((taskId: string, targetColumnId: string, targetIndex: number) => {
    setData(prev => {
      const task = prev.tasks.find(t => t.id === taskId)
      if (!task) return prev
      const filtered = prev.tasks.filter(t => t.id !== taskId)
      const updatedTask = { ...task, columnId: targetColumnId }
      const tasks = [...filtered.slice(0, targetIndex), updatedTask, ...filtered.slice(targetIndex)]
      const newData = { ...prev, tasks }
      saveBoard(newData)
      return newData
    })
  }, [])

  const reorderTasks = useCallback((columnId: string, fromIndex: number, toIndex: number) => {
    setData(prev => {
      const columnTasks = prev.tasks
        .filter(t => t.columnId === columnId)
        .sort((a, b) => prev.tasks.indexOf(a) - prev.tasks.indexOf(b))
      const [moved] = columnTasks.splice(fromIndex, 1)
      columnTasks.splice(toIndex, 0, moved)
      const otherTasks = prev.tasks.filter(t => t.columnId !== columnId)
      const allIndices = prev.tasks.map((t, i) => ({ id: t.id, i }))
      const colIndices = columnTasks.map(t => t.id)
      const newTasks = [
        ...otherTasks,
        ...columnTasks,
      ]
      const ordered = prev.columns.flatMap(col => {
        const colTasks = newTasks.filter(t => t.columnId === col.id)
        const orderedCol = prev.tasks.filter(t => t.columnId === col.id)
        return orderedCol.map(ot => colTasks.find(ct => ct.id === ot.id) || ot)
      })
      const newData = { ...prev, tasks: ordered }
      saveBoard(newData)
      return newData
    })
  }, [])

  const resetBoard = useCallback(() => {
    const empty: BoardData = { tasks: [], columns: DEFAULT_COLUMNS }
    setData(empty)
    saveBoard(empty)
    showToast('Board reset successfully', 'info')
  }, [showToast])

  return (
    <BoardContext.Provider value={{
      tasks: data.tasks,
      columns: data.columns,
      toasts,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      reorderTasks,
      resetBoard,
      showToast,
      dismissToast,
    }}>
      {children}
    </BoardContext.Provider>
  )
}

export function useBoard() {
  const context = useContext(BoardContext)
  if (!context) throw new Error('useBoard must be used within a BoardProvider')
  return context
}
