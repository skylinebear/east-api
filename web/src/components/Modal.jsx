/* EASTCREA v4 — Modal */
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        {title && <h3>{title}</h3>}
        {children}
        {footer && <div className="button-row" style={{ marginTop: 20 }}>{footer}</div>}
      </div>
    </div>
  )
}
