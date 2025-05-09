
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let zoomFactor = 1;

let isTouchDragging = false;
let touchStartX = 0;
let touchStartY = 0;
let initialLeft = 0;
let initialTop = 0;

let initialPinchDistance = null;
let initialZoomFactor = zoomFactor;

// === MOUSE CONTROLS ===
graphicsContainer.addEventListener('mousedown', (e) => {
    if (e.button === 0 && !selectionMode) {
        isDragging = true;
        offsetX = e.clientX - origin.getBoundingClientRect().left;
        offsetY = e.clientY - origin.getBoundingClientRect().top;
        graphicsContainer.style.cursor = 'grabbing';
    }
});

graphicsContainer.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        origin.style.left = `${newX}px`;
        origin.style.top = `${newY}px`;

        objectsGrid.style.left = `${newX - objectsGrid.offsetWidth / 2}px`;
        objectsGrid.style.top = `${newY - objectsGrid.offsetHeight / 2}px`;
    }
});

graphicsContainer.addEventListener('mouseup', () => {
    isDragging = false;
    graphicsContainer.style.cursor = selectionMode ? 'crosshair' : 'grab';
});

graphicsContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    graphicsContainer.style.cursor = 'grab';
});

graphicsContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.025;
    if (e.deltaY < 0) {
        zoomFactor += zoomSpeed;
    } else {
        zoomFactor = Math.max(zoomFactor - zoomSpeed, 0.1);
    }
    objectsGrid.style.transform = `scale(${zoomFactor ** 3})`;
}, { passive: false });

// === TOUCH CONTROLS ===
graphicsContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1 && !selectionMode) {
        isTouchDragging = true;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        const rect = origin.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        graphicsContainer.style.cursor = 'grabbing';
    } else if (e.touches.length === 2) {
        initialPinchDistance = getDistance(e.touches[0], e.touches[1]);
        initialZoomFactor = zoomFactor;
    }
}, { passive: false });

graphicsContainer.addEventListener('touchmove', (e) => {
    if (isTouchDragging && e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const newX = initialLeft + deltaX;
        const newY = initialTop + deltaY;

        origin.style.left = `${newX}px`;
        origin.style.top = `${newY}px`;

        objectsGrid.style.left = `${newX - objectsGrid.offsetWidth / 2}px`;
        objectsGrid.style.top = `${newY - objectsGrid.offsetHeight / 2}px`;
    } else if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        if (initialPinchDistance) {
            const scale = currentDistance / initialPinchDistance;
            zoomFactor = Math.max(initialZoomFactor * scale, 0.1);
            objectsGrid.style.transform = `scale(${zoomFactor ** 3})`;
        }
    }
}, { passive: false });

graphicsContainer.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) {
        isTouchDragging = false;
        initialPinchDistance = null;
        graphicsContainer.style.cursor = selectionMode ? 'crosshair' : 'grab';
    }
});

function getDistance(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.hypot(dx, dy);
}


function drawObjects(saved = []) {
    objectsGrid.innerHTML = '';
    numObjects = document.getElementById('input-num-objects').value

    let gridSize = Math.ceil(Math.sqrt(numObjects));
    var gap = objectsGrid.style.gap;
    gap = 0;
    const objectSize = 70;
    const gapSize = 15;
    const borderWidth = 7;
    
    objectsGrid.style.gridTemplateColumns = `repeat(${gridSize}, ${objectSize}px)`;
    objectsGrid.style.gridTemplateRows = `repeat(${gridSize}, ${objectSize}px)`;

    const gridWidth = gridSize * (objectSize + 0) - 0;
    const gridHeight = gridWidth;

    objectsGrid.style.width = `${gridWidth}px`;
    objectsGrid.style.height = `${gridHeight}px`;
    objectsGrid.style.gap = `${gapSize}px`;

    for (let i = 0; i < numObjects; i++) {
        const newObject = document.createElement('div');
        if(saved[i]){
            for(let j = 0; j < saved[i].length; j++){
                newObject.classList.add(saved[i][j]);
            }
        }
        else{
            newObject.classList.add('object');
            const randEvent = eventsList[Math.floor(Math.random() * eventsList.length)];
            newObject.classList.add(`${randEvent}-object`);
            if(evidenceTabOpened){
                const randEvidence = evidenceList[Math.floor(Math.random() * evidenceList.length)];
                newObject.classList.add(`${randEvidence}-object`);
           
            }

        }

        newObject.addEventListener('click', (event) => {
            if(event.button == 0){
                selectIndividualObject(this);
            
            }
        });

        newObject.style.width = `${objectSize}px`;
        newObject.style.height = `${objectSize}px`;
        objectsGrid.appendChild(newObject);
    }

    if(gridHeight >= window.innerHeight){
        zoomFactor =   0.65 * window.innerHeight / gridHeight;
        objectsGrid.style.transform = `scale(${zoomFactor})`;
    }

    const originRect = origin.getBoundingClientRect();

    objectsGrid.style.top = `${originRect.top + originRect.height / 2 - gridHeight / 2}px`;
    objectsGrid.style.left = `${originRect.left + originRect.width / 2 - gridWidth / 2}px`;

    // updateProbabilityLabels();

}



function saveCurrentGridState(){
    const allObjects = Array.from(document.getElementsByClassName("object"));
    let gridState = [];

    allObjects.forEach((object) => {
        gridState.push(Array.from(object.classList));
    });

    return gridState;
}

const posteriorText = document.getElementById("bf-posterior");
const likelihoodText = document.getElementById("bf-likelihood");
const priorText = document.getElementById("bf-prior");
const marginalText = document.getElementById("bf-marginal");

let selectedElement = null; 

posteriorText.addEventListener("mouseenter", function(){
    const eventBase = `${hypothesisDropdown.value}`;
    const evidenceBase = `${observedDropdown.value}`;
    const objects = document.querySelectorAll('.object');
    updateHoverInfo("posterior");
    
    objects.forEach(function(element) {
        if (!element.classList.contains(`${evidenceBase}-object`)) {
            element.classList.add('unfocus');
        }
        if(!element.classList.contains(`${eventBase}-object`)){
            // element.classList.add("hide-event");

        }
    }); 
});
likelihoodText.addEventListener("mouseenter", function(){
    const eventBase = `${hypothesisDropdown.value}`;
    const evidenceBase = `${observedDropdown.value}`;
    const objects = document.querySelectorAll('.object');
    updateHoverInfo("likelihood");
    
    objects.forEach(function(element) {
        if (!element.classList.contains(`${eventBase}-object`)) {
            element.classList.add('unfocus');
        }
        if(!element.classList.contains(`${evidenceBase}-object`)){
            // element.classList.add("hide-evidence");

        }
    }); 
});
priorText.addEventListener("mouseenter", function(){
    const eventBase = `${hypothesisDropdown.value}`;
    const evidenceBase = `${observedDropdown.value}`;
    const objects = document.querySelectorAll('.object');
    updateHoverInfo("prior");
    
    objects.forEach(function(element) {
        element.classList.add("hide-evidence");
        if(!element.classList.contains(`${eventBase}-object`)){
            // element.classList.add("hide-event");

        }
    }); 
});
marginalText.addEventListener("mouseenter", function(){
    const eventBase = `${hypothesisDropdown.value}`;
    const evidenceBase = `${observedDropdown.value}`;
    const objects = document.querySelectorAll('.object');
    updateHoverInfo("marginal");
    
    objects.forEach(function(element) {
        element.classList.add("hide-event")
        if(!element.classList.contains(`${evidenceBase}-object`)){
            // element.classList.add("hide-evidence");
        }
    }); 
});

document.querySelectorAll(".bf-element").forEach(element => {
    element.addEventListener("mouseleave", function() {
        if(selectedElement === element) return;
        resetGridEffects();
    });
});

function resetGridEffects(){
    selectedElement = null;
    resetHoverInfo();
    focusAllObjects();
}

let fromBayesSection = true;
document.querySelectorAll(".bf-element").forEach(element => {
    element.addEventListener("click", function() {
        selectedElement = element; 
        if(document.getElementById('bayes-controls-container').style.display != 'none'){
            fromBayesSection = true;
            document.getElementById('navbar-bayes').classList.remove('active');
            document.getElementById('bayes-controls-container').style.display = 'none';
        }
        else{
            resetGridEffects();
            selectedElement = element;
            element.dispatchEvent(new Event("mouseenter"));
            fromBayesSection = false;
        }
        document.getElementById('presentation-view-container').style.display = 'flex';
        updatePresentationView();
    });
});

function updatePresentationView(){
    const eventName = document.getElementById(`${hypothesisDropdown.value}-label`).innerText;
    const eventColor = `var(--${hypothesisDropdown.value}-color)`;
    const event = `<span style='color:${eventColor};font-weight:bold;'>${eventName}</span>`
    const evidenceName = document.getElementById(`${observedDropdown.value}-label`).innerText;
    const evidenceColor = `var(--${observedDropdown.value}-color)`;
    const evidence = `<span style='color:${evidenceColor};font-weight:bold;'>${evidenceName}</span>`
    
    const total = document.querySelectorAll('.object').length;
    const eventCount = document.querySelectorAll(`.object.${hypothesisDropdown.value}-object`).length;
    const evidenceCount =  document.querySelectorAll(`.object.${observedDropdown.value}-object`).length;
    const jointCount = document.querySelectorAll(`.object.${hypothesisDropdown.value}-object.${observedDropdown.value}-object`).length;

    const container = document.getElementById('presentation-view-container');
    container.innerHTML = '';
    const header = document.createElement('div');
    const title = document.createElement('h2');
    const description = document.createElement('p');
    description.className = 'presentation-info-text';

    const calculationContainer = document.createElement('div');
    calculationContainer.id = 'presentation-calculation-container';
    const calculationHead = document.createElement('p');
    const calculationInfo = document.createElement('div');
    calculationInfo.style = 'display:flex; flex-direction:row; align-items:center; column-gap:16px';
    const fraction = document.createElement('div');
    fraction.className = 'fraction-container';
    const infoNumerator = document.createElement('div');
    infoNumerator.style = 'display:flex; flex-direction:row; align-items:center; justify-content:center; column-gap: 0px;';
    const line = document.createElement('div');
    line.className = 'fraction-line';
    const infoDenominator = document.createElement('div');
    infoDenominator.style = 'display:flex; flex-direction:row; align-items:center; justify-content:center; column-gap: 0px;';
    const calculationResult = document.createElement('p');
    calculationResult.style.textAlign = 'center';

    const backBtn = document.createElement('button');
    backBtn.className = 'control-btn';
    backBtn.innerHTML = "<i class='fa-solid fa-arrow-left'></i> Back";
    backBtn.style.backgroundColor = 'var(--dark-grey-1)';
    backBtn.style.fontSize = '16px';
    backBtn.addEventListener('click', function(){
        if(fromBayesSection){
            document.getElementById('bayes-controls-container').style.display = 'flex';
            document.getElementById('navbar-bayes').classList.add('active');
            document.getElementById('presentation-view-container').style.display = 'none';
            resetGridEffects();
        }
        else{
            posteriorText.dispatchEvent(new Event("mouseenter"));
            posteriorText.click();
            fromBayesSection = true;
        }
    })

    if(selectedElement === priorText){
        title.innerText = "Prior Probability";
        description.innerHTML = `P(Hypothesis)<br><br>Represents the initial belief of the probability of ${event} before observing any evidence.`;
        calculationHead.innerHTML = `P(${event})`;
        infoNumerator.innerHTML = `<p>${eventCount}</p><div class='sample-object-smaller ${hypothesisDropdown.value}-object'></div>`;
        for(let i = 0; i < eventsList.length; i++){
            if(i>0){
                infoDenominator.innerHTML += `<p style='margin: 0 10px;'>+</p>`;
            }
            const eventId = eventsList[i];
            const count = document.querySelectorAll(`.object.${eventId}-object`).length;
            const html = `<p>${count}</p><div class='sample-object-smaller ${eventId}-object'></div>`;
            infoDenominator.innerHTML += html;
        }
        calculationResult.innerHTML = `= ${eventCount}/${total} ${formatAnswer(probability)}`;

    }
    else if(selectedElement === posteriorText){
        title.innerText = "Posterior Probability";
        description.innerHTML = `P(Hypothesis | Evidence)<br><br>This is what we want to calculate.</br>Represents the updated probability of ${event} given that ${evidence} has occured.`;
        calculationHead.innerHTML = `P(${event} | ${evidence})`;
        infoNumerator.innerHTML = `<p class="presentation-bayes-element" onclick="likelihoodText.click();">P(${evidence} | ${event})</p>`;
        infoNumerator.innerHTML += `<span style='margin: 0 10px; font-size:18px; opacity:0.5;'>&times</span>`;
        infoNumerator.innerHTML += `<p class="presentation-bayes-element" onclick="priorText.click()";>P(${event})</p>`;
        infoDenominator.innerHTML = `<p class="presentation-bayes-element" onclick="marginalText.click()";>P(${evidence})</p>`;
        calculationResult.innerHTML = `= (${jointCount}/${eventCount} &times ${eventCount}/${total}) / (${evidenceCount}/${total})<br><br> = ${jointCount}/${evidenceCount} <b>${formatAnswer(probability)}</b>`;

    }
    else if(selectedElement === likelihoodText){
        title.innerText = "Likelihood";
        description.innerHTML = `P(Evidence | Hypothesis)<br><br>Represents the probability of ${evidence} occuring given that ${event} is true.`;
        calculationHead.innerHTML = `P(${evidence} | ${event})`;
        infoNumerator.innerHTML = `<p>${jointCount}</p><div class='sample-object-smaller ${hypothesisDropdown.value}-object ${observedDropdown.value}-object'></div>`;
        infoDenominator.innerHTML = `<p>${eventCount}</p><div class='sample-object-smaller ${hypothesisDropdown.value}-object'></div>`;
        calculationResult.innerHTML = `= ${jointCount}/${eventCount} ${formatAnswer(probability)}`;

    }
    else if(selectedElement === marginalText){
        title.innerText = "Marginal Probability";
        description.innerHTML = `P(Evidence)<br><br>Represents the total probability of ${evidence} occuring under all possible scenarios.`;
        calculationHead.innerHTML = `P(${evidence})`;
        infoNumerator.innerHTML = `<p>${evidenceCount}</p><div class='sample-object-smaller ${observedDropdown.value}-object'></div>`;
        for(let i = 0; i < evidenceList.length; i++){
            if(i>0){
                infoDenominator.innerHTML += `<p style='margin: 0 10px;'>+</p>`;
            }
            const eventId = evidenceList[i];
            const count = document.querySelectorAll(`.object.${eventId}-object`).length;
            const html = `<p>${count}</p><div class='sample-object-smaller ${eventId}-object'></div>`;
            infoDenominator.innerHTML += html;
        }
        calculationResult.innerHTML = `= ${evidenceCount}/${total} ${formatAnswer(probability)}`;

    }

    const minimiseBtn = document.createElement('button');
    minimiseBtn.className = 'minimise-btn';
    minimiseBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    minimiseBtn.onclick = minimiseWindow;
    container.appendChild(minimiseBtn);
    header.appendChild(title);
    header.appendChild(description);
    container.appendChild(header);
    calculationContainer.appendChild(calculationHead);
    fraction.appendChild(infoNumerator);
    fraction.appendChild(line);
    fraction.appendChild(infoDenominator);
    calculationInfo.innerHTML = '<p>=</p>';
    calculationInfo.appendChild(fraction);
    calculationContainer.appendChild(calculationInfo);
    calculationContainer.appendChild(calculationResult);
    container.appendChild(calculationContainer);
    container.appendChild(backBtn);
}

function createFractionElement(numerators, denominators){

}

function focusAllObjects(){
    const allObjects = Array.from(document.getElementsByClassName("object"));

    allObjects.forEach((object) => {
        object.classList.remove("unfocus");
        object.classList.remove("hide-evidence");
        object.classList.remove("hide-event");

    });

}

function focusAll(){
    const allObjects = Array.from(document.getElementsByClassName("object"));

    allObjects.forEach((object) => {
        object.classList.remove("unfocus");

    });
}

function focusClass(cls) {
    const objects = document.querySelectorAll('.object');
    
    objects.forEach((element) => {
        if (!element.classList.contains(cls)) {
            element.classList.add('unfocus');
        }
    });
}

function focusClasses(cls1, cls2) {
    const objects = document.querySelectorAll('.object');
    
    objects.forEach((element) => {
        if (!(element.classList.contains(cls1) && element.classList.contains(cls2))) {
            element.classList.add('unfocus');
        }
    });
}

function hideEvidence(){
    const objects = document.querySelectorAll('.object');
    
    objects.forEach(function(element) {
        element.classList.add("hide-evidence");
    }); 
}

function showEvidence(){
    const objects = document.querySelectorAll('.object');
    
    objects.forEach(function(element) {
        element.classList.remove("hide-evidence");
    }); 
}