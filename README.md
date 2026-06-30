# Spark Gears Initiative Website

Standalone static website for Spark Gears Initiative.

## Files

- `index.html` - full single-page website
- `styles.css` - layout, responsive design, and visual system
- `script.js` - animated starfield, cursor repulsion, nav, reveals, and stat counters
- `assets/brand/spark-gears-logo.jpg` - current Spark Gears logo
- `PHOTO_TODO.md` - photo placeholders to replace later

## Local Preview

Run this from the project folder:

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173
```

## Push To GitHub

If this is a new GitHub repository:

```bash
git init
git add .
git commit -m "Create standalone Spark Gears website"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

If the GitHub repository already exists locally:

```bash
git status
git add .
git commit -m "Create standalone Spark Gears website"
git push origin main
```
