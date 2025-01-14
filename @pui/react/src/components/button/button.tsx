import React, { CSSProperties, ReactElement, useContext } from 'react'
import { IconAdd } from '@pui/icons'
import classNames from 'classnames'
import { useDefaultSize } from '../../shared/hooks'
import { componentClassNames, isReactElement } from '../../shared/class-util'

import './button.scss'
import { FormContext, overrideProps } from '../form/form'

type PUIIcon = typeof IconAdd

type Compute<T extends {}> = {
  [K in keyof T]: T[K]
}

interface DefaultButtonProps
  extends React.ForwardRefRenderFunction<HTMLButtonElement> {
  // 组件属性 //

  /** 类名 */
  className?: string

  /** 子组件 */
  children?: React.ReactNode

  /** 样式 */
  style?: CSSProperties

  /** 类型 */
  type?: 'default' | 'primary' | 'secondary' | 'text' | 'link'

  /** 大小 */
  size?: 'medium' | 'small' | 'tiny'

  /** 图标 */
  icon?: PUIIcon | ReactElement

  /** 后置图标 */
  suffixIcon?: PUIIcon | ReactElement

  /** 是否加载中 */
  loading?: boolean

  /** 是否禁用 */
  disabled?: boolean

  /* 是否是表单提交按钮 */
  submit?: boolean

  /* 左边距 */
  marginLeft?: string

  /* 右边距 */
  marginRight?: string

  // 组件事件 //

  /* 点击事件 */
  onClick?: React.MouseEventHandler

  /* 鼠标移入事件 */
  onMouseEnter?: React.MouseEventHandler

  /* 鼠标移出事件 */
  onMouseLeave?: React.MouseEventHandler
}

export type ButtonProps = Compute<DefaultButtonProps>

const Button = (buttonProps: ButtonProps) => {
  const formContext = useContext(FormContext)
  if (formContext) {
    buttonProps = overrideProps('Button', { ...buttonProps }, formContext)
  }

  const {
    className,
    children,
    style,
    type = 'default',
    size,
    icon,
    suffixIcon,
    loading = false,
    disabled = false,
    marginRight,
    marginLeft,
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...rest
  } = buttonProps

  const [defaultSize] = useDefaultSize()
  const newSize = size || defaultSize

  let paddingStyle = {}
  let padding = '11px'
  if (newSize === 'small') {
    padding = '7px'
  } else if (newSize === 'tiny') {
    padding = '5px'
  }

  delete rest.submit

  if (!children || (icon && suffixIcon)) {
    paddingStyle = { padding: '0 ' + padding }
  } else if (icon || loading) {
    paddingStyle = { paddingLeft: padding }
  } else if (suffixIcon) {
    paddingStyle = { paddingRight: padding }
  }

  let loadingSize = 24
  if (newSize === 'small') {
    loadingSize = 20
  } else if (newSize === 'tiny') {
    loadingSize = 16
  }

  const IconComponent = icon as any
  const SuffixIconComponent = suffixIcon as any
  return (
    <button
      type="button"
      className={componentClassNames(
        'pui-button',
        { type, size: newSize },
        className
      )}
      style={{ ...paddingStyle, marginLeft, marginRight, ...style }}
      onClick={evt => {
        if (!loading) {
          onClick && onClick(evt)
        }
      }}
      disabled={disabled || loading}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rest}
    >
      {loading && (
        <span
          className={classNames(
            'pui-button-icon',
            children ? 'pui-button-icon-content' : ''
          )}
        >
          <svg
            height={loadingSize}
            width={loadingSize}
            className="pui-button-loading-svg"
          >
            <circle
              className="pui-button-loading-circle2"
              cx={loadingSize / 2}
              cy={loadingSize / 2}
              r={loadingSize / 4}
            />
            <circle
              className="pui-button-loading-circle"
              cx={loadingSize / 2}
              cy={loadingSize / 2}
              r={loadingSize / 4}
            />
          </svg>
        </span>
      )}

      {icon && !loading && (
        <span
          className={classNames(
            'pui-button-icon',
            children ? 'pui-button-icon-content' : ''
          )}
        >
          {isReactElement(IconComponent) ? IconComponent : <IconComponent />}
        </span>
      )}
      <span className="pui-button-content">{children}</span>
      {suffixIcon && (
        <span
          className={classNames(
            'pui-button-suffix-icon',
            children ? 'pui-button-suffix-icon-content' : ''
          )}
        >
          {isReactElement(SuffixIconComponent) ? (
            SuffixIconComponent
          ) : (
            <SuffixIconComponent />
          )}
        </span>
      )}
    </button>
  )
}

export { Button }
