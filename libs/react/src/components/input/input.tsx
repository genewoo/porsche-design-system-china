import React, {
  ChangeEventHandler,
  FocusEventHandler,
  CSSProperties,
  useEffect,
  useRef,
  useState
} from 'react'
import { IconErrorFilled, IconView, IconViewOff } from '@pui/icons'
import { componentClassNames } from '../../shared/class-util'
import { FormItem } from '../form/form-item'
import { FormErrorText } from '../error-text/error-text'

import './input.scss'

export interface InputProps {
  /* 类名 */
  className?: string

  /* 样式 */
  style?: CSSProperties

  /* 类型 */
  type?: 'text' | 'password'

  /* 默认输入值 */
  defaultValue?: string

  /* 输入值 */
  value?: string

  /* 占位符 */
  placeholder?: string

  /* 最多输入字符数 */
  maxLength?: number

  /* 错误 */
  error?: FormErrorText

  /* 是否禁用 */
  disabled?: boolean

  /* 控件值改变事件 */
  onChange?: ChangeEventHandler<HTMLInputElement>

  /* 输入框失去焦点事件 */
  onBlur?: FocusEventHandler<HTMLInputElement>

  /* 输入框获取焦点事件 */
  onFocus?: FocusEventHandler<HTMLInputElement>

	/* 回车事件 */
	onEnter?: (value: string) => void

  /* 值改变事件 */
  onValueChange?: (value: string) => void

  /* 显示清除按钮 */
  showClearButton?: boolean

  /* 显示密码按钮 */
  showViewPasswordButton?: boolean
}

/**
 * Primary UI component for user interaction
 */
const Input = FormItem(
  ({
    className,
    type = 'text',
    placeholder,
    maxLength,
    disabled = false,
    defaultValue,
    value,
    onChange,
    error,
    onValueChange,
    onBlur,
    onFocus,
		onEnter,
    showClearButton,
    showViewPasswordButton
  }: InputProps) => {
    const [valueLength, setValueLength] = useState(0)
    const [inputType, setInputType] = useState(type)
    const inputReference = useRef<HTMLInputElement>()

    useEffect(() => {
      setInputType(type)
    }, [type])

    return (
      <div
        className={componentClassNames('pui-input', {
          error: error ? error.show + '' : 'false',
          'show-right-button': (showClearButton || showViewPasswordButton) + ''
        })}
      >
        <input
          ref={(inputRef: HTMLInputElement) => {
            inputReference.current = inputRef
            if (inputRef && maxLength) {
              inputRef.style.paddingRight =
                (maxLength + '').length * 23 + 12 + 'px'
            }
          }}
          placeholder={placeholder}
          maxLength={maxLength}
          type={inputType}
          onChange={evt => {
            onChange && onChange(evt)
            onValueChange && onValueChange(evt.target.value)
          }}
          disabled={disabled}
          value={value}
          className={className}
          defaultValue={defaultValue}
          onInput={event => {
            const inputLength = (event.target as any).value.length
            if (maxLength) {
              setValueLength(inputLength < maxLength ? inputLength : maxLength)
            }
            if (showClearButton) {
              setValueLength(inputLength)
            }
          }}
          onBlur={onBlur}
          onFocus={onFocus}
					onKeyDown={event => {
						if (event.key === 'Enter') {
							const target = event.target as HTMLInputElement;
							onEnter && onEnter(target.value);
						}
					}}
        />
        {maxLength && !showClearButton && !showViewPasswordButton && (
          <div className="pui-input-char-count">
            {valueLength > 0 && valueLength}
            <span>
              {valueLength === 0 && valueLength}/{maxLength}
            </span>
          </div>
        )}
        {showClearButton && valueLength > 0 && (
          <IconErrorFilled
            className="pui-input-right-button pui-input-clear"
            onClick={() => {
              inputReference.current!.value = ''
              onChange && onChange({ target: inputReference.current } as any)
              onValueChange && onValueChange('')
              setValueLength(0)
            }}
          />
        )}
        {showViewPasswordButton &&
          type === 'password' &&
          (inputType === 'password' ? (
            <IconView
              onClick={() => {
                setInputType('text')
              }}
              className="pui-input-right-button pui-input-view"
            />
          ) : (
            <IconViewOff
              onClick={() => {
                setInputType('password')
              }}
              className="pui-input-right-button pui-input-view"
            />
          ))}
      </div>
    )
  }
)
;(Input as any).displayName = 'Input'
export { Input }
