const BASE_DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/"; 
const BASE_IMAGE_URL = `https://source.unsplash.com/800x600/?`; 
 
const form = document.querySelector("#form"); 
const wordToSearchInput = form.querySelector("input"); 
const searchedWordParagraph = document.querySelector("#searched-word"); 
 
const infoGroup = document.querySelector("#info-group"); 
const audioGroup = document.querySelector("#audio-group"); 
 
let searchedWordBackup; 
 
const firstLetterUppercase = (word) => { 
    return word.substring(0, 1).toUpperCase() + word.substring(1, word.length + 1) 
} 
 
const loader = { 
    loader: document.querySelector(".loader"), 
 
    show() { 
        this.loader.classList.add('show'); 
    }, 
    hide() { 
        this.loader.classList.remove('show'); 
    } 
} 
 
const noWordSearchedContainer = { 
    container: document.querySelector("#no-word"), 
 
    show() { 
        this.container.classList.remove("hide"); 
        this.container.innerHTML = `<p>No results for the searched word "${searchedWordBackup}"</p>`; 
    }, 
    hide() { 
        this.container.classList.add("hide"); 
        this.container.innerHTML = ""; 
    } 
} 
 
const gridContainer = { 
    container: document.querySelector(".grid"), 
    show() { 
        this.container.classList.add("show"); 
    }, 
    hide() { 
        searchedWordParagraph.innerText = audioGroup.innerHTML = infoGroup.innerHTML = ""; 
        this.container.classList.remove("show"); 
    } 
} 
 
const createImageHTML = (wordSearched) => { 
    const image = `<img src="${BASE_IMAGE_URL}${wordSearched}" alt="${wordSearched} image">`; 
    return image; 
} 
 
const createMeaningsHTML = (meanings) => { 
    let html = ""; 
 
    meanings.forEach(meaning => { 
        const { partOfSpeech, definitions, antonyms, synonyms } = meaning; 
 
        html += `         
        <div class="item"> 
            <h3 class="title">${firstLetterUppercase(partOfSpeech)}</h3>`; 
 
        definitions.forEach(def => { 
            const { definition, example } = def; 
 
            const synonymsGroup = []; 
             
 
            const antonymsGroup = []; 
             
 
            html += ` 
            <h3 class="subtitle mt">Definition</h3> 
            <ul> 
                <li>${definition}</li> 
            </ul> 
 
            <h3 class="subtitle">Synonyms</h3> 
            <ul> 
                <li>${synonyms.length > 0 ? synonyms.join(", ") : "No results for synonyms to this word"}</li> 
            </ul> 
 
            <h3 class="subtitle">Antonyms</h3> 
            <ul> 
                <li>${antonymsGroup.length > 0 ? antonymsGroup.join(", ") : "No results for antonyms to this word"}</li> 
            </ul> 
 
            <h3 class="subtitle">Examples</h3> 
            <ul> 
                <li>${example ?? "No results for examples to this word"}</li> 
            </ul>`; 
        }); 
 
        html += `</div>`; 
    }); 
 
    html += `<a href="#">Go to top</a>`; 
    return html; 
} 
 
const createAnotherInfos = (data) => { 
    const { phonetics, phonetic } = data; 
    const { name, url } = data.license; 
    const image = createImageHTML(searchedWordBackup); 
    const audio = phonetics[0]?.audio ? `<audio controls src="${phonetics[0].audio}"></audio>` : ""; 
 
    let html = ` 
    <div class="container"> 
        ${image} 
        <div class="info-content"> 
            <p>Phonetic: ${phonetic ?? "No results for the phonetic of this word"}</p> 
        </div> 
        <div class="audio-content"> 
            ${audio} 
        </div> 
        <div class="info-content"> 
            <p>License: <a href="${url}" target="_blank">${name}</a></p> 
        </div> 
    </div>`; 
 
    return html; 
} 
 
const createHTML = (data) => { 
    if (!data) return noWordSearchedContainer.show(); 
 
    const { word, meanings } = data; 
 
    const meaningsHTML = createMeaningsHTML(meanings); 
    const anotherHTML = createAnotherInfos(data); 
 
    audioGroup.innerHTML = anotherHTML; 
    infoGroup.innerHTML = meaningsHTML; 
    searchedWordParagraph.innerText = firstLetterUppercase(word); 
 
    gridContainer.show(); 
} 
 
const fetchAPI = (searchedWord) => { 
    loader.show(); 
    gridContainer.hide(); 
    noWordSearchedContainer.hide(); 
 
    if (searchedWord == "") return; 
 
    const URL = `${BASE_DICTIONARY_API_URL}${searchedWord}`; 
 
    fetch(URL) 
        .then(data => data.json()) 
        .then(data => createHTML(data[0])) 
        .catch(error => console.error(error)) 
        .finally(() => { loader.hide() }); 
} 
 
form.addEventListener("submit", e => { 
    searchedWordBackup = wordToSearchInput.value; 
 
    e.preventDefault(); 
    fetchAPI(wordToSearchInput.value); 
 
    wordToSearchInput.value = ""; 
}); 
 
wordToSearchInput.focus(); 
