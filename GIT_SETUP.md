# 🔧 Git Setup Guide

## Step 1: Git Install करें

### Option A: Git for Windows (Recommended)

1. **Download करें:**
   - [git-scm.com/download/win](https://git-scm.com/download/win) पर जाएं
   - **Download** button click करें
   - Installer download होगा

2. **Install करें:**
   - Downloaded file run करें
   - **Next** → **Next** → (default settings OK हैं)
   - **Install** click करें
   - Installation complete होने तक wait करें

3. **Verify करें:**
   - PowerShell या Command Prompt खोलें
   - Type करें: `git --version`
   - Version number दिखना चाहिए

### Option B: GitHub Desktop (GUI - आसान)

1. **Download करें:**
   - [desktop.github.com](https://desktop.github.com) पर जाएं
   - **Download for Windows** click करें

2. **Install करें:**
   - Installer run करें
   - GitHub account से sign in करें (अगर है)

---

## Step 2: Git Setup Script Run करें

Git install होने के बाद:

1. PowerShell में project folder में जाएं:
   ```powershell
   cd "C:\Users\himes_gz1hd7l\Desktop\e-commerce-website-build"
   ```

2. Setup script run करें:
   ```powershell
   .\setup-git.ps1
   ```

या manually commands run करें (नीचे देखें)।

---

## Step 3: Manual Setup (अगर script नहीं चले)

### 3.1 Git Initialize करें

```powershell
git init
```

### 3.2 User Config करें (पहली बार)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3.3 Files Add करें

```powershell
git add .
```

### 3.4 First Commit करें

```powershell
git commit -m "Initial commit - Gift Choice E-commerce Website"
```

### 3.5 GitHub Repository Create करें

1. [github.com](https://github.com) पर जाएं
2. **New Repository** click करें
3. Repository name: `gift-choice` (या कोई भी name)
4. **Public** या **Private** select करें
5. **Create repository** click करें
6. Repository URL copy करें (example: `https://github.com/yourusername/gift-choice.git`)

### 3.6 Remote Add करें और Push करें

```powershell
git remote add origin https://github.com/yourusername/gift-choice.git
git branch -M main
git push -u origin main
```

**Note:** पहली बार push करने पर GitHub login करना होगा।

---

## ✅ Verify करें

```powershell
git status
```

यह command run करें - सब कुछ clean दिखना चाहिए।

---

## 🚀 अब Vercel पर Deploy करें

Git setup complete होने के बाद:

1. [vercel.com](https://vercel.com) पर जाएं
2. **Add New** → **Project**
3. अपना GitHub repository import करें
4. **Deploy** click करें

---

## 📝 Quick Commands Reference

```powershell
# Status check
git status

# Changes add करें
git add .

# Commit करें
git commit -m "Your message"

# Push करें
git push origin main

# Pull करें (updates लाने के लिए)
git pull origin main
```

---

**अगर किसी step में problem हो तो बताएं!**

