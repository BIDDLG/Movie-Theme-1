// ==========================================================
// ==============  USER CONFIGURATION =======================
// ==========================================================
// अपनी थीम के यूजर को बस यह दो लाइनें बदलनी होंगी।
const GITHUB_USER = 'your-github-username'; // अपना GitHub यूजरनेम यहाँ डालें
const GITHUB_REPO = 'your-repo-name'; // अपनी रिपॉजिटरी का नाम यहाँ डालें
// ==========================================================

// GitHub API का URL
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/posts`;

// हेल्पर फंक्शन: .txt फाइल के टेक्स्ट को ऑब्जेक्ट में बदलने के लिए
function parsePostText(text) {
    const post = { information: [], download_links: [] };
    const lines = text.split('\n');
    let readingButtons = false;

    for (const line of lines) {
        if (line.startsWith('Download Buttons:')) {
            readingButtons = true;
            continue;
        }

        if (readingButtons) {
            if (line.trim() === '') continue;
            if (!line.startsWith('  ')) { // अगर इंडेंटेशन खत्म हो गया
                 readingButtons = false;
            } else {
                 const [quality, url] = line.trim().split(/:\s*/);
                 if (quality && url) {
                    post.download_links.push({ quality, url });
                 }
                 continue;
            }
        }
        
        const parts = line.split(/:\s*/);
        if (parts.length < 2) continue;
        
        const key = parts[0].toLowerCase();
        const value = parts.slice(1).join(':').trim();

        if (key === 'title') post.title = value;
        if (key === 'image') post.image = value;
        if (key === 'information') post.information = value.split(',').map(item => item.trim());
    }
    return post;
}


// होमपेज को लोड करने का लॉजिक
async function loadHomepage() {
    const container = document.getElementById('posts-container');
    try {
        const response = await fetch(API_URL);
        const files = await response.json();
        
        if (!Array.isArray(files)) {
             container.innerHTML = '<h2>Error: Could not find posts. Check GitHub username/repo in script.js.</h2>';
             return;
        }

        container.innerHTML = ''; // Clear loading message

        for (const file of files) {
            if (file.name.endsWith('.txt')) {
                const postRes = await fetch(file.download_url);
                const text = await postRes.text();
                const post = parsePostText(text);
                const postSlug = file.name.replace('.txt', '');

                const postCard = `
                    <a href="post.html?movie=${postSlug}" class="post-card">
                        <img src="${post.image}" alt="${post.title}">
                        <div class="post-card-content">
                            <h2>${post.title}</h2>
                        </div>
                    </a>
                `;
                container.innerHTML += postCard;
            }
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        container.innerHTML = '<h2>Failed to load posts.</h2>';
    }
}


// सिंगल पोस्ट पेज को लोड करने का लॉजिक
async function loadPostPage() {
    const container = document.getElementById('post-content-wrapper');
    const params = new URLSearchParams(window.location.search);
    const movieSlug = params.get('movie');

    if (!movieSlug) {
        container.innerHTML = '<h2>Movie not specified.</h2>';
        return;
    }
    
    try {
        const postRes = await fetch(`posts/${movieSlug}.txt`);
        const text = await postRes.text();
        const post = parsePostText(text);

        document.title = post.title; // पेज का टाइटल सेट करें

        let tagsHTML = post.information.map(tag => `<span class="tag">${tag}</span>`).join('');
        let buttonsHTML = post.download_links.map(link => `<a href="${link.url}" class="download-button" target="_blank">${link.quality}</a>`).join('');
        
        const pageUrl = window.location.href;
        const shareIconsHTML = `
             <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + pageUrl)}" target="_blank"><i class="fab fa-whatsapp"></i></a>
             <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}" target="_blank"><i class="fab fa-facebook"></i></a>
        `;

        container.innerHTML = `
            <div class="post-image-header" style="background-image: url('${post.image}')"></div>
            <div class="post-details-container">
                <h1>${post.title}</h1>
                <div class="post-tags">${tagsHTML}</div>
                <hr>
                <h3>Download Links:</h3>
                <div class="download-buttons">${buttonsHTML}</div>
                <hr>
                <h3>Share this movie:</h3>
                <div class="share-icons">${shareIconsHTML}</div>
            </div>
        `;

    } catch (error) {
        console.error('Error loading post:', error);
        container.innerHTML = '<h2>Could not load this movie.</h2>';
    }
}

// --- MAIN ROUTER ---
// यह तय करेगा कि कौनसा फंक्शन चलाना है
if (document.getElementById('posts-container')) {
    loadHomepage();
} else if (document.getElementById('post-content-wrapper')) {
    loadPostPage();
}
