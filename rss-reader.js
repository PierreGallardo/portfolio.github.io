document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('rss-feed');
    // Remplacez cette URL par celle de votre flux RSS
    const RSS_URL = `https://www.google.fr/alerts/feeds/10017542855167941856/322530756779322578`;

    // Utilisation d'un proxy CORS pour contourner les restrictions
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

    fetch(CORS_PROXY + RSS_URL)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const items = data.querySelectorAll("item");
            let html = ``;
            items.forEach(el => {
                const title = el.querySelector("title").innerHTML;
                const link = el.querySelector("link").innerHTML;
                // La description contient souvent des entités HTML comme <![CDATA[...]]>
                // qu'il faut nettoyer.
                const description = el.querySelector("description").textContent;
                const pubDate = new Date(el.querySelector("pubDate").innerHTML).toLocaleDateString('fr-FR');

                html += `
                    <div class="feed-item">
                        <h2 class="feed-item-title">
                            <a href="${link}" target="_blank" rel="noopener">
                                ${title}
                            </a>
                        </h2>
                        <p class="feed-item-description">${description}</p>
                        <p class="feed-item-date">Publié le : ${pubDate}</p>
                    </div>
                `;
            });
            feedContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Erreur lors de la récupération du flux RSS:', error);
            feedContainer.innerHTML = "<p>Impossible de charger le flux RSS pour le moment.</p>";
        });
});