const objectsGrid = document.getElementById("objects-grid");
const origin = document.getElementById("origin");
const graphicsContainer = document.getElementById("graphics-container");
const inputNumObjects = document.getElementById("input-num-objects");
// const inputNumObjects2 = document.getElementById("input-num-objects-2");

inputNumObjects.addEventListener('input', function() {
    if(eventsList.length == 0 && inputNumObjects.value){
        addNewDefaultEvent();
    }
    gridState = saveCurrentGridState();
    numObjects = this.value;
    // inputNumObjects2.value = numObjects;
    drawObjects(gridState);
    updateProbabilityInputs();
    // updateGridFromEventInputs();
    stateHasChanged();
    hideEvidence();
    
});

// inputNumObjects2.addEventListener('input', function() {
//     if(eventsList.length == 0  && inputNumObjects2.value){
//         addNewDefaultEvent();
//     }
//     gridState = saveCurrentGridState();
//     numObjects = this.value;
//     inputNumObjects.value = numObjects;
//     drawObjects(gridState);
//     updateProbabilityInputs();
//     stateHasChanged();

// });