# 📄 E-comZein OS — Changelog

All notable changes to the E-comZein OS application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.0] - 2026-07-25

### Added
- **Authentication System**: Single Owner Login, Dual Tokens (15m Access Token & 30d Refresh Token) stored in HttpOnly Secure Cookies, bcrypt Password Hashing.
- **Password Reset Flow**: Time-limited single-use token with SHA-256 database hashing and Nodemailer integration.
- **Ventes & Prospects Module**: Complete prospects pipeline (6 stages), instant search, and quote generation engine.
- **Operations & Installations**: Order confirmation with Rule 001 mandatory 50% deposit enforcement, signed PV installation closure (Rule 002), and automatic 12-Month equipment warranty activation (Rule 004).
- **Audit Logging**: Append-only security audit log recording all sensitive system state changes.
- **Express Backend REST API**: Versioned endpoints (`/api/v1/`), Zod validation, Helmet security headers, CORS origin restrictions, Rate Limiting (5 tries / 15m), and PM2 production process configuration.
- **Progressive Web App (PWA)**: Service Worker offline caching and LocalStorage state rehydration on refresh (`Ctrl + F5`).

### Changed
- Refactored Primary Keys from UUIDv7 to native Prisma `cuid()` for optimal database query performance.
- Standardized Health Endpoint to `GET /api/v1/health` returning database status, version, and process uptime.

### Fixed
- Restored state rehydration to eliminate blank screen reloads.
- Streamlined mobile navigation bottom bar and sidebar menu items.

---

### Known Issues
- None in code review; real empirical benchmarks to be verified during post-deployment live audit on Hostinger.
