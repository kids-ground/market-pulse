# Market Pulse

금융 비전문가를 위한 자본시장 시각화 웹앱.  
MVP: "N년 전 $100을 S&P 500 / NASDAQ에 넣었다면 지금 얼마일까? 현금 보관 vs 투자"

## 스택
Next.js 14 · TypeScript strict · Tailwind v3 · App Router · `useState`/`useMemo` only

## 구조
```
src/app/          layout.tsx · page.tsx (client) · globals.css
src/components/   YearSelector · MetricCard · ContextBar
src/data/         historicalData.ts  ← 하드코딩 데이터 + calcValues() (API 교체 가능)
src/hooks/        useAnimatedValue.ts  ← RAF ease-out cubic 480ms 애니메이션
```

## 디자인 시스템

### 폰트
- **숫자·헤딩**: Inter 800, `letter-spacing: -0.03em`, `font-variant-numeric: tabular-nums`
- **UI 텍스트 (한글 포함)**: Inter + Noto Sans KR (Google Fonts, `next/font/google`)
- CSS 변수: `--font-inter`, `--font-noto` → `html` 클래스에 주입, `layout.tsx`에서 로드

### 컬러 (CSS 변수, `globals.css`) — 라이트 테마
| 변수 | 값 | 용도 |
|------|----|------|
| `--bg` | `#F2F4F6` | 페이지 배경 (연회색) |
| `--card` | `#FFFFFF` | 카드 배경 (흰색) |
| `--card-2` | `#F7F8FA` | 비활성 버튼·내부 구분 영역 |
| `--bd` | `rgba(0,0,0,0.06)` | 기본 보더 |
| `--bd2` | `rgba(0,0,0,0.10)` | 바 트랙·호버 보더 |
| `--t1` | `#191F28` | 본문 텍스트 |
| `--t2` | `#6B7684` | 보조 텍스트 |
| `--t3` | `#ADB5BD` | 힌트·라벨 |
| `--green` | `#12B76A` | (미사용) |
| `--blue` | `#3B7FE8` | 하락(손실) 강조 — 한국 증권 관례 |
| `--red` | `#E53E4D` | 상승(수익) 강조 — 한국 증권 관례 |
| `--accent` | `#3182F6` | 슬라이더·연도·$100 강조 |

### 레이아웃
- `100dvh` no-scroll · flex column (ContextBar→Header→ScrollArea) · `max-w-[480px]`
- ScrollArea: `flex: 1; min-height: 0; overflow-y: auto` — HeroCard + Comparison Section 포함
- **섹션 간 기본 간격: `48px`**
- HeroCard: 배경 없음, 풀너비 스파크라인
- Comparison cards: 각각 흰색 카드 (`background: var(--card); border-radius: 14px; padding: 12px 16px`)

## 데이터 기준 (2026-04-30)
`SP_NOW = 7254.19` · `NQ_NOW = 25129`  
`HISTORICAL_DATA[1~30]`: 연도별 `spStart / nqStart / infMult`  
출처: S&P DJ Indices · BLS CPI-U (2026.03) · Yahoo Finance 추정 (NASDAQ)

## 금액 포맷
- `< $1,000` → `$124.84` (소수점 2자리)
- `≥ $1,000` → `$1,082` (천단위 콤마, 소수점 없음)

## 확장 계획
- `historicalData.ts` → API fetch 전환 (`calcValues` 인터페이스 유지)
- 추후 라우트: `/pulse` (장기 비교 차트), `/risk` (시장 위험 지표)
