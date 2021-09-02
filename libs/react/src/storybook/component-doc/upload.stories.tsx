import React, { useEffect, useState } from 'react'
import { UploadFile } from 'src/components/upload/interface'
import { Upload, Row, Col, Message, Radio, RadioGroup } from '../..'

import './upload.stories.scss'

const action = 'https://develop.porsche-preview.cn/pdc-api-gateway/smamo-rental-service/web/v1/vehicles/image/upload';
const Authorization = 'Bearer 3d4e9571-4f5f-4322-bc1f-8553f8ff4eef';
export default {
  title: 'Data Entry/Upload',
  component: Upload
}

export const UploadStoryBook = () => {
  useEffect(() => {
    const mainStory = document.getElementById(
      'anchor--data-entry-upload--upload-story-book'
    )
    if (mainStory) {
      mainStory.style.display = 'none'
    }
    const mainTitles = document.getElementsByClassName('sbdocs-title')
    if (mainTitles.length > 0) {
      const mainTitle = mainTitles[0] as HTMLElement
      mainTitle.style.marginBottom = '48px'
    }
  })
  return <div />
}
UploadStoryBook.storyName = 'Upload'

export const UploadStoryBook1 = () => {
  const fileList = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'success'
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'error'
    }
  ]

  const onChange = (file: UploadFile) => {
    console.log(file.response?.message)
  }
  const handleBeforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      Message.pop('error', '请上传jpg或png格式的文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Message.pop('error', '文件大小不能超过2M');
    }
    return isJpgOrPng && isLt2M;
  }

  return (
    <>
      <Row>
        <Col span={12}>
          <Upload
            action={action}
            headers={{
              Authorization: Authorization
            }}
            defaultFileList={fileList}
            multiple
            tip="要求文件格式jpg,png, 大小不超过20M"
            onChange={onChange}
            beforeUpload={handleBeforeUpload}
          // accept='.png,.jpg'
          />
        </Col>
        <Col span={12}>
          <Upload
            action={action}
            headers={{
              Authorization: Authorization
            }}
            drag
            multiple
            beforeUpload={handleBeforeUpload}
          />
        </Col>
      </Row>
    </>
  )
}
UploadStoryBook1.storyName = 'Upload Files'

export const UploadStoryBook2 = () => {
  const fileList1 = [
    {
      uid: '-xxx',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-xxx',
      percent: 100,
      name: 'image.png',
      status: 'uploading',
      url:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
  ]
  const fileList2 = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'success',
      url:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ]
  const fileList3 = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'error',
      url:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ]
  const [buttonType, setButtonType] = useState('Default')

  return (
    <>
      <div className="radio-group" style={{ width: '100%' }}>
        <RadioGroup value={buttonType} onValueChange={setButtonType}>
          <Radio text="Default" value="Default" />
          <Radio text="Uploading" value="Uploading" />
          <Radio text="Uploaded" value="Uploaded" />
          <Radio text="Error" value="Error" />
        </RadioGroup>
      </div>
      <div className='upload-component-list'>
        {
          buttonType === 'Default' && <>
            <Upload
              action={action}
              headers={{
                Authorization: Authorization
              }}
              listType="picture-card"
            />
            <Upload
              action={action}
              headers={{
                Authorization: Authorization
              }}
              listType="picture-card"
            />
          </>
        }
        {
          buttonType === 'Uploading' && <div className='uploading-list'>
            <Upload
              action={action}
              headers={{
                Authorization: Authorization
              }}
              listType="picture-card"
              defaultFileList={fileList1}
            />
          </div>
        }
        {
          buttonType === 'Uploaded' && <div className='uploaded-list'>
            <div className='uploaded-tip'>限定数量:当上传照片数到达限制后，上传按钮消失。</div>
            <Upload
              action={action}
              headers={{
                Authorization: Authorization
              }}
              listType="picture-card"
              defaultFileList={fileList2}
              className='list-uploaded'
              count={3}
            />
          </div>
        }
        {
          buttonType === 'Error' && <>
            <Upload
              action={action}
              headers={{
                Authorization: Authorization
              }}
              listType="picture-card"
              defaultFileList={fileList3}
            />
          </>
        }

      </div>
    </>
  )
}
UploadStoryBook2.storyName = 'Upload Pictures'
