import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import React from 'react';

const TestPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Typography.Title level={2}>测试页</Typography.Title>
        <Typography.Paragraph>这是一个基础的测试页面。</Typography.Paragraph>
      </Card>
    </PageContainer>
  );
};

export default TestPage;
