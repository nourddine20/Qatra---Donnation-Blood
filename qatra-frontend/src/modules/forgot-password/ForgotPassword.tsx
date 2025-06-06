import { setWindowClass } from '@app/utils/helpers';
import axios from 'axios';
import { useFormik } from 'formik';
import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const ForgotPassword = () => {
  const [t] = useTranslation();

  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: (values) => {
      console.log('gel');
     ForgotPassword(values.email);
    },
  });


 const ForgotPassword = async (email: string) => {
  try {
    axios.defaults.withCredentials = true;

    await axios.get('http://localhost:8000/sanctum/csrf-cookie');

    const response = await axios.post(
      'http://localhost:8000/api/forgot-password',
      {
        user_email: email,
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
      // Optionally save the user if needed
      // localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('A password reset link has been sent to your email.');
    } else {
      toast.error(response.data?.message || 'Failed to send password reset email.');
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to send password reset email.');
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
          <p className="login-box-msg">{t('recover.forgotYourPassword')}</p>
          <form onSubmit={handleSubmit}>
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
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-envelope" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="row">
              <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">
                  {t('recover.requestNewPassword')}
                </button>
              </div>
            </div>
          </form>
          <p className="mt-3 mb-1">
            <Link to="/login">{t('login.button.signIn.label')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
