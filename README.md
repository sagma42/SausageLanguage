# Sausage Language

This project is a simple React/Vite application for managing and browsing words in three languages. It was created to support the “Sosis Dili” project and includes:

- **Home page**: search bar with placeholder, filters (new-old, old-new, most liked, saved, random), and a list of words displayed in three languages with optional description.
- **Admin area**: login form located at the top right corner; once authenticated you can add new words manually (three language fields plus optional description).
- **Like system**: each machine may like a word only once. Likes are stored locally.
- **Save system**: words can be saved and viewed via the “Saved” filter.
- **Navigation**: home button top left; admin/login top right.
- **Discord link**: bottom-left corner directs to the community server.

## Getting started

1. Clone or open the repository in a terminal.
2. Install dependencies (the project uses `react-router-dom`):
   ```bash
   npm install
   # or yarn
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:5173` (or whatever Vite reports).

### Admin credentials

- Username: `ustsahis`
- Password: `316942`

## Notes

- Data is stored in `localStorage` so it persists between reloads on the same browser.
- No backend is included; this is purely a front-end prototype.

Feel free to modify and extend the functionality as needed.
