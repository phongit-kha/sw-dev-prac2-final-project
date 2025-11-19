# Library Management Frontend

Modern Next.js 15 frontend that consumes the [`p02-library`](../p02-library) API to power a real-world book reservation experience. The project uses React 19, Tailwind CSS 4, and NextAuth (Credentials provider) to mirror the production-ready “Exhibition Booth Booking” layout.

## Features

- Landing page with hero, stats, workflow, testimonials, and live book highlights from `/api/v1/books`
- Authentication via NextAuth (credentials flow) hitting `/auth/login`, `/auth/register`, `/auth/me`
- Member dashboard
  - Browse books with rich cover art
  - Create/view/edit/delete reservations (max 3, borrow ≥ today, pickup ≥ borrow)
- Admin dashboard
  - Create/update/delete books and adjust stock
  - View/edit/delete every reservation
- Protected routes enforced by `middleware.ts`

## Environment

Create `.env.local`:

```
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
LIBRARY_API_BASE=http://localhost:5004/api/v1
NEXT_PUBLIC_LIBRARY_API_BASE=http://localhost:5004/api/v1
```

## Commands

```
pnpm install
pnpm dev
pnpm build
```

## Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/   # NextAuth handler
│   ├── admin/                    # Admin pages (books + reservations)
│   ├── member/                   # Member pages (books + reservations)
│   ├── profile/                  # View logged-in profile
│   ├── login/ & register/        # Auth forms
│   ├── demo/                     # Product video page
│   ├── layout.tsx                # Root layout with header
│   └── page.tsx                  # Landing page
├── component/                    # Reusable UI blocks
├── libs/                         # API helpers and utilities
├── providers/                    # NextAuth provider
└── styles/                       # Tailwind globals
```

## Backend Integration Notes

- All requests use `LIBRARY_API_BASE`
- Authenticated requests append `Authorization: Bearer <token>`
- Client forms perform basic validation, but backend rules (reservation limits, date checks) remain the source of truth

## Next steps

- Swap the demo video/link inside `src/app/demo/page.tsx` with your actual product video
- Extend `src/libs/bookCovers.ts` with more mappings to match real book titles
