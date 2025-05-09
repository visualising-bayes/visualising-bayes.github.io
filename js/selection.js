let selectionMode = null;
let selectionBox = null;
let startX = 0;
let startY = 0;
let currentlySelectedObjects = new Set(); 

let selectionModePopup = document.getElementById('selection-mode-popup');
let navbar = document.getElementById('navbar');
let eventsControlContainer = document.getElementById('events-controls-container');
let evidenceControlContainer = document.getElementById('evidence-controls-container');
let selectionModeLabel = document.getElementById('selection-mode-label');

function enterSelectionMode(mode) {
    selectionMode = mode;
    graphicsContainer.style.cursor = 'crosshair';
    selectionModePopup.style.display = 'flex';

    const icon = selectionModePopup.querySelector('i');
    icon.style.color = getModeColour(mode);
    selectionModeLabel.innerHTML = getModeLabel(mode);
    selectionModeLabel.style.color = getModeColour(mode);

    const opac = '0.2';

    eventsControlContainer.style.opacity = opac;
    eventsControlContainer.style.pointerEvents = 'none';
    evidenceControlContainer.style.opacity = opac;
    evidenceControlContainer.style.pointerEvents = 'none';
    navbar.style.opacity = opac;
    navbar.style.pointerEvents = 'none';
    const key = document.getElementById('key');
    if(key){
        key.style.opacity = opac;
        key.style.pointerEvents = 'none';
    }
    document.getElementById('options-container').style.opacity = opac;
    document.getElementById('options-container').style.pointerEvents = 'none';
    if(document.getElementById('presets-menu')){
        document.getElementById('presets-menu').style.opacity = opac;
        document.getElementById('presets-menu').style.pointerEvents = 'none';
    }
    if(document.getElementById('tutorial-dialogue-container')){
        document.getElementById('tutorial-dialogue-container').style.pointerEvents = 'none';
    }
}

function exitSelectionMode(){
    graphicsContainer.style.cursor = 'grab';
    selectionMode = null;
    selectionModePopup.style.display = 'none';

    eventsControlContainer.style.opacity = .975;
    eventsControlContainer.style.pointerEvents = 'all';
    evidenceControlContainer.style.opacity = .975;
    evidenceControlContainer.style.pointerEvents = 'all';
    navbar.style.opacity = 1;
    navbar.style.pointerEvents = 'all';
    const key = document.getElementById('key');
    if(key){
        key.style.opacity = '0.975';
        key.style.pointerEvents = 'all';
    }
    document.getElementById('options-container').style.opacity = 1;
    document.getElementById('options-container').style.pointerEvents = 'all';
    if(document.getElementById('presets-menu')){
        document.getElementById('presets-menu').style.opacity = 1;
        document.getElementById('presets-menu').style.pointerEvents = 'all';
    }
    if(document.getElementById('tutorial-dialogue-container')){
        document.getElementById('tutorial-dialogue-container').style.pointerEvents = 'all';
    }

}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if(selectionMode){
            exitSelectionMode();
        }
    }
});


graphicsContainer.addEventListener('mousedown', (e) => {
    document.getElementById('selection-mode-popup').style.pointerEvents = 'none';
    if (selectionMode && e.button === 0) { 
        startX = e.clientX;
        startY = e.clientY;

        selectionBox = document.createElement('div');
        selectionBox.style.position = 'absolute';
        selectionBox.style.border = `2px dashed ${getModeColour(selectionMode)}`;
        selectionBox.style.backgroundColor = getModeColour(selectionMode, 0.2);
        selectionBox.style.zIndex = '100';
        graphicsContainer.appendChild(selectionBox);

        updateSelectionBox(e);
    }
});

graphicsContainer.addEventListener('mousemove', (e) => {
    if (selectionBox) {
        updateSelectionBox(e);
    }
});

graphicsContainer.addEventListener('mouseup', () => {
    if (selectionBox) {
        updateDynamicSelection();

        graphicsContainer.removeChild(selectionBox);
        selectionBox = null;
        graphicsContainer.style.cursor = 'crosshair';
        currentlySelectedObjects.clear();
    }
    document.getElementById('selection-mode-popup').style.pointerEvents = 'all';

});

graphicsContainer.addEventListener('touchstart', (e) => {
    if (selectionMode && e.touches.length === 1) {
        e.preventDefault();

        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        selectionBox = document.createElement('div');
        selectionBox.style.position = 'absolute';
        selectionBox.style.border = `2px dashed ${getModeColour(selectionMode)}`;
        selectionBox.style.backgroundColor = getModeColour(selectionMode, 0.2);
        selectionBox.style.zIndex = '100';
        graphicsContainer.appendChild(selectionBox);

        updateSelectionBox(touch);
    }
}, { passive: false });

graphicsContainer.addEventListener('touchmove', (e) => {
    if (selectionBox && e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        updateSelectionBox(touch);
    }
}, { passive: false });

graphicsContainer.addEventListener('touchend', (e) => {
    if (selectionBox) {
        updateDynamicSelection();
        graphicsContainer.removeChild(selectionBox);
        selectionBox = null;
        currentlySelectedObjects.clear();
        graphicsContainer.style.cursor = 'crosshair';
    }
});


function updateSelectionBox(e) {
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const width = Math.abs(e.clientX - startX);
    const height = Math.abs(e.clientY - startY);

    selectionBox.style.left = `${x}px`;
    selectionBox.style.top = `${y}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;
}

function updateDynamicSelection() {
    const selectionRect = selectionBox.getBoundingClientRect();
    const allObjects = document.querySelectorAll('.object');

    const newlySelectedObjects = new Set();

    allObjects.forEach((object) => {
        const objectRect = object.getBoundingClientRect();
        
        const isIntersecting =
            selectionRect.left < objectRect.right &&
            selectionRect.right > objectRect.left &&
            selectionRect.top < objectRect.bottom &&
            selectionRect.bottom > objectRect.top;

        if (isIntersecting) {
            newlySelectedObjects.add(object);
            if (!currentlySelectedObjects.has(object)) {
                applySelectionMode(object);
                currentlySelectedObjects.add(object);
            }
        } else {
            if (currentlySelectedObjects.has(object)) {
                undoSelectionMode(object);
                currentlySelectedObjects.delete(object);
            }
        }
    });
}

function getModeColour(mode, opacity = null) {
    const rgba = document.documentElement.style.getPropertyValue(`--${mode}-color`).trim();

    if(opacity == null){
        return rgba;
    } else {
        const rgbaMatch = rgba.match(/^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$/);

        if (rgbaMatch) {
            return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${opacity})`;
        } else {
            return rgba;
        }
    }
}


function getModeLabel(mode){
    return document.getElementById(`${mode}-label`).innerHTML;
}

function applySelectionMode(object) {
    const [type, number] = selectionMode.split('-');
    if (!type || isNaN(number)) return;
    
    const classPattern = new RegExp(`^${type}-\\d+-object$`);
    object.classList.forEach(cls => {
        if (classPattern.test(cls)) {
            object.classList.remove(cls);
        }
    });
    
    object.classList.add(`${selectionMode}-object`);
    // updateProbabilityLabels();
    updateProbabilityInputs();
    stateHasChanged();
}

function undoSelectionMode(object) {
    // switch (selectionMode) {
    //     case 'A1':
    //         object.classList.remove('event');
    //         break;
    //     case 'A2':
    //         object.classList.add('event');
    //         break;
    //     case 'B1':
    //         object.classList.remove('positive');
    //         break;
    //     case 'B2':
    //         object.classList.add('positive');
    //         break;
    //     default:
    //         break;
    // }
}

function selectIndividualObject(object){
    switch (selectionMode) {
        case 'A1':
            object.classList.add('event');
            break;
        case 'A2':
            object.classList.remove('event');
            break;
        case 'B1':
            object.classList.add('positive');
            break;
        case 'B2':
            object.classList.remove('positive');
            break;
        default:
            break;
    }
}
