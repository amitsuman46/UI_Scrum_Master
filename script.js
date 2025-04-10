// Tab Navigation
function showTab(tabId) {
    const tabs = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    tabs.forEach(tab => {
        tab.classList.add('hidden');
    });

    navLinks.forEach(link => {
        link.classList.remove('tab-active');
    });

    document.getElementById(tabId).classList.remove('hidden');
    document.querySelector(`nav ul li a[href="#${tabId}"]`).classList.add('tab-active');
}

// Modal Handling
const createMeetingBtn = document.getElementById('createMeetingBtn');
const createMeetingModal = document.getElementById('createMeetingModal');
const closeCreateMeetingModalBtn = document.getElementById('closeCreateMeetingModalBtn');
const modalBackdrop = document.getElementById('modalBackdrop');

createMeetingBtn.addEventListener('click', () => {
    createMeetingModal.classList.add('active');
    modalBackdrop.classList.add('active');
});

closeCreateMeetingModalBtn.addEventListener('click', () => {
    createMeetingModal.classList.remove('active');
    modalBackdrop.classList.remove('active');
    resetForm();
});

modalBackdrop.addEventListener('click', () => {
    createMeetingModal.classList.remove('active');
    modalBackdrop.classList.remove('active');
    resetForm();
});

// Form Handling
const createMeetingForm = document.getElementById('createMeetingForm');
let participantCount = 0;

createMeetingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(createMeetingForm);
    const meetingId = formData.get('meetingId');
    const managerName = formData.get('managerName');
    const managerEmail = formData.get('managerEmail');

    let isValid = true;

    // Reset error messages
    document.getElementById('meetingIdError').style.display = 'none';
    document.getElementById('managerNameError').style.display = 'none';
    document.getElementById('managerEmailError').style.display = 'none';
    document.querySelectorAll('.participant-error').forEach(error => error.style.display = 'none');

    // Validate meeting ID
    if (!meetingId) {
        document.getElementById('meetingIdError').style.display = 'block';
        isValid = false;
    }

    // Validate manager name
    if (!managerName) {
        document.getElementById('managerNameError').style.display = 'block';
        isValid = false;
    }

    // Validate manager email
    if (!managerEmail || !/\S+@\S+\.\S+/.test(managerEmail)) {
        document.getElementById('managerEmailError').style.display = 'block';
        document.getElementById('managerEmailError').textContent = !managerEmail ? 'Email is required.' : 'Invalid email format.';
        isValid = false;
    }

    // Validate participants
    const participants = [];
    for (let i = 0; i < participantCount; i++) {
        const name = formData.get(`participantName${i}`);
        const email = formData.get(`participantEmail${i}`);
        if (name && email) {
            if (!/\S+@\S+\.\S+/.test(email)) {
                document.getElementById(`participantEmailError${i}`).style.display = 'block';
                document.getElementById(`participantEmailError${i}`).textContent = 'Invalid email format.';
                isValid = false;
            } else {
                participants.push({ name, email });
            }
        } else if (name || email) {
            if (!name) document.getElementById(`participantNameError${i}`).style.display = 'block';
            if (!email) document.getElementById(`participantEmailError${i}`).style.display = 'block';
            isValid = false;
        }
    }

    if (isValid) {
        showAlert('Confirm to AI Agent', 'Are you sure you want to join AI Agent the stand-up session?', () => {
            console.log('Meeting Started:', { meetingId, managerName, managerEmail, participants });
            createMeetingModal.classList.remove('active');
            modalBackdrop.classList.remove('active');
            resetForm();
        });
    }
});

// Add Participant
document.getElementById('addParticipantBtn').addEventListener('click', () => {
    const participantsContainer = document.getElementById('participantsContainer');
    const participantDiv = document.createElement('div');
    participantDiv.classList.add('participant', 'grid', 'grid-cols-2', 'gap-4', 'mb-4');
    participantDiv.innerHTML = `
        <div>
            <input type="text" name="participantName${participantCount}" placeholder="Enter name" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
            <p id="participantNameError${participantCount}" class="error-message text-xs mt-1">Name is required.</p>
        </div>
        <div>
            <input type="email" name="participantEmail${participantCount}" placeholder="Enter email" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
            <p id="participantEmailError${participantCount}" class="error-message text-xs mt-1">Email is required.</p>
        </div>
    `;
    participantsContainer.appendChild(participantDiv);
    participantCount++;
});

// Import Participants from Excel
function importParticipants() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(firstSheet);

            const participantsContainer = document.getElementById('participantsContainer');
            participantsContainer.innerHTML = '';
            participantCount = 0;

            json.forEach(participant => {
                if (participant.Name && participant.Email) {
                    const participantDiv = document.createElement('div');
                    participantDiv.classList.add('participant', 'grid', 'grid-cols-2', 'gap-4', 'mb-4');
                    participantDiv.innerHTML = `
                        <div>
                            <input type="text" name="participantName${participantCount}" value="${participant.Name}" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                            <p id="participantNameError${participantCount}" class="error-message text-xs mt-1">Name is required.</p>
                        </div>
                        <div>
                            <input type="email" name="participantEmail${participantCount}" value="${participant.Email}" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                            <p id="participantEmailError${participantCount}" class="error-message text-xs mt-1">Email is required.</p>
                        </div>
                    `;
                    participantsContainer.appendChild(participantDiv);
                    participantCount++;
                }
            });
        };
        reader.readAsArrayBuffer(file);
    };
    input.click();
}

// Alert Modal
function showAlert(title, message, onConfirm) {
    const alertModal = document.getElementById('alertModal');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const closeAlertBtn = document.getElementById('closeAlertBtn');
    const confirmAlertBtn = document.getElementById('confirmAlertBtn');

    alertTitle.textContent = title;
    alertMessage.textContent = message;

    alertModal.classList.add('active');
    modalBackdrop.classList.add('active');

    closeAlertBtn.onclick = () => {
        alertModal.classList.remove('active');
        modalBackdrop.classList.remove('active');
    };

    confirmAlertBtn.onclick = async() => {
        alertModal.classList.remove('active');
        modalBackdrop.classList.remove('active');
         onConfirm();
        try {
            const response = await fetch('https://scrumassist.duckdns.org/gmeet/standup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                
                body: JSON.stringify(meetingData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Request failed');
            alert(result.message || "Meeting scheduled successfully!");
            closeAllModals();
            clearFormFields();
        } catch (error) {
            console.error('Error:', error);
        }
    };
}

// Reset Form
function resetForm() {
    createMeetingForm.reset();
    document.getElementById('participantsContainer').innerHTML = '';
    participantCount = 0;
    document.getElementById('meetingIdError').style.display = 'none';
    document.getElementById('managerNameError').style.display = 'none';
    document.getElementById('managerEmailError').style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showTab('main');
});