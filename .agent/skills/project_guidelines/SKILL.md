---
name: project-guidelines
description: Core guidelines, coding standards, and architectural context for the Poke Word Chain project. Use this to understand the project structure, tech stack, and critical rules before making changes.
---

# Project Guidelines: Poke Word Chain

## 1. Project Overview
"Poke Word Chain" is a Pokemon-themed word chain game (Kkeut-mal-it-gi) featuring a hybrid architecture of local logic and AI.
- **Goal**: Users play word chain against an AI persona.
- **Core Logic**:
    - **Local**: Word validation (existence, dueum law) via `pokemonData.json`.
    - **Cloud**: AI persona (LLM) for conversation and STT/TTS for voice interaction.

## 2. Tech Stack & Environment
- **Framework**: React 18 + Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Utility-first)
- **State Management**: React Context API
- **Testing**: Vitest + React Testing Library
- **Package Manager**: npm

## 3. Architecture & Folder Structure
- `src/components`: UI components (Functional, Atomic design principles).
- `src/hooks`: Custom React hooks (logic separation).
- `src/utils`: Pure functions (e.g., `gameLogic.ts`, `hangul.ts`).
- `src/data`: Static data (`pokemonData.json`).
- `src/services`: API integrations (Groq STT, Gemini LLM).
- `src/context`: Global state (GameContext, AudioContext).

## 4. Coding Standards

### TypeScript
- **No `any`**: Always define proper interfaces/types.
- **Interfaces**: Prefix with `I` is NOT required. Use descriptive names (e.g., `Pokemon`, `GameState`).
- **Props**: Use `interface` for component props (e.g., `ChatBubbleProps`).

### React
- **Functional Components**: Use `const Component = () => {}` syntax.
- **Hooks**: meaningful extraction of logic into custom hooks.
- **Performance**: Use `useMemo` an `useCallback` appropriately for expensive operations, but don't premature optimize.

### Tailwind CSS
- Use utility classes directly in `className`.
- For complex conditional styling, use `clsx` or `tailwind-merge`.
- Follow mobile-first responsive design.

### Naming Conventions
- **Files**: PascalCase for components (`ChatBubble.tsx`), camelCase for utilities/hooks (`useGame.ts`).
- **Variables**: camelCase (`currentWord`, `isPlayerTurn`).
- **Constants**: UPPER_SNAKE_CASE (`MAX_TURN_TIME`).

## 5. Critical Domain Rules (MUST FOLLOW)

### A. Korean Initial Sound Law (Dueum Law)
- **Rule**: When a word ends with a specific character, the next word can start with a converted character.
- **Logic**: Use `src/utils/hangul.ts` (or equivalent) to handle this.
    - `ㄹ` -> `ㄴ` (e.g., 리 -> 니) - context dependent.
    - `ㄹ` -> `ㅇ` (e.g., 림 -> 임).
    - `ㄴ` -> `ㅇ` (e.g., 녀 -> 여).
- **Verification**: Always check if the user's input matches *either* the original ending character *or* the Dueum Law converted character.

### B. Pokemon Data Validation
- **Source of Truth**: `src/data/pokemonData.json`.
- **Validation**: All user inputs must be verified against this list. AI generated words must also exist in this list.

## 6. Workflow & Commands
- **Start Dev Server**: `npm run dev`
- **Run Tests**: `npm run test` (or `npx vitest`)
- **Linting**: `npm run lint`
- **Build**: `npm run build`

## 7. Common Pitfalls to Avoid
- **Hallucinated Pokemon**: Do not let the LLM invent Pokemon names. Always validate against the JSON.
- **State Desync**: Ensure UI state reflects the internal game engine state.
- **Race Conditions**: Handle async API calls (STT/LLM) carefully to prevent turn skipping.
