import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { Leaf, ArrowUpRight, Phone, Mail, X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Types
 */
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

interface BentoCardProps {
  title: string;
  subtitle: string;
  description: ReactNode;
  icon?: ReactNode;
  className?: string;
  isDark?: boolean;
}

/**
 * Hook for scroll-triggered animations
 */
const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin = '0px') => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.disconnect(); // Only trigger once
        }
      },
      {
        rootMargin,
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [ref, rootMargin]);

  return isIntersecting;
};

/**
 * Component: Slow Fade In Wrapper
 */
const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, '-50px');

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1500ms] ease-out ${
        isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-12 blur-sm'
      } ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * Component: Bento Grid Card
 */
const BentoCard: React.FC<BentoCardProps> = ({ title, subtitle, description, icon, className = '', isDark = false }) => {
  return (
    <div
      className={`
        relative p-8 md:p-12 rounded-[2rem] flex flex-col justify-between h-full group overflow-hidden transition-colors duration-700
        ${isDark ? 'bg-charcoal text-base' : 'bg-white text-charcoal border border-neutral-100'}
        ${className}
      `}
    >
      {/* Hover Effect Background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 ${isDark ? 'bg-white' : 'bg-moss'}`} />

      <div className="relative z-10">
        {icon && (
          <div className={`mb-6 md:mb-12 opacity-60 group-hover:opacity-100 transition-opacity duration-500`}>
            {icon}
          </div>
        )}
        <span className={`text-xs md:text-sm tracking-widest uppercase font-medium mb-2 block ${isDark ? 'text-neutral-400' : 'text-moss'}`}>
          {subtitle}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight leading-tight">
          {title}
        </h3>
        <div className={`text-sm md:text-base leading-relaxed font-light ${isDark ? 'text-neutral-300' : 'text-neutral-500'}`}>
          {description}
        </div>
      </div>
    </div>
  );
};

/**
 * Main Application
 */
const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  const worksImages = [
    "/assets/work1.jpg",
    "/assets/work2.jpg",
    "/assets/work3.jpg",
    "/assets/work4.jpg",
    "/assets/work5.jpg",
    "/assets/work6.jpg",
    "/assets/work7.jpg",
    "/assets/work8.jpg",
  ];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % worksImages.length));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + worksImages.length) % worksImages.length));
  };

  return (
    <div id="top" className="min-h-screen bg-base font-sans text-charcoal antialiased selection:bg-moss selection:text-white overflow-x-hidden">
      
      {/* Custom Styles for animations not in Tailwind standard */}
      <style>{`
        @keyframes modalAppear {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-image-enter {
          animation: modalAppear 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 px-6 md:px-12 py-6 flex justify-between items-center ${scrolled ? 'bg-base/80 backdrop-blur-md border-b border-neutral-200/50' : ''}`}>
        <a href="#top" aria-label="サイトトップへ戻る" className="text-lg font-bold tracking-tighter hover:text-moss transition-colors">緑家 Ryocca</a>
        <a 
          href="#contact"
          className="text-xs font-bold tracking-widest uppercase hover:text-moss transition-colors duration-300"
        >
          お問い合わせ
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex flex-col justify-center px-6 md:px-12 pt-20 overflow-hidden">
        
        <FadeIn delay={200} className="relative z-10">
          <h1 className="text-[8vw] md:text-[7vw] font-bold leading-[1.2] tracking-tighter text-charcoal mb-8">
            時を、植える。<br />
            <span className="text-moss opacity-90">余白を、設える。</span>
          </h1>
        </FadeIn>

        <FadeIn delay={800} className="relative z-10 md:max-w-xl ml-auto md:mr-24 mt-8 md:mt-0">
          <p className="text-lg md:text-2xl font-light leading-relaxed text-neutral-600">
            The Scenery<br />
            Born from Dialogue.
            <span className="block mt-4 text-sm md:text-base text-neutral-400">
              四季の呼吸が聞こえる庭を、あなたと。
            </span>
          </p>
        </FadeIn>

        <div className="absolute bottom-12 left-6 md:left-12 z-10">
          <FadeIn delay={1200}>
            <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
              Based in Hyogo, Japan<br />
              Landscape Designer: Hiroki Oobuchi
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Philosophy Statement */}
      <section className="py-32 px-6 md:px-12 bg-white relative z-10">
        <FadeIn className="max-w-4xl mx-auto text-center">
          <span className="block mb-8 text-moss text-sm tracking-[0.2em] uppercase font-medium">Philosophy</span>
          <p className="text-3xl md:text-5xl font-serif font-medium leading-tight text-charcoal mb-12">
            庭は、眺めるだけの場所ではない。<br />
            そこは、心が深呼吸するための<br />
            「余白」である。
          </p>
          <p className="text-neutral-500 leading-loose font-light max-w-2xl mx-auto text-sm md:text-base">
             私たち緑家が創るのは、単なる造園ではありません。
             季節の移ろいを光で感じ、風の音で時を知る。
             そんな静謐な「体験」を、日々の暮らしに溶け込ませます。
             お客様一人ひとりの物語に寄り添い、10年、20年先の景色を見据えて。
          </p>
        </FadeIn>
      </section>

      {/* Bento Grid Services */}
      <section className="py-24 px-4 md:px-12 bg-base relative z-10">
        <div className="max-w-[1600px] mx-auto">
          <FadeIn className="mb-16 ml-2">
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-charcoal/10">
              Services
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(400px,auto)]">
            
            {/* Card 1: Maintenance (Top Left, Wide) */}
            <FadeIn className="md:col-span-2">
              <BentoCard
                subtitle="Maintenance｜お庭の手入れ・剪定・植栽"
                title="1本の樹木からでも丁寧に対応いたします。"
                description={
                  <div className="space-y-4">
                    <p className="text-neutral-500">
                      植木の剪定、植栽、造園、ガーデニング、害虫予防など、お客様の想いやご予算に合わせて最適なメンテナンスプランをご提案いたします。
                    </p>
                    <p className="text-neutral-500">
                      個人宅のお庭から店舗・施設の緑地管理まで、幅広くお任せください。
                    </p>
                    <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                      <span className="font-medium block mb-2 text-neutral-400">【対応エリア】</span>
                      西宮・宝塚・伊丹・芦屋・尼崎・川西を中心に、阪神間全域（神戸・大阪・明石 含む）で対応しています。<br />
                      地域に密着した造園業者として、お庭のお悩みや日々の手入れまで、どうぞお気軽にご相談ください。
                    </p>
                  </div>
                }
              />
            </FadeIn>

            {/* Card 2: Craftsmanship (Top Right, Standard) */}
            <FadeIn delay={200} className="md:col-span-1">
              <BentoCard
                subtitle="Craftsmanship"
                title="伝統と革新"
                description={
                  <div className="space-y-4 text-sm leading-relaxed text-neutral-500">
                    <p>
                      老舗造園店「宝塚三田盆栽（たからづかさんだぼんさい）」を継承し、1995年「緑家（りょっか）」 は生まれました。
                    </p>
                    <p>
                      受け継いだ実績や経験、心得をもとにお客様との対話から想いを丁寧に汲み取り、確かな技術で形にします。
                    </p>
                  </div>
                }
              />
            </FadeIn>

            {/* Card 3: Landscaping (Bottom Left, Wide) */}
            <FadeIn delay={300} className="md:col-span-2">
               <BentoCard
                subtitle="Landscaping"
                title="景観の質を維持"
                description={
                  <div className="space-y-4 text-sm leading-relaxed text-neutral-500">
                    <p>
                      庭を手入れする時間が取れない、どう剪定すれば良いのか分からないといったお悩みは、多数寄せられています。
                    </p>
                    <p>
                      まずはご相談ください。お客様のご要望やお庭の現在の状態を詳しくお伺いし、最適な管理方法をアドバイスさせていただきます。
                    </p>
                    <p>
                      弊社で管理をお引き受けする場合、たとえばきっちりとした景観を保つお庭であれば年に一度程度の定期管理をご提案しますが、自然な雰囲気を大切にした庭などは、数年に一度の剪定サイクルをご提案することもございます。
                    </p>
                    <p>
                      年間を通した定期管理だけでなく、「この時期だけ」「この木だけ」といった必要な時のみのスポット対応も承っております。
                      お客様の理想と現実的なお手入れのバランスを考慮し、最適なご提案をいたします。
                    </p>
                  </div>
                }
              />
            </FadeIn>

            {/* Card 4: Campaign (Bottom Right, Standard) */}
            <FadeIn delay={400} className="md:col-span-1">
              <div className="relative p-8 md:p-12 rounded-[2rem] flex flex-col justify-center h-full bg-moss text-white overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Leaf className="w-24 h-24" />
                </div>
                <span className="text-xs tracking-widest uppercase font-medium mb-4 text-white/70">
                  Special Offer
                </span>
                <h3 className="text-2xl font-bold mb-4">
                  ご新規様・ご紹介特典
                </h3>
                <p className="text-sm text-white/80 leading-relaxed mb-8">
                  ご紹介キャンペーン実施中。<br />
                  ご紹介者様、被紹介者様ともに<br />
                  <span className="text-2xl font-bold text-white">10% OFF</span>
                </p>
                <div className="mt-auto pt-4 border-t border-white/20">
                  <p className="text-xs text-white/60">Web限定特典</p>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* Works Gallery */}
      <section className="py-24 px-4 md:px-12 bg-white relative z-10">
        <div className="max-w-[1600px] mx-auto">
           <FadeIn className="mb-16 ml-2">
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-charcoal/10">
              Works
            </h2>
          </FadeIn>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {worksImages.map((src, index) => (
              <FadeIn key={index} delay={index * 100} className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
                <div onClick={() => setSelectedIndex(index)} className="w-full h-full">
                  <img 
                    src={src} 
                    alt="Ryocca Garden Work" 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                     <span className="text-white/80 text-sm font-light tracking-widest uppercase border border-white/30 px-4 py-2 rounded-full">View</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal / Slideshow - Light Theme with Transparency */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop - Transparent Glass Effect */}
          <div 
            className="absolute inset-0 bg-white/60 backdrop-blur-md transition-opacity duration-500"
            onClick={() => setSelectedIndex(null)}
          />
          
          {/* Close Button */}
          <button 
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-neutral-500 hover:text-charcoal transition-colors z-[101] p-2 group"
          >
            <span className="sr-only">Close</span>
            <X className="w-8 h-8 md:w-10 md:h-10 stroke-1 group-hover:rotate-90 transition-transform duration-500" />
          </button>

          {/* Prev Button */}
          <button 
            onClick={handlePrev}
            className="absolute left-2 md:left-12 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-charcoal transition-colors z-[101] p-4 group hidden md:block"
          >
            <ChevronLeft className="w-10 h-10 md:w-16 md:h-16 stroke-[0.5] group-hover:-translate-x-2 transition-transform duration-300" />
          </button>
          
          {/* Next Button */}
          <button 
            onClick={handleNext}
            className="absolute right-2 md:right-12 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-charcoal transition-colors z-[101] p-4 group hidden md:block"
          >
            <ChevronRight className="w-10 h-10 md:w-16 md:h-16 stroke-[0.5] group-hover:translate-x-2 transition-transform duration-300" />
          </button>

          {/* Main Content */}
          <div className="relative z-[102] w-full h-full flex flex-col items-center justify-center p-4 md:p-8 pointer-events-none">
             {/* Image Wrapper */}
             <div className="relative max-w-full max-h-full pointer-events-auto">
                <img 
                  key={selectedIndex} // Triggers animation on change
                  src={worksImages[selectedIndex]} 
                  alt={`Works ${selectedIndex + 1}`} 
                  className="modal-image-enter max-w-full max-h-[85vh] md:max-h-[90vh] object-contain rounded-sm shadow-2xl"
                />
             </div>

             {/* Counter */}
             <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-neutral-500 font-mono text-xs md:text-sm tracking-[0.3em] z-50 select-none">
               {String(selectedIndex + 1).padStart(2, '0')} <span className="mx-2 text-neutral-400">/</span> {String(worksImages.length).padStart(2, '0')}
             </div>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <section className="py-24 px-6 md:px-12 bg-base border-t border-neutral-200/50 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-24">
          {/* Profile Image */}
          <FadeIn className="w-full md:w-1/3 shrink-0">
             <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-neutral-200">
              <img 
                src="/assets/profile.jpg" 
                alt="Hiroki Oobuchi" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
             </div>
          </FadeIn>
          
          {/* Profile Text */}
          <FadeIn delay={200} className="flex-1 py-4">
            <span className="text-moss text-xs font-bold tracking-widest uppercase mb-6 block">
              Representative
            </span>
            <h2 className="text-4xl font-serif font-medium mb-2 text-charcoal">
              大淵 弘揮
            </h2>
            <p className="text-sm text-neutral-400 tracking-widest uppercase mb-10">
              Hiroki Oobuchi
            </p>
            
            <div className="space-y-8 text-neutral-600 leading-loose font-light text-justify">
              <p>
                老舗造園店「宝塚三田盆栽（たからづかさんだぼんさい）」を継承し、1995年「緑家（りょっか）」 は生まれました。
              </p>
              <p>
                庭は、完成した瞬間からその家と共に育っていくものです。<br />
                時を経るほどに愛着が深まり、自然と笑顔がこぼれる。<br />
                私たちは、そんな「空間」と「時間」をつくりたいと考えています。
              </p>
              <p>
                受け継いだ実績や経験、心得をもとにお客様との対話から想いを丁寧に汲み取り、確かな技術で形にします。
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-neutral-200">
               {/* Removed quote as requested */}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Area Info - Minimal List */}
      <section className="py-24 px-6 md:px-12 bg-base flex flex-col md:flex-row items-start md:items-center justify-between border-b border-neutral-100 relative z-10">
        <FadeIn>
          <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-4">
            Service Area
          </h3>
          <p className="text-2xl md:text-3xl font-light text-charcoal leading-snug">
            兵庫県 阪神エリアを中心に活動中。<br />
            <span className="text-base text-neutral-500 block mt-2">
              西宮・宝塚・伊丹・尼崎・芦屋・川西・神戸・大阪・明石に対応しています。
            </span>
            <span className="text-sm text-neutral-500 block mt-2">
              ご要望に応じて、上記以外の地域への出張も可能です。これまでに県外での施工実績もあり、遠方のご依頼にも柔軟に対応いたします。
            </span>
          </p>
        </FadeIn>
        <FadeIn delay={200} className="mt-8 md:mt-0">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-neutral-400 shadow-sm">
             <span className="text-xs">H.O</span>
          </div>
        </FadeIn>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-charcoal text-base pt-32 pb-12 px-6 md:px-12 relative overflow-hidden z-10">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-[10vw] font-bold leading-none tracking-tighter text-neutral-800 mb-12 select-none">
              RYOCCA
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <FadeIn delay={200}>
              <p className="text-2xl font-light mb-8 text-white">
                庭のご相談、お見積もりは無料です。<br />
                まずはお話をお聞かせください。
              </p>
              <div className="flex flex-col space-y-6">
                <a href="tel:08014918423" className="flex items-center group">
                  <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center group-hover:bg-moss group-hover:border-moss transition-all duration-300 mr-4 text-white">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-xl md:text-2xl font-medium text-neutral-300 group-hover:text-white transition-colors">
                    080-1491-8423
                  </span>
                </a>
                <a href="mailto:ryocca.ryocca@gmail.com" className="flex items-center group">
                  <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center group-hover:bg-moss group-hover:border-moss transition-all duration-300 mr-4 text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-xl md:text-2xl font-medium text-neutral-300 group-hover:text-white transition-colors">
                    ryocca.ryocca@gmail.com
                  </span>
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={400} className="flex flex-col justify-between">
              <div className="space-y-2 text-neutral-400 text-sm font-mono">
                <p>Office Hours: 8:00 - 17:30</p>
                <p>Representative: Hiroki Oobuchi</p>
                <a href="https://www.instagram.com/ryocca.ryocca/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-moss transition-colors w-fit">
                  Instagram <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </div>
              
              <div className="mt-12 md:mt-0 text-neutral-600 text-xs">
                &copy; {new Date().getFullYear()} Ryocca Landscaping. All rights reserved.
              </div>
            </FadeIn>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;