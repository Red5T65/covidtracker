!/usr/bin/env node

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

    const statesStreamEnd = parseCSV(
        '2021-01-30covidvac.csv',
        function(chunk) {
            const {
                territory,
                totalDist,
                totalAdmin
            } = chunk;

            const state = getStateByName(territory);
            if (!state) {
                return;
            }

            state.totalDist = totalDist;
            state.totalAdmin = totalAdmin;
        });

    const popsStreamEnd = parseCSV('population-2019.csv', function(chunk) {
        const {
            name,
            population
        } = chunk;

        const state = getStateByName(name);
        state.population = population;
    });


    await statesStreamEnd;
    await popsStreamEnd;

    const { national } = states;
    delete states.national;

    return { states, national };
}

parseData().then(function(data) {
    const output = JSON.stringify(data, null, 4);
    console.log(output);
}, console.error);

