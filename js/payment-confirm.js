const PAYMENT_CONFIRM_WAIT_SECONDS = 5 * 60;
let paymentTimerInterval = null;
let paymentFormRevealed = false;

function formatTimer(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function revealConfirmForm() {
  if (paymentFormRevealed) return;
  paymentFormRevealed = true;

  if (paymentTimerInterval) clearInterval(paymentTimerInterval);

  const timer = document.getElementById('paymentTimer');
  const doneBtn = document.getElementById('paymentDoneBtn');
  const form = document.getElementById('confirmForm');
  if (timer) timer.style.display = 'none';
  if (doneBtn) doneBtn.style.display = 'none';
  if (form) {
    form.style.display = 'grid';
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

(function initPaymentQr() {
  const qrBox = document.getElementById('qrBox');
  if (!qrBox) return;

  const raw = sessionStorage.getItem('krutyaBooking');
  const booking = raw ? JSON.parse(raw) : null;
  const ref = booking && booking.booking_ref ? booking.booking_ref : '—';
  const refTe = document.getElementById('qrRefTe');
  const refEn = document.getElementById('qrRefEn');
  if (refTe) refTe.textContent = ref;
  if (refEn) refEn.textContent = ref;

  let secondsLeft = PAYMENT_CONFIRM_WAIT_SECONDS;
  const display = document.getElementById('timerDisplay');
  if (display) display.textContent = formatTimer(secondsLeft);

  paymentTimerInterval = setInterval(() => {
    secondsLeft -= 1;
    if (display) display.textContent = formatTimer(Math.max(secondsLeft, 0));
    if (secondsLeft <= 0) {
      clearInterval(paymentTimerInterval);
      revealConfirmForm();
    }
  }, 1000);
})();

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function submitPaymentConfirmation() {
  const errorMsg = document.getElementById('confirmErrorMsg');
  const submitBtn = document.getElementById('confirmSubmitBtn');
  errorMsg.style.display = 'none';

  const raw = sessionStorage.getItem('krutyaBooking');
  const booking = raw ? JSON.parse(raw) : null;
  if (!booking || !booking.booking_ref) {
    errorMsg.textContent = 'నమోదు వివరాలు కనబడలేదు / Booking details not found. Please contact us directly.';
    errorMsg.style.display = 'block';
    return;
  }

  const transactionRef = document.getElementById('transactionRef').value.trim();
  const fileInput = document.getElementById('screenshotFile');
  const file = fileInput.files[0];
  const notes = document.getElementById('confirmNotes').value.trim();

  if (!transactionRef) {
    alert('దయచేసి ట్రాన్సాక్షన్ నంబర్ నమోదు చేయండి / Please enter the transaction reference number');
    return;
  }
  if (!file) {
    alert('దయచేసి చెల్లింపు స్క్రీన్‌షాట్ అప్‌లోడ్ చేయండి / Please upload the payment screenshot');
    return;
  }

  submitBtn.disabled = true;

  try {
    const objectPath = `${booking.booking_ref}/${Date.now()}-${sanitizeFileName(file.name)}`;

    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/payment-screenshots/${objectPath}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: file
    });

    if (!uploadRes.ok) {
      const detail = await uploadRes.text();
      throw new Error(detail || `Upload failed with status ${uploadRes.status}`);
    }

    const confirmation = {
      booking_ref: booking.booking_ref,
      name: booking.name,
      phone: booking.phone,
      transaction_reference: transactionRef,
      screenshot_path: objectPath,
      notes: notes || null
    };

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/payment_confirmations`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(confirmation)
    });

    if (!insertRes.ok) {
      const detail = await insertRes.text();
      throw new Error(detail || `Request failed with status ${insertRes.status}`);
    }

    document.getElementById('confirmForm').style.display = 'none';
    const successMsg = document.getElementById('confirmSuccessMsg');
    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    console.error('Payment confirmation failed:', err);
    errorMsg.textContent = 'పంపడం విఫలమైంది, దయచేసి మళ్ళీ ప్రయత్నించండి / Submission failed, please try again.';
    errorMsg.style.display = 'block';
    submitBtn.disabled = false;
  }
}
