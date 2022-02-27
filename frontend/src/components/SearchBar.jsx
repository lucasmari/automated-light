import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useHistory } from 'react-router-dom';

const NEWS_SEARCH_QUERY = gql`
  query NewsSearch($searchText: String!) {
    news(
      filter: { titleContains: $searchText, OR: { bodyContains: $searchText } }
    ) {
      id
      title
      body
      user {
        name
      }
    }
  }
`;

const SearchBar = () => {
  const history = useHistory();
  const [searchFilter, setSearchFilter] = useState('');
  const [executeSearch, { data }] = useLazyQuery(NEWS_SEARCH_QUERY, {
    variables: { searchText: searchFilter },
  });

  useEffect(() => {
    if (data) {
      history.push({
        pathname: '/search',
        state: { data },
      });
    }
  }, [data, history]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        name="search"
        onChange={(e) => setSearchFilter(e.target.value)}
      />
      <button type="button" onClick={executeSearch}>
        <em className="fa fa-search" />
      </button>
    </div>
  );
};

export default SearchBar;
