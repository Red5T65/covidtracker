import React from 'react';
import classes from './index.less';

export default function Legend(props) {
    const {
        label,
        perCapita,
        maxValue,
        maxPerCapita
    } = props;

    const divisions = 5;
    const markers = [];

    for (let i = 0; i <= divisions; i++) {
        const marker = (i / divisions) *
            (perCapita ? (maxPerCapita * 100000) : maxValue);
        markers.push(<span>{Math.round(marker)}</span>);
    }

    return <div className={classes.Legend}>
        Legend
        <div className={classes.gradient} />
        <div className={classes.values}>
            {markers}
        </div>
        {label} {perCapita ? 'Per 100,000' : null}
    </div>;
}
