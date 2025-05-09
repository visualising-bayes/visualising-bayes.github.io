let evidenceTabOpened = false;

document.addEventListener('DOMContentLoaded', () => {
    // Get all buttons and controls containers
    const navbarButtons = document.querySelectorAll('.navbar-btn');
    const introContainer = document.getElementById('intro-container');
    const eventsControlContainer = document.getElementById('events-controls-container');
    const evidenceControlsContainer = document.getElementById('evidence-controls-container');
    const bayesControlsContainer = document.getElementById('bayes-controls-container');
    const presentationViewContainer = document.getElementById('presentation-view-container');
    const containers = document.querySelectorAll('.controls-container');

    // Set up the initial state: Setup controls are visible by default
    introContainer.style.display = 'flex';
    eventsControlContainer.style.display = 'none';
    evidenceControlsContainer.style.display = 'none';
    bayesControlsContainer.style.display = 'none';
    presentationViewContainer.style.display = 'none';

    // Function to reset the navbar active class and hide all control containers
    const resetActiveButtons = () => {
        navbarButtons.forEach(button => {
            button.classList.remove('active');
        });
        introContainer.style.display = 'none';
        eventsControlContainer.style.display = 'none';
        evidenceControlsContainer.style.display = 'none';
        bayesControlsContainer.style.display = 'none';
        presentationViewContainer.style.display = 'none';
    };

    function areAllContainersHidden() {        
        return Array.from(containers).every(container => 
            window.getComputedStyle(container).display === 'none'
        );
    }

    document.getElementById('navbar-intro').addEventListener('click', () => {
        if(document.getElementById('navbar-intro').classList.contains('active')){
            minimiseWindow();
            return;
        }
        if(areAllContainersHidden()){
            resetActiveButtons();
            introContainer.style.display = 'flex'; // Set display before animation
            introContainer.classList.add('opening'); // Add the animation class
            setTimeout(() => {
                introContainer.classList.remove('opening'); // Reset after animation
            }, 250);
        }
        else{
            resetActiveButtons();
            introContainer.style.display = 'flex';
            introContainer.style.height = '82%';
        }
        
        document.getElementById('navbar-intro').classList.add('active');
        resetGridEffects();
    });

    // Event listeners for the navbar buttons
    document.getElementById('navbar-setup').addEventListener('click', () => {
        if(document.getElementById('navbar-setup').classList.contains('active')){
            minimiseWindow();
            return;
        }
        if(areAllContainersHidden()){
            resetActiveButtons();
            eventsControlContainer.style.display = 'flex'; // Set display before animation
            eventsControlContainer.classList.add('opening'); // Add the animation class
            setTimeout(() => {
                eventsControlContainer.classList.remove('opening'); // Reset after animation
            }, 250);
        }
        else{
            resetActiveButtons();
            eventsControlContainer.style.display = 'flex';
            eventsControlContainer.style.height = '82%';
        }
        
        document.getElementById('navbar-setup').classList.add('active');
        resetGridEffects();
        hideEvidence();
    });

    document.getElementById('navbar-customise').addEventListener('mousedown', () => {
        updateProbabilityInputs();
        if(document.getElementById('navbar-customise').classList.contains('active')){
            minimiseWindow();
            return;
        }
        if(areAllContainersHidden()){
            resetActiveButtons();
            evidenceControlsContainer.style.display = 'flex'; // Set display before animation
            evidenceControlsContainer.classList.add('opening'); // Add the animation class
            setTimeout(() => {
                evidenceControlsContainer.classList.remove('opening'); // Reset after animation
            }, 250);
        }
        else{
            resetActiveButtons();
            evidenceControlsContainer.style.display = 'flex';
            evidenceControlsContainer.style.height = '82%';
        }
        document.getElementById('navbar-customise').classList.add('active');
        resetGridEffects();
        // if(tutorialState == 5){
        //     tutorialState += 1;
        //     updateTutorialState();
        // }
        // on first time opening evidence section, assign random evidence event to each object
        if(!evidenceTabOpened){
            const objects = document.querySelectorAll(".object");
            objects.forEach(obj => {
                if (obj.classList.contains("event-1-object")) {
                    if (Math.random() < 0.7) {
                        obj.classList.add("evidence-1-object");
                    } else {
                        obj.classList.add("evidence-2-object");
                    }
                } else {
                    if (Math.random() < 0.3) {
                        obj.classList.add("evidence-1-object");
                    } else {
                        obj.classList.add("evidence-2-object");
                    }
                }
            });
            // allow access to bayes theorem tab
            const bayesNavbarBtn = document.getElementById('navbar-bayes');
            bayesNavbarBtn.classList.remove("blocked");
            bayesNavbarBtn.removeAttribute("disabled");
            evidenceTabOpened=true;
            // updateProbabilityLabels();
            if(document.getElementById('toggle-key-btn').querySelector('p').innerText == 'Hide Key'){
                toggleKey();
                toggleKey();
            }

        }   
    });
    document.getElementById('navbar-bayes').addEventListener('click', () => {
        if(document.getElementById('navbar-bayes').classList.contains('active')){
            minimiseWindow();
            return;
        }
        if(areAllContainersHidden()){
            resetActiveButtons();
            bayesControlsContainer.style.display = 'flex'; // Set display before animation
            bayesControlsContainer.classList.add('opening'); // Add the animation class
            setTimeout(() => {
                bayesControlsContainer.classList.remove('opening'); // Reset after animation
            }, 250);
        }
        else{
            resetActiveButtons();
            bayesControlsContainer.style.display = 'flex';
            bayesControlsContainer.style.height = '82%';
        }
        document.getElementById('navbar-bayes').classList.add('active');
        resetGridEffects();
        
        updateBayesDropdowns();
        // if(tutorialState == 10){
        //     tutorialState += 1;
        //     updateTutorialState();
        // }
    });
});

function minimiseWindow() {
    const containers = document.querySelectorAll('.controls-container');

    containers.forEach(container => {
        container.classList.add('closing'); // Add the animation class
        setTimeout(() => {
            container.style.display = 'none';
            container.classList.remove('closing'); // Reset after animation
        }, 250); // Matches animation duration
    });

    const navbarButtons = document.querySelectorAll('.navbar-btn');
    navbarButtons.forEach(button => {
        button.classList.remove('active');
    });
}


const hoverInfoText = document.getElementById("hover-info-text");
const bayesElementLabel = document.getElementById("bayes-element-label");
const bayesElementDescription = document.getElementById("bayes-element-description");
const calculationDisplay = document.getElementById("calculation-display");

function formatAnswer(answer, decimalPlaces=4){
    let equalsSign = "=";
    const answerString = answer.toString();
    if (answerString.includes(".")) {
        const decimalPlaces = answerString.split(".")[1].length;
        if (decimalPlaces > 4) {
            equalsSign = "≈";
        }
    }
    const roundedProbability = equalsSign === "≈" ? answer.toFixed(4) : answer;
    return outputString = `${equalsSign} ${roundedProbability}`;
}

function updateHoverInfo(bayesElement){
    hoverInfoText.style.display = "none";
    bayesElementLabel.style.display = "block";
    bayesElementDescription.style.display = "none";
    calculationDisplay.style.display = "block";

    const eventName = document.getElementById(`${hypothesisDropdown.value}-label`).innerText;
    const eventColor = `var(--${hypothesisDropdown.value}-color)`;
    const event = `<span style='color:${eventColor}'>${eventName}</span>`

    const evidenceName = document.getElementById(`${observedDropdown.value}-label`).innerText;
    const evidenceColor = `var(--${observedDropdown.value}-color)`;
    const evidence = `<span style='color:${evidenceColor}'>${evidenceName}</span>`

    const total = document.querySelectorAll('.object').length;
    const eventCount = document.querySelectorAll(`.object.${hypothesisDropdown.value}-object`).length;
    const evidenceCount =  document.querySelectorAll(`.object.${observedDropdown.value}-object`).length;
    const jointCount = document.querySelectorAll(`.object.${hypothesisDropdown.value}-object.${observedDropdown.value}-object`).length;

    switch(bayesElement){
        case "prior":
            probability = total > 0 ? eventCount / total : 0;
            bayesElementLabel.innerHTML = "Prior Probability";  
            // bayesElementDescription.innerHTML = `Represents the initial belief of the probability of ${event} before observing any evidence.`;
            calculationDisplay.innerHTML = `P(${event}) = ${eventCount}/${total} ${formatAnswer(probability)}`;
            break;
        case "posterior":
            probability = evidenceCount > 0 ? jointCount / evidenceCount : 0;
            bayesElementLabel.innerHTML = `Posterior Probability`;
            // bayesElementDescription.innerHTML = `This is what we want to calculate.</br>Represents the updated probability of ${event} given that ${evidence} has occured.`;
            calculationDisplay.innerHTML = `P(${event} | ${evidence})<br>= (${jointCount}/${eventCount} &times ${eventCount}/${total}) / (${evidenceCount}/${total})<br> = ${jointCount}/${evidenceCount} <b>${formatAnswer(probability)}</b>`;
            break;
        case "marginal":
            probability = total > 0 ? evidenceCount / total : 0;
            bayesElementLabel.innerHTML = "Marginal Probability";
            // bayesElementDescription.innerHTML = `Represents the total probability of ${evidence} occuring under all possible scenarios.`;
            calculationDisplay.innerHTML = `P(${evidence}) = ${evidenceCount}/${total} ${formatAnswer(probability)}`;

            break;
        case "likelihood":
            probability = eventCount > 0 ? jointCount / eventCount : 0;
            bayesElementLabel.innerHTML = "Likelihood";
            // bayesElementDescription.innerHTML = `Represents the probability of ${evidence} occuring given that ${event} is true.`;
            calculationDisplay.innerHTML = `P(${evidence} | ${event}) = ${jointCount}/${eventCount} ${formatAnswer(probability)}`;
            break;
    }
}

function resetHoverInfo(){
    hoverInfoText.style.display = "block";
    bayesElementLabel.style.display = "none";
    bayesElementDescription.style.display = "none";
    calculationDisplay.style.display = "none";
}

// popups appear when hovering over an object to describe its events
document.addEventListener("DOMContentLoaded", () => {
    const objectsGrid = document.getElementById("objects-grid");
    const popup = document.createElement("div");
    popup.style.position = "absolute";
    popup.style.backgroundColor = "rgba(14, 14, 14, 0.8)";
    popup.style.color = "rgba(255, 255, 255, 0.9)";
    popup.style.padding = "5px 10px";
    popup.style.borderRadius = "5px";
    popup.style.fontSize = "18px";
    popup.style.display = "none";
    popup.style.pointerEvents = "none";
    popup.style.whiteSpace = "pre-line";
    document.body.appendChild(popup);

    objectsGrid.addEventListener("mouseover", (event) => {
        if (event.target.classList.contains("object")) {
            const classes = event.target.classList;
            let eventText = "";
            let evidenceText = "";
            let eventColor = "";
            let evidenceColor = "";
            // let event

            classes.forEach(className => {
                let eventMatch = className.match(/event-(\d+)-object/);
                let evidenceMatch = className.match(/evidence-(\d+)-object/);
                
                if (eventMatch) {
                    const eventLabel = document.getElementById(`event-${eventMatch[1]}-label`);
                    if (eventLabel) {
                        eventText = eventLabel.textContent;
                        eventColor = `event-${eventMatch[1]}-color`;
                    }
                }
                
                if (evidenceMatch) {
                    const evidenceLabel = document.getElementById(`evidence-${evidenceMatch[1]}-label`);
                    if (evidenceLabel) {
                        evidenceText = evidenceLabel.textContent;
                        evidenceColor = `evidence-${evidenceMatch[1]}-color`;
                    }
                }
            });

            if (eventText) {
                popup.innerHTML = `<span style="color:var(--${eventColor})">&#9679 </span>${eventText}`;
                if (evidenceText) {
                    popup.innerHTML += `<br><span style="color:var(--${evidenceColor})">&#9679 </span>${evidenceText}`;
                }
                popup.style.display = "block";
            }
        }
    });

    objectsGrid.addEventListener("mousemove", (event) => {
        if (popup.style.display === "block") {
            popup.style.left = `${event.pageX + 10}px`;
            popup.style.top = `${event.pageY + 10}px`;
        }
    });

    objectsGrid.addEventListener("mouseout", (event) => {
        if (event.target.classList.contains("object")) {
            popup.style.display = "none";
        }
    });
});

function updateProbabilityInputs(){
    for(let i = 0; i < eventsList.length; i++){
        const eventBase = eventsList[i];
        const eventName = document.getElementById(`${eventBase}-label`).innerText;
        const numEvent = document.querySelectorAll(`.object.${eventBase}-object`).length;
        const totalNum = document.querySelectorAll(`.object`).length;
        const probability = numEvent / totalNum;
        const text = document.getElementById(`${eventBase}-prior-probability-text`);
        const fraction = document.getElementById(`${eventBase}-pior-probability-fraction-text`);
        const slider = document.getElementById(`${eventBase}-prior-probability-slider`);
        const input = document.getElementById(`${eventBase}-prior-probability-input`);

        slider.max = totalNum;
        input.max = totalNum;
        // console.log(`updateProbabilityInputs: ${eventBase} ${numEvent}`);
        slider.value = numEvent;
        input.value = numEvent;

        text.innerText = `P(${eventName}) ${formatAnswer(probability)}`;
        fraction.innerText = `/ ${totalNum}`;
    }

    for(let i = 0; i < evidenceList.length; i++){
        const evidenceBase = evidenceList[i];
        const evidenceName = document.getElementById(`${evidenceBase}-label`).innerText;

        for(let j = 0; j < eventsList.length; j++){
            const eventBase = eventsList[j];
            const eventName = document.getElementById(`${eventBase}-label`).innerText;

            const numEvidence = document.querySelectorAll(`.object.${eventBase}-object.${evidenceBase}-object`).length || 0;
            const totalNum = document.querySelectorAll(`.object.${eventBase}-object`).length || 0;
            const probability = numEvidence / totalNum || 0;
            const text = document.getElementById(`${evidenceBase}-text-for-${eventBase}`);
            const fraction = document.getElementById(`${evidenceBase}-fraction-text-for-${eventBase}`);
            const slider = document.getElementById(`${evidenceBase}-slider-for-${eventBase}`);
            const input = document.getElementById(`${evidenceBase}-input-for-${eventBase}`);
    
            slider.max = totalNum;
            input.max = totalNum;
            // console.log(`updateProbabilityInputs: ${eventBase} ${numEvent}`);
            slider.value = numEvidence;
            input.value = numEvidence;
    
            text.innerText = `P(${evidenceName} | ${eventName}) ${formatAnswer(probability)}`;
            fraction.innerText = `/ ${totalNum}`;

        }
    }
}

// function updateGridFromEventInputs() {
//     const allObjects = document.querySelectorAll('.object');
    
//     for (let i = 0; i < eventsList.length; i++) {
//         const eventBase = eventsList[i];
//         const currentNumEvents = document.querySelectorAll(`.object.${eventBase}-object`).length || 0;
//         const adjustedNumEvents = parseInt(document.getElementById(`${eventBase}-prior-probability-input`).value);

//         if (currentNumEvents < adjustedNumEvents) {
//             const diff = adjustedNumEvents - currentNumEvents;
//             const availableObjects = Array.from(allObjects).filter(obj => !obj.classList.contains(`${eventBase}-object`));
            
//             for (let j = 0; j < diff; j++) {
//                 const randomObject = availableObjects[Math.floor(Math.random() * availableObjects.length)];                
//                 swapEventTo(randomObject, `${eventBase}-object`);
//             }
//         } else if (currentNumEvents > adjustedNumEvents) {
//             const diff = currentNumEvents - adjustedNumEvents;
//             const eventObjects = document.querySelectorAll(`.object.${eventBase}-object`);
            
//             for (let j = 0; j < diff; j++) {
//                 const randomEventObject = eventObjects[Math.floor(Math.random() * eventObjects.length)];                
//                 const otherEventBase = eventsList.filter(event => event !== eventBase)[Math.floor(Math.random() * (eventsList.length - 1))];

//                 swapEventTo(randomEventObject,`${otherEventBase}-object` );
//             }
//         }
//     }
// }

function updateGridFromEvidenceInputs(){
    const allObjects = document.querySelectorAll('.object');

    for(let i = 0; i < evidenceList.length; i++){
        const evidenceBase = evidenceList[i];

        for(let j = 0; j < eventsList.length; j++){
            const eventBase = eventsList[j];

            const currentNumEvidence = document.querySelectorAll(`.object.${eventBase}-object.${evidenceBase}-object`).length || 0;
            const adjustedNumEvidence = parseInt(document.getElementById(`${evidenceBase}-input-for-${eventBase}`).value);

            if(currentNumEvidence < adjustedNumEvidence){
                const diff = adjustedNumEvidence - currentNumEvidence;
                const availableObjects = Array.from(allObjects).filter(obj => obj.classList.contains(`${eventBase}-object`) && !obj.classList.contains(`${evidenceBase}-object`));
                for (let j = 0; j < diff; j++) {
                    const randomObject = availableObjects[Math.floor(Math.random() * availableObjects.length)];                
                    swapEvidenceTo(randomObject, `${evidenceBase}-object`);
                }
            }   
            else if (currentNumEvidence > adjustedNumEvidence){
                const diff = currentNumEvidence - currentNumEvidence;
                const evidenceObjects = document.querySelectorAll(`.object.${eventBase}-object.${evidenceBase}-object`);
                
                for (let j = 0; j < diff; j++) {
                    const randomObject = evidenceObjects[Math.floor(Math.random() * eventObjects.length)];                
                    const otherEvidenceBase = evidenceList.filter(evidence => evidence !== evidenceBase)[Math.floor(Math.random() * (evidenceList.length - 1))];
    
                    swapEvidenceTo(randomObject,`${otherEvidenceBase}-object` );
                }
            }
        }
    }
}

function swapEventTo(element, newClass){
    const classes = element.classList;
    classes.forEach(className => {
        if (/^event-\d+-object$/.test(className)) {
            classes.remove(className);
        }
    });
    element.classList.add(newClass);
}

function swapEvidenceTo(element, newClass){
    const classes = element.classList;
    classes.forEach(className => {
        if (/^evidence-\d+-object$/.test(className)) {
            classes.remove(className);
        }
    });
    element.classList.add(newClass);
}

function updateProbabilityLabels() {
    // for events:
    if(document.getElementById('show-prior-probabilities-checkbox').checked){
        for(let i = 0; i < eventsList.length; i++){
            const eventBase = eventsList[i];
            const eventName = document.getElementById(`${eventBase}-label`).innerText;
            const probabilityText = document.getElementById(`${eventBase}-prior-probability-text`);
            probabilityText.innerText = `P(${eventName}) = `;
        }
    }
    // for evidence:
    if(document.getElementById('show-evidence-probabilities-checkbox').checked){
        for(let i = 0; i < evidenceList.length; i++){
            const evidenceBase = evidenceList[i];
            for(let j = 0; j < eventsList.length; j++){
                const eventBase = eventsList[j];

                const existingElement = document.getElementById(`${evidenceBase}-probability-label-for-${eventBase}`);
                if (existingElement) {
                    existingElement.remove();
                }

                const probabilityElement = document.createElement("p");
                probabilityElement.id = `${evidenceBase}-probability-label-for-${eventBase}`;
                probabilityElement.style.marginTop = "9px";
                probabilityElement.style.marginBottom = "9px";
                probabilityElement.style.color = "#999";

                const container = document.getElementById(`${evidenceBase}-container`);
                if (container && container.children.length > 0) {
                    container.insertBefore(probabilityElement, container.children[1]);

                    const eventLabelElement = document.getElementById(`${eventBase}-label`);
                    const eventName = eventLabelElement.textContent.trim();
                    const evidenceLabelElement = document.getElementById(`${evidenceBase}-label`);
                    const evidenceName = evidenceLabelElement.textContent.trim();
                    
                    const totalObjects = document.querySelectorAll(`.object.${eventBase}-object`).length;
                    const eventObjects = document.querySelectorAll(`.object.${eventBase}-object.${evidenceBase}-object`).length;
                    const probability = totalObjects > 0 ? eventObjects / totalObjects : 0;

                    probabilityElement.innerHTML = `P(${evidenceName} | ${eventName}) = <span style="color: var(--${evidenceBase}-color)">${eventObjects}</span> / <span style="color: var(--${eventBase}-color)">${totalObjects}</span> ${formatAnswer(probability)}`;
                }
            }
        }
    }
}

// document.getElementById('show-prior-probabilities-checkbox').addEventListener('change', function(){
//     const checkbox = document.getElementById('show-prior-probabilities-checkbox');
    
//     if (checkbox.checked) {
//       updateProbabilityLabels();
//     } 
//     else {
//       for(let i=0; i<eventsList.length; i++){
//         document.getElementById(`${eventsList[i]}-probability-label`).remove();
//       }
//     }
// });

// document.getElementById('show-evidence-probabilities-checkbox').addEventListener('change', function(){
//     const checkbox = document.getElementById('show-evidence-probabilities-checkbox');
    
//     if (checkbox.checked) {
//       updateProbabilityLabels();
//     } 
//     else {
//       for(let i=0; i<evidenceList.length; i++){
//         for(let j=0; j<eventsList.length; j++){
//             document.getElementById(`${evidenceList[i]}-probability-label-for-${eventsList[j]}`).remove();
//         }
//       }
//     }
// });

const hypothesisDropdown = document.getElementById('hypothesis-dropdown');
const observedDropdown = document.getElementById('observed-dropdown');

function updateBayesColors(){
    document.getElementById('hypothesis-dropdown-A').style.color = `var(--${hypothesisDropdown.value}-color)`;
    document.querySelectorAll('.bf-event').forEach(element => {
        element.style.color = `var(--${hypothesisDropdown.value}-color)`;
    });
    document.getElementById('observed-dropdown-B').style.color = `var(--${observedDropdown.value}-color)`;
    document.querySelectorAll('.bf-evidence').forEach(element => {
        element.style.color = `var(--${observedDropdown.value}-color)`;
    });
}

hypothesisDropdown.addEventListener('change', updateBayesColors);
observedDropdown.addEventListener('change',updateBayesColors);
hypothesisDropdown.addEventListener('change', toggleBayesLabels);
observedDropdown.addEventListener('change',toggleBayesLabels);

function updateBayesDropdowns(){
    // Clear existing options
    hypothesisDropdown.innerHTML = '';
    observedDropdown.innerHTML = '';

    // Populate hypothesisDropdown with eventsList
    eventsList.forEach(event => {
        const labelElement = document.getElementById(`${event}-label`);
        if (labelElement) {
            const option = document.createElement('option');
            option.value = event; // Set value to event name
            option.textContent = labelElement.innerText; // Set text to the label text
            option.style.color = `var(--${event}-color)`;
            // option.textContent = `<span style="color:var(--${event}-color)">&#9679 </span>${labelElement.innerText}`;
            hypothesisDropdown.appendChild(option);
        }
    });

    // Populate observedDropdown with evidenceList
    evidenceList.forEach(evidence => {
        const labelElement = document.getElementById(`${evidence}-label`);
        if (labelElement) {
            const option = document.createElement('option');
            option.value = evidence; // Set value to evidence name
            option.textContent = labelElement.innerText; // Set text to the label text
            option.style.color = `var(--${evidence}-color)`;
            observedDropdown.appendChild(option);
        }
    });

    if (eventsList.length >= 2) {
        hypothesisDropdown.value = eventsList[1]; 
    }
    if (evidenceList.length >= 2) {
        observedDropdown.value = evidenceList[1];
    }

    updateBayesColors();
    toggleBayesLabels();

}

document.getElementById('show-labels-checkbox').addEventListener('change', toggleBayesLabels);

function toggleBayesLabels(){
    if(document.getElementById('show-labels-checkbox').checked){
        document.querySelectorAll('.bf-event').forEach(element => {
            element.innerHTML = document.getElementById(`${hypothesisDropdown.value}-label`).innerText;
        });
        document.querySelectorAll('.bf-evidence').forEach(element => {
            element.innerHTML =  document.getElementById(`${observedDropdown.value}-label`).innerText;
        });
        const ps = document.querySelectorAll('#bf-container p');
        ps.forEach(p => {
            p.style.fontSize = '18px';
        });
        // document.getElementById('bf-fraction-line').style.height="1px";
    }
    else{
        document.querySelectorAll('.bf-event').forEach(element => {
            element.innerHTML = 'H';
        });
        document.querySelectorAll('.bf-evidence').forEach(element => {
            element.innerHTML =  'E';
        });
        const ps = document.querySelectorAll('#bf-container p');
        ps.forEach(p => {
            p.style.fontSize = '30px';
        });
        // document.getElementById('bf-fraction-line').style.height="2px";
    }
}

const toggleKeyBtn = document.getElementById('toggle-key-btn');

function toggleKey() {
    const buttonText = toggleKeyBtn.querySelector('p');

    if (buttonText.innerText === 'Show Key') {
        buttonText.innerText = 'Hide Key';

        // if the key doesn't exist
        if(!document.getElementById('key')){
            // create key element
            const key = document.createElement('div');
            key.id = 'key';
            key.style.zIndex = '900';
            const keyBar = document.createElement('div');
            keyBar.className = 'top-bar draggable';
            keyBar.innerText = 'Key';

            const closeButton = document.createElement('button');
            closeButton.innerText = '✖';
            closeButton.className = 'close-btn';
            closeButton.onclick = function () {
                key.remove();
                buttonText.innerText = 'Show Key';
            };
            keyBar.appendChild(closeButton);
            key.appendChild(keyBar);
            const keyMain = document.createElement('div');
            keyMain.id = 'key-main';
            key.appendChild(keyMain);
            const resizeHandle = document.createElement('div');
            resizeHandle.id = 'resize-handle';
            key.appendChild(resizeHandle);
            document.body.appendChild(key);

            updateKey();

            makeDraggable(key);
            makeResizable(key, resizeHandle);
        }
        // if key does exist: show and update it
        else{
            document.getElementById('key').style.display = 'block';
            updateKey();
        }
    } else {
        // hide the key
        buttonText.innerText = 'Show Key';
        document.getElementById('key').style.display = 'none';
    }
}

toggleKeyBtn.addEventListener('click', toggleKey);

function showKey(){
    
}

function updateKey() {
    const keyMain = document.getElementById('key-main');
    if (!keyMain) return;

    keyMain.innerHTML = '';

    // update events
    const eventsLabel = document.createElement('h4');
    eventsLabel.innerText = 'Events';
    keyMain.appendChild(eventsLabel);

    const eventsContainer = document.createElement('div');
    if(eventsList.length == 0){
        eventsContainer.innerHTML = '<p style="opacity:0.5; margin:10px;">No Events</p>';
    }
    else{
        for (let i = 0; i < eventsList.length; i++) {
            const eventBase = eventsList[i];
            const eventKey = document.createElement('div');
            eventKey.className = 'event-key';
            // Graphic
            const graphic = document.createElement('div');
            graphic.className = `sample-object ${eventBase}-object`;
            eventKey.appendChild(graphic);
            // Label
            const eventName = document.createElement('p');
            eventName.innerText = document.getElementById(`${eventBase}-label`).innerText;
            eventKey.appendChild(eventName);
            // Add to key
            eventsContainer.appendChild(eventKey);
        }
    }
    keyMain.appendChild(eventsContainer);

    // update evidence
    if (evidenceTabOpened) {
        const evidenceLabel = document.createElement('h4');
        evidenceLabel.innerText = 'Evidence';
        keyMain.appendChild(evidenceLabel);

        const evidenceContainer = document.createElement('div');
        if(evidenceList.length == 0){
            evidenceContainer.innerHTML = '<p style="opacity:0.5; margin:10px;">No Evidence</p>';
        }
        else{
            for (let i = 0; i < evidenceList.length; i++) {
                const evidenceBase = evidenceList[i];
                const eventKey = document.createElement('div');
                eventKey.className = 'event-key';
                // Graphic
                const graphic = document.createElement('div');
                graphic.className = `sample-object ${evidenceBase}-object`;
                eventKey.appendChild(graphic);
                // Label
                const evidenceName = document.createElement('p');
                evidenceName.innerText = document.getElementById(`${evidenceBase}-label`).innerText;
                eventKey.appendChild(evidenceName);
                // Add to key
                evidenceContainer.appendChild(eventKey);
            }
        }
        keyMain.appendChild(evidenceContainer);
    }
}


const presetsBtn = document.getElementById('toggle-presets-btn');

function togglePresetsMenu() {
    const buttonText = presetsBtn.querySelector('p');

    if (!document.getElementById('presets-menu')) {
        // Create key popup
        const menu = document.createElement('div');
        menu.id = 'presets-menu';
        menu.style.zIndex = '900';


        // Create draggable bar
        const topBar = document.createElement('div');
        topBar.className = 'top-bar draggable';
        topBar.innerText = 'Save/Load';

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.innerText = '✖';
        closeButton.className = 'close-btn';
        closeButton.onclick = function () {
            menu.style.display = 'none';
        };

        topBar.appendChild(closeButton);
        menu.appendChild(topBar);

        // Key main
        const main = document.createElement('div');
        main.id = 'presets-menu-main';

        const loadHeading = document.createElement('h3');
        loadHeading.innerText = "Load Preset";
        main.appendChild(loadHeading);

        const loadStateSelect = document.createElement('select');
        loadStateSelect.id = 'load-state-select';
        loadStateSelect.style.backgroundColor = 'var(--dark-grey-1)';
        loadStateSelect.style.fontSize = '16px';


        loadStateSelect.addEventListener('change', function () {
            stateName = '';
            if (this.value) {
                stateName = this.value;
                const savedState = localStorage.getItem(this.value);
                if (savedState) {
                    try {
                        const parsedState = JSON.parse(savedState);
                        loadState(parsedState);
                    } catch (error) {
                        console.error('Error parsing saved state:', error);
                    }
                }
            }
            stateHasChanged();
            this.value = stateName;
            // menu.remove();
        });

        main.appendChild(loadStateSelect);

        const or = document.createElement('p');

        or.innerText = 'or';
        or.style.textAlign = 'center';
        or.style.opacity = 0.5;
        main.appendChild(or);

        const importJsonBtn = document.createElement('button');
        importJsonBtn.className = 'control-btn';
        importJsonBtn.id = 'import-json-btn';
        importJsonBtn.style.color = '#fff';
        importJsonBtn.style.backgroundColor = 'var(--control-green)'
        importJsonBtn.innerHTML = '<i class="fa-solid fa-file-import"  style="margin-right:5px;"></i>  Import .JSON';
        main.appendChild(importJsonBtn);


        function importJson() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json'; // Only allow JSON files
        
            input.addEventListener('change', function (event) {
                const file = event.target.files[0];
        
                if (!file) return; // If no file selected, do nothing
        
                const reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        const jsonData = JSON.parse(e.target.result); // Parse JSON
                        loadState(jsonData); // Call loadState function
                        stateHasChanged();
                    } catch (error) {
                        alert("Invalid JSON file!"); // Error handling
                        console.error("Error parsing JSON:", error);
                    }
                };
        
                reader.readAsText(file); // Read file as text
            });
        
            input.click(); // Open file picker
        }
        
        // Attach event listener to import button
        importJsonBtn.addEventListener('click', importJson);

        const saveHeading = document.createElement('h3');
        saveHeading.innerText = "Save As Preset";
        main.appendChild(saveHeading);
        // const stateNameLabel = document.createElement('label');
        // stateNameLabel.innerText = 'Preset Name:';
        // stateNameLabel.style.fontSize = '16px';
        // main.appendChild(stateNameLabel);
        // const stateNameInput = document.createElement('input');
        // stateNameInput.id = 'state-name-input';
        // main.appendChild(stateNameInput)

        const stateNameInput = document.createElement('input');
        stateNameInput.id = 'state-name-input';
        stateNameInput.placeholder = 'Preset Name'; // Add placeholder
        stateNameInput.style.fontSize = '16px';

        main.appendChild(stateNameInput);


        const saveStateBtn = document.createElement('button');
        saveStateBtn.className = 'control-btn';
        saveStateBtn.id = 'save-state-btn';
        saveStateBtn.style.backgroundColor = 'var(--dark-grey-1)'
        saveStateBtn.innerText = 'Save';

        main.appendChild(saveStateBtn)

        main.appendChild(or.cloneNode(true));

 
        const exportJsonBtn = document.createElement('button');
        exportJsonBtn.className = 'control-btn';
        exportJsonBtn.id = 'export-json-btn';
        exportJsonBtn.style.color = '#fff';
        exportJsonBtn.style.backgroundColor = 'var(--control-blue)'
        exportJsonBtn.innerHTML = '<i class="fa-solid fa-file-export"  style="margin-right:5px;"></i>  Export as .JSON';

        main.appendChild(exportJsonBtn)

        // Function to export JSON file
        async function exportJson() {
            const jsonData = localStorage.getItem('current-state');
            if (!jsonData) {
                alert("No data found to export!");
                return;
            }
        
            if ('showSaveFilePicker' in window) {
                try {
                    const fileHandle = await window.showSaveFilePicker({
                        suggestedName: "saved_state.json",
                        types: [{
                            description: "JSON File",
                            accept: { "application/json": [".json"] }
                        }]
                    });
        
                    const writableStream = await fileHandle.createWritable();
                    await writableStream.write(jsonData);
                    await writableStream.close();
                    // alert("File saved successfully!");
                } catch (error) {
                    console.error("Error saving file:", error);
                }
            } else {
                // Fallback for non-supported browsers
                downloadJsonManually(jsonData);
            }
        }

        function downloadJsonManually(jsonData) {
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
        
            const a = document.createElement('a');
            a.href = url;
            a.download = 'current-state.json'; // Default name, user can rename after download
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        
            URL.revokeObjectURL(url); // Clean up
        }        
        

        // Attach event listener to button
        exportJsonBtn.addEventListener('click', exportJson);

        

        const imageHeading = document.createElement('h3');
        imageHeading.innerText = "Export As Image";
        main.appendChild(imageHeading);


        const exportImageBtn = document.createElement('button');
        exportImageBtn.className = 'control-btn';
        exportImageBtn.id = 'export-image-btn';
        exportImageBtn.style.color = '#fff';
        exportImageBtn.style.backgroundColor = 'var(--control-blue)';
        exportImageBtn.innerHTML = '<i class="fa-solid fa-image" style="margin-right: 5px;"></i>  Export grid as .PNG';
        main.appendChild(exportImageBtn);

        exportImageBtn.addEventListener('click', function(){
            this.innerHTML = `<i class="fa-solid fa-image"></i>  Saving...`;
            this.style.background = 'var(--dark-grey-3)';
            this.style.pointerEvents = 'none';

            // Allow the UI changes to apply before calling the function
            setTimeout(() => {
                exportGridAsImage();
            }, 0);

        });

        const exportKeyBtn = document.createElement('button');
        exportKeyBtn.className = 'control-btn';
        exportKeyBtn.id = 'export-key-btn';
        exportKeyBtn.style.color = '#fff';
        exportKeyBtn.style.backgroundColor = 'var(--control-blue)';
        exportKeyBtn.innerHTML = '<i class="fa-solid fa-key" style="margin-right:5px;"></i>  Export key as .PNG';
        main.appendChild(exportKeyBtn);

        exportKeyBtn.addEventListener('click', function(){
            this.innerHTML = `<i class="fa-solid fa-image"></i>  Saving...`;
            this.style.background = 'var(--dark-grey-3)';
            this.style.pointerEvents = 'none';

            // Allow the UI changes to apply before calling the function
            setTimeout(() => {
                exportKeyAsImage();
            }, 0);
        });



        menu.appendChild(main);
        document.body.appendChild(menu);

        makeDraggable(menu);

        updatePresetOptions();
        saveStateBtn.addEventListener('click', saveBtnclick);
        function saveBtnclick(){
            const nameInput = document.getElementById('state-name-input').value.trim();
            if (!nameInput) {
                window.alert('Please enter a name to save the state.')
            } else {
                const stateName = `saved_state_${nameInput}`;
                saveCurrentState(stateName);
                updatePresetOptions();
                loadStateSelect.value = stateName;
                document.getElementById('state-name-input').value = '';
            }
        }


    }
    else if(document.getElementById('presets-menu').style.display == 'none'){
        document.getElementById('presets-menu').style.display = 'flex';
    }
    else {
        document.getElementById('presets-menu').style.display = 'none';

    }
}

function updatePresetOptions(){
        // const loadStateSelect = document.getElementById('load-state-select');
        const loadStateSelects = [document.getElementById('load-state-select'), document.getElementById('select-preset-intro')];
        for(let i = 0; i < loadStateSelects.length; i++){
            const loadStateSelect = loadStateSelects[i];
            if(loadStateSelect){
                loadStateSelect.innerHTML = "";
                // Populate dropdown with saved states from local storage
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.innerText = 'Load a saved preset';
    
                loadStateSelect.appendChild(defaultOption);
                loadStateSelect.value = '';
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('saved_state_')) {
                        const option = document.createElement('option');
                        const name = key.replace('saved_state_', ''); // Extract preset name
                        option.value = key;
                        option.innerText = name;
                        loadStateSelect.appendChild(option);
                    }
                }
            }
            
        }       
}

presetsBtn.addEventListener('click', togglePresetsMenu);

function makeDraggable(element) {
    const handle = element.querySelector('.draggable');
    let offsetX, offsetY, isDragging = false;

    handle.onmousedown = (e) => {
        handle.style.cursor = "grabbing";
        bringToFront(element);
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;

        document.onmousemove = (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
            }
        };

        document.onmouseup = () => {
            handle.style.cursor = "grab";
            isDragging = false;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    handle.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return; 
        const touch = e.touches[0];
        handle.style.cursor = "grabbing";
        bringToFront(element);
        isDragging = true;
        offsetX = touch.clientX - element.offsetLeft;
        offsetY = touch.clientY - element.offsetTop;

        const onTouchMove = (e) => {
            if (isDragging && e.touches.length === 1) {
                const touch = e.touches[0];
                element.style.left = `${touch.clientX - offsetX}px`;
                element.style.top = `${touch.clientY - offsetY}px`;
            }
        };

        const onTouchEnd = () => {
            handle.style.cursor = "grab";
            isDragging = false;
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };

        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    }, { passive: false });
}


function bringToFront(element) {
    let maxZ = Math.max(...Array.from(document.querySelectorAll("*"))
        .map(el => parseFloat(window.getComputedStyle(el).zIndex) || 0));
    element.style.zIndex = maxZ + 1;
}

function makeResizable(element, handle) {
    let isResizing = false;
    let initialX, initialY, initialSize;

    handle.onmousedown = (e) => {
        e.preventDefault();
        isResizing = true;
        initialX = e.clientX;
        initialY = e.clientY;
        initialSize = parseFloat(getComputedStyle(element).transform.split(',')[0]?.slice(7)) || 1;

        document.onmousemove = (e) => {
            if (isResizing) {
                const scaleFactor = Math.max(0.5, initialSize + (e.clientX - initialX) * 0.005);
                element.style.transform = `scale(${scaleFactor})`;
            }
        };

        document.onmouseup = () => {
            isResizing = false;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    handle.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        e.preventDefault();
        const touch = e.touches[0];
        isResizing = true;
        initialX = touch.clientX;
        initialY = touch.clientY;
        initialSize = parseFloat(getComputedStyle(element).transform.split(',')[0]?.slice(7)) || 1;

        const onTouchMove = (e) => {
            if (isResizing && e.touches.length === 1) {
                const touch = e.touches[0];
                const scaleFactor = Math.max(0.5, initialSize + (touch.clientX - initialX) * 0.005);
                element.style.transform = `scale(${scaleFactor})`;
            }
        };

        const onTouchEnd = () => {
            isResizing = false;
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };

        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    }, { passive: false });
}



// const toggleViewbBtn = document.getElementById('toggle-view-btn');

// function toggleView(){
//     const buttonText = toggleViewbBtn.querySelector('p');
//     const buttonIcon = toggleViewbBtn.querySelector('i');
//     console.log(buttonText.innerText);
//     if(buttonText.innerText == 'Tree View'){
//         showTreeView();
//     }
//     else{
//         hideTreeView();
//     }
// }

// function showTreeView(){
//     const buttonText = toggleViewbBtn.querySelector('p');
//     const buttonIcon = toggleViewbBtn.querySelector('i');
//     buttonText.innerText = 'Grid View';
//     buttonIcon.className = "fa-solid fa-grip";
//     document.getElementById('graphics-container').style.opacity = '0';
//     document.getElementById('graphics-container').style.pointerEvents = 'none';
//     drawTree();
//     document.querySelectorAll('[id^="make-selection-"]').forEach(element => {
//         element.style.pointerEvents = 'none';
//         element.style.opacity = '0.25';
//     });
// }

// function hideTreeView(){
//     const buttonText = toggleViewbBtn.querySelector('p');
//     const buttonIcon = toggleViewbBtn.querySelector('i');
//     buttonText.innerText = 'Tree View';
//     buttonIcon.className = "fa-solid fa-share-nodes";
//     removeTree();
//     document.getElementById('graphics-container').style.opacity = '1';
//     document.getElementById('graphics-container').style.pointerEvents = 'all';
//     document.querySelectorAll('[id^="make-selection-"]').forEach(element => {
//         element.style.pointerEvents = 'all';
//         element.style.opacity = '1';
//     });
// }

// toggleViewbBtn.addEventListener('click', toggleView);


const toggleViewSwitch = document.getElementById('toggle-view-switch');

toggleViewSwitch.addEventListener('change', function() {
    if (this.checked) {
        showTreeView();
    } else {
        hideTreeView();
    }
});

function showTreeView(){
    document.getElementById('graphics-container').style.opacity = '0';
    document.getElementById('graphics-container').style.pointerEvents = 'none';
    drawTree();
    document.querySelectorAll('[id^="make-selection-"]').forEach(element => {
        // element.style.pointerEvents = 'none';
        element.disabled = true;
        element.style.opacity = '0.25';
        element.style.cursor = 'not-allowed';
    });
}

function hideTreeView(){
    removeTree();
    document.getElementById('graphics-container').style.opacity = '1';
    document.getElementById('graphics-container').style.pointerEvents = 'all';
    document.querySelectorAll('[id^="make-selection-"]').forEach(element => {
        // element.style.pointerEvents = 'all';
        element.disabled = false;
        element.style.opacity = '1';
        element.style.cursor = 'pointer';

    });
}


function infoPopup(html, duration=5) {
    let popupContainer = document.querySelector('.popup-container');

    // Create the container if it doesn't exist
    if (!popupContainer) {
        popupContainer = document.createElement('div');
        popupContainer.className = 'popup-container';
        document.body.appendChild(popupContainer);
    }

    const popup = document.createElement('div');
    popup.className = 'info-popup';

    const infoIcon = document.createElement('i');
    infoIcon.innerHTML = `<i class="fa-solid fa-circle-info"></i>`;

    const popupMain = document.createElement('div');
    popupMain.innerHTML = html;

    const closePopup = document.createElement('button');
    closePopup.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    closePopup.onclick = function() {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 500);
    };

    popup.appendChild(infoIcon);
    popup.appendChild(popupMain);
    popup.appendChild(closePopup);

    // Insert new popup at the top
    popupContainer.prepend(popup);

    // Allow animation to apply after a slight delay
    setTimeout(() => popup.classList.add('show'), 10);

    // Auto-remove after 'duration' seconds
    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => popup.remove(), 500);
    }, duration * 1000);
}

function showFeedbackForm(){
    const container = document.createElement('div');
    container.id = 'feedback-form-container';

    const form = document.createElement('div');
    form.id = 'feedback-form';

    const closeButton = document.createElement('button');
    closeButton.innerText = '✖';
    closeButton.className = 'close-btn';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '12px';
    closeButton.style.right = '12px';
    closeButton.onclick = function () {
        container.remove();
    };
    form.appendChild(closeButton);

    const header = document.createElement('h2');
    header.innerText = 'Help me improve this project!';
    form.appendChild(header);

    const line = document.createElement('hr');
    form.appendChild(line);

    function createStarRating(name) {
        const starContainer = document.createElement('div');
        starContainer.className = 'star-rating';
        for (let i = 5; i >= 1; i--) {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = name;
            input.value = i;
            input.id = `${name}-${i}`;

            const label = document.createElement('label');
            label.htmlFor = `${name}-${i}`;
            label.innerHTML = `<i class='fa-solid fa-star'></i>`;

            starContainer.appendChild(input);
            starContainer.appendChild(label);
        }
        return starContainer;
    }


    const ease = document.createElement('p');
    ease.innerText = 'How easy have you found using the app?';
    form.appendChild(ease);
    form.appendChild(createStarRating('ease-of-use'));

    const help = document.createElement('p');
    help.innerText = 'How helpful have these visualisations been for learning/teaching?';
    form.appendChild(help);
    form.appendChild(createStarRating('helpful'));

    const improve = document.createElement('p');
    improve.innerText = 'How can I improve this project?';
    form.appendChild(improve);

    const textInput = document.createElement('textarea');
    textInput.name = 'feedback-input';
    form.appendChild(textInput);

    const line2 = document.createElement('hr');
    form.appendChild(line2);


    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '10px';

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'No Thanks';
    cancelBtn.className = 'control-btn';
    cancelBtn.style.backgroundColor = 'grey';
    cancelBtn.style.color = 'white';
    cancelBtn.style.fontSize = '14px';
    cancelBtn.onclick = function(){
        container.remove();
    }
    btnContainer.appendChild(cancelBtn);

    const submitBtn = document.createElement('button');
    submitBtn.innerText = 'Submit Feedback';
    submitBtn.className = 'control-btn';
    submitBtn.style.backgroundColor = 'var(--control-blue)';
    submitBtn.style.color = 'white';
    submitBtn.style.fontSize = '14px';
    submitBtn.onclick = function () {
        submitBtn.innerText = 'Submitting...';
        submitBtn.style.pointerEvents = 'none';
        const easeOfUse = document.querySelector('input[name="ease-of-use"]:checked')?.value || "";
        const isItHelpful = document.querySelector('input[name="helpful"]:checked')?.value || "";
        const feedbackInput = textInput.value || "";

        if(feedbackInput.toLowerCase().includes("woody")){
            // document.getElementById('feedback-form').remove();
            // const form = document.createElement('div');
            // form.id = 'feedback-form';
            form.innerHTML = '';
            form.style.rowGap = '36px';

            const closeButton = document.createElement('button');
            closeButton.innerText = '✖';
            closeButton.className = 'close-btn';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '12px';
            closeButton.style.right = '12px';
            closeButton.onclick = function () {
                container.remove();
            };
            form.appendChild(closeButton);

            const thankYou = document.createElement('h2');
            thankYou.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--control-green)"></i> Thank you for your feedback!`;
            form.appendChild(thankYou);

            const gif = document.createElement('img');
            gif.src = '../images/woody_static.png'; 
            gif.style.width = '80%';
            form.appendChild(gif);

            const welcome = document.createElement('button');
            welcome.id = 'dap';
            welcome.innerHTML = `<i class="fa-solid fa-handshake"></i> Dap  Woody`;
            welcome.className = 'control-btn';
            welcome.style.backgroundColor = 'var(--control-blue)';
            welcome.style.color = 'white';
            welcome.style.fontSize = '14px';
            welcome.onclick = function () {
                gif.src = '../images/woody.gif?' + new Date().getTime();
                welcome.style.backgroundColor = 'grey';
                welcome.style.pointerEvents = 'none';
                welcome.style.display = 'none';
                document.getElementById('dont-dap').style.display = 'none';
                setTimeout(() => {
                    container.style.opacity = 0;
                    setTimeout(() => {
                        container.remove();
                    }, 200);
                }, 2000); 
            };
            form.appendChild(welcome);

            const dontdap = document.createElement('button');
            dontdap.id = 'dont-dap';
            dontdap.innerHTML = `<i class="fa-solid fa-heart-crack"></i> Don't Dap`;
            dontdap.className = 'control-btn';
            dontdap.style.color = 'white';
            dontdap.onclick = function () {
                dontdap.style.display = 'none';
                welcome.style.display = 'none';
                setTimeout(() => {
                    gif.src = '../images/woody_sad.png'; 
                    // container.style.transition = 'all ease 1s';
                    setTimeout(() => {
                        container.style.opacity = 0;
                        setTimeout(() => {
                            container.remove();
                        }, 200);
                    }, 1000);
                }, 0);
            };
            form.appendChild(dontdap);
            container.appendChild(form);

        }
        else{
            console.log("post feedback");
            fetch("https://formspree.io/f/xzzdnlwe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ easeOfUse, isItHelpful, feedbackInput })
            })
            .then(response => {
                if (response.ok) {
                    form.innerHTML = '';
                    form.style.rowGap = '36px';

                    const closeButton = document.createElement('button');
                    closeButton.innerText = '✖';
                    closeButton.className = 'close-btn';
                    closeButton.style.position = 'absolute';
                    closeButton.style.top = '12px';
                    closeButton.style.right = '12px';
                    closeButton.onclick = function () {
                        container.remove();
                    };
                    form.appendChild(closeButton);

                    const thankYou = document.createElement('h2');
                    thankYou.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--control-green)"></i> Thank you for your feedback!`;
                    form.appendChild(thankYou);

                    const gif = document.createElement('img');
                    gif.src = '../images/woody_static.png'; 
                    gif.style.width = '80%';
                    form.appendChild(gif);

                    const welcome = document.createElement('button');
                    welcome.innerHTML = `<i class="fa-solid fa-handshake"></i> You're Welcome!`;
                    welcome.className = 'control-btn';
                    welcome.style.backgroundColor = 'var(--control-blue)';
                    welcome.style.color = 'white';
                    welcome.style.fontSize = '14px';
                    welcome.onclick = function () {
                        gif.src = '../images/woody.gif?' + new Date().getTime();
                        welcome.style.backgroundColor = 'grey';
                        welcome.style.pointerEvents = 'none';
                        setTimeout(() => {
                            container.style.opacity = 0;
                            setTimeout(() => {
                                container.remove();
                            }, 200);
                        }, 2000); 
                    };
                    form.appendChild(welcome);


                } else {
                    alert("Something went wrong. Please try again.");
                    submitBtn.innerText = 'Submit Feedback';
                    submitBtn.style.pointerEvents = 'all';
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error submitting feedback.");
                submitBtn.innerText = 'Submit Feedback';
                submitBtn.style.pointerEvents = 'all';
            });
        }
    };
    
    
    btnContainer.appendChild(submitBtn);

    form.appendChild(btnContainer);

    container.appendChild(form);
    document.body.appendChild(container);
}

document.getElementById('open-feedback-btn').addEventListener('click', showFeedbackForm);


function lightMode(){
    document.documentElement.style.setProperty('--dark-grey-1', 'rgb(233, 233, 233)');
    document.documentElement.style.setProperty('--dark-grey-2', 'rgb(243, 243, 243)');
    document.documentElement.style.setProperty('--dark-grey-3', 'rgb(255, 255, 255)');
    document.documentElement.style.setProperty('--light-grey', 'rgb(63, 63, 63)');
    document.documentElement.style.setProperty('--main-text', '#000');

}

function darkMode(){

    document.documentElement.style.setProperty('--dark-grey-1', '#202020');
    document.documentElement.style.setProperty('--dark-grey-2', '#292929');
    document.documentElement.style.setProperty('--dark-grey-3', '#3d3d3d');
    document.documentElement.style.setProperty('--light-grey', '#f1f1f1');
    document.documentElement.style.setProperty('--main-text', '#fff');
}

document.getElementById('close-welcome-btn').addEventListener('click', function(){
    document.getElementById('welcome-container').style.display = 'none';
    setTimeout(() => {
        infoPopup(`Use <b>CTRL +</b> and <b>CTRL -</b><br>to scale the page to fit on your screen`, 5);
    }, 1000);
});

document.getElementById('start-from-scratch-btn').addEventListener('click', function(){
    stateToLoad = localStorage.getItem('saved_state_Empty');
    const parsedState = JSON.parse(stateToLoad);
    loadState(parsedState);

    const container = document.getElementById('welcome-container');
    container.style.opacity = 0;
    setTimeout(() => {
        container.style.display = 'none';
    }, 200);

    setTimeout(() => {
        infoPopup(`Use <b>CTRL +</b> and <b>CTRL -</b><br>to scale the page to fit on your screen`, 5);
    }, 1000);

    setTimeout(() => {
        infoPopup('<b>Left-click + Drag</b> to Pan<br><b>Scroll</b> to Zoom', 5);
    }, 10000);
});

document.getElementById('welcome-load-btn').addEventListener('click', function(){
    const selectedState = document.getElementById('welcome-preset-select').value;
    stateToLoad = localStorage.getItem(selectedState);
    const parsedState = JSON.parse(stateToLoad);
    loadState(parsedState);
    saveCurrentState('current-state');

    const container = document.getElementById('welcome-container');
    container.style.opacity = 0;
    setTimeout(() => {
        container.style.display = 'none';
    }, 200);

    toggleKey();
    setTimeout(() => {
        infoPopup(`Use <b>CTRL +</b> and <b>CTRL -</b><br>to scale the page to fit on your screen`, 5);
    }, 1000);

    setTimeout(() => {
        infoPopup('<b>Left-click + Drag</b> to Pan<br><b>Scroll</b> to Zoom', 5);
    }, 7000);
})


document.getElementById('select-preset-intro').addEventListener('change', function () {
    stateName = '';
    if (this.value) {
        stateName = this.value;
        const savedState = localStorage.getItem(this.value);
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                loadState(parsedState);
            } catch (error) {
                console.error('Error parsing saved state:', error);
            }
        }
    }
    stateHasChanged();
    this.value = stateName;
    // menu.remove();
});



function frequency(class1, class2=null){
    if(class1 && class2){
        return document.querySelectorAll(`.object.${class1}-object.${class2}-object`).length;
    }
    else{
        return document.querySelectorAll(`.object.${class1}-object`).length;
    }
}

function generateTwoWayTable() {
    if(document.getElementById('two-way-table-container')){
        document.getElementById('two-way-table-container').remove();
    }
    else{
        console.log('drawing two-way table...');
        const tableContainer = document.createElement('div');
        tableContainer.id = 'two-way-table-container';
        const top = document.createElement('div');
        top.className = 'top-bar draggable';
        top.innerText = 'Two-Way Table';

        const closeButton = document.createElement('button');
        closeButton.innerText = '✖';
        closeButton.className = 'close-btn';
        closeButton.onclick = function () {
            tableContainer.remove();
        };
        top.appendChild(closeButton);

        tableContainer.appendChild(top);

        
        const table = document.createElement('table');
        table.id = "two-way-table";

        // Append the generated table to the body
        tableContainer.appendChild(table);


        const resizeHandle = document.createElement('div');
        resizeHandle.classList.add('resize-handle');
        tableContainer.appendChild(resizeHandle);


        document.body.appendChild(tableContainer);
        updateTwoWayTable();

        makeDraggable(tableContainer);
        makeResizable(tableContainer, resizeHandle);
    }
}

function updateTwoWayTable(){
    console.log('udpating two-way table...');

    const tableContainer = document.getElementById('two-way-table-container');
    if(tableContainer){
        document.getElementById('two-way-table').remove();

        const table = document.createElement('table');
        table.id = "two-way-table";

        // Create header row
        const headerRow = document.createElement('tr');
        const headerLabel = document.createElement('th');
        headerLabel.innerText = " ";
        headerRow.appendChild(headerLabel);

        evidenceList.forEach((evidence) => {
        const th = document.createElement('th');
        th.innerText = document.getElementById(`${evidence}-label`).innerText;
        th.style.color = `var(--${evidence}-color)`;
        headerRow.appendChild(th);
        });

        // Add totals column header
        const totalHeader = document.createElement('th');
        totalHeader.innerText = "Total";
        headerRow.appendChild(totalHeader);
        table.appendChild(headerRow);

        // Array to hold column totals
        const columnTotals = new Array(evidenceList.length).fill(0);
        let columnEvidence = [];

        // Add rows for each event
        eventsList.forEach((event) => {
        const row = document.createElement('tr');
        const rowHeader = document.createElement('th');
        rowHeader.innerText = document.getElementById(`${event}-label`).innerText;
        rowHeader.style.color = `var(--${event}-color)`;
        row.appendChild(rowHeader);

        let rowTotal = 0;

        evidenceList.forEach((evidence, index) => {
            const td = document.createElement('td');
            const freqValue = frequency(event, evidence);
            td.innerText = freqValue;
            td.style.backgroundColor = `var(--dark-grey-3)`;
            td.addEventListener('mouseenter', ()=>{
                focusClasses(`${event}-object`,`${evidence}-object`);
            });
            td.addEventListener('mouseleave', focusAll);
            row.appendChild(td);
            rowTotal += freqValue;

            // Add the value to the corresponding column total
            columnTotals[index] += freqValue;
            columnEvidence[index] = evidence;
        });

        // Add total column for the row
        const totalCell = document.createElement('td');
        totalCell.innerText = rowTotal;
        totalCell.addEventListener('mouseenter', ()=>{
            focusClass(`${event}-object`);
        });
        totalCell.addEventListener('mouseleave', focusAll);
        row.appendChild(totalCell);

        table.appendChild(row);
        });

        // Add totals row
        const totalRow = document.createElement('tr');
        const totalRowHeader = document.createElement('th');
        totalRowHeader.innerText = "Total";
        // totalRowHeader.style.fontWeight = 'bold';
        totalRow.appendChild(totalRowHeader);

        columnTotals.forEach((colTotal, index) => {
            const totalCell = document.createElement('td');
            totalCell.innerText = colTotal;
            totalCell.addEventListener('mouseenter', ()=>{
                focusClass(`${columnEvidence[index]}-object`);
            });
            totalCell.addEventListener('mouseleave', focusAll);
            totalRow.appendChild(totalCell);        
        });

        // Add total column for the row
        const totalCell = document.createElement('td');
        totalCell.innerText = columnTotals.reduce((sum, total) => sum + total, 0); // Total of the total column
        totalRow.appendChild(totalCell);

        table.appendChild(totalRow);

        // Append the generated table to the body
        tableContainer.appendChild(table);
    }
}
