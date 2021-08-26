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
                <img id="photoProfil-${photographer.id}"  src="../medias/photos/profil/${photographer.portrait}" />
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
    }
  });
