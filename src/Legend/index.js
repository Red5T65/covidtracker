import React from 'react';
import classes from './index.less';

export default function Legend(props) {
    const {
        label,
        perCapita,
        colors
    } = props;

    const divisions = 4;
    const perCapitaMarkers = [
        '7175-7854',
        '7854-9152',
        '9152-1168',
        '11168-14532'
    ];
    const markers = [
        '56076-87317',
        '87317-412602',
        '412602-1085429',
        '1085429-3653538'
    ];
    const colordivs = [];

    for (let i = 0; i < divisions; i++) {
        const color = colors[i];
        if (perCapita === true) {
            colordivs.push(<span style={{
                backgroundColor: `${color}`,
                width: 191,
                color: '#ffffff',
                fontSize: 20
            }}>{perCapitaMarkers[i]}</span>);
        } else {
            colordivs.push(<span style={{
                backgroundColor: `${color}`,
                width: 191,
                color: '#ffffff',
                fontSize: 20
            }}>{markers[i]}</span>);
        }
    }

    return <div className={classes.Legend}>
        {label} {perCapita ? 'Per 100,000 People' : null}
        <div className={classes.colordivs}>
            {colordivs}
        </div>
            Data obtained from CDC COVID-19 Database.
            Values listed are 10th, median, and 90th percentile respectively
    </div>;
}
