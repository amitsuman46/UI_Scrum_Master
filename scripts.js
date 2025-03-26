// Get DOM elements for Create Meeting Modal
const createMeetingBtn = document.getElementById('createMeetingBtn');
const createMeetingModal = document.getElementById('createMeetingModal');
const closeCreateMeetingModalBtn = document.getElementById('closeCreateMeetingModalBtn');
const addParticipantBtn = document.getElementById('addParticipantBtn');
const participantsContainer = document.getElementById('participantsContainer');
const createMeetingForm = document.getElementById('createMeetingForm');

// Get DOM elements for Sign In Modal
//const signInBtn = document.getElementById('signInBtn');
const signInModal = document.getElementById('signInModal');
const closeSignInModalBtn = document.getElementById('closeSignInModalBtn');
const signInForm = document.getElementById('signInForm');

// Get Modal Backdrop
const modalBackdrop = document.getElementById('modalBackdrop');

// Function to close all modals
function closeAllModals() {
    createMeetingModal.classList.remove('active');
    signInModal.classList.remove('active');
    modalBackdrop.classList.remove('active');
    document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');
}

// Open Create Meeting Modal
createMeetingBtn.addEventListener('click', () => {
    closeAllModals();
    createMeetingModal.classList.add('active');
    modalBackdrop.classList.add('active');
});

// Close Create Meeting Modal
closeCreateMeetingModalBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    closeAllModals();
    clearFormFields();
});

// Open Sign In Modal
// signInBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     closeAllModals();
//     signInModal.classList.add('active');
//     modalBackdrop.classList.add('active');
// });

// Close Sign In Modal
closeSignInModalBtn.addEventListener('click', closeAllModals);

// Close any modal when clicking the backdrop
modalBackdrop.addEventListener('click', closeAllModals);

// Add Participant Functionality
// addParticipantBtn.addEventListener('click', () => {
//     const newParticipantRow = document.createElement('div');
//     newParticipantRow.classList.add('participant-row', 'grid', 'grid-cols-3', 'gap-2', 'mb-2');
//     newParticipantRow.innerHTML = `
//         <div>
//             <input type="text" name="participantName[]" placeholder="Assignee" class="w-full p-2 border rounded" required>
//             <p class="error-message">Assignee is required.</p>
//         </div>
//         <div>
//             <input type="email" name="participantEmail[]" placeholder="Email" class="w-full p-2 border rounded" required>
//             <p class="error-message">Email is required.</p>
//         </div>
//         <div>
//             <input type="text" name="participantTask[]" placeholder="Task" class="w-full p-2 border rounded" required>
//             <p class="error-message">Task is required.</p>
//         </div>
//     `;
//     participantsContainer.appendChild(newParticipantRow);
// });

addParticipantBtn.addEventListener('click', () => {
    const newParticipantRow = document.createElement('div');
    newParticipantRow.classList.add('participant-row', 'grid', 'grid-cols-12', 'gap-2', 'mb-2', 'items-center');
    
    newParticipantRow.innerHTML = `
        <div class="col-span-4">
            <input type="text" name="participantName[]" placeholder="Assignee" class="w-full p-2 border rounded" required>
            <p class="error-message text-xs mt-1 hidden">Assignee is required.</p>
        </div>
        <div class="col-span-4">
            <input type="email" name="participantEmail[]" placeholder="Email" class="w-full p-2 border rounded" required>
            <p class="error-message text-xs mt-1 hidden">Email is required.</p>
        </div>
        <div class="col-span-3">
            <input type="text" name="participantTask[]" placeholder="Task" class="w-full p-2 border rounded" required>
            <p class="error-message text-xs mt-1 hidden">Task is required.</p>
        </div>
        <div class="col-span-1 flex justify-end">
            <button type="button" class="delete-participant-btn p-1 text-blue-500 hover:text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    `;
    
    participantsContainer.appendChild(newParticipantRow);
    
    // Add event listener to the new delete button
    newParticipantRow.querySelector('.delete-participant-btn').addEventListener('click', () => {
        newParticipantRow.remove();
    });
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
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: ['name', 'email', 'task'] });

            // Clear existing participants
            participantsContainer.innerHTML = '';

            // Add imported participants (ignoring designation)
            json.slice(1).forEach(row => {
                const participantRow = document.createElement('div');
                participantRow.classList.add('participant-row', 'grid', 'grid-cols-3', 'gap-2', 'mb-2');
                participantRow.innerHTML = `
                    <div>
                        <input type="text" name="participantName[]" placeholder="Assignee" value="${row.name || ''}" class="w-full p-2 border rounded" required>
                        <p class="error-message">Assignee is required.</p>
                    </div>
                    <div>
                        <input type="email" name="participantEmail[]" placeholder="Email" value="${row.email || ''}" class="w-full p-2 border rounded" required>
                        <p class="error-message">Email is required.</p>
                    </div>
                    <div>
                        <input type="text" name="participantTask[]" placeholder="Task" value="${row.task || ''}" class="w-full p-2 border rounded" required>
                        <p class="error-message">Task is required.</p>
                    </div>
                `;
                participantsContainer.appendChild(participantRow);
            });
        };
        reader.readAsArrayBuffer(file);
    };
    input.click();
}

// Function to clear form fields
function clearFormFields() {
    // Clear main meeting inputs
    createMeetingForm.querySelector('input[name="meetingId"]').value = '';
    createMeetingForm.querySelector('input[name="managerName"]').value = '';
    createMeetingForm.querySelector('input[name="managerEmail"]').value = '';

    // Clear participant fields
    participantsContainer.querySelectorAll('.participant-row').forEach(row => {
        row.querySelector('input[name="participantName[]"]').value = '';
        row.querySelector('input[name="participantEmail[]"]').value = '';
        row.querySelector('input[name="participantTask[]"]').value = '';
    });
}

// Handle Create Meeting Form Submission
createMeetingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');

    // Validate form
    let isValid = true;
    const meetingId = createMeetingForm.querySelector('input[name="meetingId"]').value;
    const managerName = createMeetingForm.querySelector('input[name="managerName"]').value;
    const managerEmail = createMeetingForm.querySelector('input[name="managerEmail"]').value;

    if (!meetingId) {
        document.getElementById('meetingIdError').style.display = 'block';
        isValid = false;
    }
    if (!managerName) {
        document.getElementById('managerNameError').style.display = 'block';
        isValid = false;
    }
    if (!managerEmail) {
        document.getElementById('managerEmailError').style.display = 'block';
        isValid = false;
    }

    // Validate participants
    const participantRows = participantsContainer.querySelectorAll('.participant-row');
    participantRows.forEach(row => {
        const name = row.querySelector('input[name="participantName[]"]').value;
        const email = row.querySelector('input[name="participantEmail[]"]').value;
        const task = row.querySelector('input[name="participantTask[]"]').value;

        if (!name) row.querySelectorAll('.error-message')[0].style.display = 'block', isValid = false;
        if (!email) row.querySelectorAll('.error-message')[1].style.display = 'block', isValid = false;
        if (!task) row.querySelectorAll('.error-message')[2].style.display = 'block', isValid = false;
    });

    if (!isValid) return;

    // Collect form data into desired payload structure
    const meetingData = {
        code: meetingId,
        participantDetails: Array.from(participantRows).map(row => ({
            assignee: row.querySelector('input[name="participantName[]"]').value,
            email: row.querySelector('input[name="participantEmail[]"]').value,
            task: row.querySelector('input[name="participantTask[]"]').value
        })),
        managerDetails: {
            name: managerName,
            email: managerEmail
        }
    };

    // try {
    //     const response = await fetch('http://20.197.38.23:7700/gmeet/standup', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(meetingData)
    //     });

    //     const result = await response.json();
        
    //     if (!response.ok) throw new Error(result.message || 'Request failed');

    //     showAlert("Success", result.message, true);
    //     closeAllModals();
    //     clearFormFields();
        
    // } catch (error) {
    //     showAlert("Error", error.message, false);
    //     console.error('Error:', error);
    // }

    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeout = 15000; // 15 seconds timeout
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Make the fetch request
        const response = await fetch('http://20.197.38.23:7700/gmeet/standup', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify(meetingData),
            signal: controller.signal,
            mode: 'cors' // Explicitly set CORS mode
        }).finally(() => clearTimeout(timeoutId)); // Clean up timeout

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        showAlert("Success", result.message || "Meeting scheduled successfully!", true);
        
    } catch (error) {
        let errorMessage = "An error occurred";
        
        if (error.name === 'AbortError') {
            errorMessage = "The request timed out. Please check your network connection.";
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = "Network error. Please check your internet connection.";
        } else {
            errorMessage = error.message;
        }

        showAlert("Error", errorMessage, false);
        console.error('API Error:', error);
        
    }
});

// Handle Sign In Form Submission
signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');

    let isValid = true;
    const email = signInForm.querySelector('input[name="email"]').value;
    const password = signInForm.querySelector('input[name="password"]').value;

    if (!email) document.getElementById('signInEmailError').style.display = 'block', isValid = false;
    if (!password) document.getElementById('signInPasswordError').style.display = 'block', isValid = false;

    if (!isValid) return;

    const signInData = { email, password };

    try {
        const response = await fetch('/api/sign-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signInData)
        });
        if (response.ok) {
            console.log('Sign In Data Submitted:', signInData);
            closeAllModals();
        } else {
            console.error('Sign-in failed:', response.status);
        }
    } catch (error) {
        let errorMessage = "An error occurred";
        closeAllModals();
        if (error.name === 'AbortError') {
            errorMessage = "Request timed out. Please check your connection and try again.";
        } else if (error.message) {
            errorMessage = error.message;
        }

        showAlert("Error", errorMessage, false);
        console.error('Submission error:', error);
    }
});

// Alert Modal Elements
const alertModal = document.getElementById('alertModal');
const alertTitle = document.getElementById('alertTitle');
const alertMessage = document.getElementById('alertMessage');
const closeAlertBtn = document.getElementById('closeAlertBtn');
const confirmAlertBtn = document.getElementById('confirmAlertBtn');

// Show alert function
function showAlert(title, message, isSuccess = true) {
    alertTitle.textContent = title;
    alertMessage.textContent = message;
    alertTitle.className = `text-xl font-bold ${isSuccess ? 'text-green-600' : 'text-red-600'}`;
    alertModal.classList.add('active');
    modalBackdrop.classList.add('active');
}

// Close alert
function closeAlert() {
    alertModal.classList.remove('active');
    modalBackdrop.classList.remove('active');
}

// Event listeners for alert modal
closeAlertBtn.addEventListener('click', closeAlert);
confirmAlertBtn.addEventListener('click', closeAlert);