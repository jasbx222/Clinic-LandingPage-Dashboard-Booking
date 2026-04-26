import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchServices, fetchDoctors } from '../services/publicApi';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Heart, Star, ShieldCheck, Sparkles, ArrowLeft, User, Calendar, CheckCircle2 } from 'lucide-react';
import { LoadingSkeleton } from '../../../components/ui/LoadingSkeleton';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['public-services'],
    queryFn: fetchServices,
  });
  
  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ['public-doctors'],
    queryFn: fetchDoctors,
  });

  return (
    <div className="bg-bg-main min-h-screen blob-bg overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-right z-10"
            >
              <Badge className="mb-8 px-5 py-2 text-sm bg-secondary-light text-secondary rounded-full inline-flex items-center gap-2 font-bold shadow-soft">
                <Sparkles size={18} className="text-secondary" /> عيادة متخصصة للمرأة العصرية
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-text-primary leading-[1.1] mb-8 tracking-tighter">
                رعايتك برقة،<br />
                <span className="text-transparent bg-clip-text gradient-pink-blue">وجمالك بثقة.</span>
              </h1>
              <p className="text-xl text-text-secondary mb-10 max-w-xl leading-relaxed font-medium">
                نقدم لكِ تجربة طبية فريدة تجمع بين الخبرة الطبية العالية واللمسات الجمالية الراقية، في بيئة هادئة مصممة لراحتكِ التامة.
              </p>
              <div className="flex flex-wrap gap-5">
                <Button size="lg" variant="gradient" className="rounded-2xl px-10 h-16 text-lg group" onClick={() => navigate('/book-appointment')}>
                  احجزي موعدك الآن 
                  <ArrowLeft className="mr-3 w-6 h-6 group-hover:-translate-x-2 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-2xl px-10 h-16 text-lg bg-white/50 backdrop-blur-sm" onClick={() => navigate('/services')}>
                  تصفح الخدمات
                </Button>
              </div>

              <div className="mt-16 flex flex-wrap gap-8 items-center">
                <div className="flex items-center gap-3 text-text-primary font-bold"><ShieldCheck className="text-accent" size={24} /> طاقم طبي معتمد</div>
                <div className="flex items-center gap-3 text-text-primary font-bold"><Star className="text-primary" size={24} /> +5000 مراجعة سعيدة</div>
                <div className="flex items-center gap-3 text-text-primary font-bold"><Heart className="text-primary-dark" size={24} /> خصوصية تامة</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-hover border-8 border-white/50">
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" 
                  alt="Clinic" 
                  className="w-full h-[600px] object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-hover z-20 flex items-center gap-5 border border-border animate-bounce-slow">
                <div className="w-16 h-16 rounded-2xl gradient-pink-blue flex items-center justify-center text-white shadow-soft">
                  <Calendar size={32} />
                </div>
                <div>
                  <p className="text-text-muted text-sm font-bold">المواعيد المتاحة</p>
                  <p className="text-text-primary text-xl font-black">اليوم 04:00 م</p>
                </div>
              </div>
              <div className="absolute top-20 -left-10 bg-white p-6 rounded-3xl shadow-hover z-20 flex items-center gap-4 border border-border">
                <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center text-accent">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-text-primary font-bold">دفع إلكتروني آمن</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-right mb-20">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 font-bold">خدماتنا المتميزة</Badge>
            <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight leading-tight">
              نعتني بكل تفاصيل<br /> <span className="text-primary">صحتكِ وجمالكِ</span>
            </h2>
            <p className="text-text-secondary max-w-2xl text-xl leading-relaxed font-medium">مجموعة مختارة بعناية من أحدث التقنيات الطبية والجمالية لتمنحكِ النتائج التي تحلمين بها.</p>
          </div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[1, 2, 3].map(i => <LoadingSkeleton key={i} className="h-80 rounded-[2.5rem]" />)}
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {services?.slice(0, 6).map(service => (
                <motion.div key={service.id} variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                }}>
                  <Card className="premium-card p-10 h-full flex flex-col group cursor-pointer" onClick={() => navigate(`/book-appointment`)}>
                    <div className="w-20 h-20 rounded-[2rem] gradient-soft flex items-center justify-center text-primary mb-8 group-hover:gradient-pink-blue group-hover:text-white transition-all duration-500 shadow-soft">
                      <Sparkles size={36} />
                    </div>
                    <h3 className="text-2xl font-black text-text-primary mb-4 group-hover:text-primary transition-colors">{service.name}</h3>
                    <p className="text-text-secondary mb-8 leading-relaxed font-medium flex-grow">{service.description}</p>
                    <div className="flex justify-between items-center pt-6 border-t border-border">
                      <div className="flex flex-col">
                        <span className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">يبدأ من</span>
                        <span className="text-2xl font-black text-text-primary">{service.price} <span className="text-sm font-bold text-primary">د.ع</span></span>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-2xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500">حجز سريع</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-bg-soft relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'طبيبة مختصة', val: '+25', icon: <User className="text-primary" /> },
              { label: 'مراجعة سنوية', val: '+10k', icon: <Heart className="text-primary-dark" /> },
              { label: 'سنوات خبرة', val: '15', icon: <Star className="text-secondary" /> },
              { label: 'فرع حول المملكة', val: '04', icon: <ShieldCheck className="text-accent" /> },
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-soft">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center mx-auto mb-6 text-primary">
                  {stat.icon}
                </div>
                <h4 className="text-4xl font-black text-text-primary mb-2 tracking-tighter">{stat.val}</h4>
                <p className="text-text-secondary font-bold text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="gradient-pink-blue rounded-[4rem] p-16 md:p-24 text-white text-center shadow-hover relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-dark/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl border border-white/30">
                <Heart size={48} className="text-white fill-white animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">كوني جزءاً من<br /> عائلتنا الصحية اليوم</h2>
              <p className="text-white/90 text-xl md:text-2xl mb-12 font-medium leading-relaxed">نعدكِ برعاية تفوق توقعاتكِ، في مكان يشبهكِ تماماً.</p>
              <Button size="lg" className="bg-white text-primary hover:bg-bg-soft rounded-[2rem] px-12 h-20 text-2xl font-black shadow-2xl hover:scale-105 text-white transition-all" onClick={() => navigate('/book-appointment')}>
                احجزي موعدكِ الأول الآن
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-12 text-center text-text-muted font-bold text-sm">
        <p>© 2025 ديفاميد للرعاية الطبية النسائية. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
