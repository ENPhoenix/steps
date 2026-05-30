import { useMemo, useState } from 'react'
import './App.css'

function parseDate(dateString) {
  const [day, month, year] = dateString.split('.').map(Number)
  return new Date(year, month - 1, day)
}

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : String(value).replace(/\.0+$/, '')
}

function App() {
  const [form, setForm] = useState({ date: '', distance: '' })
  const [entries, setEntries] = useState([])
  const [editingDate, setEditingDate] = useState(null)

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => parseDate(b.date) - parseDate(a.date))
  }, [entries])

  const formatDateInput = (rawValue) => {
    const digits = rawValue.replace(/\D/g, '').slice(0, 8)
    const part1 = digits.slice(0, 2)
    const part2 = digits.slice(2, 4)
    const part3 = digits.slice(4, 8)

    if (digits.length <= 2) return part1
    if (digits.length <= 4) return `${part1}.${part2}`
    return `${part1}.${part2}.${part3}`
  }

  const onChange = (event) => {
    const { name, value } = event.target

    if (name === 'date') {
      setForm((prev) => ({ ...prev, date: formatDateInput(value) }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setForm({ date: '', distance: '' })
    setEditingDate(null)
  }

  const onSubmit = (event) => {
    event.preventDefault()

    const date = form.date.trim()
    const distance = Number(form.distance)

    if (!date || Number.isNaN(distance) || distance <= 0) {
      return
    }

    setEntries((prev) => {
      if (editingDate) {
        return prev.map((item) =>
          item.date === editingDate ? { ...item, date, distance } : item
        )
      }

      const existing = prev.find((item) => item.date === date)
      if (existing) {
        return prev.map((item) =>
          item.date === date
            ? { ...item, distance: Number((item.distance + distance).toFixed(2)) }
            : item
        )
      }

      return [...prev, { date, distance }]
    })

    resetForm()
  }

  const onDelete = (date) => {
    setEntries((prev) => prev.filter((item) => item.date !== date))
    if (editingDate === date) {
      resetForm()
    }
  }

  const onEdit = (entry) => {
    setForm({ date: entry.date, distance: String(entry.distance) })
    setEditingDate(entry.date)
  }

  return (
    <main className="steps-app">
      <h1 className="title">Учёт тренировок</h1>

      <form className="steps-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Дата (ДД.ММ.ГГГГ)</span>
          <input
            name="date"
            value={form.date}
            onChange={onChange}
            placeholder="20.07.2019"
            pattern="\d{2}\.\d{2}\.\d{4}"
            maxLength={10}
            inputMode="numeric"
            required
          />
        </label>

        <label className="field">
          <span>Пройдено км</span>
          <input
            name="distance"
            value={form.distance}
            onChange={onChange}
            placeholder="5.7"
            type="number"
            step="0.1"
            min="0.1"
            required
          />
        </label>

        <button type="submit" className="submit-btn">
          {editingDate ? 'Сохранить' : 'OK'}
        </button>
      </form>

      <section className="table-wrap">
        <div className="table-head">
          <span>Дата</span>
          <span>Пройдено км</span>
          <span>Действия</span>
        </div>

        {sortedEntries.length === 0 ? (
          <div className="empty">Записей пока нет</div>
        ) : (
          <ul className="rows">
            {sortedEntries.map((item) => (
              <li className="row" key={item.date}>
                <span>{item.date}</span>
                <span>{formatNumber(item.distance)}</span>
                <span className="actions">
                  <button type="button" onClick={() => onEdit(item)} aria-label="Редактировать">
                    ✎
                  </button>
                  <button type="button" onClick={() => onDelete(item.date)} aria-label="Удалить">
                    ✘
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
