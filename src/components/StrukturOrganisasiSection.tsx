import React from 'react'

const StrukturOrganisasiSection = () => {
  return (
    <main className='py-20 w-full flex flex-col items-center'>
        <div className="container mx-auto px-4 scroll-reveal">
            <div className="text-center scroll-reveal">
                <h2 className="text-4xl md:text-5xl font-bold pb-6 text-heritage-gradient">
                    Struktur Organisasi
                </h2>
            </div>
            <section className='w-full flex justify-center mt-5x max-md:mt-10' aria-label='Organizational chart'>
                <img
                src='/src/assets/struktur-organisasi/struktur_organisasi.jpg'
                alt='Struktur Organisasi MBC - Organizational chart showing the complete hierarchy and structure of the organization'
                className='object-contain w-full self-stretch max-md:max-w-full mt-5'
                />
            </section>
        </div>
    </main>
  )
}

export default StrukturOrganisasiSection