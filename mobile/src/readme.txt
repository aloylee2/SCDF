├── src/
│   ├── assets/                 //
│   │   ├── logos_post_emergency/
│   │   ├── logos_role_task_allocation/
│   │   ├── logos_training/
│   ├── components/             // Reusable UI components (e.g., Card, NavigationButton)
│   │   ├── DashboardCard.tsx
│   │   ├── BottomNavBar.tsx
│   │   └── ...
│   ├── navigation/             // Navigation stack configurations
│   │   ├── AppNavigator.tsx
│   ├── screens/                // Individual screens/pages
│   │   ├── HomeScreen.tsx      // This will be the myRESPONDER dashboard
│   │   ├── LearnScreen.tsx
│   │   ├── Call995Screen.tsx
│   │   ├── FireHazardScreen.tsx
│   │   ├── ViewMoreScreen.tsx
│   │   └── SecondScreen.tsx    // Keep for now, or remove if not needed in final app
│   ├── services/               // API calls, data fetching (already have api.ts)
│   │   ├── api.ts
│   ├── styles/                 // Global styles, theme
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── globalStyles.ts
│   └── utils/                  // Utility functions
│       ├── constants.ts
│       └── helpers.ts