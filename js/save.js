
function saveCurrentState(stateName) {
    const sampleSize = parseInt(document.getElementById('input-num-objects').value, 10);
    
    const eventsData = eventsList.map(eventId => {
        const eventElement = document.getElementById(`${eventId}-label`);
        return {
            event_label: eventElement ? eventElement.innerText : '',
            event_color: getComputedStyle(document.documentElement).getPropertyValue(`--${eventId}-color`).trim(),
            event_object_color: getComputedStyle(document.documentElement).getPropertyValue(`--${eventId}-object-color`).trim(),
            event_object_radius: getComputedStyle(document.documentElement).getPropertyValue(`--${eventId}-object-radius`).trim()
        };
    });
    
    const evidenceData = evidenceList.map(evidenceId => {
        const evidenceElement = document.getElementById(`${evidenceId}-label`);
        return {
            evidence_label: evidenceElement ? evidenceElement.innerText : '',
            evidence_color: getComputedStyle(document.documentElement).getPropertyValue(`--${evidenceId}-color`).trim(),
            evidence_object_color: getComputedStyle(document.documentElement).getPropertyValue(`--${evidenceId}-object-color`).trim(),
            evidence_object_border_size: getComputedStyle(document.documentElement).getPropertyValue(`--${evidenceId}-object-border-size`).trim(),
            evidence_object_text: getComputedStyle(document.documentElement).getPropertyValue(`--${evidenceId}-object-text`).trim(),
            evidence_object_font_size: getComputedStyle(document.documentElement).getPropertyValue(`--${evidenceId}-object-font-size`).trim(),
            evidence_object_font_weight: getComputedStyle(document.documentElement).getPropertyValue(`--${evidenceId}-object-font-weight`).trim()
        };
    });
    
    const gridState = saveCurrentGridState();
    
    const stateData = {
        state_name: stateName,
        sample_size: sampleSize,
        events_list: eventsList,
        events_data: eventsData,
        evidence_list: evidenceList,
        evidence_data: evidenceData,
        grid_state: gridState
    };
    
    localStorage.setItem(stateName, JSON.stringify(stateData));
}

function loadState(json) {
    hideTreeView();
    deleteAllEvents();
    json.events_list.forEach((eventId, i) => {
        const n = eventId.split('-')[1];
        addNewDefaultEvent(n);
        document.getElementById(`event-${n}-label`).innerText = json.events_data[i].event_label;
        document.documentElement.style.setProperty(`--event-${n}-color`, json.events_data[i].event_color);
        document.documentElement.style.setProperty(`--event-${n}-object-color`, json.events_data[i].event_object_color);
        document.documentElement.style.setProperty(`--event-${n}-object-radius`, json.events_data[i].event_object_radius);
    });
    
    deleteAllEvidence();
    json.evidence_list.forEach((evidenceId, i) => {
        const n = evidenceId.split('-')[1];
        addNewDefaultEvidence(n);
        document.getElementById(`evidence-${n}-label`).innerText = json.evidence_data[i].evidence_label;
        document.documentElement.style.setProperty(`--evidence-${n}-color`, json.evidence_data[i].evidence_color);
        document.documentElement.style.setProperty(`--evidence-${n}-object-color`, json.evidence_data[i].evidence_object_color);
        document.documentElement.style.setProperty(`--evidence-${n}-object-border-size`, json.evidence_data[i].evidence_object_border_size);
        document.documentElement.style.setProperty(`--evidence-${n}-object-text`, json.evidence_data[i].evidence_object_text);
        document.documentElement.style.setProperty(`--evidence-${n}-object-font-size`, json.evidence_data[i].evidence_object_font_size);
        document.documentElement.style.setProperty(`--evidence-${n}-object-font-weight`, json.evidence_data[i].evidence_object_font_weight);
    });

    document.getElementById('input-num-objects').value = json.sample_size;
    // document.getElementById('input-num-objects-2').value = json.sample_size;
    drawObjects(json.grid_state);

    const bayesNavbarBtn = document.getElementById('navbar-bayes');
    bayesNavbarBtn.classList.remove("blocked");
    bayesNavbarBtn.removeAttribute("disabled");
    evidenceTabOpened=true;
    if(document.getElementById("key")){
        toggleKey();
        toggleKey();
    }
    const bayes = document.getElementById('bayes-controls-container')
    const presentation = document.getElementById('presentation-view-container')
    if(bayes.style.display != 'none' || presentation.style.display != 'none'){
        document.getElementById('navbar-bayes').click();
    }

    updateProbabilityInputs();
}

function stateHasChanged(){
    console.log('state changed');
    updateTwoWayTable();

    if(document.getElementById('load-state-select')){
        document.getElementById('load-state-select').value = '';
    }
    saveCurrentState('current-state');

    // if true view is open, update tree
    if(document.getElementById('toggle-view-switch').checked){
        hideTreeView();
        showTreeView();
    }

    // if key is open, update key
    if(document.getElementById('key')){
        if(document.getElementById('key').style.display != 'none'){
            updateKey();
        }
    }

}
function toggleView(){
    const buttonText = toggleViewbBtn.querySelector('p');
    const buttonIcon = toggleViewbBtn.querySelector('i');
}


async function exportGridAsImage() {
    const elements = document.querySelectorAll(".object");

    if (elements.length === 0) {
        window.alert('No grid to export!');
        const saveImageBtn = document.getElementById('export-image-btn');
        saveImageBtn.innerHTML = `<i class="fa-solid fa-image" style="margin-right:5px;"></i>  Export grid as .PNG`;
        saveImageBtn.style.background = 'var(--control-blue)';
        saveImageBtn.style.pointerEvents = 'all';
        return;
    }

    let numObjects = document.getElementById('input-num-objects').value;
    let gridSize = Math.ceil(Math.sqrt(numObjects));
    const objectSize = 70;
    const gapSize = 15;
    const containerWidth = gridSize * objectSize + (gridSize - 1) * gapSize;
    const containerHeight = gridSize * objectSize + (gridSize - 1) * gapSize;

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "0";
    container.style.top = "0";
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${gridSize}, ${objectSize}px)`;
    container.style.gridTemplateRows = `repeat(${gridSize}, ${objectSize}px)`;
    container.style.gap = `${gapSize}px`;
    container.style.width = `${containerWidth}px`;
    container.style.height = `${containerHeight}px`;
    container.style.zIndex = -1;
    container.style.boxSizing = "border-box";

    elements.forEach(el => {
        const clonedEl = el.cloneNode(true);
        container.appendChild(clonedEl);
    });

    document.body.appendChild(container);

    try {
        const canvas = await html2canvas(container, {
            useCORS: true,
            foreignObjectRendering: true,
            width: containerWidth + 5,
            height: containerHeight + 5,
            scale: 2,
            backgroundColor: null
        });

        document.body.removeChild(container);

        canvas.toBlob(blob => {
            const blobURL = URL.createObjectURL(blob);
            window.open(blobURL, "_blank");
        }, "image/png");

    } catch (error) {
        console.error("screenshot capture failed:", error);
    }

    const saveImageBtn = document.getElementById('export-image-btn');
    saveImageBtn.innerHTML = `<i class="fa-solid fa-image" style="margin-right:5px;"></i>  Export grid as .PNG`;
    saveImageBtn.style.background = 'var(--control-blue)';
    saveImageBtn.style.pointerEvents = 'all';
}



async function exportKeyAsImage() {
    if(document.getElementById('key')){
        if(key.style.display == 'none'){
            toggleKey();
        }
    }
    else{
        toggleKey();
    }

    const keyDiv = document.getElementById('key');

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "1px";
    container.style.top = "1px";
    container.style.zIndex = -1;

    const keyClone = keyDiv.cloneNode(true);
    keyClone.id = 'key-clone';
    keyClone.style.background = `var(--dark-grey-2)`;
    keyClone.style.borderRadius = `6px`;
    keyClone.style.transform = `scale(1)`;

    const resizeHandle = keyClone.querySelector('#resize-handle');
    if (resizeHandle) resizeHandle.remove();
    const closeBtn = keyClone.querySelector('.top-bar .close-btn');
    if (closeBtn) closeBtn.remove();

    container.appendChild(keyClone);
    document.body.appendChild(container)

    try {
        const canvas = await html2canvas(container, {
            useCORS: true,
            foreignObjectRendering: true,
            scale: 2,
            backgroundColor: null
        });

        document.body.removeChild(container);

        canvas.toBlob(blob => {
            const blobURL = URL.createObjectURL(blob);
            window.open(blobURL, "_blank");
        }, "image/png");

    } catch (error) {
        console.error("screenshot capture failed:", error);
    }

    const saveImageBtn = document.getElementById('export-key-btn');
    saveImageBtn.innerHTML = `<i class="fa-solid fa-key" style="margin-right:5px;"></i>  Export key as .PNG`;
    saveImageBtn.style.background = 'var(--control-blue)';
    saveImageBtn.style.pointerEvents = 'all';
}
