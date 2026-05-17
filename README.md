# IT Support Ticket Dashboard

A frontend-only support-ticket management system inspired by real IT-support workflows. Users can create, prioritize, assign, filter, and resolve tickets from a responsive dashboard.

## Features
- Create tickets with title, requester, assignee, description, and priority
- Dashboard metrics for total/open/in-progress/resolved tickets
- Filter tickets by status and priority
- Update ticket status inline (Open, In Progress, Resolved)
- LocalStorage persistence so ticket data survives refreshes

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Browser LocalStorage

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build production bundle:
   ```bash
   npm run build
   ```

## Suggested Next Upgrades
- Supabase database
- Authentication
- Role-based access controls
- Comments on tickets
- File attachments

## Possible Repository Names
- supportdesk-lite
- it-ticket-dashboard
- helpdesk-flow
- ticketpilot
- supportboard

## Screenshots
Add dashboard screenshots after running the app locally.

## What I Learned
- How to model workflow-oriented UI state in TypeScript
- How to persist app state with LocalStorage
- How to compose reusable dashboard components with Tailwind utilities
