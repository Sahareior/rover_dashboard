import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  SlidersOutlined,
  VideoCameraOutlined,
  RadarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Content, Sider } = Layout;

const App = () => {
  const location = useLocation();
   const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/rover-dashboard',
      icon: <SlidersOutlined className="text-base" />,
      label: 'DASHBOARD',
    },
    {
      key: 'settings',
      icon: <SettingOutlined className="text-base" />,
      label: 'SETTINGS',
    }

  ];

  return (
    <Layout className="h-screen w-screen bg-[#030712] overflow-hidden text-[#e2e8f0]">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
        width={240}
        className="!bg-[#030712] border-r border-[#00e5ff]/20 relative z-20"
        style={{ background: '#030712' }}
      >
        <div className="p-6 border-b border-[#00e5ff]/10 flex flex-col gap-1">
          <div className="text-[#00e5ff] font-extrabold text-sm tracking-[0.25em] flex items-center gap-2 text-neon">
            AQUATIC_ROV
          </div>
          <div className="text-[9px] text-[#64748b] tracking-wider">
            SYSTEM CONTROL UNIT v4.0
          </div>
        </div>
        <nav className="p-4 flex flex-col gap-2.5 font-mono">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.key;
            return (
              <Link
                key={item.key}
                to={item.key}
                className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-bold tracking-widest border transition-all duration-300 ${isActive
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                    : 'bg-transparent border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:border-[#00e5ff]/20 hover:bg-[#111927]/30'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </Sider>

      <Layout className="!bg-[#030712]">
        <Content className="w-full">
          <div 
              className="h-[calc(100vh-10px)] w-full bg-white hide-scrollbar overflow-auto"
            style={{
            
            
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;