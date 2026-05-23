async function main() {
      const payments = Square.payments(
        "sandbox-sq0idb-9r9UYTXziI5RghI_mA23Yg",
        "LXDKNXD5CK9XMLJV7PE945RP7P"
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