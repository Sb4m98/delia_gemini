import React from 'react';

const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className='bg-white p-6 rounded-xl shadow-md transition-transform duration-200 ease-in-out border border-brand-purple/10 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-brand-purple/10'>
        <h3 className='text-lg font-bold text-[#6600A9]'>{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
);

const HowItWorksStep: React.FC<{ step: string; title: string; description: string }> = ({ step, title, description }) => (
    <div className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xl">
            {step}
        </div>
        <h4 className="font-bold mb-2 text-lg text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);


const HomePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto text-center py-10 px-4">
        <div className="flex justify-center items-center mb-4 h-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" className="h-full w-auto">
                <rect x="10" y="10" width="50" height="50" transform="rotate(45 35 35)" className="fill-brand-purple"/>
                <text x="22" y="50" fontFamily="sans-serif" fontWeight="bold" fontSize="36" fill="white">D</text>
                <text x="70" y="50" fontFamily="sans-serif" fontWeight="bold" fontSize="36" className="fill-brand-purple">elia</text>
                <path d="M150 25 L160 25 L160 35" strokeWidth="2" fill="none" className="stroke-brand-purple"/>
                <circle cx="160" cy="35" r="2" className="fill-brand-purple"/>
            </svg>
        </div>
        <p className='text-lg text-gray-600 mb-12'>Document Enhanced Learning Intelligent Assistant</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left max-w-5xl mx-auto">
            <FeatureCard 
                title="📄 Analisi Documenti"
                description="Carica i tuoi PDF e ottieni analisi dettagliate sul contenuto, incluse statistiche su parole chiave e densità del vocabolario."
            />
            <FeatureCard 
                title="💬 Chat Intelligente"
                description="Interagisci con i tuoi documenti attraverso una chat AI avanzata che comprende il contesto e fornisce risposte precise."
            />
            <FeatureCard 
                title="📊 Visualizzazione Processi"
                description="Estrai i flussi di lavoro dai tuoi testi e visualizzali come grafi interattivi e di facile comprensione."
            />
        </div>

        <h2 className="text-center text-3xl font-bold text-gray-800 mb-12">Come Funziona</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
           <HowItWorksStep step="1" title="Carica" description="Carica i tuoi documenti PDF nel sistema" />
           <HowItWorksStep step="2" title="Analizza" description="Il sistema analizza e processa i contenuti" />
           <HowItWorksStep step="3" title="Interagisci" description="Chatta con i tuoi documenti e ottieni risposte" />
        </div>
    </div>
  );
};

export default HomePage;
