# TunisiaTrip (チュニジア旅行)

TunisiaTrip is a premium, modern travel guide and management platform dedicated to showcasing the beauty and culture of Tunisia. Architected with a **Japanese-first philosophy**, this application provides a seamless, localized experience for Japanese travelers exploring Tunisia.

## 🇯🇵 Japanese-First Localization
Built from the ground up for the Japanese market, the project features a custom-built localization architecture.
- **100% Japanese Coverage**: Every interface, from the discovery pages to the administrative dashboard, is fully translated.
- **Custom Localization Hook**: A robust `useTranslation` system that manages static translations, dynamic API-driven content, and persistent user preferences.
- **Intelligent Search**: A localized search engine that understands both English and Japanese keywords, providing relevant results with localized metadata.

## 🚀 Technology Stack

### Frontend Core
- **React 18**: Utilizing functional components and modern hooks for a reactive user interface.
- **TypeScript**: Ensuring end-to-end type safety, making the codebase maintainable and reducing runtime errors.
- **Vite**: Providing an exceptionally fast development experience and optimized production builds.

### UI & Styling
- **Tailwind CSS**: A utility-first CSS framework for rapid development and consistent design across all components.
- **Lucide React**: A clean and consistent icon set optimized for modern web applications.
- **Radix UI**: Accessible, unstyled UI primitives used to build high-quality interactive components.
- **Modern Typography**: Carefully selected fonts (Inter, Roboto, or Outfit) to ensure readability and a premium feel.

### Connectivity & Backend
- **Supabase**: A powerful PostgreSQL-based backend-as-a-service providing authentication, real-time database capabilities, and secure file storage.
- **TanStack Query (React Query)**: Managing server state with powerful caching, synchronization, and error-handling capabilities.
- **React Router**: Client-side routing for single-page application navigation.

## 💪 Strengths & Architectural Rationale

1. **Robust Type Safety**: Using **TypeScript** allowed us to define clear interfaces for complex data structures like itineraries and localized search results, significantly improving developer productivity and code reliability.
2. **Component-Based Architecture**: **React**'s component model enabled us to build a reusable design system, ensuring visual consistency between the public-facing travel guide and the internal administrative tools.
3. **Speed of Development**: The combination of **Vite** and **Tailwind CSS** allowed for near-instant feedback during the development process, enabling rapid iteration on UI/UX components.
4. **Localization Excellence**: By using a **custom translation system** instead of generic libraries, we were able to implement site-specific logic such as domain-based language detection and intelligent Japanese text analysis (using Kuroshiro).
5. **Modern Backend Integration**: **Supabase** removed the need for separate server management, allowing us to focus entirely on building high-quality user features.

## ✨ Key Features
- **Dynamic Travel Directory**: Explore cities, activities, and accommodations in Tunisia.
- **AI-Enhanced Search**: Find exactly what you're looking for with an intelligent, multi-lingual search interface.
- **Comprehensive Admin Dashboard**: Manage blog posts, travel packages, and user inquiries with ease.
- **SEO Optimized**: Advanced SEO management tools built directly into the administrative panel.
- **Mobile First**: Fully responsive design that ensures a premium experience on any device.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---
Built with ❤️ for Tunisia and its guests.
