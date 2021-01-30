import React from 'react';

import CategorySelect from 'src/CategorySelect';
import Legend from 'src/Legend';

import USAMap from 'src/USA.svg';
import USA from 'src/USA.json';

import classes from './index.less';

const colors = ['#e60000', '#ff369e', '#0095ff', '#2679ff'];

const dataPoints = [{
    label: 'COVID-19 Vaccination Status as of 2021-30-01',
    vacData: [{
        key: 'totalDist',
        label: 'Total Distributed'
    }, {
        key: 'totalAdmin',
        label: 'Total Administered'
    }]
}];

class CountryMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPointIndex: 0,
            vacDataIndex: 0,
            perCapita: true
        };

        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangePerCapita = this.onChangePerCapita.bind(this);
        this.svgRef = React.createRef();
    }

    render() {
        const { dataPointIndex, vacDataIndex, perCapita } = this.state;
        const { onChangeCategory, onChangePerCapita, svgRef } = this;

        const {
            label
        } = dataPoints[dataPointIndex];

        return <div className={classes.map}>
            <CategorySelect
                dataPoints={dataPoints}
                dataPointIndex={dataPointIndex}
                vacDataIndex={vacDataIndex}
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
                colors={colors}
            />
        </div>;
    }

    onChangeCategory(dataPointIndex, vacDataIndex) {
        this.setState({ dataPointIndex, vacDataIndex });
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
        const { dataPointIndex, vacDataIndex, perCapita } = this.state;
        const dataPoint = dataPoints[dataPointIndex];
        const { vacData } = dataPoint;
        const { key } = vacData[vacDataIndex];

        const svg = this.svgRef.current.contentDocument;
        for (let stateID of Object.keys(USA.states)) {
            const state = USA.states[stateID];
            const { population } = state;
            const value = state[key];
            const valuePerCapita = value / (population / 100000);

            const elem = svg.getElementById(stateID);
            if (elem === null) {
                throw new Error(`SVG element with ID "${stateID}" not found`);
            }

            const colorval = perCapita
                ? valuePerCapita
                : value;
            if (perCapita === true) {
                if (colorval < 200000) {
                    const fill = `${colors[0]}`;
                    elem.style.fill = fill;
                } else if (colorval <= 500000) {
                    const fill = `${colors[1]}`;
                    elem.style.fill = fill;
                } else if (colorval <= 1000000) {
                    const fill = `${colors[2]}`;
                    elem.style.fill = fill;
                } else {
                    const fill = `${colors[3]}`;
                    elem.style.fill = fill;
                }
            } else if (colorval < 8000) {
                const fill = `${colors[0]}`;
                elem.style.fill = fill;
            } else if (colorval <= 9000) {
                const fill = `${colors[1]}`;
                elem.style.fill = fill;
            } else if (colorval <= 10000) {
                const fill = `${colors[2]}`;
                elem.style.fill = fill;
            } else {
                const fill = `${colors[3]}`;
                elem.style.fill = fill;
            }
        }
    }
}

function App() {
    return <CountryMap />;
}

export default App;

