import { IconCheck, IconMinus } from '@pui/icons'
import React, {
  ChangeEventHandler,
  CSSProperties,
  useContext,
  useMemo
} from 'react'
import { useDefaultSize } from '../../shared/hooks'
import { componentClassNames } from '../../shared/class-util'
import { FormContext, overrideProps } from '../form/form'
import './checkbox.scss'

export interface CheckBoxProps<T> {
  /** 类名 */
  className?: string

  /** 子组件 */
  children?: React.ReactNode

  /** 样式 */
  style?: CSSProperties

  /** 显示文字 */
  text?: string

  /** 选项值 */
  value?: T

  /** 是否禁用 */
  disabled?: boolean

  /** 大小 */
  size?: 'medium' | 'small'

  /** 表单属性 */
  name?: string

  /** 点击事件 */
  onChange?: ChangeEventHandler<HTMLInputElement>

  /** 值改变事件 */
  onCheckedChange?: (checked: boolean) => void

  /** 是否选定 */
  checked?: boolean

  /** 是否默认选定 */
  defaultChecked?: boolean

  /** 是否是部分选定 */
  partChecked?: boolean
}

/**
 * Primary UI component for user interaction
 */

let idCounter = 0
const generateId = () => {
  idCounter++
  return 'checkbox-' + idCounter
}
const CheckBox = <T,>(checkBoxProps: CheckBoxProps<T>) => {
  const id = useMemo(() => generateId(), [])

  const formContext = useContext(FormContext)
  if (formContext) {
    checkBoxProps = overrideProps('CheckBox', { ...checkBoxProps }, formContext)
  }
  const {
    className,
    text = '',
    value,
    disabled = false,
    size,
    style,
    checked,
    defaultChecked,
    partChecked,
    onChange,
    onCheckedChange
  } = checkBoxProps

  const [defaultSize] = useDefaultSize()
  const newSize = size || defaultSize

  return (
    <label
      htmlFor={id}
      className={componentClassNames(
        'pui-checkbox',
        { disabled: disabled + '', size: newSize },
        className
      )}
      style={style}
    >
      <input
        id={id}
        type="checkbox"
        onChange={evt => {
          onChange && onChange(evt)
          onCheckedChange && onCheckedChange(evt.target.checked)
        }}
        disabled={disabled}
        checked={checked}
        defaultChecked={defaultChecked}
        value={value as any}
      />
      {!partChecked && (
        <span className="pui-checkbox-checkmark">
          <IconCheck style={{ color: 'white' }} />
        </span>
      )}
      <span
        className="pui-checkbox-part-checkmark"
        style={{ opacity: partChecked ? 1 : 0 }}
      >
        <IconMinus style={{ color: 'white' }} />
      </span>
      {text}
    </label>
  )
}

;(CheckBox as any).displayName = 'CheckBox'
export { CheckBox }
