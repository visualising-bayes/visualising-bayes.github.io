
const objectsGrid = document.getElementById("example-objects-grid");
const origin = document.getElementById("origin");
var stage = 1;
var assignedDisease = false;
const totalStages = 15;
const numExampleObjects = 64;
let focusedObject = null;
let completed = false;


document.getElementById('example-progress-number').innerText = `Progress: ${stage}/${totalStages}`;


window.onload = async function () {
    drawExampleGrid();
    updateStage(stage);
}


function drawExampleGrid(){
    objectsGrid.innerHTML = '';

    let gridSize = Math.ceil(Math.sqrt(numExampleObjects));
    var gap = objectsGrid.style.gap;
    gap = 0;
    const objectSize = 70;
    const gapSize = 15;
    const borderWidth = 7;
    
    objectsGrid.style.gridTemplateColumns = `repeat(${gridSize}, ${objectSize}px)`;
    objectsGrid.style.gridTemplateRows = `repeat(${gridSize}, ${objectSize}px)`;

    const gridWidth = gridSize * (objectSize + gapSize) - 0;
    const gridHeight = gridWidth;

    objectsGrid.style.width = `${gridWidth}px`;
    objectsGrid.style.height = `${gridHeight}px`;
    objectsGrid.style.gap = `${gapSize}px`;

    for (let i = 0; i < numExampleObjects; i++) {
        const newObject = document.createElement('div');
        newObject.classList.add('object');
        newObject.classList.add(`no-disease`);

        newObject.style.width = `${objectSize}px`;
        newObject.style.height = `${objectSize}px`;

        newObject.style.pointerEvents = 'none';

        newObject.addEventListener('click', function(){
            if(newObject.classList.contains('positive-test')){
                stage = 16;
                updateStage(stage);
            }
            else{
                stage = 10;
                updateStage(stage);
            }
            newObject.classList.remove('hide-evidence');
            focusedObject = newObject;
            // disableObjectSelection();
            
        });

        objectsGrid.appendChild(newObject);
    }

}

document.getElementById('next-stage').addEventListener('click', function(){
    if(stage==6){
        stage = 99;
    }
    else if(stage==99){
        stage = 7;
    }
    else{
        stage += 1;
    }
    updateStage(stage);

    
})

document.getElementById('previous-stage').addEventListener('click', function(){
    if(stage == 16){
        stage = 9;
    }
    else if(stage==7){
        stage=99;
    }
    else if(stage==99){
        stage=6;
    }
    else{
        stage -= 1;
    }
    updateStage(stage);
})

function updateStage(n){
    console.log(`stage: ${n}`);
    showStageElements(n);
    let displayStage = n;
    if(n == 99){
        displayStage = 6;
    }
    else if(n > 15){
        displayStage -= 6;
    }
    document.getElementById('example-progress-number').innerText = `Progress: ${displayStage}/${totalStages}`;
    document.getElementById('progress-bar-fill').style.width = `${100*displayStage/totalStages}%`
    switch(n){
        case 1:
            assignedDisease = false;
            unassignDisease();
            disableBackButton();
            break;
        case 2:
            if(assignedDisease == false){
                unassignDisease();
                assignDisease();
                assignedDisease=true;
            }
            enableBackButton();
            unassignTestResults();
            break;
        case 3:
            assignTestResults();
            clearFocus();
            break;
        case 4:
            focusObjectsWithClass('disease');
            break;
        case 5:
            focusObjectsWithClass('no-disease');
            break;
        case 6:
            clearFocus();
            
            break;
        case 8:
            enableNextButton();
            disableObjectSelection();
            showEventsAndEvidence();
            break;
        case 9:
            disableNextButton();
            hideEventsAndEvidence();
            enableObjectSelection();
            resetAnswers();
            break;
        case 10:
            enableNextButton();
            disableObjectSelection();
            break;
        case 12:
            enableNextButton();
            break;
        case 13:
            disableNextButton();
            if(submitPNegAnswer.innerHTML == '✅ Correct'){
                enableNextButton();
                clearFocus();

                // showEvidence();
            }
            break;
        case 14:
            disableNextButton();
            if(submitBayesNegAnswer.innerHTML == '✅ Correct'){
                enableNextButton();
                // showEventsAndEvidence();
                focusObjectsWithClass('negative-test');
            }
            break;
        case 15:
            clearFocus();
            completed=true;
            disableNextButton();
            break;
        case 16:
            enableNextButton();
            disableObjectSelection();
            break;
        case 18:
            enableNextButton();
            break;
        case 19:
            disableNextButton();
            if(submitPPosAnswer.innerHTML == '✅ Correct'){
                enableNextButton();
                clearFocus();

                // showEvidence();
            }
            break;
        case 20:
            disableNextButton();
            if(submitBayesPosAnswer.innerHTML == '✅ Correct'){
                enableNextButton();
                // showEventsAndEvidence();
                focusObjectsWithClass('negative-test');
            }
            break;
        case 21:
            clearFocus();
            showEventsAndEvidence();
            completed=true;
            disableNextButton();
            break;
    }
    doTheNumbers();
}

function showStageElements(n) {
    // Hide all elements that match class name like "stage-1", "stage-2", etc.
    const allStageElements = document.querySelectorAll('[class^="stage-"]');
    allStageElements.forEach(el => {
        el.style.display = 'none';
    });

    // Show only elements with the specific class "stage-n"
    const currentStageElements = document.querySelectorAll(`.stage-${n}`);
    currentStageElements.forEach(el => {
        if(el.classList.contains('example-formulae') ||el.classList.contains('example-bayes-formula') || el.classList.contains('input-answer-container') || el.id == 'example-key'){
            el.style.display = 'flex';
        }
        else{
            el.style.display = 'block';

        }
    });
}

function assignDisease(min = 8, max = 16) {
    // Select all elements with class 'no-disease'
    const healthy = Array.from(document.querySelectorAll('.no-disease'));

    // Clamp max to avoid exceeding available healthy individuals
    const safeMax = Math.min(max, healthy.length);

    // Calculate a random number between min and safeMax
    const numToInfect = Math.floor(Math.random() * (safeMax - min + 1)) + min;

    // Shuffle and pick the first N
    const shuffled = healthy.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numToInfect);

    // Update classes
    selected.forEach(el => {
        el.classList.remove('no-disease');
        el.classList.add('disease');
    });
}

function unassignDisease() {
    const infected = document.querySelectorAll('.disease');
    infected.forEach(el => {
        el.classList.remove('disease');
        el.classList.add('no-disease');
    });
}

function assignTestResults() {
    const objects = document.querySelectorAll('.object');
    const diseased = [];
    const healthy = [];

    // Separate into diseased and healthy
    objects.forEach(el => {
        if (el.classList.contains('disease')) {
            diseased.push(el);
        } else if (el.classList.contains('no-disease')) {
            healthy.push(el);
        }
    });

    // Randomly pick probabilities
    const diseasePositiveProb = Math.random() * 0.4 + 0.6; // Between 0.6 and 1
    const healthyNegativeProb = Math.random() * 0.2 + 0.8; // Between 0.8 and 1

    // Assign to diseased
    let guaranteedNegative = false;
    diseased.forEach((el, index) => {
        const rand = Math.random();
        if (rand < diseasePositiveProb) {
            el.classList.add('positive-test');
        } else {
            el.classList.add('negative-test');
            guaranteedNegative = true;
        }
    });

    // Ensure at least one diseased person is a false negative
    if (!guaranteedNegative && diseased.length > 0) {
        const randomIndex = Math.floor(Math.random() * diseased.length);
        diseased[randomIndex].classList.remove('positive-test');
        diseased[randomIndex].classList.add('negative-test');
    }

    // Assign to healthy
    let falsePositives = 0;
    healthy.forEach((el, index) => {
        const rand = Math.random();
        if (rand < healthyNegativeProb) {
            el.classList.add('negative-test');
        } else {
            el.classList.add('positive-test');
            falsePositives++;
        }
    });

    // Ensure at least two false positives among healthy
    if (falsePositives < 2 && healthy.length >= 2) {
        // Find candidates to flip
        const negatives = healthy.filter(el => el.classList.contains('negative-test'));
        const needed = 2 - falsePositives;
        for (let i = 0; i < needed && i < negatives.length; i++) {
            negatives[i].classList.remove('negative-test');
            negatives[i].classList.add('positive-test');
        }
    }

}


function unassignTestResults() {
    const objects = document.querySelectorAll('.object');
    objects.forEach(el => {
        el.classList.remove('positive-test', 'negative-test');
    });
}

function focusObjectsWithClass(cls) {
    const objects = document.querySelectorAll('.object');
    objects.forEach(el => {
        if (!el.classList.contains(cls)) {
            el.style.opacity = '0.2';
        } else {
            el.style.opacity = '1';
        }
    });
}

function focusObjectsWithClasses(cls1, cls2) {
    const objects = document.querySelectorAll('.object');
    objects.forEach(el => {
        if (!(el.classList.contains(cls1) && el.classList.contains(cls2))) {
            el.style.opacity = '0.2';
        } else {
            el.style.opacity = '1';
        }
    });
}

function clearFocus() {
    document.querySelectorAll('.object').forEach(el => {
        el.style.opacity = '1';

    });
}


function disableNextButton(){
    document.getElementById('next-stage').style.pointerEvents = 'none';
    document.getElementById('next-stage').style.opacity = '0.5';
}

function enableNextButton(){
    document.getElementById('next-stage').style.pointerEvents = 'all';
    document.getElementById('next-stage').style.opacity = '1';
}

function disableBackButton(){
    document.getElementById('previous-stage').style.pointerEvents = 'none';
    document.getElementById('previous-stage').style.opacity = '0.5';
}

function enableBackButton(){
    document.getElementById('previous-stage').style.pointerEvents = 'all';
    document.getElementById('previous-stage').style.opacity = '1';
}

function hideEventsAndEvidence(){
    document.querySelectorAll('.object').forEach(el => {
        el.classList.add('hide-event');
        el.classList.add('hide-evidence');

    });
}

function showEvidence(){
    document.querySelectorAll('.object').forEach(el => {
        el.classList.remove('hide-evidence');

    });
}

function hideEvidence(){
    document.querySelectorAll('.object').forEach(el => {
        el.classList.add('hide-evidence');

    });
}

function showEvents(){
    document.querySelectorAll('.object').forEach(el => {
        el.classList.remove('hide-event');

    });
}

function hideEvents(){
    document.querySelectorAll('.object').forEach(el => {
        el.classList.add('hide-event');

    });
}

function showEventsAndEvidence(){
    document.querySelectorAll('.object').forEach(el => {
        el.classList.remove('hide-event');
        el.classList.remove('hide-evidence');

    });
}

function enableObjectSelection(){
    document.querySelectorAll('.object').forEach(el => {
        el.style.cursor = 'pointer';
        el.style.pointerEvents = 'all';
        el.classList.add('hover-highlight');
    });
}

function disableObjectSelection(){
    document.querySelectorAll('.object').forEach(el => {
        el.style.cursor = 'default';
        el.style.pointerEvents = 'none';
        el.classList.remove('hover-highlight');

    });
}

// function testingEffect(el, isPositive) {
//     let count = 0;
//     const maxToggles = 6; // total flickers (even number so it ends on the right class)
//     const toggleInterval = 100; // ms

//     const toggle = setInterval(() => {
//         el.classList.toggle('positive-test');
//         el.classList.toggle('negative-test');
//         count++;

//         if (count >= maxToggles) {
//             clearInterval(toggle);

//             // Settle on the final state
//             el.classList.remove('positive-test', 'negative-test');
//             el.classList.add(isPositive ? 'positive-test' : 'negative-test');
//         }
//     }, toggleInterval);
// }


document.getElementById('hint-btn-p-negative').addEventListener('click', giveHint);

document.getElementById('hint-btn-p-positive').addEventListener('click', giveHint);

function giveHint(){
    hint = "Pssstt.🤫\n\n";
    hint += "P(Disease) + P(No Disease) = 1\n";
    hint += 'P( - | Disease) + P( + | Disease) = 1\n';
    hint += 'P( - | No Disease) + P( + | No Disease) = 1';
    window.alert(hint);
}

function doTheNumbers() {

    document.querySelectorAll('.total-num').forEach(el => {
        el.innerText = numExampleObjects;
    });

    document.querySelectorAll('.num-disease').forEach(el => {
        el.innerText = document.querySelectorAll('.object.disease').length;
    });

    document.querySelectorAll('.num-no-disease').forEach(el =>{
        el.innerText = document.querySelectorAll('.object.no-disease').length;
    });

    document.querySelectorAll('.num-positive').forEach(el =>{
        el.innerText = document.querySelectorAll('.object.positive-test').length;
    });

    document.querySelectorAll('.num-negative').forEach(el =>{
        el.innerText = document.querySelectorAll('.object.negative-test').length;
    });

    document.querySelectorAll('.num-true-pos').forEach(el => {
        el.innerText = document.querySelectorAll('.object.disease.positive-test').length;
    });

    document.querySelectorAll('.num-false-pos').forEach(el => {
        el.innerText = document.querySelectorAll('.object.no-disease.positive-test').length;

    });

    document.querySelectorAll('.num-true-neg').forEach(el => {
        el.innerText = document.querySelectorAll('.object.no-disease.negative-test').length;
    });

    document.querySelectorAll('.num-false-neg').forEach(el => {
        el.innerText = document.querySelectorAll('.object.disease.negative-test').length;
    });
}

const submitPNegAnswer = document.getElementById('submit-p-negative-answer');
submitPNegAnswer.addEventListener('click', function () {
    const trueAnswer = document.querySelectorAll('.object.negative-test').length / document.querySelectorAll('.object').length;
    const userInput = document.getElementById('p-negative-input').value.trim();
    checkAnswer(userInput, trueAnswer, "p-negative-input", "submit-p-negative-answer", "p-negative-answer-container", true, false);
});

const submitBayesNegAnswer = document.getElementById('submit-bayes-negative-answer');
submitBayesNegAnswer.addEventListener('click', function () {
    const trueAnswer = document.querySelectorAll('.object.no-disease.negative-test').length / document.querySelectorAll('.object.negative-test').length;
    const userInput = document.getElementById('bayes-negative-input').value.trim();
    checkAnswer(userInput, trueAnswer, "bayes-negative-input", "submit-bayes-negative-answer", "bayes-negative-answer-container", true, true, 'negative-test');    
});

const submitPPosAnswer = document.getElementById('submit-p-positive-answer');
submitPPosAnswer.addEventListener('click', function () {
    const trueAnswer = document.querySelectorAll('.object.positive-test').length / document.querySelectorAll('.object').length;
    const userInput = document.getElementById('p-positive-input').value.trim();
    checkAnswer(userInput, trueAnswer, "p-positive-input", "submit-p-positive-answer", "p-positive-answer-container", true, false);
});

const submitBayesPosAnswer = document.getElementById('submit-bayes-positive-answer');
submitBayesPosAnswer.addEventListener('click', function () {
    const trueAnswer = document.querySelectorAll('.object.disease.positive-test').length / document.querySelectorAll('.object.positive-test').length;
    const userInput = document.getElementById('bayes-positive-input').value.trim();
    checkAnswer(userInput, trueAnswer, "bayes-positive-input", "submit-bayes-positive-answer", "bayes-positive-answer-container", true, true, 'positive-test');    
});

function checkAnswer(userAnswer, trueAnswer, inputId, buttonId, containerId, doShowEvidence, doShowEvents, focusClass){
    if (!/^\d+([./]\d+)?$/.test(userAnswer)) {
        alert('Invalid format. Please enter a number with at most one decimal point or slash.');
        return;
    }

    let userValue;

    if (userAnswer.includes('/')) {
        const [numerator, denominator] = userAnswer.split('/').map(Number);
        if (!denominator || isNaN(numerator) || isNaN(denominator)) {
            alert('Invalid fraction. Please make sure both numerator and denominator are valid numbers.');
            return;
        }
        userValue = numerator / denominator;
    } else {
        userValue = parseFloat(userAnswer);
        if (isNaN(userValue)) {
            alert('Invalid decimal number.');
            return;
        }
    }

    const roundedUser = parseFloat(userValue.toFixed(2));
    const roundedTrue = parseFloat(trueAnswer.toFixed(2));

    const inputEl = document.getElementById(inputId);
    const buttonEl = document.getElementById(buttonId);
    const containerEl = document.getElementById(containerId);

    if (roundedUser === roundedTrue) {
        inputEl.style.pointerEvents = 'none';
        buttonEl.style.pointerEvents = 'none';
        buttonEl.style.backgroundColor = 'transparent';
        buttonEl.style.color = 'rgb(78, 182, 99)';
        buttonEl.innerHTML = '✅ Correct'
        containerEl.style.border = 'solid 1px rgb(78, 182, 99)';
        enableNextButton();
        // showEventsAndEvidence();
        if(doShowEvidence){
            showEvidence();
        }
        if(doShowEvents){
            showEvents();
        }
        if(focusClass){
            focusObjectsWithClass(focusClass);
        }
        
    } else {
        // alert(`Incorrect. Your answer: ${roundedUser}, Correct answer: ${roundedTrue}`);
        alert(`Incorrect! Try Again.`);
    }
}


function resetAnswers(){
    document.getElementById('bayes-negative-input').style.pointerEvents = 'all';
    document.getElementById('bayes-negative-input').value = '';
    submitBayesNegAnswer.style.pointerEvents = 'all';
    submitBayesNegAnswer.style.backgroundColor = 'var(--control-blue)';
    submitBayesNegAnswer.style.color = 'white';
    submitBayesNegAnswer.innerHTML = 'Check'
    document.getElementById('bayes-negative-answer-container').style.border = 'none';

    document.getElementById('p-negative-input').style.pointerEvents = 'all';
    document.getElementById('p-negative-input').value = '';
    submitPNegAnswer.style.pointerEvents = 'all';
    submitPNegAnswer.style.backgroundColor = 'var(--control-blue)';
    submitPNegAnswer.style.color = 'white';
    submitPNegAnswer.innerHTML = 'Check'
    document.getElementById('p-negative-answer-container').style.border = 'none';
    
}

// For elements with the class 'hover-prior'
document.querySelectorAll('.hover-prior').forEach(element => {
    element.addEventListener('mouseenter', () => {
        showEventsAndEvidence();
        hideEvidence();
        // focusObjectsWithClass('')
    });

    element.addEventListener('mouseleave', () => {
        if(completed){
            showEventsAndEvidence();
        }
        else{
            hideEventsAndEvidence();
            focusedObject.classList.remove('hide-evidence');
        }
        
    });
});

// For elements with the class 'hover-sensitivity'
document.querySelectorAll('.hover-sensitivity').forEach(element => {
    element.addEventListener('mouseenter', () => {
        showEventsAndEvidence();
        // hideEvidence();
        focusObjectsWithClass('disease');
    });

    element.addEventListener('mouseleave', () => {
        if(completed){
            clearFocus();
        }
        else if(stage == 99){
            clearFocus();
        }
        else{
            hideEventsAndEvidence();
            clearFocus();
            focusedObject.classList.remove('hide-evidence');
        }
        
    });
});

document.querySelectorAll('.hover-posterior').forEach(element => {
    element.addEventListener('mouseenter', () => {
        showEventsAndEvidence();
        // hideEvidence();
        focusObjectsWithClass('positive-test');
    });

    element.addEventListener('mouseleave', () => {
        if(completed){
            clearFocus();
        }
        else if(stage == 99){
            clearFocus();
        }
        else{
            hideEventsAndEvidence();
            clearFocus();
            focusedObject.classList.remove('hide-evidence');
        }
        
    });
});

// For elements with the class 'hover-specificity'
document.querySelectorAll('.hover-specificity').forEach(element => {
    element.addEventListener('mouseenter', () => {
        showEventsAndEvidence();
        // hideEvidence();
        focusObjectsWithClass('no-disease');
    });

    element.addEventListener('mouseleave', () => {
        if(completed){
            clearFocus();
        }
        else{
            hideEventsAndEvidence();
            clearFocus();
            focusedObject.classList.remove('hide-evidence');
        }
        
    });
});

document.querySelectorAll('.hover-marginal').forEach(element => {
    element.addEventListener('mouseenter', () => {
        hideEventsAndEvidence();
        showEvidence();
        // hideEvidence();
        // focusObjectsWithClass('no-disease');
    });

    element.addEventListener('mouseleave', () => {
        if(completed){
            showEventsAndEvidence();
        }
        else{
            hideEventsAndEvidence();
            clearFocus();
            focusedObject.classList.remove('hide-evidence');
        }
        
    });
});
document.querySelectorAll

document.getElementById('reveal-btn-p-negative').addEventListener('click', ()=>{
    const neg = document.querySelectorAll('.object.negative-test').length;
    const all = document.querySelectorAll('.object').length;
    const answer = `${neg}/${all}`;
    document.getElementById('p-negative-input').value = answer;
    document.getElementById('submit-p-negative-answer').click();
});

document.getElementById('reveal-btn-p-positive').addEventListener('click', ()=>{
    const pos = document.querySelectorAll('.object.positive-test').length;
    const all = document.querySelectorAll('.object').length;
    const answer = `${pos}/${all}`;
    document.getElementById('p-positive-input').value = answer;
    document.getElementById('submit-p-positive-answer').click();
});

document.getElementById('reveal-btn-bayes-positive').addEventListener('click', ()=>{
    const dis = document.querySelectorAll('.object.disease.positive-test').length;
    const all = document.querySelectorAll('.object.positive-test').length;
    const answer = `${dis}/${all}`;
    document.getElementById('bayes-positive-input').value = answer;
    document.getElementById('submit-bayes-positive-answer').click();
});

document.getElementById('reveal-btn-bayes-negative').addEventListener('click', ()=>{
    const noDis = document.querySelectorAll('.object.no-disease.negative-test').length;
    const all = document.querySelectorAll('.object.negative-test').length;
    const answer = `${noDis}/${all}`;
    document.getElementById('bayes-negative-input').value = answer;
    document.getElementById('submit-bayes-negative-answer').click();
});