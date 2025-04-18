window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);

    await loadPresets();

    const introStateSelect = document.getElementById('select-preset-intro');
    updatePresetOptions();

    const savedState = localStorage.getItem('current-state');
    let stateToLoad = savedState;

    if (!savedState) {
        stateToLoad = localStorage.getItem('saved_state_Medical Diagnosis');
        introStateSelect.value = 'saved_state_Medical Diagnosis';

    }

    if (stateToLoad) {
        try {
            const parsedState = JSON.parse(stateToLoad);
            loadState(parsedState);
            focusAllObjects();
        } catch (error) {
            console.error('error parsing state:', error);
        }
    }

    if (urlParams.get('source') === 'home') {
        urlParams.delete('source');
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.replaceState({}, '', newUrl.endsWith('?') ? window.location.pathname : newUrl);

        document.getElementById('welcome-container').style.display = 'flex';
        const loadStateSelect = document.getElementById('welcome-preset-select');
        loadStateSelect.innerHTML = "";
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('saved_state_')) {
                const option = document.createElement('option');
                const name = key.replace('saved_state_', '');
                option.value = key;
                option.innerText = name;
                loadStateSelect.appendChild(option);
            }
        }  
        loadStateSelect.value = 'saved_state_Medical Diagnosis';
    
    }

    else{
        // toggleKey();

        // setTimeout(() => {
        //     infoPopup(`Use <b>CTRL +</b> and <b>CTRL -</b><br>to scale the page to fit on your screen`, 5);
        // }, 1000);
    
        setTimeout(() => {
            infoPopup('<b>Left-click + Drag</b> to Pan<br><b>Scroll</b> to Zoom', 5);
        }, 1500);
    }
    
};

async function loadPresets() {
    const dictionary = {
        "saved_state_Medical Diagnosis": "data/medical_diagnosis_visualisation.json",
        "saved_state_Advanced Medical Diagnosis": "data/adv_medical_diagnosis_visualisation.json",
        "saved_state_Spam Email Filtering": "data/email_filtering_visualisation.json",
        "saved_state_Empty": "data/empty_state.json"
    };

    for (const [key, url] of Object.entries(dictionary)) {
        if (!localStorage.getItem(key)) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch ${url}`);

                const data = await response.json();
                localStorage.setItem(key, JSON.stringify(data));
            } catch (error) {
                console.error(`error loading preset for ${key}:`, error);
            }
        } else {
            console.log(`preset already exists in localStorage for ${key}.`);
        }
    }
}

