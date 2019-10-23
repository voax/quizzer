import React from 'react';

import Logo from './Logo';
import Button from './Button';
import Container from './Container';
import Loader from './Loader';

const MasterHome = () => {
  return (
    <Container>
      <Logo />
      <Button>Host a game</Button>
      <Loader />
    </Container>
  );
};

export default MasterHome;
