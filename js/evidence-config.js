let evidenceList = [];


document.getElementById('add-evidence-btn').addEventListener('click', function() {
    addNewDefaultEvidence();
    updateProbabilityInputs();
    stateHasChanged();
});

function addNewDefaultEvidence(id=null) {
    let numbers = evidenceList.map(e => parseInt(e.split("-")[1])).sort((a, b) => a - b);
    
    // find the smallest missing number
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

    const evidenceBase = `evidence-${n}`;
    evidenceList.push(evidenceBase);

    const parent = document.getElementById("evidence-container");
    const addEvidenceBtn = document.getElementById("add-evidence-btn");
    color = getRandomColor();

    document.documentElement.style.setProperty(`--${evidenceBase}-color`, color);
    document.documentElement.style.setProperty(`--${evidenceBase}-object-color`, color);
    document.documentElement.style.setProperty(`--${evidenceBase}-object-border-size`, '6px');
    document.documentElement.style.setProperty(`--${evidenceBase}-object-text`, '');
    document.documentElement.style.setProperty(`--${evidenceBase}-object-font-size`, '40px');
    document.documentElement.style.setProperty(`--${evidenceBase}-object-font-weight`, 'normal');
    
    const evidenceLabel =`Evidence ${n}`;

    const evidenceContainer = document.createElement("div");
    evidenceContainer.classList.add("sub-control-container");
    evidenceContainer.id = `${evidenceBase}-container`;

    const labelContainer = document.createElement("div");

    const labelElement = document.createElement("h2");
    labelElement.id = `${evidenceBase}-label`;
    labelElement.textContent = evidenceLabel;

    /// SLIDERERRERERESSS ///////////////////////////////////////////////////////


    const probabilityElement = document.createElement("div");
    probabilityElement.id = `${evidenceBase}-probability-controls-container`;
    probabilityElement.style.marginTop = "9px";
    probabilityElement.style.marginBottom = "-15px";
    probabilityElement.style.color = "#AAA";
    probabilityElement.style.display = "flex";
    probabilityElement.style.width = "100%";
    probabilityElement.style.flexDirection = "column";  // Flex column layout for the main div

    for(let e = 0; e < eventsList.length; e++){
        const eventBase = eventsList[e];

        const probabilityText = document.createElement("span");
        probabilityText.id = `${evidenceBase}-text-for-${eventBase}`;
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
        slider.id = `${evidenceBase}-slider-for-${eventBase}`;
        slider.style.maxWidth = "none";
        slider.style.flex = '1';
        slider.style.accentColor = `var(--${evidenceBase}-color)`;

        slider.addEventListener('mouseenter', ()=>{
            focusClass(`${eventBase}-object`);
        });
        slider.addEventListener('mouseleave', focusAllObjects);

        const numberInput = document.createElement("input");
        numberInput.type = "number";
        numberInput.min = 0;
        numberInput.max = parseInt(document.getElementById('input-num-objects').value);
        numberInput.step = 1;
        numberInput.value = 0;

        numberInput.id = `${evidenceBase}-input-for-${eventBase}`;
        numberInput.style.backgroundColor = 'var(--dark-grey-2)';
        numberInput.style.width = "50px";
        numberInput.style.boxSizing = "border-box";  
        numberInput.style.padding = '4px';

        const fractionText = document.createElement("span");
        fractionText.id = `${evidenceBase}-fraction-text-for-${eventBase}`;
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

        numberInput.addEventListener("input", () => {
            const total = numberInput.max;
            if(parseInt(numberInput.value) > parseInt(total)){
                numberInput.value = total;
            }
            slider.value = numberInput.value;
            probabilityAdjusted();
            stateHasChanged();
        });
        numberInput.addEventListener("mousedown", (e) => {
            setTimeout(() => {
                if (document.activeElement === numberInput && numberInput.selectionStart === numberInput.selectionEnd) {
                    numberInput.select();
                }
            }, 0);
        });

        function probabilityAdjusted(){
            const adjustedNumEvidence = numberInput.value;
            const currentNumEvidence = document.querySelectorAll(`.object.${eventBase}-object.${evidenceBase}-object`).length;
            const totalObjects = document.querySelectorAll(`.object.${eventBase}-object`).length;
            console.log(`numEv: ${currentNumEvidence}, adj: ${adjustedNumEvidence}, total: ${totalObjects}`);
            const startIndex = evidenceList.indexOf(evidenceBase);

            if(adjustedNumEvidence < currentNumEvidence){
                const diff = currentNumEvidence - adjustedNumEvidence;
                for(let i = 0; i < diff; i++){
                    let evidenceToIncrease = null;
                    for(let j = 1; j < eventsList.length+1; j++){
                    const nextEvidence = evidenceList[(startIndex + j) % evidenceList.length];
                        // console.log(`checking: ${nextEvidence}`);
                        const val = parseInt(document.getElementById(`${nextEvidence}-slider-for-${eventBase}`).value);
                        if(val < totalObjects){
                            console.log(`${nextEvidence} ok`);
                            evidenceToIncrease = nextEvidence;
                            break;
                        }
                    }
                    const current = document.querySelectorAll(`.object.${eventBase}-object.${evidenceBase}-object`);
                    const randomElement = current[Math.floor(Math.random() * current.length)];
                    swapEvidenceTo(randomElement, `${evidenceToIncrease}-object`);
                }
            }
            else if(adjustedNumEvidence > currentNumEvidence){
                const diff = adjustedNumEvidence - currentNumEvidence;
                for(let i = 0; i < diff; i++){
                    let evidenceToDecrease = null;
                    for(let j = 1; j < evidenceList.length+1; j++){
                        const nextEvidence = evidenceList[(startIndex + j) % evidenceList.length];
                        // console.log(`checking: ${nextEvidence}`);
                        const val = parseInt(document.getElementById(`${nextEvidence}-slider-for-${eventBase}`).value);
                        if(val > 0){
                            evidenceToDecrease = nextEvidence;
                            console.log(`${nextEvidence} ok`);
                            break;
                        }
                    }
                    const toDecrease = document.querySelectorAll(`.object.${eventBase}-object.${evidenceToDecrease}-object`);
                    const randomElement = toDecrease[Math.floor(Math.random() * toDecrease.length)];
                    swapEvidenceTo(randomElement, `${evidenceBase}-object`);
                }
            }
            updateProbabilityInputs();

        }
    }


    /// SLIDSSERSSRRSSSSS //////////////////////////////////////////////////////

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add('event-button-container');
    buttonContainer.style.display = "flex";  
    buttonContainer.style.alignItems = "center"; 
    buttonContainer.style.gap = "6px";      
    buttonContainer.style.marginTop = '10px';

    const renameBtn = document.createElement("button");
    renameBtn.classList.add("btn-mini-expand");
    renameBtn.id = `rename-${evidenceBase}-btn`;
    renameBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Rename`;
    renameBtn.onclick = function() {renameLabel(`${evidenceBase}`);};

    const selectBtn = document.createElement("button");
    selectBtn.classList.add("btn-mini-expand");
    selectBtn.id = `make-selection-${evidenceBase}-btn`;
    selectBtn.innerHTML = `<i class="fa-solid fa-hand-pointer"></i> Select`;
    selectBtn.onclick = function() {enterSelectionMode(evidenceBase);};

    const customiseBtn = document.createElement("button");
    customiseBtn.classList.add("btn-mini-expand");
    customiseBtn.id = `customise-${evidenceBase}-btn`;
    customiseBtn.innerHTML = `<i class="fa-solid fa-palette"></i> Customise`;
    customiseBtn.onclick = function() {customiseEvidence(evidenceBase);};

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn-mini-expand");
    deleteBtn.id = `delete-${evidenceBase}-btn`;
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete`;
    // deleteBtn.style.backgroundColor = 'transparent';
    // deleteBtn.style.color = `grey`;
    // deleteBtn.style.fontSize = '16px';
    // deleteBtn.style.marginLeft = "auto";
    deleteBtn.onclick = function() {
        deleteEvidence(evidenceBase);
        updateProbabilityInputs();
        stateHasChanged();
    };

    const style = document.createElement("style");
    style.innerHTML = `
            .${evidenceBase}-object {
                border: solid;
                border-color: var(--${evidenceBase}-object-color);
                border-width: var(--${evidenceBase}-object-border-size);
                box-sizing: border-box;
                position: relative;
            }
            .${evidenceBase}-object::before{
                content: var(--${evidenceBase}-object-text);
                position: absolute;
                color: var(--${evidenceBase}-color);
                font-size: var(--${evidenceBase}-object-font-size); 
                font-weight: var(--${evidenceBase}-object-font-weight);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none; 
                transition: all ease .15s;
            }
        `;
    document.head.appendChild(style);

    labelContainer.appendChild(labelElement);
    evidenceContainer.appendChild(labelContainer);
    evidenceContainer.appendChild(probabilityElement);

    buttonContainer.appendChild(renameBtn);
    buttonContainer.appendChild(customiseBtn);
    buttonContainer.appendChild(selectBtn);
    buttonContainer.appendChild(deleteBtn);

    evidenceContainer.appendChild(buttonContainer);

    parent.insertBefore(evidenceContainer, addEvidenceBtn);
    updateProbabilityLabels();

    document.querySelectorAll('.object').forEach(element => {
        const hasValidClass = Array.from(element.classList).some(cls => 
            /^evidence-\d+-object$/.test(cls)
        );
        
        if (!hasValidClass) {
            element.classList.add(`${evidenceBase}-object`);
        }
    });

}

function deleteEvidence(evidenceBase){
    evidenceList = evidenceList.filter(str => str !== evidenceBase);

    document.getElementById(`${evidenceBase}-container`).remove();

    document.querySelectorAll('.object').forEach(el => {
        const targetClass = `${evidenceBase}-object`;
        if (el.classList.contains(targetClass)) {
            el.classList.remove(targetClass);
            const randEvent = evidenceList[Math.floor(Math.random() * evidenceList.length)];
            el.classList.add(`${randEvent}-object`);
        }
    });
    updateProbabilityLabels();

}

function deleteAllEvidence(){
    while(evidenceList.length > 0){
        deleteEvidence(evidenceList[0]);
    }

}

function updateEvidenceControlsForNewEvent(){
    console.log('updateEvidenceControlsForNewEvent()...')
    for(let i = 0; i < evidenceList.length; i++){
        const evidenceBase = evidenceList[i];
        const probabilityElement = document.getElementById(`${evidenceBase}-probability-controls-container`);
        probabilityElement.innerHTML = '';

        for(let e = 0; e < eventsList.length; e++){
            const eventBase = eventsList[e];

            const probabilityText = document.createElement("span");
            probabilityText.id = `${evidenceBase}-text-for-${eventBase}`;
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
            slider.id = `${evidenceBase}-slider-for-${eventBase}`;
            slider.style.maxWidth = "none";
            slider.style.flex = '1';
            slider.style.accentColor = `var(--${evidenceBase}-color)`;

            slider.addEventListener('mouseenter', ()=>{
                focusClass(`${eventBase}-object`);
            });
            slider.addEventListener('mouseleave', focusAllObjects);

            const numberInput = document.createElement("input");
            numberInput.type = "number";
            numberInput.min = 0;
            numberInput.max = parseInt(document.getElementById('input-num-objects').value);
            numberInput.step = 1;
            numberInput.value = 0;

            numberInput.id = `${evidenceBase}-input-for-${eventBase}`;
            numberInput.style.backgroundColor = 'var(--dark-grey-2)';
            numberInput.style.width = "50px";
            numberInput.style.boxSizing = "border-box";  
            numberInput.style.padding = '4px';

            const fractionText = document.createElement("span");
            fractionText.id = `${evidenceBase}-fraction-text-for-${eventBase}`;
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

            numberInput.addEventListener("input", () => {
                slider.value = numberInput.value;
                probabilityAdjusted();
                stateHasChanged();
            });

            function probabilityAdjusted(){
                const adjustedNumEvidence = numberInput.value;
                const currentNumEvidence = document.querySelectorAll(`.object.${eventBase}-object.${evidenceBase}-object`).length;
                const totalObjects = document.querySelectorAll(`.object.${eventBase}-object`).length;
                console.log(`numEv: ${currentNumEvidence}, adj: ${adjustedNumEvidence}, total: ${totalObjects}`);
                const startIndex = evidenceList.indexOf(evidenceBase);

                if(adjustedNumEvidence < currentNumEvidence){
                    const diff = currentNumEvidence - adjustedNumEvidence;
                    for(let i = 0; i < diff; i++){
                        let evidenceToIncrease = null;
                        for(let j = 1; j < eventsList.length+1; j++){
                        const nextEvidence = evidenceList[(startIndex + j) % evidenceList.length];
                            // console.log(`checking: ${nextEvidence}`);
                            const val = parseInt(document.getElementById(`${nextEvidence}-slider-for-${eventBase}`).value);
                            if(val < totalObjects){
                                console.log(`${nextEvidence} ok`);
                                evidenceToIncrease = nextEvidence;
                                break;
                            }
                        }
                        console.log(`LOOK HERE: ${evidenceToIncrease}-slider-for-${eventBase}`)
                        const slider = document.getElementById(`${evidenceToIncrease}-slider-for-${eventBase}`);
                        slider.value = parseInt(slider.value) + 1;
                        const input = document.getElementById(`${evidenceToIncrease}-input-for-${eventBase}`);
                        input.value = parseInt(input.value) + 1;
                    }
                }
                else if(adjustedNumEvidence > currentNumEvidence){
                    const diff = adjustedNumEvidence - currentNumEvidence;
                    for(let i = 0; i < diff; i++){
                        let evidenceToDecrease = null;
                        for(let j = 1; j < evidenceList.length+1; j++){
                            const nextEvidence = evidenceList[(startIndex + j) % evidenceList.length];
                            // console.log(`checking: ${nextEvidence}`);
                            const val = parseInt(document.getElementById(`${nextEvidence}-slider-for-${eventBase}`).value);
                            if(val > 0){
                                evidenceToDecrease = nextEvidence;
                                console.log(`${nextEvidence} ok`);
                                break;
                            }
                        }
                        const slider = document.getElementById(`${evidenceToDecrease}-slider-for-${eventBase}`);
                        slider.value = parseInt(slider.value) - 1;
                        const input = document.getElementById(`${evidenceToDecrease}-input-for-${eventBase}`);
                        input.value = parseInt(input.value) - 1;
                    }
                }
                updateGridFromEvidenceInputs();
                updateProbabilityInputs();

            }
        }
    }
}
