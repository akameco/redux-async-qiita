import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux';
import {selectQiita, fetchPosts} from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedQiita } = this.props;
    dispatch(fetchPosts(selectedQiita));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedQiita !== this.props.selectedQiita) {
      const { dispatch, selectedQiita } = nextProps
      dispatch(fetchPosts(selectedQiita))
    }
  }

  handleChange(nextQiita) {
    this.props.dispatch(selectQiita(nextQiita));
  }

  render() {
    const {selectedQiita, posts, isFetching} = this.props;
    const isEmpty = posts.length === 0;
    return (
      <div>
        <Picker value={selectedQiita}
          onChange={this.handleChange}
          options={['reactjs', 'Electron']}/>
        <p>
          {!isFetching &&
            <a href='#'>Refresh</a>
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
  dispatch: PropTypes.func.isRequired
  // lastUpdated: PropTypes.number,
}


function mapStateToProps(state) {
  const {selectedQiita, postsByQiita} = state;
  const {
    isFetching,
    items: posts
  } = postsByQiita[selectedQiita] || {
    isFetching,
    items: []
  };

  return {
    selectedQiita,
    posts,
    isFetching
  };
}

export default connect(mapStateToProps)(App);
