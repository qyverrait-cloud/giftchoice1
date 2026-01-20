# 3D Avatar Setup Guide - Gift Buddy Chatbot

## 📋 Overview

Chatbot mein 3D model (.fbx format) add kiya gaya hai jo GSAP animations ke saath move karta hai aur users ko attract karta hai.

---

## 📦 Installed Packages

```bash
npm install three @react-three/fiber @react-three/drei
```

**Packages:**
- `three` - Three.js 3D library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for React Three Fiber (FBX loader included)

---

## 📁 Files Created

### 1. `components/chatbot-3d-avatar.tsx`
- 3D model component with GSAP animations
- FBX file loader
- Mood-based animations
- Continuous floating and rotation effects

### 2. Updated `components/gift-buddy-chatbot.tsx`
- Integrated 3D avatar component
- Replaced image avatar with 3D model

---

## 🎯 Steps to Add Your 3D Model

### Step 1: Add FBX File

1. Apna `.fbx` file ko `public` folder mein rakhein
2. File ka naam: `chatbot-avatar.fbx`
3. Path: `public/chatbot-avatar.fbx`

**Example:**
```
public/
  ├── chatbot-avatar.fbx  ← Yahan rakhein
  ├── gift-choice-logo.png.png
  └── ...
```

### Step 2: Adjust Model Scale (if needed)

Agar model size sahi nahi hai, `components/chatbot-3d-avatar.tsx` mein scale adjust karein:

```typescript
// Line 24 - Initial scale
model.scale.set(0.01, 0.01, 0.01) // Adjust these values

// Line 50 - Entrance animation scale
x: 0.01,  // Adjust if needed
y: 0.01,
z: 0.01,
```

**Scale Tips:**
- Agar model chhota hai: Increase values (0.02, 0.03, etc.)
- Agar model bada hai: Decrease values (0.005, 0.008, etc.)

### Step 3: Adjust Camera Position (if needed)

Agar model properly dikh nahi raha, camera position adjust karein:

```typescript
// Line 99 - Camera position
camera={{ position: [0, 0, 5], fov: 50 }}

// Adjust:
// - position[2] (z-axis): Closer = smaller number, Far = larger number
// - fov: Field of view (50-75 recommended)
```

### Step 4: Test the Model

1. `npm run dev` run karein
2. Chatbot button check karein (bottom-right corner)
3. Chatbot open karke header mein avatar check karein

---

## 🎨 Features Included

### 1. **Continuous Animations**
- ✅ Floating animation (up-down movement)
- ✅ Rotation animation (360° continuous)
- ✅ Pulse glow effect

### 2. **Mood-Based Animations**
- ✅ **Happy**: Normal floating
- ✅ **Excited**: Scale bounce effect
- ✅ **Thinking**: Head tilt animation

### 3. **Entrance Animation**
- ✅ When chatbot opens, model scales in with bounce effect

### 4. **GSAP Integration**
- ✅ Smooth transitions
- ✅ Performance optimized
- ✅ Cleanup on unmount

---

## 🔧 Customization Options

### Change Animation Speed

```typescript
// Floating speed (Line 33)
duration: 2, // Increase = slower, Decrease = faster

// Rotation speed (Line 41)
duration: 8, // Increase = slower, Decrease = faster
```

### Change Colors

```typescript
// Glow color (Line 47)
pointLight color="#ff69b4" // Change to your brand color

// Container glow (Line 90)
rgba(236, 72, 153, 0.6) // Change to match your theme
```

### Disable Auto Rotation

```typescript
// Comment out useFrame hook (Line 58-63)
// useFrame((state, delta) => {
//   if (modelRef.current) {
//     modelRef.current.rotation.y += delta * 0.2
//   }
// })
```

---

## 🐛 Troubleshooting

### Problem: Model Not Loading

**Solutions:**
1. Check file path: `public/chatbot-avatar.fbx` (exact name)
2. Check file size: Large files (>10MB) may load slowly
3. Check browser console for errors
4. Verify FBX file is valid

### Problem: Model Too Big/Small

**Solutions:**
1. Adjust scale values (Step 2 above)
2. Adjust camera position (Step 3 above)
3. Check model's original size in 3D software

### Problem: Model Not Centered

**Solutions:**
1. Adjust model position in 3D software before export
2. Or adjust in code:
```typescript
model.position.set(0, 0, 0) // Adjust x, y, z values
```

### Problem: Performance Issues

**Solutions:**
1. Optimize FBX file (reduce polygons)
2. Use compressed format if possible
3. Reduce animation complexity
4. Check browser performance tools

---

## 📝 Model Requirements

### Recommended Specs:
- **Format**: `.fbx`
- **Size**: < 5MB (for fast loading)
- **Polygons**: < 10,000 (for performance)
- **Textures**: Embedded or separate (will need additional setup)

### Best Practices:
1. ✅ Export with animations if needed
2. ✅ Center model at origin (0,0,0)
3. ✅ Optimize geometry
4. ✅ Test in browser before deploying

---

## 🚀 Next Steps

1. ✅ Add your `.fbx` file to `public/chatbot-avatar.fbx`
2. ✅ Test locally with `npm run dev`
3. ✅ Adjust scale/camera if needed
4. ✅ Deploy to production

---

## 💡 Tips

1. **Test First**: Always test locally before deploying
2. **Optimize**: Large models slow down website
3. **Fallback**: If model fails, old image avatar shows
4. **Mobile**: 3D models work on mobile but may be slower

---

## 📞 Support

Agar koi issue aaye:
1. Browser console check karein (F12)
2. File path verify karein
3. Model format check karein (.fbx)
4. Scale/camera adjust karein

**Success! 🎉**

Ab aapka 3D avatar chatbot mein animated aur attractive dikhega!

