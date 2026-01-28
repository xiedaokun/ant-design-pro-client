import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import React from 'react';
import PhysicsLab from '@/components/PhysicsLab';

const TestPage: React.FC = () => {
  return (
    <PageContainer>
      <Card title="Google Labs 物理动效演示" style={{ marginBottom: 24 }}>
        <Typography.Paragraph>
          这是一个通过 Matter.js 实现的 2D 物理引擎演示，仿照 Google Labs
          的页面交互效果。 你可以尝试拖拽、投掷这些形状。
        </Typography.Paragraph>
      </Card>
      <PhysicsLab />
    </PageContainer>
  );
};

export default TestPage;
