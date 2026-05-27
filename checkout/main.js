const appId = 'sandbox-sq0idb-Qiv7AsASUnLyalrbfcjVxw';
const locationId = 'LBKW9Y07HJT7B'; 

async function init() {
  if (!window.Square) {
    throw new Error('Square.js failed to load');
  }

  const payments = window.Square.payments(appId, locationId);
  const card = await payments.card();
  await card.attach('#card-container');

  const cardButton = document.getElementById('card-button');
  
  cardButton.addEventListener('click', async () => {
    cardButton.disabled = true;
    const result = await card.tokenize();
    
    if (result.status === 'OK') {
      const response = await fetch('/api/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: result.token,
          amount: 10
        })
      });
      
      const paymentResult = await response.json();
      if (paymentResult.success) {
        document.getElementById('payment-status').innerText = "Payment Successful!";
      } else {
        document.getElementById('payment-status').innerText = "Payment Failed.";
        cardButton.disabled = false;
      }
    } else {
      document.getElementById('payment-status').innerText = "Tokenization failed.";
      cardButton.disabled = false;
    }
  });
}

init();