const COHORT = "2402-ftb-et-web-pt";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    parties: [],
};

document.addEventListener('DOMContentLoaded', function() {
    const partyList = document.querySelector('#party-list');
    const addPartiesForm = document.querySelector('#addParty');

    addPartiesForm.addEventListener("submit", addParty);

    async function render() {
        await getParties();
        renderParties();
    }
    render();

    async function getParties() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            state.parties = data.data;
        } catch (error) {
            console.error(error);
        }
    }

    async function renderParties() {
        partyList.innerHTML = state.parties.length ? '' : '<li>No parties</li>';
        state.parties.forEach(party => {
            const li = document.createElement('li');
            li.innerHTML = `
                <h3>${party.name}</h3>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.location}</p>
                <button onclick="deleteParty(${party.id})">Delete</button>
            `;
            partyList.appendChild(li);
        });
    }

    async function addParty(event) {
        event.preventDefault();
        const formData = new FormData(addPartiesForm);
        const data = {
            name: formData.get('name'),
            date: new Date(`${formData.get('date')}T${formData.get('time')}`).toISOString(),
            location: formData.get('location'),
            description: formData.get('description')
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await render();
        } catch (error) {
            console.error('Failed to add new party:', error);
        }
    }

    window.deleteParty = async function(partyId) {
        const deleteURL = `${API_URL}/${partyId}`;
        try {
            const response = await fetch(deleteURL, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Failed to delete party with status: ${response.status}`);
            }
            await render();  // Re-render the list to reflect the deletion
        } catch (error) {
            console.error('Failed to delete party:', error);
        }
    };
});
