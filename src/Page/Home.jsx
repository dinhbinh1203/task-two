import React from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import { Button, DatePicker, Form, Input, Row, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import FormSelectTravel from '../Components/Form/FormSelectTravel';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const disabledDate = (current) => {
  return current > moment();
};

const Home = () => {
  const [form] = Form.useForm();

  const onFinish = (fieldsValue) => {
    form.resetFields();
    const values = {
      ...fieldsValue,
      dateOfBirth: fieldsValue['dateOfBirth'].format('DD-MM-YYYY'),
    };
    console.log('Received values of form: ', values);
  };

  const handleChangeDateOfBirth = (value) => {
    if (value !== null) {
      const yearCurrent = Number(moment().format('YYYY'));
      const yearBirthDay = Number(value.format('YYYY'));
      const age = yearCurrent - yearBirthDay;
      form.setFieldValue('age', age);
    } else {
      form.setFieldValue('age', null);
    }
  };

  const onValuesChangeForm = (changedValues, allValues) => {
    const valueChange = Object.getOwnPropertyNames(changedValues)[0];

    if (valueChange === 'travel') {
      let arr = [];
      for (let i = 0; i < allValues.travel.length; i++) {
        arr.push(['travel', i, 'ward']);
      }

      form.validateFields(arr);
    }
  };

  return (
    <div
      className="site-card-border-less-wrapper"
      style={{
        backgroundImage: 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)',
      }}
    >
      <Row
        justify="center"
        align="middle"
        style={{
          height: '100vh',
          backgroundSize: 'contain',
        }}
      >
        <Card
          title="ĐĂNG KÝ"
          justify="center"
          align="middle"
          bordered={false}
          style={{
            width: 800,
            borderRadius: '14px',
          }}
        >
          <Form
            name="time_related_controls"
            {...formItemLayout}
            onFinish={onFinish}
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onValuesChange={onValuesChangeForm}
          >
            <Form.Item
              name="username"
              label="Tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <DatePicker
                disabledDate={disabledDate}
                onChange={(value) => handleChangeDateOfBirth(value)}
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>

            <Form.Item name="age" label="Tuổi">
              <Input disabled={true} />
            </Form.Item>

            <Form.Item
              label="Điểm điểm thường trú"
              name="location"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa điểm thường trú!',
                },
              ]}
            >
              <Input
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>

            <Form.Item label="Địa điểm muốn du lịch" required>
              <Form.List name="travel" initialValue={[{}]}>
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map(({ key, name }) => (
                        <FormSelectTravel
                          key={name}
                          name={name}
                          form={form}
                          remove={remove}
                          fields={fields}
                        />
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add field
                        </Button>
                      </Form.Item>
                    </>
                  );
                }}
              </Form.List>
            </Form.Item>

            <Form.Item
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Row>
    </div>
  );
};

export default Home;
