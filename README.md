# 🎓 Student Portfolio

A modern and responsive **Student Portfolio Website** developed using **React** and **Vite** as part of the **Advanced Web Development Frameworks (AWDF)** laboratory.

The application demonstrates component-based development, client-side routing, state management, and REST API integration by dynamically fetching GitHub repositories.

---

## 📌 Features

- 🏠 Home Page
- 👨‍🎓 About Me Section
- 💻 Skills Section
- 📂 Projects Page
- 📞 Contact Page
- 🌙 Dark / ☀️ Light Theme Toggle
- 🔀 React Router Navigation
- 🚫 Custom 404 Not Found Page
- 🔍 Search GitHub Repositories
- 🔄 Retry API Request
- ⏳ Loading Spinner
- ❌ Error Handling
- 📱 Fully Responsive Design

---

## 🛠️ Technologies Used

- React
- Vite
- JavaScript (ES6+)
- React Router DOM
- HTML5
- CSS3
- GitHub REST API
- Git & GitHub

---

## 📁 Project Structure

```
student-portfolio/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/HetGangani/portfolio-D25IT125.git
```

Move into the project

```bash
cd portfolio-D25IT125
```

Install dependencies

```bash
npm install
```

Run the project

```bash
npm run dev
```

---

## 🌐 GitHub API Used

```
GET https://api.github.com/users/{username}/repos
```

The Projects page dynamically fetches public repositories using the GitHub REST API.

---

# 📷 Screenshots

## 🏠 Home Page


<img width="1917" height="1078" alt="Screenshot 2026-07-19 104932" src="https://github.com/user-attachments/assets/4cc74f02-a69f-4c4b-b903-a0eeefa38315" />


---

## 📂 Projects Page


<img width="1917" height="1077" alt="Screenshot 2026-07-24 140715" src="https://github.com/user-attachments/assets/343d88c2-1deb-4c02-aa75-6eeda4d675f7" />


---

## 🔍 Repository Search

<img width="1917" height="1078" alt="Screenshot 2026-07-24 140851" src="https://github.com/user-attachments/assets/63306541-3f27-462d-90a0-adbe5bb2f6e0" />


---

## 🌙 Dark Theme

<img width="1917" height="1078" alt="Screenshot 2026-07-19 104932" src="https://github.com/user-attachments/assets/1bbaeabd-a4b8-42e5-90e4-d70fbcde2fa0" />


---

## ☀️ Light Theme


<img width="1917" height="1078" alt="Screenshot 2026-08-02 201731" src="https://github.com/user-attachments/assets/8690ffbb-94c5-4f82-968e-26efa350c086" />



---

## 📞 Contact Page

<img width="1917" height="1078" alt="Screenshot 2026-07-19 104850" src="https://github.com/user-attachments/assets/2b841320-6a40-474a-b560-f27aed9ac7aa" />

<img width="1917" height="1078" alt="Screenshot 2026-07-19 104917" src="https://github.com/user-attachments/assets/ada6442d-a8fd-485d-80f2-796154cd3aff" />


---

## 🚫 404 Page

<img width="1917" height="1075" alt="Screenshot 2026-08-02 202019" src="https://github.com/user-attachments/assets/0e98f04d-0522-4616-9bdf-753ade739270" />


---

## ⚡ Practical 8: Performance Optimization & Lazy Loading

### 🎯 Objective
To optimize the React frontend application by implementing route-based code splitting and lazy loading using `React.lazy()` and `Suspense`, reducing the initial JavaScript bundle footprint and avoiding loading flash with a minimum fallback delay.

---

### 🧩 Architecture & Implementation

1. **Route-Based Lazy Loading:**
   - Routes for **Projects** (`src/pages/Projects.jsx`), **Contact** (`src/pages/Contact.jsx`), and **Tasks** (`src/pages/Tasks.jsx`) were converted from static imports to dynamic imports using `React.lazy()`.
   - Dynamic imports are orchestrated through a custom `lazyWithDelay` helper in `src/App.jsx`:
     ```javascript
     const Projects = lazyWithDelay(() => import('./pages/Projects'), 300);
     const Contact = lazyWithDelay(() => import('./pages/Contact'), 300);
     const Tasks = lazyWithDelay(() => import('./pages/Tasks'), 300);
     ```

2. **Shared React Suspense Boundary & Fallback UI:**
   - A single, top-level `<Suspense>` boundary wraps the `<Routes>` hierarchy in `App.jsx`, ensuring that persistent chrome like `<Navbar>` remains rendered and responsive during route transitions.
   - A reusable, accessible fallback component `src/components/LoadingFallback.jsx` provides visual continuity. It includes accessibility attributes (`role="status"`, `aria-live="polite"`, `aria-busy="true"`) and integrates with existing theme classes (`.page`, `.spinner-container`, `.spinner`) to look seamless in both **Dark** and **Light** themes.

3. **300 ms Minimum Fallback Delay:**
   - On fast networks or localhost, dynamic chunks can resolve in milliseconds, creating a jarring, visual micro-flicker of the loading spinner.
   - The `lazyWithDelay` helper runs the module `import()` promise concurrently with a 300 ms timer promise using `Promise.all([importFn(), delayPromise])`.
   - **Parallel execution:** The fallback is guaranteed to display for at least 300 ms on fast connections. On slower connections (e.g. 1+ second chunk download), `Promise.all` resolves immediately once the chunk finishes, introducing **zero artificial delay** after the component is ready.
   - **Timer cleanup:** `clearTimeout` is safely invoked in `.finally()` to prevent background timer leaks if an import fails.

4. **Preservation of Route Protection:**
   - The `/tasks` route remains strictly guarded within `<Route element={<ProtectedRoutes />}>`.
   - When an unauthenticated user navigates to `/tasks`, `ProtectedRoutes` immediately intercepts the navigation and redirects to `/login` before the `Tasks` chunk is requested, conserving user bandwidth.
   - Public routes (`/`, `/about`, `/skills`, `/projects`, `/contact`, `/login`, `/register`) remain openly accessible.

---

### 📊 Production Build & Bundle Measurements

Verified output from `npm run build` with Vite:

#### Final Production Build Chunk Breakdown

| Asset | Size | Gzip |
|:---|---:|---:|
| **Main JavaScript** (`index-*.js`) | 239.43 kB | 76.58 kB |
| **Tasks chunk** (`Tasks-*.js`) | 7.98 kB | 2.32 kB |
| **Projects chunk** (`Projects-*.js`) | 1.77 kB | 0.85 kB |
| **Contact chunk** (`Contact-*.js`) | 1.49 kB | 0.56 kB |
| **ErrorMessage chunk** (`ErrorMessage-*.js`) | 0.56 kB | 0.31 kB |
| **CSS** (`index-*.css`) | 11.18 kB | 2.81 kB |

#### Baseline vs. Final Bundle Comparison

| Metric | Baseline (Pre-Optimization) | Final (Code-Split & Optimized) | Difference |
|:---|---:|---:|---:|
| **Main JavaScript** | 249.81 kB | 239.43 kB | -10.38 kB |
| **Gzipped JavaScript** | 78.67 kB | 76.58 kB | -2.09 kB |
| **CSS** | 11.18 kB | 11.18 kB | 0.00 kB |
| **Gzipped CSS** | 2.81 kB | 2.81 kB | 0.00 kB |

> **Note on Baseline Screenshot:** The original terminal screenshot for the pre-optimization baseline build is unavailable; therefore, the baseline values are documented directly from the recorded build output captured prior to code changes.

Vite successfully code-split the application into independent chunks. Browser Network inspection confirmed that `Projects` and `Tasks` chunks are transferred on-demand only when their respective navigation links are clicked.

---

### ⏱️ Browser Timing Evidence (Observed Run)

From the Home-page production preview run (`npm run preview`):
- **DOMContentLoaded:** 2.27 seconds
- **Load event:** 2.28 seconds

> *Note: These figures represent observed values from a single browser inspection run during manual preview verification, not a controlled laboratory benchmark or definitive proof of improvement. They are recorded here as observational evidence of runtime lifecycle metrics and are not directly compared against earlier development-server timing.*

#### Recommended Screenshot Artifacts
Screenshots demonstrating the optimization have been captured during conversation verification (note: the original baseline build screenshot is unavailable and documented from recorded measurements above). When committing evidence to the repository, save the following captures under `docs/screenshots/` (or attach as GitHub release/PR assets):
1. `docs/screenshots/network-home-initial-chunks.png` — Network tab showing only the initial bundle on first visit.
2. `docs/screenshots/network-projects-chunk-demand.png` — Network tab capturing `Projects` chunk downloaded upon clicking Projects.
3. `docs/screenshots/network-tasks-chunk-demand.png` — Network tab capturing `Tasks` chunk downloaded upon visiting `/tasks`.
4. `docs/screenshots/suspense-fallback-slow3g.png` — Visual capture of `LoadingFallback` displaying under Network "Slow 3G" throttling.

---

### 🔍 React DevTools Profiler: Re-render Optimization

1. **Initial Observation:**
   - The `Home` component (`src/pages/Home.jsx`) was a static component with no props, local state, or context dependencies.
   - However, during a theme-toggle interaction, the state update originated in `App` (`setDarkMode`), causing `Home` (and its children `Header`, `About`, `Skills`, and `Footer`) to re-render simply because its parent re-rendered, despite producing identical DOM output.

2. **Optimization Applied:**
   - Wrapped the exported component with `React.memo` in `src/pages/Home.jsx`:
     ```javascript
     import { memo } from "react";
     // ...
     export default memo(Home);
     ```
   - Verified that the production build succeeded cleanly after this modification.

3. **Profiler Verification:**
   - In React DevTools Profiler during a theme-toggle interaction (update triggered by `App`):
     - `Navbar` rendered as expected during the commit to update its theme button label.
     - `Home` was displayed as **`Home (Memo)` with diagonal hatching**, confirming that it did not render in the selected commit.
   - **Observed Commit Duration:** The Profiler recorded a total commit render duration of **4.5 ms**. This is an observed duration from one profiling run and does not by itself prove a measured speedup, but it confirms structurally and visually that the unnecessary re-render of `Home` was skipped.

---

### 💡 Theory Concepts & Viva Questions

#### 1. What is the difference between the initial bundle and lazy-loaded chunks in terms of when each is downloaded?
- **Initial Bundle (`index-*.js`):** Downloaded immediately upon the user's first visit to the application. It contains the essential runtime, routing framework, root layout (`Navbar`, global styles), and whatever entry page is initially requested.
- **Lazy-Loaded Chunks (`Projects-*.js`, `Contact-*.js`, `Tasks-*.js`):** Downloaded on-demand asynchronously over the network only when the user navigates to the specific route that references them. If a user never visits `/contact`, that code chunk is never downloaded.

#### 2. Why can lazy loading improve perceived performance even though the total amount of code downloaded eventually stays the same?
Even if a user eventually downloads all chunks over a long session, lazy loading significantly accelerates the **initial page load** by:
- Minimizing the initial JavaScript payload size that must travel over the network.
- Reducing the JavaScript parsing, compilation, and execution work the browser engine must perform before rendering the first frame.
- Improving critical user-centric metrics such as First Contentful Paint (FCP) and Time to Interactive (TTI), making the site feel responsive immediately.
- In practice, many users only interact with a subset of pages, resulting in a net reduction in bandwidth and memory usage.

#### 3. In what situations would lazy loading not be worth the added complexity?
Lazy loading introduces asynchronous boundaries, layout shift considerations, and fallback state handling. It is generally not worth the added complexity in:
1. **Very Small Applications:** If the entire uncompressed application bundle is small (e.g. under 50–100 kB), splitting it into tiny fragments introduces extra HTTP request round-trips whose network latency outweighs the negligible parsing savings.
2. **Critical Core Routes:** Pages or components that virtually every user needs immediately upon opening the app (e.g. the main dashboard or login view).
3. **High-Risk Disconnected / Offline Environments:** When users might encounter intermittent or lossy connectivity after the initial page load, relying on on-demand chunk downloads can cause navigation failures when the connection drops.

---

## ✨ Future Improvements

- Contact Form Backend
- Authentication
- Project Categories
- Resume Download
- Deployment using Vercel

---

## 👨‍💻 Author

**Het Gangani**

B.Tech Information Technology

CHARUSAT
