/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import '../..'
import './doc.scss'

// @ts-ignore
import Develop from '../../../README.md'

const DevelopPUI = () => (
  <div className="custom-doc">
    <Develop />
  </div>
)

export default {
  title: 'Coding/Develop PUI',
  parameters: {
    docs: {
      page: DevelopPUI
    }
  }
}

export const GettingStartStoryBook = () => {
  return <div>-</div>
}

GettingStartStoryBook.storyName = 'Develop PUI'
