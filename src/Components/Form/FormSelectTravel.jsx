import React, { useState } from 'react';
import 'antd/dist/antd.css';
import cities from 'hanhchinhvn/dist/tinh_tp.json';
import districts from 'hanhchinhvn/dist/quan_huyen.json';
import wards from 'hanhchinhvn/dist/xa_phuong.json';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Form, Space, Select } from 'antd';

const { Option } = Select;

const FormSelectTravel = ({ name, restField, form, remove }) => {
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

  return (
    <>
      <Space style={{ display: 'flex', marginBottom: 1 }} align="baseline">
        <Form.Item
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
            showSearch
            placeholder="Quận/Huyện"
            onChange={(value, option) =>
              handleDistrictChange(value, option, name)
            }
            onDropdownVisibleChange={onCallApiDistrict}
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

        <Form.Item
          dependencies={['district']}
          name={[name, 'ward']}
          rules={[
            {
              required: true,
              message: 'Vui lòng phường/xã',
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Phường/xã"
            onDropdownVisibleChange={onCallApiWard}
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
        {name !== 0 && <MinusCircleOutlined onClick={() => remove(name)} />}
      </Space>
    </>
  );
};

export default FormSelectTravel;
