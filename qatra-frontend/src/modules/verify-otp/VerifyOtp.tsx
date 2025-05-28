import { setWindowClass } from '@app/utils/helpers';
import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { Button } from '@app/styles/common';

const VerifyOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const email = state?.email || '';
     const xsrfToken = (() => {
          const match = document.cookie
            .split('; ')
            .find((row) => row.startsWith('XSRF-TOKEN='));
          if (!match) return '';
          try {
            return decodeURIComponent(match.split('=')[1]);
          } catch {
            return '';
          }
        })();

  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required('OTP is required')
        .length(6, 'OTP must be 6 digits'),
    }),
    onSubmit: async ({ otp }) => {
      try {
        setLoading(true);
        await axios.get('http://localhost:8000/sanctum/csrf-cookie');

   

        const response = await axios.post(
          'http://localhost:8000/api/verify-otp',
          { email: email, otp_code :otp },
          {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': xsrfToken,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          toast.success('OTP verified successfully!');
          navigate('/');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.message || 'Invalid OTP');
        } else {
          toast.error('Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const resendOtp = async () => {
    try {
       setLoading(true);
        await axios.get('http://localhost:8000/sanctum/csrf-cookie');

   
        
    const response =  await axios.post('/api/resend-otp', { email:email }, {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': xsrfToken,
            },
          }
        );

       if (response.status === 200 || response.status === 201) {
          toast.success('OTP resent to your email!');
       }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Error resending OTP.');
      } else {
        toast.error('Unexpected error occurred.');
      }
    } finally {
        setLoading(false);
      }
  };

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
          <p className="login-box-msg">Enter the OTP sent to your email</p>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <InputGroup hasValidation>
                <Form.Control
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  onChange={formik.handleChange}
                  value={formik.values.otp}
                  isValid={formik.touched.otp && !formik.errors.otp}
                  isInvalid={formik.touched.otp && !!formik.errors.otp}
                />
                <InputGroup.Text>
                  <i className="fas fa-key" />
                </InputGroup.Text>
                {formik.touched.otp && formik.errors.otp && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.otp}
                  </Form.Control.Feedback>
                )}
              </InputGroup>
            </div>

            <div className="row">
              <div className="col-7">
                <button
                  type="button"
                  onClick={resendOtp}
                  className="btn btn-link p-0"
                >
                  Resend OTP
                </button>
              </div>
              <div className="col-5">
            <Button
                  onClick={formik.submitForm}
                  loading={loading}
                  disabled={loading}
                >
                  Verify OTP
                </Button>
              </div>
            </div>
          </form>
          <Link to="/register" className="text-center d-block mt-3">
            Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
