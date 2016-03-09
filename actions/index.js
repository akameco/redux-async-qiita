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

export function invalidate() {
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
    posts: json
  };
}

export function fetchPosts(qiita) {
  return dispatch => {
    dispatch(requestPosts(qiita));
    return fetch(`https://qiita.com/api/v2/tags/${qiita}/items`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(qiita, json)));
  };
}
