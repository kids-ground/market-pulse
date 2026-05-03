// Sources:
// S&P 500: S&P Dow Jones Indices / FRED (1~5yr actual, remainder approximate)
// NASDAQ: Yahoo Finance estimates (all values approximate)
// Inflation: U.S. Bureau of Labor Statistics CPI-U (latest: 2026.03)

export type MetricType = 'sp500' | 'nasdaq' | 'cash'

export interface YearData {
  spStart: number   // S&P 500 index value at that point in time
  nqStart: number   // NASDAQ composite value (approximate)
  infMult: number   // cumulative inflation multiplier ($1 → current purchasing power basis)
}

export const SP_NOW = 7254.19   // S&P 500 closing price 2026-04-30
export const NQ_NOW = 25129     // NASDAQ closing price 2026-05-02

// Index = N years ago (1~30). [0] is unused.
export const HISTORICAL_DATA: YearData[] = [
  { spStart: 0,       nqStart: 0,     infMult: 1     }, // [0] unused
  { spStart: 5810.92, nqStart: 18700, infMult: 1.033 }, // 1yr  (2025.05)
  { spStart: 5235.23, nqStart: 16150, infMult: 1.061 }, // 2yr  (2024.05)
  { spStart: 4146.17, nqStart: 12960, infMult: 1.097 }, // 3yr  (2023.05)
  { spStart: 4040.36, nqStart: 12150, infMult: 1.185 }, // 4yr  (2022.05)
  { spStart: 4167.85, nqStart: 13789, infMult: 1.241 }, // 5yr  (2021.05)
  { spStart: 2953,    nqStart: 9492,  infMult: 1.256 }, // 6yr  (2020.05)
  { spStart: 2752,    nqStart: 7979,  infMult: 1.285 }, // 7yr  (2019.05)
  { spStart: 2705,    nqStart: 7448,  infMult: 1.316 }, // 8yr  (2018.05)
  { spStart: 2412,    nqStart: 6235,  infMult: 1.344 }, // 9yr  (2017.05)
  { spStart: 2096,    nqStart: 4858,  infMult: 1.372 }, // 10yr (2016.05)
  { spStart: 2107,    nqStart: 5003,  infMult: 1.374 }, // 11yr (2015.05)
  { spStart: 1883,    nqStart: 4114,  infMult: 1.395 }, // 12yr (2014.05)
  { spStart: 1631,    nqStart: 3455,  infMult: 1.416 }, // 13yr (2013.05)
  { spStart: 1310,    nqStart: 2901,  infMult: 1.446 }, // 14yr (2012.05)
  { spStart: 1345,    nqStart: 2782,  infMult: 1.492 }, // 15yr (2011.05)
  { spStart: 1089,    nqStart: 2257,  infMult: 1.516 }, // 16yr (2010.05)
  { spStart: 919,     nqStart: 1774,  infMult: 1.557 }, // 17yr (2009.05)
  { spStart: 1400,    nqStart: 2478,  infMult: 1.559 }, // 18yr (2008.05)
  { spStart: 1530,    nqStart: 2557,  infMult: 1.623 }, // 19yr (2007.05)
  { spStart: 1270,    nqStart: 2178,  infMult: 1.664 }, // 20yr (2006.05)
  { spStart: 1191,    nqStart: 2068,  infMult: 1.720 }, // 21yr (2005.05)
  { spStart: 1107,    nqStart: 1979,  infMult: 1.777 }, // 22yr (2004.05)
  { spStart: 963,     nqStart: 1494,  infMult: 1.811 }, // 23yr (2003.05)
  { spStart: 1067,    nqStart: 1688,  infMult: 1.854 }, // 24yr (2002.05)
  { spStart: 1255,    nqStart: 2110,  infMult: 1.906 }, // 25yr (2001.05)
  { spStart: 1421,    nqStart: 3401,  infMult: 1.970 }, // 26yr (2000.05) dot-com peak
  { spStart: 1301,    nqStart: 2490,  infMult: 2.023 }, // 27yr (1999.05)
  { spStart: 1108,    nqStart: 1872,  infMult: 2.055 }, // 28yr (1998.05)
  { spStart: 848,     nqStart: 1400,  infMult: 2.102 }, // 29yr (1997.05)
  { spStart: 670,     nqStart: 1200,  infMult: 2.171 }, // 30yr (1996.05)
]

export function calcSparklineData(years: number, type: MetricType): number[] {
  const startData = HISTORICAL_DATA[years]
  const step = years <= 12 ? 1 : Math.ceil(years / 11)

  const indices: number[] = []
  for (let j = years; j >= 1; j -= step) indices.push(j)
  if (indices[indices.length - 1] !== 1) indices.push(1)
  indices.push(0)

  return indices.map(j => {
    if (j === 0) {
      if (type === 'sp500')  return 100 * SP_NOW / startData.spStart
      if (type === 'nasdaq') return 100 * NQ_NOW / startData.nqStart
      return 100 / startData.infMult
    }
    const d = HISTORICAL_DATA[j]
    if (type === 'sp500')  return 100 * d.spStart / startData.spStart
    if (type === 'nasdaq') return 100 * d.nqStart / startData.nqStart
    return 100 * d.infMult / startData.infMult
  })
}

export function calcValues(years: number) {
  const d = HISTORICAL_DATA[years]
  return {
    spValue:   +(100 * SP_NOW / d.spStart).toFixed(2),
    nqValue:   +(100 * NQ_NOW / d.nqStart).toFixed(2),
    cashValue: +(100 / d.infMult).toFixed(2),
    spPct:     +((SP_NOW / d.spStart - 1) * 100).toFixed(1),
    nqPct:     +((NQ_NOW / d.nqStart - 1) * 100).toFixed(1),
    infPct:    +((d.infMult - 1) * 100).toFixed(1),
    startYear: 2026 - years,
  }
}
