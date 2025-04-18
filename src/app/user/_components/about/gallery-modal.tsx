import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  aboutData: any;
  activeImageIndex: number;
  setActiveImageIndex: (index: any) => void;
  setShowGalleryModal: (check: boolean) => void;
};

const GalleryModal = ({
  aboutData,
  activeImageIndex,
  setActiveImageIndex,
  setShowGalleryModal,
}: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="relative w-full max-w-3xl">
        <button
          onClick={() => setShowGalleryModal(false)}
          className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 hover:scale-110"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={
              `${process.env.NEXT_PUBLIC_BACKEND_URL}${aboutData.gallery[activeImageIndex]?.url}`
            }
            alt={
              aboutData.gallery[activeImageIndex]?.caption ||
              `Gallery image ${activeImageIndex + 1}`
            }
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={() =>
              setActiveImageIndex((prev) =>
                prev === 0 ? aboutData.gallery.length - 1 : prev - 1
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-white/40"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="text-center text-white">
            <p className="text-lg font-medium">
              {aboutData.gallery[activeImageIndex]?.caption ||
                `Gallery image ${activeImageIndex + 1}`}
            </p>
            <p className="text-sm text-gray-300">
              {activeImageIndex + 1} of {aboutData.gallery.length}
            </p>
          </div>

          <button
            onClick={() =>
              setActiveImageIndex((prev) =>
                prev === aboutData.gallery.length - 1 ? 0 : prev + 1
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-white/40"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {aboutData.gallery.map((image, index) => (
            <div
              key={index}
              onClick={() => setActiveImageIndex(index)}
              className={`relative h-16 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                activeImageIndex === index
                  ? "border-white"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.url}`}
              alt={image.caption || `Gallery thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
