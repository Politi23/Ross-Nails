import Image from 'next/image'

interface LogoProps {
  size?: number
  className?: string
}

export default function Logo({ size = 48, className }: LogoProps) {
  return (
    <div
      className={`relative flex-shrink-0 rounded-xl overflow-hidden ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/Logo Ross Nails.jpeg"
        alt="R Studio Nails logo"
        width={size}
        height={size}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  )
}
