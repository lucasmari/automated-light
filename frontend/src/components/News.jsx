import React from 'react';
import PropTypes from 'prop-types';

function News({ news }) {
  return (
    <div>
      <div className="news">
        <div>
          <h3>{news.title}</h3>
          <p>{news.body}</p>
          <p>
            Posted by:
            {' '}
            {news.user.name}
          </p>
        </div>
        <img alt="placeholder" />
      </div>
    </div>
  );
}

News.propTypes = {
  news: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
    user: PropTypes.shape({ name: PropTypes.string }),
  }).isRequired,
};

export default News;
