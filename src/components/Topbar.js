import React from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.jpeg';

const Topbar = () => {
  return (
    <LogoContainer>
      <Logo>
          <img src={logo} alt='logo' />
      </Logo>
      <Heading>AQ SIGN</Heading>
    </LogoContainer>
  );
};

export default Topbar;

// Styled Components
const LogoContainer = styled.div`
  width: 100%;
  background-color: #fff;
  padding: 15px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Heading = styled.h1`
  font-size: 28px;
  color: white;
  margin: 0;
  font-weight: bold;
  color: #165277;
`;

const Logo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 80px;

    img{
    width: 130px;
    height: 80px;
    }
`;