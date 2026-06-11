import { useState, useEffect } from 'react'

function StepsForm({ onSubmit, editingEntry, onReset }) {
  const [form, setForm] = useState({ date: '', distance: '' })

  const formatDateForInput = (dateString) => {
    // Конвертируем ДД.ММ.ГГГГ в ГГГГ-ММ-ДД для input type="date"
    if (dateString.includes('.')) {
      const [day, month, year] = dateString.split('.')
      return `${year}-${month}-${day}`
    }
    return dateString
  }

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const date = form.date.trim()
    const distance = Number(form.distance)

    if (!date || Number.isNaN(distance) || distance <= 0) {
      return
    }

    onSubmit({ date, distance, editingDate: editingEntry?.date })
    setForm({ date: '', distance: '' })
    if (onReset) onReset()
  }

  // Синхронизируем форму quando editingEntry muda
  useEffect(() => {
    if (editingEntry) {
      setForm({
        date: formatDateForInput(editingEntry.date),
        distance: String(editingEntry.distance)
      })
    } else {
      setForm({ date: '', distance: '' })
    }
  }, [editingEntry])

  return (
    <form className="steps-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Дата (ДД.ММ.ГГГГ)</span>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={onChange}
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
        {editingEntry ? 'Сохранить' : 'OK'}
      </button>
    </form>
  )
}

export default StepsForm
