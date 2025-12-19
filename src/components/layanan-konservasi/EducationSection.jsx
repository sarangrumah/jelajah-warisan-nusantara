import React from 'react'
import education1 from '@/assets/conservation/education1.png'
import education2 from '@/assets/conservation/education2.png'

const EducationSection = () => {
  return (
    <section className='pt-10 w-full max-md:max-w-full max-md:px-5 px-5'>
      <div className='gap-5 flex max-md:flex-col max-md:items-stretch'>
        <div className='w-[38%] max-md:w-full max-md:ml-0'>
          <div className='grow max-md:max-w-full'>
            <img
              src={education1}
              alt='Educational program activities'
              className='aspect-[1.25] object-contain w-full max-md:max-w-full'
            />
            <img
              src={education2}
              alt='Public program engagement'
              className='aspect-[1.26] object-contain w-full mt-9 max-md:max-w-full'
            />
          </div>
        </div>
        <div className='w-[62%] ml-5 max-md:w-full max-md:ml-0'>
          <article className='flex flex-col items-stretchx max-md:max-w-full'>
            <h2 className='py-10 lg:text-4xl font-bold max-md:max-w-full max-md:text-3xl'>Edukasi & Program Publik</h2>
            <span className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Museum dan Cagar Budaya sepakat bahwa ilmu peradaban harus dapat disajikan
              dengan relevan dan inovatif sehingga muatan-muatan edukasi tersebut mampu melebur bersama kurikulum
              pendidikan formal. Selain itu, persiapan infrastruktur museum seperti ruang anak dan buku panduan museum
              turut menjadi program prioritas. Ikut serta melakukan perubahan besar pada program komunikasi yang selaras
              zaman dan informatif, serta rangkaian program publik luring agar mampu menciptakan ekosistem pendidikan
              sejarah budaya yang dapat dinikmati dan bermanfaat bagi seluruh kalangan.
            </span>
          </article>
        </div>
      </div>
    </section>
  )
}

export default EducationSection
