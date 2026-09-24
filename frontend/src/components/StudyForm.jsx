import { useState } from "react";
import SamplePicker from "./SamplePicker.jsx";
import Select from "./Select.jsx";
import ReviewPanel from "./ReviewPanel.jsx";
import { SAMPLE_STUDIES, STUDY_TYPES } from "../data/studies.js";
import { VERDICT_LABELS } from "../constants.js";
import { assessEvidence } from "../api.js";

const VERDICT_MODIFIER = {
  JUSTIFIED: "pass",
  NOT_JUSTIFIED: "fail",
  INSUFFICIENT_EVIDENCE: "unclear",
};

export default function StudyForm({ claim }) {
  const [sample, setSample] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState(STUDY_TYPES[0]);
  const [results, setResults] = useState("");
  const [market, setMarket] = useState(claim.markets[0]);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [review, setReview] = useState(null);

  const ready = title.trim() && results.trim().length >= 20;

  const pickSample = (i) => {
    const s = SAMPLE_STUDIES[i];
    setSample(i);
    setTitle(s.label);
    setType(s.type);
    setResults(s.text);
    setAssessment(null);
    setReview(null);
    setStatus("idle");
  };

  const handleAssess = async () => {
    setStatus("loading");
    setError(null);
    setReview(null);
    try {
      const result = await assessEvidence({
        claimId: claim.id,
        market,
        evidence: { studyTitle: title, studyType: type, content: results },
      });
      setAssessment(result);
      setStatus("idle");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <section>
      <h3>Attach study results</h3>
      <p className="lead">Start from a sample study, or paste your own summary below.</p>
      <SamplePicker activeIndex={sample} onPick={pickSample} />

      <div className="row">
        <div className="field">
          <label htmlFor="stitle">Study title</label>
          <input id="stitle" value={title} placeholder="e.g. Wrinkle study, 4 weeks" onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="stype">Study type</label>
          <Select id="stype" value={type} onChange={setType} options={STUDY_TYPES} />
        </div>
        <div className="field">
          <label htmlFor="smarket">Market</label>
          <Select id="smarket" value={market} onChange={setMarket} options={claim.markets} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="sres">Study results</label>
        <textarea id="sres" value={results} placeholder="Paste the study summary: design, panel, duration, method, results and statistics." onChange={(e) => setResults(e.target.value)} />
      </div>

      <div className="foot">
        <button className="cta" disabled={!ready || status === "loading"} onClick={handleAssess}>
          {status === "loading" ? "Assessing…" : "Assess evidence"}
        </button>
        <span className="hint">{ready ? "Ready to assess against this claim." : "Add a title and at least 20 characters of results to continue."}</span>
      </div>

      {status === "error" && (
        <div className="result result--error" role="alert">
          <h4>Assessment failed</h4>
          <p>{error}</p>
        </div>
      )}

      {assessment && (
        <div className="result" role="status">
          <span className={`verdict verdict--${VERDICT_MODIFIER[assessment.verdict]}`}>
            {VERDICT_LABELS[assessment.verdict] ?? assessment.verdict}
          </span>
          <h4>{Math.round(assessment.confidence * 100)}% confidence</h4>
          <p>{assessment.reasoning}</p>
          {assessment.guardrailFlags.length > 0 && (
            <p className="hint">Flags: {assessment.guardrailFlags.join(", ")}</p>
          )}
          {assessment.suggestedRewording && (
            <p className="hint">Suggested rewording: “{assessment.suggestedRewording}”</p>
          )}

          <ReviewPanel assessmentId={assessment.id} review={review} onReviewed={setReview} />
        </div>
      )}
    </section>
  );
}
