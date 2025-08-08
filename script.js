const movieFiles = ['Krrish.txt', 'Dhoom.txt', 'Pathaan.txt'];
const container = document.getElementById('movies');

movieFiles.forEach(file => {
  fetch('Posts/' + file)
    .then(res => res.text())
    .then(data => {
      const movieDiv = document.createElement('div');
      movieDiv.className = 'movie';
      const lines = data.split('\n').filter(line => line.trim() !== '');
      let title = lines.find(l => l.startsWith('Title:'))?.replace('Title:', '').trim();
      let image = lines.find(l => l.startsWith('Image:'))?.replace('Image:', '').trim();
      let infoIndex = lines.findIndex(l => l.startsWith('Information:'));
      let info = infoIndex !== -1 ? lines.slice(infoIndex).join('\n').replace('Information:', '').trim() : '';
      let download = lines.find(l => l.startsWith('Download button:'))?.replace('Download button:', '').trim();

      movieDiv.innerHTML = `
        <h2>${title || file}</h2>
        ${image ? `<img src="${image}" alt="${title}">` : ''}
        <p>${info}</p>
        ${download ? `<a href="${download}" target="_blank"><button>Download</button></a>` : ''}
      `;
      container.appendChild(movieDiv);
    });
});        const post = parsePostText(text);

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
