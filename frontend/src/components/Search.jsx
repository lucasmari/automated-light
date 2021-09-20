import React from 'react';
import { useLocation } from 'react-router';
import News from './News';

const Search = () => {
  const location = useLocation();
  const { data } = location.state;

  return (
    <div className="content-container">
      <h1>Search</h1>
      <div>
        {data.news.length > 0 ? (
          <>
            {data.news.map((news) => (
              <News key={news.id} news={news} />
            ))}
          </>
        ) : (
          <div>
            <p>No results... </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
