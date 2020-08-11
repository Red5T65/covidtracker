import React from 'react';

import CategorySelect from '../CategorySelect';

import USAMap from '../USA.svg';
import USA from '../USA.json';

const categories = {
    totalDeathsOneWeek: {
        label: 'Cumulative Deaths Next Week'
    },
    totalDeathsOneMonth: {
        label: 'Cumulative Deaths Next Month'
    },
    dailyCasesCurrent: {
        label: 'Daily Cases Today'
    },
    dailyCasesOneWeek: {
        label: 'Daily Cases Next Week'
    },
    dailyCasesOneMonth: {
        label: 'Daily Cases Next Month'
    }
};

for (let key of Object.keys(categories)) {
    const category = categories[key];
    category.maxValue = 0;
    category.maxPerCapita = 0;

    for (let stateID of Object.keys(USA.states)) {
        const state = USA.states[stateID];
        const { population } = state;
        const value = state[key];
        const perCapita = value / population;

        if (value > category.maxValue) {
            category.maxValue = value;
        }

        if (perCapita > category.maxPerCapita) {
            category.maxPerCapita = perCapita;
        }
    }
}

class CountryMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryKey: 'dailyCasesCurrent',
            perCapita: true
        };

        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangePerCapita = this.onChangePerCapita.bind(this);
        this.svgRef = React.createRef();
    }

    render() {
        const { categoryKey, perCapita } = this.state;
        const { onChangeCategory, onChangePerCapita, svgRef } = this;

        return <div>
            <CategorySelect
                categories={categories}
                categoryKey={categoryKey}
                perCapita={perCapita}
                onChangeCategory={onChangeCategory}
                onChangePerCapita={onChangePerCapita}
            />
            <object type="image/svg+xml" data={USAMap} ref={svgRef} />
        </div>;
    }

    onChangeCategory(event) {
        this.setState({
            categoryKey: event.target.value
        });
    }

    onChangePerCapita(event) {
        this.setState({
            perCapita: event.target.checked
        });
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

    async updateSVG() {
        const { categoryKey, perCapita } = this.state;
        const {
            maxValue,
            maxPerCapita
        } = categories[categoryKey];

        const svg = this.svgRef.current.contentDocument;
        for (let stateID of Object.keys(USA.states)) {
            const state = USA.states[stateID];
            const { population } = state;
            const value = state[categoryKey];
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

