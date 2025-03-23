async function loadMatches() {
    try {
        let response = await fetch('http://localhost:5000/api/matches');
        let matches = await response.json();
        displayMatches(matches);  

        // ฟังก์ชันค้นหาทีมเมื่อคลิกที่ไอคอนค้นหา
        const searchButton = document.getElementById('search-btn');
        searchButton.addEventListener('click', () => filterMatches(matches));
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดแมตช์:", error);
        document.getElementById('matches').innerHTML = "<p>ไม่สามารถโหลดข้อมูลการแข่งขันได้</p>";
    }
}

// ฟังก์ชันแสดงแมตช์
function displayMatches(matches) {
    let output = '';
    matches.forEach(match => {
        output += `
            <div class="match-card">
                <div class="match-teams">
                    ${match.home_team} 🆚 ${match.away_team}
                </div>
                <div class="match-details">
                    <p>📅 วันที่: ${new Date(match.match_date).toLocaleDateString()}</p>
                    <p>⏰ เวลาแข่ง: ${match.match_time}</p>
                </div>
            </div>
        `;
    });
    document.getElementById('matches').innerHTML = output;
}

// ฟังก์ชันกรองแมตช์ตามคำค้นหาทีม
function filterMatches(matches) {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    
    // กรองแมตช์ที่ชื่อทีมตรงกับคำค้นหาหรือไม่
    const filteredMatches = matches.filter(match => 
        match.home_team.toLowerCase().includes(searchInput) || 
        match.away_team.toLowerCase().includes(searchInput)
    );

    
    displayMatches(filteredMatches);
}


loadMatches();
