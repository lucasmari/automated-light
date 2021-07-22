import React from 'react';
import Games from './Games';
import { useQuery, gql } from '@apollo/client';

const GAMES_QUERY = gql`
  {
    games {
      id
      name
    }
  }
`;

const GamesList = () => {
  const { loading, error, data } = useQuery(GAMES_QUERY, {
    errorPolicy: 'all',
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        console.log(
          `[GraphQL error]: ${JSON.stringify(graphQLErrors, null, 2)}`
        );

      if (networkError) {
        console.log(
          `[Network error]: ${JSON.stringify(networkError, null, 2)}`
        );
      }
    },
  });

  return (
    <>
      {loading && <p>Loading...</p>}
      <div className="content-container">
        <h1>Games</h1>
        {error && <p>Error :(</p>}
        <div>
          {data && (
            <>
              {data.games.map((games) => (
                <Games key={games.id} games={games} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GamesList;
