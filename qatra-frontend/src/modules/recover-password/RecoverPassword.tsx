import { setWindowClass } from '@app/utils/helpers';
import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const RecoverPassword = () => {
  const [t] = useTranslation();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
   const email = queryParams.get('email');

   console.log(email);
   console.log(token);

  // Password visibility state for each field
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(5, t('validation.minChar', 'Must be 5 characters or more'))
        .max(30, t('validation.maxChar', 'Must be 30 characters or less'))
        .required(t('validation.required', 'Required')),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], t('validation.passwordMatch', 'Passwords must match'))
        .required(t('validation.required', 'Required')),
    }),
    onSubmit: (values) => {
      ResetPassword(token ?? '',email ?? '', values.password, values.confirmPassword);
    },
  });

  const ResetPassword = async (token: string,email :string, password: string, confirmPassword: string) => {
    try {
      axios.defaults.withCredentials = true;

      await axios.get('http://localhost:8000/sanctum/csrf-cookie');

      const response = await axios.post(
        'http://localhost:8000/api/recover-password',
        {
          token: token,
          email:email,
          password: password,
          password_confirmation: confirmPassword,
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
        toast.success(t('recover.passwordChanged', 'Your password has been changed successfully.'));
        navigator('/login');
      } else {
        console.log(response.data.message);
        toast.error(response.data?.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message );
    }
  };

  setWindowClass('hold-transition login-page');

  return (
    <div className="login-box">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
          <Link to="/" className="h1">
            <b>Admin</b>
            <span>LTE</span>
          </Link>
        </div>
        <div className="card-body">
          {token && email ? (
            <>
              <p className="login-box-msg">{t('recover.oneStepAway', 'You are one step away from resetting your password')}</p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <InputGroup className="mb-3">
                    <Form.Control
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('recover.passwordPlaceholder', 'Password')}
                      onChange={handleChange}
                      value={values.password}
                      isValid={touched.password && !errors.password}
                      isInvalid={touched.password && !!errors.password}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas fa-eye${showPassword ? '-slash' : ''}`} />
                      </InputGroup.Text>
                    </InputGroup.Append>
                    {touched.password && errors.password && (
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    )}
                  </InputGroup>
                </div>
                <div className="mb-3">
                  <InputGroup className="mb-3">
                    <Form.Control
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('recover.confirmPasswordPlaceholder', 'Confirm Password')}
                      onChange={handleChange}
                      value={values.confirmPassword}
                      isValid={touched.confirmPassword && !errors.confirmPassword}
                      isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`fas fa-eye${showConfirmPassword ? '-slash' : ''}`} />
                      </InputGroup.Text>
                    </InputGroup.Append>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                    )}
                  </InputGroup>
                </div>
                <div className="row">
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">{t('recover.changePassword', 'Change Password')}</button>
                  </div>
                </div>
              </form>
              <p className="mt-3 mb-1">
                <Link to="/login">{t('login.button.signIn.label', 'Sign In')}</Link>
              </p>
            </>
          ) : (
            <>
              <h4>{t('recover.tokenMissing', 'Password reset token is missing.')}</h4>
              <Link to="/forgot-password">{t('recover.requestAgain', 'Request a new password reset')}</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
