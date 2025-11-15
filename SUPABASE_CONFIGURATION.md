# Supabase Configuration Guide

## How Your Code Connects to Supabase

Your React app uses the Supabase JavaScript client library to communicate with your Supabase project. Here's how it works:

### 1. **Connection Setup** (`src/lib/supabaseClient.ts`)
```typescript
// Creates a Supabase client using your project URL and API key
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

This creates a client that connects to your Supabase project's REST API and Realtime services.

### 2. **Authentication Methods Used**

Your code uses these Supabase Auth methods:

- **`supabase.auth.getSession()`** - Checks if user has an active session
- **`supabase.auth.signInWithPassword()`** - Signs in with email/password
- **`supabase.auth.signUp()`** - Creates a new user account
- **`supabase.auth.signOut()`** - Signs out the current user
- **`supabase.auth.onAuthStateChange()`** - Listens for auth state changes

---

## What You Need to Configure in Supabase

### ✅ Step 1: Enable Email Authentication Provider

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Authentication** → **Providers** (in the left sidebar)
3. Find **Email** in the list of providers
4. Make sure it's **Enabled** (toggle should be ON)
5. Click **Save**

**Why:** Your code uses `signInWithPassword()` and `signUp()`, which require the Email provider to be enabled.

---

### ✅ Step 2: Configure Email Settings

1. Still in **Authentication** → **Providers** → **Email**
2. Configure these settings:

   **For Development (Recommended):**
   - **Enable email confirmations**: **OFF** 
     - This allows users to sign in immediately after signup
     - Easier for testing during development
   
   **For Production:**
   - **Enable email confirmations**: **ON**
     - Users must verify their email before signing in
     - More secure, prevents fake emails

3. **Site URL**: Set to `http://localhost:8080` (for development)
4. Click **Save**

**Why:** This controls whether users need to verify their email before they can sign in.

---

### ✅ Step 3: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:8080`
3. In **Redirect URLs**, add:
   ```
   http://localhost:8080/**
   http://localhost:8080/login
   http://localhost:8080/
   ```
4. Click **Save**

**Why:** Supabase needs to know which URLs are allowed for redirects. This prevents unauthorized redirects.

**Note:** When you deploy to production, add your production URLs here too.

---

### ✅ Step 4: (Optional) Customize Email Templates

1. Go to **Authentication** → **Email Templates**
2. You can customize:
   - **Confirm signup** - Email sent when user signs up
   - **Magic Link** - For passwordless login (if you add it later)
   - **Change Email Address** - When user changes email
   - **Reset Password** - For password resets

**Why:** Makes your emails look professional and branded.

---

### ✅ Step 5: Verify Your API Keys

1. Go to **Settings** → **API**
2. Verify you have:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`
3. Make sure these match what's in your `.env` file

**Why:** These are the credentials your app uses to connect to Supabase.

---

## How Authentication Flow Works

### Sign Up Flow:
```
User fills form → signUp(email, password) 
  → Supabase creates user account
  → If email confirmation OFF: User can sign in immediately
  → If email confirmation ON: User gets email, must click link first
  → onAuthStateChange fires → User state updates → Redirects to home
```

### Sign In Flow:
```
User fills form → signIn(email, password)
  → Supabase validates credentials
  → Creates session (stored in browser localStorage)
  → onAuthStateChange fires → User state updates → Redirects to home
```

### Session Check (on page load):
```
App loads → getSession() called
  → Supabase checks localStorage for existing session
  → If valid session exists: User is authenticated
  → If no session: User redirected to /login
```

---

## Important Supabase Settings to Check

### ✅ Email Provider Settings
- **Location**: Authentication → Providers → Email
- **Required**: Enabled = ON
- **Email Confirmations**: OFF for dev, ON for production

### ✅ URL Configuration
- **Location**: Authentication → URL Configuration
- **Site URL**: `http://localhost:8080` (or your production URL)
- **Redirect URLs**: Must include all URLs your app redirects to

### ✅ API Settings
- **Location**: Settings → API
- **Project URL**: Used in `VITE_SUPABASE_URL`
- **anon/public key**: Used in `VITE_SUPABASE_ANON_KEY`

---

## Testing Your Configuration

After configuring Supabase, test these scenarios:

1. **Sign Up Test:**
   - Try creating a new account
   - Check if you can sign in immediately (if email confirmation is OFF)
   - Check your email for confirmation link (if email confirmation is ON)

2. **Sign In Test:**
   - Sign in with existing credentials
   - Should redirect to home page
   - Should stay logged in after page refresh

3. **Session Persistence:**
   - Sign in
   - Refresh the page
   - Should remain logged in (session stored in localStorage)

4. **Logout Test:**
   - Click logout
   - Should redirect to login page
   - Should not be able to access protected routes

---

## Common Issues & Solutions

### Issue: "Email provider is not enabled"
**Solution:** Go to Authentication → Providers → Email → Enable it

### Issue: "Invalid redirect URL"
**Solution:** Add your URLs to Authentication → URL Configuration → Redirect URLs

### Issue: Users can't sign in after signup
**Solution:** 
- If email confirmation is ON: User must click email link first
- If email confirmation is OFF: Check browser console for errors

### Issue: Session not persisting
**Solution:** 
- Check browser localStorage (should have `sb-xxxxx-auth-token`)
- Check if cookies/localStorage are blocked
- Verify Supabase URL and key are correct

### Issue: CORS errors
**Solution:** Make sure your Site URL in Supabase matches your app URL

---

## Production Checklist

Before deploying to production:

- [ ] Enable email confirmations (more secure)
- [ ] Update Site URL to production URL
- [ ] Add production redirect URLs
- [ ] Customize email templates
- [ ] Test signup/signin flow
- [ ] Set up proper error monitoring
- [ ] Consider adding password reset functionality
- [ ] Consider adding social auth (Google, GitHub, etc.)

---

## Additional Supabase Features You Can Add

### Password Reset
```typescript
// Add to useAuth.tsx
const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}
```

### Social Authentication
1. Go to Authentication → Providers
2. Enable Google, GitHub, etc.
3. Add OAuth credentials
4. Use `supabase.auth.signInWithOAuth()` in your code

### Email Verification Check
```typescript
const isEmailVerified = user?.email_confirmed_at !== null
```

---

## Summary

**Minimum Required Configuration:**
1. ✅ Enable Email provider
2. ✅ Set Site URL
3. ✅ Add redirect URLs
4. ✅ (Optional) Configure email confirmation settings

**Your code is already set up correctly** - you just need to configure these settings in the Supabase dashboard!

Once configured, your authentication should work seamlessly. 🎉

