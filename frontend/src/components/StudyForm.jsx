import { useState } from "react";
import SamplePicker from "./SamplePicker.jsx";
import { SAMPLE_STUDIES, STUDY_TYPES } from "../data/studies.js";

export default function StudyForm({ claim }) {
  const [sample, setSample] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState(STUDY_TYPES[0]);
  const [results, setResults] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const ready = title.trim() && results.trim();

  const pickSample = (i) => {
    const s = SAMPLE_STUDIES[i];
    setSample(i);
    setTitle(s.label);
    setType(s.type);
    setResults(s.text);
    setSubmitted(false);
  };

  const handleAssess = () => {
    // TODO: call your assessment API with { claimId: claim.id, title, type, results }
    setSubmitted(true);
  };

  return (
    <section>
      <h3 className="">Attach study results</h3>
      <p className="lead">Start from a sample study, or paste your own summary below.</p>
      <SamplePicker activeIndex={sample} onPick={pickSample} />

      <div className="row">
        <div className="field">
          <label htmlFor="stitle">Study title</label>
          <input id="stitle" value={title} placeholder="e.g. Wrinkle study, 4 weeks" onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="stype">Study type</label>
          <select id="stype" value={type} onChange={(e) => setType(e.target.value)}>
            {STUDY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="sres">Study results</label>
        <textarea id="sres" value={results} placeholder="Paste the study summary: design, panel, duration, method, results and statistics." onChange={(e) => setResults(e.target.value)} />
      </div>

      <div className="foot">
        <button className="cta" disabled={!ready} onClick={handleAssess}>Assess evidence</button>
        <span className="hint">{ready ? "Ready to assess against this claim." : "Add a title and results to continue."}</span>
      </div>

      {submitted && (
        <div className="result" role="status">
          <h4>Assessment queued</h4>
          <p>“{title}” is being checked against this claim.</p>
        </div>
      )}
    </section>
  );
}
