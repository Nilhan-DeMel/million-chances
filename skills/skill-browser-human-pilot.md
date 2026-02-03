# Skill: Human Browser Pilot (Nilhan-Driven Verification)

**Purpose**: Leverage the human user (Nilhan) to perform complex browser actions (Login, Firebase Console config, manual layout checks) when automated tools are blocked or unreliable.

**When to Use**:

- Initial Google Auth setup (to bypass bot detection).
- Firebase Console configuration.
- Final visual "polish" checks.
- When automation scripts fail due to environment constraints.

---

## AG-Optimized Defaults

- **Driver**: Nilhan (Human)
- **Protocol**: Command-based instructions
- **Feedback**: Screenshots + Console Logs pasted back to AG

---

## SOP: "Nilhan-Run" Checklist

### 1. Preparation

AG provides Nilhan with a specific URL and a list of actions to perform.

### 2. Execution

Nilhan performs the actions in their primary browser.

### 3. Reporting

Nilhan provides:

- **Screenshots**: Full window captures of the final state.
- **Console Snippets**: If errors occur, copy-paste the Red logs.
- **Status**: A simple "Done" or "Blocked at step X".

---

## Evidence Format

When AG asks for Human Pilot verification, Nilhan should provide:

1. **Visual Proof**: One or more screenshots.
2. **Success Confirmation**: A brief text description of what worked.
3. **Observation**: Any quirks found during the manual run.

---

## Do / Don't

### ✅ Do

- Provide Nilhan with clear, numbered steps.
- Specify exactly what screenshot is needed (e.g., "The Firebase Hosting dashboard").
- Ask Nilhan's permission before requesting a manual sequence.

### ❌ Don't

- Ask Nilhan to perform repetitive tasks that _should_ be automated.
- Provide vague instructions like "check if it works".
- Expect Nilhan to debug complex stack traces manually.

---

## Example Interaction

**AG**: "Nilhan, I've updated the Firebase Rules. Can you please:

1. Open https://console.firebase.google.com/.../rules
2. Verify the 'Publish' button is grayed out (meaning it's already deployed).
3. Send me a screenshot of that screen."

**Nilhan**: [Provides Screenshot] "Looks good, rules are active."
