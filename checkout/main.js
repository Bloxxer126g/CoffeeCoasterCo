const appId = 'sq0idp-0FgQw4W25RfCW8EvmceRMw';
const locationId = 'LQ69R2E9RR9R9'; 

console.log("main.js running");

async function init() {
  console.log("Init running");
  const statusDiv = document.getElementById('payment-status');
  
  if (!window.Square) {
    statusDiv.innerText = "Error: Square.js library failed to load.";
    return;
  }

  try {
    const payments = window.Square.payments(appId, locationId);
    const card = await payments.card();
    await card.attach('#card-container');
    statusDiv.innerText = "Form loaded successfully!";
  } catch (error) {
    statusDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    console.error("Square initialization failed:", error);
  }
}

document.addEventListener("DOMContentLoaded", init)