import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * Dropdown action menu.
 * Uses createPortal to render the popup as a direct child of document.body,
 * which ensures position:fixed is relative to the viewport even when an
 * ancestor has a CSS transform (e.g. the console-wrap animation fill).
 */
export default function ActionMenu({ items, label = '操作 ▾' }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef(null)
  const popRef = useRef(null)

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
    }
    setOpen(o => !o)
  }

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        popRef.current  && !popRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const popup = open ? (
    <div
      ref={popRef}
      className="action-menu-popup"
      style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          className={`action-menu-item${item.danger ? ' danger' : ''}`}
          onClick={() => { setOpen(false); item.onClick() }}
        >
          {item.label}
        </button>
      ))}
    </div>
  ) : null

  return (
    <div style={{ display: 'inline-block' }}>
      <button ref={btnRef} className="button tiny" onClick={toggle}>{label}</button>
      {createPortal(popup, document.body)}
    </div>
  )
}
