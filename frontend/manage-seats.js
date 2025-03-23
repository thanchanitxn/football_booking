document.addEventListener("DOMContentLoaded", async function() {
    const params = new URLSearchParams(window.location.search);
    const matchId = params.get("match_id");

    if (!matchId) {
        alert("ไม่พบข้อมูล match_id");
        return;
    }

    // ดึงข้อมูลที่นั่งจาก API ตาม matchId
    try {
        const response = await fetch(`http://localhost:5000/api/seats/match/${matchId}`);

        const seats = await response.json();

        let output = '';
        seats.forEach(seat => {
            output += `
                <div class="seat-card" id="seat-${seat.seat_id}">
                    <p>ที่นั่ง: ${seat.seat_number}</p>
                    <p>โซน: ${seat.zone}</p>
                    <p>สถานะ: ${seat.status}</p>
                    <p>ราคา: ฿${seat.price}</p>
                    <button class="edit-btn" onclick="editSeat(${seat.seat_id}, '${seat.seat_number}', '${seat.zone}', '${seat.status}', 
                    ${seat.price})">แก้ไข</button>
                    <button class="delete-btn" onclick="deleteSeat(${seat.seat_id})">ลบ</button>
                </div>
                <hr>
            `;
        });

        document.getElementById('seats-list').innerHTML = output;
    } catch (error) {
        console.error('Error loading seats:', error);
        alert('ไม่สามารถโหลดข้อมูลที่นั่งได้');
    }
});


// ฟังก์ชันเพิ่มที่นั่ง
document.getElementById('addSeatForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const matchId = new URLSearchParams(window.location.search).get('match_id');
    const seatNumber = document.getElementById('seat_number').value;
    const zone = document.getElementById('zone').value;
    const status = document.getElementById('status').value;
    const price = document.getElementById('price').value;

    if (!seatNumber || !zone || !status || !price) {
        alert("กรุณากรอกข้อมูลที่นั่งให้ครบถ้วน");
        return;
    }

    const seatData = { match_id: matchId, zone: zone, seat_number: seatNumber, status: status, price: price };

    try {
        const response = await fetch('http://localhost:5000/api/seats', {
            method: 'POST',
            body: JSON.stringify(seatData),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert('เพิ่มที่นั่งเรียบร้อย!');
            window.location.reload(); 
        } else {
            alert('ไม่สามารถเพิ่มที่นั่งได้');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มที่นั่ง');
    }
});

// ฟังก์ชันแก้ไขที่นั่ง
function editSeat(seatId, seatNumber, zone, status, price) {
    const newSeatNumber = prompt('หมายเลขที่นั่งใหม่:', seatNumber);
    const newZone = prompt('โซนใหม่:', zone);
    const newStatus = prompt('สถานะใหม่:', status);
    const newPrice = prompt('ราคาที่นั่งใหม่:', price);

    if (newSeatNumber && newZone && newStatus && newPrice) {
        const updatedSeatData = {
            seat_number: newSeatNumber,
            zone: newZone,
            status: newStatus,
            price: newPrice
        };

        fetch(`http://localhost:5000/api/seats/${seatId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedSeatData),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(result => {
            alert('ที่นั่งได้รับการอัปเดตแล้ว!');
            window.location.reload(); 
        })
        .catch(error => {
            console.error('Error updating seat:', error);
            alert('ไม่สามารถอัปเดตที่นั่งได้');
        });
    }
}
// ฟังก์ชันลบที่นั่ง
function deleteSeat(seatId) {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบที่นั่งนี้?')) {
        fetch(`http://localhost:5000/api/seats/${seatId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(result => {
            alert('ลบที่นั่งเรียบร้อย!');
            window.location.reload();  
        })
        .catch(error => {
            console.error('Error deleting seat:', error);
            alert('ไม่สามารถลบที่นั่งได้');
        });
    }
}
