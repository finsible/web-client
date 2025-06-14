export default function BlurryBlobs() {
  //   return (
  //     <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
  //       <div className="absolute w-30 h-30 rounded-full bg-[#2ee37d]/20 blur-xl animate-blob-fast">
  //       </div>
  //       <div
  //         className="absolute w-30 h-30 rounded-full bg-[#f4740b]/30 blur-xl animate-blob-medium"
  //         style={{ right: "0%" }}
  //       ></div>

  //       <div
  //         className="absolute w-30 h-30 rounded-full bg-[#ed6974]/30 blur-xl animate-blob-fast"
  //         style={{ top: "60%", right: "0%" }}
  //       ></div>
  //       <div
  //         className="absolute w-30 h-30 rounded-full bg-[#51dff5]/30 blur-xl animate-blob-medium"
  //         style={{ top: "60%", right: "60%" }}
  //       ></div>
  //     </div>
  //   );
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
        className="absolute w-36 h-26 dark:bg-[#183D3D] bg-[#99bc85e9] blur-xl animate-blob-fast"
        style={{
          top: "60%",
          borderRadius: "40% 60% 60% 40% / 70% 30% 70% 30%",
        }}
      ></div>

      {/* Blob 4: Elliptical shape */}
      <div
        className="absolute w-46 h-30 dark:bg-[#005b4191] bg-[#C1CFA1] blur-xl animate-blob-medium"
        style={{
          top: "70%",
          right: "15%",
          borderRadius: "50% / 60%",
        }}
      ></div>
    </div>
  );
}
