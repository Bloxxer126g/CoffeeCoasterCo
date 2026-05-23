async function main() {
      const payments = Square.payments(
        "sq0idp-VuEJ7b1oBA7gWVKHfYOzww",
        "LXDKNXD5CK9XM"
      );

      const card = await payments.card();
      await card.attach("#card-container");

      document.getElementById("pay-btn").onclick = async () => {
        const result = await card.tokenize();

        if (result.status === "OK") {
          // Send token to backend
          const res = await fetch("/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: result.token })
          });

          const data = await res.json();
          console.log(data);
          alert("Payment complete!");
        } else {
          alert("Card error: " + result.status);
        }
      };
    }

    main();