import { useState } from "react";
import Header from "./components/Header.jsx";
import ClaimsSidebar from "./components/ClaimsSidebar.jsx";
import ClaimSummary from "./components/ClaimSummary.jsx";
import StudyForm from "./components/StudyForm.jsx";
import { CLAIMS } from "./data/claims.js";

export default function App() {
  const [selectedId, setSelectedId] = useState(CLAIMS[2].id);
  const claim = CLAIMS.find((c) => c.id === selectedId);

  return (
    <>
      <Header user="Evaluator" />
      <div className="layout">
        <ClaimsSidebar claims={CLAIMS} selectedId={selectedId} onSelect={setSelectedId} />
        <main className="main">
          <StudyForm key={claim.id} claim={claim} />
        </main>
      </div>
    </>
  );
}
