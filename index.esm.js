import Locator from 'locustjs-locator';
import React from 'react';

const Render = props => {
    if (props) {
        const keys = Object.keys(props);

        if (keys.length) {
            const Component = props[keys[0]];
            const _props = {};

            for (let i = 1; i < keys.length; i++) {
                const key = keys[i];

                _props[key] = props[key];
            }

            if (Component.dependencies) {
                for (let dependency of Object.keys(Component.dependencies)) {
                    const resolved = Locator.Instance.resolve(Component.dependencies[dependency]);

                    _props[dependency] = resolved;
                }
            }

            return <Component {..._props} />;
        }
    }

    return null;
}

export default Render;