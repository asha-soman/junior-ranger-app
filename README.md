# Junior Ranger Mobile Platform

## Project Overview

The Junior Ranger Mobile Platform is a role-based mobile application developed for the Queensland Indigenous Land and Sea Ranger Program (QILSR) as part of the QUT Industry Project unit.

The platform supports communication, coordination, and activity management between Admins, Rangers, and Junior Rangers through structured mobile workflows. The system includes cohort management, adventure participation, role-based access control, submission workflows, and user management features.

This project was developed as an interim Phase 1 solution focusing on foundational workflows and scalable mobile platform architecture.

---

# Tech Stack

## Frontend

- React Native
- Expo
- TypeScript

## Backend

- NestJS
- Node.js

## Database

- PostgreSQL
- Kysely ORM

## Tools & Platforms

- GitHub
- Jira
- Figma
- Postman
- Draw.io

---

## System Architecture

The platform follows a mobile-first client-server architecture.

```plaintext
Junior Ranger Mobile App
(React Native + Expo)
            ↓
    REST API Requests
            ↓
     NestJS Backend API
            ↓
 ┌─────────────────────┐
 │ Authentication      │
 │ Cohort Management   │
 │ Adventure Management│
 │ Invite Code System  │
 └─────────────────────┘
            ↓
    PostgreSQL Database
            ↓
         Kysely ORM
```

---

# Key Features

## Authentication & User Management

- JWT-based authentication
- Role-based access control (RBAC)
- User approval workflows
- Secure protected routes

## Cohort Management

- Create and manage cohorts
- Assign Rangers to cohorts
- Manage cohort members
- Role-based visibility restrictions

## Adventure / Mission Management

- Create adventures and missions
- Assign activities to Junior Rangers
- Submission and feedback workflows
- Approval and review process

## Mobile Workflows

- Mobile-first user experience
- Separate dashboards for each role
- Responsive navigation flows

---

# User Roles

## Admin

- Manage users and approvals
- Create and manage cohorts
- Assign Rangers
- Monitor platform activities

## Ranger

- Manage assigned cohorts
- Create and monitor adventures
- Review Junior Ranger submissions
- Provide feedback

## Junior Ranger

- View assigned cohorts
- Participate in adventures
- Submit responses and images
- View feedback and updates

---

# Project Structure

```plaintext
project-root/
│
├── backend/
│   ├── src/
│   ├── modules/
│   ├── database/
│   └── common/
│
├── mobile/
│   ├── src/
│   ├── screens/
│   ├── navigation/
│   ├── services/
│   └── components/
│
├── docs/
│   ├── design/
│   ├── testing/
│   ├── api/
│   └── system-documentation/
│
└── README.md
```

---

# Installation and Setup

## Prerequisites

Ensure the following tools are installed:

- Node.js
- npm
- PostgreSQL
- Expo Go (Mobile App)

---

# Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

The backend server will start on the configured local development port.

---

# Mobile Application Setup

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code using Expo Go to run the mobile application on a physical device.

---

# API Overview

The backend uses RESTful APIs built with NestJS.

## Main API Modules

- Authentication APIs
- User Management APIs
- Cohort Management APIs
- Adventure Management APIs
- Invite Code APIs

---

# Security Features

- JWT Authentication
- Role-Based Access Control
- Protected API Endpoints
- Permission Validation
- Secure User Access Management

---

# Testing and Validation

The project includes:

- API testing using Postman
- Role-based workflow testing
- Frontend navigation testing
- Validation and permission testing
- Integration testing between frontend and backend

---

# Known Limitations

The current Phase 1 implementation includes foundational functionality. The following features are planned for future development:

- Real-time notifications
- Cloud image upload integration
- Invite code feature
- Gamification features
- Real time email verification

---

# Future Improvements

Planned Phase 2 improvements include:

- Real-time activity notifications
- Improved adventure engagement features
- Cloud storage integration
- Enhanced approval workflows
- Expanded user communication features

---

# Academic Context

This project was developed as part of the Queensland University of Technology (QUT) Industry Project unit in collaboration with the Queensland Indigenous Land and Sea Ranger Program (QILSR).
