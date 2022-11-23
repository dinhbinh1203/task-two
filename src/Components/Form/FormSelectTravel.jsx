import React, { useState } from 'react';
import 'antd/dist/antd.css';
import cities from 'hanhchinhvn/dist/tinh_tp.json';
import districts from 'hanhchinhvn/dist/quan_huyen.json';
import wards from 'hanhchinhvn/dist/xa_phuong.json';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Form, Select, Row, Col } from 'antd';

const { Option } = Select;

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  str = str.replace(/ + /g, ' ');
  str = str.trim();

  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  return str;
}

const filterOption = (inputValue, option) => {
  return (
    removeVietnameseTones(option.children.toLowerCase()).indexOf(
      removeVietnameseTones(inputValue.toLowerCase()),
    ) !== -1
  );
};

const FormSelectTravel = ({ name, form, remove, fields }) => {
  const checkAddressExactly = (name) => {
    console.log('error', form.getFieldError(['travel']));
    for (let i = 0; i < fields.length; i++) {
      if (
        name !== i &&
        form.getFieldValue(['travel', name, 'ward']) !== undefined &&
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
    }
    return true;
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
    form.setFieldValue(['travel', name, 'district'], undefined);
    form.setFieldValue(['travel', name, 'ward'], undefined);
    onCallApiDistrict(option.compare);
  };

  const handleDistrictChange = (value, option, name) => {
    form.setFieldValue(['travel', name, 'ward'], undefined);
    onCallApiWard(option.compare);
  };

  const handleRemove = () => {
    remove(name);
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
            filterOption={filterOption}
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
            filterOption={filterOption}
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
              message: 'Vui lòng nhập phường xã',
            },
            () => ({
              validator(_, value) {
                // value = form.getFieldValue(['travel', name, 'ward']);

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
            filterOption={filterOption}
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
        {fields.length > 1 && <MinusCircleOutlined onClick={handleRemove} />}
      </Col>
    </Row>
  );
};

export default FormSelectTravel;

// <MinusCircleOutlined onClick={() => remove(name)} />
