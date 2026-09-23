export default function Header({ user }) {
  return (
    <header className="header">
      <div className="brand">
        L'ORÉAL PARIS<small>Claims Intelligence Engine</small>
      </div>
      <div className="header__user">{user}</div>
    </header>
  );
}
