import _ from 'lodash';
import { useEffect, useMemo } from 'react';

const useDebouncedSearch = (searchFn: (..._args: any) => void, timeout: number = 300) => {
  const onDebouncedSearch = useMemo(() => _.debounce(searchFn, timeout), [searchFn, timeout]);

  useEffect(() => {
    return () => {
      onDebouncedSearch.cancel();
    };
  }, [onDebouncedSearch]);

  return onDebouncedSearch;
};

export default useDebouncedSearch;
