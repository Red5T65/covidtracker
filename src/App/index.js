import React from 'react';

import CategorySelect from 'src/CategorySelect';
import Legend from 'src/Legend';

import USAMap from 'src/USA.svg';
import USA from 'src/USA.json';

import classes from './index.less';

const dataPoints = [{
    label: 'Cumulative Deaths',
    maxValue: 1000,
    maxPerCapita: 200 / 100000,
    analysis: <p>
        Insert Text Here1
    </p>,
    times: [{
        key: 'totalDeathsOneWeek',
        label: 'One Week'
    }, {
        key: 'totalDeathsOneMonth',
        label: 'One Month'
    }]
}, {
    label: 'Daily Cases',
    maxValue: 1000,
    maxPerCapita: 10 / 100000,
    analysis: <p>
        Insert Text Here2
    </p>,
    times: [{
        key: 'dailyCasesCurrent',
        label: 'Today'
    }, {
        key: 'dailyCasesOneWeek',
        label: 'One Week'
    }, {
        key: 'dailyCasesOneMonth',
        label: 'One Month'
    }]
}];


class CountryMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPointIndex: 0,
            timeIndex: 0,
            perCapita: true
        };

        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangePerCapita = this.onChangePerCapita.bind(this);
        this.svgRef = React.createRef();
    }

    render() {
        const { dataPointIndex, timeIndex, perCapita } = this.state;
        const { onChangeCategory, onChangePerCapita, svgRef } = this;

        const {
            label,
            analysis,
            maxValue,
            maxPerCapita
        } = dataPoints[dataPointIndex];

        return <div className={classes.map}>
            <CategorySelect
                dataPoints={dataPoints}
                dataPointIndex={dataPointIndex}
                timeIndex={timeIndex}
                perCapita={perCapita}
                onChangeCategory={onChangeCategory}
                onChangePerCapita={onChangePerCapita}
            />
            <object
                type="image/svg+xml"
                data={USAMap}
                ref={svgRef}
            />
            <Legend
                label={label}
                perCapita={perCapita}
                maxValue={maxValue}
                maxPerCapita={maxPerCapita}
            />
            {analysis}
        </div>;
    }

    onChangeCategory(dataPointIndex, timeIndex) {
        this.setState({ dataPointIndex, timeIndex });
    }

    onChangePerCapita(perCapita) {
        this.setState({ perCapita });
    }

    async componentDidMount() {
        await this.loadSVG();
        this.updateSVG();
    }

    componentDidUpdate() {
        this.updateSVG();
    }

    loadSVG() {
        const svgDoc = this.svgRef.current;

        return new Promise(function(resolve) {
            svgDoc.onload = function() {
                const svgElem = svgDoc.contentDocument;
                svgElem.onload = resolve;
            };
        });
    }

    updateSVG() {
        const { dataPointIndex, timeIndex, perCapita } = this.state;
        const dataPoint = dataPoints[dataPointIndex];
        const { maxValue, maxPerCapita, times } = dataPoint;
        const { key } = times[timeIndex];

        const svg = this.svgRef.current.contentDocument;
        for (let stateID of Object.keys(USA.states)) {
            const state = USA.states[stateID];
            const { population } = state;
            const value = state[key];
            const valuePerCapita = value / population;

            const elem = svg.getElementById(stateID);
            if (elem === null) {
                throw new Error(`SVG element with ID "${stateID}" not found`);
            }

            const percent = perCapita
                ? (valuePerCapita / maxPerCapita)
                : (value / maxValue);
            const fill = `hsl(0, ${percent * 100}%, 50%)`;
            elem.style.fill = fill;
        }
    }
}

function App() {
    return <CountryMap />;
}

export default App;

