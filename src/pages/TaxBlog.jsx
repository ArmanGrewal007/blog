import BlogLayout from "@/components/BlogLayout";

function TaxBlog() {
  return (
    <BlogLayout title="Old vs New Tax Regime Comparison - FY25-26">

      <p>
        As the Indian government gradually moves toward phasing out the Old Tax Regime,
        I wanted to understand whether the Old Regime is still beneficial at certain
        salary levels.
      </p>
      <br/>
      <p>
        The results show that for salaried professionals, the New Tax Regime is
        <strong> always</strong> more advantageous.
      </p>

      <div className="flex justify-center mt-8">
        <iframe
          src="/taxviz/chart.html"
          height="500"
          title="Tax Visualizer"
          className="w-full rounded-lg border border-gray-200 shadow-md"
        />
      </div>

    </BlogLayout>
  );
}

export default TaxBlog;
