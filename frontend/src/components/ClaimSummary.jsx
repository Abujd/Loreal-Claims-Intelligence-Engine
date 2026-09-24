import { CLAIM_STATUS_LABELS, CLAIM_TYPE_LABELS } from "../constants.js";

export default function ClaimSummary({ claim }) {
  return (
    <section>
      <p className="product">{claim.productName}</p>
      <h1>{claim.text}</h1>
      <dl className="meta">
        <div><dt>Type</dt><dd>{CLAIM_TYPE_LABELS[claim.type] ?? claim.type}</dd></div>
        <div><dt>Markets</dt><dd>{claim.markets?.join(", ")}</dd></div>
        <div><dt>Status</dt><dd>{CLAIM_STATUS_LABELS[claim.status] ?? claim.status}</dd></div>
      </dl>
    </section>
  );
}
