import { combineReducers } from 'redux'
import {SELECT_QIITA, REQUEST_POSTS, RECEIVE_POSTS} from '../actions';

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
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.posts
      });
    default:
      return state;
  }
}

function postsByQiita(state = { }, action) {
  switch (action.type) {
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
