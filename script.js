document.addEventListener("DOMContentLoaded", function() {
    updateContentByDate();
});

function updateContentByDate() {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    
    const todayID = `date-${d}-${m}-${y}`;
    
    // Update Header Date
    document.getElementById('display-date').innerText = `${d}-${m}-${y}`;

    // Logic to show only today's card
    const allDevotionals = document.querySelectorAll('.devotional-gate');
    let found = false;

    allDevotionals.forEach(card => {
        if (card.id === todayID) {
            card.style.display = 'block';
            found = true;
        } else {
            card.style.display = 'none';
        }
    });

    if (!found) {
        document.getElementById('no-devotional').style.display = 'block';
    }
}

function toggleMenu() {
    document.getElementById('navOverlay').classList.toggle('active');
}