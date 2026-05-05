import Link from 'next/link'
import Image from 'next/image'
import LogoImage from '@/assets/images/logo.png'
import { HeaderLinks } from './ui/Desktop/HeaderLinks'
import { BurgerButton } from '@/shared/BurgerButton'

const Header = () => {
  return (
    <header className='fixed bg-background w-full top-0 left-0 right-0 z-[20000] h-[100px] border-b-[1px] border-light-gray-tranpsparent-40'>
      <div className='container px-[50px] flex justify-between items-center w-full h-full'>
        <div className='flex items-center justify-between'>
          <Link className='flex items-center gap-[15px]' href='/'>
            <Image className='w-[24px] h-[31px]' src={LogoImage} alt='Logo' />
            <span className='text-[20px] font-black uppercase text-text-white'>Ларк Строй</span>
          </Link>
        </div>

        <HeaderLinks />

        <div className='flex items-center ml-[40px]'>
          <Link
            href='/contacts'
            className='uppercase text-[16px] text-text-black px-[25px] py-[25px] bg-accent transition-[filter,background-color] duration-300 ease-out hover:brightness-110'
          >
            Обсудить проект
          </Link>
        </div>

        {/* <BurgerButton className='ml-auto' /> */}
      </div>
    </header>
  )
}

export { Header }
