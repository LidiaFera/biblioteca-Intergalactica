export default function Section({ title, children }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
        <span className="w-1 h-8 bg-purple-500 mr-3 rounded-full"></span>
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {children}
      </div>
    </section>
  )
}