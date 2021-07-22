import React from 'react';

const Games = (props) => {
  const { games } = props;
  return (
    <div className="games">
      <div>
        <h3>{games.name}</h3>
      </div>
    </div>
  );
};

export default Games;
