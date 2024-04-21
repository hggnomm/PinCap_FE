import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Form, Input, Row, notification } from 'antd';
import { login } from '../../api/auth';
import { useDispatch } from 'react-redux';
import { addToken } from '../../store/authSlice';

const Login = () => {
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  // When sign in success
  const onLogin = async (values) => {
    try {
      const data = await login(values);
      console.log(data)
      
      dispatch(addToken(data.token))
      localStorage.setItem('token', data.token);
      window.location.reload(true)
      
    } catch (e) {
      api.open({
        message: 'Login Failed',
        onClose: close,
      });
    }
  }

  return (
    <Col>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onLogin}
        autoComplete="off"
        className='form-login'
      >
        {contextHolder}
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',

            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input
            prefix={<MailOutlined type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className='btn-login'>
            SIGN IN
          </Button>
        </Form.Item>
      </Form>

      {/* another choice */}
      {/* <Row>
        <Divider >Sign in with</Divider>

        <form
          className='btn-login-social'
          method='POST'
          action={import.meta.env.VITE_GOOGLE_AUTH}
        >
          <Input
            type='hidden'
            name='scope'
            value={import.meta.env.VITE_DTMS_GOOGLE_API}
          />
          <Button className='btn-login-icon' htmlType='submit'>
            <img src={GoogleLogo} alt="" />
            <span style={{ margin: '10px' }}>
              Continue with Google
            </span>
          </Button>
        </form>

        <form
          className='btn-login-social'
          method='POST'
          action={import.meta.env.VITE_AZURE_AUTH}
        >
          <Input
            type='hidden'
            name='scope'
            value={import.meta.env.VITE_DTMS_GOOGLE_API}
          />
          <Button className='btn-login-icon btn-fpt' htmlType='submit'>
            <img src={FptLogo} alt="" />
            <span style={{ margin: '10px' }}>Continue with FPT account</span>
          </Button>
        </form>

      </Row> */}
    </Col>
  )
};
export default Login;