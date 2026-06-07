'use client'

import type { ILandmark } from '../../model/journey'
import styles from '../../Map.module.css'

interface ILandmarkProps {
  landmark: ILandmark
}

const Landmark = ({ landmark }: ILandmarkProps) => {
  return (
    <div
      className={`${styles.landmark} group/lm absolute -translate-x-1/2 -translate-y-1/2 z-20 hover:z-30`}
      style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
    >
      <span
        className={`${styles.landmarkDot} relative block w-[0.55rem] h-[0.55rem] rounded-full transition-transform duration-200 group-hover/lm:scale-110 max-md:w-[0.62rem] max-md:h-[0.62rem]`}
      />
      <span
        className={`${styles.landmarkTip} pointer-events-none absolute left-1/2 bottom-[calc(100%+0.45rem)] -translate-x-1/2 whitespace-nowrap rounded-[1.875rem] bg-[rgba(255,255,255,0.92)] backdrop-blur-sm px-[0.625rem] py-[0.3rem] text-[0.75rem] font-semibold text-[#1B1F21] leading-none opacity-0 translate-y-[0.25rem] transition-all duration-200 group-hover/lm:opacity-100 group-hover/lm:translate-y-0 max-md:text-[0.8rem] max-md:px-[0.6rem]`}
      >
        {landmark.name}
      </span>
    </div>
  )
}

export { Landmark }
