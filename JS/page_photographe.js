// Récupération de l'URL
let url = new URL(window.location);
let id = url.searchParams.get('id');
let totalLike = 0;

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

    const filtresArticles = document.getElementById(
      'filtres-articles-' + photographer.id
    );
    for (tag of photographer.tags) {
      filtresArticles.innerHTML += `<span class="photographerTag" data-tag="${tag}">#${tag}</span>`;
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
