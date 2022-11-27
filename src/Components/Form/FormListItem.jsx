import React, { useEffect } from 'react';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Form, Select, Row, Col } from 'antd';
import { validateFormList } from '../../Page/Test';
const { Option } = Select;

const city1 = [
  { id: 1, name: 'HN' },
  { id: 2, name: 'HCM' },
];
const district1 = [
  { id: 3, name: 'DD', parent: 1 },
  { id: 4, name: 'BV', parent: 1 },
];
const district2 = [
  { id: 5, name: 'Q1', parent: 2 },
  { id: 6, name: 'Q2', parent: 2 },
];
const ward1 = [
  { id: 7, name: 'Phường 3', parent: 5 },
  { id: 8, name: 'Phường 4', parent: 5 },
];
const ward2 = [
  { id: 9, name: 'Hàng chè', parent: 3 },
  { id: 10, name: 'Hàng vải', parent: 3 },
];
const FormListItem = ({
  name,
  form,
  fields,
  remove,
  fieldIndex,
  isListField,
}) => {
  let [city, setCity] = React.useState(city1);
  let [district, setdistrict] = React.useState(() => [
    ...district1,
    ...district2,
  ]);
  let [ward, setWard] = React.useState(() => [...ward2, ...ward1]);

  const checkAddressExactly = (name) => {
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

  const handleCityChange = (value, option, fieldIndex) => {
    let currentDistrict = form.getFieldValue(['travel', name, 'district']);
    form.setFieldValue(['travel', fieldIndex, 'district'], null);
    form.setFieldValue(['travel', fieldIndex, 'ward'], null);

    setdistrict(value === 'HN' ? district1 : district2);
    validateFormList(form, currentDistrict ? fieldIndex : undefined, true);
  };

  const handleDistrictChange = (value, option, fieldIndex) => {
    let currentWard = form.getFieldValue(['travel', name, 'ward']);
    form.setFieldValue(['travel', fieldIndex, 'ward'], null);
    setWard(value === 'DD' ? ward2 : ward1);
    validateFormList(form, currentWard ? fieldIndex : undefined, true);
  };
  const onRemove = (fieldIndex) => {
    remove(fieldIndex);
  };

  // useEffect(() => {
  //   let values = form.getFieldsValue(['travel'])
  //   console.log("fields123", fields, name,values);
  // }, [fields]);

  return (
    <Row gutter={16}>
      <Col span={7}>
        <Form.Item
          isListField={isListField}
          name={[fieldIndex, 'city']}
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
            onChange={(value, option) =>
              handleCityChange(value, option, fieldIndex)
            }
          >
            {city.map((item, index) => (
              <Option value={item.name} key={item.name} compare={item.code}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={7}>
        <Form.Item
          isListField={isListField}
          dependencies={['city']}
          name={[fieldIndex, 'district']}
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
              handleDistrictChange(value, option, fieldIndex)
            }
          >
            {district.map((item, index) => (
              <Option value={item.name} key={item.name} compare={item.code}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={7}>
        <Form.Item
          isListField={isListField}
          dependencies={['district']}
          name={[fieldIndex, 'ward']}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập phường xã',
            },
            () => ({
              validator(_, value) {
                if (checkAddressExactly(fieldIndex) || !value) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(
                    new Error('Địa chỉ không được giống nhau'),
                  );
                }
              },
            }),
          ]}
        >
          <Select
            justify="start"
            align="start"
            showSearch
            placeholder="Phường/xã"
          >
            {ward.map((item) => (
              <Option value={item.name} key={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={3}>
        {fields.length > 1 && (
          <MinusCircleOutlined onClick={() => onRemove(fieldIndex)} />
        )}
      </Col>
    </Row>
  );
};

export default React.memo(FormListItem);
