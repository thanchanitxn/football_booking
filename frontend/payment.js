console.log("✅ payment.js Loaded");
// ดึงข้อมูลจาก URL 
const params = new URLSearchParams(window.location.search);
const matchId = params.get("match_id") || "N/A";
const home = params.get("home") || "ไม่พบข้อมูล";
const away = params.get("away") || "ไม่พบข้อมูล";
const date = params.get("date") ? new Date(params.get("date")).toLocaleDateString() : "ไม่พบข้อมูล";
const time = params.get("time") || "ไม่พบข้อมูล";
const stadium = params.get("stadium") || "ไม่พบข้อมูล";
const seats = params.get("seats") || "ไม่พบข้อมูล"; 
const totalPrice = params.get("total_price");


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("match-details").innerHTML = `
        <p><strong>${home} vs ${away}</strong></p>
        <p>📅 วันที่: ${date}</p>
        <p>⏰ เวลา: ${time}</p>
        <p>📍 สนามแข่ง: ${stadium}</p>
        <p><strong>🪑 ที่นั่งที่เลือก:</strong> ${seats}</p>
        <p><strong>💰 ราคา:</strong> ฿${totalPrice}</p>
    `;
});

// ฟังก์ชันยืนยันการชำระเงิน
async function confirmPayment() {
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    
    if (!first_name || !last_name || !email || !phone) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
    }

    const userData = { first_name, last_name, email, phone };
    const bookingData = { match_id: matchId, seat_ids: seats, total_amount: totalPrice };
    const paymentData = { payment_method: paymentMethod, amount: totalPrice, payment_status: 'completed' };

    try {
        
        const userResponse = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: { 'Content-Type': 'application/json' }
        });

        if (userResponse.ok) {
            const user = await userResponse.json();
            const userId = user.user_id;

            
            const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                body: JSON.stringify({ ...bookingData, user_id: userId }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (bookingResponse.ok) {
                const booking = await bookingResponse.json();
                const bookingId = booking.booking_id;

              
                const paymentResponse = await fetch('http://localhost:5000/api/payments', {
                    method: 'POST',
                    body: JSON.stringify({ ...paymentData, booking_id: bookingId }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (paymentResponse.ok) {
                    window.location.href = `payment-success.html?home=${encodeURIComponent(home)}
                    &away=${encodeURIComponent(away)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}
                    &stadium=${encodeURIComponent(stadium)}&seats=${encodeURIComponent(seats)}`;
                } else {
                    alert('การชำระเงินล้มเหลว');
                }
            } else {
                alert('การจองตั๋วล้มเหลว');
            }
        } else {
            alert('การบันทึกข้อมูลผู้ใช้ล้มเหลว');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
}

// เพิ่ม Event Listener ให้กับปุ่มยืนยันการชำระเงิน
document.getElementById("confirm-payment-btn").addEventListener("click", confirmPayment);
