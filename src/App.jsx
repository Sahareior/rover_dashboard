import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  SlidersOutlined,
  SettingOutlined,
  ThunderboltOutlined,
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
    },
  ];
  return (
    <Layout className="h-screen w-screen bg-[#030712] overflow-hidden text-[#e2e8f0]">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
        width={220}
        className="!bg-[#030712] border-r border-[#00e5ff]/15 relative z-20"
        style={{ background: '#030712' }}
      >
        <div className="px-5 py-5 border-b border-[#00e5ff]/10 flex flex-col gap-1.5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00e5ff]/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-8 h-8 rounded border border-[#00e5ff]/40 bg-[#00e5ff]/10 flex items-center justify-center">
              <ThunderboltOutlined className="text-[#00e5ff] text-sm" />
            </div>
            <div>
              <div className="text-[#00e5ff] font-tech font-bold text-lg tracking-[0.2em] text-neon leading-none">
                AQUATIC_ROV
              </div>
              <div className="text-[8px] text-[#475569] tracking-wider mt-0.5">
                CONTROL UNIT v4.2.1
              </div>
            </div>
          </div>
        
        </div>
        <nav className="p-3 flex flex-col gap-1.5 font-mono">
          <div className="text-[10px] font-tech text-[#475569] tracking-[0.2em] px-3 py-1.5 font-bold">
            NAVIGATION
          </div>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.key;
            return (
              <Link
                key={item.key}
                to={item.key}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold tracking-widest border transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff]/40 text-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.1)]'
                    : 'bg-transparent border-transparent text-[#475569] hover:text-[#94a3b8] hover:border-[#00e5ff]/15 hover:bg-[#111927]/40'
                }`}
              >
                <span className={`transition-colors ${isActive ? 'text-[#00e5ff]' : 'text-[#475569] group-hover:text-[#94a3b8]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1 h-4 rounded-full bg-[#00e5ff]" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 px-5 py-3 border-t border-[#00e5ff]/10 bg-[#030712]">
          <div className="flex items-center justify-between text-[8px] text-[#334155] tracking-wider">
            <span>LAT: 28.5°N</span>
            <span>LON: 77.2°E</span>
          </div>
          <div className="text-[7px] text-[#1e293b] tracking-wider mt-1">
            © 2026 AQUATIC SYSTEMS
          </div>
        </div>
      </Sider>
      <Layout className="!bg-[#030712]">
        <Content className="w-full">
          <div className="h-screen w-full bg-[#030712] hide-scrollbar overflow-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;