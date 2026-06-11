function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : String(value).replace(/\.0+$/, '')
}

function formatDateForDisplay(dateString) {
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-')
    return `${day}.${month}.${year}`
  }
  return dateString
}

function StepsTable({ entries, onEdit, onDelete }) {
  if (entries.length === 0) {
    return (
      <div className="empty">Записей пока нет</div>
    )
  }

  return (
    <ul className="rows">
      {entries.map((item) => (
        <li className="row" key={item.date}>
          <span>{formatDateForDisplay(item.date)}</span>
          <span>{formatNumber(item.distance)}</span>
          <span className="actions">
            <button
              type="button"
              onClick={() => onEdit(item)}
              aria-label="Редактировать"
            >
              ✎
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.date)}
              aria-label="Удалить"
            >
              ✘
            </button>
          </span>
        </li>
      ))}
    </ul>
  )
}

export default StepsTable
