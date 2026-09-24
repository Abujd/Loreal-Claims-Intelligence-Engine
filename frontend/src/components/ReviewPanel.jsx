import { useState } from "react";
import Select from "./Select.jsx";
import { VERDICT_LABELS } from "../constants.js";
import { submitReview } from "../api.js";

const VERDICTS = Object.keys(VERDICT_LABELS);

export default function ReviewPanel({ assessmentId, review, onReviewed }) {
  const [mode, setMode] = useState("idle"); // idle | overriding | submitting
  const [humanVerdict, setHumanVerdict] = useState(VERDICTS[1]);
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);

  const accept = async () => {
    setMode("submitting");
    setError(null);
    try {
      const result = await submitReview(assessmentId, { decision: "ACCEPTED" });
      onReviewed(result);
    } catch (err) {
      setError(err.message);
      setMode("idle");
    }
  };

  const submitOverride = async () => {
    if (!note.trim()) {
      setError("Add a short note explaining the override.");
      return;
    }
    setMode("submitting");
    setError(null);
    try {
      const result = await submitReview(assessmentId, {
        decision: "OVERRIDDEN",
        humanVerdict,
        note: note.trim(),
      });
      onReviewed(result);
    } catch (err) {
      setError(err.message);
      setMode("overriding");
    }
  };

  if (review) {
    return (
      <div className="review review--done">
        <span className={review.decision === "ACCEPTED" ? "reviewtag reviewtag--accepted" : "reviewtag reviewtag--overridden"}>
          {review.decision === "ACCEPTED" ? "Accepted by reviewer" : "Overridden by reviewer"}
        </span>
        {review.decision === "OVERRIDDEN" && (
          <>
            <p className="review__verdict">Corrected verdict: {VERDICT_LABELS[review.humanVerdict]}</p>
            <p className="review__note">“{review.note}”</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="review">
      {mode !== "overriding" ? (
        <div className="review__actions">
          <button type="button" className="btn btn--accept" disabled={mode === "submitting"} onClick={accept}>
            Accept
          </button>
          <button type="button" className="btn btn--override" disabled={mode === "submitting"} onClick={() => setMode("overriding")}>
            Override
          </button>
        </div>
      ) : (
        <div className="review__override">
          <div className="field">
            <label htmlFor="hverdict">Corrected verdict</label>
            <Select id="hverdict" value={humanVerdict} onChange={setHumanVerdict} options={VERDICTS} getLabel={(v) => VERDICT_LABELS[v]} />
          </div>
          <div className="field">
            <label htmlFor="hnote">Reason for override</label>
            <textarea
              id="hnote"
              className="review__textarea"
              value={note}
              placeholder="Explain why the AI verdict is being overridden."
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="review__actions">
            <button type="button" className="btn btn--override" disabled={mode === "submitting"} onClick={submitOverride}>
              {mode === "submitting" ? "Submitting…" : "Submit override"}
            </button>
            <button type="button" className="btn btn--ghost" disabled={mode === "submitting"} onClick={() => { setMode("idle"); setError(null); }}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {error && <p className="review__error">{error}</p>}
    </div>
  );
}
