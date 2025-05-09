let eventsList = [];

document.getElementById('add-event-btn').addEventListener('click', function() {
    addNewDefaultEvent();
    updateEvidenceControlsForNewEvent();

    updateProbabilityInputs();
    stateHasChanged();
});

function addNewDefaultEvent(id=null) {
    let numbers = eventsList.map(e => parseInt(e.split("-")[1])).sort((a, b) => a - b);
    
    let n = 1;
    if(id == null){
        for (let num of numbers) {
            if (num !== n) break;
            n++;
        }
    }
    else{
        n = id
    }

    const eventBase = `event-${n}`;
    eventsList.push(eventBase);

    const parent = document.getElementById("events-container");
    
    const addEventBtn = document.getElementById("add-event-btn");

    rgba = getRandomColor();

    document.documentElement.style.setProperty(`--${eventBase}-color`, rgba);

    const eventLabel = `Event ${n}`;

    const eventContainer = document.createElement("div");

    // eventContainer.addEventListener('mouseenter', function(){
    //     focusClass(`${eventBase}-object`);
    // });
    // eventContainer.addEventListener('mouseleave', function(){
    //     focusAllObjects();
    // });


    eventContainer.classList.add("sub-control-container");
    eventContainer.id = `${eventBase}-container`;

    const labelContainer = document.createElement("div");

    const labelElement = document.createElement("h2");
    labelElement.id = `${eventBase}-label`;
    labelElement.textContent = eventLabel;
    

    const probabilityElement = document.createElement("div");
    probabilityElement.style.marginTop = "9px";
    probabilityElement.style.marginBottom = "-15px";
    probabilityElement.style.color = "#AAA";
    probabilityElement.style.padding = '0';
    probabilityElement.style.display = "flex";
    probabilityElement.style.width = "100%";
    probabilityElement.style.flexDirection = "column";  // Flex column layout for the main div

    const probabilityText = document.createElement("span");
    probabilityText.id = `${eventBase}-prior-probability-text`;
    probabilityElement.appendChild(probabilityText);
    const inputContainer = document.createElement("div");
    inputContainer.style.display = "flex";
    inputContainer.style.flexDirection = "row";
    inputContainer.style.alignItems = "center";
    inputContainer.style.columnGap = '10px';

    const slider = document.createElement("input");
    slider.classList.add('probability-slider');
    slider.type = "range";
    slider.min = 0;
    slider.max = parseInt(document.getElementById('input-num-objects').value);
    slider.step = 1;
    slider.value = 0;
    slider.id = `${eventBase}-prior-probability-slider`;
    slider.style.maxWidth = "none";
    slider.style.flex = '1';
    slider.style.accentColor = `var(--${eventBase}-color)`;

    
    const numberInput = document.createElement("input");
    numberInput.type = "number";
    numberInput.min = 0;
    numberInput.max = parseInt(document.getElementById('input-num-objects').value);
    numberInput.step = 1;
    numberInput.value = 0;

    numberInput.id = `${eventBase}-prior-probability-input`;
    numberInput.style.backgroundColor = 'var(--dark-grey-2)';
    numberInput.style.width = "50px";
    numberInput.style.boxSizing = "border-box";  
    numberInput.style.padding = '4px';

    const fractionText = document.createElement("span");
    fractionText.id = `${eventBase}-pior-probability-fraction-text`;
    fractionText.innerText = ` / x`;

    inputContainer.appendChild(slider);
    inputContainer.appendChild(numberInput);
    inputContainer.appendChild(fractionText);
    probabilityElement.appendChild(inputContainer);

    slider.addEventListener("input", () => {
        numberInput.value = slider.value;
        probabilityAdjusted();
        stateHasChanged();
    });

    let lastValue = 0;

    function handleFinalNumberInput() {
        if (numberInput.value !== lastValue) {
            lastValue = numberInput.value;
            slider.value = numberInput.value;
            probabilityAdjusted();
            stateHasChanged();
        }
    }
    numberInput.addEventListener("mousedown", (e) => {
        setTimeout(() => {
            if (document.activeElement === numberInput && numberInput.selectionStart === numberInput.selectionEnd) {
                numberInput.select();
            }
        }, 0);
    });
    
    numberInput.addEventListener("input", (e) => {
        // spinner
        if (document.activeElement === numberInput && e.inputType === undefined) {
            handleFinalNumberInput();
            numberInput.blur();

        }
    });
    
    numberInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleFinalNumberInput();
            numberInput.blur();
        }
    });
    
    numberInput.addEventListener("blur", () => {
        handleFinalNumberInput();
    });

    function probabilityAdjusted(){
        const adjustedNumEvents = numberInput.value;
        const currentNumEvents = document.querySelectorAll(`.object.${eventBase}-object`).length;
        const totalObjects = document.getElementById('input-num-objects').value;
        const startIndex = eventsList.indexOf(eventBase);

        if(adjustedNumEvents < currentNumEvents){
            const diff = currentNumEvents - adjustedNumEvents;
            for(let i = 0; i < diff; i++){
                let eventToIncrease = null;
                for(let j = 1; j < eventsList.length+1; j++){
                   const nextEvent = eventsList[(startIndex + j) % eventsList.length];
                   const val = parseInt(document.getElementById(`${nextEvent}-prior-probability-slider`).value);
                   if(val < totalObjects){
                    console.log(`${nextEvent} ok`);
                    eventToIncrease = nextEvent;
                    break;
                   }
                }
                const slider = document.getElementById(`${eventToIncrease}-prior-probability-slider`)
                slider.value = parseInt(slider.value) + 1;
                const input = document.getElementById(`${eventToIncrease}-prior-probability-input`)
                input.value = parseInt(input.value) + 1;
            }
        }
        else if(adjustedNumEvents > currentNumEvents){
            const diff = adjustedNumEvents - currentNumEvents;
            for(let i = 0; i < diff; i++){
                let eventToDecrease = null;
                for(let j = 1; j < eventsList.length+1; j++){
                   const nextEvent = eventsList[(startIndex + j) % eventsList.length];
                   const val = parseInt(document.getElementById(`${nextEvent}-prior-probability-slider`).value);
                   if(val > 0){
                    eventToDecrease = nextEvent;
                    console.log(`${nextEvent} ok`);
                    break;
                   }
                }
                const slider = document.getElementById(`${eventToDecrease}-prior-probability-slider`)
                slider.value = parseInt(slider.value) - 1;
                const input = document.getElementById(`${eventToDecrease}-prior-probability-input`)
                input.value = parseInt(input.value) - 1;
            }
        }
        updateGridFromEventInputs();
        updateProbabilityInputs();

    }
    
    

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add('event-button-container');
    buttonContainer.style.display = "flex";  
    buttonContainer.style.alignItems = "center"; 
    buttonContainer.style.gap = "6px";      
    // buttonContainer.style.marginTop = '-10px';
    // buttonContainer.style.marginBottom = '-1px';  
    // buttonContainer.style.justifyContent = 'space-between';


    const renameBtn = document.createElement("button");
    renameBtn.classList.add("btn-mini-expand");
    renameBtn.id = `rename-${eventBase}-btn`;
    // renameBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
    renameBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Rename`;
    renameBtn.onclick = function() {renameLabel(`${eventBase}`);};

    const selectBtn = document.createElement("button");
    selectBtn.classList.add("btn-mini-expand");
    selectBtn.id = `make-selection-${eventBase}-btn`;
    // selectBtn.innerHTML = `<i class="fa-solid fa-hand-pointer"></i>`;
    selectBtn.innerHTML = `<i class="fa-solid fa-hand-pointer"></i> Select`;
    // selectBtn.style.backgroundColor = `var(--${eventBase}-color)`;
    // selectBtn.style.color = `var(--dark-grey-1)`;
    selectBtn.onclick = function() {enterSelectionMode(eventBase);};

    const customiseBtn = document.createElement("button");
    customiseBtn.classList.add("btn-mini-expand");
    customiseBtn.id = `customise-${eventBase}-btn`;
    // customiseBtn.innerHTML = `<i class="fa-solid fa-palette"></i>`;
    customiseBtn.innerHTML = `<i class="fa-solid fa-palette"></i> Customise`;
    // customiseBtn.style.color = `var(--${eventBase}-color)`;
    customiseBtn.onclick = function() {customiseEvent(eventBase);};
    
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn-mini-expand");
    deleteBtn.id = `delete-${eventBase}-btn`;
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete`;
    // deleteBtn.style.backgroundColor = 'transparent';
    // deleteBtn.style.color = `white`;
    // deleteBtn.style.fontSize = '16px';
    // deleteBtn.style.marginLeft = "auto";
    deleteBtn.onclick = function() {
        deleteEvent(eventBase);
        updateEvidenceControlsForNewEvent();
        stateHasChanged();
    };

    document.documentElement.style.setProperty(`--${eventBase}-object-color`, rgba);
    document.documentElement.style.setProperty(`--${eventBase}-object-radius`, '50%');
    document.documentElement.style.setProperty(`--${eventBase}-object-image`, "");
    document.documentElement.style.setProperty(`--${eventBase}-object-image-size`, '50%');

    const style = document.createElement("style");
    style.innerHTML = `
        .${eventBase}-object {
            background-color: var(--${eventBase}-object-color);
            border-radius: var(--${eventBase}-object-radius);
            background-image: var(--${eventBase}-object-image);
            background-size: var(--${eventBase}-object-image-size); 
            background-position: center;
            background-repeat: no-repeat;
        }
    `;

    document.head.appendChild(style);

    labelContainer.appendChild(labelElement);
    eventContainer.appendChild(labelContainer);
    eventContainer.appendChild(probabilityElement);
    buttonContainer.appendChild(renameBtn);
    buttonContainer.appendChild(customiseBtn);
    buttonContainer.appendChild(selectBtn);
    buttonContainer.appendChild(deleteBtn);
    eventContainer.appendChild(buttonContainer);

    parent.insertBefore(eventContainer, addEventBtn);
    // updateProbabilityLabels();


}

function deleteEvent(eventBase){
    eventsList = eventsList.filter(str => str !== eventBase);

    document.getElementById(`${eventBase}-container`).remove();

    document.querySelectorAll('.object').forEach(el => {
        const targetClass = `${eventBase}-object`;
        if (el.classList.contains(targetClass)) {
            el.classList.remove(targetClass);
            const randEvent = eventsList[Math.floor(Math.random() * eventsList.length)];
            el.classList.add(`${randEvent}-object`);
        }
    });
    // updateProbabilityLabels();

    if(eventsList.length == 0){
        document.getElementById('input-num-objects').value = 0;
        // document.getElementById('input-num-objects-2').value = 0;
        drawObjects();
    }
    updateProbabilityInputs();
}

function deleteAllEvents(){
    while(eventsList.length > 0){
        deleteEvent(eventsList[0]);
    }

}

function getRandomColor(intensity = 175, opacity=1) {
    let r, g, b;
    
    r = Math.floor(Math.random() * (intensity + 50));
    g = Math.floor(Math.random() * (intensity + 50));
    b = Math.floor(Math.random() * (intensity + 50));

    // make sure that the average of r, g, b is around 150 by adjusting the values accordingly
    const average = (r + g + b) / 3;
    const correctionFactor = intensity / average;

    r = Math.floor(r * correctionFactor);
    g = Math.floor(g * correctionFactor);
    b = Math.floor(b * correctionFactor);

    r = Math.min(r, 255);
    g = Math.min(g, 255);
    b = Math.min(b, 255);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
