const initTimeInput = document.getElementById('input_init_time');
const finalTimeInput = document.getElementById('input_final_time');
const maxArrivalFrequency = document.getElementById('input_arrival');
const maxAtentionTime = document.getElementById('input_atention');
const button = document.getElementById('simulate');

const tableEvents = document.getElementById('list_events');
const tableIntervals = document.getElementById('list_intervals');

let initTime;
let finalTime;
let arrivalFrequency;
let atentionTime;
let queueEvents = [];
let queueIntervals = [];

const SETTING_LOCAL_TIME = 18000000;
const SECOND_IN_MS = 1000;
const MAX_ARRIVAL_SECONDS = 60;

button.addEventListener('click', getTimeLine);

//JS 'Queues' --> {encolar ->array.push();} {encolar -> array.shift();}

function getTimeLine() {
    initTime = initTimeInput.valueAsNumber;
    finalTime = finalTimeInput.valueAsNumber;
    arrivalFrequency = maxArrivalFrequency.valueAsNumber;
    atentionTime = maxAtentionTime.valueAsNumber;
    if (initTime >= 0 && finalTime >= 0 && arrivalFrequency >= 0 && atentionTime >= 0) {
        let first_time = new Date(initTime + SETTING_LOCAL_TIME);
        let last_time = new Date(finalTime + SETTING_LOCAL_TIME);
        //console.log(first_time.toLocaleTimeString());
        //console.log(last_time.toLocaleTimeString());
        //console.log(msToTime(finalTime));
        getEvents(initTime, finalTime, arrivalFrequency, atentionTime);
        //getIntervals(initTime, finalTime);
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
        if (time <= finalTime) {
            event++;
            //console.log(`Hora de llegada vehiculo ${event}: ${msToDate(time)}`);
            if (queueEvents.length == 0) {
                atentionTimeEvent = generateAtentionTime(atentionTime);
                //console.log(`Tiempo de atencion: ${msToTime(atentionTimeEvent)}`);
                queueEvents.push([event, time, time, atentionTimeEvent]);
            } else {
                queueEvents.push([event, time]);
                if (time > (queueEvents[0][2] + queueEvents[0][3])) {
                    elementDequeue = queueEvents.shift(); //mostrar en tabla el primero de la cola y sacarlo. shift retorna el elemento sacado
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
    }
}

function getIntervals(initTime, finalTime, arrivalFrequency, atentionTime) { //Evaluar cada minuto
    let initTme = 0;
    let lastTime = 1200;
    let timeArrives = 15;
    let time = initTme;
    let event = 0;
    let total = 0;
    for (let time = initTme; time < lastTime; time++) {
        event++;
        console.log(`${event}: ${Math.floor(time/60)}:${time%60}`);
        if (Math.random() < 1/(timeArrives)) {
            console.log('OK');
            total++;
            //Encolar
        } else {
            console.log('ERROR');
        }
    }
    console.log(`Eventos: ${total}`);
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

function toAddQueueTimes() {
    let sum = queueEvents[0][1];
    for (let i = 0; i < queueEvents; i++) {
        sum += queueEvents[i][2];
    }
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