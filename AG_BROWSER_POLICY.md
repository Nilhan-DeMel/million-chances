# AG BROWSER POLICY

**INTERNAL BROWSER SUBAGENT DISABLED (broken $HOME env).**

- **Default verification** = CDP Chrome/Edge or Human Pilot.
- **NEVER** retry the broken internal browser subagent.
- **CDP First**: If automation is needed, use `chromium.connectOverCDP` via port 9222.
- **Human Pilot Fallback**: If CDP is blocked (Auth, etc.), ask Nilhan for manual verification.

---

### CDP Pre-requisites

- Browser must be launched with `--remote-debugging-port=9222`.
- Local profile path: `.cdp-profile/`
- Endpoint check: `http://localhost:9222/json/version`
