import React from 'react'
import { useTranslate } from '@/hooks/useTranslate';

const ConservationSection = () => {
  const { translatedText: title } = useTranslate('Laboratorium Konservasi');
  const { translatedText: description } = useTranslate('Lab Konservasi Cagar Budaya Borobudur adalah pusat riset dan pelestarian yang didedikasikan untuk menjaga dan merawat warisan budaya dunia, Borobudur. Dengan menggabungkan teknologi modern dan teknik konservasi tradisional, kami berkomitmen untuk memastikan kelestarian candi ini untuk generasi yang akan datang. Kami terdiri dari tim ahli yang bekerja secara kolaboratif untuk melaksanakan penelitian, pemulihan, dan pelestarian struktur serta artefak yang ada di situs yang memiliki nilai sejarah dan budaya yang tinggi. Melalui kolaborasi ini, kami berusaha untuk menerapkan praktik terbaik dalam pelestarian warisan budaya. Kami juga berfokus pada inovasi dan penggunaan teknologi digital untuk mendokumentasikan dan memetakan situs sehingga informasi dan pengetahuan tentang Borobudur dapat diakses oleh generasi mendatang.');

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-6 pt-6 scroll-reveal">
        <div className="text-center mb-16x">
          <h2 className="text-4xl md:text-4xl font-bold text-heritage-gradient pb-3">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-8xl mx-autox px-6 pt-5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ConservationSection