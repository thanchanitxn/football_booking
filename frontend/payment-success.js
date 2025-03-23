// ดึงข้อมูลจาก URL และแสดง
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        home: params.get('home'),
        away: params.get('away'),
        date: params.get('date'),
        time: params.get('time'),
        stadium: params.get('stadium'),
        seats: params.get('seats'),
    };
}
// แสดงข้อมูลที่จองในหน้า
function displayTicketDetails() {
    const params = getQueryParams();
    document.getElementById('home-team').textContent = params.home;
    document.getElementById('away-team').textContent = params.away;
    document.getElementById('match-date').textContent = new Date(params.date).toLocaleDateString();
    document.getElementById('match-time').textContent = params.time;
    document.getElementById('stadium').textContent = params.stadium;
    document.getElementById('seats').textContent = params.seats;  // แสดงที่นั่ง
}
// สร้างและดาวน์โหลดตั๋ว
function downloadTicket() {
    const params = getQueryParams();
    const ticketContent = `
        ทีม: ${params.home} 🆚 ${params.away}
        วันที่: ${new Date(params.date).toLocaleDateString()}
        เวลา: ${params.time}
        สนาม: ${params.stadium}
        ที่นั่งที่เลือก: ${params.seats}
    `;
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ticket.txt';
    link.click();
}
document.querySelector('.download-ticket-btn').addEventListener('click', downloadTicket);
displayTicketDetails();
