import { Button } from "antd";
import React from "react";
import buttonClass from "styles/Button.module.css";

type Props = {
  createVault: () => void;
};

export default function Footer({ createVault }: Props) {
  return (
    <div>
      {/* <Button
        className={[buttonClass.button, buttonClass.confirm].join(" ")}
        onClick={onOk}
      >
        Create
      </Button>
      <Button
        className={[buttonClass.button, buttonClass.cancel].join(" ")}
        onClick={onCancel}
      >
        Cancel
      </Button> */}
      <Button className={[buttonClass.button, buttonClass.cancel].join(" ")} onClick={createVault}>
        createVault
      </Button>
    </div>
  );
}
