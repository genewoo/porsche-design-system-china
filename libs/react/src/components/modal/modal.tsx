import { IconArrowHeadRight, IconClose } from '@pui/icons';
import React, { CSSProperties, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '..';
import { componentClassNames } from '../../shared/class-util';
import './modal.scss';

export interface Props {
  // 组件属性 //
  /** 子组件 */
  children?: React.ReactNode;

  /** 样式 */
  style?: CSSProperties;

  /** 标题 */
  title?: string;

  /** 对话框是否可见 */
  visible?: boolean;

  /** 确认按钮文字 */
  okText?: string;

  /** 取消按钮文字 */
  cancelText?: string;

  // 组件事件 //

  /* 点击确定回调 */
  onOk?: () => void;

  /* 点击遮罩层或右上角叉或取消按钮的回调 */
  onCancel?: () => void;
}

const Modal = ({
  style,
  visible = false,
  title,
  children,
  okText = '确认',
  cancelText = '取消',
  onOk,
  onCancel
}: Props) => {
  const [show, setShow] = useState(visible);
  useEffect(() => {
    setShow(visible);
  }, [visible]);
  return ReactDOM.createPortal(
    <div className={componentClassNames('pui-modal-root', { hide: !show + '' })} style={style}>
      <div className="pui-modal-mask"></div>
      <div className="pui-modal-wrap">
        <div className="pui-modal">
          <div className="pui-modal-content">
            <div
              className="pui-modal-close"
              onClick={() => {
                onCancel && onCancel();
              }}
            >
              <IconClose />
            </div>
            <div className="pui-modal-header">
              <div className="pui-modal-title">{title}</div>
            </div>
            <div className="pui-modal-body">{children}</div>
            <div className="pui-modal-footer">
              <Button onClick={() => onCancel && onCancel()} icon={<IconClose />}>
                {cancelText}
              </Button>{' '}
              <Button type="primary" icon={<IconArrowHeadRight />} onClick={() => onOk && onOk()}>
                {okText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export { Modal };
