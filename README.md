# SpaceX Launches Explorer

A Nuxt 3 app built with Vuetify, Apollo GraphQL, Pinia (with state persistence), and TypeScript to explore SpaceX launches, rockets, and manage favorite rockets.

---

## Project Overview

This project connects to the public SpaceX GraphQL API to display upcoming and past launches, rocket details, and allows users to save favorite rockets with persistent state stored in IndexedDB via Pinia plugin. The app is built with Nuxt 3, leveraging Vue 3 Composition API and Vuetify for UI.

---

## Features

- List all SpaceX launches with mission name, launch date, launch site, rocket name, and details.
- Filter launches by year using a composable.
- Sort launches by launch date (ascending/descending).
- Dynamic pages showing detailed rocket information.
- Global state management with Pinia for managing favorites.
- Persistence of favorites list in IndexedDB using `pinia-plugin-state-persistence`.
- Responsive UI with Vuetify.
- GraphQL queries handled by Apollo Client.
- Middleware to redirect unknown routes (if implemented).
- Deployed to Vercel for easy access.

---

## Setup Instructions

### Prerequisites

- Node.js >= 16.x
- npm or yarn
- Vercel account (for deployment)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
