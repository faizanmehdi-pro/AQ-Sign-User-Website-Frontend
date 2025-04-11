import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import * as Yup from 'yup';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo.jpeg';

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;

  @media screen and (max-width: 768px){
    max-width: 90%;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  label {
    color: #165277;
    font-size: 17px;
    margin: 10px 0 5px 0;
    font-weight: 600;
  }
`;

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledField = styled(Field)`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #165277;
  font-size: 16px;
  background: none;
  outline: none;
  color: #165277;
  width: 100%;
`;

const ErrorText = styled.div`
  color: #f44336;
  font-size: 0.875rem;
`;

const EyeIcon = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #165277;
`;

const SubmitButton = styled.button`
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #165277;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #45a049;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
  }
`;

const Heading = styled.h1`
  font-size: 32px;
  color: #165277;
  margin: 0;
  font-weight: bold;
`;

// Validation Schema
const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const loginUser = async (credentials) => {
  const response = await fetch('http://98.81.159.86/EmailCredential/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error('Login failed Username or Password is incorrect!');
  }
  return response.json();
};

const LoginForm = ({ setToken, setPDFFile }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setToken(true);
      setPDFFile({ pdfDocument: data.documents, customer: data.customer });
      toast.success('Login successfully!');
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  return (
    <Container>
      <FormWrapper>
        <LogoContainer>
          <img src={logo} alt='logo' />
          <Heading>AQ SIGN</Heading>
        </LogoContainer>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setLoading(true);
            mutation.mutate(values);
          }}
        >
          {({ isSubmitting }) => (
            <StyledForm>
              <label htmlFor="username">Username</label>
              <StyledField type="text" id="username" name="username" placeholder="john_doe" />
              <ErrorMessage component={ErrorText} name="username" />

              <label htmlFor="password">Password</label>
              <FieldContainer>
                <StyledField
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="********"
                />
                <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </EyeIcon>
              </FieldContainer>
              <ErrorMessage component={ErrorText} name="password" />

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </SubmitButton>
            </StyledForm>
          )}
        </Formik>
      </FormWrapper>
    </Container>
  );
};

export default LoginForm;
