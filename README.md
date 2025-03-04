# Lifeline Healthcare Platform

A modern healthcare platform that allows users to access scan results, get AI-powered insights, and connect with healthcare professionals.

## Features

- Instant Scan Results
- AI-Powered Diagnostics
- Physician Consultation
- Emergency Support

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up Supabase:
   - Create a Supabase project at [https://supabase.com](https://supabase.com)
   - Copy your Supabase URL and anon key to the `.env` file

## Database Migrations

This project uses Supabase for the database. The migrations are located in the `supabase/migrations` directory.

### Option 1: Using the Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file from the `supabase/migrations` directory
4. Execute the SQL statements

### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### Option 3: Using the JavaScript Client (Limited)

We provide a script to attempt applying migrations using the JavaScript client, but it has limitations:

```bash
npm run apply-migrations
```

Note: This method may not work for all SQL statements due to limitations in the Supabase JavaScript client.

## Storage Setup

The application requires a storage bucket named "scans" to store uploaded medical scans. The migration file `20250302135421_storage_bucket_policies.sql` will create this bucket and set up the necessary policies.

If you need to manually create the bucket:

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Click "New Bucket"
4. Enter "scans" as the bucket name
5. Set the bucket to "Private"
6. Click "Create bucket"

Then set up the following policies:

- Users can upload files to folders matching their user ID
- Users can view files in folders matching their user ID
- Admins can access all files in the bucket

## Development

Start the development server:

```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

## License

[MIT](LICENSE)