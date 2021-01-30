import React from 'react';
import classNames from 'classnames';

import classes from './index.less';

export default function CategorySelect(props) {
    const {
        dataPoints,
        dataPointIndex,
        vacDataIndex,
        perCapita,
        onChangeCategory,
        onChangePerCapita
    } = props;

    function inputChangeDataPoint(event) {
        const nextDataPointIndex = Number.parseInt(event.target.value, 10);
        let nextVacDataIndex = vacDataIndex;
        if (nextVacDataIndex >= dataPoints[nextDataPointIndex].times.length) {
            nextVacDataIndex = 0;
        }

        return onChangeCategory(nextDataPointIndex, nextVacDataIndex);
    }

    function inputChangeVacData(event) {
        const nextVacDataIndex = Number.parseInt(event.target.value, 10);
        return onChangeCategory(dataPointIndex, nextVacDataIndex);
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

    const vacDataRadios =
        dataPoints[dataPointIndex].vacData.map(function(vacData, i) {
            const checked = vacDataIndex === i;
            const labelClasses = classNames({
                [classes.checked]: checked
            });
            return <label
                key={vacData.key}
                className={labelClasses}
            >
                <input
                    type="radio"
                    name="vacData"
                    value={i}
                    checked={checked}
                    onChange={inputChangeVacData}
                />
                {vacData.label}
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
            {vacDataRadios}
        </div>
        <div className={classNames(classes.perCapita, classes.buttonGroup)}>
            {perCapitaCheck}
        </div>
    </div>;
}

