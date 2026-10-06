# 2. Research performed

## 2.1 Regulatory landscape

**European Union.** The Cosmetics Regulation (EC) No 1223/2009, Article 20, forbids claims that imply characteristics a product does not have. Commission Regulation (EU) No 655/2013 sets six **common criteria** for cosmetic claims: legal compliance, truthfulness, evidential support, honesty, fairness, and informed decision-making. The six assessment criteria in this engine are a practical breakdown of *evidential support* and *truthfulness*. The Commission's Technical Document on cosmetic claims adds guidance, including specific annexes on "free from" and "hypoallergenic" claims.

**United States.** The FTC expects advertising claims to be backed by competent and reliable scientific evidence. Separately, the line between cosmetic and drug matters: "reduces the *appearance* of wrinkles" is a cosmetic claim, while wording that implies changing the skin's structure can make a product a drug in the FDA's eyes. This is one reason the engine suggests alternative wording.

**Other markets.** The UK (ASA/CAP codes), China (NMPA, which requires efficacy evaluation for many claim categories), ASEAN and the Gulf states all have their own rules. The same claim may pass in one market and fail in another, which is why each claim stores its target `markets`, and why market-specific rules are a roadmap item.

## 2.2 What makes cosmetic efficacy evidence good

From standard clinical and instrumental study practice, these are the attributes that decide whether a study supports a claim, and they are exactly what the model is asked to extract:

| Attribute | Why it matters |
|---|---|
| Endpoint and method | Must measure what the claim says (e.g. profilometry for wrinkle depth, corneometry for hydration) |
| Design | Randomised, controlled (vehicle or untreated zone) and blinded studies are stronger than open-label |
| Panel | Size and profile (age, skin type) must fit the claim and target consumer |
| Timepoints | The effect must be measured at the claimed time, or for the claimed duration |
| Effect size and comparator | "23% versus baseline" and "23% versus vehicle" are different statements |
| Statistical significance | The effect must not be plausibly due to chance |

Minimum panel sizes are an internal policy choice rather than one regulatory number, so the threshold lives in configuration (`POLICY_MIN_SAMPLE_SIZE`), not in code.

## 2.3 LLM runtime: why Ollama

| Consideration | Finding |
|---|---|
| Confidentiality | Unreleased formulas and clinical results are among the most sensitive data in R&I. Ollama runs the model on company hardware; nothing is sent to a third party. |
| Structured outputs | Since version 0.5, Ollama accepts a JSON Schema in the `format` field of `/api/chat` and constrains generation to it. This gives the same reliability benefit as hosted "structured output" APIs. |
| Reproducibility | `temperature: 0` and a fixed `seed` give stable answers for the same input. Model tags are pinned. |
| Context window | Ollama's default context window is small and **silently truncates** long inputs. A study report cut in half produces a confident but wrong answer. The engine sets `num_ctx` explicitly (`OLLAMA_NUM_CTX`, default 8192). |
| Latency | On a laptop CPU, an 8B model takes roughly 30 to 90 seconds per assessment; on a GPU, a few seconds. This drives the generous timeout, the progress indicator in the UI and the move to a queue on the roadmap. |
| Quality | Small open models are weaker than frontier hosted models at careful reasoning. Mitigations: extract-then-judge prompting, strict schema, criterion normalisation, one automatic retry, code guardrails, human review, and an easy upgrade path to larger models (`qwen2.5:14b`, `llama3.1:70b`) or another runtime through the `LlmProvider` interface. |
| Cost | No per-call fees. Cost is hardware, which is predictable. |

## 2.4 LLM engineering practices applied

- **Extract, then judge.** Asking for the study's facts before the verdict makes the model look at specifics, and gives the reviewer concrete values to check.
- **Self-reported confidence is not a probability.** It is recorded, but the stored confidence blends it with a rubric computed from the criteria.
- **Code checks the numbers.** Comparisons such as "23.4 ≥ 20" and "day 56 > day 28" are done in plain JavaScript, not by the model.
- **Prompt injection.** Study text is untrusted input. It is wrapped in `<evidence>` tags, the system prompt says to ignore instructions inside it, the output is schema-constrained, and the model has no tools, so injected text cannot trigger any action.
- **Versioning.** Every prompt change bumps `PROMPT_VERSION`; every assessment records the prompt version and model tag.
- **Normalisation.** Small models sometimes skip or repeat a criterion; the provider guarantees exactly one entry per criterion.

## 2.5 Alternatives considered

| Option | Why not chosen for this version |
|---|---|
| Hosted API (OpenAI, Anthropic, Azure OpenAI) | Stronger reasoning, but sends confidential data to a third party. Kept as a drop-in option behind `LlmProvider`, for example an EU-hosted enterprise deployment. |
| vLLM / TGI | Better throughput for many concurrent users. More operational work. A good production step once load grows; the provider interface allows it. |
| Rules only, no LLM | Reliable for numbers, but cannot read varied study reports. The design uses rules *and* the model. |
| Fine-tuned model | Needs a labelled dataset that does not exist yet. The review workflow creates that dataset. |
