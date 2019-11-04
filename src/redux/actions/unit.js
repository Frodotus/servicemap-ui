import { searchFetch, nodeFetch } from '../../utils/fetch';
import { saveSearchToHistory } from '../../components/SearchBar/previousSearchData';
import { units } from './fetchDataActions';

// Actions
const {
  isFetching, fetchSuccess, fetchError, fetchProgressUpdate, setNewData,
} = units;

// Thunk fetch
export const fetchUnits = (
  searchQuery = null,
  searchType = null,
  abortController = null,
) => async (dispatch, getState)
=> {
  const onStart = () => dispatch(isFetching(searchQuery));
  const onStartNode = () => dispatch(isFetching({ searchType, searchQuery }));
  const { user } = getState();
  const { locale } = user;

  const onSuccess = (results) => {
    saveSearchToHistory(searchQuery, results);
    dispatch(fetchSuccess(results));
  };
  const onSuccessNode = (results) => {
    results.forEach((unit) => {
      // eslint-disable-next-line no-param-reassign
      unit.object_type = 'unit';
    });
    dispatch(fetchSuccess(results));
  };
  const onError = e => dispatch(fetchError(e.message));
  const onNext = (resultTotal, response) => dispatch(
    fetchProgressUpdate(resultTotal.length, response.count),
  );

  // Fetch data
  if (searchType === 'node') {
    nodeFetch(
      { service_node: searchQuery },
      onStartNode,
      onSuccessNode,
      onError,
      onNext,
      null,
      abortController,
    );
  } else {
    searchFetch(
      { q: searchQuery, language: locale || 'fi' },
      onStart,
      onSuccess,
      onError,
      onNext,
      null,
      abortController,
    );
  }
};

export const setNewSearchData = data => async (dispatch) => {
  if (data) {
    dispatch(setNewData(data));
  }
};
