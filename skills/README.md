# Skills Directory

## What Are Skill Packs?

Skill packs are **AG-optimized implementation guides** that provide:

- **When to use**: Clear triggers for applying each skill
- **Installation**: Commands that detect package manager automatically
- **Usage patterns**: Minimal, app-specific code snippets
- **Verification**: How to prove the skill is working
- **Evidence**: Exact artifacts to show stakeholders
- **Source links**: Official documentation references

## How AG Uses Skill Packs

When assigned a task, AG will:

1. **Read the skill index** to identify relevant skills
2. **Load specific skill pack(s)** and follow their guidelines
3. **Apply AG-optimized defaults** (not generic boilerplate)
4. **Verify implementation** using the checklist
5. **Gather evidence** as specified in each pack

## Philosophy

- **Skills-first**: Install and wire dependencies BEFORE building features
- **Consistency**: Every pattern follows the same approach across the app
- **Verifiable**: Each skill includes proof-of-work checks
- **Documented decisions**: "Why we chose X over Y" is explicit

## Quality Gates

To ensure world-class quality, we integrate:

- **E2E Testing**: Every PR is checked via Playwright for functional correctness.
- **Accessibility (a11y)**: Automatic Axe scans ensure we meet WCAG standards.
- **Rules Testing**: Security rules are verified locally before deployment.
- **Repo Sync**: Standardized 3-copy sync (Local ↔ GitHub ↔ Firebase) for deterministic deployments.

## ⚠️ Browser Subagent Disabled

The internal `$HOME`-dependent browser subagent is **DISABLED**. All browser verification must use:

1. **CDP Browser**: Automation via external Chrome/Edge (Remote Debugging).
2. **Human Pilot**: Manual verification steps by the user.

## Skill Index

See [SKILL_INDEX.md](./SKILL_INDEX.md) for the complete catalog of available skills.
