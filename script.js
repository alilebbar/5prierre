// Fonction pour obtenir la date d'aujourd'hui sous le format requis pour l'API de salat
function getFormattedDate() {
    var date = new Date();
    var year = date.getUTCFullYear();
    var month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    var day = date.getUTCDate().toString().padStart(2, '0');
    return day + '-' + month + '-' + year;
}
function getGeolocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    reject(`Erreur de géolocalisation : ${error.message}`);
                }
            );
        } else {
            reject("La géolocalisation n'est pas prise en charge par ce navigateur.");
        }
    });
}
/*async function getGeolocation() {
   
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    return({ latitude, longitude });
                },
                (error) => {
                    return(`Erreur de géolocalisation : ${error.message}`);
                }
            );
        } else {
           return("La géolocalisation n'est pas prise en charge par ce navigateur.");
        }
    
}*/
// Fonction pour obtenir la localisation actuelle et appeler l'API de géocodage inversé
function getCountryFromCoordinates(latitude, longitude) {
    return new Promise((resolve, reject) => {
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.address && data.address.country) {
                    resolve(data.address.country);
                } else {
                    reject("Pays non trouvé.");
                }
            })
            .catch(error => reject(`Erreur lors de la récupération du pays : ${error}`));
    });
}

function getCityFromCoordinates(latitude, longitude) {
    return new Promise((resolve, reject) => {
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.address && data.address.city) {
                    resolve(data.address.city);
                } else {
                    reject("Ville non trouvée.");
                }
            })
            .catch(error => reject(`Erreur lors de la récupération de la ville : ${error}`));
    });
}
getGeolocation()
    .then(coordinates => {
        const { latitude, longitude } = coordinates;

        // Obtenez le pays
        getCountryFromCoordinates(latitude, longitude)
            .then(country => {
                // Obtenez la ville
                getCityFromCoordinates(latitude, longitude)
                    .then(city => {
                        // Appelez votre fonction avec la ville et le pays
                        var formattedDate = getFormattedDate();
                        document.querySelector(".titre").innerHTML = `<h2>Les Horaires du Salat du ${formattedDate} de ${city} ${country}</h2>`;
                        creatFiche(formattedDate, city, country);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    })


// Fonction pour récupérer et afficher les temps de prière
async function creatFiche(formattedDate, city, country) {
    var api_url = 'https://api.aladhan.com/v1/timingsByAddress/' + formattedDate + '?address=' + country + ',' + city;

    try {
        loader(true)
        const response = await fetch(api_url);
        const prayerTimes = await response.json();

        let pfajr = prayerTimes.data.timings.Fajr;
        let pdohr = prayerTimes.data.timings.Dhuhr;
        let pasr = prayerTimes.data.timings.Asr;
        let pmaghrib = prayerTimes.data.timings.Maghrib;
        let pishae = prayerTimes.data.timings.Isha;

      
        let fajr = document.querySelector(".fajr p").innerHTML = `${pfajr}`;
        let dohr = document.querySelector(".dohr p").innerHTML = `${pdohr}`;
        let asr = document.querySelector(".asr p").innerHTML = `${pasr}`;
        let maghrib = document.querySelector(".maghrib p").innerHTML = `${pmaghrib}`;
        let ishae = document.querySelector(".ishae p").innerHTML = `${pishae}`;
    } catch (error) {
        console.log('Erreur lors de la requête API :', error);
    }finally{
        loader(false)
    }
}



// zoomer chaque div
document.addEventListener('DOMContentLoaded', function () {
    var divs = document.querySelectorAll('.ficheSalat div');

    divs.forEach(function (div) {
      div.addEventListener('mouseenter', function () {
        this.classList.add('zoomed');
      });

      div.addEventListener('mouseleave', function () {
        this.classList.remove('zoomed');
      });
    });
  });

  function loader(show= true){
    if (show) {
        document.getElementById("loader").style.visibility = "visible"
    } else {
        document.getElementById("loader").style.visibility = "hidden"
    }
  }

