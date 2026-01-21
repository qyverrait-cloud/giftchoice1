# Category Display Issue - Debugging Guide

## Issue
Category added from admin panel but not showing in category header slider.

## Possible Causes

1. **Page Not Refreshed**
   - After adding category, refresh the homepage
   - Categories are loaded on page mount

2. **Missing Slug**
   - Category must have a slug
   - Check admin panel - slug should auto-generate from name

3. **API Not Returning Category**
   - Check browser console for errors
   - Verify API endpoint: `/api/categories`
   - Check network tab in DevTools

4. **Category Image Missing**
   - Category will show even without image (uses placeholder)
   - But verify image is uploaded correctly

## Quick Fixes

### 1. Check Browser Console
Open browser DevTools (F12) and check:
- Any errors in Console tab
- Network tab - verify `/api/categories` returns data
- Look for: `"HomePage - Categories loaded:"` log

### 2. Verify Category in Database
- Go to admin panel → Categories
- Check if category appears in list
- Verify it has:
  - Name ✓
  - Slug ✓
  - Image (optional)

### 3. Hard Refresh
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- This clears cache and reloads

### 4. Check API Response
Visit: `http://localhost:3000/api/categories`
Should return JSON array of categories

## Debugging Steps Added

1. Console logging in `CategoryHeaderSlider` component
2. Console logging in `HomePage` component
3. Empty state message when no categories
4. Fallback to category ID if slug missing

## Next Steps

If category still doesn't show:
1. Check browser console for errors
2. Verify category exists in admin panel
3. Check API response at `/api/categories`
4. Verify category has slug field

