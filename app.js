const productList = document.querySelector(".product-list");
const btns = document.querySelector(".btns");
const cut = 6;

/////////// HELPER FUNCTIONS /////////////
//fetch all Products data
const fetchAllProducts = async () => {
  const productsData = await fetch("https://fakestoreapi.com/products");
  const allProducts = await productsData.json();
  return allProducts;
};

//render every product item of a product array
const renderProducts = (productArray) => {
  productArray.forEach((product) => {
    const markup = `
    <li class="product-item item-${product.id}">
    <img class="product-image" src=${product.image} />
    <h1 class="product-title">${product.title}</h1>
    <h5 class="product-price ">$ ${product.price}</h5>
  </li>
        `;
    productList.insertAdjacentHTML("beforeend", markup);
  });
};

//slice array of products into arrays with length of cut
const arraySlicer = function (arr, curPage = 1) {
  //cut = 6 //curPgae=1: slice(0,6) // curPgae=2: slice(6,12) // curPage=3: slice(12,18) // curPgae=4: slice(18,24)
  const start = (curPage - 1) * cut;
  const end = curPage * cut;
  slicedArr = arr.slice(start, end);
  //console.log(slicedArr);
  return slicedArr;
};

// render buttons
const renderButtons = function (arr, curPage = 1) {
  const totalPage = Math.ceil(arr.length / cut);
  console.log(`The total number of pages is : ${totalPage}`);
  console.log(` current page is: ${curPage}`);

  let btnMarkUp = "";
  // Other pages
  if (!(curPage === 1) && curPage < totalPage) {
    btnMarkUp = `
            <button class="btn next" data-go-to-page=${curPage - 1}> \< page ${
      curPage - 1
    }</button>
            <button class="btn previous" data-go-to-page=${curPage + 1} >page${
      curPage + 1
    } \> </button>
         `;
  }
  // Frist page
  // 1. first page with other pages
  if (curPage === 1 && totalPage > 1) {
    btnMarkUp = `
            <button class="btn previous" data-go-to-page=${curPage + 1}> page ${
      curPage + 1
    } \></button>
         `;
  }
  // 2.single page
  if (curPage === 1 && totalPage === 1) {
    btnMarkUp = "";
  }
  // Last page
  if (curPage === totalPage && totalPage !== 1) {
    btnMarkUp = `
            <button class="btn next" data-go-to-page=${curPage - 1}> \< page ${
      curPage - 1
    }</button>
        `;
  }
  btns.insertAdjacentHTML("beforeend", btnMarkUp);
};

/////////// RUN THE APP ////////////

// first page rendering
const init = async () => {
  //fetch all product data
  const allProducts = await fetchAllProducts();
  // render first slice of data with goToPage =1
  renderProducts(arraySlicer(allProducts));
  renderButtons(allProducts);
};
init();

const changeButtons = async (e) => {
  const allProducts = await fetchAllProducts();
  e.preventDefault();
  const clickedBtn = e.target;
  const goToPage = +clickedBtn.dataset.goToPage;

  if (goToPage > 0) {
    btns.innerHTML = "";
    productList.innerHTML = "";
    renderButtons(allProducts, goToPage);
    renderProducts(arraySlicer(allProducts, goToPage));
  }
};

btns.addEventListener("click", changeButtons);
