# fainance-ai
AI-powered expense tracking app using receipt scanning and budget analytics.

# FaiNance

FaiNance is an AI-powered expense tracking application that helps users manage their personal budget by scanning receipts and extracting useful financial data automatically.

## Problem

Many people do not track their daily expenses consistently because manual budget entry is slow, repetitive, and easy to avoid. Paper receipts are often lost, ignored, or never analyzed.

FaiNance aims to solve this problem by allowing users to upload or scan receipts, automatically extract key information, and monitor spending against a defined monthly budget.

## Main Goals

- Simplify personal expense tracking
- Automate receipt data extraction
- Help users monitor monthly spending
- Provide a clear overview of budget usage
- Build a foundation for future AI-based financial insights

## Planned Features

- User registration and login
- Secure authentication with JWT
- Monthly budget setup
- Receipt upload and storage
- OCR-based receipt data extraction
- Expense history and analytics dashboard
- Budget progress tracking
- Category-based spending overview
- QR code receipt support
- AI-generated spending insights

## Tech Stack

### Frontend
- Next.js
- Tailwind CSS

### Backend
- FastAPI
- Uvicorn
- SQLAlchemy

### Database
- PostgreSQL

### AI / Document Processing
- Python
- OCR tools
- Optional ML-based categorization later

## Project Structure

```bash
fainance-ai/
├── frontend/
├── backend/
├── ml/
├── docs/
├── storage/
├── samples/
└── README.md
