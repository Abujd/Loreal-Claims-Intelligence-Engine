import { SAMPLE_STUDIES } from "../data/studies.js";

export default function SamplePicker({ activeIndex, onPick }) {
  return (
    <div className="samples">
      {SAMPLE_STUDIES.map((s, i) => (
        <button key={s.label} className={i === activeIndex ? "on" : ""} onClick={() => onPick(i)}>
          {s.label}
        </button>
      ))}
    </div>
  );
}
