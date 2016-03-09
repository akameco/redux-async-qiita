import {combineReducers} from 'redux';
import {SELECT_QIITA, REQUEST_POSTS, RECEIVE_POSTS, INVALIDATE_QIITA} from '../actions';

function selectedQiita(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_QIITA:
      return action.qiita;
    default:
      return state;
  }
}

function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_QIITA:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
        items: action.posts
      });
    default:
      return state;
  }
}

function postsByQiita(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_QIITA:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.qiita]: posts(state[action.qiita], action)
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  selectedQiita,
  postsByQiita
});

export default rootReducer;
