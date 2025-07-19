function disableForm(disabled) {
    const form = document.getElementById('form');
    const elements = form.querySelectorAll('input, select, button, textarea');
    elements.forEach(i =>{i.disabled = disabled;});
}

function showLoading(show) {
    let loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.innerHTML = `<div class="loading-box">Loading...</div>`;
        document.body.appendChild(loadingOverlay);
    }
    loadingOverlay.style.display = (show ? 'flex' : 'none');
}

function addRow(type) {
    const template = document.getElementById(`template-${type}`);
    const container = document.getElementById(`${type}-container`);

    if (template && container) {
    const clone = template.content.cloneNode(true);
    container.appendChild(clone);
    }
    else if(template){console.error(`container for ${type} not found`);}
    else {console.error(`template for ${type} not found`);}
}

function clearForm() {
    document.getElementById('form').reset();
}

async function submitForm(event){
    event.preventDefault();
    const URL = '';
    const formData = new FormData(event.target);
    try{
        disableForm(true);

        const data = {
            Project_Reference_number: formData.get('Project Reference number'),
            Customer_name: formData.get('Customer name'),
            Container_number: formData.get('Container number'),
            Container_ID: formData.get('Container ID'),
            Container_size: formData.get('Container size'),
            Date: formData.get('Date'),
            Shift: formData.get('Shift'),
            PDI_inspectors: data_PDI_inspectors,
            Issues: data_Issues,
            Status: formData.get('Status')
        };
        console.log(data);

        showLoading(true);
        const response= await fetch(URL,{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(data)
        });
        console.log('Response:', response);
        if (response.ok){
            alert('PPM details updated');
            //clearForm();
        }
        else {
            alert('Failed to submit details');
            //clearForm();
        }
    }
    catch (error){
        console.error('Error:', error);
        alert('Error submitting data');
    }
    finally{
        disableForm(false);
        showLoading(false);
    }
}

document.getElementById('form').addEventListener('submit', submitForm);

