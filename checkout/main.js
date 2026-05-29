async function CreateCheckout() {
    try {
        let response = await fetch("/api/createcheckout", {
            method: "POST",
            body: localStorage.getItem("Cart")
        });
        const rawText = await response.text();
        console.log("Raw Server Response:", rawText);

        let data = JSON.parse(rawText);
        
        if (data.url) {
            document.getElementById("CheckoutFrame").src = data.url;
        } else {
            console.error("Backend didn't return a URL:", data);
        }

    } catch (error) {
        document.getElementById("LoadingText").innerHTML = error
        if (error == "Value for `order.line_items` should not be empty.") {
                    document.getElementById("LoadingText").innerHTML = "Your basket is empty!"
        }
        console.error("Something went wrong with the fetch:", error);
    }
}

CreateCheckout();