import { IProduct } from "./contracts/contracts";
import { IRating } from "./contracts/contracts";
import { Category } from "./contracts/contracts";

const BASEURL = "https://fakestoreapi.com/products";
const ALLELECTRONICS = `${BASEURL}/category/electronics`;
const ALLJEWELERY = `${BASEURL}/category/jewelery`;
const ALLMENSCLOTHING = `${BASEURL}/category/men's clothing`;
const ALLWOMENSCLOTHING = `${BASEURL}/category/women's clothing`;



const searchText = document.getElementById('searchText') as HTMLInputElement;
const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
const sortierFeld = document.getElementById('sortier-feld') as HTMLSelectElement;
const filterElectronics = document.getElementById('filter_electronics') as HTMLButtonElement;
const filterJewelery = document.getElementById('filter_jewelery') as HTMLButtonElement;
const filterMensClothing = document.getElementById('filter_mens_clothing') as HTMLButtonElement;
const filterWomensClothing = document.getElementById('filter_womens_clothing') as HTMLButtonElement;
const maincontent = document.getElementById('main_content_display') as HTMLElement;
const statusDiv = document.getElementById('statusText') as HTMLDivElement;

document.addEventListener("DOMContentLoaded", () => {
  fetchAllProducts(); //lisa
});

let allProducts: IProduct[] = [];

// Daten von API holen
function fetchAllProducts() {
  fetch(BASEURL)
    .then((response: Response) => {
      if (!response.ok) {
        throw Error(`${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((products: IProduct[]) => {
      displayProducts(products);
      allProducts = products;
    });
}

// Rendern der Produkte
function displayProducts(products: IProduct[]) {
  if (maincontent) {
    maincontent.innerHTML = "";
    const singleProductDivs = products.map((product: IProduct) => {
      const divElement = document.createElement("div");
      const stillLoading = document.createElement("div");
      stillLoading.id = "loading";
      divElement.appendChild(stillLoading);
      const imgElement = document.createElement("img");
      imgElement.src = product.image; // src statt innerhtml lisa
      const headline = document.createElement("h1");
      headline.innerHTML = product.title;
      const heart = document.createElement("img");
      heart.src = "./src/assets/heart_unclicked.png";
      heart.classList.add("heart");
      heart.id = 'favorite_heart';
      // heart
      const heart_clicked = "./src/assets/heart_clicked.png";
      const heart_unclicked = "./src/assets/heart_unclicked.png";
      // Klick-Event-Listener hinzufügen
      heart.addEventListener('click', () => {
      // Bildquelle umschalten
      if (heart.src.includes("unclicked")) {
        console.log("test");
      heart.src = heart_clicked;
      } else {
      heart.src = heart_unclicked;
      }});
      const divElementInner = document.createElement("div");
      const price = document.createElement("p");
      price.innerHTML = product.price.toString()+"€";
      const addCart = document.createElement("button");
      addCart.innerHTML = "Add to Cart";
      divElementInner.appendChild(price);
      divElementInner.appendChild(addCart);
      divElement.appendChild(imgElement);
      divElement.appendChild(headline);
      divElement.appendChild(divElementInner); // Preis und Button
      divElement.appendChild(heart);
      divElement.removeChild(stillLoading);
      return divElement;
    });
    singleProductDivs.forEach((product) => {
      maincontent.appendChild(product); 
    });
  }
}

function sortProducts(event: Event): void {
  console.log("sortProducts");
  event.preventDefault();
  const sortValue = sortierFeld.value;
  switch (sortValue) {
    case "preis-aufsteigend":
      console.log("test");
      sortPriceAscending();
      break;
    case "preis-absteigend":
      sortPriceDescending();
      break;
    case "rating-aufsteigend":
      sortRatingAscending();
      break;
    case "rating-absteigend":
      sortRatingDescending();
      break;
  }
  console.log(allProducts);
  displayProducts(allProducts);
}

function sortPriceAscending() {
  allProducts.sort((a, b) => a.price - b.price);
}

function sortPriceDescending() {
  allProducts.sort((a, b) => b.price - a.price);
}

function sortRatingAscending() {
  allProducts.sort((a, b) => a.rating.rate - b.rating.rate);
}

function sortRatingDescending() {
  allProducts.sort((a, b) => b.rating.rate - a.rating.rate);
}

sortierFeld.addEventListener("change", sortProducts);

// //? const filterElectronics = document.getElementById('filter_electronics') as HTMLButtonElement;


filterElectronics?.addEventListener("click", () => {
  activateFilterByCategory(ALLELECTRONICS);
  toggleActiveButton(filterElectronics);
});
filterJewelery?.addEventListener("click", () => {
  activateFilterByCategory(ALLJEWELERY);
  toggleActiveButton(filterElectronics);
});
filterMensClothing?.addEventListener("click", () => {
  activateFilterByCategory(ALLMENSCLOTHING);
  toggleActiveButton(filterElectronics);
});
filterWomensClothing?.addEventListener("click", () => {
  console.log('button_clicked');
  activateFilterByCategory(ALLWOMENSCLOTHING);
  toggleActiveButton(filterElectronics);
});

function activateFilterByCategory(url: string) {
  fetch(url)
    .then((response: Response) => {
      if (!response.ok) {
        throw Error(`${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    // wird übergeben von Response
    .then((products: IProduct[]) => {
      // sortierter Array wird in die Render Funktion gegeben
      displayProducts(products);
    })
    .catch((error: Error) => {
      console.error(error);
    })
  }




searchButton?.addEventListener('click', (event: Event) => {
  event.preventDefault;
  let products = findSearchedText ();
  displayProducts(products);
  console.log(findSearchedText());

  const createtStatuselement = document.createElement('p');
  if(products.length>0){
    statusDiv.innerHTML = "";
    createtStatuselement.innerHTML = `Es wurden erfolgreich ${products.length} Produkte gefunden.`
    createtStatuselement.style.backgroundColor = "#a7c4c8";
    createtStatuselement.style.padding = "2%";
    createtStatuselement.style.borderRadius = "15px";
    statusDiv.appendChild(createtStatuselement);
  }else{
    statusDiv.innerHTML = "";
    createtStatuselement.innerHTML = `Es wurden leider keine Produkte gefunden.`
    createtStatuselement.style.backgroundColor = "#a7c4c8";
    createtStatuselement.style.padding = "2%";
    createtStatuselement.style.borderRadius = "15px";
    statusDiv.appendChild(createtStatuselement);
  }
  });
  


function findSearchedText() {
  const searchTextInputValue = searchText.value;
  const allProductsWithSearchedText = allProducts.filter(product =>
      product.title.toLowerCase().includes(searchTextInputValue.toLowerCase())
  );
  return allProductsWithSearchedText;
}

//?footer
//?hover-zoom-bilder
//?ausgewählt category farblich zeigen
//?


const buttons = document.querySelectorAll(".filter_button") as NodeListOf<HTMLButtonElement>;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  })})

  function toggleActiveButton(button: HTMLButtonElement) {
    const filterButtons = [filterElectronics, filterJewelery, filterMensClothing, filterWomensClothing];
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
}


