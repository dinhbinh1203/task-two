import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import cities from 'hanhchinhvn/dist/tinh_tp.json';
import districts from 'hanhchinhvn/dist/quan_huyen.json';
import wards from 'hanhchinhvn/dist/xa_phuong.json';

import {
  Button,
  DatePicker,
  Form,
  Input,
  Space,
  Select,
  Typography,
  Row,
  Card,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import moment from 'moment';

const { Text } = Typography;

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 0 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 0 },
  },
};

const config = {
  rules: [
    {
      type: 'object',
      required: true,
      message: 'Vui lòng chọn ngày sinh của bạn',
    },
  ],
};

const disabledDate = (current) => {
  return current > moment();
};

const Home = () => {
  const [form] = Form.useForm();

  const [listDistrict, setListDistrict] = useState();
  const [listWard, setListWard] = useState();
  const [selectCity, setSelectCity] = useState();
  const [selectDistrict, setSelectDistrict] = useState();

  const onCallApiDistrict = () => {
    const listDistrict = Object.values(districts);
    const result = listDistrict.filter(
      (district) => district.parent_code === selectCity,
    );

    setListDistrict(result);
  };

  const onCallApiWard = () => {
    const listWard = Object.values(wards);
    const result = listWard.filter(
      (ward) => ward.parent_code === selectDistrict,
    );
    setListWard(result);
  };

  const handleCityChange = (value, option, name) => {
    setSelectCity(option.compare);
    setListDistrict();
    setListWard();

    form.setFieldValue(['travel', name, 'district'], null);
    form.setFieldValue(['travel', name, 'ward'], null);
  };

  const handleDistrictChange = (value, option, name) => {
    setSelectDistrict(option.compare);
    setListWard();
    form.setFieldValue(['travel', name, 'ward'], null);
  };

  const onFinish = (fieldsValue) => {
    form.resetFields();
    const yearCurrent = Number(moment().format('YYYY'));
    const yearBirthDay = Number(fieldsValue['dateOfBirth'].format('YYYY'));
    const age = yearCurrent - yearBirthDay;

    const values = {
      ...fieldsValue,
      dateOfBirth: fieldsValue['dateOfBirth'].format('DD-MM-YYYY'),
      age: age,
    };
    console.log('Received values of form: ', values);
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
          bordered={false}
          style={{
            width: 500,
            borderRadius: '14px',
          }}
        >
          <Form
            name="time_related_controls"
            {...formItemLayout}
            onFinish={onFinish}
            form={form}
          >
            <Text>* Tên</Text>
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input />
            </Form.Item>

            <Text>* Ngày sinh</Text>
            <Form.Item name="dateOfBirth" {...config}>
              <DatePicker disabledDate={disabledDate} />
            </Form.Item>

            <Text>* Địa điểm thường trú</Text>
            <Form.Item
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

            <Text>* Địa mong muốn du lịch</Text>

            <Form.List name="travel">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 1 }}
                      align="baseline"
                    >
                      <Form.Item
                        label=""
                        {...restField}
                        name={[name, 'city']}
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập tỉnh/thành phố',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Tỉnh/Thành phố"
                          onChange={(value, option) =>
                            handleCityChange(value, option, name)
                          }
                        >
                          {Object.values(cities).map((item, index) => (
                            <Option
                              value={item.name}
                              key={index}
                              compare={item.code}
                            >
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name={[name, 'district']}
                        label=""
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập quận/huyện',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Quận/Huyện"
                          onChange={(value, option) =>
                            handleDistrictChange(value, option, name)
                          }
                          onDropdownVisibleChange={onCallApiDistrict}
                        >
                          {listDistrict !== undefined &&
                            listDistrict.map((item, index) => (
                              <Option
                                value={item.name}
                                key={index}
                                compare={item.code}
                              >
                                {item.name}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>

                      <Form.Item label="" name={[name, 'ward']}>
                        <Select
                          placeholder="Phường xã"
                          onDropdownVisibleChange={onCallApiWard}
                        >
                          {listWard !== undefined &&
                            listWard.map((item) => (
                              <Option value={item.name} key={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
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
              )}
            </Form.List>

            <Form.Item
            // wrapperCol={{
            //   xs: { span: 24, offset: 0 },
            //   sm: { span: 16, offset: 8 },
            // }}
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
