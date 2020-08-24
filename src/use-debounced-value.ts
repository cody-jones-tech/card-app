import { useState } from 'react';

import { useDebouncedCallback } from 'use-debounce';

const useDebouncedValue = <T>(value: T) => {
    const [instantValue, setInstantValue] = useState<T>(value);
    const [debounceValue, setDebounceValue] = useState<T>(value);

    const [onValueChangeCallback] = useDebouncedCallback(setDebounceValue, 400);

    const onValueChange = (value: T) => {
        setInstantValue(value);
        onValueChangeCallback(value);
    };

    return { value: instantValue, debounceValue, onValueChange };
};

export default useDebouncedValue;
