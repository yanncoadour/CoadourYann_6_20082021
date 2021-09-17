// Récupération de l'URL
let url = new URL(window.location);
let id = url.searchParams.get('id');

// Déclaration de la classe photographer

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

// Déclaration de la classe Media
class Media {
  constructor(
    id,
    photographerId,
    title,
    image,
    video,
    tags,
    likes,
    date,
    price
  ) {
    this.id = id;
    this.photographerId = photographerId;
    this.title = title;
    this.image = image;
    this.video = video;
    this.tags = tags;
    this.likes = likes;
    this.date = date;
    this.price = price;
  }
}

let photographers;

// récup données des photographes dans JSON

fetch('JS/data.json')
  .then(response => response.json())
  .then(function (data) {
    photographers = data;
    let photographerData = data.photographers.filter(
      photographer => photographer.id === parseInt(id)
    );
    let photographer = new Photographer(
      photographerData[0].name,
      photographerData[0].id,
      photographerData[0].city,
      photographerData[0].country,
      photographerData[0].tags,
      photographerData[0].tagline,
      photographerData[0].price,
      photographerData[0].portrait
    );
    //affichage du HTML dans le main

    let mainDivDetail = document.getElementById('mainDivDetail');
    mainDivDetail.innerHTML += `
    <main id="mainDivDetail">
            <div class="presentation">
                <h1 title="ceci est la page de ${photographer.name}">${photographer.name}</h1>
                <h3>${photographer.city}, ${photographer.country}</h3>
                <blockquote>${photographer.tagline}</blockquote>
      
                <div id="filtres-articles-${photographer.id}" ></div>
            </div>

        <img src="medias/photos/profil/${photographer.portrait}" alt="" />
        </main>`;

    //affichage des filtres
    const filtresArticles = document.getElementById(
      'filtres-articles-' + photographer.id
    );
    for (tag of photographer.tags) {
      filtresArticles.innerHTML += `<span class="photographerTag" data-tag="${tag}">#${tag}</span>`;
    }
    // variables dans le carroussel
    const carroussel = document.getElementById('carroussel');
    const mediaData = data.media.filter(
      media => media.photographerId === parseInt(id)
    );
    // Constructeur de l'objet Media
    for (data of mediaData) {
      let media = new Media(
        data.id,
        data.photographerId,
        data.title,
        data.image,
        data.video,
        data.tags,
        data.likes,
        data.date,
        data.price
      );

      let totalLike = 0;
      totalLike += media.likes;

      // Pattern Factory pour créer des vidéos ou photos
      function generateMediaTag() {
        if (media.video == undefined) {
          return `<img class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.image}' alt=''/>`;
        }
        return `<video controls class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.video}' alt=''></video>`;
      }

      // Création dynamique depuis le JSON d'un article pour chaque médias du photographe
      carroussel.innerHTML += `
        <article class="carroussel-card">
            ${generateMediaTag()} 
            <div class="description-image">
            <p aria-label=" le titre de l'oeuvre est ${media.title}">${
        media.title
      }</p>
            <div class="prix-like">
               <p aria-label=" le prix de cette photo est ${media.price}€">${
        media.price
      } €</p>
               <div class="like-compteur"> <span class="likeCounter" id="like-counter-${
                 media.id
               }" aria-label="il à été aimé ${media.likes} fois ">${
        media.likes
      }</span><span><i class="fas fa-heart" id="like-media-${
        media.id
      }"></i></span></div>
            </div>
            </div>
        </article>`;

      //--------------------------------------- Incrémentation des likes----------------------------------------------------------

      carroussel.addEventListener('click', incrementationLike);

      // Affichage du nombre de like avec incrémentation à chaque clic
      function incrementationLike(e) {
        if (e.target && e.target.id == `like-media-${media.id}`) {
          const likeCounter = document.getElementById(
            `like-counter-${media.id}`
          );
          const likeValue = parseInt(likeCounter.innerHTML);
          let nbrLikes = likeValue + 1;
          likeCounter.innerText = nbrLikes;
          showNewTotalLikes();
        }
      }
    }

    // Affichage du nombre cumulé de like
    function showNewTotalLikes() {
      totalLike++;
      const nbrTotalLikes = document.getElementById('nbrTotalLikes');
      nbrTotalLikes.innerText = totalLike;
    }

    //---------------------------------------------- AFFICHAGE DYNAMIQUE DU FOOTER---------------------------------------------

    const footer = document.querySelector('footer');
    footer.innerHTML += `
        <div class="compte-like">
            <span class="like" id="nbrTotalLikes" aria-label="Ce photographe a été aimé ${photographer.price} fois"></span> <i class="fas fa-heart"></i>
        </div>
        <p  aria-label="Le prix de ce photographe est ${photographer.price}€">${photographer.price} €/jour</p> `;

    //------------------------ Fonction de tri dans la liste déroulante + Lightbox----------------------------------------------------

    const selectElement = document.querySelector('select');
    selectElement.addEventListener('change', triDetails);

    function triDetails() {
      const carroussel = document.getElementById('carroussel');
      carroussel.innerHTML = '';

      //fonction par popularité

      if (this.selectedIndex === 0) {
        const mediaListTri = mediaData.sort((a, b) =>
          a.likes < b.likes ? 1 : -1
        );
        for (data of mediaListTri) {
          const media = new Media(
            data.id,
            data.photographerId,
            data.title,
            data.image,
            data.video,
            data.tags,
            data.likes,
            data.date,
            data.price
          );
          // Pattern Factory pour créer des vidéos ou photos selon la nature du média
          function generateMediaTag() {
            if (media.video == undefined) {
              return `<img class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.image}' alt=''/>`;
            }
            return `<video controls class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.video}' alt=''></video>`;
          }

          //  article pour chaque médias du photographe (créa avec JSON)
          carroussel.innerHTML += `
        <article class="carroussel-card">
            ${generateMediaTag()} 
            <div class="description-image">
            <p aria-label=" le titre de l'oeuvre est ${media.title}">${
            media.title
          }</p>
            <div class="prix-like">
               <p aria-label=" le prix de cette photo est ${media.price}€">${
            media.price
          } €</p>
               <div class="like-compteur"> <span class="likeCounter" id="like-counter-${
                 media.id
               }" aria-label="il à été aimé ${media.likes} fois ">${
            media.likes
          }</span><span><i class="fas fa-heart" id="like-media-${
            media.id
          }"></i></span></div>
            </div>
            </div>
        </article>`;

          // LightBox (tri popularité)
          const lightBox = document.getElementById('lightBox');
          const suivantLightBox = document.getElementById('suivantLightBox');
          const precedentLightBox =
            document.getElementById('precedentLightBox');
          const closeBtnLightBox = document.getElementById('closeBtnLightBox');
          let currentViewedMedia;

          carroussel.addEventListener('click', throwLightBox);

          // fonction d'affichage lightBox
          function throwLightBox(e) {
            if (e.target.id.startsWith('carroussel-img-')) {
              let id = e.target.id.split('-').pop();
              let media = mediaData.find(element => element.id == id);
              currentViewedMedia = media;

              const imageTag = `<img class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.image}' alt='}'/>`;
              const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.video}' alt=''></video>`;

              mainDivDetail.style.visibility = 'hidden';
              carroussel.style.visibility = 'hidden';
              footer.style.visibility = 'hidden';
              lightBox.style.display = 'block';
              photoSlider.innerHTML += `
                        <div id="photo-Slider-${media.id}">
                            ${media.video == undefined ? videoTag : imageTag} 
                            <p aria-label=" le titre de l'oeuvre est ${
                              media.title
                            }">${media.title}</p><div>
                        `;
            }
          }

          // Bouton suivant
          suivantLightBox.addEventListener('click', showNextPhoto);
          window.addEventListener('keydown', event => {
            if (event.key === 'ArrowRight') {
              showNextPhoto();
            }
          });

          //fonction affichage photo suivante
          function showNextPhoto() {
            const incrementationIndex = 1;
            let index = mediaData.indexOf(currentViewedMedia);
            let nextMedia = mediaData[index + incrementationIndex];
            currentViewedMedia = nextMedia;

            const imageTag = `<img class="carroussel-img" id="carroussel-img-${nextMedia.id}" src="medias/photos/${nextMedia.photographerId}/${nextMedia.image}" alt="">`;
            const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${nextMedia.id}" src="medias/photos/${nextMedia.photographerId}/${nextMedia.video}" alt=""></video>`;

            if (currentViewedMedia != undefined) {
              photoSlider.innerHTML = `
                        ${nextMedia.video == undefined ? imageTag : videoTag} 
                        <p aria-label="">${nextMedia.title}</p>
                        <div>
                        </div>
                    `;
            }

            if (currentViewedMedia == undefined) {
              let currentViewedMedia = nextMedia;
              let index = mediaData.indexOf(currentViewedMedia);
              let nextMedia = mediaData[index + incrementationIndex];
            }
          }

          // Bouton précédent
          precedentLightBox.addEventListener('click', showPreviewPhoto);
          window.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
              showPreviewPhoto();
            }
          });

          // Fonction affichage photo Précédente
          function showPreviewPhoto() {
            const decrementationIndex = 1;
            let index = mediaData.indexOf(currentViewedMedia);
            let prevMedia = mediaData[index - decrementationIndex];
            currentViewedMedia = prevMedia;

            if (currentViewedMedia != undefined) {
              const imageTag = `<img class="carroussel-img" id="carroussel-img-${prevMedia.id}" src="medias/photos/${prevMedia.photographerId}/${prevMedia.image}" alt="">`;
              const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${prevMedia.id}" src="medias/photos/${prevMedia.photographerId}/${prevMedia.video}" alt=""></video>`;
              photoSlider.innerHTML = `
                        ${prevMedia.video == undefined ? imageTag : videoTag} 
                        <p aria-label="">${prevMedia.title}</p>
                        <div>
                        </div>
                    `;
            }

            if (currentViewedMedia == undefined) {
              currentViewedMedia = mediaData[mediaData.length - 1];
              let index = mediaData.indexOf(currentViewedMedia);
              let prevMedia = mediaData[index];
            }
          }

          // Fermeture lightBox

          closeBtnLightBox.addEventListener('click', closeBox);
          window.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
              closeBox();
            }
          });

          function closeBox() {
            lightBox.style.display = 'none';
            carroussel.style.visibility = 'visible';
            footer.style.visibility = 'visible';
            mainDivDetail.style.visibility = 'visible';
            removeDataDiaporama();
          }

          function removeDataDiaporama() {
            photoSlider.innerHTML = '';
          }
        }

        // fonction par Date
      } else if (this.selectedIndex === 1) {
        const mediaListTri = mediaData.sort((a, b) =>
          a.date > b.date ? 1 : -1
        );
        for (data of mediaListTri) {
          const media = new Media(
            data.id,
            data.photographerId,
            data.title,
            data.image,
            data.video,
            data.tags,
            data.likes,
            data.date,
            data.price
          );

          // Pattern Factory pour créer des vidéos ou photos selon la nature du média
          function generateMediaTag() {
            if (media.video == undefined) {
              return `<img class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.image}' alt=''/>`;
            }
            return `<video controls class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.video}' alt=''></video>`;
          }

          //  Article pour chaque médias du photographe (créa avec JSON)
          carroussel.innerHTML += `
        <article class="carroussel-card">
            ${generateMediaTag()} 
            <div class="description-image">
            <p aria-label=" le titre de l'oeuvre est ${media.title}">${
            media.title
          }</p>
            <div class="prix-like">
               <p aria-label=" le prix de cette photo est ${media.price}€">${
            media.price
          } €</p>
               <div class="like-compteur"> <span class="likeCounter" id="like-counter-${
                 media.id
               }" aria-label="il à été aimé ${media.likes} fois ">${
            media.likes
          }</span><span><i class="fas fa-heart" id="like-media-${
            media.id
          }"></i></span></div>
            </div>
            </div>
        </article>`;

          //lightBox par Date
          const lightBox = document.getElementById('lightBox');
          const suivantLightBox = document.getElementById('suivantLightBox');
          const precedentLightBox =
            document.getElementById('precedentLightBox');
          const closeBtnLightBox = document.getElementById('closeBtnLightBox');
          let currentViewedMedia;

          carroussel.addEventListener('click', throwLightBox);
          function throwLightBox(e) {
            if (e.target.id.startsWith('carroussel-img-')) {
              let id = e.target.id.split('-').pop();
              let media = mediaData.find(element => element.id == id);
              currentViewedMedia = media;

              const imageTag = `<img class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.image}'/>`;
              const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.video}'></video>`;

              mainDivDetail.style.visibility = 'hidden';
              carroussel.style.visibility = 'hidden';
              footer.style.visibility = 'hidden';
              lightBox.style.display = 'block';
              photoSlider.innerHTML += `
                    <div id="photo-Slider-${media.id}">
                        ${media.video == undefined ? imageTag : videoTag} 
                        <p aria-label=" le titre de l'oeuvre est ${
                          media.title
                        }">${media.title}</p><div>
                    `;
            }
          }

          // Affichage photo suivante
          suivantLightBox.addEventListener('click', showNextPhoto);
          window.addEventListener('keydown', event => {
            if (event.key === 'ArrowRight') {
              showNextPhoto();
            }
          });

          function showNextPhoto() {
            const incrementationIndex = 1;
            let index = mediaData.indexOf(currentViewedMedia);
            let nextMedia = mediaData[index + incrementationIndex];
            currentViewedMedia = nextMedia;

            const imageTag = `<img class="carroussel-img" id="carroussel-img-${prevMedia.id}" src="medias/photos/${prevMedia.photographerId}/${prevMedia.image}" alt="">`;
            const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${prevMedia.id}" src="medias/photos/${prevMedia.photographerId}/${prevMedia.video}" alt=""></video>`;

            if (currentViewedMedia != undefined) {
              photoSlider.innerHTML = `
                    ${nextMedia.video == undefined ? imageTag : videoTag} 
                    <p aria-label="">${nextMedia.title}</p>
                    <div>
                    </div>
                `;
            }

            if (currentViewedMedia == undefined) {
              let currentViewedMedia = nextMedia;
              let index = mediaData.indexOf(currentViewedMedia);
              let nexMedia = [index + incrementationIndex];
            }
          }

          // Affichage photo précédente
          precedentLightBox.addEventListener('click', showPreviewPhoto);
          window.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
              showPreviewPhoto();
            }
          });

          function showPreviewPhoto() {
            const decrementationIndex = 1;
            let index = mediaData.indexOf(currentViewedMedia);
            let prevMedia = mediaData[index - decrementationIndex];
            currentViewedMedia = prevMedia;

            if (currentViewedMedia != undefined) {
              const imageTag = `<img class="carroussel-img" id="carroussel-img-${prevMedia.id}" src="medias/photos/${prevMedia.photographerId}/${prevMedia.image}" >`;
              const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${prevMedia.id}" src="medias/photos/${prevMedia.photographerId}/${prevMedia.video}" ></video>`;
              photoSlider.innerHTML = `
                    ${prevMedia.video == undefined ? imageTag : videoTag} 
                    <p>${prevMedia.title}</p>
                    <div>
                    </div>
                `;
            }

            if (currentViewedMedia == undefined) {
              currentViewedMedia = mediaData[mediaData.length - 1];
              let index = mediaData.indexOf(currentViewedMedia);
              let prevMedia = mediaData[index];
            }
          }

          // Fermeture  lightBox
          closeBtnLightBox.addEventListener('click', closeBox);
          window.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
              closeBox();
            }
          });

          function closeBox() {
            lightBox.style.display = 'none';
            carroussel.style.visibility = 'visible';
            footer.style.visibility = 'visible';
            mainDivDetail.style.visibility = 'visible';
            removeDataDiaporama();
          }

          function removeDataDiaporama() {
            photoSlider.innerHTML = '';
          }
        }

        // fonction par Date
      } else if (this.selectedIndex === 2) {
        const mediaListTri = mediaData.sort((a, b) =>
          a.title > b.title ? 1 : -1
        );
        for (data of mediaListTri) {
          const media = new Media(
            data.id,
            data.photographerId,
            data.title,
            data.image,
            data.video,
            data.tags,
            data.likes,
            data.date,
            data.price
          );

          // Pattern Factory pour créer des vidéos ou photos selon la nature du média
          function generateMediaTag() {
            if (media.video == undefined) {
              return `<img class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.image}' alt=''/>`;
            }
            return `<video controls class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.video}' alt=''></video>`;
          }

          //  article pour chaque médias du photographe (créa avec JSON)
          carroussel.innerHTML += `
        <article class="carroussel-card">
            ${generateMediaTag()} 
            <div class="description-image">
            <p aria-label=" le titre de l'oeuvre est ${media.title}">${
            media.title
          }</p>
            <div class="prix-like">
               <p aria-label=" le prix de cette photo est ${media.price}€">${
            media.price
          } €</p>
               <div class="like-compteur"> <span class="likeCounter" id="like-counter-${
                 media.id
               }" aria-label="il à été aimé ${media.likes} fois ">${
            media.likes
          }</span><span><i class="fas fa-heart" id="like-media-${
            media.id
          }"></i></span></div>
            </div>
            </div>
        </article>`;

          // Gestion de la LightBox (tri par titre)
          const lightBox = document.getElementById('lightBox');
          const suivantLightBox = document.getElementById('suivantLightBox');
          const precedentLightBox =
            document.getElementById('precedentLightBox');
          const closeBtnLightBox = document.getElementById('closeBtnLightBox');
          const section = document.querySelector('section');
          let currentViewedMedia;

          // Affichage dynamique de la lightbox
          carroussel.addEventListener('click', throwLightBox);
          function throwLightBox(e) {
            if (e.target.id.startsWith('carroussel-img-')) {
              let id = e.target.id.split('-').pop();
              let media = mediaData.find(element => element.id == id);
              currentViewedMedia = media;

              const imageTag = `<img class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.image}'/>`;
              const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${media.id}" src='medias/photos/${media.photographerId}/${media.video}'></video>`;

              mainDivDetail.style.visibility = 'hidden';
              carroussel.style.visibility = 'hidden';
              footer.style.visibility = 'hidden';
              lightBox.style.display = 'block';

              photoSlider.innerHTML += `
                <div id="photo-Slider-${media.id}">
                    ${media.video == undefined ? imageTag : videoTag} 
                    <p aria-label=" le titre de l'oeuvre est ${media.title}">${
                media.title
              }</p><div>
                `;
            }
            console.log('ceci est ', imageTag);
          }

          // Afficher  photo précédente
          suivantLightBox.addEventListener('click', showNextPhoto);
          window.addEventListener('keydown', event => {
            if (event.key === 'ArrowRight') {
              showNextPhoto();
            }
          });
          function showNextPhoto() {
            const incrementationIndex = 1;
            let index = mediaData.indexOf(currentViewedMedia);
            let nextMedia = mediaData[index + incrementationIndex];
            currentViewedMedia = nextMedia;

            const imageTag = `<img class="carroussel-img" id="carroussel-img-${nextMedia.id}" src="medias/photos/${nextMedia.photographerId}/${nextMedia.image}">`;
            const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${nextMedia.id}" src="medias/photos/${nextMedia.photographerId}/${nextMedia.video}"></video>`;

            if (currentViewedMedia != undefined) {
              photoSlider.innerHTML = `
                ${nextMedia.video == undefined ? imageTag : videoTag} 
                <p>${nextMedia.title}</p>
                <div>
                </div>
            `;
            }
            if (currentViewedMedia == undefined) {
              let currentViewedMedia = nextMedia;
              let index = mediaData.indexOf(currentViewedMedia);
              let nextMedia = mediaData[index + incrementationIndex];
            }
          }

          // Afficher photo précédente
          precedentLightBox.addEventListener('click', showPreviewPhoto);
          window.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
              showPreviewPhoto();
            }
          });
          function showPreviewPhoto() {
            const decrementationIndex = 1;
            let index = mediaData.indexOf(currentViewedMedia);
            let prevMedia = mediaData[index - decrementationIndex];
            currentViewedMedia = prevMedia;

            if (currentViewedMedia != undefined) {
              const imageTag = `<img class="carroussel-img" id="carroussel-img-${prevMedia.id}" src="medias/photos/${prevMedia.photographerId}/${prevMedia.image}">`;
              const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${prevMedia.id}" src="medias/photos/${prevMedia.photographerId}/${prevMedia.video}"></video>`;
              photoSlider.innerHTML = `
                ${prevMedia.video == undefined ? imageTag : videoTag} 
                <p>${prevMedia.title}</p>
                <div>
                </div>
            `;
            }
            if (currentViewedMedia == undefined) {
              currentViewedMedia = mediaData[mediaData.length - 1];
              let index = mediaData.indexOf(currentViewedMedia);
              let prevMedia = mediaData[index];
            }
          }

          // Fermeture de la lightBox
          closeBtnLightBox.addEventListener('click', closeBox);
          window.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
              closeBox();
            }
          });
          function closeBox() {
            lightBox.style.display = 'none';
            carroussel.style.visibility = 'visible';
            footer.style.visibility = 'visible';
            mainDivDetail.style.visibility = 'visible';
            removeDataDiaporama();
          }
          function removeDataDiaporama() {
            photoSlider.innerHTML = '';
          }
        }
      }
    }

    /*-------------------------------------------------- GESTION LIGHTBOX --------------------------------------------------------------*/

    // Déclaration variables
    const lightBox = document.getElementById('lightBox');
    const suivantLightBox = document.getElementById('suivantLightBox');
    const precedentLightBox = document.getElementById('precedentLightBox');
    const closeBtnLightBox = document.getElementById('closeBtnLightBox');

    let currentViewedMedia;

    // Ecouteur evenement
    carroussel.addEventListener('click', throwLightBox);

    // Fonction affichage lightBox
    function throwLightBox(e) {
      if (e.target.id.startsWith('carroussel-img-')) {
        let id = e.target.id.split('-').pop();
        let media = mediaData.find(element => element.id == id);
        currentViewedMedia = media;

        const imageTag = `<img class='carroussel-img' id="carroussel-img-${media.id}" src='photos/${media.photographerId}/${media.image}''/>`;
        const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${media.id}" src='photos/${media.photographerId}/${media.video}''></video>`;

        mainDivDetail.style.visibility = 'hidden';
        carroussel.style.visibility = 'hidden';
        footer.style.visibility = 'hidden';
        lightBox.style.display = 'block';

        photoSlider.innerHTML += `
                <div id="photo-Slider-${media.id}">
                    ${media.video == undefined ? imageTag : videoTag} 
                    <p aria-label=" le titre de l'oeuvre est ${media.title}">${
          media.title
        }</p><div>
                `;
      }
    }

    // Clique Bouton suivant
    suivantLightBox.addEventListener('click', showNextPhoto);
    window.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') {
        showNextPhoto();
      }
    });

    // Fonction affichage des photos suivantes
    function showNextPhoto() {
      const incrementationIndex = 1;
      let index = mediaData.indexOf(currentViewedMedia);
      let nextMedia = mediaData[index + incrementationIndex];
      currentViewedMedia = nextMedia;

      const imageTag = `<img class="carroussel-img" id="carroussel-img-${nextMedia.id}" src="photos/${nextMedia.photographerId}/${nextMedia.image}">`;
      const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${nextMedia.id}" src="photos/${nextMedia.photographerId}/${nextMedia.video}"></video>`;

      if (currentViewedMedia != undefined) {
        photoSlider.innerHTML = `
                ${nextMedia.video == undefined ? imageTag : videoTag} 
                <p>${nextMedia.title}</p>
                <div>
                </div>
            `;
      }
      if (currentViewedMedia == undefined) {
        let currentViewedMedia = nextMedia;
        let index = mediaData.indexOf(currentViewedMedia);
        let nextMedia = mediaData[index + incrementationIndex];
      }
    }
    //  Clique Bouton précédent
    precedentLightBox.addEventListener('click', showPreviewPhoto);
    window.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        showPreviewPhoto();
      }
    });

    // Fonction affichage des photos précédentes
    function showPreviewPhoto() {
      const decrementationIndex = 1;
      let index = mediaData.indexOf(currentViewedMedia);
      let prevMedia = mediaData[index - decrementationIndex];
      currentViewedMedia = prevMedia;

      if (currentViewedMedia != undefined) {
        const imageTag = `<img class="carroussel-img" id="carroussel-img-${prevMedia.id}" src="photos/${prevMedia.photographerId}/${prevMedia.image}">`;
        const videoTag = `<video controls class='carroussel-img' id="carroussel-img-${prevMedia.id}" src="photos/${prevMedia.photographerId}/${prevMedia.video}"></video>`;
        photoSlider.innerHTML = `
                ${prevMedia.video == undefined ? imageTag : videoTag} 
                <p>${prevMedia.title}</p>
                <div>
                </div>
            `;
      }

      if (currentViewedMedia == undefined) {
        currentViewedMedia = mediaData[mediaData.length - 1];
        let index = mediaData.indexOf(currentViewedMedia);
        let prevMedia = mediaData[index];
      }
    }
    // Fermeture de la LightBox
    closeBtnLightBox.addEventListener('click', closeBox);
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeBox();
      }
    });

    function closeBox() {
      lightBox.style.display = 'none';
      carroussel.style.visibility = 'visible';
      footer.style.visibility = 'visible';
      mainDivDetail.style.visibility = 'visible';
      removeDataDiaporama();
    }

    function removeDataDiaporama() {
      photoSlider.innerHTML = '';
    }
  });

//***********************FENETRE MODAL***********************//

let contactMe = document.querySelector('.contact');
let modal = document.querySelector('.fenetre-modale');
let closeBtn = document.getElementById('closeBtn');
let formIntroduction = document.getElementById('formIntroduction');

// Bouton contact dynamique
formIntroduction.innerHTML += `
        <div>
            <h1>Contactez-moi</h1>
            <h2></h2>
        </div>
    `;

// Lancement de la modale
contactMe.addEventListener('click', lauchModal);
function lauchModal() {
  modal.style.display = 'block';
}

//fermeture de la modale
closeBtn.addEventListener('click', closeModal);
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal();
  }
});
function closeModal() {
  modal.style.display = 'none';
}

// Variables du formulaire
let firstName = document.getElementById('firstname');
let lastName = document.getElementById('lastname');
let eMail = document.getElementById('email');
let messageTexte = document.getElementById('message');
let form = document.getElementById('form');
let firstnameRegExp = new RegExp('[0-9]');
let lastnameRegExp = new RegExp('[0-9]');
let fenetreConfirmation = document.querySelector(
  '.fenetre-validation-formulaire'
);

let isFirstNameValid = false;
let isLastNameValid = false;
let isEmailValid = false;
let isMessageTextValid = false;

let errorFirstName = document.querySelector('.errorFirstName');
let errorLastName = document.querySelector('.errorlastName');
let erroreMail = document.querySelector('.erroreMail');
let erroreMessageText = document.querySelector('.erroreMessageText');

form.addEventListener('submit', validate);

function validate(e) {
  e.preventDefault();

  // Vérification du champ PRENOM
  if (firstName.value.trim() == '') {
    firstName.style.border = '2px solid #901C1C';
    errorFirstName.innerHTML = 'Vous devez écrire votre prénom.';
    isFirstNameValid = false;
  } else if (firstnameRegExp.test(firstName.value)) {
    errorFirstName.innerHTML =
      'Le champ prénom ne doit pas comporter de chiffres.';
    firstName.style.border = '2px solid #901C1C';
    isFirstNameValid = false;
  } else {
    isFirstNameValid = true;
    firstName.style.border = '';
    errorFirstName.innerHTML = '';
  }

  // Vérification du champ NOM
  if (lastName.value.trim() === '') {
    lastName.style.border = '2px solid #901C1C';
    errorLastName.innerHTML = 'Vous devez écrire votre nom.';
    isLastNameValid = false;
  } else if (lastnameRegExp.test(lastName.value)) {
    errorLastName.innerHTML = 'Le champ nom ne doit pas comporter de chiffres.';
    lastName.style.border = '2px solid #901C1C';
    isLastNameValid = false;
  } else {
    isLastNameValid = true;
    lastName.style.border = '';
    errorLastName.innerHTML = '';
  }

  // Vérification du champ EMAIL
  if (eMail.value.trim() === '') {
    eMail.style.border = '2px solid #901C1C';
    erroreMail.innerHTML = 'Vous devez renseigner votre e-mail.';
    isEmailValid = false;
  } else {
    isEmailValid = true;
    eMail.style.border = '';
    erroreMail.innerHTML = '';
  }

  // Vérification du champ MESSAGE TEXTE
  if (messageTexte.value.trim() === '') {
    messageTexte.style.border = '2px solid #901C1C';
    erroreMessageText.innerHTML = 'Vous devez écrire votre message.';
    isMessageTextValid = false;
  } else {
    isMessageTextValid = true;
    messageTexte.style.border = '';
    erroreMessageText.innerHTML = '';
  }

  // Envoie des données dans la console navigateur
  if (
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isMessageTextValid
  ) {
    console.log('le prénom est ', firstName.value);
    console.log('le nom est ', lastName.value);
    console.log('le email est ', eMail.value);
    console.log('le texte saisi est ', messageTexte.value);
    closeModal();
    removeData();
    openFenetreConfirmation();
  }
}

// Suppression des données saisies pour une nouvelle requête
function removeData() {
  firstName.value = '';
  lastName.value = '';
  eMail.value = '';
  messageTexte.value = '';
}

// Ouverture du message de validation confirmation (apres envoie formulaire)
function openFenetreConfirmation() {
  fenetreConfirmation.style.display = 'block';
}
