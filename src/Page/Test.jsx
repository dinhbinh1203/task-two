import React from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import FormListItem from '../Components/Form/FormListItem';

export const validateFormList = (form, fieldIndex, reValidate) => {
  let fields = form.getFieldValue('travel');
  console.log('validateFormList', reValidate, fieldIndex);
  let fieldsWillValidate = fields.reduce((result, item, index) => {
    if (fieldIndex >= 0 && reValidate) {
      if (fieldIndex === index) {
        if (item?.city) result.push(['travel', index, 'city']);
        result.push(['travel', index, 'district']);
        result.push(['travel', index, 'ward']);
      } else {
        if (item?.city) result.push(['travel', index, 'city']);
        if (item?.district) result.push(['travel', index, 'district']);
        if (item?.ward) result.push(['travel', index, 'ward']);
      }
    } else {
      if (item?.city) result.push(['travel', index, 'city']);
      if (item?.district) result.push(['travel', index, 'district']);
      if (item?.ward) result.push(['travel', index, 'ward']);
    }
    return result;
  }, []);
  form.validateFields(fieldsWillValidate);
};

const Test = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    form.resetFields();
    console.log('Received values of form:', values);
  };

  const onFieldChange = (fieldChanged) => {
    // console.log(fieldChanged);
  };
  const onValuesChange = (valueChanged) => {
    // let changeField = Object.keys(valueChanged)[0];
    // console.log("onValuesChange", valueChanged, changeField);
  };

  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    console.log({ values, errorFields, outOfDate });
  };

  return (
    <Form
      onFieldsChange={onFieldChange}
      onValuesChange={onValuesChange}
      onFinishFailed={({ values, errorFields, outOfDate }) => {
        console.log({ values, errorFields, outOfDate });
      }}
      form={form}
      name="testform"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="username"
        label="Tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
      >
        <Input />
      </Form.Item>

      <Form.List
        name="travel"
        initialValue={[{}]}
        rules={[
          () => ({
            validator(_, values) {
              validateFormList(form);
              return Promise.resolve();
            },
          }),
        ]}
      >
        {(fields, { add, remove }, { errors }) => {
          console.log(fields);
          return (
            <>
              {fields.map(({ key, name, isListField }) => (
                <FormListItem
                  key={key}
                  name={name}
                  fieldIndex={name}
                  isListField={isListField}
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
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => console.log * 'submit'}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Test;
