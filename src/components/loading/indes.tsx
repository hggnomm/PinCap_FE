import { Spin } from 'antd';
import React from 'react';

const Loading = () => (
  <div style={{ textAlign: 'center', width: '100%' }}>
    <Spin size="large" />
  </div>
);

export default Loading;