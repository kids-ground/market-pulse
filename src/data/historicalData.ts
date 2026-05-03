// Sources:
// S&P 500: S&P Dow Jones Indices / FRED (1~5yr actual, remainder approximate)
// NASDAQ: Yahoo Finance estimates (all values approximate)
// Inflation: U.S. Bureau of Labor Statistics CPI-U (latest: 2026.03)
// Gold: LBMA spot price (2026.04.30 actual, historical approximate)

export type MetricType = 'sp500' | 'nasdaq' | 'cash' | 'gold'

export interface YearData {
  spStart:   number  // S&P 500 index value at that point in time
  nqStart:   number  // NASDAQ composite value (approximate)
  infMult:   number  // cumulative inflation multiplier ($1 → current purchasing power basis)
  goldStart: number  // Gold spot price $/oz (approximate)
}

export const SP_NOW   = 7254.19  // S&P 500 closing price 2026-04-30
export const NQ_NOW   = 25129    // NASDAQ closing price 2026-05-02
export const GOLD_NOW = 4653.69  // Gold spot price 2026-04-30

// Index = N years ago (1~30). [0] is unused.
export const HISTORICAL_DATA: YearData[] = [
  { spStart: 0,       nqStart: 0,     infMult: 1,     goldStart: 0    }, // [0] unused
  { spStart: 5810.92, nqStart: 18700, infMult: 1.033, goldStart: 3200 }, // 1yr  (2025.05)
  { spStart: 5235.23, nqStart: 16150, infMult: 1.061, goldStart: 2300 }, // 2yr  (2024.05)
  { spStart: 4146.17, nqStart: 12960, infMult: 1.097, goldStart: 1990 }, // 3yr  (2023.05)
  { spStart: 4040.36, nqStart: 12150, infMult: 1.185, goldStart: 1850 }, // 4yr  (2022.05)
  { spStart: 4167.85, nqStart: 13789, infMult: 1.241, goldStart: 1800 }, // 5yr  (2021.05)
  { spStart: 2953,    nqStart: 9492,  infMult: 1.256, goldStart: 1720 }, // 6yr  (2020.05)
  { spStart: 2752,    nqStart: 7979,  infMult: 1.285, goldStart: 1280 }, // 7yr  (2019.05)
  { spStart: 2705,    nqStart: 7448,  infMult: 1.316, goldStart: 1310 }, // 8yr  (2018.05)
  { spStart: 2412,    nqStart: 6235,  infMult: 1.344, goldStart: 1250 }, // 9yr  (2017.05)
  { spStart: 2096,    nqStart: 4858,  infMult: 1.372, goldStart: 1280 }, // 10yr (2016.05)
  { spStart: 2107,    nqStart: 5003,  infMult: 1.374, goldStart: 1190 }, // 11yr (2015.05)
  { spStart: 1883,    nqStart: 4114,  infMult: 1.395, goldStart: 1300 }, // 12yr (2014.05)
  { spStart: 1631,    nqStart: 3455,  infMult: 1.416, goldStart: 1400 }, // 13yr (2013.05)
  { spStart: 1310,    nqStart: 2901,  infMult: 1.446, goldStart: 1600 }, // 14yr (2012.05)
  { spStart: 1345,    nqStart: 2782,  infMult: 1.492, goldStart: 1530 }, // 15yr (2011.05)
  { spStart: 1089,    nqStart: 2257,  infMult: 1.516, goldStart: 1200 }, // 16yr (2010.05)
  { spStart: 919,     nqStart: 1774,  infMult: 1.557, goldStart: 930  }, // 17yr (2009.05)
  { spStart: 1400,    nqStart: 2478,  infMult: 1.559, goldStart: 890  }, // 18yr (2008.05)
  { spStart: 1530,    nqStart: 2557,  infMult: 1.623, goldStart: 680  }, // 19yr (2007.05)
  { spStart: 1270,    nqStart: 2178,  infMult: 1.664, goldStart: 640  }, // 20yr (2006.05)
  { spStart: 1191,    nqStart: 2068,  infMult: 1.720, goldStart: 425  }, // 21yr (2005.05)
  { spStart: 1107,    nqStart: 1979,  infMult: 1.777, goldStart: 395  }, // 22yr (2004.05)
  { spStart: 963,     nqStart: 1494,  infMult: 1.811, goldStart: 360  }, // 23yr (2003.05)
  { spStart: 1067,    nqStart: 1688,  infMult: 1.854, goldStart: 315  }, // 24yr (2002.05)
  { spStart: 1255,    nqStart: 2110,  infMult: 1.906, goldStart: 270  }, // 25yr (2001.05)
  { spStart: 1421,    nqStart: 3401,  infMult: 1.970, goldStart: 275  }, // 26yr (2000.05) dot-com peak
  { spStart: 1301,    nqStart: 2490,  infMult: 2.023, goldStart: 275  }, // 27yr (1999.05)
  { spStart: 1108,    nqStart: 1872,  infMult: 2.055, goldStart: 300  }, // 28yr (1998.05)
  { spStart: 848,     nqStart: 1400,  infMult: 2.102, goldStart: 345  }, // 29yr (1997.05)
  { spStart: 670,     nqStart: 1200,  infMult: 2.171, goldStart: 390  }, // 30yr (1996.05)
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
      if (type === 'sp500')  return 100 * SP_NOW   / startData.spStart
      if (type === 'nasdaq') return 100 * NQ_NOW   / startData.nqStart
      if (type === 'gold')   return 100 * GOLD_NOW / startData.goldStart
      return 100 / startData.infMult
    }
    const d = HISTORICAL_DATA[j]
    if (type === 'sp500')  return 100 * d.spStart   / startData.spStart
    if (type === 'nasdaq') return 100 * d.nqStart   / startData.nqStart
    if (type === 'gold')   return 100 * d.goldStart / startData.goldStart
    return 100 * d.infMult / startData.infMult
  })
}

export function calcValues(years: number) {
  const d = HISTORICAL_DATA[years]
  return {
    spValue:    +(100 * SP_NOW   / d.spStart).toFixed(2),
    nqValue:    +(100 * NQ_NOW   / d.nqStart).toFixed(2),
    cashValue:  +(100 / d.infMult).toFixed(2),
    goldValue:  +(100 * GOLD_NOW / d.goldStart).toFixed(2),
    spPct:      +((SP_NOW   / d.spStart   - 1) * 100).toFixed(1),
    nqPct:      +((NQ_NOW   / d.nqStart   - 1) * 100).toFixed(1),
    infPct:     +((d.infMult - 1) * 100).toFixed(1),
    goldPct:    +((GOLD_NOW / d.goldStart - 1) * 100).toFixed(1),
    startYear:  2026 - years,
  }
}
