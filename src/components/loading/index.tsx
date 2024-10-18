import { Spin } from 'antd';
import React from 'react';

const Loading = () => (
  <div style={{ textAlign: 'center', width: '100%', height: '20px' }}>
    <Spin size="large" />
  </div>
);

export default Loading;