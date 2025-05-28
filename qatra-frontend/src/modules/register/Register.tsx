import { setWindowClass } from '@app/utils/helpers';
import { Checkbox } from '@profabric/react-components';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { signInByGoogle } from '@app/services/auth';
import { useAppDispatch } from '@app/store/store';
import { Button } from '@app/styles/common';
import axios from 'axios';

const Register = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const [isGoogleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [isFacebookAuthLoading, setFacebookAuthLoading] = useState(false);
  const [t] = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const register = async (
    name: string,
    phone: string,
    email: string,
    password: string,
    passwordRetype:string,
    accountType: string
  ) => {
    try {
      setAuthLoading(true);
      axios.defaults.withCredentials = true;

      await axios.get('http://localhost:8000/sanctum/csrf-cookie');

      const response = await axios.post(
        'http://localhost:8000/api/userregister',
        {
          user_name: name,
          user_phone: phone,
          user_email: email,
          password: password,
          password_confirmation:passwordRetype,
          user_role: accountType,
        },
        {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': decodeURIComponent(
              document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
            ),
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Registration successful! Please verify your email.');
        navigate('/verify-otp', { state: { email } });
      } else {
        toast.error(response.data?.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const registerByGoogle = async () => {
    try {
      setGoogleAuthLoading(true);
      await signInByGoogle();
      setGoogleAuthLoading(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed');
      setGoogleAuthLoading(false);
    }
  };

  const registerByFacebook = async () => {
    try {
      setFacebookAuthLoading(true);
      throw new Error('Not implemented');
    } catch (error: any) {
      setFacebookAuthLoading(false);
      toast.error(error.message || 'Failed');
    }
  };

  const {
    handleChange,
    values,
    handleSubmit,
    touched,
    errors,
    submitForm,
  } = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      passwordRetype: '',
      account_type: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      phone: Yup.string()
        .matches(/^\+?\d{10,15}$/, 'Invalid phone number')
        .required('Phone is required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
      passwordRetype: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
      account_type: Yup.string()
        .oneOf(['CENTER', 'ASSOCIATION'], 'Select account type')
        .required('Account type is required'),
    }),
    onSubmit: (values) => {
      register(values.name, values.phone, values.email, values.password, values.passwordRetype,values.account_type);
    },
  });

  setWindowClass('hold-transition register-page');

  return (
    <div className="register-box">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
          <Link to="/" className="h1">
            <b>Admin</b>
            <span>LTE</span>
          </Link>
        </div>
        <div className="card-body">
          <p className="login-box-msg">{t('register.registerNew')}</p>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  onChange={handleChange}
                  value={values.name}
                  isValid={touched.name && !errors.name}
                  isInvalid={touched.name && !!errors.name}
                />
                {touched.name && errors.name ? (
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-user" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            {/* Phone */}
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  value={values.phone}
                  isValid={touched.phone && !errors.phone}
                  isInvalid={touched.phone && !!errors.phone}
                />
                {touched.phone && errors.phone ? (
                  <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-phone" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            {/* Email */}
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  value={values.email}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                />
                {touched.email && errors.email ? (
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-envelope" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            {/* Account Type */}
            <div className="mb-3">
              {/* <Form.Label>Account Type</Form.Label> */}
              <Form.Control
                as="select"
                id="account_type"
                name="account_type"
                onChange={handleChange}
                value={values.account_type}
                isValid={touched.account_type && !errors.account_type}
                isInvalid={touched.account_type && !!errors.account_type}
              >
                <option disabled value="">Select account type</option>
                <option id="CENTER" value="CENTER">Center</option>
                <option id="ASSOCIATION" value="ASSOCIATION">Association</option>
              </Form.Control>
              {touched.account_type && errors.account_type && (
                <Form.Control.Feedback type="invalid">
                  {errors.account_type}
                </Form.Control.Feedback>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                  isValid={touched.password && !errors.password}
                  isInvalid={touched.password && !!errors.password}
                />
                {touched.password && errors.password ? (
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-lock" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            {/* Retype Password */}
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="passwordRetype"
                  name="passwordRetype"
                  type="password"
                  placeholder="Retype password"
                  onChange={handleChange}
                  value={values.passwordRetype}
                  isValid={touched.passwordRetype && !errors.passwordRetype}
                  isInvalid={touched.passwordRetype && !!errors.passwordRetype}
                />
                {touched.passwordRetype && errors.passwordRetype ? (
                  <Form.Control.Feedback type="invalid">{errors.passwordRetype}</Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-lock" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            <div className="row">
              <div className="col-7">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox checked={false} />
                  <label style={{ margin: 0, padding: 0, paddingLeft: '4px' }}>
                    <span>I agree to the </span>
                    <Link to="/">terms</Link>{' '}
                  </label>
                </div>
              </div>
              <div className="col-5">
                <Button
                  onClick={submitForm}
                  loading={isAuthLoading}
                  disabled={isGoogleAuthLoading || isFacebookAuthLoading}
                >
                  {t('register.label')}
                </Button>
              </div>
            </div>
          </form>
          {/* <div className="social-auth-links text-center">
            <Button
              className="mb-2"
              onClick={registerByFacebook}
              loading={isFacebookAuthLoading}
              disabled={true || isAuthLoading || isGoogleAuthLoading}
            >
              <i className="fab fa-facebook mr-2" />
              {t('login.button.signIn.social', {
                what: 'Facebook',
              })}
            </Button>
            <Button
              variant="danger"
              onClick={registerByGoogle}
              loading={isGoogleAuthLoading}
              disabled={isAuthLoading || isFacebookAuthLoading}
            >
              <i className="fab fa-google mr-2" />
              {t('login.button.signUp.social', { what: 'Google' })}
            </Button>
          </div> */}
          <Link to="/login" className="text-center">
            {t('register.alreadyHave')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
