async function DisplayCart() {
    let Cart = localStorage.getItem("Cart");
    Table = [];
    if (Cart == null) {
        Cart = "";
    } else {
        document.getElementById("Empty").innerHTML = "";
    }
    Cart.split(",").forEach(element => {
        Table.splice(1, 0, element);
    })

    let Items = await fetch("/data/items.json");
    let Response = await Items.json();

    let CurrentItems = []

    Table.forEach(element => {
        let Index
        CurrentItems.forEach(CItem => {
            if (CItem.Name == element) {
                Index = CItem.Index;
            };
        });
        if (Index != null) {

            CurrentItems.forEach(CItem => {
                if (CItem.Name == element) {
                    CItem.Amount += 1;
                };
            });

        } else {
            let Found = null
            Response.Items.forEach(item => {
                if (item.Name == element) {
                    Found = item;
                }
            });
            if (Found == null) {
                const index = Table.indexOf(Table, element);
                Table.splice(index, 1);
                return false;
            }

            DataTable = {
                Name: element,
                Index: CurrentItems.length + 1,
                Cost: Found.Cost,
                Amount: 1,
            }

            CurrentItems.splice(1, 0, DataTable);
        }
    });

    console.log(CurrentItems);

    CurrentItems.forEach(element => {
        let ItemString = document.createElement("p")
        document.getElementById("Items").appendChild(ItemString)
        ItemString.innerHTML = `${element.Name} x${element.Amount} - ${element.Cost * element.Amount}p`
    });
}

DisplayCart();