#!/usr/bin/env node

'use strict';

const csvParse = require('csv-parse');
const fs = require('fs');

const stateIDs = require('./stateIDs.json');

function streamEnd(stream) {
    return new Promise(function(resolve, reject) {
        stream.once('error', reject);
        stream.once('end', resolve);
    });
}

function parseCSV(filePath, onData) {
    const file = fs.createReadStream(filePath, {
        flags: 'r',
        encoding: 'utf-8'
    });

    const stream = csvParse({
        columns: true
    });

    stream.on('data', onData);
    file.pipe(stream);
    return streamEnd(stream);
}


async function parseData() {
    const states = {};

    for (let name of Object.keys(stateIDs)) {
        const stateID = stateIDs[name];
        states[stateID] = {
            stateID, name
        };
    }

    function getStateByName(name) {
        const stateID = stateIDs[name];
        return states[stateID];
    }

    const deathsStreamEnd = parseCSV('2020-07-20-death.csv', function(chunk) {
        const {
            model,
            target,
            location_name,
            point
        } = chunk;

        if (model !== 'Covid19Sim') {
            return;
        }

        const state = getStateByName(location_name);

        if (target === '1 wk ahead cum death') {
            state.totalDeathsOneWeek = point;
        }

        if (target === '4 wk ahead cum death') {
            state.totalDeathsOneMonth = point;
        }
    });

    const hospStreamEnd = parseCSV('2020-07-20-hosp.csv', function(chunk) {
        const {
            model,
            target,
            location_name,
            point
        } = chunk;

        if (model !== 'Covid19Sim') {
            return;
        }

        const state = getStateByName(location_name);

        if (target === '1 day ahead inc hosp') {
            state.dailyCasesCurrent = point;
        }

        if (target === '7 day ahead inc hosp') {
            state.dailyCasesOneWeek = point;
        }

        if (target === '30 day ahead inc hosp') {
            state.dailyCasesOneMonth = point;
        }
    });

    const popsStreamEnd = parseCSV('population-2019.csv', function(chunk) {
        const {
            name,
            population
        } = chunk;

        const state = getStateByName(name);
        state.population = population;
    });


    await deathsStreamEnd;
    await hospStreamEnd;
    await popsStreamEnd;

    const { national } = states;
    delete states.national;

    return { states, national };
}

parseData().then(function(data) {
    const output = JSON.stringify(data, null, 4);
    console.log(output);
}, console.error);

