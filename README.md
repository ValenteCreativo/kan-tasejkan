# Martina's Sacred Geometry Portfolio

A stunning portfolio website featuring sacred geometry aesthetics with a black and blood-red color scheme and embroidered details. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- **🎨 Sacred Geometry Theme**: Beautiful animated geometric patterns (Flower of Life, Metatron's Cube)
- **🖼️ Portfolio Gallery**: Responsive grid layout with filtering by category
- **👑 Admin Dashboard**: Easy-to-use interface for managing artworks
- **📤 Image Upload**: Drag-and-drop file upload with preview
- **🎭 Smooth Animations**: Framer Motion powered transitions
- **📱 Fully Responsive**: Works perfectly on all devices
- **🔒 Database Integration**: Supabase backend for data storage
- **⚡ Modern Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS

## 🎨 Design Features

- Black background with blood-red (#8B0000) accents
- Sacred geometry patterns and animations
- Embroidered text effects with gold shimmer
- Glass morphism with blood tint effects
- Custom scrollbar styling
- Hover glow effects on interactive elements

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Supabase account (free tier works fine)

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** to find your project URL and anon key
3. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
4. This will create:
   - `artworks` table for storing artwork data
   - `categories` table for organizing artworks
   - Storage bucket named `artworks` for images
   - All necessary Row Level Security policies

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
bun dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
martina-store/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx             # Landing page
│   │   ├── globals.css          # Global styles & animations
│   │   ├── portfolio/
│   │   │   └── page.tsx         # Portfolio gallery
│   │   └── admin/
│   │       └── page.tsx         # Admin dashboard
│   ├── components/
│   │   ├── sacred-geometry/
│   │   │   ├── FlowerOfLife.tsx  # Animated sacred geometry
│   │   │   ├── Metatron.tsx      # Metatron's Cube animation
│   │   │   └── SacredPattern.tsx # Background pattern
│   │   ├── ui/
│   │   │   ├── Navigation.tsx    # Navigation bar
│   │   │   └── ArtworkCard.tsx   # Portfolio artwork card
│   │   └── admin/
│   │       ├── ArtworkForm.tsx   # Upload form
│   │       └── ArtworkList.tsx   # Admin artwork list
│   ├── lib/
│   │   └── supabase.ts          # Supabase client & helpers
│   └── types/
│       └── index.ts             # TypeScript types
├── public/                      # Static assets
├── supabase-schema.sql         # Database schema
└── README.md
```

## 🎯 Pages

### Landing Page (/)
- Hero section with animated Flower of Life
- Sacred geometry background patterns
- Call-to-action to view portfolio
- Feature cards highlighting the artistic approach

### Portfolio (/portfolio)
- Filterable gallery by category
- Responsive grid layout
- Artwork cards with hover effects
- Loading states with animated patterns

### Admin Dashboard (/admin)
- Upload new artworks with drag-and-drop
- Manage existing artworks
- Add metadata (title, description, category, year, etc.)
- Mark artworks as featured or available
- Delete artworks

## 🎨 Customization

### Colors

Edit the CSS variables in `src/app/globals.css`:

```css
:root {
  --background: #000000;
  --blood-red: #8B0000;
  --crimson: #DC143C;
  --dark-red: #660000;
  --embroidery-gold: #D4AF37;
}
```

### Sacred Geometry Components

The sacred geometry components accept props for customization:

```tsx
<FlowerOfLife
  size={200}           // Size in pixels
  animate={true}       // Enable/disable animation
  className="..."      // Additional CSS classes
/>
```

## 📦 Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Supabase**: Backend, database, and storage
- **React Dropzone**: File upload functionality
- **Lucide React**: Icon library
- **Sharp**: Image optimization

## 🔐 Security Notes

The current setup allows anyone to upload/delete artworks. For production:

1. **Enable Supabase Authentication**:
   - Set up email/password or OAuth
   - Update RLS policies to check `auth.uid()`

2. **Add Admin Protection**:
   - Implement authentication in the admin dashboard
   - Use middleware to protect `/admin` routes

3. **Update Storage Policies**:
   - Restrict upload/delete to authenticated admin users only

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repo to [Netlify](https://netlify.com)
3. Build command: `bun run build`
4. Publish directory: `.next`
5. Add environment variables
6. Deploy!

## 📝 To-Do / Future Enhancements

- [ ] Add authentication for admin dashboard
- [ ] Implement artwork detail pages
- [ ] Add image optimization and thumbnail generation
- [ ] Create contact form
- [ ] Add social media integration
- [ ] Implement artwork categories management
- [ ] Add search functionality
- [ ] Create image lightbox/modal view
- [ ] Add artwork ordering/sorting in admin
- [ ] Implement SEO optimization
- [ ] Add analytics

## 🙏 Credits

- Sacred Geometry patterns inspired by ancient wisdom
- Design aesthetic: Black, blood-red, and embroidered gold
- Built with love for artistic expression

## 📄 License

This project is open source and available under the MIT License.

---

**Made with 🖤 for Martina's Sacred Art Collection**
