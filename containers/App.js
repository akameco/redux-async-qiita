import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux';
import {selectQiita, fetchPostsIfNeeded, invalidateQiita} from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedQiita } = this.props;
    dispatch(fetchPostsIfNeeded(selectedQiita));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedQiita !== this.props.selectedQiita) {
      const { dispatch, selectedQiita } = nextProps
      dispatch(fetchPostsIfNeeded(selectedQiita))
    }
  }

  handleChange(nextQiita) {
    this.props.dispatch(selectQiita(nextQiita));
  }

  handleRefreshClick(e) {
    e.preventDefault();
    const { dispatch, selectedQiita } = this.props;
    dispatch(invalidateQiita);
    dispatch(fetchPostsIfNeeded(selectedQiita));
  }

  render() {
    const {selectedQiita, posts, isFetching, lastUpdated} = this.props;
    const isEmpty = posts.length === 0;
    return (
      <div>
        <Picker value={selectedQiita}
          onChange={this.handleChange}
          options={['reactjs', 'Electron', 'redux']}/>
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href='#' onClick={this.handleRefreshClick}>Refresh</a>
          }
        </p>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{opacity: isFetching ? 0.5 : 1}}>
              <Posts posts={posts}/>
            </div>}
      </div>
    );
  }
}

App.propTypes = {
  selectedQiita: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const {selectedQiita, postsByQiita} = state;
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByQiita[selectedQiita] || {
    isFetching,
    items: []
  };

  return {
    selectedQiita,
    posts,
    lastUpdated,
    isFetching
  };
}

export default connect(mapStateToProps)(App);
