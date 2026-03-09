'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-light/80 to-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center">
        <motion.div
          className="flex-1 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={itemVariants} className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark">Glow with Juls</motion.p>
          <motion.h1 variants={itemVariants} className="font-display text-4xl leading-tight text-charcoal md:text-5xl">
            Beauty products you can trust, delivered anywhere in Ghana.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-base text-gray-600 md:text-lg">
            Shop wholesale and retail cosmetics with Mobile Money, card payments, and optional pay on delivery. Fast
            nationwide dispatch with real-time order tracking.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/shop">Browse shop</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Talk to beauty advisor</Link>
            </Button>
          </motion.div>
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <p className="text-2xl font-semibold text-brand-dark">4K+</p>
              <p>Orders fulfilled nationwide</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-brand-dark">24h</p>
              <p>Average dispatch in Accra</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-brand-dark">MoMo</p>
              <p>Mobile Money checkout first</p>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-1 justify-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative h-96 w-72 overflow-hidden rounded-[3rem] bg-white shadow-[0_30px_80px_rgba(199,104,160,0.25)]"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80')] bg-cover bg-center" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
