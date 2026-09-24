import { useEffect, useId, useRef, useState } from "react";

export default function Select({ id, value, onChange, options, getLabel = (o) => o }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className="select" ref={rootRef}>
      <button
        type="button"
        id={id}
        className="select__control"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{getLabel(value)}</span>
        <svg className="select__chevron" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="select__panel" role="listbox" id={listboxId} aria-labelledby={id}>
          {options.map((option) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={option === value ? "select__option is-selected" : "select__option"}
              onClick={() => pick(option)}
            >
              {getLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
