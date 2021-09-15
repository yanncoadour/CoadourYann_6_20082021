//Appeler ID #affichageProfil

let affichageProfil = document.getElementById('affichageProfil');

//Création de la class photographer

class Photographer {
  constructor(name, id, city, country, tags, tagline, price, portrait) {
    this.name = name;
    this.id = id;
    this.city = city;
    this.country = country;
    this.tags = tags;
    this.tagline = tagline;
    this.price = price;
    this.portrait = portrait;
  }
}

//Récupération donnnées JSON et Affichage des photographes

fetch('JS/data.json')
  .then(response => response.json())
  .then(function (data) {
    for (item of data.photographers) {
      let photographer = new Photographer(
        item.name,
        item.id,
        item.city,
        item.country,
        item.tags,
        item.tagline,
        item.price,
        item.portrait
      );
      affichageProfil.innerHTML += `
      
      <article>
                <a href="page_photographe.html?id=${photographer.id}" aria-label="cliquez sur la photo pour afficher le profil de ${photographer.name}">
                <img id="photoProfil"  src="../medias/photos/profil/${photographer.portrait}" />
                </a>

                <div class="description-article">

                    <h2 aria-label="Le nom du photographe est ${photographer.name} ">${photographer.name}</h2>

                    <h3 aria-label="Le photographe viens de ${photographer.city}">${photographer.city}, ${photographer.country}</h3>

                    <blockquote aria-label="La devise du photographe est :${photographer.tagline}">${photographer.tagline}</blockquote>
                    <p aria-label="Le prix de ce photographe est ${photographer.price}€ par jour">${photographer.price}€ /jour</p>
                </div>
                <div id="filtres-articles-${photographer.id}"></div>
        </article>  
      
      `;

      // récupération des tags
      const filtresArticles = document.getElementById(
        'filtres-articles-' + photographer.id
      );
      for (tag of photographer.tags) {
        filtresArticles.innerHTML += `<span class="photographerTag" data-tag="${tag}">#${tag}</span>`;
      }
    }
  });

// FILTRES
let filtrePortrait = document.getElementById('filtre-portrait');
let filtreArt = document.getElementById('filtre-art');
let filtreFashion = document.getElementById('filtre-fashion');
let filtreArchitecture = document.getElementById('filtre-architecture');
let filtreTravel = document.getElementById('filtre-travel');
let filtreSport = document.getElementById('filtre-sport');
let filtreAnimals = document.getElementById('filtre-animals');
let filtreEvents = document.getElementById('filtre-events');
let nosPhotograpes = document.getElementById('nosPhotographes');

filtrePortrait.addEventListener('click', filtrephotographe);
filtreArt.addEventListener('click', filtrephotographe);
filtreFashion.addEventListener('click', filtrephotographe);
filtreArchitecture.addEventListener('click', filtrephotographe);
filtreTravel.addEventListener('click', filtrephotographe);
filtreSport.addEventListener('click', filtrephotographe);
filtreAnimals.addEventListener('click', filtrephotographe);
filtreEvents.addEventListener('click', filtrephotographe);
nosPhotograpes.addEventListener('click', ensemblephotographe);

//Function filtrephotographe

function filtrephotographe() {
  affichageProfil.innerHTML = '';
  let filtreActif = this.dataset.filter;
  let listePhotographe = [];

  fetch('JS/data.json')
    .then(response => response.json())
    .then(function (data) {
      for (item of data.photographers) {
        const photographer = new Photographer(
          item.name,
          item.id,
          item.city,
          item.country,
          item.tags,
          item.tagline,
          item.price,
          item.portrait
        );
        comparaison();
        function comparaison() {
          photographer.tags.forEach(element => {
            if (element === filtreActif) {
              listePhotographe.push(photographer);
            }
          });
        }
      }
      for (photographer of listePhotographe) {
        affichageProfil.innerHTML += `
           <article>
                <a href="page_photographe.html?id=${photographer.id}" aria-label="cliquez sur la photo pour afficher le profil de ${photographer.name}">
                <img id="photoProfil"  src="../medias/photos/profil/${photographer.portrait}" />
                </a>

                <div class="description-article">

                    <h2 aria-label="Le nom du photographe est ${photographer.name} ">${photographer.name}</h2>

                    <h3 aria-label="Le photographe viens de ${photographer.city}">${photographer.city}, ${photographer.country}</h3>

                    <blockquote aria-label="La devise du photographe est :${photographer.tagline}">${photographer.tagline}</blockquote>
                    <p aria-label="Le prix de ce photographe est ${photographer.price}€ par jour">${photographer.price}€ /jour</p>
                </div>
                <div id="filtres-articles-${photographer.id}"></div>
        </article>  
            `;
        // récupération des tags
        const filtresArticles = document.getElementById(
          'filtres-articles-' + photographer.id
        );
        for (tag of photographer.tags) {
          filtresArticles.innerHTML += `<span class="photographerTag" data-tag="${tag}">#${tag}</span>`;
        }
      }
    });
}

function ensemblephotographe() {
  affichageProfil.innerHTML = '';
  fetch('JS/data.json')
    .then(response => response.json())
    .then(function (data) {
      for (item of data.photographers) {
        const photographer = new Photographer(
          item.name,
          item.id,
          item.city,
          item.country,
          item.tags,
          item.tagline,
          item.price,
          item.portrait
        );

        affichageProfil.innerHTML += `
           <article>
                <a href="page_photographe.html?id=${photographer.id}" aria-label="cliquez sur la photo pour afficher le profil de ${photographer.name}">
                <img id="photoProfil"  src="../medias/photos/profil/${photographer.portrait}" />
                </a>

                <div class="description-article">

                    <h2 aria-label="Le nom du photographe est ${photographer.name} ">${photographer.name}</h2>

                    <h3 aria-label="Le photographe viens de ${photographer.city}">${photographer.city}, ${photographer.country}</h3>

                    <blockquote aria-label="La devise du photographe est :${photographer.tagline}">${photographer.tagline}</blockquote>
                    <p aria-label="Le prix de ce photographe est ${photographer.price}€ par jour">${photographer.price}€ /jour</p>
                </div>
                <div id="filtres-articles-${photographer.id}"></div>
        </article>  
            `;

        // récupération des tags
        const filtresArticles = document.getElementById(
          'filtres-articles-' + photographer.id
        );
        for (tag of photographer.tags) {
          filtresArticles.innerHTML += `<span class="photographerTag" data-tag="${tag}">#${tag}</span>`;
        }
      }
    });
}

//affichage au scroll

let boutonContenu = document.querySelector('.bouton-contenu');
window.addEventListener('scroll', () => {
  boutonContenu.style.display = 'block';
  boutonContenu.style.display = 'flex';
});
