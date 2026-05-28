async function DisplayCart() {
    let Cart = localStorage.getItem("Cart");
    let Table = []; 
    const itemsContainer = document.getElementById("Items");
    if (itemsContainer) itemsContainer.innerHTML = "";
    
    function formatPrice(totalPence) {
        if (totalPence < 100) {
            return `${totalPence}p`;
        } else {
            const pounds = totalPence / 100;
            return `£${pounds.toFixed(2)}`; 
        }
    }

    if (Cart == null || Cart.trim() === "") {
        const emptyElement = document.getElementById("Empty");
        if (emptyElement) emptyElement.innerHTML = "Cart Is Empty!";
        return;
    } else {
        const emptyElement = document.getElementById("Empty");
        if (emptyElement) emptyElement.innerHTML = "";
    }
    
    Cart.split(",").forEach(element => {
        if (element) Table.splice(1, 0, element);
    });

    let Items = await fetch("/data/items.json");
    let Response = await Items.json();

    let CurrentItems = [];

    Table.forEach(element => {
        let Index = null;
        CurrentItems.forEach(CItem => {
            if (CItem.Name == element) {
                Index = CItem.Index;
            }
        });
        
        if (Index != null) {
            CurrentItems.forEach(CItem => {
                if (CItem.Name == element) {
                    CItem.Amount += 1;
                }
            });
        } else {
            let Found = null;
            Response.Items.forEach(item => {
                if (item.Name == element) {
                    Found = item;
                }
            });
            
            if (Found == null) {
                const index = Table.indexOf(element);
                Table.splice(index, 1);
                return;
            }

            let DataTable = {
                Name: element,
                Index: CurrentItems.length + 1,
                Cost: Found.Cost,
                Amount: 1,
            };

            CurrentItems.splice(1, 0, DataTable);
        }
    });

    console.log(CurrentItems);

    if (itemsContainer) {
        CurrentItems.forEach(element => {
            let ItemString = document.createElement("p");
            itemsContainer.appendChild(ItemString);
            ItemString.classList = "ItemsText";
            const totalCost = element.Cost * element.Amount;
            ItemString.innerHTML = `${element.Name} x${element.Amount} - ${formatPrice(totalCost)}`;

            ItemString.addEventListener("click", () => {
                let currentCartArray = localStorage.getItem("Cart").split(",");
                let updatedCartArray = currentCartArray.filter(cartItem => cartItem !== element.Name);
                localStorage.setItem("Cart", updatedCartArray.join(","));

                DisplayCart();
            });
        });
    }
}

DisplayCart();