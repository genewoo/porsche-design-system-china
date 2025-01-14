import React, {
  ReactNode,
  useMemo,
  useState,
  useEffect,
  useCallback
} from 'react'
import {
  IconInformationFilled,
  IconClose,
  IconCorrectFilled,
  IconWarningFilled,
  IconErrorFilled
} from '@pui/icons'
import { renderNode, unmountNode } from '../../shared/render-utils'
import './message.scss'
import { useDefaultSize } from '../../shared/hooks'

export type MessageType = 'info' | 'success' | 'error' | 'warning'

export interface MessageConfig {
  /** 挂载点 */
  mount: HTMLElement

  /** 动画延迟时间 */
  delay: number

  /** 结束后回调 */
  callback?: () => void

  /** 底色 */
  background: string

  /** 文字颜色 */
  color: string

  /** 是否手动关闭 */
  closable: boolean

  /** 最多显示多少个 */
  maxCount: number

  /** 大小 */
  size?: 'small' | 'medium'
}

const defaultConfig: MessageConfig = {
  mount: document.body,
  delay: 2000,
  closable: false,
  background: '',
  color: '',
  maxCount: 5,
  size: undefined
}

let wrap: HTMLElement
export const createMessage = (type: MessageType) => {
  return (content: ReactNode, config: Partial<MessageConfig> = {}) => {
    const fconfig = { ...defaultConfig, ...config }
    if (!wrap) {
      // 如果有的话，说明已经调用过这个函数了，这个空div就可以一直复用
      wrap = document.createElement('div')
      wrap.style.cssText = `line-height: 1.5;
      text-align: center;
      color: #333;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      list-style: none;
      position: fixed;
      z-index: 100000;
      width: 100%;
      top: 16px;
      left: 0;
      pointer-events: none;
      `
      if (wrap) {
        fconfig.mount.appendChild(wrap)
      }
    }

    const div = document.createElement('div')
    div.style.pointerEvents = 'none'

    wrap.appendChild(div)
    ;(div as any).closable = fconfig.closable
    if (wrap.childNodes.length > fconfig.maxCount) {
      for (const node of wrap.childNodes as any) {
        if ((node as any).style.display !== 'none') {
          if (!(node as any).closable) {
            ;(node as any).style.display = 'none'
          } else {
            wrap.removeChild(node)
          }
          break
        }
      }
    }

    renderNode(
      <MessageBox
        rootDom={wrap}
        parentDom={div}
        content={content}
        fconfig={fconfig}
        iconType={type}
      />,
      div
    )
  }
}

export type MessageProps = {
  rootDom: HTMLElement
  parentDom: Element | DocumentFragment
  content: ReactNode
  fconfig: MessageConfig
  iconType: MessageType
}

export function MessageBox(props: MessageProps) {
  const { rootDom, parentDom, content, fconfig, iconType } = props
  const [close, setClose] = useState(false)
  const [defaultSize] = useDefaultSize()
  fconfig.size = defaultSize

  const unmount = useMemo(() => {
    return () => {
      if (parentDom && rootDom) {
        unmountNode(parentDom)
        rootDom.removeChild(parentDom)
      }
    }
  }, [parentDom, rootDom])

  useEffect(() => {
    let timer1: number
    let timer2: number
    if (!fconfig.closable) {
      // 自动关闭
      const closeStart = fconfig.delay - 0.2 * 1000
      // 关闭动画
      timer1 = window.setTimeout(
        () => {
          setClose(true)
        },
        closeStart > 0 ? closeStart : 0
      )
      // 卸载
      timer2 = window.setTimeout(() => {
        setClose(false)
        unmount()
        if (fconfig.callback) {
          fconfig.callback()
        }
      }, fconfig.delay)
    }
    return () => {
      window.clearTimeout(timer1)
      window.clearTimeout(timer2)
    }
  }, [unmount, fconfig])

  // 手动卸载
  const handleClose = useCallback(() => {
    if (fconfig.closable) {
      setClose(true)
      setTimeout(() => {
        unmount()
        if (fconfig.callback) {
          fconfig.callback()
        }
      }, 200)
    }
  }, [fconfig, unmount])

  return (
    <div className={`pui-message  ${close ? 'close' : 'open'}-animate`}>
      <span
        className={`message-text ${iconType} message-text-size-${fconfig.size}`}
      >
        {props.iconType === 'info' && <IconInformationFilled />}
        {props.iconType === 'success' && <IconCorrectFilled />}
        {props.iconType === 'warning' && <IconWarningFilled />}
        {props.iconType === 'error' && <IconErrorFilled />}
        <span className="text-content">{content}</span>
        {fconfig.closable && (
          <IconClose
            style={{
              fontSize: fconfig.size === 'medium' ? '24px' : '20px',
              pointerEvents: 'auto'
            }}
            onClick={handleClose}
          />
        )}
      </span>
    </div>
  )
}

export const Message = {
  info(content: ReactNode, config: Partial<MessageConfig> = {}) {
    createMessage('info')(content, config)
  },
  success(content: ReactNode, config: Partial<MessageConfig> = {}) {
    createMessage('success')(content, config)
  },
  warning(content: ReactNode, config: Partial<MessageConfig> = {}) {
    createMessage('warning')(content, config)
  },
  error(content: ReactNode, config: Partial<MessageConfig> = {}) {
    createMessage('error')(content, config)
  },
  pop(
    type: MessageType,
    content: ReactNode,
    config: Partial<MessageConfig> = {}
  ) {
    createMessage(type)(content, config)
  }
}
