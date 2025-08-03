import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Event } from '../types';
import { getEventById, registerForEvent, submitSurveyResponse, getSurveyStats } from '../services/api';
import RegistrationModal from '../components/RegistrationModal';


// 模拟调研题目
const mockSurveyQuestions = [
  {
    id: 1,
    question: '您是如何了解到本次活动的？',
    options: ['公司内部通知', '同事推荐', '社交媒体', '其他']
  },
  {
    id: 2,
    question: '您对AI技术的了解程度是？',
    options: ['完全不了解', '了解一些基础', '比较熟悉', '非常精通']
  },
  {
    id: 3,
    question: '您最期待学习哪方面的内容？',
    options: ['AI基础理论', '实际应用案例', '编程实践', '行业趋势']
  }
];


const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // 调研相关状态
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<number[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState<number[]>([]);
  const [surveyStats, setSurveyStats] = useState<{ [key: number]: number[] }>({});
  

  useEffect(() => {
    if (id) {
      loadEvent();
      loadSurveyStats();
      // 检查是否已经完成过调研
      const surveyKey = `survey_${id}_answers`;
      const saved = localStorage.getItem(surveyKey);
      if (saved) {
        const answers = JSON.parse(saved);
        setSavedAnswers(answers);
        setHasCompletedSurvey(true);
      }
    }
  }, [id]);


  const loadEvent = async () => {
    try {
      if (!id) return;
      const data = await getEventById(id);
      setEvent(data);
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSurveyStats = async () => {
    try {
      if (!id) return;
      const { stats } = await getSurveyStats(id);
      const statsMap: { [key: number]: number[] } = {};
      stats.forEach(stat => {
        statsMap[stat.questionIndex] = stat.stats;
      });
      setSurveyStats(statsMap);
    } catch (error) {
      console.error('Failed to load survey stats:', error);
    }
  };

  const handleRegistration = async (data: { name: string; department: string }) => {
    if (!event) return;
    
    try {
      const result = await registerForEvent(event.id, data);
      
      if (result.success) {
        setEvent({
          ...event,
          registeredCount: result.registeredCount
        });
        setShowRegistrationModal(false);
        setRegistrationSuccess(true);
        
        setTimeout(() => {
          setRegistrationSuccess(false);
        }, 3000);
      } else {
        alert(result.message || '报名失败，请稍后重试');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('报名失败，请稍后重试');
    }
  };

  const handleSurveyAnswer = async (optionIndex: number) => {
    const newAnswers = [...surveyAnswers, optionIndex];
    setSurveyAnswers(newAnswers);
    setShowStats(true);
    
    // 1.5秒后切换到下一题
    setTimeout(async () => {
      setShowStats(false);
      if (currentQuestionIndex < surveyQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // 完成所有问题，保存到localStorage和数据库
        if (id) {
          // 生成用户ID（使用localStorage保存，保证同一用户的唯一性）
          let userId = localStorage.getItem('userId');
          if (!userId) {
            userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('userId', userId);
          }
          
          // 提交到后端
          await submitSurveyResponse(id, newAnswers, userId);
          
          // 保存到localStorage
          const surveyKey = `survey_${id}_answers`;
          localStorage.setItem(surveyKey, JSON.stringify(newAnswers));
          setSavedAnswers(newAnswers);
          setHasCompletedSurvey(true);
        }
        setSurveyCompleted(true);
        // 2秒后自动刷新页面显示保存的答案
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }, 1500);
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">活动不存在</div>
          <button
            onClick={() => navigate('/')}
            className="text-black underline"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const surveyQuestions = event?.surveyQuestions || mockSurveyQuestions;
  const currentQuestion = surveyQuestions[currentQuestionIndex];
  
  // 判断活动是否已结束
  const isEventEnded = event ? new Date(event.startTime) < new Date() : false;
  
  // 使用后台配置的回放链接，如果没有配置则使用默认链接
  const replayUrl = event?.replayUrl || `https://example.com/replay/${id}`;

  return (
    <div className="min-h-screen relative">
      {/* 背景大图 - 固定定位 */}
      <div className="fixed inset-0 z-0">
        {event.bannerUrl && (
          <img 
            src={`http://localhost:3001${event.bannerUrl}`}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 backdrop-blur-lg bg-white/20 z-20 border-b border-white/30">
          <div className="px-4 py-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-white active:opacity-70"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </button>
          </div>
        </div>

        {/* 两个卡片模块 */}
        <div className="px-4 py-6 space-y-4 pb-20">
          {/* 第一个卡片：活动信息 */}
          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-lg border border-white/30">
            <h1 className="text-2xl font-bold text-white mb-4">{event.title}</h1>
            
            <p className="text-white/90 leading-relaxed mb-6">
              {event.description || '这是一场关于人工智能算法创新的极限挑战。在48小时内，参赛者将使用最前沿的AI技术，解决实际业务场景中的复杂问题。'}
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-white/90">
                <svg className="w-5 h-5 mr-3 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {new Date(event.startTime).toLocaleDateString('zh-CN', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex items-center text-white/90">
                <svg className="w-5 h-5 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center text-white/90">
                <svg className="w-5 h-5 mr-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>已报名 {event.registeredCount} 人</span>
              </div>
            </div>
            
            {isEventEnded ? (
              <button
                onClick={() => window.open(replayUrl, '_blank')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-full font-medium shadow-lg active:scale-95 transition-all"
              >
                查看回放
              </button>
            ) : (
              <button
                onClick={() => setShowRegistrationModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-full font-medium shadow-lg active:scale-95 transition-all"
              >
                立即报名
              </button>
            )}
          </div>

          {/* 第二个卡片：调研模块 */}
          <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-lg border border-white/30">
            {!hasCompletedSurvey && (
              <h2 className="text-lg font-semibold text-white mb-4">活动调研</h2>
            )}
            
            {hasCompletedSurvey ? (
              // 显示已完成的调研结果
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-xl font-medium text-white">您已完成本次调研</div>
                </div>
                {surveyQuestions.map((question, qIndex) => (
                  <div key={question.id} className="border-t border-white/20 pt-3">
                    <h4 className="text-sm font-medium text-white/90 mb-2">
                      {qIndex + 1}. {question.question}
                    </h4>
                    <div className="pl-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">
                          您的选择：{question.options[savedAnswers[qIndex]]}
                        </span>
                        <span className="text-purple-300 text-sm">
                          {surveyStats[qIndex] ? surveyStats[qIndex][savedAnswers[qIndex]] : 0}% 的人选择了此项
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !surveyCompleted ? (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/70">
                      问题 {currentQuestionIndex + 1} / {surveyQuestions.length}
                    </span>
                    <div className="flex space-x-1">
                      {surveyQuestions.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index < surveyAnswers.length
                              ? 'bg-purple-400'
                              : index === currentQuestionIndex
                              ? 'bg-purple-300'
                              : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / surveyQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-white mb-4">{currentQuestion.question}</h3>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSurveyAnswer(index)}
                      disabled={showStats}
                      className="w-full text-left p-4 rounded-lg border border-white/30 bg-white/10 hover:border-purple-400 hover:bg-white/20 transition-all disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white">{option}</span>
                        {showStats && (
                          <span className="text-sm text-purple-300 font-medium">
                            {surveyStats[currentQuestionIndex] ? surveyStats[currentQuestionIndex][index] : 0}%
                          </span>
                        )}
                      </div>
                      {showStats && (
                        <div className="mt-2 w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${surveyStats[currentQuestionIndex] ? surveyStats[currentQuestionIndex][index] : 0}%` }}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold text-white mb-2">感谢您的参与！</h3>
                <p className="text-white/80 mb-2">
                  您的反馈对我们非常重要
                </p>
                <p className="text-sm text-white/60">
                  正在保存您的选择...
                </p>
              </div>
            )}
          </div>

        </div>
      </div>


      {/* Registration Modal */}
      {showRegistrationModal && (
        <RegistrationModal
          onClose={() => setShowRegistrationModal(false)}
          onSubmit={handleRegistration}
        />
      )}

      {/* Success Toast */}
      {registrationSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
          报名成功！
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;