export default function BlurryBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none bg-background">
      {/* Blob 1: Complex border radius */}
      <div
        className="absolute w-40 h-20 dark:bg-[#040d1278] bg-[#FFFBDE] blur-xl animate-blob-slow"
        style={{
          top: "10%",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        }}
      ></div>

      {/* Blob 2: Different complex border radius */}
      <div
        className="absolute w-42 h-42 dark:bg-[#040d1262] bg-[#FFFBDE] blur-xl animate-blob-medium"
        style={{
          bottom: "10%",
          right: "5%",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        }}
      ></div>

      {/* Blob 3: Yet another complex border radius */}
      <div
        className="absolute w-3/5 h-1/2 dark:bg-[#183D3D] bg-[#99bc85e9] blur-[100px] animate-blob-fast"
        style={{
          top: "60%",
          borderRadius: "40% 60% 60% 40% / 70% 30% 70% 30%",
        }}
      ></div>

      {/* Blob 4: Elliptical shape */}
      <div
        className="absolute w-1/2 h-1/3 dark:bg-[#005b4191] bg-[#C1CFA1] blur-[100px] animate-blob-medium"
        style={{
          top: "70%",
          right: "15%",
          borderRadius: "50% / 60%",
        }}
      ></div>
    </div>
  );
}
