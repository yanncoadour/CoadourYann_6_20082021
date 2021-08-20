//récupération data json

fetch('JS/data.json')
  .then(function (res) {
    return res.json();
  })
  .then(function (value) {
    let profilPhotographe = document.getElementById('profilPhotographe');
    for (i = 0; i < value.photographers.length; i++) {
      profilPhotographe.innerHTML = `
          <div class="photoIdentite"><img src="medias/photographersPhotos/${photographers.portrait}" alt="lien vers la page de ${photographers.name}"></div>
          <h2 class="identite">${photographers.name}</h2>
          <p class="lieu">${photographers.city}, ${photographers.country}</p>
          <p class="tagline">${photographers.tagline} </p>
          <p  class="prix">${photographers.price}€/jour</p>
          <div class="tags">${photographerstagHtml}</div>
       `;
    }
  })
  .catch(function (error) {
    console.log('erreur');
  });
