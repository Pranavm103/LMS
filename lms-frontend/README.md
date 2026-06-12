# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Tailwind CSS installation with Vite

Official docs: https://tailwindcss.com/docs/installation/using-vite

1. Install Tailwind CSS and the Vite plugin:

   ```sh
   pnpm add tailwindcss @tailwindcss/vite
   ```

2. Add the Tailwind CSS plugin to `vite.config.js`:

   ```js
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   import tailwindcss from "@tailwindcss/vite";

   export default defineConfig({
     plugins: [react(), tailwindcss()],
   });
   ```

3. Import Tailwind CSS in your main CSS file, such as `src/index.css`:

   ```css
   @import "tailwindcss";
   ```

4. Start the development server:

   ```sh
   pnpm dev
   ```

5. Use Tailwind utility classes in your components:

   ```jsx
   export default function App() {
     return <h1 className="text-3xl font-bold underline">Hello world!</h1>;
   }
   ```

## shadcn/ui installation with JavaScript

Official docs:

- https://ui.shadcn.com/docs/installation/vite
- https://ui.shadcn.com/docs/javascript

This project is configured for JavaScript shadcn/ui components. The important setting is `"tsx": false` in `components.json`, which tells the shadcn CLI to generate `.jsx` components instead of `.tsx` components.

1. Configure JavaScript path aliases in `jsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "jsx": "react-jsx",
       "paths": {
         "@/*": ["./src/*"],
         "@components/*": ["./src/components/*"],
         "@hooks/*": ["./hooks/*"],
         "@lib/*": ["./src/lib/*"],
         "@ui/*": ["./src/components/ui/*"],
         "@utils": ["./src/lib/utils"],
         "@api/*": ["./src/api/*"],
         "@store/*": ["./src/store/*"]
       }
     },
     "include": ["src", "src/components", "src/lib", "hooks", "vite.config.js"]
   }
   ```

2. Reference the JavaScript config from `tsconfig.json`:

   ```json
   {
     "extends": "./jsconfig.json"
   }
   ```

3. Enable TypeScript path resolution in `vite.config.js`:

   ```js
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   import tailwindcss from "@tailwindcss/vite";

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     resolve: {
       tsconfigPaths: true,
     },
   });
   ```

4. Initialize shadcn/ui:

   ```sh
   pnpm dlx shadcn@latest init --preset b7W7uXIq8 --base base --template vite
   ```

5. Use JavaScript settings in `components.json`:

   ```json
   {
     "$schema": "https://ui.shadcn.com/schema.json",
     "style": "base-luma",
     "rsc": false,
     "tsx": false,
     "tailwind": {
       "config": "",
       "css": "src/index.css",
       "baseColor": "taupe",
       "cssVariables": true,
       "prefix": ""
     },
     "iconLibrary": "lucide",
     "rtl": false,
     "aliases": {
       "components": "@/components",
       "utils": "@/lib/utils",
       "ui": "@/components/ui",
       "lib": "@/lib",
       "hooks": "@/hooks"
     },
     "menuColor": "default",
     "menuAccent": "subtle",
     "registries": {}
   }
   ```

6. Add generated components as needed:

   ```sh
   pnpm dlx shadcn@latest add button
   ```

7. Import generated components from the configured aliases:

   ```jsx
   import { Button } from "@/components/ui/button";

   export default function App() {
     return <Button>Click me</Button>;
   }
   ```

# 🎓 Mini Udemy --- Frontend Feature Guide

## 🧠 Overview

You will build the frontend for a full-stack learning platform using:

- React + Router
- Redux Toolkit (RTK Query)
- shadcn/ui (UI components)

---

# 📄 Pages (Route-Level)

## 🌐 Public Pages

### 🏠 Home Page

- List all courses
- Display course cards
- (Optional) Search functionality

### 📘 Course Details Page

- Course title & description
- Instructor info
- Lecture list (preview)
- Enroll button

---

## 🔐 Auth Pages

### 🔑 Login Page

- Email & password input
- Error handling
- Redirect after login

### 📝 Register Page

- Name, email, password
- Role selection (student/instructor)

---

## 🎓 Student Pages

### 📊 Dashboard

- List of enrolled courses
- Show progress %

### 📚 My Courses

- View enrolled courses

### 🎥 Course Player Page (Core Page)

- Video player
- Lecture sidebar
- Mark lecture as completed
- Progress bar

---

## 👨‍🏫 Instructor Pages

### 📊 Instructor Dashboard

- Courses created
- Total students

### ➕ Create Course

- Title, description, thumbnail upload

### ✏️ Manage Courses

- Edit course
- Delete course
- Add lectures

---

## 🤖 AI Feature

### 💬 AI Chat Panel

- Ask questions
- Streaming responses
- Chat UI

---

# 🧩 Components

## Common

- Navbar
- Loader
- Error message

## Course

- CourseCard
- CourseList
- CourseForm
- LectureList
- LectureItem

## Player

- VideoPlayer
- ProgressBar
- LectureSidebar

## Auth

- LoginForm
- RegisterForm

## AI

- AIChat
- ChatMessage
- ChatInput

---

# ⚙️ Functionality

## Authentication

- Register / Login / Logout
- Persist session

## Courses

- View / Create / Edit / Delete

## Lectures

- Add / Watch / Navigate

## Enrollment

- Enroll / Prevent duplicates / View courses

## Progress

- Mark complete / Track % / Resume

## API (RTK Query)

- Fetch data
- Cache data
- Auto updates

## UI

- Responsive
- Reusable components
- Toasts

## AI

- Ask questions
- Streaming responses

---

# 🧠 State Management

## Global

- Auth
- API cache

## Local

- Forms
- UI state

---

# 🧭 Layouts

- MainLayout
- DashboardLayout

---

# 🔗 Routes

/\
/login\
/register\
/courses/:id\
/dashboard\
/my-courses\
/player/:courseId\
/instructor\
/instructor/create\
/instructor/manage

---

# 🏆 Goal

Build a production-ready frontend with clean architecture and modern
practices.
