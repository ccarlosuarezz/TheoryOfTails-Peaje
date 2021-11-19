const initTimeInput = document.getElementById('input_init_time');
const finalTimeInput = document.getElementById('input_final_time');
const maxArrivalFrequency = document.getElementById('input_arrival');
const maxAtentionTime = document.getElementById('input_atention');
const button = document.getElementById('simulate');

const tableEvents = document.getElementById('list_events');
const tableIntervals = document.getElementById('list_intervals');
const eventsResult = document.getElementById('events_result');
const intervalsResult = document.getElementById('intervals_result');

let initTime;
let finalTime;
let arrivalFrequency;
let atentionTime;
let queueEvents = [];
let queueIntervals = [];

const SETTING_LOCAL_TIME = 18000000;
const SECOND_IN_MS = 1000;

button.addEventListener('click', getTimeLine);

//JS 'Queues' --> {encolar ->array.push();} {desencolar -> array.shift();}

function getTimeLine() {
    initTime = initTimeInput.valueAsNumber;
    finalTime = finalTimeInput.valueAsNumber;
    arrivalFrequency = maxArrivalFrequency.valueAsNumber;
    atentionTime = maxAtentionTime.valueAsNumber;
    if (initTime >= 0 && finalTime >= 0 && arrivalFrequency >= 0 && atentionTime >= 0) {
        getEvents(initTime, finalTime, arrivalFrequency, atentionTime);
        getIntervals(initTime, finalTime, arrivalFrequency, atentionTime);
    } else {
        window.alert('Aun no ha ingresado lo parametros');
    }
}

function getEvents(initTime, finalTime, arrivalFrequency, atentionTime) {
    tableEvents.innerHTML = '';
    queueEvents = [];
    let time = initTime;
    let arrivalTime = 0;
    let atentionTimeEvent = 0;
    let event = 0;
    let elementDequeue;
    while (time < finalTime) {
        arrivalTime = Math.floor(Math.random()*(arrivalFrequency)) * SECOND_IN_MS;
        time += arrivalTime;
            event++;
            if (queueEvents.length == 0) {
                atentionTimeEvent = generateAtentionTime(atentionTime);
                queueEvents.push([event, time, time, atentionTimeEvent]);
            } else {
                queueEvents.push([event, time]);
                if (time > (queueEvents[0][2] + queueEvents[0][3])) {
                    elementDequeue = queueEvents.shift();
                    printDequeueElement(elementDequeue);
                    atentionTimeEvent = generateAtentionTime(atentionTime);
                    if (queueEvents[0][1] > (elementDequeue[2] + elementDequeue[3])) {
                        queueEvents[0].push(queueEvents[0][1]);
                    } else {
                        queueEvents[0].push(elementDequeue[2] + elementDequeue[3]);
                    }
                    queueEvents[0].push(atentionTimeEvent);
                }
            }
    }
    eventsResult.innerHTML = `<strong>Atendidos: ${event-queueEvents.length}<br>En cola: ${queueEvents.length}<br>Total: ${event}</strong>`;
}

function getIntervals(initTime, finalTime, arrivalFrequency, atentionTime) {
    tableIntervals.innerHTML = '';
    queueIntervals = [];
    let interval = 0;
    let atentionTimeVehicle = 0;
    let total = 0;
    for (let time = initTime; time < finalTime; time+=SECOND_IN_MS) {
        interval++;
        if (Math.random() < 1/(arrivalFrequency)) {
            total++;
            queueIntervals.push([total]);
        }
        if (queueIntervals.length == 0) {
            printInterval(interval, time, queueIntervals.length, 'Libre');
        } else {
            if (queueIntervals[0].length > 1) {
                if (queueIntervals[0][1] == 0) {
                    printInterval(interval, time, queueIntervals.length, `Vehiculo ${queueIntervals[0][0]} atendido en ${msToTime(queueIntervals[0][2])}`);
                    queueIntervals.shift();
                } else {
                    printInterval(interval, time, queueIntervals.length, `Atendiendo al vehiculo ${queueIntervals[0][0]}`);
                    queueIntervals[0][1] -= SECOND_IN_MS;
                }
            } else {
                atentionTimeVehicle = generateAtentionTime(atentionTime);
                queueIntervals[0].push(atentionTimeVehicle);
                queueIntervals[0].push(atentionTimeVehicle);
                printInterval(interval, time, queueIntervals.length, `Atendiendo al vehiculo ${queueIntervals[0][0]}`);
                queueIntervals[0][1] -= SECOND_IN_MS;
            }
        }
    }
    intervalsResult.innerHTML = `<strong>Atendidos: ${total-queueIntervals.length}<br>En cola: ${queueIntervals.length}<br>Total: ${total}</strong>`;
}

function generateAtentionTime(maxAtentionTime) {
    return Math.floor(Math.random()*(maxAtentionTime)) * SECOND_IN_MS;
}

function printDequeueElement(elementDequeue) {
    const newRow = document.createElement('tr');
    const tdN = document.createElement('td');
    const tdArrivalTime = document.createElement('td');
    const tdStartAtentionTime = document.createElement('td');
    const tdExitTime = document.createElement('td');
    const tdAtentionTime = document.createElement('td');
    tdN.textContent = elementDequeue[0];
    tdArrivalTime.textContent = msToDate(elementDequeue[1]);
    tdStartAtentionTime.textContent = msToDate(elementDequeue[2]);
    tdExitTime.textContent = msToDate(elementDequeue[2]+elementDequeue[3]);
    tdAtentionTime.textContent = msToTime(elementDequeue[3]);
    newRow.appendChild(tdN);
    newRow.appendChild(tdArrivalTime);
    newRow.appendChild(tdStartAtentionTime);
    newRow.appendChild(tdExitTime);
    newRow.appendChild(tdAtentionTime);
    tableEvents.appendChild(newRow);
}

function printInterval(interval, time, queueLength, serverState) {
    const newRow = document.createElement('tr');
    const tdN = document.createElement('td');
    const tdTime = document.createElement('td');
    const tdQueueLenght = document.createElement('td');
    const tdServerState = document.createElement('td');
    tdN.textContent = interval;
    tdTime.textContent = msToDate(time);
    tdQueueLenght.textContent = queueLength;
    tdServerState.textContent = serverState;
    newRow.appendChild(tdN);
    newRow.appendChild(tdTime);
    newRow.appendChild(tdQueueLenght);
    newRow.appendChild(tdServerState);
    tableIntervals.appendChild(newRow);
}

function msToTime(miliseconds) {
    let ms = miliseconds % 1000;
    miliseconds = (miliseconds - ms) / 1000;
    let secs = miliseconds % 60;
    miliseconds = (miliseconds - secs) / 60;
    let mins = miliseconds % 60;
    let hrs = (miliseconds - mins) / 60;
    return hrs + ' h, ' + mins + ' m, ' + secs + ' s';
}

function msToDate(miliseconds) {
    return new Date(miliseconds + SETTING_LOCAL_TIME).toLocaleTimeString();
}

//Documentar desarrollo y resultados obtenidos