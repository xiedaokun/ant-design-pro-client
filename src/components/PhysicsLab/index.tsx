import { createStyles } from 'antd-style';
import Matter from 'matter-js';
import React, { useEffect, useRef } from 'react';

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      width: '100%',
      height: '600px',
      position: 'relative',
      overflow: 'hidden',
      background: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      border: `1px solid ${token.colorBorderSecondary}`,
      touchAction: 'pan-y',
    },
    canvas: {
      display: 'block',
      touchAction: 'pan-y',
    },
  };
});

const PhysicsLab: React.FC = () => {
  const { styles } = useStyles();
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!sceneRef.current || !canvasRef.current) return;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
    } = Matter;

    // 创建引擎
    const engine = Engine.create();
    const world = engine.world;

    // 创建渲染器
    const render = Render.create({
      element: sceneRef.current,
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: 600,
        background: 'transparent',
        wireframes: false,
      },
    });

    Render.run(render);

    // 创建运行器
    const runner = Runner.create();
    Runner.run(runner, engine);

    const width = sceneRef.current.clientWidth;
    const height = 600;

    // 边界 - 设置 1000px 厚度以防止高速拖拽时图形由于“隧道效应”逃逸
    const wallThickness = 1000;
    const ground = Bodies.rectangle(
      width / 2,
      height + wallThickness / 2,
      width + wallThickness * 2,
      wallThickness,
      {
        isStatic: true,
        render: { visible: false },
      },
    );
    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height + wallThickness * 2,
      {
        isStatic: true,
        render: { visible: false },
      },
    );
    const rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height + wallThickness * 2,
      {
        isStatic: true,
        render: { visible: false },
      },
    );
    const ceiling = Bodies.rectangle(
      width / 2,
      -wallThickness / 2,
      width + wallThickness * 2,
      wallThickness,
      {
        isStatic: true,
        render: { visible: false },
      },
    );

    // 根据设计稿更新后的配置：包含精确的颜色和布局布局
    const config = [
      {
        text: '加入我们的 Discord 社区',
        color: '#55EF95',
        type: 'capsule',
        x: 160,
        y: 400,
        rotate: Math.PI / 2,
      },
      {
        text: '订阅 Labs 新闻动态',
        color: '#55EF95',
        type: 'capsule',
        x: 195,
        y: 400,
        rotate: Math.PI / 2,
      },
      {
        text: '在 X 上关注 Labs',
        color: '#55EF95',
        type: 'capsule',
        x: 930,
        y: 200,
        rotate: 1.2,
      },
      {
        text: '成为受信任的测试员',
        color: '#55EF95',
        type: 'capsule',
        x: 960,
        y: 150,
        rotate: 1.2,
      },
      {
        text: '',
        color: '#64A3FF',
        type: 'squiggle',
        radius: 150,
        sides: 12,
        x: 100,
        y: height - 150,
      },
      {
        text: '',
        color: '#FFAAFF',
        type: 'squiggle',
        radius: 160,
        sides: 8,
        x: 320,
        y: height - 180,
      },
      { text: '', color: '#D4E157', type: 'flower', x: 450, y: height - 250 },
      { text: '', color: '#9797FF', type: 'circle', x: 650, y: height - 150 },
      { text: '', color: '#FF8A50', type: 'flower', x: 800, y: height - 200 },
      { text: '', color: '#FFFF00', type: 'hexagon', x: 920, y: height - 120 },
    ];

    const shapes: Matter.Body[] = [];

    config.forEach((item) => {
      let body: Matter.Body | undefined;
      const x = (item.x / 1000) * width; // 相对定位计算
      const y = item.y;

      if (item.type === 'capsule') {
        body = Bodies.rectangle(x, y, 320, 54, {
          // 根据需求大幅增加尺寸至 320x54
          chamfer: { radius: 27 },
          render: {
            fillStyle: item.color,
          },
          angle: item.rotate || 0,
          label: item.text,
        });
      } else if (item.type === 'circle') {
        body = Bodies.circle(x, y, 150, {
          // 尺寸增加至 150
          render: { fillStyle: item.color },
        });
      } else if (item.type === 'squiggle') {
        // 创建多边形并通过大半径倒角模拟设计稿中的波浪边缘效果
        body = Bodies.polygon(
          x,
          y,
          (item as any).sides || 12,
          (item as any).radius || 120,
          {
            chamfer: { radius: 40 },
            render: { fillStyle: item.color },
          },
        );
      } else if (item.type === 'flower') {
        // 设计稿中的四瓣花形状
        body = Bodies.polygon(x, y, 4, 170, {
          // 尺寸增加至 170
          chamfer: { radius: 90 },
          render: { fillStyle: item.color },
        });
      } else if (item.type === 'hexagon') {
        body = Bodies.polygon(x, y, 6, 170, {
          // 尺寸增加至 170
          render: { fillStyle: item.color },
        });
      }

      if (body) shapes.push(body);
    });

    Composite.add(world, [ground, leftWall, rightWall, ceiling, ...shapes]);

    // 自定义渲染：在胶囊上绘制文本
    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context;
      context.font = 'bold 15px Inter, -apple-system, sans-serif'; // 为大尺寸胶囊增加字号
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#000000'; // 对应设计稿，改回黑色对比度更好

      shapes.forEach((body) => {
        if (body.label && body.label !== 'Body') {
          context.save();
          context.translate(body.position.x, body.position.y);
          context.rotate(body.angle);
          context.fillText(body.label, 0, 0);
          context.restore();
        }
      });
    });

    // 添加鼠标控制
    const mouse = Mouse.create(render.canvas);

    // 允许通过移除 Matter.js 的 wheel 监听器来恢复页面滚动
    // Matter.js 默认会捕获鼠标滚轮事件并阻止页面滚动
    const mouseElement = mouse.element;

    // 显式解绑 Matter.js 在 Mouse.create 中绑定的 wheel 事件
    mouseElement.removeEventListener('mousewheel', (mouse as any).mousewheel);
    mouseElement.removeEventListener(
      'DOMMouseScroll',
      (mouse as any).mousewheel,
    );
    mouseElement.removeEventListener('wheel', (mouse as any).mousewheel);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(world, mouseConstraint);

    // 保持鼠标与渲染同步
    render.mouse = mouse;

    // 处理全局 mouseup 以防止鼠标在画布外松开时产生的“粘滞”拖拽问题
    const handleGlobalMouseUp = () => {
      if (mouse.button === 0 || mouse.button === -1) {
        // @ts-expect-error - 访问内部状态强制释放
        mouse.button = -1;
        // @ts-expect-error
        mouse.sourceEvents.mousedown = null;
        // @ts-expect-error
        mouse.sourceEvents.mouseup = null;
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);

    // 大小重调处理
    const handleResize = () => {
      if (!sceneRef.current || !canvasRef.current) return;
      const newWidth = sceneRef.current.clientWidth;

      render.options.width = newWidth;
      canvasRef.current.width = newWidth;

      Matter.Body.setPosition(ground, {
        x: newWidth / 2,
        y: height + wallThickness / 2,
      });
      Matter.Body.setPosition(rightWall, {
        x: newWidth + wallThickness / 2,
        y: height / 2,
      });
      Matter.Body.setPosition(ceiling, {
        x: newWidth / 2,
        y: -wallThickness / 2,
      });
      Matter.Body.setPosition(leftWall, {
        x: -wallThickness / 2,
        y: height / 2,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div className={styles.container} ref={sceneRef}>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
};

export default PhysicsLab;
