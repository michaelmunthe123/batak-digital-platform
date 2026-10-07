# Batak Digital Knowledge Platform

An interactive digital knowledge platform for exploring **Batak culture, clans, genealogy, customs, kinship, language, regions, and cultural heritage** through structured and source-aware information.

> **Preserve the complexity, simplify the experience.**

---

## About the Project

Batak Digital Knowledge Platform is a web-based project designed to make information about Batak culture easier to explore, understand, and verify.

Information about Batak culture is often spread across books, academic publications, government archives, oral traditions, family records, and community sources.

This project aims to bring those materials into one structured digital platform while preserving an important principle:

**Different cultural traditions and sources may contain different versions of the same story.**

Instead of forcing one version to become the absolute truth, the platform is designed to preserve:

- source provenance,
- regional variations,
- disputed information,
- different classification systems,
- and levels of verification.

The project is currently developed as an independent learning and cultural preservation project.

---

## Main Features

### Cultural Knowledge Base

Explore structured information about:

- Batak cultural groups
- Marga / Merga
- Regions
- Customs and traditions
- Kinship systems
- Language varieties
- Cultural artifacts
- Textile and Ulos
- Architecture
- Culinary traditions
- Music and performances

---

### Marga Explorer

Browse and search Batak clans through dedicated profile pages.

Each profile can contain:

- overview,
- alternative names,
- cultural affiliation,
- historical information,
- regions,
- related clans,
- genealogical traditions,
- variations,
- and supporting sources.

---

### Cultural Map

Explore cultural information geographically.

The map uses representative locations and does **not** attempt to define rigid cultural boundaries.

---

### Adat Timeline

Traditions and ceremonies can be represented as structured timelines.

Each timeline step may contain its own:

- description,
- cultural context,
- source,
- regional variation,
- and verification status.

---

### Language & Dictionary

Explore Batak language varieties and dictionary entries with:

- meanings,
- word classes,
- usage notes,
- cultural context,
- and source references.

---

### Tarombo & Genealogy

The platform includes a genealogy data model and visualization foundation for exploring documented family relationships.

Genealogical information is designed to be:

- source-aware,
- privacy-conscious,
- capable of representing disputed traditions,
- and separated from general cultural relationships.

The system does **not** infer genealogical relationships simply because two people or clans share cultural similarities.

---

### Partuturan

A kinship rule engine helps explain documented kinship terminology within specific cultural contexts.

Possible results include:

- matched relationship,
- ambiguous relationship,
- unknown / insufficient information.

The system is intentionally designed to avoid guessing when available evidence is insufficient.

---

### Relationship Explorer

The platform distinguishes three different relationship systems:

```text
Knowledge Graph
Cultural relationships between entities

Genealogy Graph
Documented relationships between people

Kinship Rules
Cultural rules used to interpret family relationships
```

These systems are intentionally separated to prevent cultural association from being mistaken for genealogical descent.

---

### Community Contributions

Registered contributors can propose:

- corrections,
- new information,
- sources,
- cultural relationships,
- language information,
- genealogy information,
- and media.

Community members cannot directly modify published cultural information.

Contributions follow an editorial workflow:

```text
Draft
  ↓
Submit
  ↓
Editorial Review
  ↓
Evidence Verification
  ↓
Accepted / Disputed / Rejected
  ↓
Editor Merge
  ↓
Published
```

---

### Cultural AI Assistant

The platform includes an experimental AI assistant based on a source-grounded retrieval architecture.

The assistant is designed to retrieve information from the platform's verified knowledge base before generating an answer.

```text
User Question
      ↓
Hybrid Retrieval
      ↓
Published Knowledge
      ↓
Source Verification
      ↓
AI Response
      ↓
Citation Validation
```

If sufficient evidence is unavailable, the system should return an insufficient-information response instead of inventing an answer.

Private genealogy and living-person information are intentionally excluded from the public AI knowledge index.

---

## Source-Aware Knowledge

One of the core ideas behind this project is that **important cultural claims should be connected to their sources**.

A simplified example:

```text
Entity
  ↓
Claim
  ↓
Source
```

A claim can have statuses such as:

```text
Verified
Supported
Regional Variation
Disputed
Community Sourced
Draft
```

This allows multiple documented traditions to coexist when sources disagree.

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend & Database

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security

### Search

- PostgreSQL Full Text Search
- Trigram / fuzzy search
- pgvector
- Hybrid semantic search

### AI

- OpenAI Responses API
- OpenAI Embeddings
- Retrieval-Augmented Generation (RAG)
- Source-grounded response generation
- Citation validation

### Testing

- Vitest
- Playwright
- TypeScript
- ESLint

---

## Project Architecture

```text
User
 │
 ▼
Next.js Application
 │
 ├── Public Knowledge Platform
 ├── Cultural Exploration Tools
 ├── Community Contribution
 ├── Editorial Dashboard
 └── AI Assistant
 │
 ▼
Supabase
 │
 ├── PostgreSQL
 ├── Authentication
 ├── Storage
 ├── Row Level Security
 └── pgvector
```

---

## Project Roadmap

The original development roadmap consists of six major phases.

| Phase | Focus | Status |
|---|---|---|
| Phase 0 | Discovery & Foundations | ✅ Complete |
| Phase 1 | MVP Foundation | ✅ Complete |
| Phase 2 | Interactive Culture | ✅ Complete |
| Phase 3 | Genealogy & Kinship | ✅ Complete |
| Phase 4 | Community & Contribution | ✅ Complete |
| Phase 5 | AI & Mature Platform | ✅ Complete |

The project has completed its initial architectural roadmap.

Current work focuses on:

- validating the complete application locally,
- expanding verified cultural content,
- improving UI/UX,
- reviewing sources,
- conducting user testing,
- and preparing a public beta.

---

## Project Structure

```text
batak-digital-platform/
│
├── app/                 # Next.js routes and pages
├── components/          # UI components
├── lib/                 # Application and domain logic
├── docs/                # Project documentation
├── supabase/
│   ├── migrations/      # Database migrations
│   └── seed.sql         # Development seed data
│
├── tests/               # Automated tests
├── public/              # Static assets
├── README.md
└── package.json
```

---

## Local Development

### Requirements

Before starting, install:

- Node.js
- npm
- Git
- VS Code

A Supabase project is required for the complete database functionality.

OpenAI API access is optional and only required for AI features.

---

### Install Dependencies

```bash
npm install
```

---

### Environment Variables

Create:

```text
.env.local
```

Use `.env.example` as the reference.

Never commit `.env.local` or any secret API key to the repository.

---

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Verification

The project contains verification scripts for every development phase.

Run:

```bash
npm run verify:all
```

Additional checks:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

For end-to-end testing:

```bash
npx playwright install
npm run test:e2e
```

---

## Data & Cultural Integrity

This project does not assume that every cultural topic has one universally accepted interpretation.

Special care is given to:

- genealogical claims,
- clan origins,
- oral traditions,
- regional customs,
- language variations,
- living-person information,
- and disputed historical information.

Whenever possible, claims should be supported by academic, institutional, archival, expert, or clearly identified community sources.

The platform is intended to document cultural knowledge, not declare one family or tradition as universally authoritative.

---

## Privacy

Genealogical information involving living people requires stronger privacy protection.

Private family information must not be exposed through:

- public pages,
- semantic search,
- AI retrieval,
- or public APIs.

---

## Contribution Philosophy

Community participation is encouraged, but popularity does not determine cultural truth.

Contributor activity scores represent editorial participation only and **do not represent cultural authority**.

---

## Current Status

The application architecture and original Phase 0–5 roadmap have been implemented.

The project is currently in the **local validation and content development stage**.

Some integrations still require developer-side environment configuration before production deployment.

---

## Future Work

Future improvements may include:

- larger verified cultural datasets,
- stronger mobile UX,
- expanded multilingual support,
- richer cultural visualizations,
- additional institutional sources,
- expert review partnerships,
- usability testing,
- public beta deployment,
- and long-term cultural preservation workflows.

---

## Disclaimer

Batak culture contains significant diversity across regions, communities, families, languages, and traditions.

Information presented by this platform should therefore be understood within its documented source and cultural context.

Corrections and well-sourced contributions are encouraged.

---

## License

A project license has not yet been finalized.

Cultural data and third-party media may have different source-specific copyright and usage restrictions.

---

## Author

Developed as an independent Computer Science and cultural technology project.

---

## Project Status

**Active Development**