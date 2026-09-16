import type { EducationalApp, CategoryMeta } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  { id: 'all', label: '전체 보기', description: '모든 교육용 웹앱을 탐색합니다', iconName: 'Layers' },
  { id: 'math', label: '수학·기하', description: '시각적 그래프와 도형 조작을 통한 개념 학습', iconName: 'Compass' },
  { id: 'science', label: '물리·과학', description: '원리와 현상을 직관적으로 관찰하는 가상 실험실', iconName: 'Atom' },
  { id: 'coding', label: '소프트웨어', description: '알고리즘 시각화와 인터랙티브 코딩 놀이터', iconName: 'Code' },
  { id: 'language', label: '어학·어휘', description: '단어 연상과 문맥 이해를 돕는 학습 도구', iconName: 'BookOpen' },
  { id: 'creative', label: '창의·탐구', description: '소리와 색상, 공간을 넘나드는 창의 프로젝트', iconName: 'Sparkles' },
  { id: 'tool', label: '수업 도구', description: '타이머, 랜덤 추첨 등 교실 현장에 필요한 유틸리티', iconName: 'Wrench' }
];

export const INITIAL_APPS: EducationalApp[] = [
  {
    id: 'geo-vector-lab',
    title: '벡터와 좌표계 인터랙티브 연구실',
    summary: '마우스로 벡터 화살표를 직접 당기고 회전시키며 내적과 외적, 정사영의 개념을 직관적으로 이해합니다.',
    description: `수학 교과서의 평면적인 수식 대신, 2D 공간에서 두 벡터의 크기와 방향을 실시간으로 조작할 수 있는 시뮬레이션입니다.\n\n주요 기능:\n• 벡터 덧셈, 뺄셈, 스칼라배 실시간 렌더링\n• 내적(Dot Product)의 기하학적 의미 시각화\n• 좌표축 전환 (데카르트 ↔ 극좌표계)\n• 교과 수업용 슬라이더 및 프리셋 제공`,
    category: 'math',
    targetAudience: '중3 ~ 고등',
    appUrl: 'https://phet.colorado.edu/sims/html/vector-addition/latest/vector-addition_all.html',
    githubUrl: 'https://github.com/example/geo-vector-lab',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    tags: ['기하', '벡터', '선형대수', '고등수학'],
    isFeatured: true,
    orderIndex: 1,
    createdAt: '2026-03-01'
  },
  {
    id: 'sorting-visualizer',
    title: '알고리즘 정렬 시각화 탐험기',
    summary: '버블, 퀵, 병합, 힙 정렬의 비교 횟수와 교환 과정을 오디오 피치와 막대 그래프로 감상합니다.',
    description: `컴퓨팅 사고력을 기르는 대표적인 정렬 알고리즘 6종의 작동 방식을 단계별로 제어하며 관찰합니다.\n\n주요 기능:\n• 실행 속도 조절 및 단계별(Step-by-step) 디버깅 모드\n• 배열 크기 및 난수/역정렬/유사정렬 초기 상태 설정\n• 비교 횟수(Comparisons) 및 스왑 횟수(Swaps) 실시간 카운터\n• 소리(Synthesizer)와 연동된 청각 피드백`,
    category: 'coding',
    targetAudience: '중등 ~ 성인 입문',
    appUrl: 'https://visualgo.net/en/sorting',
    githubUrl: 'https://github.com/example/sorting-visualizer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    tags: ['알고리즘', '정렬', '자료구조', '정보교육'],
    isFeatured: true,
    orderIndex: 2,
    createdAt: '2026-03-05'
  },
  {
    id: 'pendulum-wave-physics',
    title: '진자와 파동 역학 시뮬레이터',
    summary: '단진자의 주기와 중력가속도, 공기 저항 계수를 바꿔가며 에너지 보존 법칙을 직접 검증합니다.',
    description: `물리학 교실에서 직접 실험하기 까다로운 다중 진자 및 파동의 간섭 현상을 웹 브라우저에서 60fps로 정밀 시뮬레이션합니다.\n\n주요 기능:\n• 지구, 달, 목성 등 다양한 행성의 중력 환경 선택\n• 운동에너지와 위치에너지의 실시간 막대 그래프 변환\n• 잔상(Tracer) 효과를 통한 카오스 진자 궤적 관찰`,
    category: 'science',
    targetAudience: '중등 ~ 고등',
    appUrl: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_all.html',
    githubUrl: 'https://github.com/example/pendulum-wave-physics',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    tags: ['물리', '역학', '파동', '시뮬레이션'],
    isFeatured: true,
    orderIndex: 3,
    createdAt: '2026-03-08'
  },
  {
    id: 'korean-word-roots',
    title: '한자 어원과 순우리말 인터랙티브 어휘 지도',
    summary: '마인드맵 형태로 확장되는 한국어 어휘 망을 통해 단어의 파생과 어원 관계를 시각적으로 익힙니다.',
    description: `국어 어휘력 증진을 위한 마인드맵형 어휘 탐색기입니다. 기본 형태소와 접두사/접미사를 연결하여 새로운 단어가 합성되는 과정을 시각적으로 보여줍니다.\n\n주요 기능:\n• 중심 어근 검색 시 파생 단어 노드 그래프 렌더링\n• 초등 필수 어휘 및 수능 빈출 어휘 카테고리 필터\n• 낱말 퀴즈 및 예문 모음`,
    category: 'language',
    targetAudience: '초등 고학년 ~ 중등',
    appUrl: 'https://ko.dict.naver.com/',
    githubUrl: 'https://github.com/example/korean-word-roots',
    thumbnailUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    tags: ['국어', '어휘', '한자어', '마인드맵'],
    isFeatured: false,
    orderIndex: 4,
    createdAt: '2026-03-10'
  },
  {
    id: 'periodic-element-lab',
    title: '원소 주기율표와 전자 배치 3D 뷰어',
    summary: '보어 원자 모형과 전자 껍질(K, L, M, N)의 전자 궤도를 입체적으로 확인하고 주기율표의 규칙성을 파악합니다.',
    description: `1번 수소부터 118번 오가네손까지의 원소 기본 정보, 동위원소, 이온화 에너지를 한눈에 확인하는 가상 화학 연구 도구입니다.\n\n주요 기능:\n• 금속, 비금속, 전이금속 등 성질별 컬러 코딩 필터\n• 전자 배치 궤도 실시간 애니메이션\n• 원소 간 화학 결합(이온결합/공유결합) 미니 샌드박스`,
    category: 'science',
    targetAudience: '중2 ~ 고등',
    appUrl: 'https://ptable.com/?lang=ko',
    githubUrl: 'https://github.com/example/periodic-element-lab',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    tags: ['화학', '주기율표', '원자구조', '3D'],
    isFeatured: false,
    orderIndex: 5,
    createdAt: '2026-03-11'
  },
  {
    id: 'classroom-smart-board',
    title: '수업 진행용 올인원 타이머 & 발표자 룰렛',
    summary: '활동 수업과 모둠 토론, 공정한 순번 추첨을 돕는 교실 현장 맞춤형 프레젠테이션 위젯 모음입니다.',
    description: `교사와 학생 모두에게 부담 없는 미니멀하고 단정한 수업 보조 웹앱입니다. 프로젝터나 전자칠판에 띄우기 최적화되어 있습니다.\n\n주요 기능:\n• 집중 카운트다운 타이머 & 뽀모도로 모드\n• 모둠별 가중치 적용 무작위 발표자 추첨기\n• 직관적인 단축키 및 전체화면 모드`,
    category: 'tool',
    targetAudience: '선생님 및 발표자',
    appUrl: 'https://wheelofnames.com/',
    githubUrl: 'https://github.com/example/classroom-smart-board',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    tags: ['교실도구', '타이머', '추첨기', '수업활동'],
    isFeatured: false,
    orderIndex: 6,
    createdAt: '2026-03-12'
  }
];
