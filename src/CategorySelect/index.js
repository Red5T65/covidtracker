import React from 'react';

import classes from './index.less';

export default function CategorySelect(props) {
    const {
        categories,
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

