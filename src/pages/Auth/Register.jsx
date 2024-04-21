import { LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, notification } from 'antd';
import axios from 'axios';
import { register } from '../../api';



const Register = () => {
  const [api, contextHolder] = notification.useNotification();

    const onFinish = async (values) => {
        console.log('Register:', values);
    
        try {
          const response = await register(values)
          console.log(response.data);
          notification.success({
            message: "Register Success",
            description: "..."
          });
        } catch (error) {
          console.log('error', error);
          api.open({
            message: "Can't register",
          });
        }
    };
    return (
        <Col>
          <Form
            name="basic"  
            onFinish={onFinish}
            autoComplete="off"
            className='form-login'
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
              ]}
            >
              <Input 
                prefix={<UserAddOutlined type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Name"
              />
            </Form.Item>

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

            <Form.Item
              name="confirmpassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your confirm password!',
                },
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Confirm Password"
              />
            </Form.Item>
        
            <Form.Item>
              <Button type="primary" htmlType="submit" className='btn-login'>
                REGISTER
              </Button>
            </Form.Item>
            {contextHolder}

          </Form>
        </Col>
    )
  }
export default Register;