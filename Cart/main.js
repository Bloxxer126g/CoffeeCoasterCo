async function DisplayCart() {
    let Cart = localStorage.getItem("Cart")
    Table = []
    Cart.split(",").forEach(element => {
        Table.splice(1, 0, element)
    })
}

DisplayCart();