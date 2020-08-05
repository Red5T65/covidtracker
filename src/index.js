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


function CategorySelect(props) {
    const { categoryKey, onChange } = props;

    const radios = Object.keys(categories).map(function(key) {
        const { label } = categories[key];
        return <label key={key}>
            <input
                type="radio"
                name="category"
                value={key}
                checked={categoryKey === key}
                onChange={onChange}
            /> {label}
        </label>;
    });

    return <div className={classes.categorySelect}>
        {radios}
    </div>;
}

class CountryMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryKey: null,
        };

        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.svgRef = React.createRef();
    }

    render() {
        const { categoryKey } = this.state;
        const { onChangeCategory, svgRef } = this;

        return <div>
            <CategorySelect
                categoryKey={categoryKey}
                onChange={onChangeCategory}
            />
            <object type="image/svg+xml" data={USAMap} ref={svgRef} />
        </div>;
    }

    onChangeCategory(event) {
        this.setState({
            categoryKey: event.target.value
        });
    }

    componentDidUpdate() {
        const { categoryKey } = this.state;
        const svg = this.svgRef.current.contentDocument;

        const maxValue = USA.maximums[categoryKey];

        for (let stateID of Object.keys(USA.states)) {
            const state = USA.states[stateID];
            const value = state[categoryKey];

            const elem = svg.getElementById(stateID);
            if (elem === null) {
                throw new Error(`no element with this ID ${stateID}`);
            }

            const percent = 100 * value / maxValue;
            const fill = `hsl(0, ${percent}%, 50%)`;
            console.log(stateID, fill);
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

