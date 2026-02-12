function TaxViz() {
  return (
    <>
      <div className="text-center mt-10">
        <h1 className="text-2xl sm:text-4xl font-bold mb-5">
          Blog
        </h1>

        {/* Interactive chart is already there */}
        <div className="flex justify-center">
          <iframe
            src="/taxviz/chart.html"
            width="50%"
            height="800"
            title="Tax Visualizer"
            className="border-0"
          />
        </div>
      </div>
    </>
  );
}

export default TaxViz;
