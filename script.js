let defects=[];
let rootCauses=[];
async function loadOptions(datalistID,command='get options:line',apply=true){
    //fetching options
    const URL = 'https://prod-17.centralindia.logic.azure.com:443/workflows/4ff2d0a0905548998f244df6480ebde1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zq0rd6tB-u7GBgObq4RH3mJrO7HdpOASDmFHmIm-Lic';
    const data = {
        cmd:command.split(':')[0].trim(),
        options:command.split(':')[1].trim()
    };
    
    const response= await fetch(URL,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });

    const json = await response.json();
    const options = json.options;
    //changing options
    if(apply==true){setOptions(datalistID,options);}
    else{
        if(data.options=='defects'){defects=Array.from(options);}
        else if(data.options=='root cause simplified'){rootCauses=Array.from(options);}
    }
}
function setOptions(datalistID,options){
    const datalist = document.getElementById(datalistID);
    datalist.innerHTML = ''; //clear datalist
    for(let i=0;i<options.length;i++){
        const option = document.createElement('option');
        option.value = options[i].trim();
        datalist.appendChild(option);
    };
}
function disableForm(disabled) {
    const form = document.getElementById('form');
    const elements = form.querySelectorAll('input, select, button, textarea');
    //elements.forEach(i =>{i.disabled = disabled;});
    for (const i of elements){i.disabled=disabled;};
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
    if (type=='defect_details'){
        setOptions('datalist-defect',defects);
        setOptions('datalist-root cause simplified',rootCauses);
        }
    }
    else if(template){console.error(`container for ${type} not found`);}
    else {console.error(`template for ${type} not found`);}
}
function clearForm() {
    document.getElementById('form').reset();
}
async function submitForm(event){
    event.preventDefault();
    const URL = 'https://prod-17.centralindia.logic.azure.com:443/workflows/4ff2d0a0905548998f244df6480ebde1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zq0rd6tB-u7GBgObq4RH3mJrO7HdpOASDmFHmIm-Lic';
    const formData = new FormData(event.target);
    try{
        disableForm(true);
        showLoading(true);
        //collecting common datas
        const CommonData = {cmd:'update table',
            Date: formData.get('Date'),
            Shift: formData.get('Shift'),
            line: formData.get('line'),
            operator: formData.get('operator'),
            part: formData.get('part'),
            width_height: formData.get('width/height'),
            thk: formData.get('thk'),
            Length: formData.get('Length'),
            RM_Grade: formData.get('RM Grade'),
            ok_qty: formData.get('ok qty'),
            uploader:formData.get('uploader')
        };
        //collecting defect details
        const defectDetails = Array.from(document.querySelectorAll('#defect_details-container .dynamic-row'));
        let passCount=0;
        //sending data
        if(defectDetails.length==0){
            let data={...CommonData,
                defect:'',
                defect_qty:0,
                root_cause:'',
                root_cause_simplified:'',
                MT:'',
                rew_rej:''
            };
            const response= await fetch(URL,{
                method: 'POST',headers: {'Content-Type':'application/json'},
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log('Response:', result);
            if(response.ok){passCount+=1;}
        }
        else{
            for(let i=0;i<defectDetails.length;i++){
                let row=defectDetails[i];
                let data={...CommonData,
                    defect:row.querySelector('input[name="defect"]')?.value.trim(),
                    defect_qty:parseInt(row.querySelector('input[name="defect qty"]')?.value)|| 1,
                    root_cause:row.querySelector('input[name="root cause"]')?.value.trim(),
                    root_cause_simplified:row.querySelector('input[name="root cause simplified"]')?.value.trim(),
                    MT:row.querySelector('select[name="4MT"]')?.value.trim(),
                    rew_rej:row.querySelector('select[name="Rework/Rejection"]')?.value.trim()
                };
                const response= await fetch(URL,{
                    method: 'POST',headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                console.log('Response:', result);
                if(response.ok){passCount+=1;}
            };
        };
        if(passCount>0){alert(`PPM details updated ${passCount}/${defectDetails.length}`);}
        else{alert('Failed to submit details');}
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

document.addEventListener('DOMContentLoaded',
    event =>{
        event.preventDefault();
        loadOptions('datalist-line','get options:lines');
        loadOptions('datalist-operator','get options:operators');
        loadOptions('datalist-defect','get options:defects',false);
        loadOptions('datalist-root cause simplified','get options:root cause simplified',false);
    });
document.getElementById('form').addEventListener('submit', submitForm);