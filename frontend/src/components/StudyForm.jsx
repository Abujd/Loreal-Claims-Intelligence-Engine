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

const CRITERION_LABELS = {
  ENDPOINT_MATCHES_CLAIM: "Endpoint match",
  MAGNITUDE_SUPPORTED: "Effect magnitude",
  TIMEFRAME_SUPPORTED: "Timeframe",
  SAMPLE_ADEQUATE: "Sample size",
  METHOD_ROBUST: "Study method",
  STATISTICALLY_SIGNIFICANT: "Statistical significance",
};

const FINDING_FIELDS = [
  ["endpoint", "Reported endpoint"],
  ["measurementMethod", "Measurement method"],
  ["observedEffectPercent", "Observed effect", (value) => `${value}%`],
  ["sampleSize", "Sample size", (value) => `${value} participants`],
  ["timepointDays", "Timepoint (days, model extracted)", (value) => `${value} days`],
  ["studyDurationDays", "Study duration (days)", (value) => `${value} days`],
  ["comparator", "Comparator"],
  ["statisticalSignificance", "Statistical result"],
];

function displayFinding(value, format) {
  if (value === null || value === undefined || value === "") return "Not reported";
  return format ? format(value) : String(value);
}

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
        <div className="result result--assessment" role="status">
          <div className="result__header">
            <div>
              <span className={`verdict verdict--${VERDICT_MODIFIER[assessment.verdict]}`}>
                {VERDICT_LABELS[assessment.verdict] ?? assessment.verdict}
              </span>
              <p className="result__market">Market: {assessment.market}</p>
            </div>
            <div className="result__confidence">
              <strong>{Math.round(assessment.confidence * 100)}%</strong>
              <span>confidence</span>
            </div>
          </div>

          <section className="result__section">
            <h4>Why this verdict</h4>
            <p>{assessment.reasoning}</p>
          </section>

          {assessment.extractedFindings && (
            <section className="result__section">
              <h4>Study findings</h4>
              <dl className="result__facts">
                {FINDING_FIELDS.map(([key, label, format]) => (
                  <div key={key}>
                    <dt>{label}</dt>
                    <dd>{displayFinding(assessment.extractedFindings[key], format)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {assessment.criteria?.length > 0 && (
            <section className="result__section">
              <h4>Assessment criteria</h4>
              <ul className="result__criteria">
                {assessment.criteria.map((criterion) => (
                  <li className="result__criterion" key={criterion.name}>
                    <div className="result__criterion-heading">
                      <strong>{CRITERION_LABELS[criterion.name] ?? criterion.name.replaceAll("_", " ")}</strong>
                      <span className={`criterion-status criterion-status--${criterion.status.toLowerCase()}`}>
                        {criterion.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    <p>{criterion.explanation}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="result__section result__guardrails">
            <h4>Rule-based checks</h4>
            {assessment.guardrailFlags.length > 0 ? (
              <ul>
                {assessment.guardrailFlags.map((flag) => <li key={flag}>{flag.replaceAll("_", " ")}</li>)}
              </ul>
            ) : <p>No guardrail flags.</p>}
          </section>

          {assessment.suggestedRewording && (
            <section className="result__section">
              <h4>Suggested rewording</h4>
              <p>{assessment.suggestedRewording}</p>
            </section>
          )}

          <details className="result__traceability">
            <summary>Assessment details</summary>
            <dl>
              <div><dt>Model</dt><dd>{assessment.model}</dd></div>
              <div><dt>Model confidence</dt><dd>{Math.round(assessment.modelConfidence * 100)}%</dd></div>
              <div><dt>Prompt version</dt><dd>{assessment.promptVersion}</dd></div>
              <div><dt>Response time</dt><dd>{Math.round(assessment.latencyMs / 1000)} seconds</dd></div>
              <div><dt>Assessment ID</dt><dd>{assessment.id}</dd></div>
            </dl>
          </details>

          <ReviewPanel assessmentId={assessment.id} review={review} onReviewed={setReview} />
        </div>
      )}
    </section>
  );
}
