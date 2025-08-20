const PartnershipSection = () => {
  return (
    <section className='py-20 pr-px max-md:max-w-full max-md:p-5'>
      <div className='flex max-md:flex-col max-md:items-stretch'>
        <div className='w-2/5 max-md:w-full max-md:ml-0'>
          <article className='flex flex-col self-stretch items-stretch my-auto max-md:max-w-full max-md:mt-5'>
            <h2 className='lg:text-4xl font-bold text-center max-md:max-w-full max-md:text-3xl'>Kemitraan</h2>
            <div className='leading-7x w-full max-md:max-w-full px-5'>
              <p className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed pt-5'>
                Museum & Cagar Budaya (IHA/Indonesian Heritage Agency) mendorong perluasan kolaborasi bersama pengunjung
                dan pecinta warisan budaya, pemangku kepentingan dalam negeri, serta institusi mancanegara sebagai
                komitmen utama.
              </p>
            </div>
            <img
              src='/src/assets/conservation/partnership1.png'
              alt='Partnership collaboration'
              className='aspect-[1.22] object-contain w-full ps-5 pt-5 max-md:max-w-full max-md:ml-0'
            />
          </article>
        </div>
        <div className='w-3/5 ml-5 max-md:w-full max-md:ml-0 px-5'>
          <div className='flex flex-col font-normal leading-7 max-md:max-w-full'>
            <img
              src='/src/assets/conservation/partnership2.png'
              alt='Partnership activities'
              className='aspect-[1] object-contain self-center max-w-fullx'
            />
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed pt-5'>
              Guna mentransformasi mutu layanan, IHA mengelola, mengembangkan, dan mengoptimalkan kekayaan / aset secara
              profesional dengan prinsip pelestarian dan keberlanjutan. Kami turut membuka ruang kolaborasi melalui
              berbagai program studi & lokakarya serta inisiatif terobosan lainnya, hingga pembentukan sistem donasi.
              Mari berkolaborasi dengan IHA untuk menjadi bagian dari pelestari budaya bangsa.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PartnershipSection
