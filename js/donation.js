const DONATION_MIN_AMOUNT = 21;

async function submitDonation() {
  const errorMsg = document.getElementById('errorMsg');
  const submitBtn = document.getElementById('submitBtn');
  errorMsg.style.display = 'none';

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const amountRaw = document.getElementById('amount').value.trim();
  const amount = parseInt(amountRaw, 10);

  if (!name) { alert('దయచేసి మీ పేరు నమోదు చేయండి / Please enter your name'); return; }
  if (!phone || phone.length < 10) { alert('దయచేసి సరైన మొబైల్ నంబర్ నమోదు చేయండి / Please enter a valid mobile number'); return; }
  if (!amountRaw || isNaN(amount) || amount < DONATION_MIN_AMOUNT) {
    alert(`దయచేసి కనీసం ₹${DONATION_MIN_AMOUNT} విరాళం నమోదు చేయండి / Please enter a donation amount of at least ₹${DONATION_MIN_AMOUNT}`);
    return;
  }

  const booking = {
    name, phone, city: null,
    participation_type: 'Donation',
    services: [],
    total_amount: amount,
    notes: notes || null
  };

  submitBtn.disabled = true;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(booking)
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(detail || `Request failed with status ${res.status}`);
    }

    sessionStorage.setItem('krutyaBooking', JSON.stringify(booking));
    window.location.href = 'payment.html';
  } catch (err) {
    console.error('Donation save failed:', err);
    errorMsg.textContent = 'నమోదు విఫలమైంది, దయచేసి మళ్ళీ ప్రయత్నించండి / Registration failed, please try again.';
    errorMsg.style.display = 'block';
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    submitBtn.disabled = false;
  }
}
