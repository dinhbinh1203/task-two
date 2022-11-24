import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import cities from 'hanhchinhvn/dist/tinh_tp.json';
import districts from 'hanhchinhvn/dist/quan_huyen.json';
import wards from 'hanhchinhvn/dist/xa_phuong.json';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Form, Select, Row, Col, Input, Space } from 'antd';

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

const FormTravel = ({
  name,
  form,
  remove,
  fields,
  fieldKey,
  checkSubmit,
  field,
}) => {
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

  return (
    <Space
      key={fieldKey}
      style={{ display: 'flex', marginBottom: 8 }}
      align="baseline"
    >
      <Form.Item
        name={[name, 'first']}
        rules={[{ required: true, message: 'Missing first name' }]}
      >
        <Input placeholder="First Name" />
      </Form.Item>
      <Form.Item
        name={[name, 'last']}
        rules={[{ required: true, message: 'Missing last name' }]}
      >
        <Input placeholder="Last Name" />
      </Form.Item>
      <MinusCircleOutlined onClick={() => remove(name)} />
    </Space>
  );
};

export default FormTravel;

// <MinusCircleOutlined onClick={() => remove(name)} />
