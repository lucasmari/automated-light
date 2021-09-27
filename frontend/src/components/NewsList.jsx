import { useQuery } from '@apollo/client';
import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
  COOKIE_PATH,
  COOKIE_SAME_SITE,
  COOKIE_SIGNED_IN_NAME,
  NEWS_PER_PAGE,
} from '../constants';
import CreateNews from './CreateNews';
import News from './News';

const NEWS_QUERY = gql`
  query NewsQuery($first: Int, $skip: Int) {
    news(first: $first, skip: $skip) {
      id
      title
      body
      user {
        name
      }
    }
    count {
      news
    }
  }
`;

const getQueryVariables = (isNewPage, page) => {
  const skip = isNewPage ? (page - 1) * NEWS_PER_PAGE : 0;
  const first = isNewPage ? NEWS_PER_PAGE : 100;
  return { first, skip };
};

const getNewsToRender = (isNewPage, data) => {
  if (isNewPage) {
    return data.news;
  }
  return '';
};

const NewsList = () => {
  const history = useHistory();
  const cookies = new Cookies();
  const signedIn = cookies.get(COOKIE_SIGNED_IN_NAME);
  const isNewPage = history.location.pathname.includes('news');
  const pageIndexParams = history.location.pathname.split('/');
  const page = parseInt(pageIndexParams[pageIndexParams.length - 1], 10);
  const pageIndex = page ? (page - 1) * NEWS_PER_PAGE : 0;

  const { loading, error, data } = useQuery(NEWS_QUERY, {
    variables: getQueryVariables(isNewPage, page),
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        console.log(
          `[GraphQL error]: ${JSON.stringify(graphQLErrors, null, 2)}`,
        );
      }

      if (networkError) {
        if (networkError.result && networkError.result.error.unauthorized) {
          cookies.set(COOKIE_SIGNED_IN_NAME, '', {
            path: COOKIE_PATH,
            sameSite: COOKIE_SAME_SITE,
          });
          history.push('/');
        } else {
          console.log(
            `[Network error]: ${JSON.stringify(networkError, null, 2)}`,
          );
        }
      }
    },
  });

  return (
    <>
      {loading && <p>Loading...</p>}
      <div className="content-container">
        <div className="content-subcontainer">
          <h1>News</h1>
          {signedIn && <CreateNews />}
        </div>
        {data && data.count.news > 0 ? (
          <>
            {getNewsToRender(isNewPage, data).map((news, index) => (
              <News key={news.id} news={news} index={index + pageIndex} />
            ))}
            {isNewPage && (
              <div className="pagination">
                <Button
                  onClick={() => {
                    if (page > 1) {
                      history.push(`/news/${page - 1}`);
                    }
                  }}
                >
                  &#60;
                </Button>
                <Button
                  onClick={() => {
                    if (page < data.count.news / NEWS_PER_PAGE) {
                      const nextPage = page + 1;
                      history.push(`/news/${nextPage}`);
                    }
                  }}
                >
                  &#62;
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            {error ? (
              <p>Error :(</p>
            ) : (
              <div>
                <p>No news...</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default NewsList;
