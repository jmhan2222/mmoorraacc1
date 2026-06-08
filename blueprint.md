# Project Blueprint: morrac x Flink | 티 타임 타임머신

## Overview
A collaboration project between **morrac** and **Flink** featuring a "Tea Time Time Machine." This web application helps users perfectly brew different types of tea (Fresh Green Tea, Matcha, Aged Pu-erh Tea) with specialized timers and allows them to record their sensory experiences (flavor weight, preference, and memos) which are stored in Firebase Firestore.

## Project Details & Features

### Core Capabilities
- **Timed Tea Brewing**: Specialized timers for three types of tea:
    - **Fresh Green Tea (햇 녹차)**: 2 minutes (120s)
    - **Matcha (햇 말차)**: 1 minute (60s)
    - **Aged Pu-erh Tea (묵은 보이차)**: 3 minutes (180s)
- **Sensory Recording (Tasting Notes)**: Users can log their sensory data:
    - Flavor Weight (Light to Heavy)
    - Preference Level
    - Descriptive Memo
- **Firebase Integration**: Real-time storage of tasting notes in Firestore.
- **Reminders**: Future-dated reminders for morning tea sessions.

### Design & Aesthetics
- **Theme**: Minimalist, serif-focused typography (`Noto Serif KR`).
- **Color Palette**: 
    - Background: `#FAF8F5` (Off-white/Beige)
    - Primary Text: `#3A3530`
    - Accent Green: `#3A483A` / `#2C3E2B`
    - Muted Tones: `#A8A095`, `#EFECE6`
- **Interactive UI**:
    - Animated transitions for tea switching.
    - Custom range sliders for sensory input.
    - Backdrop blur effects on the sticky header.
    - Soft shadows for cards.

### Technical Stack
- **Frontend**: HTML5, Vanilla JavaScript (ES Modules).
- **Styling**: Tailwind CSS (v4 via CDN), Custom CSS.
- **Backend**: Firebase Firestore.
- **Deployment**: Firebase Hosting (intended).

## Current Implementation Plan
1. **Modularize Code**: Separate the large single-file HTML into `index.html`, `style.css`, and `main.js`.
2. **Setup Firebase Structure**: Ensure the Firebase initialization is clean and uses environment-friendly patterns.
3. **Enhance UI/UX**: Add subtle textures and effects as suggested by `GEMINI.md`.
4. **Validation**: Test the timer logic and the recording functionality.
