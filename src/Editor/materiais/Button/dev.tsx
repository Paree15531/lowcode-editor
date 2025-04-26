import { Button as AntdButton } from "antd";
import { ButtonType } from "antd/es/button";
import { CommonComponentProps } from "../../interface";

const Button = ({ type, text, id, styles }: CommonComponentProps) => {
  return (
    <AntdButton style={styles} data-component-id={id} type={type}>
      {text}
    </AntdButton>
  );
};

export default Button;
