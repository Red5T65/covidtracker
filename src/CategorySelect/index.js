import React from 'react';
import classNames from 'classnames';

import classes from './index.less';

export default function CategorySelect(props) {
    const {
        dataPoints,
        dataPointIndex,
        timeIndex,
        perCapita,
        onChangeCategory,
        onChangePerCapita
    } = props;

    function inputChangeDataPoint(event) {
        const nextDataPointIndex = Number.parseInt(event.target.value, 10);
        let nextTimeIndex = timeIndex;
        if (nextTimeIndex >= dataPoints[nextDataPointIndex].times.length) {
            nextTimeIndex = 0;
        }

        return onChangeCategory(nextDataPointIndex, nextTimeIndex);
    }

    function inputChangeTime(event) {
        const nextTimeIndex = Number.parseInt(event.target.value, 10);
        return onChangeCategory(dataPointIndex, nextTimeIndex);
    }

    function inputChangePerCapita(event) {
        return onChangePerCapita(event.target.checked);
    }

    const dataPointRadios = dataPoints.map(function(dataPoint, i) {
        const checked = dataPointIndex === i;
        const labelClasses = classNames({
            [classes.checked]: checked
        });

        return <label
            key={i}
            className={labelClasses}
        >
            <input
                type="radio"
                name="dataPoint"
                value={i}
                checked={checked}
                onChange={inputChangeDataPoint}
            />
            {dataPoint.label}
        </label>;
    });

    const timeRadios = dataPoints[dataPointIndex].times.map(function(time, i) {
        const checked = timeIndex === i;
        const labelClasses = classNames({
            [classes.checked]: checked
        });

        return <label
            key={time.key}
            className={labelClasses}
        >
            <input
                type="radio"
                name="time"
                value={i}
                checked={checked}
                onChange={inputChangeTime}
            />
            {time.label}
        </label>;
    });

    const perCapitaCheck = (function() {
        const labelClasses = classNames({
            [classes.checked]: perCapita
        });

        return <label className={labelClasses}>
            <input
                type="checkbox"
                name="perCapita"
                value="perCapita"
                checked={perCapita}
                onChange={inputChangePerCapita}
            />
            Per 100,000
        </label>;
    }());

    return <div className={classes.categorySelect}>
        <div className={classes.buttonGroup}>
            {dataPointRadios}
        </div>
        <div className={classes.buttonGroup}>
            {timeRadios}
        </div>
        <div className={classNames(classes.perCapita, classes.buttonGroup)}>
            {perCapitaCheck}
        </div>
    </div>;
}

