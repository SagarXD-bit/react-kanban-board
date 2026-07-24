# KanbanFlow

A modern, production-quality Kanban board built with **React 19**, **TypeScript**, and **Tailwind CSS**. Manage tasks with drag-and-drop, real-time search/filter, dark mode, and local storage persistence.

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

---

## Features

- **Drag & Drop** — Move cards between columns and reorder within columns using `@dnd-kit`
- **Task Management** — Create, edit, and delete tasks with title, description, priority, due date, and tags
- **Search & Filter** — Real-time search by title/description, filter by priority and tags
- **Dark Mode** — Full dark/light theme with system preference detection and persistence
- **Dashboard** — Overview stats: total tasks, completed, overdue, completion rate, priority distribution
- **Data Persistence** — All board state saved to `localStorage` automatically; reset board option
- **Responsive** — Optimized for desktop, tablet, and mobile with a collapsible navigation
- **Toast Notifications** — Feedback for create, edit, and delete actions
- **Smooth Animations** — Fade, scale, and slide transitions for a polished feel

## Tech Stack

| Tool | Purpose |
|------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **@dnd-kit** | Drag-and-drop toolkit |
| **Lucide React** | Icon library |
| **UUID** | Unique ID generation |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
cd kanban-board
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── About.tsx         # About page with portfolio link
│   ├── Board.tsx         # Main board with DnD context
│   ├── Column.tsx        # Droppable column component
│   ├── Dashboard.tsx     # Analytics dashboard
│   ├── Footer.tsx        # App footer
│   ├── Header.tsx        # Responsive nav bar
│   ├── TaskCard.tsx      # Sortable task card
│   ├── TaskModal.tsx     # Create/edit task modal
│   └── Toast.tsx         # Toast notification system
├── context/
│   ├── BoardContext.tsx   # Board state + localStorage
│   ├── ThemeContext.tsx   # Dark/light mode
│   └── index.ts
├── types/
│   └── index.ts          # TypeScript interfaces
├── App.tsx               # Root app with routing
├── main.tsx              # Entry point
└── index.css             # Tailwind + custom styles
```

## Usage

1. **Add a task** — Click the "New Task" button or the `+` icon on any column
2. **Edit** — Hover a card and click the pencil icon
3. **Delete** — Hover a card and click the trash icon
4. **Reorder** — Drag the grip handle on any card
5. **Move between columns** — Drag a card to another column
6. **Search** — Type in the search bar to filter tasks
7. **Filter** — Click "Filters" to narrow by priority or tags
8. **Theme toggle** — Click the sun/moon icon in the header
9. **Dashboard** — Navigate to the Dashboard for stats
10. **Reset** — Click the reset icon to clear all tasks

## Credits

Built with passion by **Sagar Rawat**.

[![Portfolio](https://img.shields.io/badge/Portfolio-sagar--rawat.vercel.app-06B6D4?style=for-the-badge&logo=vercel&logoColor=white)](https://sagar-rawat.vercel.app/)
