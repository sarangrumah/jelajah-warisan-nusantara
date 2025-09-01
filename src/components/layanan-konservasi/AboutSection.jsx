
const AboutSection = () => {
  return (
    <section className='py-20 bg-gradient-to-b from-background to-card'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16x scroll-reveal">
          <h2 className="text-4xl md:text-4xl font-bold mb-6x text-heritage-gradient p-5">
            Tentang Museum & Cagar Budaya
          </h2>
        </div>
      </div>
      {/* <article className='text-2xl text-muted-foreground leading-10x my-10 max-md:max-w-full max-md:text-lg p-5'> */}
      <div className="space-y-6 text-xl text-muted-foreground mx-autox leading-relaxed p-5">
        <p>
          Museum & Cagar Budaya (Indonesian Heritage Agency) merupakan Badan Layanan Umum (BLU) di bawah naungan
          Kementerian Kebudayaan Republik Indonesia yang saat ini bertanggung jawab atas pengelolaan 19 museum dan
          galeri serta 34 situs cagar budaya nasional di Indonesia. Terbentuk pada tahun 2022 dan diresmikan menjadi
          BLU per tanggal 1 September 2023. Museum & Cagar Budaya memiliki visi untuk menjadi institusi yang bersifat kolaboratif dan
          mendorong daya cipta, perubahan sosial, serta pembangunan masyarakat yang berbudaya.
        </p>
        <p>
          Museum & Cagar Budaya mengedepankan peningkatan pelayanan yang berbasis perlindungan sebagai prioritas utama. Dengan merangkul
          kreativitas dan mengusung semangat kolaborasi yang inklusif, dan secara kolektif berkontribusi untuk membuka
          wawasan apresiasi mendalam terhadap warisan budaya Indonesia yang beragam.
        </p>
      </div>
      {/* </article> */}
    </section>
  )
}

export default AboutSection
