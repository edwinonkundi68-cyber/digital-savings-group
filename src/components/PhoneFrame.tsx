import type { ReactNode } from 'react'

type PhoneFrameProps = {
  children: ReactNode
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="phone-stage">
      <div className="phone">{children}</div>
    </div>
  )
}