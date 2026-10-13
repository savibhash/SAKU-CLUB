# SAKU CLUB | The Secret Society

> *"One for all and all for me. Join to discover me."*

[![Live Site](https://img.shields.io/badge/Live_Site-Visit_SAKU_CLUB-ef4444?style=for-the-badge&logo=github)](https://savibhash.github.io/SAKU-CLUB/)


---

## Overview

**SAKU CLUB** is a dark-aesthetic digital sanctuary engineered for disciplined developers, creators, and operatives who value mastery, confidentiality, and craftsmanship. 

The platform features an encrypted member ledger, tiered role-based clearance, and an **Inner Sanctum** classified transmission feed accessible only to authenticated ranks.

---

## Key Features

* **Cinematic Dark UI:** High-performance dark aesthetic styled with the *Cinzel* and *Inter* typography pairings, glassmorphism cards, and smooth section navigation.
* **Founder Clearance Gate:** Access is strictly invite-only. Initiates cannot register without the secret Founder Clearance Key.
* **Rank & Clearance Hierarchy:** Tiered roles including *Founder*, *Co-Founder*, *High Council*, *Shadow Operative*, *Tech Specialist*, and *Initiate*.
* **Classified Inner Sanctum:** A token-authenticated dispatch feed allowing members to broadcast encrypted internal communications.
* **JWT & Hash Security:** User sessions authenticated via JSON Web Tokens (JWT) with passwords hashed securely using `bcryptjs`.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, Modern Vanilla CSS (Glassmorphism, CSS Grid/Flexbox), JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **Data Storage** | Local JSON Store (`members.json`, `sanctum_feed.json`) |
| **Deployment** | GitHub Pages (Frontend) |

---

## Project Structure

```text
SAKU-CLUB/
├── assets/              # Graphics, banners, and identity elements
├── index.html           # Core single-page application & client engine
├── server.js            # Express server handling auth & Sanctum feeds
├── members.json         # Encrypted membership ledger
├── sanctum_feed.json    # Classified dispatches
├── .gitignore           # Ignores node_modules, secrets, and large media
└── README.md            # Project documentation
