import PropTypes from 'prop-types';
import React, { useState } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom"; 

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import AnimateButton from 'components/@extended/AnimateButton';

export default function AuthLogin({ isDemo = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate(); 

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    setApiError(null); 
    
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/auth/token',
        new URLSearchParams({
          grant_type: 'password',
          username: values.email, // assuming email is the username
          password: values.password,
          scope: '',
          client_id: 'string',
          client_secret: 'string'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json'
          }
        }
      );

      // Store token (optional)
      localStorage.setItem('access_token', response.data.access_token);
      

      // Redirect or handle login success
      console.log('Login successful:', response.data);
      navigate("/dashboard/default"); 
      // window.location.href = "/dashboard/default";
    } catch (error) {
      setApiError(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
    setSubmitting(false);
  };

   

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={handleLogin}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-login">Email Address</InputLabel>
                <OutlinedInput
                  id="email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
                {touched.email && errors.email && (
                  <FormHelperText error>{errors.email}</FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-login">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
                {touched.password && errors.password && (
                  <FormHelperText error>{errors.password}</FormHelperText>
                )}
              </Stack>
            </Grid>
            {apiError && (
              <Grid item xs={12}>
                <FormHelperText error>{apiError}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Login
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
