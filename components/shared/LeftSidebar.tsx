'use client'
import Link from 'next/link'
import Image from 'next/image'
import { sidebarLinks } from '../../constants/index'
import { usePathname, useRouter } from 'next/navigation'
import { SignOutButton, SignedIn } from '@clerk/nextjs'
function LeftSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map(item => {
                    const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route

                    return (
                        <Link href={item.route} className={`leftsidebar_link ${isActive && 'bg-primary-500'}`} key={item.label}>
                            <Image src={item.imgURL} alt={item.label} width={24} height={24} />
                            <p className='text-light-1 max-lg:hidden'>{item.label}</p>
                        </Link>
                    )
                }
                )}
            </div>
            <div className='mt-10 px-6'>
                <SignedIn>
                    <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image src='/assets/logout.svg' alt="logput" width={24} height={24} />
                            <p className='text-light-2 max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}
export default LeftSidebar