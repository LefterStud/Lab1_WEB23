$info_shield = document.querySelector(".infoshield");
$countOfPokemons = document.querySelector(".pokemon_count");
const API = "https://pokeapi.co/api/v2/pokemon/"
let pokemons = [];

if (!!getLS('pokemons')) {
    printPokemons(getLS("pokemons"));
}

function setLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function getLS(key) {
    return JSON.parse(localStorage.getItem(key));
}

//Видалення Покемона
$info_shield.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete_Button')) {
        let tempArr = getLS("pokemons");
        tempArr.splice(e.target.getAttribute('data-index'), 1)
        localStorage.setItem("pokemons", JSON.stringify(tempArr));
        printPokemons(getLS("pokemons"));
    }
});

//Отримання списку покемонів з API, та збереження його в LocalStorage
function updateLS() {
    fetch(API)
        .then((responce) => {
            return responce.json();
        })
        .then(function (data) {
            pokemons = data.results;
            for (let i = 0; i < pokemons.length; i++) {
                fetch(pokemons[i].url)
                    .then((responce) => {
                        return responce.json();
                    })
                    .then(function (data) {    
                        pokemons[i].pokePic = data.sprites.front_default;
                        pokemons[i].height = data.height;
                        pokemons[i].weight = data.weight;
                        pokemons[i].element = data.types[0].type.name; 
                        setLS('pokemons', pokemons);
                    })
            }
            console.log(pokemons)
        })
}
// updateLS();
 
//Функція для показу покемонів
function printPokemons(list) {
    let temp = '';
    if (list.length) {
        for (let i = 0; i < list.length; i++) {
            temp += '<div class="pokemon_banner"><img src="' + list[i].pokePic + '"><p> ' + list[i].name[0].toUpperCase()+list[i].name.substring(1) + '</p><p>Element: ' + list[i].element + '</p><p>Height: ' + list[i].height + '</p><p>Weight: ' + list[i].weight + '</p><input class = "delete_Button" type="button" value="Delete" data-index="' + i + '"></div>';
        }
    } else {
        temp += '<h1 class="NF">Pokemons not found!</h1>';
    }
    $info_shield.innerHTML = temp;
    $countOfPokemons.innerHTML = list.length + " pokemons";
}

//Живий пошук
$pokeSearch = document.querySelector(".pokesearch");
$pokeSearch.addEventListener('input', function () {
    let query = this.value.toString().toLowerCase();
    let filterdPokemons = getLS("pokemons").filter((el) => {
        return ~el.name.toLowerCase().indexOf(query.toLowerCase());
    })
    printPokemons(filterdPokemons);
});








