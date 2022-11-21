import React, { useState } from 'react';
import 'antd/dist/antd.css';
import cities from 'hanhchinhvn/dist/tinh_tp.json';
import districts from 'hanhchinhvn/dist/quan_huyen.json';
import wards from 'hanhchinhvn/dist/xa_phuong.json';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Form, Select, Row, Col } from 'antd';

const { Option } = Select;

const FormSelectTravel = ({ name, form, remove, fields }) => {
  const checkAddressExactly = (name) => {
    let i;
    for (i = 0; i < fields.length; i++) {
      if (
        name !== i &&
        // eslint-disable-next-line no-self-compare
        form.getFieldValue(['travel', i, 'city']) ===
          form.getFieldValue(['travel', name, 'city']) &&
        form.getFieldValue(['travel', i, 'district']) ===
          form.getFieldValue(['travel', name, 'district']) &&
        form.getFieldValue(['travel', i, 'ward']) ===
          form.getFieldValue(['travel', name, 'ward'])
      ) {
        return false;
      }
      return true;
    }
  };

  const [listDistrict, setListDistrict] = useState();
  const [listWard, setListWard] = useState();

  const onCallApiDistrict = (city) => {
    const listDistrict = Object.values(districts);
    const result = listDistrict.filter(
      (district) => district.parent_code === city,
    );

    setListDistrict(result);
  };

  const onCallApiWard = (district) => {
    const listWard = Object.values(wards);
    const result = listWard.filter((ward) => ward.parent_code === district);
    setListWard(result);
  };

  const handleCityChange = (value, option, name) => {
    form.setFieldValue(['travel', name, 'district'], null);
    form.setFieldValue(['travel', name, 'ward'], null);
    onCallApiDistrict(option.compare);
  };

  const handleDistrictChange = (value, option, name) => {
    form.setFieldValue(['travel', name, 'ward'], null);
    onCallApiWard(option.compare);
  };

  return (
    <Row gutter={16}>
      <Col span={7}>
        <Form.Item
          name={[name, 'city']}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tỉnh/thành phố',
            },
          ]}
        >
          <Select
            justify="start"
            align="start"
            showSearch
            placeholder="Tỉnh/Thành phố"
            onChange={(value, option) => handleCityChange(value, option, name)}
          >
            {Object.values(cities).map((item, index) => (
              <Option value={item.name} key={index} compare={item.code}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={7}>
        <Form.Item
          dependencies={['city']}
          name={[name, 'district']}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập quận/huyện',
            },
          ]}
        >
          <Select
            justify="start"
            align="start"
            showSearch
            placeholder="Quận/Huyện"
            onChange={(value, option) =>
              handleDistrictChange(value, option, name)
            }
            disabled={!form.getFieldValue(['travel', name, 'city'])}
          >
            {listDistrict !== undefined &&
              listDistrict.map((item, index) => (
                <Option value={item.name} key={index} compare={item.code}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={7}>
        <Form.Item
          dependencies={['district']}
          name={[name, 'ward']}
          rules={[
            {
              required: true,
              message: 'Vui lòng phường/xã',
            },
            () => ({
              validator(_, value) {
                if (checkAddressExactly(name)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Địa chỉ không được giống nhau'),
                );
              },
            }),
          ]}
        >
          <Select
            justify="start"
            align="start"
            showSearch
            placeholder="Phường/xã"
            disabled={!form.getFieldValue(['travel', name, 'district'])}
          >
            {listWard !== undefined &&
              listWard.map((item) => (
                <Option value={item.name} key={item.code}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={3}>
        {fields.length > 1 && (
          <MinusCircleOutlined onClick={() => remove(name)} />
        )}
      </Col>
    </Row>
  );
};

export default FormSelectTravel;
