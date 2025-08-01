import type { Event } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'AI 算法黑客马拉松 2077',
    startTime: '2025-08-15T09:00:00+08:00',
    endTime: '2025-08-17T18:00:00+08:00',
    location: '赛博空间虚拟会议室 #42',
    signupDeadline: '2025-08-10T23:59:59+08:00',
    highlights: [
      '48小时极限编程挑战',
      '顶级AI专家现场指导',
      '与全球开发者实时协作',
      '赢取丰厚奖金和荣誉'
    ],
    prizes: [
      { rank: 'gold', text: '冠军：50000元现金 + AI研发岗位直通车' },
      { rank: 'silver', text: '亚军：30000元现金 + 技术培训机会' },
      { rank: 'bronze', text: '季军：10000元现金 + 精美礼品' }
    ],
    registeredCount: 128,
    maxParticipants: 200,
    description: '这是一场关于人工智能算法创新的极限挑战。在48小时内，参赛者将使用最前沿的AI技术，解决实际业务场景中的复杂问题。',
    agenda: [
      { time: '08:00-09:00', title: '签到 & 开幕式', description: '参赛者签到，主办方致辞，规则说明' },
      { time: '09:00-09:30', title: '技术分享', description: 'AI前沿技术趋势分享' },
      { time: '09:30-12:00', title: '黑客马拉松开始', description: '团队组建，项目启动' },
      { time: '12:00-13:00', title: '午餐时间', description: '自助午餐，自由交流' },
      { time: '13:00-次日09:00', title: '持续开发', description: '48小时不间断编程挑战' },
      { time: '次日09:00-11:00', title: '项目路演', description: '各团队展示成果' },
      { time: '11:00-12:00', title: '评审 & 颁奖', description: '专家评审，公布获奖名单' }
    ],
    targetAudience: [
      '具有编程基础的开发者',
      'AI/ML领域的研究人员',
      '对人工智能感兴趣的学生',
      '希望转型AI领域的工程师'
    ],
    requirements: [
      '自带笔记本电脑',
      '熟悉至少一种编程语言（Python/Java/C++等）',
      '了解基础的机器学习概念',
      '具备团队协作精神'
    ],
    speakers: [
      { name: '张博士', title: 'AI研究院院长', avatar: '👨‍🔬' },
      { name: '李教授', title: '机器学习专家', avatar: '👩‍🏫' },
      { name: '王总监', title: '技术总监', avatar: '👨‍💼' }
    ],
    organizer: {
      name: '奇富科技创新中心',
      description: '致力于推动AI技术创新与人才培养的专业机构',
      contact: 'ai@qifu.tech'
    },
    tags: ['黑客马拉松', 'AI', '算法', '竞赛'],
    difficulty: 'advanced',
    benefits: [
      '与业内专家面对面交流',
      '获得实战项目经验',
      '扩展技术视野和人脉',
      '赢取丰厚奖金和工作机会'
    ]
  },
  {
    id: '2',
    title: 'ChatGPT 应用开发工作坊',
    startTime: '2025-08-20T14:00:00+08:00',
    location: '创新中心 B2 多功能厅',
    signupDeadline: '2025-08-18T17:00:00+08:00',
    highlights: [
      '从零开始构建ChatGPT应用',
      '深入理解Prompt工程',
      '实战案例分享',
      '免费获得API额度'
    ],
    prizes: [
      { rank: 'gold', text: '最佳创意奖：MacBook Pro 一台' },
      { rank: 'silver', text: '最佳实践奖：iPad Pro 一台' },
      { rank: 'bronze', text: '积极参与奖：AirPods Pro' }
    ],
    registeredCount: 89,
    description: '本工作坊将带领大家深入了解ChatGPT的应用开发，从基础概念到高级技巧，帮助你快速掌握AI应用开发的核心能力。'
  },
  {
    id: '3',
    title: '机器学习算法大赛',
    startTime: '2025-08-25T09:30:00+08:00',
    location: '线上 + 线下同步进行',
    signupDeadline: '2025-08-22T18:00:00+08:00',
    highlights: [
      '真实数据集挑战',
      '多种算法框架可选',
      '专业评委现场点评',
      '优秀作品企业直推'
    ],
    prizes: [
      { rank: 'gold', text: '冠军团队：100000元奖金池' },
      { rank: 'silver', text: '亚军团队：50000元奖金池' },
      { rank: 'bronze', text: '季军团队：20000元奖金池' }
    ],
    registeredCount: 256,
    description: '这是一场面向所有机器学习爱好者的技术盛宴。我们将提供真实的业务数据集，参赛者需要运用各种算法解决实际问题。'
  },
  {
    id: '4',
    title: 'AI 产品经理训练营',
    startTime: '2025-09-01T09:00:00+08:00',
    location: '培训中心 A3-301',
    signupDeadline: '2025-08-28T20:00:00+08:00',
    highlights: [
      'AI产品设计方法论',
      '用户需求分析技巧',
      '产品落地实战演练',
      '资深产品经理亲授'
    ],
    prizes: [
      { rank: 'gold', text: '优秀学员：获得产品经理认证 + 工作内推机会' },
      { rank: 'silver', text: '进步之星：获得专业书籍套装 + 1对1辅导' },
      { rank: 'bronze', text: '积极学员：获得课程优惠券 + 学习资料包' }
    ],
    registeredCount: 67,
    description: '专为想要转型AI产品经理的你打造。3天密集训练，从产品思维到实战技能，助你成为AI时代的产品专家。'
  }
];