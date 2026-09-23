export default function ClaimSummary({ claim }) {
  return (
    <section>
      <p className="product">{claim.product}, {claim.formula}</p>
      <h1>“{claim.title}”</h1>
      <dl className="meta">
        <div><dt>Type</dt><dd>{claim.type}</dd></div>
        <div><dt>Markets</dt><dd>{claim.markets}</dd></div>
        <div><dt>Status</dt><dd>{claim.status}</dd></div>
      </dl>
    </section>
  );
}
