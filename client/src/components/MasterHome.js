import React from 'react';

import Logo from './Logo';
import Button from './Button';
import Container from './Container';

const MasterHome = () => {
  const hostGameHandler = () => {
    console.log('Handling game click');
  };

  return (
    <Container>
      <Logo />
      <Button onClick={hostGameHandler}>Host a game</Button>
    </Container>
  );
};

export default MasterHome;
