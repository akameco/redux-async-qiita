import fetch from 'isomorphic-fetch';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_QIITA = 'SELECT_QIITA';
export const INVALIDATE_QIITA = 'INVALIDATE_QIITA';

export function selectQiita(qiita) {
  return {
    type: SELECT_QIITA,
    qiita
  };
}

export function invalidateQiita(qiita) {
  return {
    type: INVALIDATE_QIITA,
    qiita
  };
}

function requestPosts(qiita) {
  return {
    type: REQUEST_POSTS,
    qiita
  };
}

function receivePosts(qiita, json) {
  return {
    type: RECEIVE_POSTS,
    qiita: qiita,
    receivedAt: Date.now(),
    posts: json
  };
}

function fetchPosts(qiita) {
  return dispatch => {
    dispatch(requestPosts(qiita));
    return fetch(`https://qiita.com/api/v2/tags/${qiita}/items`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(qiita, json)));
  };
}

function shouldFetchPosts(state, qiita) {
  const posts = state.postsByQiita[qiita];
  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false;
  }
  return posts.didInvalidate;
}

export function fetchPostsIfNeeded(qiita) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), qiita)) {
      return dispatch(fetchPosts(qiita));
    }
  }
}
