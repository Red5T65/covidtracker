import React from 'react';
import ReactDOM from 'react-dom';

import USAMap from './USA.svg';
import USA from './USA.json';
import classes from './index.css';

const categories = {
    totalDeathsOneWeek: {
        label: 'Cumulative Deaths Next Week',
    },
    totalDeathsOneMonth: {
        label: 'Cumulative Deaths Next Month',
    },
    dailyCasesCurrent: {
        label: 'Daily Cases Today',
    },
    dailyCasesOneWeek: {
        label: 'Daily Cases Next Week',
    },
    dailyCasesOneMonth: {
        label: 'Daily Cases Next Month',
    },
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


function CategorySelect(props) {
    const {
        categoryKey,
        perCapita,
        onChangeCategory,
        onChangePerCapita
    } = props;

    const radios = Object.keys(categories).map(function(key) {
        const { label } = categories[key];
        return <label key={key}>
            <input
                type="radio"
                name="category"
                value={key}
                checked={categoryKey === key}
                onChange={onChangeCategory}
            /> {label}
        </label>;
    });

    return <div className={classes.categorySelect}>
        {radios}
        <label>
            <input
                type="checkbox"
                name="perCapita"
                value="perCapita"
                checked={perCapita}
                onChange={onChangePerCapita}
            /> Per Capita
        </label>
    </div>;
}

class CountryMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryKey: "dailyCasesCurrent",
            perCapita: true,
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

    componentDidMount() {
        this.updateSVG();
    }

    componentDidUpdate() {
        this.updateSVG();
    }

    async getSVG() {
        const svgElem = this.svgRef.current;
        const svg = svgElem.contentDocument;
        if (svg !== null) {
            return svg;
        }

        await new Promise(function(resolve) {
            svgElem.onload = resolve;
        });
        return svgElem.contentDocument;
    }

    async updateSVG() {
        const { categoryKey, perCapita } = this.state;
        const {
            maxValue,
            maxPerCapita,
        } = categories[categoryKey];

        const svg = await this.getSVG();
        for (let stateID of Object.keys(USA.states)) {
            const state = USA.states[stateID];
            const { population } = state;
            const value = state[categoryKey];
            const valuePerCapita = value / population;

            const elem = svg.getElementById(stateID);
            if (elem === null) {
                throw new Error(`no element with this ID ${stateID}`);
            }

            const fraction = perCapita
                ? (valuePerCapita / maxPerCapita)
                : (value / maxValue);
            const fill = `hsl(0, ${fraction * 100}%, 50%)`;
            elem.style.fill = fill;
        }
    }
}

function App(props) {
    return <CountryMap />
}

window.onload = function() {
    const appDiv = document.createElement('div');
    document.body.appendChild(appDiv);

    ReactDOM.render(<App />, appDiv);
}

