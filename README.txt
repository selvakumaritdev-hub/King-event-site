KING EVENTS website (Tirunelveli)

dist/        -> the finished website. Open dist/index.html, or upload this folder to Netlify / Vercel / GitHub Pages.
build.js     -> top of file has ALL business details (phone, prices, stats, social links, site URL).
               Edit them, then run:  node build.js   (rebuilds dist/)
src/         -> site.css and site.js (design + behaviour)
assets/      -> images and icons (replace with real photos, keep file names, or edit the GALLERY list in build.js)

Replace before going live (marked PLACEHOLDER in build.js):
 - Package prices, "500+ events", "5 districts", working hours 9AM-8PM, service areas
 - Instagram / Facebook / YouTube links, site URL (turns on sitemap.xml + canonical)
 - Real customer reviews (showTestimonials flag is off on purpose)
