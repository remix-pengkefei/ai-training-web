import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../types';
import { getEvents } from '../services/api';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && events.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }
    if (isRightSwipe && events.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    }
  };

  const handleViewDetails = () => {
    if (events[currentIndex]) {
      navigate(`/events/${events[currentIndex].id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - 无分割线 */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 flex items-center">
        {/* Logo和文字 */}
        <img src="/logo.png" alt="奇富先知" className="w-10 h-10 rounded-lg mr-3 object-cover" />
        <div>
          <div className="text-lg font-bold text-gray-900">奇富先知</div>
          <div className="text-xs text-gray-500">先进的人，先看到未来</div>
        </div>
      </div>

      {/* 主体内容区域 */}
      <div className="flex-1 relative">
        {events.length === 0 ? (
          /* 空状态显示 */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl text-gray-400 font-medium">尚未开始</div>
            </div>
          </div>
        ) : (
          /* 活动卡片显示 */
          <>
        {/* Event Cards - 单张展示 */}
        <div 
          ref={containerRef}
          className="absolute inset-0 px-4 pt-20 pb-12"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* 当前显示的卡片 */}
            <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden relative" 
                 style={{ boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 10px 20px -5px rgba(0, 0, 0, 0.2)' }}>
              {/* 背景图片 - 可点击 */}
              {events[currentIndex]?.bannerUrl ? (
                <img 
                  src={`http://localhost:3001${events[currentIndex].bannerUrl}`}
                  alt={events[currentIndex]?.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={handleViewDetails}
                />
              ) : (
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer flex items-center justify-center"
                  onClick={handleViewDetails}
                >
                  <div className="text-center px-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">{events[currentIndex]?.title}</h2>
                    <p className="text-gray-500">暂无活动海报</p>
                  </div>
                </div>
              )}
              
              {/* 查看详情按钮 - 浮在图片上 */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={handleViewDetails}
                  className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-2 rounded-full text-xs font-medium shadow-md hover:bg-white transition-colors"
                >
                  查看详情
                </button>
              </div>

              {/* Pagination Dots - 放在卡片内部底部 */}
              <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-2">
                {events.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`rounded-full transition-all ${
                      index === currentIndex 
                        ? 'bg-white w-6 h-1.5' 
                        : 'bg-white/50 w-1.5 h-1.5'
                    }`}
                    aria-label={`切换到第 ${index + 1} 个活动`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default HomePage;