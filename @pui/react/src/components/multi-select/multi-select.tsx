import ReactDOM from 'react-dom'
import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'
import classNames from 'classnames'
import { IconArrowHeadDown, IconErrorFilled, IconSearch } from '@pui/icons'

import { FormErrorText } from '../error-text/error-text'
import { componentClassNames } from '../../shared/class-util'
import { FormItem, FormItemProps } from '../form/form-item'
import { FormItemLabelProps } from '../form/form'
import { containText, getNodeText } from '../../shared/string-util'
import { supportTouch } from '../../shared/device'
import {
  useDefaultSize,
  useElementPos,
  usePopShowState
} from '../../shared/hooks'
import { CheckBox } from '../checkbox/checkbox'

import './multi-select.scss'

interface MultiSelectOption<T> {
  text: string | ReactNode
  value: T
  disabled?: boolean
}

export interface MultiSelectProps<T> {
  // 组件属性 //

  /** 类名 */
  className?: string

  /** 样式 */
  style?: CSSProperties

  /** 是否禁用 */
  disabled?: boolean

  /** 值 */
  value?: T[]

  /** 大小 */
  size?: 'medium' | 'small'

  /** 默认值 */
  defaultValue?: T[]

  /** 占位符 */
  placeholder?: string

  /** 显示过滤输入框 */
  filterInput?: boolean

  /** 选项 */
  options?: MultiSelectOption<T>[] | T | T[]

  /** 选项style样式 */
  optionsStyle?: CSSProperties

  /** 错误 */
  error?: FormErrorText

  /** 值改变事件 */
  onValueChange?: (value: T[]) => void

  /** 控制菜单打开 */
  defaultOpen?: boolean

  /** 控制菜单打开 */
  open?: boolean

  /** 显示清除按钮 */
  showClearButton?: boolean

  /** 清除按钮是否一直显示 触屏设备默认为true */
  keepClearButton?: boolean

  /** 过滤器选项模式 */
  filterMode?: boolean

  /** 最大宽度 */
  maxWidth?: string

  /** 菜单显示状态改变 */
  onMenuVisibleChange?: (visible: boolean) => void

  /** 标签 */
  label?: string | FormItemLabelProps | ReactNode

  /** 过滤器输入框占位符 */
  filterInputPlaceholder?: string

  /** 在列表显示【全选】选项 */
  showCheckAll?: boolean

  /** 弹出菜单的样式名字 */
  popupMenuClassName?: string
}

// 必须骗下storybook，让它能显示属性列表
// eslint-disable-next-line import/no-mutable-exports
let MultiSelect = <T,>(props: MultiSelectProps<T> & FormItemProps) => {
  return <div>{JSON.stringify(props)}</div>
}

MultiSelect = FormItem(
  <T,>({
    className,
    popupMenuClassName,
    disabled = false,
    value,
    defaultValue,
    error,
    options = [],
    placeholder,
    defaultOpen,
    showClearButton = false,
    keepClearButton = false,
    open,
    filterMode = false,
    maxWidth,
    optionsStyle,
    onMenuVisibleChange,
    filterInput,
    size,
    label = '',
    onValueChange,
    filterInputPlaceholder,
    showCheckAll = true
  }: MultiSelectProps<T>) => {
    const selectState = useState<T[]>(defaultValue || [])
    let selectValue = selectState[0]
    const setSelectValue = selectState[1]
    const [showOptionList, setShowOptionList, puiPopupWrap] = usePopShowState(
      () => {
        if (open === undefined) {
          setMenuOpen(undefined)
        }
      }
    )
    const [filterValue, setFilterValue] = useState('')
    const [filterWord, setFilterWord] = useState('')
    const hasValue = useRef(value !== undefined)
    const [defaultSize] = useDefaultSize()
    size = size || defaultSize
    const isFirstLoad = useRef(true)
    const rootElementRef = useRef<any>(null)
    // 选项框默认最小宽度
    const minWidth = parseInt(`${optionsStyle?.minWidth}`, 10)
    const popMenuRef = useRef<any>(null)
    const [menuPos, updatePos] = useElementPos(
      rootElementRef,
      popMenuRef,
      minWidth
    )
    const [menuOpen, setMenuOpen] = useState(
      open !== undefined ? open : defaultOpen
    )
    const isComposing = useRef(false)
    const isDestroyed = useRef(false)

    if (value) {
      selectValue = value
      hasValue.current = true
    } else if (hasValue.current) {
      hasValue.current = false
      setSelectValue([])
    }

    let selectOptions: MultiSelectOption<T>[] = []
    if (typeof options === 'string') {
      const optionParts = options.split(',')
      optionParts.forEach(optionPart => {
        const optionTextValue = optionPart.split(':')
        selectOptions.push({
          text: optionTextValue[0],
          value: (optionTextValue.length > 1
            ? optionTextValue[1]
            : optionTextValue[0]) as any
        })
      })
    } else if (Array.isArray(options)) {
      if (options.length > 0 && typeof options[0] === 'object') {
        selectOptions = options as MultiSelectOption<T>[]
      } else {
        ;(options as unknown as string[]).forEach(option => {
          selectOptions.push({ text: option + '', value: option as any })
        })
      }
    }

    const displayTextArr: string | ReactNode[] = []
    selectOptions.forEach(option => {
      if (selectValue.includes(option.value)) {
        displayTextArr.push(getNodeText(option.text))
      }
    })

    useEffect(() => {
      if (!isFirstLoad.current) {
        onMenuVisibleChange &&
          onMenuVisibleChange(
            (menuOpen !== undefined ? menuOpen : showOptionList) && !disabled
          )
      }
      isFirstLoad.current = false
    }, [(menuOpen !== undefined ? menuOpen : showOptionList) && !disabled])

    useEffect(() => {
      if (open !== undefined) {
        setMenuOpen(open)
      }
    }, [open])

    const displayText = displayTextArr.join(', ')

    const newKeepClearButton = keepClearButton || supportTouch()

    const labelText =
      (label as any).text !== undefined ? (label as any).text : label

    const filteredOptions = selectOptions.filter(item => {
      if (filterWord) {
        return containText(getNodeText(item.text), filterWord)
      }
      return true
    })

    const allChecked =
      displayTextArr.length >= filteredOptions.length &&
      displayTextArr.length > 0

    const partChecked =
      displayTextArr.length < filteredOptions.length &&
      displayTextArr.length > 0

    useEffect(() => {
      updatePos()
    }, [displayText])

    return (
      <div
        ref={rootElement => {
          isDestroyed.current = rootElement === null
          if (rootElement) {
            rootElementRef.current = rootElement
          }
          if (rootElement && rootElementRef.current === null) {
            updatePos()
            setTimeout(() => {
              if (!isDestroyed.current) {
                updatePos()
              }
            }, 1000)
          }
        }}
        className={componentClassNames(
          'pui-multi-select',
          {
            size,
            disabled: disabled + '',
            active: showOptionList + '',
            error: error ? error.show + '' : 'false',
            'keep-clear-button':
              (showClearButton &&
                newKeepClearButton &&
                !disabled &&
                !!displayText) + '',
            'filter-mode': filterMode + ''
          },
          className
        )}
      >
        <button
          className={classNames(
            'pui-multi-select-input',
            {
              'pui-multi-select-input-placeholder': !displayText && !filterMode
            },
            {
              'pui-multi-select-input-with-clear-button':
                showClearButton && !!selectValue.length && !disabled
            },
            { 'pui-multi-select-input-highlight': displayText && filterMode }
          )}
          type="button"
          onClick={evt => {
            evt.stopPropagation()
            updatePos()
            if (!showOptionList) {
              setFilterValue('')
              setFilterWord('')
            }
            setShowOptionList(!showOptionList)
          }}
          disabled={disabled}
          style={{
            width: filterMode ? 'auto' : '',
            maxWidth: maxWidth + '',
            overflow: maxWidth ? 'hidden' : ''
          }}
        >
          {filterMode ? (
            displayText ? (
              <>
                <span className="pui-multi-select-input-placeholder">
                  {labelText || ''} :
                </span>{' '}
                {displayText}
              </>
            ) : (
              labelText
            )
          ) : (
            displayText || placeholder
          )}
        </button>
        {showClearButton && selectValue.length > 0 && !disabled && (
          <IconErrorFilled
            className="pui-multi-select-clear-icon"
            onClick={evt => {
              setSelectValue([])
              onValueChange && onValueChange([])
              evt.stopPropagation()
              evt.preventDefault()
              setShowOptionList(false)
            }}
          />
        )}

        <IconArrowHeadDown className="pui-multi-select-arrow-icon" />
        {(menuOpen !== undefined ? menuOpen : showOptionList) &&
          !disabled &&
          ReactDOM.createPortal(
            <div
              style={{
                position: 'absolute',
                ...optionsStyle,
                ...menuPos
              }}
              className={`pui-multi-select-size-${size}`}
            >
              <div
                ref={popMenuElem => {
                  if (popMenuElem) {
                    if (popMenuRef.current !== popMenuElem) {
                      popMenuRef.current = popMenuElem
                      setTimeout(() => {
                        updatePos()
                      }, 10)
                    }
                  }
                }}
                className={classNames(
                  'pui-multi-select-list',
                  popupMenuClassName
                )}
                onClick={evt => {
                  evt.stopPropagation()
                }}
              >
                {filterInput && (
                  <>
                    <IconSearch className="pui-multi-select-search-icon" />
                    <input
                      placeholder={filterInputPlaceholder}
                      value={filterValue}
                      onCompositionStart={() => {
                        isComposing.current = true
                      }}
                      onCompositionEnd={(evt: any) => {
                        isComposing.current = false
                        setFilterWord(evt.target.value)
                        setFilterValue(evt.target.value)
                      }}
                      onChange={(evt: any) => {
                        if (!isComposing.current) {
                          setFilterWord(evt.target.value)
                        }
                        setFilterValue(evt.target.value)
                      }}
                      className="pui-multi-select-filter"
                      style={{
                        minWidth: filterMode
                          ? size === 'medium'
                            ? 248
                            : 176
                          : ''
                      }}
                    />
                  </>
                )}
                {filteredOptions.length > 0 && showCheckAll && (
                  <div
                    className="pui-multi-select-option "
                    onClick={() => {
                      const allValues: T[] = []
                      if (!allChecked) {
                        filteredOptions.forEach(item => {
                          allValues.push(item.value)
                        })
                      }
                      setSelectValue(allValues)
                      onValueChange && onValueChange(allValues)
                    }}
                  >
                    <CheckBox
                      className="pui-multi-select-pick"
                      size="small"
                      checked={allChecked}
                      partChecked={partChecked}
                    />
                    全选
                  </div>
                )}
                {filteredOptions.length === 0 && (
                  <div className="pui-multi-select-no-data">暂无数据</div>
                )}
                <div className="pui-multi-select-option-wrap">
                  {filteredOptions.map((option, inx) => (
                    <div
                      key={option.value + ' ' + inx}
                      className={classNames('pui-multi-select-option', {
                        'pui-multi-select-option-selected':
                          selectValue.includes(option.value),
                        'pui-multi-select-option-disabled': option.disabled
                      })}
                      onClick={() => {
                        if (option.disabled === true) {
                          return
                        }
                        if (selectValue.includes(option.value)) {
                          selectValue.splice(
                            selectValue.indexOf(option.value),
                            1
                          )
                        } else {
                          selectValue.push(option.value)
                        }
                        setSelectValue([...selectValue])
                        onValueChange && onValueChange([...selectValue])
                      }}
                    >
                      <CheckBox
                        disabled={option.disabled}
                        className="pui-multi-select-pick"
                        size="small"
                        checked={selectValue.includes(option.value)}
                      />
                      {option.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>,
            puiPopupWrap
          )}
      </div>
    )
  },
  'MultiSelect'
)
export { MultiSelect }
