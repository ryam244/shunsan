# DEBUG_PROTOCOL.md - Automated Quality Assurance Checklist

## 1. Trigger
Perform this "Self-Correction Audit" immediately after generating any code for a new feature or updating an existing one.

## 2. Audit Checklist

### A. Static Code Analysis (Syntax & Types)
- [ ] **Type Safety:** Are all props and states strictly typed? (No implicit `any`).
- [ ] **Imports:** Do all imported components/hooks actually exist? Are paths relative/absolute correct?
- [ ] **Exports:** Is the component exported correctly (`export default` vs named export)?
- [ ] **Hooks:** Are Rules of Hooks followed? (No conditional hooks).
- [ ] **Unused Code:** Are there unused variables or imports? (Remove them).

### B. Integration & Conflicts (Routing & State)
- [ ] **Expo Router Paths:** Does the `router.push('/path')` match the actual file structure in `app/`?
- [ ] **Param Passing:** Are route parameters (`useLocalSearchParams`) typed and handled correctly?
- [ ] **State Collisions:** Does the new code overwrite or conflict with existing global state (Zustand/Context)?
- [ ] **Component Props:** Do the passed props match the Child Component's interface exactly?

### C. UI & UX Robustness
- [ ] **SafeArea:** Is `SafeAreaView` (or correct padding) used to prevent notch overlap?
- [ ] **Keyboard:** Is `KeyboardAvoidingView` implemented for inputs?
- [ ] **Scroll:** Are lists wrapped in `ScrollView` or `FlatList` to prevent cutoff?
- [ ] **Loading/Error:** Are `isLoading` and `error` states visually handled?

## 3. Auto-Fix Action
If any issues are found during this mental audit:
1.  **Fix the code immediately** in the output.
2.  Do NOT output broken code with a "fix later" note.

## 4. Conflict Report Format
If you detect a potential conflict that requires user decision (e.g., breaking change in data model), append a report:

```text
[Potential Conflict Detected]
- Issue: Modifying 'User' interface breaks 'ProfileScreen'.
- Proposed Fix: Updated 'ProfileScreen' to match new interface.
