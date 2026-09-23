export default function ClaimsSidebar({ claims, selectedId, onSelect }) {
  return (
    <aside className="sidebar" aria-label="Claims">
      <h2>Claims</h2>
      {claims.map((c) => (
        <button
          key={c.id}
          className="claim"
          aria-current={c.id === selectedId}
          onClick={() => onSelect(c.id)}
        >
          <b>{c.title}</b>
          <span>{c.product}</span>
          {/* <em className="tag">{c.status}</em> */}
        </button>
      ))}
    </aside>
  );
}
