async function DisplayItems() {
    let Items = await fetch("/public/items.json");
    let Response = await Items.json();

    Response.Items.forEach(element => {
    let ProductWrapper = document.createElement("div");
    ProductWrapper.className = "ProductContainer";
    let ShownItem = document.createElement("img");
    ShownItem.src = element.Image;
    ShownItem.classList = "Product";
    ShownItem.id = element.Name;
    let AddedCart = document.createElement("p");
    AddedCart.classList = "AddedCart";
    AddedCart.id = `${element.Name}_AddedCart`;
    AddedCart.innerHTML = "";
    ProductWrapper.appendChild(ShownItem);
    ProductWrapper.appendChild(AddedCart);
    document.getElementById("Items").appendChild(ProductWrapper);

    ShownItem.addEventListener("click", () => {
        AddedCart.innerHTML = "Added To Cart!";
        let Cart = localStorage.getItem("Cart");
        console.log(Cart);
        let Table = [];
        Cart.split(",").forEach(element => {
            Table.splice(1, 0, element);
        });
        Cart = Table;
        Cart.splice(1, 0, element.Name);
        localStorage.setItem("Cart", Cart);
        console.log(Cart)
        setTimeout(() => {
            AddedCart.innerHTML = "";
        }, 400);
    });
});

    
}

DisplayItems();