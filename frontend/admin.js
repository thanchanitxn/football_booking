document.addEventListener('DOMContentLoaded', function() {
    async function loadMatches() {
        try {
            let response = await fetch('http://localhost:5000/api/matches');
            
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            let matches = await response.json();

            let output = '';
            matches.forEach(match => {
                output += `
                    <div class="match-card">
                        <h3>${match.home_team} vs ${match.away_team}</h3>
                        <p>วันที่: ${new Date(match.match_date).toLocaleDateString()}</p>
                        <p>เวลา: ${match.match_time}</p>
                        <p>สนามแข่ง: ${match.stadium}</p>
                        <button onclick="editMatch(${match.match_id})">แก้ไข</button>
                        <button onclick="deleteMatch(${match.match_id})">ลบ</button>
                        <button onclick="manageSeats(${match.match_id})">จัดการที่นั่ง</button> 
                    </div>
                    <hr>
                `;
            });

            document.getElementById('matches').innerHTML = output;
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("ไม่สามารถโหลดข้อมูลการแข่งขันได้");
        }
    }

    loadMatches();

    window.manageSeats = function(matchId) {
        
        window.location.href = `manage-seats.html?match_id=${matchId}`;
    }

   
document.getElementById('addMatchForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    let matchId = document.getElementById('matchId').value;
    let method = matchId ? 'PUT' : 'POST';  
    let url = matchId 
        ? `http://localhost:5000/api/matches/${matchId}` 
        : 'http://localhost:5000/api/matches';

    let matchData = {
        home_team: document.getElementById('teamHome').value,
        away_team: document.getElementById('teamAway').value,
        match_date: document.getElementById('matchDate').value,
        match_time: document.getElementById('matchTime').value,
        stadium: document.getElementById('stadium').value
    };

    try {
        let response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(matchData)
        });

        let result = await response.json();
        alert(result.message);
        
        
        document.getElementById('addMatchForm').reset();
        document.getElementById('matchId').value = '';  
        
        loadMatches();  

    } catch (error) {
        console.error("Fetch Error:", error);
        alert("ไม่สามารถบันทึกข้อมูลการแข่งขันได้");
    }
});
    window.editMatch = async function(id) {
        console.log("Edit Match ID:", id); 

        try {
            let response = await fetch(`http://localhost:5000/api/matches/${id}`);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            let match = await response.json();
            console.log("Match Data:", match);  

            let matchDate = new Date(match.match_date).toISOString().split('T')[0];

            document.getElementById('matchId').value = match.match_id;
            document.getElementById('teamHome').value = match.home_team;
            document.getElementById('teamAway').value = match.away_team;
            document.getElementById('matchDate').value = matchDate;
            document.getElementById('matchTime').value = match.match_time;
            document.getElementById('stadium').value = match.stadium;

        } catch (error) {
            console.error("Fetch Error:", error);
            alert("ไม่สามารถดึงข้อมูลการแข่งขันได้");
        }
    };

    window.deleteMatch = async function(id) {
        if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?")) {
            try {
                let response = await fetch(`http://localhost:5000/api/matches/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                let result = await response.json();
                alert(result.message);
                loadMatches();  
            } catch (error) {
                console.error("Fetch Error:", error);
                alert("ไม่สามารถลบข้อมูลการแข่งขันได้");
            }
        }
    };
});
