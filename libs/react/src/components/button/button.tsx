import React, { CSSProperties, ReactElement } from 'react';
import { IconLoadingDark, IconLoadingLight } from '@pui/icons';
import { componentClassNames } from '../../shared/class-util';

import './button.scss';

export interface Props {
  // 组件属性 //

  /** 类名 */
  className?: string;
  /** 子组件 */
  children?: React.ReactNode;
  /** 样式 */
  style?: CSSProperties;
  /** 类型 */
  type?: 'default' | 'primary' | 'secondary' | 'text';
  /** 大小 */
  size?: 'large' | 'middle' | 'small';
  /** 图标 */
  icon?: ReactElement;
  /** 是否加载中 */
  loading?: boolean;
  /** 是否禁用 */
  disabled?: boolean;

  // 组件事件 //

  /* 点击事件 */
  onClick?: React.MouseEventHandler;
  onMouseDown?: React.MouseEventHandler;
}

/**
 * Primary UI component for user interaction
 */
const Button = ({
  className,
  children,
  style,
  type = 'default',
  size = 'middle',
  icon,
  loading = false,
  disabled = false,
  onClick,
  onMouseDown
}: Props) => {
  let paddingStyle = {};
  if (!children) {
    paddingStyle = { padding: '0 11px' };
  } else if (icon || loading) {
    paddingStyle = { paddingLeft: '11px' };
  }

  return (
    <button
      type="button"
      className={componentClassNames('pui-button', { type, size }, className)}
      style={{ ...paddingStyle, ...style }}
      onClick={onClick}
      onMouseDown={onMouseDown}
      disabled={disabled || loading}
    >
      {loading && (
        <span className="pui-button-icon">
          {type === 'default' && (
            <IconLoadingLight className="pui-spin" style={{ color: 'transparent' }} />
          )}
          {(type === 'primary' || type === 'secondary') && (
            <IconLoadingDark className="pui-spin" style={{ color: 'transparent' }} />
          )}
          {type === 'text' && (
            <IconLoadingLight className="pui-spin" style={{ color: 'transparent' }} />
          )}
        </span>
      )}
      {icon && !loading && <span className="pui-button-icon">{icon}</span>}
      {children}
    </button>
  );
};

export { Button };