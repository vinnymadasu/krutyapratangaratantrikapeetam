async function submitServiceBooking() {
  const errorMsg = document.getElementById('errorMsg');
  const submitBtn = document.getElementById('submitBtn');
  const form = document.getElementById('bookingForm');
  errorMsg.style.display = 'none';

  const serviceTe = form.dataset.serviceTe;
  const serviceEn = form.dataset.serviceEn;
  const price = parseInt(form.dataset.price, 10);

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const city = document.getElementById('city').value.trim();
  const notes = document.getElementById('notes').value.trim();

  if (!name) { alert('దయచేసి మీ పేరు నమోదు చేయండి / Please enter your name'); return; }
  if (!phone || phone.length < 10) { alert('దయచేసి సరైన మొబైల్ నంబర్ నమోదు చేయండి / Please enter a valid mobile number'); return; }

  const booking = {
    name, phone, city: city || null,
    participation_type: serviceEn,
    services: [{ name_te: serviceTe, name_en: serviceEn, price }],
    total_amount: price,
    notes: notes || null,
    booking_ref: generateBookingRef()
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
    console.error('Booking save failed:', err);
    errorMsg.textContent = 'నమోదు విఫలమైంది, దయచేసి మళ్ళీ ప్రయత్నించండి / Registration failed, please try again.';
    errorMsg.style.display = 'block';
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    submitBtn.disabled = false;
  }
}
