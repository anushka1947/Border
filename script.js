// 1. Initial State
const sectors = [
    { id: "SEC-01", name: "ALPHA", status: "SECURE" },
    { id: "SEC-02", name: "BRAVO", status: "SECURE" },
    { id: "SEC-03", name: "CHARLIE", status: "SECURE" },
    { id: "SEC-04", name: "DELTA", status: "SECURE" }
];

let totalIntrusions = 0;

// 2. DOM Elements
const sectorContainer = document.getElementById('sector-container');
const logContainer = document.getElementById('log-container');
const mapContainer = document.querySelector('.map-container');
const countDisplay = document.getElementById('intrusion-count');

// 3. Render Sectors
function renderSectors() {
    sectorContainer.innerHTML = ''; 
    
    sectors.forEach(sector => {
        const div = document.createElement('div');
        div.className = `sector-card ${sector.status === 'BREACH' ? 'alert' : ''}`;
        
        div.innerHTML = `
            <div class="sector-row">
                <strong>[${sector.id}] ${sector.name}</strong>
                <span>${sector.status}</span>
            </div>
            ${sector.status === 'BREACH' ? 
              `<button class="ack-btn" onclick="clearAlert('${sector.id}')">>> ACKNOWLEDGE SIGNAL <<</button>` 
              : ''}
        `;
        
        sectorContainer.appendChild(div);
    });
}

// 4. Logger System
function addLog(message, type = "normal") {
    const p = document.createElement('p');
    
    if(type === "alert") p.className = "log-entry log-alert";
    else if(type === "success") p.className = "log-entry log-success";
    else p.className = "log-entry";
    
    // Get time in HH:MM:SS format
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    
    p.innerText = `${time} > ${message}`;
    
    logContainer.prepend(p); 
    
    if(logContainer.children.length > 25) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// 5. Visual Marker
function showMapMarker() {
    const dot = document.createElement('div');
    dot.className = 'intrusion-dot';
    
    // Random Grid Position
    const x = Math.floor(Math.random() * 80) + 10; 
    const y = Math.floor(Math.random() * 80) + 10;
    
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
    
    mapContainer.appendChild(dot);
    
    setTimeout(() => {
        dot.remove();
    }, 4000);
}

// 6. Action: Clear Alert
window.clearAlert = function(id) {
    const sector = sectors.find(s => s.id === id);
    
    if (sector && sector.status === "BREACH") {
        sector.status = "SECURE";
        addLog(`[ACK] SIGNAL CLEARED FOR ${sector.id}`, "success");
        renderSectors(); 
    }
};

// 7. Simulation Loop
function simulateThreat() {
    const activeThreats = sectors.filter(s => s.status === "BREACH").length;
    const randomChance = Math.random();
    
    if (randomChance > 0.7 && activeThreats < 2) {
        const safeSectors = sectors.filter(s => s.status === "SECURE");
        
        if (safeSectors.length > 0) {
            const randomIdx = Math.floor(Math.random() * safeSectors.length);
            const target = safeSectors[randomIdx];
            
            // Set Breach State
            target.status = "BREACH";
            totalIntrusions++;
            countDisplay.innerText = totalIntrusions;
            
            // Generate random grid coordinates for log realism
            const gridRef = `GRID-${Math.floor(Math.random()*900)+100}`;
            
            addLog(`[!] MOTION DETECTED: ${target.name} @ ${gridRef}`, "alert");
            showMapMarker();
            renderSectors();
        }
    } else {
        // Occasional System Ping
        if(Math.random() > 0.8) {
             addLog(">>> SYSTEM SCAN COMPLETE. NO NEW CONTACTS.");
        }
    }
}

// 8. Init
renderSectors();
setInterval(simulateThreat, 2000);