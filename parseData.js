#!/usr/bin/env node

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
    const maximums = {
        totalDeathsOneWeek: 0,
        totalDeathsOneMonth: 0,
        dailyCasesCurrent: 0,
        dailyCasesOneWeek: 0,
        dailyCasesOneMonth: 0,
    };

    function updateValue(state, key, value) {
        state[key] = value;
        if (value > maximums[key]) {
            maximums[key] = value;
        }
    }

    function getState(name) {
        if (!(name in stateIDs)) {
            throw new Error(`name not in stateIDs: "${name}"`);
        }

        const stateID = stateIDs[name];
        if (!(stateID in states)) {
            states[stateID] = {
                name: name,
            };
        }

        return states[stateID];
    }

    const deathsStreamEnd = parseCSV('2020-07-20-death.csv', function(chunk) {
        const {
            model,
            target,
            location_name,
            point
        } = chunk;

        if (model != 'Covid19Sim') {
            return;
        }

        const state = getState(location_name);

        if (target == '1 wk ahead cum death') {
            updateValue(state, 'totalDeathsOneWeek', point);
        }

        if (target == '4 wk ahead cum death') {
            updateValue(state, 'totalDeathsOneMonth', point);
        }
    });

    const hospStreamEnd = parseCSV('2020-07-20-hosp.csv', function(chunk) {
        const {
            model,
            target,
            location_name,
            point
        } = chunk;

        if (model != 'Covid19Sim') {
            return;
        }

        const state = getState(location_name);

        if (target == '1 day ahead inc hosp') {
            updateValue(state, 'dailyCasesCurrent', point);
        }

        if (target == '7 day ahead inc hosp') {
            updateValue(state, 'dailyCasesOneWeek', point);
        }

        if (target == '30 day ahead inc hosp') {
            updateValue(state, 'dailyCasesOneMonth', point);
        }
    });

    await deathsStreamEnd;
    await hospStreamEnd;

    const { national } = states;
    delete states.national;

    return { states, national, maximums };
}

parseData().then(function(data) {
    const output = JSON.stringify(data, null, 4);
    console.log(output);
}, console.error);

