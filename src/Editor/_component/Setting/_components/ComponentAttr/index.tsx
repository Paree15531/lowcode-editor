import { Form, Input, Select } from "antd";
import { useComponetsStore } from "../../../../stores/components";
import {
  ComponentConfig,
  ComponentSetter,
  useComponentConfigStore,
} from "../../../../stores/component-config";
import { useEffect } from "react";

export function ComponentAttr() {
  const [form] = Form.useForm();

  const { curComponent, curComponentId, updateComponentProps } =
    useComponetsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.props });
  }, [curComponent]);

  if (!curComponent || !curComponent) return null;

  function renderFormElement(setting: ComponentSetter) {
    const { type, options } = setting;
    if (type == "select") {
      return <Select options={options}></Select>;
    } else if (type == "input") {
      return <Input></Input>;
    }
  }

  function valueChange(changeValues: ComponentConfig) {
    if (curComponent) {
      updateComponentProps(curComponentId!, changeValues);
    }
  }

  return (
    <>
      <Form
        form={form}
        onValuesChange={valueChange}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item label="组件id">
          <Input value={curComponent.id} disabled></Input>
        </Form.Item>
        <Form.Item label="组件名称">
          <Input value={curComponent.name} disabled></Input>
        </Form.Item>
        <Form.Item label="组件描述">
          <Input value={curComponent.desc} disabled></Input>
        </Form.Item>
        {componentConfig[curComponent.name]?.setter?.map((setter) => (
          <Form.Item key={setter.name} name={setter.name} label={setter.label}>
            {renderFormElement(setter)}
          </Form.Item>
        ))}
      </Form>
    </>
  );
}
