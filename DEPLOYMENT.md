# 🌐 Portfolio Website Deployment Guide

## 🚀 Quick Deployment (GitHub Pages)

### Step 1: Authenticate with GitHub
```bash
gh auth login
```
- Choose "GitHub.com" 
- Select "HTTPS"
- Choose "Yes" to authenticate Git with GitHub credentials
- Select "Login with a web browser"

### Step 2: Deploy Automatically
```bash
./deploy.sh
```

**That's it!** Your website will be live at: `https://yourusername.github.io/portfolio-website`

---

## 📋 Manual Deployment Steps

If you prefer to do it manually:

### GitHub Pages
```bash
# 1. Create repository
gh repo create portfolio-website --public --source=. --remote=origin --push

# 2. Enable GitHub Pages
gh repo edit --enable-pages --pages-branch=main
```

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Deploy settings are already configured in `netlify.toml`

---

## 🔧 Features Included

### ✅ Working Features:
- **Search functionality** with clear button
- **Resume download** (automatically configured)
- **Responsive design** for all devices
- **Mobile-friendly** navigation
- **Smooth animations** and hover effects
- **Professional styling** (Netflix-inspired)

### 🛡️ Security Features:
- Content Security Headers
- PDF content type headers
- No-frame embedding protection

---

## 🔄 Updating Your Website

### To update content:
1. Edit `index.html`, `styles.css`, or `script.js`
2. Run: `./deploy.sh`

### To update resume:
1. Replace `Janani_M_Resume.pdf` with new file
2. Run: `./deploy.sh`

---

## 🌍 Sharing Your Portfolio

Once deployed, you can share these links:

**GitHub Pages URL:** `https://yourusername.github.io/portfolio-website`
**Custom Domain:** You can add a custom domain in repository settings

### Sharing Options:
- ✅ **LinkedIn Profile** - Add to your summary
- ✅ **Email Signature** - Professional contact
- ✅ **Resume/CV** - Include the link
- ✅ **Job Applications** - Portfolio showcase
- ✅ **Business Cards** - QR code or short URL
- ✅ **Social Media** - Professional profiles

---

## 📱 Mobile Optimization

Your portfolio is fully optimized for:
- 📱 Mobile phones (iOS/Android)
- 📟 Tablets (iPad/Android tablets)  
- 💻 Desktop computers
- 🖥️ Large screens

---

## 🎯 SEO & Performance

### Already Configured:
- Meta tags for search engines
- Open Graph tags for social sharing
- Fast loading optimizations
- Image optimization
- Responsive images

### Analytics (Optional):
Add Google Analytics by inserting this code before `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🛠️ Troubleshooting

### Common Issues:

**1. Resume not downloading:**
- Check if `Janani_M_Resume.pdf` exists in root directory
- Verify file permissions

**2. Search not working:**
- Clear browser cache
- Check JavaScript console for errors

**3. GitHub Pages not updating:**
- Check deployment status at: `https://github.com/username/portfolio-website/deployments`
- GitHub Pages can take 1-10 minutes to update

**4. Mobile layout issues:**
- Test on different devices
- Use browser developer tools mobile emulation

---

## 📞 Support

### Quick Fixes:
1. **Refresh browser cache:** Ctrl+F5 (PC) / Cmd+Shift+R (Mac)
2. **Check mobile view:** Use browser developer tools
3. **Update content:** Edit files and run `./deploy.sh`
4. **Check deployment:** Visit GitHub repository → Actions tab

### File Structure:
```
portfolio-website/
├── index.html          # Main website
├── styles.css          # All styling
├── script.js           # Functionality
├── Janani_M_Resume.pdf # Your resume
├── deploy.sh           # Deployment script
├── netlify.toml        # Netlify config
├── README.md           # Project info
└── DEPLOYMENT.md       # This guide
```

---

**🎉 Your professional portfolio is now live and ready to impress employers and clients!**