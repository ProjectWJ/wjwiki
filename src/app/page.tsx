import Footer from '@/components/Footer';
import { NaviEventListener } from '@/components/Header.event';
import LoginMenu from '@/components/loginMenu';
import { SiteLayout } from '@/components/mainPage/layouts/SiteLayout';
import { CategoryShowcase } from '@/components/mainPage/sections/CategoryShowcase';
import { Hero } from '@/components/mainPage/sections/Hero';
import { LatestPosts } from '@/components/mainPage/sections/LatestPosts';
import { PostDetailProgress } from '@/components/PostDetailProgress';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <PostDetailProgress />
      <NaviEventListener loginMenu={<LoginMenu />}>
        <div className='flex justify-center'>
        <SiteLayout>
          <Hero />
          <LatestPosts />
          <CategoryShowcase />
        </SiteLayout>
        </div>
        <div className='container mx-auto px-4 py-8 md:py-12'>
          <Footer />
        </div>
      </NaviEventListener>
    </>
  )
}