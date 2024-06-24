function initialize() {
    const numProcesses = document.getElementById('numProcesses').value;
    const numResources = document.getElementById('numResources').value;

    if (numProcesses <= 0 || numResources <= 0) {
        alert("Please enter valid numbers for processes and resources.");
        return;
    }

    const tablesContainer = document.getElementById('tablesContainer');
    tablesContainer.innerHTML = '';

    const availableTable = createResourceTable('Available Resources', numResources);
    tablesContainer.appendChild(availableTable);

    for (let i = 0; i < numProcesses; i++) {
        const allocationTable = createResourceTable(`P${i} Allocation`, numResources);
        const maxTable = createResourceTable(`P${i} Maximum Demand`, numResources);
        tablesContainer.appendChild(allocationTable);
        tablesContainer.appendChild(maxTable);
    }

    document.getElementById('resourceTables').style.display = 'block';
}

function createResourceTable(title, numResources) {
    const table = document.createElement('div');
    table.innerHTML = `<h3>${title}</h3>`;

    for (let i = 0; i < numResources; i++) {
        table.innerHTML += `<label>R${i}:</label>
                            <input type="number" name="${title.replace(/ /g, '_')}_R${i}" min="0" required><br>`;
    }

    return table;
}

function runBankersAlgorithm() {
    const numProcesses = document.getElementById('numProcesses').value;
    const numResources = document.getElementById('numResources').value;

    let available = [];
    for (let i = 0; i < numResources; i++) {
        available.push(parseInt(document.querySelector(`[name='Available_Resources_R${i}']`).value));
    }

    let max = [];
    let allocation = [];
    let need = [];
    for (let i = 0; i < numProcesses; i++) {
        max[i] = [];
        allocation[i] = [];
        need[i] = [];
        for (let j = 0; j < numResources; j++) {
            max[i][j] = parseInt(document.querySelector(`[name='P${i}_Maximum_Demand_R${j}']`).value);
            allocation[i][j] = parseInt(document.querySelector(`[name='P${i}_Allocation_R${j}']`).value);
            need[i][j] = max[i][j] - allocation[i][j];
        }
    }
    if (isSafeState(numProcesses, numResources, available, max, allocation, need)) {
        document.getElementById('result').innerHTML = "<h3>The system is in a safe state.</h3>";
    } else {
        document.getElementById('result').innerHTML = "<h3>The system is NOT in a safe state.</h3>";
    }
}

function isSafeState(numProcesses, numResources, available, max, allocation, need) {
    let work = [...available];
    let finish = new Array(numProcesses).fill(false);
    let safeSequence = [];

    for (let count = 0; count < numProcesses; count++) {
        let found = false;
        for (let p = 0; p < numProcesses; p++) {
            if (!finish[p]) {
                let exec = true;
                for (let j = 0; j < numResources; j++) {
                    if (need[p][j] > work[j]) {
                        exec = false;
                        break;
                    }
                }
                if (exec) {
                    for (let k = 0; k < numResources; k++) {
                        work[k] += allocation[p][k];
                    }
                    safeSequence.push(p);
                    finish[p] = true;
                    found = true;
                }
            }
        }
        if (!found) {
            return false;
        }
    }

    console.log("Safe sequence:", safeSequence);
    return true;
}
