'use client'

// Птица-проводник «Жаворонок», вид сбоку (смотрит вправо). Группы анимирует
// useBirdJourney: data-bird-face — разворот по направлению полёта,
// data-wing / data-wing-far — взмахи, data-tail — хвост, data-pupils —
// взгляд (следит за курсором на привале), data-blink — моргание,
// data-bird-inner — парение и приседание при взлёте/посадке.
const Bird = () => {
  return (
    <svg viewBox='-15 -15 180 160' fill='none' aria-hidden className='w-full h-full overflow-visible'>
      <defs>
        <linearGradient id='lk-bird-breast' x1='0.1' y1='0' x2='0.5' y2='1'>
          <stop offset='0%' stopColor='#FFD75A' />
          <stop offset='55%' stopColor='#F3BC18' />
          <stop offset='100%' stopColor='#D89A0A' />
        </linearGradient>
        <linearGradient id='lk-bird-dark' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#343A40' />
          <stop offset='100%' stopColor='#1A1D20' />
        </linearGradient>
        <linearGradient id='lk-bird-head' x1='0' y1='0' x2='0.3' y2='1'>
          <stop offset='0%' stopColor='#3A4148' />
          <stop offset='100%' stopColor='#1E2225' />
        </linearGradient>
      </defs>

      <g data-bird-inner style={{ transformBox: 'fill-box', transformOrigin: '50% 60%' }}>
        <g data-bird-face>
          <g data-wing-far>
            <path d='M 84 52 C 68 50 52 60 42 76 C 54 80 70 78 80 70 C 88 63 90 56 88 52 Z' fill='#14171A' />
          </g>

          <g data-tail>
            <path d='M 2 112 C 18 102 34 87 48 70 L 58 86 C 44 97 22 108 2 112 Z' fill='url(#lk-bird-dark)' />
            <path d='M 9 105 C 23 96 36 84 46 73 L 50 79 C 39 90 25 100 9 105 Z' fill='#F6F6F4' opacity='0.92' />
            <path d='M 2 112 C 16 104 30 92 42 79 L 45 83 C 33 95 18 106 2 112 Z' fill='#0F1215' opacity='0.55' />
          </g>

          <path
            d='M 46 66 C 50 46 74 36 96 42 C 114 47 124 62 122 78 C 120 96 102 110 78 110 C 58 110 43 88 46 66 Z'
            fill='url(#lk-bird-breast)'
          />
          <path d='M 108 56 C 114 64 116 74 113 84 C 118 74 117 62 112 55 Z' fill='#FFE082' opacity='0.8' />
          <path d='M 54 100 C 64 110 82 112 94 105 C 86 112 64 115 54 106 Z' fill='#F6F6F4' />

          <circle cx='98' cy='38' r='22' fill='url(#lk-bird-head)' />
          <ellipse cx='104' cy='46.5' rx='9.6' ry='10.4' fill='#F6F6F4' />
          <path d='M 80 28 C 84 20 92 16 100 16 C 92 18 86 23 83 30 Z' fill='#4A525A' opacity='0.9' />
          <path
            d='M 118 31.5 L 134 36.5 L 118 37.5 Z'
            fill='#F0B62A'
            stroke='#15181B'
            strokeWidth='1.4'
            strokeLinejoin='round'
          />
          <path
            d='M 118 37.5 L 134 36.5 L 118 42.5 Z'
            fill='#CE8F12'
            stroke='#15181B'
            strokeWidth='1.4'
            strokeLinejoin='round'
          />
          <circle cx='103' cy='30' r='5.6' fill='#fff' />
          <g data-pupils>
            <circle cx='104.3' cy='30.9' r='3.5' fill='#15181B' />
            <circle cx='103.1' cy='29.3' r='1.2' fill='#fff' />
          </g>
          <circle data-blink cx='103' cy='30' r='6.2' fill='#262B30' />

          <g data-wing>
            <path
              d='M 76 54 C 60 52 42 60 26 82 C 31 84 36 86 41 86 L 36 93 C 43 94 50 93 56 90 L 53 97 C 62 95 69 90 73 82 C 79 73 80 60 76 54 Z'
              fill='url(#lk-bird-dark)'
            />
            <path d='M 66 61 C 54 63 43 72 34 83 L 39 85 C 48 76 57 68 68 65 Z' fill='#F6F6F4' opacity='0.95' />
            <path d='M 76 54 C 66 53 56 56 47 63 C 58 58 68 56 77 58 Z' fill='#E9B021' opacity='0.9' />
          </g>
        </g>
      </g>
    </svg>
  )
}

export { Bird }
