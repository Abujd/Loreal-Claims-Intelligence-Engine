import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import ClaimsSidebar from "./components/ClaimsSidebar.jsx";
import ClaimSummary from "./components/ClaimSummary.jsx";
import StudyForm from "./components/StudyForm.jsx";
import { listClaims } from "./api.js";

export default function App() {
  const [claims, setClaims] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    listClaims()
      .then((data) => {
        setClaims(data);
        setSelectedId(data[0]?.id ?? null);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return <p className="lead">Loading claims…</p>;
  if (status === "error") return <p className="lead">Could not reach the API. Is the backend running?</p>;

  const claim = claims.find((c) => c.id === selectedId);

  return (
    <>
      <Header user="Evaluator" />
      <div className="layout">
        <ClaimsSidebar claims={claims} selectedId={selectedId} onSelect={setSelectedId} />
        <main className="main">
          {claim && <ClaimSummary claim={claim} />}
          {claim && <StudyForm key={claim.id} claim={claim} />}
        </main>
      </div>
    </>
  );
}
