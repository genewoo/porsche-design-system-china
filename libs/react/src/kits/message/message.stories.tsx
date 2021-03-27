import React from 'react';
import { MessageType } from './message';
import { withKnobs, text, color, select, number } from '@storybook/addon-knobs';
import { Button, message } from '../../';

const Options: MessageType[] = ['info', 'success', 'error', 'warning', 'loading', 'default'];

export default {
  title: 'General/Message',
  decorators: [withKnobs]
};

export const knobsMessage = () => {
  const se = select<MessageType>('iconType', Options, 'default');
  const op = {
    delay: number('delay', 2000),
    animationDuring: number('animationDuring', 300),
    background: color('background', '#fff'),
    color: color('color', '#333')
  };
  const tx = text('content', 'hello message');
  const onClick = (type: string) => {
    message[type](tx, op);
  };

  return (
    <div>
      <Button onClick={() => onClick('info')} type="default">
        Info
      </Button>
      <Button onClick={() => onClick('warning')} type="primary">
        Warning
      </Button>
      <Button onClick={() => onClick('success')} type="secondary">
        Success
      </Button>
      <Button onClick={() => onClick('error')} type="primary">
        Error
      </Button>
    </div>
  );
};
