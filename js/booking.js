function calcTotal() {
  const base = parseInt(document.getElementById('participationType').selectedOptions[0].dataset.price) || 0;
  let extra = 0;
  document.querySelectorAll('.services-checkboxes input[type=checkbox]:checked').forEach(cb => {
    extra += parseInt(cb.value);
  });
  const total = base + extra;
  document.getElementById('totalAmount').textContent = '₹' + total.toLocaleString('en-IN') + '/-';
}

async function submitBooking() {
  const errorMsg = document.getElementById('errorMsg');
  const submitBtn = document.getElementById('submitBtn');
  errorMsg.style.display = 'none';

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const city = document.getElementById('city').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const participationSelect = document.getElementById('participationType');
  const participationType = participationSelect.value;
  const participationLabel = participationSelect.selectedOptions[0].textContent.trim();

  if (!name) { alert('దయచేసి మీ పేరు నమోదు చేయండి / Please enter your name'); return; }
  if (!phone || phone.length < 10) { alert('దయచేసి సరైన మొబైల్ నంబర్ నమోదు చేయండి / Please enter a valid mobile number'); return; }

  const services = [];
  document.querySelectorAll('.services-checkboxes input[type=checkbox]:checked').forEach(cb => {
    services.push({ name_te: cb.dataset.te, name_en: cb.dataset.en, price: parseInt(cb.value) });
  });
  const totalAmount = parseInt(document.getElementById('totalAmount').textContent.replace(/[^0-9]/g, '')) || 0;

  const booking = {
    name, phone, city: city || null,
    participation_type: participationLabel,
    services,
    total_amount: totalAmount,
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
