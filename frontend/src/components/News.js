import React from 'react';

const News = (props) => {
  const { news } = props;
  return (
    <div>
      <div className="news">
        <div>
          <h3>{news.title}</h3>
          <p>{news.body}</p>
          <p>Posted by: {news.user.name}</p>
        </div>
        <img alt="placeholder"></img>
      </div>
    </div>
  );
};

export default News;
