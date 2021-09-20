import React from 'react';
import PropTypes from 'prop-types';

function Games({ games }) {
  return (
    <div className="games">
      <div>
        <h3>{games.name}</h3>
      </div>
    </div>
  );
}

Games.propTypes = {
  games: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

export default Games;
