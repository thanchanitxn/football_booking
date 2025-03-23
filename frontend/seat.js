// ตรวจสอบว่ามีการโหลดซ้ำหรือไม่ 
if (!window.isSeatScriptLoaded) {
    window.isSeatScriptLoaded = true;
    console.log("🔹 seat.js Loaded");
    // ดึง `match_id` และข้อมูลจาก URL
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get("match_id");
    const home = urlParams.get("home");
    const away = urlParams.get("away");
    const date = urlParams.get("date");
    const time = urlParams.get("time");
    const stadium = urlParams.get("stadium");

    console.log("Match ID:", matchId);
    console.log("Home Team:", home);
    console.log("Away Team:", away);
    console.log("Match Date:", date);
    console.log("Match Time:", time);
    console.log("Stadium:", stadium);

    
    if (!matchId) {
        console.error("❌ ไม่พบ match_id ใน URL");
    }

    // อัปเดตข้อมูลใน `seat.html`
    document.getElementById("home-team").textContent = home || "ไม่พบข้อมูล";
    document.getElementById("away-team").textContent = away || "ไม่พบข้อมูล";
    document.getElementById("match-date").textContent = date ? new Date(date).toLocaleDateString() : "ไม่พบข้อมูล";
    document.getElementById("match-time").textContent = time || "ไม่พบข้อมูล";
    document.getElementById("stadium").textContent = stadium || "ไม่พบข้อมูล";

    
    document.querySelectorAll('.zone').forEach(button => {
        button.addEventListener('click', function () {
            const zone = this.getAttribute('data-zone');
            showSeatingChart(zone);
        });
    });

    let selectedSeats = { "A": [], "B": [], "C": [] };

    
    async function fetchSeats(zone) {
        try {
            const response = await fetch(`http://localhost:5000/api/seats/match/${matchId}`);
            const seats = await response.json();
            return seats.filter(seat => seat.zone === zone);
        } catch (error) {
            console.error("Error fetching seats:", error);
            return [];
        }
    }

    
    async function showSeatingChart(zone) {
        const seatingChart = document.querySelector('.seating-chart');
        seatingChart.innerHTML = '';

        const seats = await fetchSeats(zone);

        seats.forEach(seat => {
            const seatButton = document.createElement('button');
            seatButton.classList.add('seat', seat.seat_number);
            seatButton.textContent = seat.seat_number;

            if (seat.status === 'booked') {
                seatButton.classList.add('booked');
                seatButton.disabled = true;
            } else {
                seatButton.addEventListener('click', function () {
                    this.classList.toggle('selected');

                    if (this.classList.contains('selected')) {
                        selectedSeats[zone].push(seat.seat_number);
                    } else {
                        selectedSeats[zone] = selectedSeats[zone].filter(s => s !== seat.seat_number);
                    }

                    updatePrice(zone, seats);
                });
            }

            seatingChart.appendChild(seatButton);
        });
    }

    
    function updatePrice(zone, seats) {
        const priceDisplay = document.querySelector('.price-display');
        const selectedCount = selectedSeats[zone].length;
        const pricePerSeat = seats.length > 0 ? seats[0].price : 0;
        const totalPrice = selectedCount * pricePerSeat;

        priceDisplay.innerHTML = `ราคาสำหรับโซน ${zone}: ฿${totalPrice}`;
    }

    
document.querySelector('.confirm-seat').addEventListener('click', async function () {
    let totalSelectedSeats = [];
    for (let zone in selectedSeats) {
        totalSelectedSeats = totalSelectedSeats.concat(selectedSeats[zone]);
    }

    if (totalSelectedSeats.length === 0) {
        alert('กรุณาเลือกที่นั่งก่อนทำการยืนยัน!');
        return;
    }

    let seatNumbers = totalSelectedSeats.join(', ');

   
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get("match_id");
    const home = urlParams.get("home");
    const away = urlParams.get("away");
    const date = urlParams.get("date");
    const time = urlParams.get("time");
    const stadium = urlParams.get("stadium");
    
    let totalPrice = 0;
    for (let zone in selectedSeats) {
        const zoneSeats = selectedSeats[zone];
        const zoneSeatsData = await fetchSeats(zone); 
        const pricePerSeat = zoneSeatsData.length > 0 ? zoneSeatsData[0].price : 0;
        totalPrice += zoneSeats.length * pricePerSeat; 
    }

    
    const selectedSeatsList = encodeURIComponent(seatNumbers);
    const price = encodeURIComponent(totalPrice); 
    window.location.href = `payment.html?match_id=${matchId}&home=${encodeURIComponent(home)}
    &away=${encodeURIComponent(away)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}
    &stadium=${encodeURIComponent(stadium)}&seats=${selectedSeatsList}&total_price=${price}`;
});

}
