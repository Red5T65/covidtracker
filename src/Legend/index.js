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
        '<8000',
        '8000-9000',
        '9000-10000',
        '10000+'
    ];
    const markers = ['<200,000', '200,000-500,000', '500,000-1M', '1M+'];
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
        Data obtained from CDC COVID-19 Database
    </div>;
}
