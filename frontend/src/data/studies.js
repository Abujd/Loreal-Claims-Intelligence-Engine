export const STUDY_TYPES = [
  "Instrumental clinical",
  "Dermatologist graded",
  "Consumer perception",
  "In-vitro",
];

export const SAMPLE_STUDIES = [
  // --- Supports the claim (expect JUSTIFIED) ---
  { label: "✓ Wrinkle study, 4 weeks, vehicle-controlled", type: "Instrumental clinical", text: "Design: randomised, double-blind, vehicle-controlled (active vs. vehicle arm). Panel: 60 women aged 40-60. Duration: 4 weeks. Method: PRIMOS 3D profilometry. Result: 20.4% mean reduction in wrinkle depth vs. vehicle arm at week 4 (p<0.01)." },
  { label: "✓ Hydration study, 24 hours", type: "Instrumental clinical", text: "Design: randomised, controlled, single application. Panel: 45 women aged 25-55. Method: Corneometer CM 825, measured at 1h, 8h, and 24h post-application. Result: hydration remained significantly elevated vs. control at the 24h timepoint (+28%, p<0.01)." },
  { label: "✓ Consumer smoothness questionnaire, 90%+", type: "Consumer perception", text: "Design: self-assessment questionnaire after 4 weeks of daily use. Panel: 120 women. Result: 112 of 120 (93%) agreed their skin feels smoother." },

  // --- Falls short of the claim (expect NOT_JUSTIFIED / INSUFFICIENT_EVIDENCE) ---
  { label: "✗ Wrinkle study, 8 weeks, open-label", type: "Dermatologist graded", text: "Design: open-label, single arm. Panel: 40 women. Duration: 8 weeks. Method: dermatologist grading. Result: 15% improvement in wrinkle score." },
  { label: "✗ Hydration study, up to 8 hours", type: "Instrumental clinical", text: "Design: single-centre, intra-individual. Panel: 30 women. Method: Corneometer. Result: significant hydration increase up to 8 hours after application." },
];
