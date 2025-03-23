async function loadMatches() {
    try {
        let response = await fetch('http://localhost:5000/api/matches');
        let matches = await response.json();
        displayMatches(matches);  

       
        const searchButton = document.getElementById('search-btn');
        searchButton.addEventListener('click', () => filterMatches(matches)); 
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดแมตช์:", error);
        document.getElementById('matches').innerHTML = "<p>ไม่สามารถโหลดข้อมูลการแข่งขันได้</p>";
    }
}

function displayMatches(matches) {
    let output = '';
    matches.forEach(match => {
        output += `
            <div class="match-card">
                <div class="match-info">
                    <div class="match-teams">
                        ${match.home_team} 🆚 ${match.away_team}
                    </div>
                    <div class="match-details">
                        <p>📅 วันที่: ${new Date(match.match_date).toLocaleDateString()}</p>
                        <p>📍 สนามแข่ง: ${match.stadium}</p>
                        <p>⏰ เวลาแข่ง: ${match.match_time}</p>
                    </div>
                </div>
                <button onclick="bookTicket('${match.home_team}', '${match.away_team}', '${match.match_date}', 
                '${match.match_time}', '${match.stadium}', '${match.match_id}')">
                    จองตั๋ว
                </button>
            </div>
        `;
    });
    document.getElementById('matches').innerHTML = output;
}


function filterMatches(matches) {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    
    
    const filteredMatches = matches.filter(match => 
        match.home_team.toLowerCase().includes(searchInput) || 
        match.away_team.toLowerCase().includes(searchInput)
    );

    
    displayMatches(filteredMatches);
}


function bookTicket(home, away, date, time, stadium, matchId) {
    
    window.location.href = `seat.html?match_id=${encodeURIComponent(matchId)}&home=${encodeURIComponent(home)}
    &away=${encodeURIComponent(away)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}
    &stadium=${encodeURIComponent(stadium)}`;
}
loadMatches();
