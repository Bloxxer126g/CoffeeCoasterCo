async function CreateCheckout() {
    try {
        let response = await fetch("/api/createcheckout", {
            method: "POST"
        });
        const rawText = await response.text();
        console.log("Raw Server Response:", rawText);

        let data = JSON.parse(rawText);
        
        if (data.url) {
            console.log("Redirecting to Square:", data.url);
            window.location.href = data.url;
        } else {
            console.error("Backend didn't return a URL:", data);
        }

    } catch (error) {
        console.error("Something went wrong with the fetch:", error);
    }
}

CreateCheckout();