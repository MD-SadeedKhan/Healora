const Demo = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-6 font-['Sora',sans-serif] text-[#2A114B]">
          Watch Healora in Action
        </h1>
        <p className="text-lg text-[#334351] mb-8">
          See how Healora uses AI to provide personalized health insights in this short demo video.
        </p>
        {/* Placeholder for video - replace with actual video embed */}
        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">[Video Placeholder - Embed a demo video here]</p>
        </div>
      </div>
    </div>
  );
};

export default Demo;