---
name: solid-kiss
description: >-
  Enforces SOLID and KISS principles in ALL code written, modified, or refactored.
  Applies to every programming language. Use this skill whenever writing code,
  designing software, creating classes, functions, modules, APIs, refactoring
  existing code, reviewing architecture, or making any software design decision.
  Trigger on any coding task — even simple scripts, utility functions, or quick
  prototypes benefit from these principles. Always active for coding tasks.
---

# SOLID + KISS Code Principles

Apply these principles to ALL code you write, modify, or refactor, in every language.
The goal: code that is simple, focused, and easy to change.

For BAD/GOOD code examples for each principle, read `references/examples.md`.

## SOLID

**S — Single Responsibility (SRP):** Every class, module, or function must have
exactly one reason to change. If the name needs "and" or "or", it is too broad.

**O — Open/Closed (OCP):** Add new behavior by extension (new classes, new
functions), not by modifying existing code. Replace growing if/elif chains with
polymorphic dispatch.

**L — Liskov Substitution (LSP):** Subtypes must be usable wherever their base
type is expected without breaking correctness. Honor the base contract — same
preconditions (or weaker), same postconditions (or stronger).

**I — Interface Segregation (ISP):** Prefer small, focused interfaces. Clients
should not depend on methods they do not use. Split fat interfaces into
role-specific ones.

**D — Dependency Inversion (DIP):** Depend on abstractions, not concretions.
Accept dependencies via constructor or function arguments. Do not instantiate
dependencies inside the class that uses them.

## KISS

- **Readability over cleverness** — code a new team member can understand in 30 seconds
- **Small functions** — target 20 lines, investigate at 30
- **No premature abstraction** — need two concrete uses before creating an interface
- **No premature optimization** — profile before optimizing
- **Flat over nested** — max three levels of nesting; use early returns and guard clauses

## Decision Checklist

Before writing or modifying code, verify:

1. Does each class/function have exactly one responsibility?
2. Can new behavior be added without editing existing code?
3. Are subtypes truly substitutable for their base types?
4. Are interfaces small and role-specific?
5. Are dependencies injected, not hard-coded?
6. Is the code readable to someone unfamiliar with it?
7. Are functions under 30 lines?
8. Is every abstraction justified by multiple concrete uses?
9. Is nesting three levels or fewer?
10. Have I avoided optimizing before measuring?

## Balancing SOLID and KISS

SOLID and KISS can conflict. When they do, prefer KISS:

- Do not add an interface just for DIP if there is only one implementation.
- Do not split a 10-line class into three classes just for SRP.
- Apply SOLID progressively: start simple, add structure when complexity demands it.

The litmus test: if the "principled" version is harder to read and there is only
one use case, keep the simple version.
