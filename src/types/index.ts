export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string
  tags: string[]
  createdAt: string
  columnId: string
}

export interface Column {
  id: string
  title: string
}

export interface BoardData {
  tasks: Task[]
  columns: Column[]
}

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}
