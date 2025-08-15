import React from 'react'

const ConservationSection = () => {
  return (
    <section className='pt-20 w-full max-md:max-w-full max-md:px-5'>
      <div className='flex gap-5 max-md:flex-col max-md:items-stretch'>
        <div className='w-[62%] max-md:w-full max-md:ml-0'>
          <article className='flex flex-col items-stretch font-bold max-md:max-w-full'>
            <h2 className='lg:text-4xl font-bold text-center max-md:max-w-full max-md:text-3xl'>Konservasi</h2>
            <div className='leading-7x max-md:max-w-full p-5'>
              <span className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed pt-5">
                Museum & Cagar Budaya (IHA/Indonesian Heritage Agency) berkomitmen untuk terus melestarikan sejarah
                dan kekayaan bangsa dengan melakukan perawatan berstandar internasional, yang didukung para tenaga
                ahli, pecinta museum dan sejarah, serta masyarakat. IHA melakukan konservasi koleksi dan cagar budaya
                dengan pendekatan keilmuan terpadu terhadap koleksi baik secara preventif maupun kuratif. Langkah yang
                telah dilaksanakan dengan melakukan pembenahan sistem data dan penyimpanan koleksi distorage,
                melakukan peningkatan keahlian tenaga pengelola, serta dukungan fasilitas dan teknologilaboratorium
                konservasi terkini.
              </span>
            </div>
          </article>
        </div>
        <div className='w-[38%] ml-5 max-md:w-full max-md:ml-0'>
          <div className='grow max-md:max-w-full p-5'>
            <img
              src='/src/assets/conservation/profil_lembaga3.png'
              alt='Conservation work in progress'
              className='aspect-[1.25] object-contain w-full max-md:max-w-full'
            />
            <div className='max-md:max-w-full'>
              <img
                src='/src/assets/conservation/profil_lembaga4.png'
                alt='Conservation laboratory'
                className='aspect-[1.25] object-contain w-full max-w-2xlx'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConservationSection