import { Columns, SortModel } from '@dls/web/build/components/Table/Table';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sanitizeUserSearchText } from '@/helpers/utils';
import useDebouncedSearch from './useDebouncedSearch';

type TableOption = {
  /** default value 1 */
  pageNumber?: number;
  sortModels?: SortModel[];
  /** default true, set to false in case not require to save the state in some scenarios, eg. in modal  */
  saveState?: boolean;
  paramName?: {
    /** default: "search" */
    search?: string;
    /** default: "page" */
    page?: string;
    /** default: "sort" */
    sort?: string;
  };
};
/**
 * Custom hook for standard table with search box and pagination
 */
const useTable = (options: TableOption = {}) => {
  const router = useRouter();
  const { pageNumber = 1, sortModels: defaultSorts = [], saveState = true, paramName } = options;
  const searchParamName = paramName?.search || 'search';
  const pageParamName = paramName?.page || 'page';
  const sortParamName = paramName?.sort || 'sort';

  // *********************************************** //
  //      initiate page number from query param      //
  // *********************************************** //
  const defaultPage = saveState ? Number(router.query[pageParamName]) || pageNumber : pageNumber;
  const [page, setPage] = useState(defaultPage);
  useEffect(() => {
    log('useEffect - defaultPage', defaultPage);
    setPage(defaultPage);
  }, [defaultPage]);

  // *********************************************** //
  //      initiate search text from query param      //
  // *********************************************** //
  const defaultSearchText = saveState ? router.query[searchParamName]?.toString() || '' : '';
  const [searchText, setSearchText] = useState<string>(defaultSearchText); //value for search box
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText); //value for API call
  useEffect(() => {
    setSearchText(defaultSearchText);
    setDebouncedSearchText(defaultSearchText);
  }, [defaultSearchText]);

  // *********************************************** //
  //      initiate sort models from query param      //
  // *********************************************** //
  // defaultSorts array is mutable, update only if it's different by deep compare
  const defaultSortsRef = useRef(defaultSorts);
  if (!_.isEqual(defaultSortsRef.current, defaultSorts)) {
    defaultSortsRef.current = defaultSorts;
  }

  const defaultSortModel = useMemo(
    () =>
      deserializeSortModel(saveState ? router.query[sortParamName]?.toString() || null : null) ||
      defaultSortsRef.current,
    [router.query, saveState, sortParamName]
  );
  const [sortModels, setSortModels] = useState<Array<SortModel>>(defaultSortModel);
  useEffect(() => {
    log('useEffect - defaultSortModelString', defaultSortModel);
    setSortModels(defaultSortModel);
  }, [defaultSortModel]);

  // *********************************************** //
  //           page number change handler            //
  // *********************************************** //
  const handlePageChange = useCallback(
    (value: number, updateParam: boolean = true) => {
      setPage(value);

      if (!saveState) return;

      // remember/remove page in the url
      if (value === pageNumber) {
        delete router.query[pageParamName];
        // log('delete', pageParamName, value, Array.from(searchParams.keys()));
      } else {
        router.query[pageParamName] = String(value);
        // log('set', pageParamName, value, Array.from(searchParams.keys()));
      }

      if (updateParam) router.push(router);
    },
    [saveState, pageNumber, router, pageParamName]
  );

  // const handlePageChange = useCallback((value: number) => _pageChangeHandler(value, true), [_pageChangeHandler]);

  // *********************************************** //
  //           search text change handler            //
  // *********************************************** //
  // handle debounce
  const _debouncedSearch = useDebouncedSearch(
    useCallback(
      (search: string) => {
        // set page number to 1 but don't update "page" param, update together with "search"
        handlePageChange(1, false);
        setDebouncedSearchText(search);

        if (!saveState) return;

        // remember/remove search keyword in the url
        if (search) {
          router.query[searchParamName] = search;
          // log('set', searchParamName, search, Array.from(searchParams.keys()));
        } else {
          delete router.query[searchParamName];
          // log('delete', searchParamName, search, Array.from(searchParams.keys()));
        }
        router.push(router);
      },
      [handlePageChange, saveState, router, searchParamName]
    )
  );

  // search text change handler
  const handleSearchTextChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const search = sanitizeUserSearchText(event.target.value);
      setSearchText((prevSearch: string) => {
        if (search !== prevSearch) {
          _debouncedSearch(search);
        }
        return search;
      });
    },
    [_debouncedSearch]
  );

  // *********************************************** //
  //           sort column change handler            //
  // *********************************************** //
  const handleSortChange = useCallback(
    (params: { sortModel: Array<SortModel>; currentModel: SortModel; column: Array<Columns> }) => {
      // only allow sort by 1 field, so use currentModel instead of sortModel
      let sortModel = isValidSort(params.currentModel.sort) ? [params.currentModel] : defaultSorts;
      if (!isValidSort(params.currentModel.sort)) {
        // if sort = null and the current sort model is same as the default, then set it to asc,
        // otherwise it will stuck without any change
        if (defaultSorts.length && params.currentModel.field === defaultSorts[0].field) {
          sortModel = [{ ...params.currentModel, sort: 'asc' }];
        }
      }
      setSortModels(sortModel);

      if (!saveState) return;

      // remember/remove sort in the url
      const sort = serializeSortModel(sortModel);
      if (sort && !_.isEqual(sortModel, defaultSorts)) {
        router.query[searchParamName] = sort;
        // log('set', sortParamName, sort, Array.from(searchParams.keys()));
      } else {
        delete router.query[sortParamName];
        // log('delete', sortParamName, sort, Array.from(searchParams.keys()));
      }
      router.push(router);
    },
    [defaultSorts, router, saveState, searchParamName, sortParamName]
  );

  return {
    page,
    /** Value to be used on search box (NOTE: use value instead of defaultValue) */
    searchText,
    /** Value to be used on API call) */
    debouncedSearchText,
    sortModels,

    handlePageChange,
    handleSearchTextChange,
    handleSortChange,

    router,
  };
};

// *********************************************** //
//                    utilities                    //
// *********************************************** //

// use a dedicate function to validate sort, because DLS current return "null" instead of null
const isValidSort = (sort?: string) => {
  return sort === 'asc' || sort === 'desc';
};

// serialize sort model array to string for saving in query parameter
const SORT_DELIMITER = ' ';
const serializeSortModel = (sortModel: SortModel[]) => {
  if (sortModel) {
    // serialize sort model to: field1+desc,field2+asc (but only support single field sort at this moment)
    return sortModel.reduce(
      (prev, curr) =>
        isValidSort(curr.sort) ? `${prev ? ',' + prev : ''}${curr.field}${SORT_DELIMITER}${curr.sort}` : prev,
      ''
    );
  }
  return '';
};

// convert serialized sort string to array
const deserializeSortModel = (sortModelString: string | null) => {
  if (sortModelString) {
    const list: SortModel[] = sortModelString.split(',').map(item => {
      const arr = item.split(SORT_DELIMITER);
      if (arr.length === 2 && (arr[1] === 'asc' || arr[1] === 'desc')) {
        return { field: arr[0], sort: arr[1] };
      }
      return { field: '' };
    });

    const validList = list.filter(item => !!item.field);

    return validList.length ? validList : null;
  }
  return null;
};

// turn on the log for troubleshoot
const log = (..._args: any) => {
  // console.log(...args);
};

export default useTable;
