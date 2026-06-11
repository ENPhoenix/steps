import { useMemo, useState } from 'react'
import './App.css'
import StepsForm from './components/StepsForm'
import StepsTable from './components/StepsTable'

function parseDate(dateString) {
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  const [day, month, year] = dateString.split('.').map(Number)
  return new Date(year, month - 1, day)
}

function App() {
  const [entries, setEntries] = useState([])
  const [editingEntry, setEditingEntry] = useState(null)

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => parseDate(b.date) - parseDate(a.date))
  }, [entries])

  const handleSubmit = ({ date, distance, editingDate }) => {
    setEntries((prev) => {
      if (editingDate) {
        // Редактирование существующей записи
        return prev.map((item) =>
          item.date === editingDate ? { ...item, date, distance } : item
        )
      }

      // Проверяем, существует ли дата
      const existing = prev.find((item) => item.date === date)
      if (existing) {
        // Суммируем километры для существующей даты
        return prev.map((item) =>
          item.date === date
            ? { ...item, distance: Number((item.distance + distance).toFixed(2)) }
            : item
        )
      }

      // Добавляем новую запись
      return [...prev, { date, distance }]
    })

    setEditingEntry(null)
  }

  const handleDelete = (date) => {
    setEntries((prev) => prev.filter((item) => item.date !== date))
    if (editingEntry?.date === date) {
      setEditingEntry(null)
    }
  }

  const handleEdit = (entry) => {
    setEditingEntry(entry)
  }

  const handleReset = () => {
    setEditingEntry(null)
  }

  return (
    <main className="steps-app">
      <h1 className="title">Учёт тренировок</h1>

      <StepsForm 
        onSubmit={handleSubmit} 
        editingEntry={editingEntry}
        onReset={handleReset}
      />

      <section className="table-wrap">
        <div className="table-head">
          <span>Дата</span>
          <span>Пройдено км</span>
          <span>Действия</span>
        </div>

        <StepsTable 
          entries={sortedEntries} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </section>
    </main>
  )
}

export default App
