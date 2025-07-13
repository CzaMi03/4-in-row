
---
applyTo: '**'
---
[Instructions for creating a web application – "Connect Four" game]

1. **Project goal**
   - Create a modern web application implementing the "Connect Four" game.

2. **Functional requirements**
   - Two-player game (locally or with computer).
   - Graphical interface allowing column selection and board display.
   - Information about win, draw, or invalid move.
   - Ability to reset the game.

3. **Technical requirements**
   - Use modern web technologies (e.g. React, Vue, Svelte, or plain JS with HTML/CSS).
   - Code should be readable and split into logical modules/components.
   - **No single file may exceed 500 lines of code** (applies to JS/TS, CSS, HTML, etc.).
   - Follow best practices: DRY, KISS, SOLID (if applicable).
   - Add clear comments and documentation where needed.

4. **Testing**
   - Add unit tests for key game logic (e.g. win checking).
   - If possible, add end-to-end tests (e.g. Cypress, Playwright).

5. **UI/UX**
   - The interface should be responsive and user-friendly.
   - Ensure clarity and aesthetics (e.g. use simple animations, colors, hover effects).

6. **Project organization**
   - Split code into folders by functionality (e.g. components, logic, styles, tests).
   - Avoid code duplication.
   - Add a README file with project launch instructions and a short game guide.

7. **Additional recommendations**
   - Implement simple AI (optional).
   - Ensure accessibility (a11y) – e.g. keyboard support, proper contrast.
   - Use version control (e.g. git).

Example folder structure:

```
src/
  components/
  logic/
  styles/
  tests/
public/
README.md
```