# Housing Register Feature

## Overview
The Housing Register is a beautiful, user-friendly page that allows Johannesburg residents to register for housing opportunities with the Shosholoza Progressive Party.

## Features

### 🏢 Design Elements
- **Architectural Theme**: Animated building silhouettes with window patterns
- **Modern UI**: Clean, professional design with green and gold color scheme
- **Responsive**: Works perfectly on mobile, tablet, and desktop
- **Animations**: Smooth page transitions and form interactions
- **Custom Cursor**: Fast, responsive cursor (fixed from slow version)

### 📝 Registration Form
Collects the following information:
- Full Names
- ID Number
- Residential Address
- Email Address
- Telephone Number

### 🎨 Visual Highlights
- Animated high-rise building silhouettes with lit windows
- Gradient backgrounds with architectural patterns
- Icon-enhanced form fields
- Smooth hover and click animations
- Professional shadow effects

### 💬 Campaign Messaging
**Main Slogan**: "Adequate housing for all in Joburg"

**Promises**:
- High Rise Blocks from South to North and East to West
- Register now for your own house
- Vote Shosh and see the Magic! ✨

### 🏗️ Benefits Section
Showcases three key benefits:
1. **Modern High-Rise Living**: State-of-the-art apartment blocks
2. **Accessible Locations**: Housing from South to North, East to West
3. **Affordable Housing**: Quality homes accessible to all residents

## Setup Instructions

### 1. Database Setup
Run the SQL patch in your Supabase dashboard:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to SQL Editor
4. Copy and paste the contents of `housing-applications-patch.sql`
5. Click "Run" to execute

This creates the `housing_applications` table with:
- Full form fields
- Status tracking (pending, approved, rejected, waiting_list)
- Row Level Security policies
- Performance indexes

### 2. Access the Page
Once the database is set up, navigate to:
```
http://localhost:8080/housing
```

## Technical Details

### File Structure
```
src/
  pages/
    HousingRegister.tsx     # Main housing registration page
  components/
    CustomCursor.tsx        # Fixed cursor component (faster speed)
App.tsx                     # Route added: /housing
supabase-schema.sql         # Updated with housing table
housing-applications-patch.sql  # Quick setup SQL for housing table
```

### Database Schema
```sql
housing_applications (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ,
  full_names TEXT,
  id_number TEXT,
  residential_address TEXT,
  email TEXT,
  telephone TEXT,
  status TEXT DEFAULT 'pending'
)
```

### Route
- **Path**: `/housing`
- **Component**: `HousingRegister`

## Updates Made

### ✅ Cursor Fix
Changed CustomCursor spring settings for faster response:
- **Before**: stiffness: 130, damping: 22, mass: 0.5
- **After**: stiffness: 300, damping: 30, mass: 0.3
- **Result**: Smoother, more responsive cursor tracking

### ✅ New Page
Created complete Housing Register page with:
- Hero section with architectural elements
- Animated building silhouettes
- Registration form with validation
- Benefits showcase section
- Supabase integration for data storage

### ✅ Database Integration
- Added housing_applications table to schema
- Created separate patch file for easy setup
- Configured Row Level Security
- Added performance indexes

## Admin Management
To view and manage housing applications, you can:
1. Access Supabase dashboard directly
2. Create a custom admin page (similar to existing admin pages)
3. Export data for processing

## Future Enhancements
Consider adding:
- Admin dashboard for managing applications
- Email notifications for applicants
- Application status tracking
- PDF generation for approved applications
- SMS notifications
- Integration with housing allocation system

## Support
For any issues or questions about the housing register:
- Check the Supabase logs
- Verify the table was created correctly
- Ensure environment variables are set in `.env`

---

**Vote Shosh and see the Magic!** ✨
