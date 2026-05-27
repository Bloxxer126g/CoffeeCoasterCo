async function DisplayItems() {
    let Items = await fetch("/api/items.json");
    let Response = await Items.json();

    Response.Items.forEach(element => {
        let ShownItem = document.createElement("img");
        ShownItem.src = element.Image;
        ShownItem.classList = "Product";
        ShownItem.id = element.Name;
        let AddedCart = document.createElement("p")
        AddedCart.classList = "AddedCart"
        AddedCart.id = `${element.Name}_AddedCart`
        AddedCart.innerHTML = ""
        document.getElementById("Items").appendChild(ShownItem);
        ShownItem.appendChild(AddedCart)
        console.log(element.Name);
        console.log(element.Cost);
        console.log(element.Image);

        ShownItem.addEventListener("click", event => {
            AddedCart.innerHTML = "Added To Cart!"
            setTimeout(event => {
                AddedCart.innerHTML = ""
            }, 400)
        })
    });

    
}

DisplayItems();