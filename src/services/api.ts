import type { Event, Registration } from '../types';

// API base URL - 开发环境使用proxy，生产环境使用完整URL
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api' 
  : 'http://localhost:3001/api';

// 获取所有活动
export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load events:', error);
    throw error;
  }
};

// 获取单个活动详情
export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch event');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load event:', error);
    throw error;
  }
};

// 报名活动
export const registerForEvent = async (
  eventId: string,
  data: { name: string; department: string }
): Promise<{ success: boolean; registeredCount: number; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        registeredCount: 0,
        message: result.message || '报名失败，请稍后重试'
      };
    }
    
    return result;
  } catch (error) {
    console.error('Failed to register:', error);
    return {
      success: false,
      registeredCount: 0,
      message: '报名失败，请稍后重试'
    };
  }
};